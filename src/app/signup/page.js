"use client";

import Head from "next/head";
import Link from "next/link";
import Image from "next/image"; 
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Signup submitted", { email, password });
    alert("Signed up (dummy functionality)");
    router.push("/login"); 
  };

  return (
    <>
      <Head>
        <title>Signup - WCUPA Degree Visualizer</title>
        <meta name="description" content="Signup for WCUPA Degree Visualizer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-col">
        { }
        <header className="bg-[#6e3061] p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/headerLogo1.png"
              alt="Logo"
              width={100}
              height={100}
              className="rounded"
            />
            <h1 className="ml-2 text-xl font-bold text-white">WCUPA Degree Visualizer</h1>
          </div>

          <nav>
            <ul className="flex space-x-4">
              <li><Link href="/" className="text-white hover:underline">Home</Link></li>
              <li><Link href="/courses" className="text-white hover:underline">Courses</Link></li>
              <li><Link href="/dashboard" className="text-white hover:underline">Dashboard</Link></li>
              <li><Link href="/contact" className="text-white hover:underline">Contact</Link></li>
              <li><Link href="/login" className="text-white hover:underline">Login</Link></li>
              <li><Link href="/signup" className="text-white hover:underline">Signup</Link></li>
            </ul>
          </nav>
        </header>

        { }
        <main className="flex-grow p-8 bg-stone-50 text-black">
          <section className="max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label>
                Email:
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border rounded w-full p-2 mt-1"
                  required
                />
              </label>
              <label>
                Password:
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border rounded w-full p-2 mt-1"
                  required
                />
              </label>
              <label>
                Confirm Password:
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border rounded w-full p-2 mt-1"
                  required
                />
              </label>
              <button
                type="submit"
                className="bg-green-500 text-white rounded p-2 hover:bg-green-600"
              >
                Signup
              </button>
            </form>
          </section>
        </main>

        {}
        <footer className="bg-[#6e3061] p-4 text-center">
          <p className="text-white">
            &copy; {new Date().getFullYear()} WCUPA Degree Visualizer. All rights reserved.
          </p>
        </footer>
      </div>
    </>
  );
}
