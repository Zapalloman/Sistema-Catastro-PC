"use client"

import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"

interface DashboardHeaderProps {
  title: string
  subtitle?: string
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  const handleLogout = () => {
    // TODO: Implement logout functionality
    console.log("Logging out...")
    // Redirect to login page
    window.location.href = "/"
  }

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - User info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">Administrador SIA CIMI</div>
            <div className="text-xs text-gray-500">Instituto Geográfico Militar</div>
          </div>
        </div>

        {/* Center - Page title */}
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>

        {/* Right side - Logout button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 bg-transparent"
        >
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  )
}
