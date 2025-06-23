"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Search, Download, ChevronLeft, ChevronRight } from "lucide-react"
import { EquipmentParameterDetailModal } from "./equipment-parameter-detail-modal"

// Equipment-specific parameter data sets
const equipmentParameterDataSets = {
  "TIPO EQUIPO": [
    { codigo: 0, descripcion: "NO DEFINIDO", estado: "ACTIVO" },
    { codigo: 1, descripcion: "WORKSTATION", estado: "ACTIVO" },
    { codigo: 2, descripcion: "SERVIDOR", estado: "ACTIVO" },
    { codigo: 3, descripcion: "LAPTOP", estado: "ACTIVO" },
    { codigo: 4, descripcion: "IMPRESORA", estado: "ACTIVO" },
    { codigo: 5, descripcion: "SCANNER", estado: "ACTIVO" },
    { codigo: 6, descripcion: "PROYECTOR", estado: "ACTIVO" },
  ],
  "MARCA EQUIPO": [
    { codigo: 0, descripcion: "NO DEFINIDO", estado: "ACTIVO" },
    { codigo: 1, descripcion: "DELL", estado: "ACTIVO" },
    { codigo: 2, descripcion: "HP", estado: "ACTIVO" },
    { codigo: 3, descripcion: "LENOVO", estado: "ACTIVO" },
    { codigo: 4, descripcion: "ASUS", estado: "ACTIVO" },
    { codigo: 5, descripcion: "ACER", estado: "ACTIVO" },
    { codigo: 6, descripcion: "APPLE", estado: "ACTIVO" },
  ],
  "SISTEMA OPERATIVO": [
    { codigo: 0, descripcion: "NO DEFINIDO", estado: "ACTIVO" },
    { codigo: 1, descripcion: "WINDOWS 11 PRO", estado: "ACTIVO" },
    { codigo: 2, descripcion: "WINDOWS 10 PRO", estado: "ACTIVO" },
    { codigo: 3, descripcion: "UBUNTU 22.04 LTS", estado: "ACTIVO" },
    { codigo: 4, descripcion: "CENTOS 8", estado: "ACTIVO" },
    { codigo: 5, descripcion: "MACOS MONTEREY", estado: "ACTIVO" },
  ],
  PROCESADOR: [
    { codigo: 0, descripcion: "NO DEFINIDO", estado: "ACTIVO" },
    { codigo: 1, descripcion: "INTEL CORE I3", estado: "ACTIVO" },
    { codigo: 2, descripcion: "INTEL CORE I5", estado: "ACTIVO" },
    { codigo: 3, descripcion: "INTEL CORE I7", estado: "ACTIVO" },
    { codigo: 4, descripcion: "INTEL CORE I9", estado: "ACTIVO" },
    { codigo: 5, descripcion: "AMD RYZEN 5", estado: "ACTIVO" },
    { codigo: 6, descripcion: "AMD RYZEN 7", estado: "ACTIVO" },
    { codigo: 7, descripcion: "AMD RYZEN 9", estado: "ACTIVO" },
  ],
  "MEMORIA RAM": [
    { codigo: 0, descripcion: "NO DEFINIDO", estado: "ACTIVO" },
    { codigo: 1, descripcion: "4GB DDR4", estado: "ACTIVO" },
    { codigo: 2, descripcion: "8GB DDR4", estado: "ACTIVO" },
    { codigo: 3, descripcion: "16GB DDR4", estado: "ACTIVO" },
    { codigo: 4, descripcion: "32GB DDR4", estado: "ACTIVO" },
    { codigo: 5, descripcion: "64GB DDR4", estado: "ACTIVO" },
  ],
  ALMACENAMIENTO: [
    { codigo: 0, descripcion: "NO DEFINIDO", estado: "ACTIVO" },
    { codigo: 1, descripcion: "HDD 500GB", estado: "ACTIVO" },
    { codigo: 2, descripcion: "HDD 1TB", estado: "ACTIVO" },
    { codigo: 3, descripcion: "SSD 256GB", estado: "ACTIVO" },
    { codigo: 4, descripcion: "SSD 512GB", estado: "ACTIVO" },
    { codigo: 5, descripcion: "SSD 1TB", estado: "ACTIVO" },
    { codigo: 6, descripcion: "NVME 512GB", estado: "ACTIVO" },
    { codigo: 7, descripcion: "NVME 1TB", estado: "ACTIVO" },
  ],
}

interface EquipmentParametersTableProps {
  selectedParameterType?: string
}

