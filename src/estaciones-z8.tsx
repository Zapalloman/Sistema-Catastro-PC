"use client"

import { ProcessLayout } from "./components/process-layout"
import { Z8StationsTable } from "./components/z8-stations-table"
import { Wifi, Activity, Users } from "lucide-react"

export default function EstacionesZ8() {
  return (
    <ProcessLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Wifi className="w-8 h-8 text-purple-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Estaciones Z8</h1>
            <p className="text-gray-600 mt-1">
              Monitorea y gestiona todas las estaciones Z8 del Instituto Geográfico Militar.
            </p>
          </div>
        </div>

        {/* Z8 Stations Table */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <Z8StationsTable />
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-purple-900 mb-2">Total Estaciones</h3>
                <p className="text-3xl font-bold text-purple-600">4</p>
                <p className="text-sm text-purple-700">Estaciones Z8 registradas</p>
              </div>
              <Wifi className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-green-900 mb-2">Activas</h3>
                <p className="text-3xl font-bold text-green-600">3</p>
                <p className="text-sm text-green-700">En funcionamiento</p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Usuarios Activos</h3>
                <p className="text-3xl font-bold text-blue-600">4</p>
                <p className="text-sm text-blue-700">Personal asignado</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Information Panel */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-200">
          <h2 className="text-xl font-semibold text-purple-900 mb-4">Información de Estaciones Z8</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-medium text-purple-900 mb-2">Características Técnicas</h3>
              <p className="text-purple-800">• Estaciones de trabajo especializadas para geodesia</p>
              <p className="text-purple-800">• Conectividad de red de alta velocidad</p>
              <p className="text-purple-800">• Especificaciones optimizadas para cálculos geográficos</p>
            </div>
            <div>
             
            </div>
          </div>
        </div>
      </div>
    </ProcessLayout>
  )
}
