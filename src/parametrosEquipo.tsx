"use client"

import { useState } from "react"
import { ProcessLayout } from "./components/process-layout"
import { EquipmentParametersTable } from "./components/equipment-parameters-table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Monitor, Filter } from "lucide-react"

// Equipment parameter options - specific to hardware and equipment
const equipmentParameterOptions = [
  { value: "TIPO EQUIPO", label: "Tipo de Equipo" },
  { value: "MARCA EQUIPO", label: "Marca de Equipo" },
  { value: "SISTEMA OPERATIVO", label: "Sistema Operativo" },
  { value: "PROCESADOR", label: "Procesador" },
  { value: "MEMORIA RAM", label: "Memoria RAM" },
  { value: "ALMACENAMIENTO", label: "Almacenamiento" },
]

export default function ParametrosEquipo() {
  const [selectedParameter, setSelectedParameter] = useState("")

  const handleParameterSelect = () => {
    if (selectedParameter) {
      console.log("Selected equipment parameter:", selectedParameter)
      // TODO: Filter table data based on selected parameter
      // This can be easily extended to load different parameter sets
    }
  }

  return (
    <ProcessLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Monitor className="w-8 h-8 text-green-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Parámetros de Equipos</h1>
            <p className="text-gray-600 mt-1">
              Gestiona los parámetros específicos de equipos de cómputo. Configura tipos de hardware, especificaciones
              técnicas y características de los equipos del Instituto Geográfico Militar.
            </p>
          </div>
        </div>

        {/* Parameter Selection */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-4 mb-6">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Seleccione parámetro de equipo</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Parámetro</label>
              <Select value={selectedParameter} onValueChange={setSelectedParameter}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un parámetro de equipo..." />
                </SelectTrigger>
                <SelectContent>
                  {equipmentParameterOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleParameterSelect}
              disabled={!selectedParameter}
              className="mt-6 bg-green-600 hover:bg-green-700"
            >
              Entrar
            </Button>
          </div>
        </div>

        {/* Equipment Parameters Table */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <EquipmentParametersTable selectedParameterType={selectedParameter} />
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h3 className="font-semibold text-green-900 mb-2">Parámetros de Equipos</h3>
            <p className="text-2xl font-bold text-green-600">6</p>
            <p className="text-sm text-green-700">Tipos configurados</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">Última Actualización</h3>
            <p className="text-sm text-blue-700">2024-06-20</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <h3 className="font-semibold text-orange-900 mb-2">Equipos Registrados</h3>
            <p className="text-2xl font-bold text-orange-600">45</p>
            <p className="text-sm text-orange-700">Con parámetros asignados</p>
          </div>
        </div>
      </div>
    </ProcessLayout>
  )
}
