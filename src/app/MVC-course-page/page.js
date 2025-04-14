"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarInset } from "@/components/ui/sidebar";

import "./styles.css"; // your custom styles for columns + checkboxes

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    import("./controller.js"); // dynamically load your MVC controller
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col items-center justify-start p-6 pt-2 w-full">
          {/* MVC Course Planner Content */}
          <div className="w-full max-w-6xl bg-white rounded-lg shadow px-6 py-4">
            <h1 className="text-3xl font-bold text-center mb-6">Course Planner</h1>
            <div id="semester-container" className="semester-container mb-8"></div>
            <hr className="my-6" />
            <h2 className="text-xl font-semibold mb-2 text-center">Available Courses</h2>
            <div id="checkbox-area" className="checkbox-area"></div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
