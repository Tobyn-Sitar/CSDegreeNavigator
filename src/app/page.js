import Head from "next/head";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Head>
        <title>WCUPA Degree Visualizer</title>
        <meta
          name="description"
          content="Visualize your degree progress with WCUPA Degree Visualizer."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Main Content */}
      <main className="flex-grow p-8 bg-stone-50 text-black mt-5">
        {/* Hero Image */}
        <div className="relative w-full h-[600px] mb-8">
          <Image
            src="/wcu02.jpg"
            alt="University Building"
            layout="fill"
            objectFit="cover"
            objectPosition="center 60%"
            className="rounded-lg"
          />
        </div>

        {/* Main Section */}
        <section className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Welcome to the WCUPA Degree Visualizer!</h2>

          <p className="mb-4 text-lg text-gray-700">
            This website is designed to help West Chester University Computer Science students track their progress toward graduation.
            Our goal is to provide an intuitive platform where students can plan their coursework and ensure they meet all degree requirements.
          </p>

          <h3 className="text-2xl font-semibold mt-6 mb-3">How It Works:</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2 text-lg text-gray-700">
            <li><strong>Sign Up & Login:</strong> Create an account to save and manage your progress.</li>
            <li><strong>Course Selection Survey:</strong> Once logged in, fill out a survey selecting the courses you have completed or plan to take.</li>
            <li><strong>Dashboard Visualization:</strong> Your selected courses will be reflected on an interactive dashboard, giving you a clear view of your degree progression.</li>
          </ul>

          <p className="mb-4 text-lg text-gray-700">
            We are actively working on adding features like user authentication, navigation tabs, and a dynamic course tracking system to enhance the user experience. Stay tuned for updates!
          </p>
        </section>
      </main>

      {/* Footer */}
      {/* <footer className="bg-[#6e3061] p-4 text-center">
        <p className="text-white">
          &copy; {new Date().getFullYear()} WCUPA Degree Visualizer. All rights reserved.
        </p>
      </footer> */}
    </>
  );
}
