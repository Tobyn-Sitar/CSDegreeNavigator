"use client"; // Ensure this is a client component

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Used for navigation
import { Moon, Sun } from "lucide-react"; // Import the icons
import { useTheme } from "next-themes"; // Import the useTheme hook

export default function FeedbackForm({ children }) {
  const router = useRouter();
  const { setTheme, theme } = useTheme();

  // State to manage feedback messages
  const [messages, setMessages] = useState([
    { name: "John", message: "This website is amazing!" },
    { name: "Jane", message: "I found the courses really helpful!" },
    { name: "Alice", message: "I love the layout of the site!" }
  ]);

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
            <Link href="/coursesTree" className="hover:text-secondary transition">
              Courses
            </Link>
            <Link href="/contact" className="hover:text-secondary transition">
              Contact
            </Link>
            <Link href="/feedback" className="hover:text-secondary transition">
              Feedback
            </Link>
          </nav>

          {/* Right side Login / Sign Up buttons */}
          <div className="flex items-center space-x-4">
            <Button className="bg-yellow-500" onClick={() => router.push("/login")}>
              Login
            </Button>
            <Button onClick={() => router.push("/signup")}>Sign Up</Button>
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
        <main className="p-8 max-w-4xl w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg">
          {/* Feedback Title */}
          <h2 className="text-3xl font-bold text-center text-black dark:text-white mb-6">
          Help us Improve while being <span className="font-bold underline">Anonymous</span>
          </h2>

          {/* Feedback Messages Box */}
          <div className="mt-8">
            <div className="space-y-6">
              {messages.map((msg, index) => (
                <div key={index} className="flex flex-col items-start space-y-3">
                  <div className="bg-[#f3f3f3] dark:bg-[#444444] text-black dark:text-white p-6 rounded-xl w-full max-w-4xl shadow-md">
                    <p className="font-semibold">{msg.name}:</p>
                    <p>{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Feedback Button */}
          <div className="mt-6 text-center">
            <Button className="bg-blue-500 text-white p-3 rounded-lg" >
              Give Feedback
            </Button>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-[#6E3061] w-full h-10 flex items-center justify-center text-xs text-white fixed bottom-0 left-0 z-50 shadow-md dark:bg-[#6E3061]">
        <p>&copy; {new Date().getFullYear()} CSDegreeNavigator. All rights reserved.</p>
      </footer>
    </div>
  );
}
