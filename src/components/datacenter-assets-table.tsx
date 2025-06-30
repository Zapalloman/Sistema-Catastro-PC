"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Edit,
  Trash2,
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

// Sample datacenter assets data
const sampleDatacenterAssets = [
  {
    id: "DC-AC-001",
    marca: "Carrier",
    modelo: "30RB-0802",
    numeroSerie: "AC-IGM-001-2024",
    cantidad: 2,
    lugar: "Sala de Servidores Principal",
    categoria: "A.C.",
    estado: "OPERATIVO",
    fechaInstalacion: "2024-01-15",
    responsable: "Téc. Carlos Mendoza",
    especificaciones: {
      capacidad_refrigeracion: "80,000 BTU/h",
      voltaje: "380V Trifásico",
      consumo_energia: "24 kW",
      tipo_refrigerante: "R-410A",
      control: "Digital Microprocessor",
    },
    mantenimiento: {
      ultimoMantenimiento: "2024-05-15",
      proximoMantenimiento: "2024-08-15",
      tipoMantenimiento: "Preventivo Trimestral",
    },
    ubicacionDetallada: {
      sala: "Sala Principal",
      rack: "N/A",
      unidad: "Unidad Externa",
    },
  },
  {
    id: "DC-SRV-001",
    marca: "Dell",
    modelo: "PowerEdge R750",
    numeroSerie: "SRV-IGM-001-2024",
    cantidad: 4,
    lugar: "Rack A1 - Sala Principal",
    categoria: "Servidores",
    estado: "OPERATIVO",
    fechaInstalacion: "2024-02-20",
    responsable: "Ing. María González",
    especificaciones: {
      procesador: "Intel Xeon Silver 4314",
      memoria_ram: "64GB DDR4",
      almacenamiento: "2x 960GB SSD + 4x 2TB HDD",
      red: "4x 1GbE + 2x 10GbE",
      fuente_poder: "Redundante 800W",
    },
    mantenimiento: {
      ultimoMantenimiento: "2024-06-01",
      proximoMantenimiento: "2024-09-01",
      tipoMantenimiento: "Preventivo Trimestral",
    },
    ubicacionDetallada: {
      sala: "Sala Principal",
      rack: "Rack A1",
      unidad: "U1-U4",
    },
  },
  {
    id: "DC-CORE-001",
    marca: "Cisco",
    modelo: "Catalyst 9500-48Y4C",
    numeroSerie: "CORE-IGM-001-2024",
    cantidad: 2,
    lugar: "Rack Central - Core Network",
    categoria: "Core Central Coms",
    estado: "OPERATIVO",
    fechaInstalacion: "2024-03-10",
    responsable: "Ing. Roberto Silva",
    especificaciones: {
      puertos: "48x 25G SFP28 + 4x 100G QSFP28",
      capacidad_switching: "3.6 Tbps",
      throughput: "2.7 Bpps",
      protocolo: "BGP, OSPF, EIGRP",
      redundancia: "Dual Power Supply",
    },
    mantenimiento: {
      ultimoMantenimiento: "2024-05-20",
      proximoMantenimiento: "2024-08-20",
      tipoMantenimiento: "Preventivo Trimestral",
    },
    ubicacionDetallada: {
      sala: "Sala Principal",
      rack: "Rack Central",
      unidad: "U20-U22",
    },
  },
  {
    id: "DC-FW-001",
    marca: "Fortinet",
    modelo: "FortiGate 3000D",
    numeroSerie: "FW-IGM-001-2024",
    cantidad: 2,
    lugar: "Rack Seguridad - DMZ",
    categoria: "Firewall",
    estado: "OPERATIVO",
    fechaInstalacion: "2024-02-28",
    responsable: "Esp. Ana Rodríguez",
    especificaciones: {
      throughput_firewall: "120 Gbps",
      throughput_ips: "55 Gbps",
      throughput_vpn: "32 Gbps",
      sesiones_concurrentes: "24,000,000",
      interfaces: "20x GE + 8x 10GE + 2x 40GE",
    },
    mantenimiento: {
      ultimoMantenimiento: "2024-06-10",
      proximoMantenimiento: "2024-09-10",
      tipoMantenimiento: "Preventivo Trimestral",
    },
    ubicacionDetallada: {
      sala: "Sala Principal",
      rack: "Rack Seguridad",
      unidad: "U10-U12",
    },
  },
  {
    id: "DC-UPS-001",
    marca: "APC",
    modelo: "Smart-UPS VT 40kVA",
    numeroSerie: "UPS-IGM-001-2024",
    cantidad: 2,
    lugar: "Sala UPS - Alimentación Principal",
    categoria: "Ups",
    estado: "OPERATIVO",
    fechaInstalacion: "2024-01-20",
    responsable: "Téc. Pedro Herrera",
    especificaciones: {
      capacidad: "40 kVA / 32 kW",
      voltaje_entrada: "380/400/415V",
      voltaje_salida: "380/400/415V",
      autonomia: "15 minutos a carga completa",
      baterias: "Selladas libre mantenimiento",
    },
    mantenimiento: {
      ultimoMantenimiento: "2024-06-05",
      proximoMantenimiento: "2024-09-05",
      tipoMantenimiento: "Preventivo Trimestral",
    },
    ubicacionDetallada: {
      sala: "Sala UPS",
      rack: "N/A",
      unidad: "Unidad Independiente",
    },
  },
  {
    id: "DC-SRV-002",
    marca: "HPE",
    modelo: "ProLiant DL380 Gen10",
    numeroSerie: "SRV-IGM-002-2024",
    cantidad: 6,
    lugar: "Rack B1-B2 - Sala Principal",
    categoria: "Servidores",
    estado: "OPERATIVO",
    fechaInstalacion: "2024-03-15",
    responsable: "Ing. María González",
    especificaciones: {
      procesador: "Intel Xeon Gold 6248R",
      memoria_ram: "128GB DDR4",
      almacenamiento: "4x 1.92TB SSD NVMe",
      red: "4x 1GbE + 2x 25GbE",
      fuente_poder: "Redundante 800W",
    },
    mantenimiento: {
      ultimoMantenimiento: "2024-06-01",
      proximoMantenimiento: "2024-09-01",
      tipoMantenimiento: "Preventivo Trimestral",
    },
    ubicacionDetallada: {
      sala: "Sala Principal",
      rack: "Rack B1-B2",
      unidad: "U1-U12",
    },
  },
]

