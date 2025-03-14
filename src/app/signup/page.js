"use client"; // Ensure it's rendered client-side

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
import { Toggle } from "@/components/ui/toggle"; // Import the Toggle component
import { useTheme } from "next-themes"; // Import useTheme for theme switching
import { Moon, Sun } from "lucide-react"; // Import icons for light and dark modes

export default function SignUpForm() {
  // Theme management from next-themes
  const { setTheme, theme } = useTheme();

  // State for form fields
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    graduation: ""
  });

  // State for feedback message
  const [message, setMessage] = useState("");

  // Handle theme toggle
  const handleThemeToggle = () => {
    // Toggle between light and dark theme
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
    <div
      className={`flex justify-center items-center min-h-screen relative ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-100"
      }`} // Change background based on theme
    >
      {/* Toggle Button for Theme */}
      <div className="absolute top-4 right-4">
        <Toggle
          aria-label="Toggle theme"
          onClick={handleThemeToggle} // Handle the theme toggle on click
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5 text-yellow-500" />
          ) : (
            <Moon className="h-5 w-5 text-gray-400" />
          )}
        </Toggle>
      </div>

      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create a new account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              {/* Display feedback message */}
              {message && <p>{message}</p>}
              {/* First Name */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Last Name Field */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email Field */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password Field */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Confirm Password Field */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* Graduation (optional field) */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="graduation">Graduation</Label>
                <Input
                  id="graduation"
                  type="text"
                  placeholder="e.g., Jan 2023"
                  value={formData.graduation}
                  onChange={handleChange}
                />
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
      </Card>
    </div>
  );
}