export function EquipmentParametersTable({ selectedParameterType = "TIPO EQUIPO" }: EquipmentParametersTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [selectedParameter, setSelectedParameter] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Get current parameter data based on selected type
  const currentParameterData =
    equipmentParameterDataSets[selectedParameterType as keyof typeof equipmentParameterDataSets] ||
    equipmentParameterDataSets["TIPO EQUIPO"]

  // Filter data based on search term
  const filteredData = currentParameterData.filter(
    (param) =>
      param.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      param.codigo.toString().includes(searchTerm),
  )

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  const handleViewDetails = (parameter: any) => {
    // Create enhanced parameter details for equipment
    const enhancedParameter = {
      ...parameter,
      tipo: selectedParameterType,
      fechaCreacion: "2024-02-10",
      ultimaModificacion: "2024-06-20",
      usuario: "admin-equipos@igm.gob.cl",
      categoria: getEquipmentParameterCategory(selectedParameterType),
      observaciones: getEquipmentParameterObservations(selectedParameterType, parameter.descripcion),
      equiposAsociados: getAssociatedEquipment(selectedParameterType, parameter.descripcion),
    }
    setSelectedParameter(enhancedParameter)
    setIsModalOpen(true)
  }

  const getEquipmentParameterCategory = (type: string) => {
    const categories = {
      "TIPO EQUIPO": "Clasificación de Hardware",
      "MARCA EQUIPO": "Fabricantes y Proveedores",
      "SISTEMA OPERATIVO": "Software de Sistema",
      PROCESADOR: "Componentes de Procesamiento",
      "MEMORIA RAM": "Componentes de Memoria",
      ALMACENAMIENTO: "Dispositivos de Almacenamiento",
    }
    return categories[type as keyof typeof categories] || "Equipamiento"
  }

  const getEquipmentParameterObservations = (type: string, description: string) => {
    const observations = {
      "TIPO EQUIPO": `Clasificación de equipo: ${description}. Define el tipo de hardware y sus capacidades operativas.`,
      "MARCA EQUIPO": `Fabricante: ${description}. Determina las especificaciones técnicas y soporte disponible.`,
      "SISTEMA OPERATIVO": `Sistema operativo: ${description}. Define la plataforma de software y compatibilidad.`,
      PROCESADOR: `Procesador: ${description}. Determina la capacidad de procesamiento y rendimiento del equipo.`,
      "MEMORIA RAM": `Memoria RAM: ${description}. Define la capacidad de memoria y rendimiento multitarea.`,
      ALMACENAMIENTO: `Almacenamiento: ${description}. Especifica la capacidad y tipo de almacenamiento de datos.`,
    }
    return observations[type as keyof typeof observations] || `Parámetro de equipo configurado para ${description}`
  }

  const getAssociatedEquipment = (type: string, description: string) => {
    // Return sample associated equipment based on parameter type
    const equipmentMap = {
      WORKSTATION: ["IGM-WS-001", "IGM-WS-002", "IGM-WS-003"],
      DELL: ["IGM-PC-001", "IGM-PC-005", "IGM-PC-008"],
      "WINDOWS 11 PRO": ["IGM-PC-001", "IGM-PC-002", "IGM-PC-003"],
      "INTEL CORE I7": ["IGM-WS-001", "IGM-PC-002"],
      "16GB DDR4": ["IGM-WS-001", "IGM-PC-002", "IGM-PC-003"],
      "SSD 512GB": ["IGM-PC-001", "IGM-PC-002"],
    }
    return equipmentMap[description as keyof typeof equipmentMap] || []
  }

  const handleEdit = (parameter: any) => {
    console.log("Edit equipment parameter:", parameter)
    // TODO: Implement edit functionality
  }

  const handleDelete = (parameter: any) => {
    console.log("Delete equipment parameter:", parameter)
    // TODO: Implement delete functionality
  }

  const handleExport = () => {
    console.log("Export equipment parameters to Excel")
    // TODO: Implement Excel export functionality
  }

  return (
    <div className="space-y-4">
      {/* Current Parameter Type Indicator */}
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
          Parámetros de Equipo: {selectedParameterType}
        </Badge>
      </div>

      {/* Search and Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Mostrar</span>
            <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-600">registros por página</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-green-500 text-white p-3">
          <h3 className="font-medium">Parámetros de Equipos - {selectedParameterType}</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="font-semibold text-gray-700">Código</TableHead>
              <TableHead className="font-semibold text-gray-700">Descripción</TableHead>
              <TableHead className="font-semibold text-gray-700">Estado</TableHead>
              <TableHead className="font-semibold text-gray-700">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((parameter) => (
              <TableRow key={parameter.codigo} className="hover:bg-gray-50">
                <TableCell className="font-medium">{parameter.codigo}</TableCell>
                <TableCell>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-blue-600 hover:text-blue-800"
                    onClick={() => handleViewDetails(parameter)}
                  >
                    {parameter.descripcion}
                  </Button>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={parameter.estado === "ACTIVO" ? "default" : "secondary"}
                    className={parameter.estado === "ACTIVO" ? "bg-green-500" : "bg-gray-500"}
                  >
                    {parameter.estado}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500"
                      onClick={() => handleEdit(parameter)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-red-500 hover:bg-red-600 text-white border-red-500"
                      onClick={() => handleDelete(parameter)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination and Export */}
      <div className="flex items-center justify-between">
        <Button onClick={handleExport} className="bg-gray-600 hover:bg-gray-700">
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Mostrando página {currentPage} de {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Equipment Parameter Detail Modal */}
      <EquipmentParameterDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        parameter={selectedParameter}
      />
    </div>
  )
}
