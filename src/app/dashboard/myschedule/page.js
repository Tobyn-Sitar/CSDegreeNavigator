"use client";

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
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col items-center justify-center p-6 pt-0">
          <Card className="w-full max-w-6xl p-6">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">My Schedule</CardTitle>
              <CardDescription className="text-base">
              This is your current generated schedule for the upcoming semester. <br />
               <span className="text-muted-foreground">
                (Here is a mockup example schedule of what it would look like.)
                </span>
              </CardDescription>

            </CardHeader>

            <CardContent>
              <table className="min-w-full border border-gray-300 text-sm text-center">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">Day/Period</th>
                    <th className="border p-2">I<br />9:30-10:20</th>
                    <th className="border p-2">II<br />10:20-11:10</th>
                    <th className="border p-2">III<br />11:10-12:00</th>
                    <th className="border p-2">12:00-12:40</th>
                    <th className="border p-2">IV<br />12:40-1:30</th>
                    <th className="border p-2">V<br />1:30-2:20</th>
                    <th className="border p-2">VI<br />2:20-3:10</th>
                    <th className="border p-2">VII<br />3:10-4:00</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Monday", "CSC 142", "MAT 161", "CHE 103", "LUNCH", "CHE LAB", "", "", "CSC 231"],
                    ["Tuesday", "CHE LAB", "CHE LAB", "CHE LAB", "", "CSC 142", "CHE 103", "MAT 161", ""],
                    ["Wednesday", "MAT 161", "CSC 231", "CSC 142", "CHE 103", "", "", "", ""],
                    ["Thursday", "CSC 231", "CSC 142", "CHE 103", "LUNCH", "CHE LAB", "CHE LAB", "CHE LAB", "MAT 161"],
                    ["Friday", "CHE LAB", "CHE LAB", "CHE LAB", "LUNCH", "MAT 161", "CHE 103", "CSC 142", "CSC 231"],
                    ["Saturday", "CSC 142", "CHE 103", "MAT 161", "LUNCH", "SEMINAR", "SEMINAR", "SEMINAR", "SPORTS"]
                  ].map((row, rowIndex) => (
                    <tr key={rowIndex} className="even:bg-gray-50">
                      {row.map((cell, colIndex) => (
                        <td
                          key={colIndex}
                          className={`border p-2 ${
                            ["LUNCH", "LAB", "SPORTS", "SEMINAR"].includes(cell)
                              ? "bg-gray-100"
                              : ""
                          }`}
                        >
                          {["LUNCH", "SEMINAR", "SPORTS"].includes(cell) ? "" : cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
