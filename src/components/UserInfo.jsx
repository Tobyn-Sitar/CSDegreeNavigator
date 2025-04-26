import React from 'react';
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import PlannerPage from "@/app/dashboard/planner/page"; // ⬅️ Import your Course Planner page

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-4">
          {/* Render the PlannerPage here */}
          <PlannerPage />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
