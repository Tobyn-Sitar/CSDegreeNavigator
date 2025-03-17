"use client";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import OrgChartTree from "./OrgChartTree"; // adjust the path if needed
import "./OrgChartTree.css"; // ensure this path is correct

export default function Courses() {
  return (
    <>
      <Head>
        <title>Courses - WCUPA Degree Visualizer</title>
        <meta name="description" content="Courses chart for WCUPA Degree Visualizer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen flex flex-col">

        {/* Main Content */}
        <main className="flex-grow p-8 bg-stone-50 text-black mt-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Courses</h2>
            {/* Place your OrgChartTree component here */}
            <OrgChartTree />
          </div>
        </main>

        {/* Footer */}
        {/* <footer className="bg-[#6e3061] p-4 text-center">
          <p className="text-white">
            &copy; {new Date().getFullYear()} WCUPA Degree Visualizer. All rights reserved.
          </p>
        </footer> */}
      </div>
    </>
  );
}
