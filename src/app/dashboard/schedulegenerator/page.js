"use client";

import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function Page() {
  const router = useRouter();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col items-center justify-center p-6 pt-0">
          <Card className="w-full max-w-2xl p-8 text-center">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Schedule Generator</CardTitle>
              <CardDescription className="text-base">
                After completing the degree progress survey, use this page to generate your recommended class schedule.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-muted-foreground mb-6">
                Click below to generate your schedule based on completed courses and available sections.
              </p>

              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={() => router.push("/dashboard/myschedule")}
                  className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90 transition"
                >
                  Generate Schedule
                </button>

                {/* 
                  WIP: Schedule generation logic (to be implemented)

                  Step 1: Get available CSC courses for current semester:
                  GET /section-schedule-details?criteria={"termCode":"202510","subjectCode":"CSC"}

                  Step 2: Fetch user’s completed courses from MongoDB (survey results)

                  Step 3: Cross-reference completed vs required CSC courses

                  Step 4: Filter out sections with conflicts & prerequisites unmet

                  Step 5: Build and return a time-block schedule layout
                */}

                <p className="text-sm text-muted-foreground">
                  Already generated your schedule?
                </p>
                <button
                  onClick={() => router.push("/dashboard/myschedule")}
                  className="border border-gray-300 px-6 py-2 rounded hover:bg-gray-100 transition"
                >
                  My Schedule
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
