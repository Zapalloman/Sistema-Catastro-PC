"use client"

import { ProcessLayout } from "./components/process-layout"
import { ProcessCard } from "./components/process-card"
import { UserPlus, RefreshCw, ArrowRightLeft, FileCheck, Settings } from "lucide-react"

// Process data - easy to modify later with company-specific information
const processData = [
  {
    title: "Asignación",
    description:
      "Asignar dispositivos y equipos a empleados o departamentos específicos. Gestiona la distribución inicial de recursos tecnológicos.",
    icon: <UserPlus />,
    color: "blue" as const,
    // Add more fields as needed for company data
    // department: "",
    // requiredFields: [],
    // workflow: [],
  },
  {
    title: "Cambio",
    description:
      "Procesar cambios de dispositivos existentes. Actualizar especificaciones, reparaciones o modificaciones de equipos asignados.",
    icon: <RefreshCw />,
    color: "green" as const,
    // Add more fields as needed
    // changeTypes: [],
    // approvalRequired: true,
  },
  {
    title: "Traspaso",
    description:
      "Transferir dispositivos entre empleados o departamentos. Gestiona el movimiento interno de equipos y actualiza registros.",
    icon: <ArrowRightLeft />,
    color: "orange" as const,
    // Add more fields as needed
    // transferTypes: [],
    // documentationRequired: [],
  },
  {
    title: "Recibo",
    description:
      "Registrar la recepción de nuevos dispositivos o equipos devueltos. Actualizar inventario y estado de dispositivos.",
    icon: <FileCheck />,
    color: "purple" as const,
    // Add more fields as needed
    // receiptTypes: [],
    // inspectionRequired: true,
  },
]

export default function Procesos() {
  const handleProcessClick = (processTitle: string) => {
    // TODO: Navigate to specific process page or open modal
    console.log(`Clicked on ${processTitle} process`)
    // This can be easily extended later with routing or modal logic
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

        {/* Information Section - Easy to customize */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Información Adicional</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Horarios de Atención</h3>
              <p>Lunes a Viernes: 8:00 AM - 6:00 PM</p>
              <p>Sábados: 9:00 AM - 1:00 PM</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Contacto de Soporte</h3>
              <p>Email: soporte@igm.gob.cl</p>
              <p>Teléfono: +56 2 2410 9000</p>
            </div>
          </div>
        </div>

        {/* Quick Stats - Can be populated with real data later */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">24</div>
            <div className="text-sm text-gray-600">Procesos Activos</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
            <div className="text-2xl font-bold text-green-600">156</div>
            <div className="text-sm text-gray-600">Completados Hoy</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">8</div>
            <div className="text-sm text-gray-600">Pendientes</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">342</div>
            <div className="text-sm text-gray-600">Total del Mes</div>
          </div>
        </div>
      </div>
    </ProcessLayout>
  )
}
