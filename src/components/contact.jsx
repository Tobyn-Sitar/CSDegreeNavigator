"use client"; // Ensure this is a client component

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Used for navigation
import { Moon, Sun } from "lucide-react"; // Import the icons
import { useTheme } from "next-themes"; // Import the useTheme hook

export default function ContactForm({ children }) {
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
            <Button className="bg-yellow-500 text-[#6E3061] font-semibold" onClick={() => router.push("/login")}>
              Login
            </Button>

            {/* Sign Up Button */}
            <Button className="bg-yellow-500 text-[#6E3061] font-semibold" onClick={() => router.push("/signup")}>
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

      {/* Main Content */}
      <div className="flex flex-1 justify-center items-center mt-28 px-4">
        <main className="flex-grow bg-cover bg-center" style={{ backgroundImage: "url('/wcu01.jpg')" }}>
          <div className="flex items-center justify-center min-h-screen px-4 pt-24 pb-16">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-xl p-8 max-w-2xl w-full text-center">
              <h2 className="text-2xl font-bold mb-4 text-[#6E3061]">Contact Us</h2>
              <p className="text-sm text-gray-700 mb-6">
                Have questions or need assistance? Feel free to reach out to one of the team members!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 text-sm text-left text-gray-800">
                <p><strong>Drew:</strong> <a href="mailto:DS995982@wcupa.edu" className="text-blue-600 hover:underline">DS995982@wcupa.edu</a></p>
                <p><strong>Justin:</strong> <a href="mailto:JK1035193@wcupa.edu" className="text-blue-600 hover:underline">JK1035193@wcupa.edu</a></p>
                <p><strong>Muhammad:</strong> <a href="mailto:MA970103@wcupa.edu" className="text-blue-600 hover:underline">MA970103@wcupa.edu</a></p>
                <p><strong>Robert:</strong> <a href="mailto:RS1007120@wcupa.edu" className="text-blue-600 hover:underline">RS1007120@wcupa.edu</a></p>
                <p><strong>Tobyn:</strong> <a href="mailto:TS964228@wcupa.edu" className="text-blue-600 hover:underline">TS964228@wcupa.edu</a></p>
                <p><strong>Yanxi:</strong> <a href="mailto:YW1021529@wcupa.edu" className="text-blue-600 hover:underline">YW1021529@wcupa.edu</a></p>
              </div>
            </div>
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
