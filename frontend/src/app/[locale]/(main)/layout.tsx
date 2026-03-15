'use client';

import { HeaderActionsProvider } from "@/components/layout/HeaderActionsProvider";
import MobileNav from "@/components/layout/MobileNav";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HeaderActionsProvider>
      <div className="min-h-screen bg-muted">
        {/* 1. DESKTOP SIDEBAR */}
        <div className="hidden md:block fixed inset-y-0 left-0 z-50 w-64 border-r border-sidebar-border bg-sidebar">
          <Sidebar />
        </div>

        {/* 2. MAIN CONTENT AREA */}
        <main className="md:pl-64 min-h-screen pb-20 md:pb-8 flex flex-col">
          <Header />
          <div className="container mx-auto px-4 py-6 md:p-8 max-w-7xl flex-1">
            {children}
          </div>
        </main>

        {/* 3. MOBILE BOTTOM NAV */}
        <div className="md:hidden">
          <MobileNav />
        </div>
      </div>
    </HeaderActionsProvider>
  );
}
