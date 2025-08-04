"use client"

import { ProcessLayout } from "./components/process-layout"
import { DatacenterAssetsTable } from "./components/datacenter-assets-table"
import { Server, Activity, Shield, Thermometer } from "lucide-react"
import { useEffect, useState } from "react"

export default function Datacenter() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ✅ CONECTAR AL BACKEND REAL
  useEffect(() => {
    console.log('🔗 Conectando al backend de datacenter...');
    
    fetch("http://localhost:3000/api/equipos-datacenter")  // ✅ URL CORRECTA
      .then(res => {
        if (!res.ok) throw new Error("Error al obtener datos del datacenter")
        return res.json()
      })
      .then(dataFromAPI => {
        console.log("📊 DATOS DEL DATACENTER RECIBIDOS:", dataFromAPI);
        setData(dataFromAPI)
      })
      .catch(err => {
        console.error("❌ Error cargando datos del datacenter:", err);
        setError(err.message)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <ProcessLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <Server className="h-6 w-6 animate-spin text-slate-600" />
            <span className="text-lg text-gray-600">Cargando activos del datacenter...</span>
          </div>
        </div>
      </ProcessLayout>
    )
  }

  if (error) {
    return (
      <ProcessLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Server className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar datacenter</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </ProcessLayout>
    )
  }

  return (
    <ProcessLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Server className="w-8 h-8 text-slate-700" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Datacenter</h1>
            <p className="text-gray-600 mt-1">
              Gestiona y monitorea todos los activos críticos del datacenter del Instituto Geográfico Militar. 
              {data.length > 0 ? ` ${data.length} activos registrados.` : ' Cargando activos...'}
            </p>
          </div>
        </div>

        {/* Datacenter Assets Table */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <DatacenterAssetsTable data={data} />
        </div>

        {/* Estadísticas en tiempo real */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-lg p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Total Activos</h3>
                <p className="text-3xl font-bold text-slate-700">{data.length}</p>
                <p className="text-sm text-slate-600">Equipos registrados</p>
              </div>
              <Server className="w-8 h-8 text-slate-500" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-green-900 mb-2">Operativos</h3>
                <p className="text-3xl font-bold text-green-600">{data.filter(item => item.activo).length}</p>
                <p className="text-sm text-green-700">En funcionamiento</p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-6 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-red-900 mb-2">Seguridad</h3>
                <p className="text-3xl font-bold text-red-600">{data.filter(item => item.categoria?.toLowerCase().includes('firewall')).length}</p>
                <p className="text-sm text-red-700">Firewalls activos</p>
              </div>
              <Shield className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-6 border border-cyan-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-cyan-900 mb-2">Climatización</h3>
                <p className="text-3xl font-bold text-cyan-600">{data.filter(item => item.categoria?.toLowerCase().includes('ups')).length}</p>
                <p className="text-sm text-cyan-700">Sistemas UPS</p>
              </div>
              <Thermometer className="w-8 h-8 text-cyan-500" />
            </div>
          </div>
        </div>
      </div>
    </ProcessLayout>
  )
}
