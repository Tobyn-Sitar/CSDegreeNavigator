import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

export default function Contact() {
  return (
    <>
      <Head>
        <title>Contact - WCUPA Degree Visualizer</title>
        <meta name="description" content="Contact WCUPA Degree Visualizer" />
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
            </ul>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-grow p-8 bg-stone-50 text-black">
          <section className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
            <p>
              If you have any questions or need further assistance, please reach out to us via email or phone.
            </p>
            <ul className="list-disc ml-6 mt-4">
              <li>
                Email:{" "}
                <a href="mailto:support@example.com" className="text-blue-500 hover:underline">
                  support@example.com
                </a>
              </li>
              <li>Phone: (123) 456-7890</li>
            </ul>
            <p className="mt-4">
              Alternatively, a contact form will be available here soon.
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
