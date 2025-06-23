"use client"

import { ProcessLayout } from "./components/process-layout"
import { MacStationsTable } from "./components/mac-stations-table"
import { Apple, Activity, Users } from "lucide-react"

export default function EstacionesMac() {
  return (
    <ProcessLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Apple className="w-8 h-8 text-gray-700" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Estaciones MAC</h1>
            <p className="text-gray-600 mt-1">
              Monitorea y gestiona todas las estaciones MAC del Instituto Geográfico Militar. Supervisa el estado de
              conexión, especificaciones técnicas y asignaciones de usuarios para dispositivos Apple.
            </p>
          </div>
        </div>

        {/* MAC Stations Table */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <MacStationsTable />
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Total Estaciones</h3>
                <p className="text-3xl font-bold text-gray-700">5</p>
                <p className="text-sm text-gray-600">Estaciones MAC registradas</p>
              </div>
              <Apple className="w-8 h-8 text-gray-500" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-green-900 mb-2">Activas</h3>
                <p className="text-3xl font-bold text-green-600">4</p>
                <p className="text-sm text-green-700">En funcionamiento</p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Usuarios Activos</h3>
                <p className="text-3xl font-bold text-blue-600">5</p>
                <p className="text-sm text-blue-700">Personal asignado</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Information Panel */}
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Información de Estaciones MAC</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Características Técnicas</h3>
              <p className="text-gray-700">• Dispositivos Apple con procesadores M-series</p>
              <p className="text-gray-700">• Conectividad avanzada WiFi 6E y Ethernet</p>
              <p className="text-gray-700">• Optimizados para diseño gráfico y análisis geográfico</p>
            </div>
            
          </div>
        </div>
      </div>
    </ProcessLayout>
  )
}
