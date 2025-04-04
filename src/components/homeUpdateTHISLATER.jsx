"use client"; // Ensure this is a client component

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link"; // Used for navigation
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"; // Ensure DialogTrigger is imported
import { Moon, Sun } from "lucide-react"; // Import the icons
import { useTheme } from "next-themes"; // Import the useTheme hook

export default function ClientLayout({ children }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  // Close modals
  const closeModal = () => {
    setIsLoginOpen(false);
    setIsSignUpOpen(false);
  };

  // Theme toggle function
  const { setTheme, theme } = useTheme();

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation bar */}
      <header className="bg-[#6E3061] text-white p-4 shadow-md fixed top-0 left-0 w-full z-[999] dark:bg-[#6E3061]">
        <div className="container mx-auto flex justify-between items-center">
          {/* Left side logo */}
          <div className="flex items-center space-x-4">
            <img src="/headerLogo1.png" className="h-10" />
            <h1 className="text-xl font-bold">CSDegreeNavigator</h1>
          </div>

          {/* Center navigation menu */}
          <nav className="navbar hidden md:flex space-x-6 text-lg">
            <Link href="/" className="hover:text-secondary transition">
              Home
            </Link>
            <Link href="/courses" className="hover:text-secondary transition">
              Courses
            </Link>
            <Link href="/dashboard" className="hover:text-secondary transition">
              Dashboard
            </Link>
            <Link href="/contact" className="hover:text-secondary transition">
              Contact
            </Link>
          </nav>

          {/* Right side Login / Sign Up buttons */}
          <div className="flex items-center space-x-4">
            {/* Login Button and Modal */}
            <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
              <DialogTrigger asChild>
                <Button className="bg-yellow-500">Login</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Login</DialogTitle>
                  <DialogDescription>
                    Please enter your credentials to log in.
                  </DialogDescription>
                </DialogHeader>

                {/* Login Modal Content (No Functionality, Only Style) */}
                <div className="p-4">
                  <div className="mb-4">
                    <label className="block mb-2">Email:</label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2">Password:</label>
                    <input
                      type="password"
                      placeholder="Enter your password"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <Button variant="outline" className="w-full">
                    Submit
                  </Button>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={closeModal}>
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Sign Up Button and Modal */}
            <Dialog open={isSignUpOpen} onOpenChange={setIsSignUpOpen}>
              <DialogTrigger asChild>
                <Button>Sign Up</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Sign Up</DialogTitle>
                  <DialogDescription>
                    Create a new account by filling out the form below.
                  </DialogDescription>
                </DialogHeader>

                {/* Sign Up Modal Content (No Functionality, Only Style) */}
                <div className="p-4">
                  <div className="mb-4">
                    <label className="block mb-2">Full Name:</label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2">Email:</label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2">Password:</label>
                    <input
                      type="password"
                      placeholder="Create a password"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <Button variant="outline" className="w-full">
                    Sign Up
                  </Button>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={closeModal}>
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Theme Toggle Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </header>
      <div className="flex flex-1 justify-center items-center">
  <main className="p-6 max-w-xl w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg">
    {/* Static text inside the box */}
    <h2 className="text-2xl font-bold mb-4 text-center text-black dark:text-white">
      Welcome to CSDegreeNavigator!
    </h2>
    <p className="text-center text-black dark:text-white leading-relaxed mb-4">
    Navigate through our tools to assist you in viewing your progress and generating the best schedule for you!
    </p>

  </main>
</div>


      {/* Footer */}
      <footer className="bg-[#6E3061] w-full h-10 flex items-center justify-center text-xs text-white fixed bottom-0 left-0 z-50 shadow-md dark:bg-[#6E3061]">
        <p>&copy; {new Date().getFullYear()} CSDegreeNavigator. All rights reserved.</p>
      </footer>
    </div>
  );
}
