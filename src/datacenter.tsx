"use client"

import { ProcessLayout } from "./components/process-layout"
import { DatacenterAssetsTable } from "./components/datacenter-assets-table"
import { Server, Activity, Shield, Thermometer } from "lucide-react"

export default function Datacenter() {
  return (
    <ProcessLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Server className="w-8 h-8 text-slate-700" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Datacenter</h1>
            <p className="text-gray-600 mt-1">
              Gestiona y monitorea todos los activos críticos del datacenter del Instituto Geográfico Militar. Supervisa
              servidores, sistemas de climatización, equipos de red, seguridad y alimentación eléctrica.
            </p>
          </div>
        </div>

        {/* Datacenter Assets Table */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <DatacenterAssetsTable />
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-lg p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Total Activos</h3>
                <p className="text-3xl font-bold text-slate-700">6</p>
                <p className="text-sm text-slate-600">Equipos registrados</p>
              </div>
              <Server className="w-8 h-8 text-slate-500" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-green-900 mb-2">Operativos</h3>
                <p className="text-3xl font-bold text-green-600">6</p>
                <p className="text-sm text-green-700">En funcionamiento</p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-6 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-red-900 mb-2">Seguridad</h3>
                <p className="text-3xl font-bold text-red-600">2</p>
                <p className="text-sm text-red-700">Firewalls activos</p>
              </div>
              <Shield className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-6 border border-cyan-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-cyan-900 mb-2">Climatización</h3>
                <p className="text-3xl font-bold text-cyan-600">2</p>
                <p className="text-sm text-cyan-700">Unidades A.C.</p>
              </div>
              <Thermometer className="w-8 h-8 text-cyan-500" />
            </div>
          </div>
        </div>
      </div>
    </ProcessLayout>
  )
}
