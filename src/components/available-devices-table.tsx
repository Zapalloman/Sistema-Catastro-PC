"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, ChevronRight, Search, Plus, Eye } from "lucide-react" // <-- AGREGAR Eye AQUÍ
import { AddDeviceModal } from "./add-device-modal"
import { EquipmentDetailModal } from "./equipment-detail-modal"

export function AvailableDevicesTable({ deviceType }: { deviceType: string }) {
  const [equipos, setEquipos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedEquipment, setSelectedEquipment] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  useEffect(() => {
    setLoading(true)
    let url = "http://localhost:3000/api/equipos/disponibles"
    if (deviceType && deviceType !== "TODOS") {
      url += `?categoria=${encodeURIComponent(deviceType)}`
    }
    
    console.log("Cargando equipos disponibles con URL:", url); // Debug log
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log("Equipos disponibles recibidos:", data); // Debug log
        setEquipos(Array.isArray(data) ? data : [])
      })
      .catch(() => setError("No se pudo cargar la lista de equipos disponibles"))
      .finally(() => setLoading(false))
  }, [deviceType])

  // Filtro de búsqueda
  const filteredData = equipos.filter(eq =>
    (eq.nombre_pc || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (eq.numero_serie || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (eq.categoria?.desc_tipo || eq.categoria || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (eq.almacenamiento || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (eq.marca?.des_ti_marca || eq.marca?.nombre || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (eq.ubicacion?.des_ti_ubicacion || eq.ubicacion?.nombre || "").toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Paginación
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  const handleViewDetails = (equipment: any) => {
    // Mapear los datos al formato esperado por el modal
    const mappedEquipment = {
      ...equipment,
      serie: equipment.numero_serie,
      nombrePC: equipment.nombre_pc,
      modeloPC: equipment.modelo,
      categoria: equipment.categoria?.desc_tipo || equipment.categoria,
      marca: equipment.marca?.des_ti_marca || equipment.marca?.nombre,
      ubicacion: equipment.ubicacion?.des_ti_ubicacion || equipment.ubicacion?.nombre,
      propietario: equipment.propietario?.nombre,
      fechaAdquisicion: equipment.fecha_adquisicion,
      llave_inventario: equipment.llave_inventario,
      disco: equipment.almacenamiento,
      ram: equipment.memoria_ram,
      procesador: equipment.procesador,
      version_sistema_operativo: equipment.version_sistema_operativo,
      version_office: equipment.version_office,
      ip: equipment.ip,
      // Como está en la tabla de disponibles, siempre es DISPONIBLE
      estadoPrestamo: "DISPONIBLE"
    }
    setSelectedEquipment(mappedEquipment)
    setIsDetailModalOpen(true)
  }

  if (loading) return <div>Cargando...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="space-y-4">
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
              <TableHead className="font-semibold text-gray-700">Modelo</TableHead>
              <TableHead className="font-semibold text-gray-700">Capacidad</TableHead>
              <TableHead className="font-semibold text-gray-700">Categoría</TableHead>
              <TableHead className="font-semibold text-gray-700">Marca</TableHead>
              <TableHead className="font-semibold text-gray-700">Ubicación</TableHead>
              <TableHead className="font-semibold text-gray-700">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  No hay equipos disponibles para los criterios seleccionados.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((equipo) => (
                <TableRow key={equipo.id_equipo} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{equipo.nombre_pc || "-"}</TableCell>
                  <TableCell className="font-mono text-sm">{equipo.numero_serie || "-"}</TableCell>
                  <TableCell>{equipo.modelo || "-"}</TableCell>
                  <TableCell>{equipo.almacenamiento || "-"}</TableCell>
                  <TableCell>{equipo.categoria?.desc_tipo || equipo.categoria || "-"}</TableCell>
                  <TableCell>{equipo.marca?.des_ti_marca || equipo.marca?.nombre || "-"}</TableCell>
                  <TableCell>{equipo.ubicacion?.des_ti_ubicacion || equipo.ubicacion?.nombre || "-"}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-blue-500 hover:bg-blue-600 text-white border-blue-500"
                      onClick={() => handleViewDetails(equipo)}
                      title="Ver detalles"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
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

      {/* Modal de detalles del equipo */}
      <EquipmentDetailModal
        equipment={selectedEquipment}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />

      {/* Modal agregar dispositivo (si existe) */}
      {showAddModal && (
        <AddDeviceModal
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdded={() => {
            setShowAddModal(false)
            // Recargar datos
            window.location.reload()
          }}
        />
      )}
    </div>
  )
}