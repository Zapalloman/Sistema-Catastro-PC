"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Search, Download, ChevronLeft, ChevronRight, Eye, Monitor, User } from "lucide-react"
import { EquipmentDetailModal } from "./equipment-detail-modal"
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"

interface EquipmentTableProps {
  equipos: any[]
  selectedPropietario: string
  refresh: boolean
  onCountChange?: (count: number) => void
}

export function EquipmentTable({ equipos, selectedPropietario, refresh, onCountChange }: EquipmentTableProps) {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedCategoria, setSelectedCategoria] = useState("TODOS")
  const [categorias, setCategorias] = useState<any[]>([])
  const [selectedEquipment, setSelectedEquipment] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Filtrar equipos por propietario
  const filteredByCategoria = equipos

  useEffect(() => {
    fetch("http://localhost:3000/api/equipos/categorias")
      .then(res => res.json())
      .then(data => {
        const categoriasArray = Array.isArray(data) ? data : [];
        setCategorias(categoriasArray);
      })
      .catch(() => setError("No se pudo cargar las categorías"))
      .finally(() => setLoading(false))
  }, [])

  // Filter data based on search term, selected propietario, and selected categoria
  const dataToDisplay = filteredByCategoria.filter((equipment) => {
    const matchesSearch =
      equipment.nombrePC.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.serie.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.modeloPC.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.usuarioAsignado.toLowerCase().includes(searchTerm.toLowerCase()) || // NUEVO: Buscar por usuario
      equipment.ip.includes(searchTerm)

    const matchesCategoria = selectedCategoria === "TODOS" || equipment.categoria === selectedCategoria

    return matchesSearch && matchesCategoria
  })

  // Pagination logic
  const totalPages = Math.ceil(dataToDisplay.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = dataToDisplay.slice(startIndex, startIndex + itemsPerPage)

  const handleViewDetails = (equipment: any) => {
    const enhancedEquipment = {
      ...equipment,
      // CORREGIR: Mapear direccion_mac a mac para el modal
      mac: equipment.direccion_mac || equipment.mac || "", 
      fechaAsignacion: equipment.fecha_asignacion || equipment.fechaAdquisicion || "",
      fechaAdquisicion: equipment.fecha_adquisicion || equipment.fechaAdquisicion || "",
      estadoPrestamo: equipment.estadoPrestamo || "DISPONIBLE"
    }
    setSelectedEquipment(enhancedEquipment)
    setIsModalOpen(true)
  }

  const handleExport = () => {
    console.log("Exporting data to Excel")
    // Incluir la nueva columna en la exportación
    const exportData = dataToDisplay.map(({ id_equipo, ...row }) => ({
      ...row,
      usuarioAsignado: row.usuarioAsignado || "Sin asignar" // Mostrar "Sin asignar" en Excel si está vacío
    }))
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

  if (error) return <div>{error}</div>
  if (loading) return <div>Cargando...</div>

  // Encuentra el nombre del propietario seleccionado
  const propietarioSeleccionado = equipos.find(eq => eq.id_propietario?.toString() === selectedPropietario)
  const propietarioNombre = propietarioSeleccionado ? propietarioSeleccionado.propietario : ""

  // Utilidad para agrupar y contar (sin cambios)
  function groupCount(arr, keyFn) {
    const groups = {}
    arr.forEach(item => {
      const key = keyFn(item) || "Sin especificar"
      groups[key] = (groups[key] || 0) + 1
    })
    return Object.entries(groups)
      .map(([key, count]) => ({ key, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }

  // Estadísticas sin cambios
  const windowsCounts = groupCount(
    dataToDisplay.filter(eq => 
      eq.version_sistema_operativo && 
      eq.version_sistema_operativo.toLowerCase().includes('windows')
    ), 
    eq => eq.version_sistema_operativo
  )

  const officeCounts = groupCount(
    dataToDisplay.filter(eq => eq.version_office), 
    eq => eq.version_office
  )

  const marcaCounts = groupCount(dataToDisplay, eq => eq.marca || null)

  return (
    <div className="space-y-4">
      {/* Search and Controls - sin cambios */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar equipos o usuarios..."
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

        <div className="flex items-center gap-2">
          <Select value={selectedCategoria} onValueChange={setSelectedCategoria}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODOS">Todas las Categorías</SelectItem>
              {categorias.map((cat) => (
                <SelectItem key={cat.id_tipo} value={cat.desc_tipo}>
                  {cat.desc_tipo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={handleExport} className="bg-green-600 hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" />
            Exportar Excel
          </Button>
        </div>
      </div>

      {/* Results Summary - sin cambios */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">
          Mostrando {dataToDisplay.length} equipo{dataToDisplay.length !== 1 ? "s" : ""}
          {propietarioNombre && ` del propietario: ${propietarioNombre}`}
          {selectedCategoria !== "TODOS" && ` (Categoría: ${selectedCategoria})`}
        </span>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-x-auto w-full max-w-full mx-auto">
        <div className="bg-blue-500 text-white p-3">
          <h3 className="font-medium flex items-center gap-2">
            <Monitor className="w-4 h-4" />
            {selectedCategoria === "TODOS" ? "Equipos de Cómputo" : `Equipos: ${selectedCategoria}`}
          </h3>
        </div>
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="font-semibold text-gray-700 min-w-[70px]">Serie</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[110px]">Fecha de Adquisición</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[90px]">Llave de Inventario</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[90px]">Modelo PC</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[60px]">Disco</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[60px]">RAM</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[100px] truncate">Procesador</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[60px]">Marca</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[60px]">Categoria</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[70px]">Propietario</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[70px]">Ubicación</TableHead>
              {/* NUEVA COLUMNA */}
              <TableHead className="font-semibold text-gray-700 min-w-[120px]">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Usuario Asignado
                </div>
              </TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[120px]">Versión SO</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[100px]">Versión Office</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[50px] whitespace-nowrap text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={15} className="text-center py-8 text-gray-500">
                  No se encontraron equipos para los criterios seleccionados
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((equipment) => (
                <TableRow key={equipment.id_equipo}>
                  <TableCell className="font-mono text-xs">{equipment.serie}</TableCell>
                  <TableCell className="min-w-[110px]">
                    {equipment.fechaAdquisicion
                      ? equipment.fechaAdquisicion.split("T")[0].split("-").reverse().join("-")
                      : "-"}
                  </TableCell>
                  <TableCell className="min-w-[90px]">{equipment.llave_inventario}</TableCell>
                  <TableCell>{equipment.modeloPC}</TableCell>
                  <TableCell>{equipment.disco}</TableCell>
                  <TableCell>{equipment.ram}</TableCell>
                  <TableCell className="max-w-24 truncate" title={equipment.procesador}>
                    {equipment.procesador}
                  </TableCell>
                  <TableCell>{equipment.marca}</TableCell>
                  <TableCell>{equipment.categoria}</TableCell>
                  <TableCell>{equipment.propietario}</TableCell>
                  <TableCell>{equipment.ubicacion}</TableCell>
                  {/* NUEVA CELDA */}
                  <TableCell className="min-w-[120px]">
                    {equipment.usuarioAsignado ? (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-900" title={`RUT: ${equipment.usuarioAsignadoRut}`}>
                          {equipment.usuarioAsignado}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>{equipment.version_sistema_operativo || "-"}</TableCell>
                  <TableCell>{equipment.version_office || "-"}</TableCell>
                  <TableCell className="min-w-[50px] whitespace-nowrap text-center">
                    <div className="flex items-center gap-2 justify-center">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-blue-500 hover:bg-blue-600 text-white border-blue-500"
                        onClick={() => handleViewDetails(equipment)}
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination - sin cambios */}
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

          {(() => {
            const pageWindow = 5;
            let startPage = Math.max(1, currentPage - Math.floor(pageWindow / 2));
            let endPage = Math.min(totalPages, startPage + pageWindow - 1);
            if (endPage - startPage < pageWindow - 1) {
              startPage = Math.max(1, endPage - pageWindow + 1);
            }

            return Array.from({ length: endPage - startPage + 1 }, (_, i) => {
              const pageNum = startPage + i;
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
              );
            });
          })()}

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
      <EquipmentDetailModal
        equipment={selectedEquipment}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
