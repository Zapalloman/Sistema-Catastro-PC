"use client"

import { useState } from "react"
import { ProcessLayout } from "./components/process-layout"
import { ProcessCard } from "./components/process-card"
import { AsignacionesModal } from "./components/asignaciones-modal"
import { UserPlus, RefreshCw, ArrowRightLeft, FileCheck, Settings } from "lucide-react"

// Process data
const processData = [
  {
    title: "Asignación",
    description:
      "Asignar dispositivos y equipos a empleados o departamentos específicos.",
    icon: <UserPlus />,
    color: "blue" as const,
  },
  {
    title: "Cambio",
    description:
      "Procesar cambios de dispositivos existentes. Actualizar especificaciones, reparaciones o modificaciones de equipos asignados.",
    icon: <RefreshCw />,
    color: "green" as const,
  },
  {
    title: "Traspaso",
    description:
      "Transferir dispositivos entre empleados o departamentos. Gestiona el movimiento interno de equipos y actualiza registros.",
    icon: <ArrowRightLeft />,
    color: "orange" as const,
  },
  {
    title: "Recibo",
    description:
      "Registrar la recepción de nuevos dispositivos o equipos devueltos.",
    icon: <FileCheck />,
    color: "purple" as const,
  },
]

export default function Procesos() {
  const [showAsignaciones, setShowAsignaciones] = useState(false)

  const handleProcessClick = (processTitle: string) => {
    switch (processTitle) {
      case "Asignación":
        setShowAsignaciones(true)
        break
      case "Cambio":
        alert("Módulo de Cambios - Próximamente disponible")
        break
      case "Traspaso":
        alert("Módulo de Traspasos - Próximamente disponible") 
        break
      case "Recibo":
        alert("Módulo de Recibos - Próximamente disponible")
        break
      default:
        console.log(`Clicked on ${processTitle} process`)
    }
  }

  return (
    <ProcessLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-8">
          <Settings className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Procesos de Dispositivos</h1>
            <p className="text-gray-600 mt-1">
              Gestiona los procesos relacionados con dispositivos y equipos del Instituto Geográfico Militar
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {processData.map((process, index) => (
            <ProcessCard
              key={index}
              title={process.title}
              description={process.description}
              icon={process.icon}
              color={process.color}
              onClick={() => handleProcessClick(process.title)}
            />
          ))}
        </div>

        {/* Métricas mejoradas */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Resumen de Procesos</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">12</div>
              <div className="text-sm text-blue-700 font-medium">Asignaciones Activas</div>
              <div className="text-xs text-blue-600 mt-1">+3 esta semana</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">5</div>
              <div className="text-sm text-green-700 font-medium">Cambios Pendientes</div>
              <div className="text-xs text-green-600 mt-1">-2 desde ayer</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600 mb-2">2</div>
              <div className="text-sm text-orange-700 font-medium">Traspasos en Proceso</div>
              <div className="text-xs text-orange-600 mt-1">En revisión</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">8</div>
              <div className="text-sm text-purple-700 font-medium">Recibos del Mes</div>
              <div className="text-xs text-purple-600 mt-1">Meta: 10</div>
            </div>
          </div>
        </div>

        {/* Información del sistema */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Información del Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Horarios de Atención</h3>
              <p>Lunes a Jueves: 8:00 AM - 5:00 PM</p>
              <p>Viernes: 8:00 AM - 4:00 PM</p>
              <p className="text-blue-600 font-medium mt-1">Asignaciones disponibles 24/7</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Contacto de Soporte</h3>
              <p>Email: soporte@igm.cl</p>
              <p>Teléfono: 63340</p>
              <p className="text-green-600 font-medium mt-1">Mesa de ayuda: Activa</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Política de Asignaciones</h3>
              <p>• Equipos disponibles solo para personal IGM</p>
              <p>• Máximo 2 equipos por usuario</p>
              <p>• Devolución obligatoria al cambio de cargo</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Asignaciones */}
      <AsignacionesModal 
        open={showAsignaciones} 
        onClose={() => setShowAsignaciones(false)} 
      />
    </ProcessLayout>
  )
}
