"use client"

import { useState } from "react"
import { ProcessLayout } from "./components/process-layout"
import { ParametersTable } from "./components/parameters-table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings2, Filter } from "lucide-react"

// Parameter options - easily customizable for company needs
const parameterOptions = [
  //seleccione una opcion

  { value: "RED", label: "Red" },
  { value: "GRADO", label: "Grado" },
  { value: "CARGO", label: "Cargo" },
  { value: "EDIFICIO", label: "Edificio" },
  { value: "UBICACION", label: "Ubicacion" },
  { value: "DEPARTAMENTOS", label: "Departamentos" },
  { value: "DOMINIO DE RED", label: "Dominio de Red" },
  { value: "PROPIETARIO EQUIPO", label: "Propietario Equipo" },
]

export default function ParametrosGenerales() {
  const [selectedParameter, setSelectedParameter] = useState("")

  const handleParameterSelect = () => {
    if (selectedParameter) {
      console.log("Selected parameter:", selectedParameter)
      // TODO: Filter table data based on selected parameter
      // This can be easily extended to load different parameter sets
    }
  }

  return (
    <ProcessLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Settings2 className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Parámetros Generales</h1>
            <p className="text-gray-600 mt-1">
              Visualiza y gestiona los parámetros dentro de la plataforma. Aquí puedes seleccionar y filtrar diferentes
              parámetros para personalizar la visualización de datos.
            </p>
          </div>
        </div>

        {/* Parameter Selection */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-4 mb-6">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Seleccione parámetro</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">Opción</label>
              <Select value={selectedParameter} onValueChange={setSelectedParameter}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un tipo de parámetro..." />
                </SelectTrigger>
                <SelectContent>
                  {parameterOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleParameterSelect} disabled={!selectedParameter} className="mt-6">
              Entrar
            </Button>
          </div>
        </div>

        {/* Parameters Table */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <ParametersTable selectedParameterType={selectedParameter} />
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">Parámetros Activos</h3>
            <p className="text-2xl font-bold text-blue-600">0</p>
            <p className="text-sm text-blue-700">Configuraciones en uso</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h3 className="font-semibold text-green-900 mb-2">Última Actualización</h3>
            <p className="text-sm text-green-700">null</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <h3 className="font-semibold text-orange-900 mb-2">Pendientes</h3>
            <p className="text-2xl font-bold text-orange-600">0</p>
            <p className="text-sm text-orange-700">Requieren revisión</p>
          </div>
        </div>
      </div>
    </ProcessLayout>
  )
}
