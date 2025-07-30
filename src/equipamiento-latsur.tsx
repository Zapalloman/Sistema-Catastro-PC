"use client"

import { ProcessLayout } from "./components/process-layout"
import { LatsurEquipmentTable } from "./components/latsur-equipment-table"
import { HardDrive, Activity, Users, Zap } from "lucide-react"

export default function EquipamientoLatsur() {
  return (
    <ProcessLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <HardDrive className="w-8 h-8 text-cyan-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Equipamiento LATSUR</h1>
            <p className="text-gray-600 mt-1">
              Gestiona y visualiza todos los equipos especializados  LATSUR. Explora las relaciones entre
              dispositivos y supervisa el estado operativo de cada equipo.
            </p>
          </div>
        </div>

        {/* LATSUR Equipment Table */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <LatsurEquipmentTable />
        </div>

       
        

        {/* Information Panel *
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-6 border border-cyan-200">
          <h2 className="text-xl font-semibold text-cyan-900 mb-4">Información LATSUR</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-medium text-cyan-900 mb-2">Ubicación</h3>
              <p className="text-cyan-800">Instituto Geográfico Militar </p>
              <p className="text-cyan-800">Latsur</p>
            </div>
            <div>
              <h3 className="font-medium text-cyan-900 mb-2">Contacto Técnico</h3>
              <p className="text-cyan-800">Email: ayuda@igm.cl</p>
              <p className="text-cyan-800"> 12340</p>
            </div>
          </div>*/}
      </div>
    </ProcessLayout>
  )
}
