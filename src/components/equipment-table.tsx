"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Search, Download, ChevronLeft, ChevronRight, Eye, Monitor } from "lucide-react"
import { EquipmentDetailModal } from "./equipment-detail-modal"
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"



interface EquipmentTableProps {
  selectedPropietario: string
  refresh: boolean
  onCountChange?: (count: number) => void
}

export function EquipmentTable({ selectedPropietario, refresh, onCountChange }: EquipmentTableProps) {
  const [equipos, setEquipos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    setLoading(true)
    fetch("http://localhost:3000/api/equipos")
      .then(res => res.json())
      .then(data => {
        // Mapea los campos del backend a los que usa tu tabla
        const mapped = data.map((eq: any) => ({
          serie: eq.numero_serie || "",
          modeloPC: eq.modelo || "",
          disco: eq.almacenamiento || "",
          ram: eq.ram || "",
          procesador: eq.procesador || "",
          velocidad: "", // Si tienes un campo de velocidad, mapea aquí
          marca: eq.marca || "",
          mac: eq.direccion_mac || "",
          ip: eq.ip || "",
          nombrePC: eq.nombre_pc || "",
          propietario: eq.propietario || "",
          id_propietario: eq.id_propietario, // <-- AGREGA ESTA LÍNEA
          ubicacion: eq.ubicacion || "",
          id_equipo: eq.id_equipo,
          // agrega otros campos si los necesitas
        }))
        setEquipos(mapped)
      })
      .catch(() => setError("No se pudo cargar la lista de equipos"))
      .finally(() => setLoading(false))
  }, [refresh])

  // Filtrado por propietario (si aplica)
  const filteredData = selectedPropietario === "TODOS"
    ? equipos
    : equipos.filter(eq => eq.id_propietario?.toString() === selectedPropietario)

  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedEquipment, setSelectedEquipment] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Filter data based on search term and selected propietario
  const dataToDisplay = filteredData.filter((equipment) => {
    const matchesSearch =
      equipment.nombrePC.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.serie.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.modeloPC.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.ip.includes(searchTerm)
    return matchesSearch
  })

  // Pagination logic
  const totalPages = Math.ceil(dataToDisplay.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = dataToDisplay.slice(startIndex, startIndex + itemsPerPage)

  const handleViewDetails = (equipment: any) => {
    setSelectedEquipment(equipment)
    setIsModalOpen(true)
  }

  const handleEdit = (equipment: any) => {
    console.log("Edit equipment:", equipment)
    // TODO: Implement edit functionality
  }

  const handleDelete = (equipment: any) => {
    console.log("Delete equipment:", equipment)
    // TODO: Implement delete functionality
  }

  const handleExport = () => {
    console.log("Exporting data to Excel")
    // Exporta solo los datos visibles en la tabla
    const exportData = dataToDisplay.map(({ id_equipo, ...row }) => row) // quita id_equipo si no quieres exportarlo
    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Equipos")
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" })
    saveAs(blob, "equipos.xlsx")
  }

  useEffect(() => {
    if (onCountChange) {
      onCountChange(dataToDisplay.length)
    }
  }, [dataToDisplay.length, onCountChange])

  if (loading) return <div>Cargando...</div>
  if (error) return <div>{error}</div>

  // Encuentra el nombre del propietario seleccionado
  const propietarioSeleccionado = equipos.find(eq => eq.id_propietario?.toString() === selectedPropietario)
  const propietarioNombre = propietarioSeleccionado ? propietarioSeleccionado.propietario : ""

  return (
    <div className="space-y-4">
      {/* Search and Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar equipos..."
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

        <Button onClick={handleExport} className="bg-green-600 hover:bg-green-700">
          <Download className="w-4 h-4 mr-2" />
          Exportar Excel
        </Button>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Mostrando {dataToDisplay.length} equipo{dataToDisplay.length !== 1 ? "s" : ""}
          {selectedPropietario !== "TODOS" && propietarioNombre && ` para ${propietarioNombre}`}
        </span>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-blue-500 text-white p-3">
          <h3 className="font-medium flex items-center gap-2">
            <Monitor className="w-4 h-4" />
            Equipos de Cómputo
          </h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="font-semibold text-gray-700">Serie</TableHead>
              <TableHead className="font-semibold text-gray-700">Modelo PC</TableHead>
              <TableHead className="font-semibold text-gray-700">Disco</TableHead>
              <TableHead className="font-semibold text-gray-700">RAM</TableHead>
              <TableHead className="font-semibold text-gray-700">Procesador</TableHead>
              <TableHead className="font-semibold text-gray-700">Velocidad</TableHead>
              <TableHead className="font-semibold text-gray-700">Marca</TableHead>
              <TableHead className="font-semibold text-gray-700">MAC</TableHead>
              <TableHead className="font-semibold text-gray-700">IP</TableHead>
              <TableHead className="font-semibold text-gray-700">Nombre PC</TableHead>
              <TableHead className="font-semibold text-gray-700">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-8 text-gray-500">
                  No se encontraron equipos para los criterios seleccionados
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((equipment, index) => (
                <TableRow key={`${equipment.serie}-${index}`} className="hover:bg-gray-50">
                  <TableCell className="font-mono text-xs">{equipment.serie}</TableCell>
                  <TableCell>{equipment.modeloPC}</TableCell>
                  <TableCell>{equipment.disco}</TableCell>
                  <TableCell>{equipment.ram}</TableCell>
                  <TableCell className="max-w-32 truncate" title={equipment.procesador}>
                    {equipment.procesador}
                  </TableCell>
                  <TableCell>{equipment.velocidad}</TableCell>
                  <TableCell>{equipment.marca}</TableCell>
                  <TableCell className="font-mono text-xs">{equipment.mac}</TableCell>
                  <TableCell className="font-mono text-xs">{equipment.ip}</TableCell>
                  <TableCell className="font-semibold">{equipment.nombrePC}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-blue-500 hover:bg-blue-600 text-white border-blue-500"
                        onClick={() => handleViewDetails(equipment)}
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500"
                        onClick={() => handleEdit(equipment)}
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-red-500 hover:bg-red-600 text-white border-red-500"
                        onClick={() => handleDelete(equipment)}
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
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

          {/* Page numbers */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = i + 1
            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(pageNum)}
                className={currentPage === pageNum ? "bg-blue-500" : ""}
              >
                {pageNum}
              </Button>
            )
          })}

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

      {/* Equipment Detail Modal */}
      <EquipmentDetailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} equipment={selectedEquipment} />
    </div>
  )
}
