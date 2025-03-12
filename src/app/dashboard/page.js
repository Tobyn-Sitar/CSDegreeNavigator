import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>Dashboard - WCUPA Degree Visualizer</title>
        <meta name="description" content="Dashboard page for signed in users" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-[#6e3061] p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/headerLogo1.png"
              alt="Logo"
              width={100}
              height={100}
              className="rounded"
            />
            <h1 className="ml-2 text-xl font-bold text-white">
              WCUPA Degree Visualizer
            </h1>
          </div>
          {/* Navigation */}
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="/" className="text-white hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/courses" className="text-white hover:underline">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-white hover:underline">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white hover:underline">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-white hover:underline">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-white hover:underline">
                  Signup
                </Link>
              </li>
            </ul>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-grow p-8 bg-stone-50 text-black">
          <section className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Dashboard</h2>
            <p>
              This is where the dashboard will be displayed after signing in.
            </p>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-[#6e3061] p-4 text-center">
          <p className="text-white">
            &copy; {new Date().getFullYear()} WCUPA Degree Visualizer. All rights reserved.
          </p>
        </footer>
      </div>
    </>
  );
}
