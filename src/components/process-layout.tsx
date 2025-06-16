"use client"

import type React from "react"

import { AppSidebar } from "./app-sidebar"
import { DashboardHeader } from "./dashboard-header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

interface ProcessLayoutProps {
  children: React.ReactNode
}

export function ProcessLayout({ children }: ProcessLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <DashboardHeader />
          <main className="flex-1 p-6 bg-gray-50 overflow-auto">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
