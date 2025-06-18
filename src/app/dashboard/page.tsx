"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardCard } from "@/components/dashboard-card"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Usb, HardDrive, Disc, Camera, Monitor, Printer, Zap, Cable, Glasses, Mouse, Laptop } from "lucide-react"
import { Plus } from "lucide-react"
//cambiar en backend
const storageData = [
  { count: 0, title: "Pendrive Activos", icon: <Usb />, color: "green" as const },
  { count: 0, title: "Pendrive Disponible", icon: <Usb />, color: "orange" as const },
  { count: 0, title: "Disco Externos", icon: <HardDrive />, color: "teal" as const },
  { count: 0, title: "Camara Web", icon: <Camera />, color: "teal" as const },
  { count: 0, title: "Lector de DVD", icon: <Disc />, color: "teal" as const },
]

const equipmentData = [
  { count: 0, title: "Workstation", icon: <Monitor />, color: "teal" as const },
  { count: 0, title: "Impresoras", icon: <Printer />, color: "teal" as const },
  { count: 0, title: "UPS", icon: <Zap />, color: "teal" as const },
  { count: 0, title: "KVM", icon: <Cable />, color: "teal" as const },
  { count: 0, title: "Monitores", icon: <Monitor />, color: "teal" as const },
  { count: 0, title: "Gafas 3D", icon: <Glasses />, color: "teal" as const },
  { count: 0, title: "Mouse 3D", icon: <Mouse />, color: "teal" as const },
  { count: 0, title: "Notebook", icon: <Laptop />, color: "teal" as const },
  { count: 0, title: "Disco Externos", icon: <HardDrive />, color: "teal" as const },
]

export default function Dashboard() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <DashboardHeader />
          <main className="flex-1 p-6 bg-gray-50 overflow-auto">
            <div className="max-w-7xl mx-auto space-y-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

                {/* Storage and Devices Section */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <HardDrive className="w-5 h-5" />
                      Almacenamiento y Dispositivos
                    </h2>
                    <Plus className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                    {storageData.map((item, index) => (
                      <DashboardCard
                        key={index}
                        count={item.count}
                        title={item.title}
                        icon={item.icon}
                        color={item.color}
                      />
                    ))}
                  </div>
                </div>

                {/* Equipment Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <Monitor className="w-5 h-5" />
                      Equipos Latitud Sur (EMCO)
                    </h2>
                    <Plus className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
                    {equipmentData.map((item, index) => (
                      <DashboardCard
                        key={index}
                        count={item.count}
                        title={item.title}
                        icon={item.icon}
                        color={item.color}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
