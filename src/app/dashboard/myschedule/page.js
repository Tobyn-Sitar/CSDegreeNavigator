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
          <Card className="w-full max-w-2xl p-8 text-center">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">My Schedule</CardTitle>
              <CardDescription className="text-base">
                This is where the generated schedule will be presented.
              </CardDescription>
            </CardHeader>
            <CardContent>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
