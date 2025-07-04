"use client"

import { AppSidebar } from "./components/app-sidebar"
import { DashboardHeader } from "./components/dashboard-header"
import { EnhancedDashboardHeader } from "./components/enhanced-dashboard-header"
import { ModernDashboardCard } from "./components/modern-dashboard-card"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Wifi, Apple, Server, Monitor, HardDrive, Users } from "lucide-react"
import { useEffect, useState } from "react"

export default function Dashboard() {
  // Estado para el total de equipos
  const [totalEquipos, setTotalEquipos] = useState(0)
  const [quickStatsEquipos, setQuickStatsEquipos] = useState<{label: string, value: number}[]>([])

  useEffect(() => {
    fetch("http://localhost:3000/api/equipos")
      .then(res => res.json())
      .then(data => {
        setTotalEquipos(data.length)
        // Agrupa por propietario
        const counts: Record<string, number> = {}
        data.forEach((eq: any) => {
          const propietario = eq.propietario || "Sin propietario"
          counts[propietario] = (counts[propietario] || 0) + 1
        })
        // Ordena y toma los 3 principales
        const quickStats = Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([label, value]) => ({ label, value }))
        setQuickStatsEquipos(quickStats)
      })
      .catch(() => {
        setTotalEquipos(0)
        setQuickStatsEquipos([])
      })
  }, [])

  // TODO: Replace with real API calls to fetch data from backend

  // Z8 Stations Data - Focus on essential operational information
  const z8StationsData = {
    total: 4,
    quickStats: [
      { label: "Activas", value: 3, trend: "stable" as const },
      { label: "Inactivas", value: 1, trend: "stable" as const },
      { label: "Usuarios Asignados", value: 4, trend: "stable" as const },
      { label: "Departamentos", value: 3, trend: "stable" as const },
    ],
    alerts: [],
  }

  // MAC Stations Data - Focus on device status and connectivity
  const macStationsData = {
    total: 5,
    quickStats: [
      { label: "Conectadas", value: 4, trend: "stable" as const },
      { label: "Desconectadas", value: 1, trend: "stable" as const },
      { label: "WiFi 6E", value: 3, trend: "stable" as const },
      { label: "Ethernet", value: 1, trend: "stable" as const },
    ],
    alerts: [],
  }

  // Datacenter Assets Data - Focus on critical infrastructure
  const datacenterData = {
    total: 6,
    quickStats: [
      { label: "Servidores", value: 2, trend: "stable" as const },
      { label: "Sistemas A.C.", value: 1, trend: "stable" as const },
      { label: "Firewalls", value: 1, trend: "stable" as const },
      { label: "UPS Activos", value: 1, trend: "stable" as const },
    ],
    alerts: [],
  }

  // Equipment Overview Data - Solo el total real
  const equipmentOverviewData = {
    total: totalEquipos,
    quickStats: [],
    alerts: [],
  }

  // LATSUR Equipment Data - Focus on specialized equipment
  const latsurData = {
    total: 5,
    quickStats: [
      { label: "Workstations", value: 2, trend: "stable" as const },
      { label: "Dispositivos 3D", value: 2, trend: "stable" as const },
      { label: "Impresoras", value: 1, trend: "stable" as const },
      { label: "Responsables", value: 3, trend: "stable" as const },
    ],
    alerts: [],
  }

  // Loans Data - Focus on loan management
  const loansData = {
    total: 5,
    quickStats: [
      { label: "Pendrives Activos", value: 5, trend: "stable" as const },
      { label: "Disponibles", value: 18, trend: "up" as const },
      { label: "Departamentos", value: 4, trend: "stable" as const },
      { label: "Pendientes", value: 0, trend: "stable" as const },
    ],
    alerts: [],
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          {/* Standard Navigation Header */}
          <DashboardHeader title="Dashboard" subtitle="Panel de control central del sistema" />

          <main className="flex-1 bg-gray-50 overflow-auto">
            <div className="max-w-7xl mx-auto">
              <EnhancedDashboardHeader />

              {/* Main Dashboard Cards Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8 px-6">
                {/* Z8 Stations Card */}
                <ModernDashboardCard
                  title="Estaciones Z8"
                  subtitle="Estaciones especializadas para geodesia"
                  icon={<Wifi className="w-6 h-6 text-purple-600" />}
                  primaryStat={{
                    label: "Total de Estaciones",
                    value: z8StationsData.total,
                    unit: "estaciones",
                  }}
                  quickStats={z8StationsData.quickStats}
                  alerts={z8StationsData.alerts}
                  progressData={{
                    label: "Estaciones Activas",
                    value: 3,
                    max: z8StationsData.total,
                    color: "purple",
                  }}
                  navigationUrl="/estaciones-z8"
                  addNewUrl="/estaciones-z8"
                  addNewLabel="Nueva Z8"
                  gradientColors="from-purple-500 to-indigo-600"
                  iconColor="text-purple-600"
                />

                {/* MAC Stations Card */}
                <ModernDashboardCard
                  title="Estaciones MAC"
                  subtitle="Dispositivos Apple para diseño gráfico"
                  icon={<Apple className="w-6 h-6 text-gray-700" />}
                  primaryStat={{
                    label: "Total de Dispositivos",
                    value: macStationsData.total,
                    unit: "dispositivos",
                  }}
                  quickStats={macStationsData.quickStats}
                  alerts={macStationsData.alerts}
                  progressData={{
                    label: "Dispositivos Conectados",
                    value: 4,
                    max: macStationsData.total,
                    color: "gray",
                  }}
                  navigationUrl="/estaciones-mac"
                  addNewUrl="/estaciones-mac"
                  addNewLabel="Nuevo MAC"
                  gradientColors="from-gray-500 to-slate-600"
                  iconColor="text-gray-700"
                />

                {/* Datacenter Card */}
                <ModernDashboardCard
                  title="Datacenter"
                  subtitle="Infraestructura crítica del centro de datos"
                  icon={<Server className="w-6 h-6 text-slate-700" />}
                  primaryStat={{
                    label: "Total de Activos",
                    value: datacenterData.total,
                    unit: "activos",
                  }}
                  quickStats={datacenterData.quickStats}
                  alerts={datacenterData.alerts}
                  progressData={{
                    label: "Activos Operativos",
                    value: 6,
                    max: datacenterData.total,
                    color: "slate",
                  }}
                  navigationUrl="/datacenter"
                  addNewUrl="/datacenter"
                  addNewLabel="Nuevo Activo"
                  gradientColors="from-slate-500 to-gray-600"
                  iconColor="text-slate-700"
                />

                {/* Equipment Card */}
                <ModernDashboardCard
                  title="Equipos de Cómputo"
                  subtitle="Workstations y equipos de oficina"
                  icon={<Monitor className="w-6 h-6 text-blue-600" />}
                  primaryStat={{
                    label: "Total de Equipos",
                    value: equipmentOverviewData.total,
                    unit: "equipos",
                  }}
                  quickStats={quickStatsEquipos}
                  alerts={equipmentOverviewData.alerts}
                  progressData={{
                    label: "Equipos Activos",
                    value: equipmentOverviewData.total,
                    max: equipmentOverviewData.total,
                    color: "blue",
                  }}
                  navigationUrl="/equipos"
                  addNewUrl="/equipos"
                  addNewLabel="Nuevo Equipo"
                  gradientColors="from-blue-500 to-cyan-600"
                  iconColor="text-blue-600"
                />

                {/* LATSUR Equipment Card */}
                <ModernDashboardCard
                  title="Equipamiento LATSUR"
                  subtitle="Laboratorio de tecnologías avanzadas"
                  icon={<HardDrive className="w-6 h-6 text-cyan-600" />}
                  primaryStat={{
                    label: "Total de Equipos",
                    value: latsurData.total,
                    unit: "equipos",
                  }}
                  quickStats={latsurData.quickStats}
                  alerts={latsurData.alerts}
                  progressData={{
                    label: "Equipos Operativos",
                    value: 5,
                    max: latsurData.total,
                    color: "cyan",
                  }}
                  navigationUrl="/equipamiento-latsur"
                  addNewUrl="/equipamiento-latsur"
                  addNewLabel="Nuevo Equipo"
                  gradientColors="from-cyan-500 to-blue-600"
                  iconColor="text-cyan-600"
                />

                {/* Loans Card */}
                <ModernDashboardCard
                  title="Préstamos"
                  subtitle="Medios de almacenamiento en préstamo"
                  icon={<Users className="w-6 h-6 text-green-600" />}
                  primaryStat={{
                    label: "Préstamos Activos",
                    value: loansData.total,
                    unit: "préstamos",
                  }}
                  quickStats={loansData.quickStats}
                  alerts={loansData.alerts}
                  progressData={{
                    label: "Dispositivos Prestados",
                    value: loansData.total,
                    max: loansData.total + 18, // 18 available
                    color: "green",
                  }}
                  navigationUrl="/prestamos"
                  addNewUrl="/prestamos"
                  addNewLabel="Nuevo Préstamo"
                  gradientColors="from-green-500 to-emerald-600"
                  iconColor="text-green-600"
                />
              </div>

              {/* System Information Footer */}
              <div className="bg-white rounded-lg shadow-sm border p-6 mx-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Información del Sistema</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Horarios de Operación</h3>
                    <p>Lunes a Jueves: 8:00 AM - 5:00 PM</p>
                    <p>Viernes: 8:00 AM - 4:00 PM</p>
                    <p>Soporte 24/7: Datacenter</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Contacto de Soporte</h3>
                    <p>Email: soporte@igm.cl</p>
                    <p>Teléfono: 63340</p>
                    <p>Emergencias: 2501</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Última Actualización</h3>
                    <p>Sistema: {new Date().toLocaleDateString()}</p>
                    <p>Datos: {new Date().toLocaleTimeString()}</p>
                    <p>Versión: 2.1.0</p>
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
