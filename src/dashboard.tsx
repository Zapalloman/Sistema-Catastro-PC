"use client"

import { AppSidebar } from "./components/app-sidebar"
import { DashboardHeader } from "./components/dashboard-header"
import { EnhancedDashboardHeader } from "./components/enhanced-dashboard-header"
import { ModernDashboardCard } from "./components/modern-dashboard-card"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Wifi, Apple, Server, Monitor, HardDrive, Users } from "lucide-react"
import { useEffect, useState } from "react"

export default function Dashboard() {
  // Estados para datos reales de las APIs
  const [totalEquipos, setTotalEquipos] = useState(0)
  const [totalZ8, setTotalZ8] = useState(0)
  const [asignadosZ8, setAsignadosZ8] = useState(0)
  const [totalMac, setTotalMac] = useState(0)
  const [asignadosMac, setAsignadosMac] = useState(0)
  const [totalDatacenter, setTotalDatacenter] = useState(0)
  const [totalLatsur, setTotalLatsur] = useState(0)
  const [prestamosActivos, setPrestamosActivos] = useState(0)

  useEffect(() => {
    // Fetch equipos de cómputo
    fetch("http://localhost:3000/api/equipos")
      .then(res => res.json())
      .then(data => {
        setTotalEquipos(data.length)
      })
      .catch(() => setTotalEquipos(0))

    // Fetch Z8 equipos
    fetch("http://localhost:3000/api/equipos-z8")
      .then(res => res.json())
      .then(data => {
        setTotalZ8(data.length)
        // Contar los asignados (que tienen usuario asignado)
        const asignados = data.filter((eq: any) => eq.rut_usuario).length
        setAsignadosZ8(asignados)
      })
      .catch(() => {
        setTotalZ8(0)
        setAsignadosZ8(0)
      })

    // Fetch MAC equipos
    fetch("http://localhost:3000/api/equipos-mac")
      .then(res => res.json())
      .then(data => {
        setTotalMac(data.length)
        // Contar los asignados
        const asignados = data.filter((eq: any) => eq.rut_usuario).length
        setAsignadosMac(asignados)
      })
      .catch(() => {
        setTotalMac(0)
        setAsignadosMac(0)
      })

    // Fetch Datacenter equipos
    fetch("http://localhost:3000/api/equipos-datacenter")
      .then(res => res.json())
      .then(data => {
        setTotalDatacenter(data.length)
      })
      .catch(() => setTotalDatacenter(0))

    // Fetch LATSUR equipos
    fetch("http://localhost:3000/api/equipos-latsur")
      .then(res => res.json())
      .then(data => {
        setTotalLatsur(data.length)
      })
      .catch(() => setTotalLatsur(0))

    // Fetch préstamos activos
    fetch("http://localhost:3000/api/prestamos")
      .then(res => res.json())
      .then(data => {
        // Filtrar solo los préstamos activos (no devueltos)
        const activos = data.filter((prestamo: any) => !prestamo.fecha_devolucion).length
        setPrestamosActivos(activos)
      })
      .catch(() => setPrestamosActivos(0))
  }, [])

  // Datos simplificados según las especificaciones
  const z8StationsData = {
    total: totalZ8,
    quickStats: [],
    alerts: [],
  }

  const macStationsData = {
    total: totalMac,
    quickStats: [],
    alerts: [],
  }

  const datacenterData = {
    total: totalDatacenter,
    quickStats: [],
    alerts: [],
  }

  const equipmentOverviewData = {
    total: totalEquipos,
    quickStats: [],
    alerts: [],
  }

  const latsurData = {
    total: totalLatsur,
    quickStats: [],
    alerts: [],
  }

  const loansData = {
    total: prestamosActivos,
    quickStats: [],
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
                    label: "Total de Equipos",
                    value: z8StationsData.total,
                    unit: "equipos",
                  }}
                  quickStats={z8StationsData.quickStats}
                  alerts={z8StationsData.alerts}
                  progressData={{
                    label: "Equipos Asignados",
                    value: asignadosZ8,
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
                    label: "Total de Estaciones",
                    value: macStationsData.total,
                    unit: "estaciones",
                  }}
                  quickStats={macStationsData.quickStats}
                  alerts={macStationsData.alerts}
                  progressData={{
                    label: "Estaciones Asignadas",
                    value: asignadosMac,
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
                    label: "Total de Equipos",
                    value: datacenterData.total,
                    unit: "equipos",
                  }}
                  quickStats={datacenterData.quickStats}
                  alerts={datacenterData.alerts}
                  progressData={{
                    label: "Equipos Registrados",
                    value: datacenterData.total,
                    max: datacenterData.total,
                    color: "slate",
                  }}
                  navigationUrl="/datacenter"
                  addNewUrl="/datacenter"
                  addNewLabel="Nuevo Equipo"
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
                  quickStats={equipmentOverviewData.quickStats}
                  alerts={equipmentOverviewData.alerts}
                  progressData={{
                    label: "Equipos Registrados",
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
                    label: "Total de Dispositivos",
                    value: latsurData.total,
                    unit: "dispositivos",
                  }}
                  quickStats={latsurData.quickStats}
                  alerts={latsurData.alerts}
                  progressData={{
                    label: "Dispositivos Registrados",
                    value: latsurData.total,
                    max: latsurData.total,
                    color: "cyan",
                  }}
                  navigationUrl="/equipamiento-latsur"
                  addNewUrl="/equipamiento-latsur"
                  addNewLabel="Nuevo Dispositivo"
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
                    label: "Préstamos Vigentes",
                    value: loansData.total,
                    max: loansData.total || 1,
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
