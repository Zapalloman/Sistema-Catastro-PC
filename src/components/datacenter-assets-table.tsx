"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  Eye,
  Plus,
  Server,
  Thermometer,
  Shield,
  Zap,
  Network,
} from "lucide-react"
import { DatacenterAssetModal } from "./datacenter-asset-modal"
import { AddDatacenterEquipmentModal } from "./add-datacenter-equipment-modal" // ✅ IMPORTAR NUEVO MODAL

export function DatacenterAssetsTable({ data }: { data?: any[] }) {
  // ✅ ESTADOS NECESARIOS
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState("TODOS")
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [categorias, setCategorias] = useState<any[]>([])
  const [selectedAsset, setSelectedAsset] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false) // ✅ ESTADO PARA MODAL DE AGREGAR

  // ✅ USAR SOLO DATOS REALES DEL BACKEND - SIN DATOS DE EJEMPLO
  const datacenterAssets = data || []

  // ✅ CARGAR CATEGORÍAS DEL BACKEND
  useEffect(() => {
    const loadCategorias = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/equipos-datacenter/categorias")
        const categoriasData = await response.json()
        setCategorias(Array.isArray(categoriasData) ? categoriasData : [])
      } catch (error) {
        console.error("Error al cargar categorías datacenter:", error)
        setCategorias([])
      }
    }

    loadCategorias()
  }, [])

  // ✅ RESETEAR PÁGINA AL CAMBIAR FILTROS
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, activeFilter])

  // Filter data based on search term and active filter
  const filteredData = datacenterAssets.filter((asset) => {
    const matchesSearch =
      asset.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.numeroSerie?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.lugar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.responsable?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = activeFilter === "TODOS" || asset.categoria === activeFilter

    return matchesSearch && matchesFilter
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  // ✅ HANDLERS
  const handleViewDetails = (asset: any) => {
    setSelectedAsset(asset)
    setIsModalOpen(true)
  }

  const handleExport = () => {
    console.log("Export datacenter assets data to Excel")
    // TODO: Implement Excel export functionality
  }

  const handleAddAsset = () => {
    setShowAddModal(true) // ✅ ABRIR MODAL DE AGREGAR
  }

  // ✅ HANDLER PARA REFRESCAR DATOS DESPUÉS DE AGREGAR
  const handleEquipmentAdded = () => {
    // Disparar refresco de datos en el componente padre
    window.location.reload() // O usar callback si existe
  }

  // ✅ CATEGORIAS DINÁMICAS + ICONOS
  const getCategoryIcon = (categoria: string) => {
    if (!categoria) return <Server className="w-4 h-4" />

    const cat = categoria.toLowerCase()
    if (cat.includes('servidor')) return <Server className="w-4 h-4" />
    if (cat.includes('a.c.') || cat.includes('aire')) return <Thermometer className="w-4 h-4" />
    if (cat.includes('firewall') || cat.includes('seguridad')) return <Shield className="w-4 h-4" />
    if (cat.includes('ups') || cat.includes('alimentacion')) return <Zap className="w-4 h-4" />
    if (cat.includes('core') || cat.includes('switch') || cat.includes('red')) return <Network className="w-4 h-4" />

    return <Server className="w-4 h-4" />
  }

  const getCategoryBadgeColor = (categoria: string) => {
    if (!categoria) return "bg-gray-100 text-gray-700"

    const cat = categoria.toLowerCase()
    if (cat.includes('servidor')) return "bg-blue-100 text-blue-700"
    if (cat.includes('a.c.') || cat.includes('aire')) return "bg-green-100 text-green-700"
    if (cat.includes('firewall')) return "bg-red-100 text-red-700"
    if (cat.includes('ups')) return "bg-yellow-100 text-yellow-700"
    if (cat.includes('core') || cat.includes('switch')) return "bg-purple-100 text-purple-700"

    return "bg-gray-100 text-gray-700"
  }

  // ✅ FILTROS DE CATEGORÍAS DINÁMICAS
  const categoryFilters = [
    { value: "TODOS", label: "Todos", icon: Server, count: datacenterAssets.length },
    ...categorias.map(cat => ({
      value: cat.categoria,
      label: cat.categoria,
      icon: Server,
      count: cat.cantidad || 0
    }))
  ]

  return (
    <div className="space-y-6">
      {/* Category Filters */}
      <div className="bg-gradient-to-r from-slate-700 to-gray-700 rounded-lg p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">Filtrar por Categoría</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {categoryFilters.map((filter) => (
            <Button
              key={filter.value}
              variant="outline"
              className={`flex items-center gap-2 justify-start p-3 h-auto transition-all duration-200 ${
                activeFilter === filter.value
                  ? "bg-white text-gray-700 border-white hover:bg-gray-100 shadow-md"
                  : "bg-gray-600/20 border-white/40 text-white hover:bg-white/10 hover:border-white/60 backdrop-blur-sm"
              }`}
              onClick={() => setActiveFilter(filter.value)}
            >
              <filter.icon className="w-4 h-4" />
              <div className="text-left">
                <div className="text-sm font-medium">{filter.label}</div>
                <div className="text-xs opacity-75">{filter.count} activos</div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <Button onClick={handleAddAsset} className="bg-slate-700 hover:bg-slate-800">
          <Plus className="w-4 h-4 mr-2" />
          Agregar Activo
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
              placeholder="Buscar activos de datacenter..."
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
          Mostrando {filteredData.length} activo{filteredData.length !== 1 ? "s" : ""}
          {activeFilter !== "TODOS" && ` de categoría ${activeFilter}`}
        </span>
        <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
          Datacenter IGM
        </Badge>
      </div>

      {/* ✅ TABLA ACTUALIZADA - SIN CANTIDAD NI BOTONES DE EDITAR/ELIMINAR */}
      <div className="border rounded-lg overflow-hidden shadow-lg">
        <div className="bg-gradient-to-r from-slate-600 to-gray-600 text-white p-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Server className="w-5 h-5" />
            Activos de Datacenter - Instituto Geográfico Militar
          </h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-gray-50 to-slate-50">
              <TableHead className="font-semibold text-gray-700">Marca</TableHead>
              <TableHead className="font-semibold text-gray-700">Modelo</TableHead>
              <TableHead className="font-semibold text-gray-700">Número Serie</TableHead>
              <TableHead className="font-semibold text-gray-700">Lugar</TableHead>
              <TableHead className="font-semibold text-gray-700">Categoría</TableHead>
              <TableHead className="font-semibold text-gray-700">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  {datacenterAssets.length === 0 
                    ? "No hay equipos de datacenter registrados. Agregue el primer equipo."
                    : "No se encontraron activos para los criterios seleccionados"
                  }
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((asset, index) => (
                <TableRow
                  key={`${asset.id}-${index}`}
                  className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 transition-all duration-200"
                >
                  <TableCell className="font-semibold">{asset.marca}</TableCell>
                  <TableCell>{asset.modelo}</TableCell>
                  <TableCell className="font-mono text-xs">{asset.numeroSerie}</TableCell>
                  <TableCell className="max-w-48 truncate" title={asset.lugar}>
                    {asset.lugar}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(asset.categoria)}
                      <Badge variant="default" className={getCategoryBadgeColor(asset.categoria)}>
                        {asset.categoria}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    {/* ✅ SOLO BOTÓN DE VER DETALLES */}
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-gradient-to-r from-slate-500 to-gray-500 hover:from-slate-600 hover:to-gray-600 text-white border-0"
                      onClick={() => handleViewDetails(asset)}
                      title="Ver detalles completos"
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

      {/* Pagination */}
      {totalPages > 1 && (
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
                  className={currentPage === pageNum ? "bg-gradient-to-r from-slate-500 to-gray-500" : ""}
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
      )}

      {/* ✅ MODALES */}
      {/* Modal de detalles */}
      <DatacenterAssetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} asset={selectedAsset} />
      
      {/* ✅ MODAL DE AGREGAR EQUIPO */}
      <AddDatacenterEquipmentModal 
        open={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        onEquipmentAdded={handleEquipmentAdded}
      />
    </div>
  )
}
