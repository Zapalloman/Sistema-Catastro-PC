"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, ChevronRight, Search, Plus } from "lucide-react"
import { AddDeviceModal } from "./add-device-modal" // Debes crear este componente

export function AvailableDevicesTable({ deviceType }: { deviceType: string }) {
  const [equipos, setEquipos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    setLoading(true)
    let url = "http://localhost:3000/api/equipos/disponibles"
    if (deviceType && deviceType !== "TODOS") url += `?categoria=${deviceType}`
    fetch(url)
      .then(res => res.json())
      .then(data => setEquipos(Array.isArray(data) ? data : []))
      .catch(() => setError("No se pudo cargar la lista de equipos disponibles"))
      .finally(() => setLoading(false))
  }, [deviceType])

  // Filtro de búsqueda
  const filteredData = equipos.filter(eq =>
    (eq.nombre_pc || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (eq.numero_serie || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (eq.categoria || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (eq.almacenamiento || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (eq.marca?.nombre || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (eq.ubicacion?.nombre || "").toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Paginación
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  if (loading) return <div>Cargando...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="space-y-4">
      {/* Acciones y filtros */}
      <div className="flex items-center gap-4">
        <Button onClick={() => setShowAddModal(true)} className="bg-teal-500 hover:bg-teal-600">
          <Plus className="w-4 h-4 mr-2" />
          Agregar Dispositivo
        </Button>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="font-semibold text-gray-700">Nombre PC</TableHead>
              <TableHead className="font-semibold text-gray-700">Serie</TableHead>
              <TableHead className="font-semibold text-gray-700">Tipo</TableHead>
              <TableHead className="font-semibold text-gray-700">Capacidad</TableHead>
              <TableHead className="font-semibold text-gray-700">Marca</TableHead>
              <TableHead className="font-semibold text-gray-700">Ubicación</TableHead>
              <TableHead className="font-semibold text-gray-700">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No hay dispositivos disponibles para los criterios seleccionados
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((eq, index) => (
                <TableRow key={`${eq.id_equipo}-${index}`} className="hover:bg-gray-50">
                  <TableCell>{eq.nombre_pc}</TableCell>
                  <TableCell className="font-mono text-xs">{eq.numero_serie}</TableCell>
                  <TableCell>{eq.categoria}</TableCell>
                  <TableCell>{eq.almacenamiento}</TableCell>
                  <TableCell>{eq.marca?.nombre || "-"}</TableCell>
                  <TableCell>{eq.ubicacion?.nombre || "-"}</TableCell>
                  <TableCell>
                    <Badge variant="default" className="bg-blue-500">
                      DISPONIBLE
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
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

      {/* Modal para agregar dispositivo */}
      <AddDeviceModal open={showAddModal} onClose={() => setShowAddModal(false)} onDeviceAdded={() => {
        setLoading(true)
        fetch("http://localhost:3000/api/equipos/disponibles")
          .then(res => res.json())
          .then(data => setEquipos(Array.isArray(data) ? data : []))
          .catch(() => setError("No se pudo cargar la lista de equipos disponibles"))
          .finally(() => setLoading(false))
      }} />
    </div>
  )
}