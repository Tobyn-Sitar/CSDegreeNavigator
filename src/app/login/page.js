"use client"; 

import * as React from "react";
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

  const handleThemeToggle = () => {
    // Toggle between light and dark theme
    setTheme(theme === "dark" ? "light" : "dark");
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
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Login</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default LoginForm;
