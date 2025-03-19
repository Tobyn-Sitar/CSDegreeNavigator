import Head from "next/head";
import Image from "next/image";

export default function Contact() {
  return (
    <>
      <Head>
        <title>Contact - WCUPA Degree Visualizer</title>
        <meta name="description" content="Contact WCUPA Degree Visualizer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Main Content */}
      <main className="flex-grow p-8 bg-white text-black mt-5">
        {/* Hero Image */}
        <div className="relative w-full h-[500px] mb-8">
          <Image
            src="/wcu01.jpg"
            alt="University Building"
            layout="fill"
            objectFit="cover"
            objectPosition="center 20%"
            className="rounded-lg"
          />
        </div>

        {/* Contact Section */}
        <section className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
          <p className="text-lg text-gray-700">
            Have questions or need assistance? Feel free to reach out to one of the members of the team via email!
          </p>

          {/* Team Contact Info */}
          <div className="mt-6 text-lg">
            <p className="mb-2">
              Drew:{" "}
              <a href="mailto:DS995982@wcupa.edu" className="text-blue-600 hover:underline">
                DS995982@wcupa.edu
              </a>
            </p>
            <p className="mb-2">
              Justin:{" "}
              <a href="mailto:JK1035193@wcupa.edu" className="text-blue-600 hover:underline">
                JK1035193@wcupa.edu
              </a>
            </p>
            <p className="mb-2">
              Muhammad:{" "}
              <a href="mailto:MA970103@wcupa.edu" className="text-blue-600 hover:underline">
                MA970103@wcupa.edu
              </a>
            </p>
            <p className="mb-2">
              Robert:{" "}
              <a href="mailto:RS1007120@wcupa.edu" className="text-blue-600 hover:underline">
                RS1007120@wcupa.edu
              </a>
            </p>
            <p className="mb-2">
              Tobyn:{" "}
              <a href="mailto:TS964228@wcupa.edu" className="text-blue-600 hover:underline">
                TS964228@wcupa.edu
              </a>
            </p>
            <p className="mb-2">
              Yanxi:{" "}
              <a href="mailto:YW1021529@wcupa.edu" className="text-blue-600 hover:underline">
                YW1021529@wcupa.edu
              </a>
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