const categoryFilters = [
  { value: "TODOS", label: "Todos los Activos", icon: Server, count: 6 },
  { value: "A.C.", label: "A.C.", icon: Thermometer, count: 1 },
  { value: "Servidores", label: "Servidores", icon: Server, count: 2 },
  { value: "Core Central Coms", label: "Core Central Coms", icon: Network, count: 1 },
  { value: "Firewall", label: "Firewall", icon: Shield, count: 1 },
  { value: "Ups", label: "UPS", icon: Zap, count: 1 },
]

export function DatacenterAssetsTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [activeFilter, setActiveFilter] = useState("TODOS")
  const [selectedAsset, setSelectedAsset] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Filter data based on search term and active filter
  const filteredData = sampleDatacenterAssets.filter((asset) => {
    const matchesSearch =
      asset.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.numeroSerie.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.lugar.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.responsable.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = activeFilter === "TODOS" || asset.categoria === activeFilter

    return matchesSearch && matchesFilter
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  const handleViewDetails = (asset: any) => {
    setSelectedAsset(asset)
    setIsModalOpen(true)
  }

  const handleEdit = (asset: any) => {
    console.log("Edit datacenter asset:", asset)
    // TODO: Implement edit functionality
  }

  const handleDelete = (asset: any) => {
    console.log("Delete datacenter asset:", asset)
    // TODO: Implement delete functionality
  }

  const handleExport = () => {
    console.log("Export datacenter assets data to Excel")
    // TODO: Implement Excel export functionality
  }

  const handleAddAsset = () => {
    console.log("Add new datacenter asset")
    // TODO: Implement add asset functionality
  }

  const getCategoryIcon = (categoria: string) => {
    const categoryFilter = categoryFilters.find((f) => f.value === categoria)
    return categoryFilter ? <categoryFilter.icon className="w-4 h-4" /> : <Server className="w-4 h-4" />
  }

  const getCategoryBadgeColor = (categoria: string) => {
    switch (categoria.toLowerCase()) {
      case "a.c.":
        return "bg-cyan-500"
      case "servidores":
        return "bg-green-500"
      case "core central coms":
        return "bg-purple-500"
      case "firewall":
        return "bg-red-500"
      case "ups":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

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

      {/* Table */}
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
              <TableHead className="font-semibold text-gray-700">Cantidad</TableHead>
              <TableHead className="font-semibold text-gray-700">Lugar</TableHead>
              <TableHead className="font-semibold text-gray-700">Categoría</TableHead>
              <TableHead className="font-semibold text-gray-700">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No se encontraron activos para los criterios seleccionados
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
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {asset.cantidad} unidades
                    </Badge>
                  </TableCell>
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
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-gradient-to-r from-slate-500 to-gray-500 hover:from-slate-600 hover:to-gray-600 text-white border-0"
                        onClick={() => handleViewDetails(asset)}
                        title="Ver detalles completos"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0"
                        onClick={() => handleEdit(asset)}
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0"
                        onClick={() => handleDelete(asset)}
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

      {/* Datacenter Asset Detail Modal */}
      <DatacenterAssetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} asset={selectedAsset} />
    </div>
  )
}
