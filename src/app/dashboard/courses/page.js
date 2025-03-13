"use client";

import { useEffect, useState } from "react";
import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { TrendingUp } from "lucide-react";
import { LabelList, RadialBar, RadialBarChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toggle } from "@/components/ui/toggle"; // Import the Toggle component
import { Moon, Sun } from "lucide-react"; // Import icons for light and dark modes
import { useTheme } from "next-themes"; // Import the useTheme hook for theme management

// Radial chart data
const radialChartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
];

// Radial chart configuration
const radialChartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
};

// Bar chart data
const barChartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

// Bar chart configuration
const barChartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb", // Blue color for desktop
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa", // Light blue color for mobile
  },
};

// New Bar chart data for the second set of charts
const barChartData2 = [
  { month: "July", desktop: 120, mobile: 160 },
  { month: "August", desktop: 215, mobile: 180 },
  { month: "September", desktop: 250, mobile: 190 },
  { month: "October", desktop: 300, mobile: 240 },
  { month: "November", desktop: 180, mobile: 220 },
  { month: "December", desktop: 160, mobile: 210 },
];

export default function Page() {
  const { setTheme, theme } = useTheme(); // Use the `next-themes` hook to manage themes

  const handleThemeToggle = () => {
    // Toggle between light and dark theme
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Courses Needed</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Add the Theme Toggle Button */}
          <div className="absolute top-4 right-4">
            <Toggle
              aria-label="Toggle theme"
              onClick={handleThemeToggle} // Handle the theme toggle on click
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-gray-400" />
              )}
            </Toggle>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Flex container for the charts */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Radial Chart */}
            <Card className="flex-1">
              <CardHeader className="items-center pb-0">
                <CardTitle>Radial Chart - Label</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-0">
                <ChartContainer
                  config={radialChartConfig}
                  className="mx-auto aspect-square max-h-[250px]"
                >
                  <RadialBarChart
                    data={radialChartData}
                    startAngle={-90}
                    endAngle={380}
                    innerRadius={30}
                    outerRadius={110}
                  >
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel nameKey="browser" />}
                    />
                    <RadialBar dataKey="visitors" background>
                      <LabelList
                        position="insideStart"
                        dataKey="browser"
                        className="fill-white capitalize mix-blend-luminosity"
                        fontSize={11}
                      />
                    </RadialBar>
                  </RadialBarChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                  Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                  Showing total visitors for the last 6 months
                </div>
              </CardFooter>
            </Card>

            {/* Bar Chart */}
            <Card className="flex-1">
              <CardHeader className="items-center pb-0">
                <CardTitle>Monthly Visitors</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 pb-0">
                <ChartContainer config={barChartConfig} className="min-h-[200px] w-full">
                  <BarChart data={barChartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => value.slice(0, 3)} // Display the first 3 letters of the month
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                    <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Second Set of Charts */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* New Bar Chart */}
            <Card className="flex-1">
              <CardHeader className="items-center pb-0">
                <CardTitle>Monthly Visitors (July - December 2024)</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 pb-0">
                <ChartContainer config={barChartConfig} className="min-h-[200px] w-full">
                  <BarChart data={barChartData2}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => value.slice(0, 3)} // Display the first 3 letters of the month
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                    <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Other content */}
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
