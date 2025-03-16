import Head from "next/head";

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
      <main className="flex-grow p-8 bg-stone-50 text-black mt-16">
        <section className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Welcome!</h2>
          <p className="mb-4">
            This is a very rough draft of the website project meant to serve as an example starter page and provide a mockup.
          </p>
          <p>
            We'll be adding features like navigation tabs and user login to fully enable degree progress tracking.
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
