"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Search, Download, ChevronLeft, ChevronRight } from "lucide-react"
import { ParameterDetailModal } from "./parameter-detail-modal"

// Sample data - easily replaceable with real company data
const sampleParameters = [
  { codigo: 0, descripcion: "NO DEFINIDO", estado: "ACTIVO" },
  //reemplazar con datos de la base de datos
]

export function ParametersTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [selectedParameter, setSelectedParameter] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Filter data based on search term
  const filteredData = sampleParameters.filter(
    (param) =>
      param.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      param.codigo.toString().includes(searchTerm),
  )

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  const handleViewDetails = (parameter: any) => {
    setSelectedParameter({
      ...parameter,
      detalles: {
        fechaCreacion: "2024-01-15",
        ultimaModificacion: "2024-06-18",
        usuario: "admin@igm.gob.cl",
        categoria: "Sistema",
        observaciones: "Parámetro configurado para el sistema de catastro",
      },
    })
    setIsModalOpen(true)
  }

  const handleEdit = (parameter: any) => {
    console.log("Edit parameter:", parameter)
    // TODO: Implement edit functionality
  }

  const handleDelete = (parameter: any) => {
    console.log("Delete parameter:", parameter)
    // TODO: Implement delete functionality
  }

  const handleExport = () => {
    console.log("Export data to Excel")
    // TODO: Implement Excel export functionality
  }

  return (
    <div className="space-y-4">
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
        <div className="bg-teal-500 text-white p-3">
          <h3 className="font-medium">Parámetros del Sistema</h3>
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

      {/* PESTAÑA DETALLES LISTA */}
      <ParameterDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        parameter={selectedParameter}
        columns={["equipo", "usuario"]}
        relatedData={[
          { equipo: "PC-01", usuario: "Juan" },
          { equipo: "PC-02", usuario: "Ana" }
        ]}
      />
    </div>
  )
}
