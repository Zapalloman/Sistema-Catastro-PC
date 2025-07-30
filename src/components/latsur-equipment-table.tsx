"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Eye, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Download,
  Edit,
  Trash2,
  Monitor, 
  Printer, 
  Laptop, 
  HardDrive,
  Cpu,
  Server,
  Zap,
  Settings
} from "lucide-react"
import { LatsurEquipmentModal } from "./latsur-equipment-modal"

interface LatsurEquipment {
  id_equipo: number
  llave_inventario: string
  nombre_pc: string
  modelo: string
  numero_serie: string
  almacenamiento: string
  ram: string
  procesador: string
  version_sistema_operativo: string
  version_office: string
  observaciones: string
  fecha_ingreso: Date
  marca: string
  categoria: string
  idcategoria: number
  cod_ti_marca: number
  activo: boolean
}

interface LatsurCategoria {
  idcategoria: number
  nomcategoria: string
  descripcion: string
  vigente: number
}

export function LatsurEquipmentTable() {
  const [equipos, setEquipos] = useState<LatsurEquipment[]>([])
  const [categorias, setCategorias] = useState<LatsurCategoria[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState("TODOS")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedEquipment, setSelectedEquipment] = useState<LatsurEquipment | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Cargar equipos
  useEffect(() => {
    const loadEquipos = async () => {
      try {
        setLoading(true)
        let url = "http://localhost:3000/api/equipos-latsur"
        if (activeFilter !== "TODOS") {
          url += `/categoria/${activeFilter}`
        }
        
        const response = await fetch(url)
        const data = await response.json()
        setEquipos(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Error al cargar equipos LATSUR:", error)
        setError("No se pudieron cargar los equipos")
      } finally {
        setLoading(false)
      }
    }

    loadEquipos()
  }, [activeFilter])

  // Cargar categorías
  useEffect(() => {
    const loadCategorias = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/equipos-latsur/categorias")
        const data = await response.json()
        setCategorias(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Error al cargar categorías:", error)
      }
    }

    loadCategorias()
  }, [])

  // Crear filtros de categorías con iconos y conteo
  const getCategoryIcon = (nomcategoria: string) => {
    const categoriaLower = nomcategoria.toLowerCase()
    if (categoriaLower.includes("workstation") || categoriaLower.includes("pc")) {
      return Monitor
    } else if (categoriaLower.includes("impresora")) {
      return Printer
    } else if (categoriaLower.includes("notebook") || categoriaLower.includes("laptop")) {
      return Laptop
    } else if (categoriaLower.includes("disco") || categoriaLower.includes("storage")) {
      return HardDrive
    } else if (categoriaLower.includes("ups")) {
      return Zap
    } else if (categoriaLower.includes("servidor")) {
      return Server
    } else {
      return Cpu
    }
  }

  const categoryFilters = [
    { 
      value: "TODOS", 
      label: "Todos los Equipos", 
      icon: Server, 
      count: equipos.length 
    },
    ...categorias.map(categoria => ({
      value: categoria.idcategoria.toString(),
      label: categoria.nomcategoria,
      icon: getCategoryIcon(categoria.nomcategoria),
      count: equipos.filter(equipo => equipo.idcategoria === categoria.idcategoria).length
    }))
  ]

  // Filtrar equipos por búsqueda
  const filteredEquipos = equipos.filter((equipo) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      (equipo.nombre_pc || "").toLowerCase().includes(searchLower) ||
      (equipo.numero_serie || "").toLowerCase().includes(searchLower) ||
      (equipo.modelo || "").toLowerCase().includes(searchLower) ||
      (equipo.llave_inventario || "").toLowerCase().includes(searchLower) ||
      (equipo.marca || "").toLowerCase().includes(searchLower) ||
      (equipo.categoria || "").toLowerCase().includes(searchLower)
    )
  })

  // Paginación
  const totalPages = Math.ceil(filteredEquipos.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedEquipos = filteredEquipos.slice(startIndex, startIndex + itemsPerPage)

  const handleViewDetails = (equipo: LatsurEquipment) => {
    setSelectedEquipment(equipo)
    setIsModalOpen(true)
  }

  const handleEdit = (equipo: LatsurEquipment) => {
    console.log("Edit equipment:", equipo)
    // TODO: Implement edit functionality
  }

  const handleDelete = (equipo: LatsurEquipment) => {
    console.log("Delete equipment:", equipo)
    // TODO: Implement delete functionality
  }

  const handleAddEquipment = () => {
    console.log("Add new equipment")
    // TODO: Implement add functionality
  }

  const handleExport = () => {
    console.log("Export equipment data to Excel")
    // TODO: Implement Excel export functionality
  }

  const getCategoryBadgeColor = (categoria: string) => {
    const categoriaLower = categoria.toLowerCase()
    if (categoriaLower.includes("workstation") || categoriaLower.includes("pc")) {
      return "bg-blue-500"
    } else if (categoriaLower.includes("impresora")) {
      return "bg-purple-500"
    } else if (categoriaLower.includes("notebook") || categoriaLower.includes("laptop")) {
      return "bg-green-500"
    } else if (categoriaLower.includes("disco") || categoriaLower.includes("storage")) {
      return "bg-orange-500"
    } else if (categoriaLower.includes("ups")) {
      return "bg-yellow-500"
    } else if (categoriaLower.includes("servidor")) {
      return "bg-red-500"
    } else {
      return "bg-gray-500"
    }
  }

  const getCategoryIconComponent = (categoria: string) => {
    const categoriaLower = categoria.toLowerCase()
    if (categoriaLower.includes("workstation") || categoriaLower.includes("pc")) {
      return <Monitor className="w-4 h-4" />
    } else if (categoriaLower.includes("impresora")) {
      return <Printer className="w-4 h-4" />
    } else if (categoriaLower.includes("notebook") || categoriaLower.includes("laptop")) {
      return <Laptop className="w-4 h-4" />
    } else if (categoriaLower.includes("disco") || categoriaLower.includes("storage")) {
      return <HardDrive className="w-4 h-4" />
    } else if (categoriaLower.includes("ups")) {
      return <Zap className="w-4 h-4" />
    } else if (categoriaLower.includes("servidor")) {
      return <Server className="w-4 h-4" />
    } else {
      return <Cpu className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Category Filters */}
      <div className="bg-gradient-to-r from-cyan-700 to-blue-700 rounded-lg p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">Filtrar por Categoría</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {categoryFilters.map((filter) => (
            <Button
              key={filter.value}
              variant="outline"
              className={`flex items-center gap-2 justify-start p-3 h-auto transition-all duration-200 ${
                activeFilter === filter.value
                  ? "bg-white text-gray-700 border-white hover:bg-gray-100 shadow-md"
                  : "bg-blue-600/20 border-white/40 text-white hover:bg-white/10 hover:border-white/60 backdrop-blur-sm"
              }`}
              onClick={() => setActiveFilter(filter.value)}
            >
              <filter.icon className="w-4 h-4" />
              <div className="text-left">
                <div className="text-sm font-medium">{filter.label}</div>
                <div className="text-xs opacity-75">{filter.count} equipos</div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <Button onClick={handleAddEquipment} className="bg-cyan-700 hover:bg-cyan-800">
          <Plus className="w-4 h-4 mr-2" />
          Agregar Equipo
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
              placeholder="Buscar equipos LATSUR..."
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
          Mostrando {filteredEquipos.length} equipo{filteredEquipos.length !== 1 ? "s" : ""}
          {activeFilter !== "TODOS" && (
            <span className="ml-1">
              ({categoryFilters.find(c => c.value === activeFilter)?.label})
            </span>
          )}
        </span>
        <Badge variant="outline" className="bg-cyan-50 text-cyan-700 border-cyan-200">
          Equipamiento LATSUR
        </Badge>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden shadow-lg">
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-4">
          <h3 className="font-semibold flex items-center gap-2">
            <HardDrive className="w-5 h-5" />
            Equipos LATSUR - Instituto Geográfico Militar
          </h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-gray-50 to-slate-50">
              <TableHead className="font-semibold text-gray-700">Inventario</TableHead>
              <TableHead className="font-semibold text-gray-700">Nombre PC</TableHead>
              <TableHead className="font-semibold text-gray-700">Marca</TableHead>
              <TableHead className="font-semibold text-gray-700">Modelo</TableHead>
              <TableHead className="font-semibold text-gray-700">N° Serie</TableHead>
              <TableHead className="font-semibold text-gray-700">Categoría</TableHead>
              <TableHead className="font-semibold text-gray-700">RAM</TableHead>
              <TableHead className="font-semibold text-gray-700">Almacenamiento</TableHead>
              <TableHead className="font-semibold text-gray-700">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedEquipos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                  No se encontraron equipos para los criterios seleccionados
                </TableCell>
              </TableRow>
            ) : (
              paginatedEquipos.map((equipo) => (
                <TableRow 
                  key={equipo.id_equipo} 
                  className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 transition-all duration-200"
                >
                  <TableCell className="font-mono text-sm font-semibold">{equipo.llave_inventario || "-"}</TableCell>
                  <TableCell className="font-medium">{equipo.nombre_pc || "-"}</TableCell>
                  <TableCell className="font-semibold">{equipo.marca || "-"}</TableCell>
                  <TableCell>{equipo.modelo || "-"}</TableCell>
                  <TableCell className="font-mono text-xs">{equipo.numero_serie || "-"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getCategoryIconComponent(equipo.categoria)}
                      <Badge variant="default" className={getCategoryBadgeColor(equipo.categoria)}>
                        {equipo.categoria}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {equipo.ram || "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      {equipo.almacenamiento || "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0"
                        onClick={() => handleViewDetails(equipo)}
                        title="Ver detalles completos"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0"
                        onClick={() => handleEdit(equipo)}
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0"
                        onClick={() => handleDelete(equipo)}
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

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = i + 1
            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(pageNum)}
                className={currentPage === pageNum ? "bg-cyan-500 hover:bg-cyan-600" : ""}
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

      {/* Modal */}
      <LatsurEquipmentModal
        equipment={selectedEquipment}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}