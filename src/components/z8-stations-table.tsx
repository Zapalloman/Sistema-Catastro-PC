"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Search, Download, ChevronLeft, ChevronRight, Eye, Wifi, WifiOff, Plus } from "lucide-react"
import { Z8StationModal } from "./z8-stations-modal"
import { AddZ8EquipmentModal } from "./add-z8-equipment-modal"
import { Z8StationDetailsModal } from "./z8-station-details-modal"

interface Z8Equipment {
  id_equipo: number;
  numero_serie: string;
  modelo: string;
  nombre_pc: string;
  almacenamiento: string;
  ram: string;
  procesador: string;
  ip: string;
  direccion_mac: string;
  marca: string;
  ubicacion: string;
  propietario: string;
  estado_asignacion: string;
  usuario_asignado?: string;
  usuario_asignado_nombre?: string;
  fecha_asignacion?: string;
  version_sistema_operativo?: string;
  version_office?: string;
}

interface Z8Categoria {
  categoria: string;
  cantidad: number;
}

export function Z8StationsTable() {
  const [equipos, setEquipos] = useState<Z8Equipment[]>([])
  const [categorias, setCategorias] = useState<Z8Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [activeFilter, setActiveFilter] = useState("TODOS")
  const [selectedStation, setSelectedStation] = useState<Z8Equipment | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Cargar equipos Z8
  const loadEquipos = async () => {
    try {
      setLoading(true)
      
      let url = "http://localhost:3000/api/equipos-z8"
      
      if (activeFilter !== "TODOS") {
        if (activeFilter === "ASIGNADO" || activeFilter === "DISPONIBLE") {
          // Para filtros de estado, usar el endpoint principal y filtrar
          const response = await fetch(url)
          const allData = await response.json()
          const filteredData = Array.isArray(allData) 
            ? allData.filter(eq => eq.estado_asignacion === activeFilter)
            : []
          setEquipos(filteredData)
          console.log(`📊 ${filteredData.length} equipos Z8 ${activeFilter} cargados`)
          return
        } else {
          url += `/categoria/${activeFilter}`
        }
      }
      
      const response = await fetch(url)
      const data = await response.json()
      setEquipos(Array.isArray(data) ? data : [])
      console.log(`📊 ${data.length} equipos Z8 cargados`)
    } catch (error) {
      console.error("Error al cargar equipos Z8:", error)
      setError("No se pudieron cargar los equipos Z8")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEquipos()
  }, [activeFilter])

  // Cargar categorías
  useEffect(() => {
    const loadCategorias = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/equipos-z8/categorias")
        const data = await response.json()
        setCategorias(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Error al cargar categorías Z8:", error)
      }
    }

    loadCategorias()
  }, [])

  // ✅ FILTROS CON DISEÑO DE MAC - Adaptados para Z8
  const statusFilters = [
    { value: "TODOS", label: "Todas las Estaciones", icon: Wifi, count: equipos.length },
    { value: "ASIGNADO", label: "Asignadas", icon: Wifi, count: equipos.filter(eq => eq.estado_asignacion === "ASIGNADO").length },
    { value: "DISPONIBLE", label: "Disponibles", icon: WifiOff, count: equipos.filter(eq => eq.estado_asignacion === "DISPONIBLE").length },
  ]

  // Filtrar equipos por búsqueda y filtro activo
  const filteredEquipos = equipos.filter((equipo) => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = (
      (equipo.nombre_pc || "").toLowerCase().includes(searchLower) ||
      (equipo.numero_serie || "").toLowerCase().includes(searchLower) ||
      (equipo.modelo || "").toLowerCase().includes(searchLower) ||
      (equipo.ip || "").toLowerCase().includes(searchLower) ||
      (equipo.usuario_asignado_nombre || "").toLowerCase().includes(searchLower) ||
      (equipo.marca || "").toLowerCase().includes(searchLower)
    )

    const matchesFilter = activeFilter === "TODOS" || equipo.estado_asignacion === activeFilter

    return matchesSearch && matchesFilter
  })

  // Paginación
  const totalPages = Math.ceil(filteredEquipos.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredEquipos.slice(startIndex, startIndex + itemsPerPage)

  const handleViewDetails = (station: Z8Equipment) => {
    setSelectedStation(station)
    setIsModalOpen(true)
  }

  const handleEdit = (station: Z8Equipment) => {
    console.log("Edit Z8 station:", station)
    // TODO: Implement edit functionality
  }

  const handleDelete = (station: Z8Equipment) => {
    console.log("Delete Z8 station:", station)
    // TODO: Implement delete functionality
  }

  const handleExport = () => {
    console.log("Export Z8 stations data to Excel")
    // TODO: Implement Excel export functionality
  }

  const handleAddStation = () => {
    console.log("Add new Z8 station")
    setIsAddModalOpen(true)
  }

  const handleEquipmentAdded = () => {
    // Recargar la lista de equipos Z8
    loadEquipos()
  }

  const getStatusIcon = (estado: string) => {
    return estado === "ASIGNADO" ? (
      <Wifi className="w-4 h-4 text-green-500" />
    ) : (
      <WifiOff className="w-4 h-4 text-gray-400" />
    )
  }

  const getStatusBadge = (estado: string) => {
    return estado === "ASIGNADO" ? (
      <Badge className="bg-green-100 text-green-800 border-green-200">
        ASIGNADO
      </Badge>
    ) : (
      <Badge variant="outline" className="text-gray-600">
        DISPONIBLE
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando estaciones Z8...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ✅ FILTROS CON DISEÑO DE MAC - Copiado exactamente */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-700 rounded-lg p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">Filtrar por Estado</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {statusFilters.map((filter) => (
            <Button
              key={filter.value}
              variant="outline"
              className={`flex items-center gap-2 justify-start p-3 h-auto transition-all duration-200 ${
                activeFilter === filter.value
                  ? "bg-white text-purple-700 border-white hover:bg-gray-100 shadow-md"
                  : "bg-purple-600/20 border-white/40 text-white hover:bg-white/10 hover:border-white/60 backdrop-blur-sm"
              }`}
              onClick={() => {
                setActiveFilter(filter.value)
                setCurrentPage(1)
              }}
            >
              <filter.icon className="w-4 h-4" />
              <div className="text-left">
                <div className="text-sm font-medium">{filter.label}</div>
                <div className="text-xs opacity-75">{filter.count} estaciones</div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* ✅ BOTONES DE ACCIÓN CON DISEÑO DE MAC */}
      <div className="flex items-center gap-4">
        <Button onClick={handleAddStation} className="bg-purple-700 hover:bg-purple-800">
          <Plus className="w-4 h-4 mr-2" />
          Agregar Estación Z8
        </Button>
        <Button
          onClick={handleExport}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar Excel
        </Button>
      </div>

      {/* Search and Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar estaciones Z8..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
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

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">
          Mostrando {filteredEquipos.length} estación{filteredEquipos.length !== 1 ? "es" : ""}
          {activeFilter !== "TODOS" && ` con estado ${activeFilter}`}
        </span>
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          Estaciones Z8
        </Badge>
      </div>

      {/* ✅ TABLA CON DISEÑO DE MAC - Header con gradiente */}
      <div className="border rounded-lg overflow-hidden shadow-lg">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Wifi className="w-5 h-5" />
            Estaciones Z8 - Instituto Geográfico Militar
          </h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-purple-50 to-indigo-50">
              <TableHead className="font-semibold text-gray-700">Serie</TableHead>
              <TableHead className="font-semibold text-gray-700">IP</TableHead>
              <TableHead className="font-semibold text-gray-700">Estado</TableHead>
              <TableHead className="font-semibold text-gray-700">Propietario</TableHead>
              <TableHead className="font-semibold text-gray-700">Nombre PC</TableHead>
              <TableHead className="font-semibold text-gray-700">Especificaciones PC</TableHead>
              <TableHead className="font-semibold text-gray-700">Usuario Asignado</TableHead>
              <TableHead className="font-semibold text-gray-700">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  No se encontraron estaciones para los criterios seleccionados
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((station, index) => (
                <TableRow
                  key={`${station.id_equipo}-${index}`}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="font-mono text-sm">{station.numero_serie}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(station.estado_asignacion)}
                      <span className="font-mono text-sm">{station.ip || "Sin IP"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(station.estado_asignacion)}
                  </TableCell>
                  <TableCell>{station.propietario}</TableCell>
                  <TableCell className="font-medium">{station.nombre_pc}</TableCell>
                  <TableCell className="text-sm">
                    {station.procesador} | {station.ram} | {station.almacenamiento}
                  </TableCell>
                  <TableCell>
                    {station.usuario_asignado_nombre ? (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">{station.usuario_asignado_nombre}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">Sin asignar</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white border-0"
                        onClick={() => handleViewDetails(station)}
                        title="Ver detalles completos"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0"
                        onClick={() => handleEdit(station)}
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0"
                        onClick={() => handleDelete(station)}
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

          {/* ✅ PAGINACIÓN SIMPLE COMO EN MAC */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = i + 1
            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(pageNum)}
                className={currentPage === pageNum ? "bg-gradient-to-r from-purple-500 to-indigo-500" : ""}
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

      {/* Modal para agregar estación */}
      <AddZ8EquipmentModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onEquipmentAdded={handleEquipmentAdded}
      />

      {/* Modal de detalles */}
      {selectedStation && (
        <Z8StationDetailsModal
          station={selectedStation}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedStation(null)
          }}
        />
      )}
    </div>
  )
}
