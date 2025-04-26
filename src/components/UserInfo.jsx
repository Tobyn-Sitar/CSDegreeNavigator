import React from 'react';
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
// Removed TreePage
import Planner from "@/components/planner-components/planner"; // Add this line

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="planner-container">
            <Planner /> {/* Planner will be rendered here */}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
