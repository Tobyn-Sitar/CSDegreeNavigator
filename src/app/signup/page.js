"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function SignUpForm({ onClose }) {
  const { setTheme, theme } = useTheme();

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Handle changes in the form inputs
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation: check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    // Prepare payload according to your schema
    // The backend expects keys with spaces ("First Name", etc.)
    const payload = {
      "First Name": formData.firstName,
      "Last Name": formData.lastName,
      "Email": formData.email,
      "Password": formData.password,
      "Graduation": formData.graduation,
      // You can leave these fields as default or pre-populate empty objects
      "taken": {
        fye: {},
        core: {},
        communication: {},
        mathematics: {},
        science: {},
        large_scale: {}
      },
      "requirements_satisfied": {
        core: false,
        communication: false,
        mathematics: false,
        science: false,
        large_scale: false
      },
      "progress": { classes_completed: 0, total_credits: 0 },
      "degree_completion": false
    };

    try {
      // Send a POST request to your backend endpoint
      const res = await fetch("http://localhost:8000/api/insert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Signup successful!");
        // Optionally, clear the form:
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          graduation: ""
        });
      } else {
        setMessage("Signup failed: " + (data.error || "Unknown error."));
      }
    } catch (error) {
      console.error("Signup error:", error);
      setMessage("An error occurred during signup.");
    }
  };

  return (
    <div className="relative w-full max-w-sm">
      {/* Toggle Theme Button */}
      <div className="absolute top-2 right-2">
        <Toggle aria-label="Toggle theme" onClick={handleThemeToggle}>
          {theme === "dark" ? (
            <Sun className="h-5 w-5 text-yellow-500" />
          ) : (
            <Moon className="h-5 w-5 text-gray-400" />
          )}
        </Toggle>
      </div>

      {/* Sign Up Card */}
      <Card>
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create a new account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" type="text" placeholder="Enter your first name" />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" type="text" placeholder="Enter your last name" />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Enter your password" />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" placeholder="Confirm your password" />
              </div>
            </div>
            <CardFooter className="flex justify-between mt-4">
              <Button variant="outline" type="button">
                Cancel
              </Button>
              <Button type="submit">Sign Up</Button>
            </CardFooter>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button>Sign Up</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
