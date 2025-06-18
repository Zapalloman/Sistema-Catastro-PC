"use client"

import { useState } from "react"
import { ProcessLayout } from "./components/process-layout"
import { LoansTable } from "./components/loans-table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Filter } from "lucide-react"

// Loan filter options - easily customizable for company needs
const loanFilterOptions = [
  { value: "TODOS", label: "Todos los Préstamos" },
  { value: "NULL", label: "Placeholder" },
]

export default function Prestamos() {
  const [selectedFilter, setSelectedFilter] = useState("")

  const handleFilterSelect = () => {
    if (selectedFilter) {
      console.log("Selected filter:", selectedFilter)
      // TODO: Filter table data based on selected filter
      // This can be easily extended to load different loan sets
    }
  }

  return (
    <ProcessLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Users className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Préstamos Medios de Almacenamiento</h1>
            <p className="text-gray-600 mt-1">
              Gestiona los préstamos de dispositivos de almacenamiento. Visualiza, edita y controla todos los préstamos
              activos, pendientes y disponibles.
            </p>
          </div>
        </div>

        {/* Filter Selection */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-4 mb-6">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filtrar préstamos</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Dispositivo</label>
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un tipo de dispositivo..." />
                </SelectTrigger>
                <SelectContent>
                  {loanFilterOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleFilterSelect} disabled={!selectedFilter} className="mt-6">
              Aplicar Filtro
            </Button>
          </div>
        </div>

        {/* Loans Table */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <LoansTable />
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h3 className="font-semibold text-green-900 mb-2">Préstamos Activos</h3>
            <p className="text-2xl font-bold text-green-600">Null</p>
            <p className="text-sm text-green-700">Dispositivos en uso</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">Disponibles</h3>
            <p className="text-2xl font-bold text-blue-600">Null</p>
            <p className="text-sm text-blue-700">Listos para préstamo</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <h3 className="font-semibold text-orange-900 mb-2">Pendientes</h3>
            <p className="text-2xl font-bold text-orange-600">Null</p>
            <p className="text-sm text-orange-700">Esperando aprobación</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <h3 className="font-semibold text-red-900 mb-2">Dados de Baja</h3>
            <p className="text-2xl font-bold text-red-600">Null</p>
            <p className="text-sm text-red-700">Fuera de servicio</p>
          </div>
        </div>
      </div>
    </ProcessLayout>
  )
}
