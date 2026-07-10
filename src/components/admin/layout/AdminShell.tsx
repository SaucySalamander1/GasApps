"use client";

import { ReactNode } from "react";

import AppSidebar from "./AppSidebar";
import TopNavbar from "./TopNavbar";

interface AdminShellProps {
  children: ReactNode;
}

export default function AdminShell({
  children,
}: AdminShellProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Full-width Top Navigation */}
      <TopNavbar />

      {/* Dashboard Layout */}
      <div className="flex">
        {/* Fixed Sidebar */}
        <AppSidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-x-auto bg-background px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}