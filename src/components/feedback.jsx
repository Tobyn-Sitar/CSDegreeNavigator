"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function FeedbackForm({ children }) {
  const router = useRouter();
  const { setTheme, theme } = useTheme();

  const [messages, setMessages] = useState([
    { name: "John", message: "This website is amazing!" },
    { name: "Jane", message: "I found the courses really helpful!" },
    { name: "Alice", message: "I love the layout of the site!" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const handleSubmit = () => {
    if (newMessage.trim()) {
      setMessages([{ name: "Anonymous", message: newMessage }, ...messages]);
      setNewMessage("");
      setShowModal(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen overflow-y-auto bg-white dark:bg-gray-900 pb-32">
      {/* Navigation */}
      <header className="bg-[#6E3061] text-white p-4 shadow-md fixed top-0 left-0 w-full z-[999] dark:bg-[#6E3061]">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img src="/headerLogo1.png" className="h-10" />
            <h1 className="text-xl font-bold">CSDegreeNavigator</h1>
          </div>
          <nav className="navbar hidden md:flex space-x-6 text-lg">
            <Link href="/">Home</Link>
            <Link href="/coursesTree">Courses</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/feedback">Feedback</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Button className="bg-yellow-500 text-[#6E3061] font-semibold" onClick={() => router.push("/login")}>Login</Button>
            <Button className="bg-yellow-500 text-[#6E3061] font-semibold" onClick={() => router.push("/signup")}>Sign Up</Button>
            <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 justify-center items-start pt-32 px-4">
        <main className="p-8 max-w-4xl w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg">
          <h2 className="text-3xl font-bold text-center text-black dark:text-white mb-6">
            Help us Improve while being <span className="font-bold underline">Anonymous</span>
          </h2>

          {/* Feedback Messages */}
          <div className="mt-8 space-y-6">
            {messages.map((msg, index) => (
              <div key={index} className="bg-[#f3f3f3] dark:bg-[#444444] text-black dark:text-white p-6 rounded-xl w-full shadow-md">
                <p className="font-semibold">{msg.name}:</p>
                <p>{msg.message}</p>
              </div>
            ))}
          </div>

          {/* Feedback Modal Trigger */}
          <div className="mt-6 text-center">
            <Button className="bg-yellow-500 text-[#6E3061] font-semibold p-3 rounded-lg" onClick={() => setShowModal(true)}>
              Give Feedback
            </Button>
          </div>
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-sm flex justify-center items-center z-[9999]">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-[90%] max-w-md shadow-xl">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Leave Anonymous Feedback</h3>
            <textarea
              rows={4}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full border rounded-md p-2 text-black dark:text-white dark:bg-gray-800"
              placeholder="Type your feedback here..."
            ></textarea>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button className="bg-yellow-500 text-[#6E3061] font-semibold" onClick={handleSubmit}>Submit</Button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#6E3061] w-full h-10 flex items-center justify-center text-xs text-white fixed bottom-0 left-0 z-50 shadow-md dark:bg-[#6E3061]">
        <p>&copy; {new Date().getFullYear()} CSDegreeNavigator. All rights reserved.</p>
      </footer>
    </div>
  );
}