"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
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
  const { data: session } = useSession();
  const [courses, setCourses] = useState([]);
  const [completedCredits, setCompletedCredits] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await fetch("/api/generator", {
          method: "POST",
        });
        const data = await res.json();
        setCourses(data.recommended || []);
        setCompletedCredits(data.completedCredits || 0);
      } catch (err) {
        setError("Failed to fetch schedule.");
        console.error(err);
      }
    };

    fetchSchedule();
  }, []);

  // Initialize the table structure
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeSlots = [
    { label: "I", time: "0930" },
    { label: "II", time: "1020" },
    { label: "III", time: "1110" },
    { label: "Lunch", time: "1200" },
    { label: "IV", time: "1240" },
    { label: "V", time: "1330" },
    { label: "VI", time: "1420" },
    { label: "VII", time: "1510" },
  ];

  // Utility to match meeting times to time slots
  function getCourseForTime(day, slotTime) {
    for (const course of courses) {
      for (const mt of course.meetingStrings || []) {
        if (
          mt.includes(day.slice(0, 3)) &&
          mt.includes(slotTime)
        ) {
          return `${course.courseNumber}`;
        }
      }
    }
    return "";
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col items-center justify-center p-6 pt-0">
          <Card className="w-full max-w-6xl p-6">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">My Schedule</CardTitle>
              <CardDescription className="text-base">
                View your generated schedule based on completed courses, availability, and prerequisites.
              </CardDescription>
              <p className="mt-2 font-semibold text-primary">Total Completed Credits: {completedCredits}</p>
            </CardHeader>

            <CardContent>
              {error && <p className="text-red-600">{error}</p>}

              <table className="min-w-full border border-gray-300 text-sm text-center">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">Day/Period</th>
                    {timeSlots.map((slot, index) => (
                      <th key={index} className="border p-2">
                        {slot.label}<br />{slot.time.slice(0, 2)}:{slot.time.slice(2)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {days.map((day, rowIndex) => (
                    <tr key={rowIndex} className="even:bg-gray-50">
                      <td className="border p-2 font-medium">{day}</td>
                      {timeSlots.map((slot, colIndex) => (
                        <td key={colIndex} className="border p-2">
                          {getCourseForTime(day, slot.time)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Debug: Show meeting times */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Selected Courses</h3>
                <ul className="space-y-4">
                  {courses.map((course, index) => (
                    <li key={index} className="p-2 border rounded">
                      <strong>{course.courseNumber}</strong> - {course.courseTitle} ({course.creditHours} credits)
                      <ul className="ml-4 text-sm">
                        {course.meetingStrings?.map((m, i) => (
                          <li key={i}>• {m}</li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}