"use client"

import { useState } from "react"
import { ProcessLayout } from "./components/process-layout"
import { EquipmentTable } from "./components/equipment-table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Monitor, Filter, Plus } from "lucide-react"

// Equipment owners - easily customizable for company needs
const propietarioOptions = [
  { value: "TODOS", label: "Todos los Propietarios" },
  { value: "IGM", label: "IGM" },
  { value: "INFOWORLD", label: "INFOWORLD" }
  //cambiar en backend
]

export default function Equipos() {
  const [selectedPropietario, setSelectedPropietario] = useState("TODOS")

  const handleAddEquipment = () => {
    console.log("Add new equipment")
    // TODO: Implement add equipment functionality
  }

  return (
    <ProcessLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Monitor className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Equipos</h1>
            <p className="text-gray-600 mt-1">
              Gestiona y visualiza todos los equipos de cómputo del Instituto Geográfico Militar. Filtra por propietario
              para ver información detallada de cada equipo.
            </p>
          </div>
        </div>

        {/* Filter Selection */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-4 mb-6">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filtrar por Propietario de Equipos</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">Propietario</label>
              <Select value={selectedPropietario} onValueChange={setSelectedPropietario}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un propietario..." />
                </SelectTrigger>
                <SelectContent>
                  {propietarioOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddEquipment} className="mt-6 bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Equipo
            </Button>
          </div>
        </div>

        {/* Equipment Table */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <EquipmentTable selectedPropietario={selectedPropietario} />
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">Total Equipos</h3>
            <p className="text-2xl font-bold text-blue-600">0</p>
            <p className="text-sm text-blue-700">Equipos registrados</p>
          </div>
        </div>
      </div>
    </ProcessLayout>
  )
}
