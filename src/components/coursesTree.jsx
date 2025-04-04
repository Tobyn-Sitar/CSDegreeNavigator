"use client"; 

import { useRouter } from "next/navigation";
import { Moon, Sun } from "lucide-react"; // Import the icons
import { useTheme } from "next-themes"; // Import the useTheme hook
import { Button } from "@/components/ui/button"; // Ensure Button component exists
import ExpandedTree from "@/components/expandedTree"; // Import the ExpandedTree component
import Link from "next/link"; // Used for navigation

export default function TreePage() {
  const router = useRouter();

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
            {/* Login Button */}
            <Button className="bg-yellow-500" onClick={() => router.push("/login")}>
              Login
            </Button>

            {/* Sign Up Button */}
            <Button onClick={() => router.push("/signup")}>
              Sign Up
            </Button>

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

      {/* Content Area for the Tree Diagram */}
      <div className="flex flex-1 justify-center items-center">
        <main className="p-6 max-w-full w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg">
          <ExpandedTree /> {/* Call the ExpandedTree component */}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-[#6E3061] w-full h-10 flex items-center justify-center text-xs text-white fixed bottom-0 left-0 z-50 shadow-md dark:bg-[#6E3061]">
        <p>&copy; {new Date().getFullYear()} CSDegreeNavigator. All rights reserved.</p>
      </footer>
    </div>
  );
}
