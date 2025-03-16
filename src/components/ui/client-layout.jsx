"use client"; // Ensure this is a client component

import { useState } from "react";
import Modal from "@/components/ui/modal";
import LoginForm from "@/app/login/page";
import SignUpForm from "@/app/signup/page";
import { Button } from "@/components/ui/button";
import Link from "next/link"; // Used for navigation

export default function ClientLayout({ children }) {
    const [modalContent, setModalContent] = useState(null);
    const closeModal = () => setModalContent(null);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Navigation bar */}
            <header className="bg-[#6E3061] text-white p-4 shadow-md fixed top-0 left-0 w-full z-[999]">
                <div className="container mx-auto flex justify-between items-center">
                    {/* Left side logo */}
                    <div className="flex items-center space-x-4">
                        <img src="/headerLogo1.png" alt="WCUPA Logo" className="h-10" />
                        <h1 className="text-xl font-bold">WCUPA Degree Visualizer</h1>
                    </div>

                    {/* Center navigation menu */}
                    <nav className="navbar hidden md:flex space-x-6 text-lg">
                        <Link href="/" className="hover:text-secondary transition">Home</Link>
                        <Link href="/courses" className="hover:text-secondary transition">Courses</Link>
                        <Link href="/dashboard" className="hover:text-secondary transition">Dashboard</Link>
                        <Link href="/contact" className="hover:text-secondary transition">Contact</Link>
                    </nav>

                    {/* Right side Login / Sign Up buttons */}
                    <div className="flex space-x-4">
                        <Button variant="outline" onClick={() => setModalContent(<LoginForm onClose={closeModal} />)}>
                            Login
                        </Button>
                        <Button onClick={() => setModalContent(<SignUpForm onClose={closeModal} />)}>
                            Sign Up
                        </Button>
                    </div>
                </div>
            </header>

            {/* Page content */}
            <div className="flex flex-1">
                <main className="flex-1 p-6 overflow-auto">{children}</main>
            </div>

            {/* Footer */}
            <footer className="bg-[#6E3061] w-full h-10 flex items-center justify-center text-xs text-white fixed bottom-0 left-0 z-50 shadow-md">
                <p>&copy; {new Date().getFullYear()} WCUPA Degree Visualizer. All rights reserved.</p>
            </footer>

            {/* Modal component */}
            <Modal isOpen={modalContent !== null} onClose={closeModal}>
                {modalContent}
            </Modal>
        </div>
    );
}
