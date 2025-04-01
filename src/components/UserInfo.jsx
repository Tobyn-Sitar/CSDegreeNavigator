import React from 'react';
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import TreePage from "@/components/displayTree"; // Import TreePage component

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          {/* Render TreePage component here */}
          <div className="tree-container">
            <TreePage /> {/* Tree visualization will be rendered here */}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
