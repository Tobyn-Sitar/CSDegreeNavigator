"use client"; 

import * as React from "react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
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
import { useTheme } from "next-themes"; // Import useTheme for theme switching
import { Moon, Sun } from "lucide-react"; // Import icons for light and dark modes
import { Toggle } from "@/components/ui/toggle"; // Import the Toggle component

export function LoginForm() {
  const { setTheme, theme } = useTheme(); // Use the `next-themes` hook to manage themes
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleThemeToggle = () => {
    // Toggle between light and dark theme
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res.error) {
        setError("Invalid Credentials");
        return;
      }

      router.replace("dashboard");
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div
      className={`flex justify-center items-center min-h-screen relative ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-100"
      }`} // Conditional background based on theme
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
          <CardTitle>Login</CardTitle>
          <CardDescription>Access your account with your credentials.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              {/* Email Field */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} // Update email state
                />
              </div>

              {/* Password Field */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} // Update password state
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
                  {error}
                </div>
              )}
            </div>

            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button">Cancel</Button>
              <Button type="submit">Login</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginForm;