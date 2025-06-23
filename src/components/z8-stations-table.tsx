"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Search, Download, ChevronLeft, ChevronRight, Eye, Wifi, WifiOff, Plus } from "lucide-react"
import { Z8StationModal } from "./z8-stations-modal"

// Sample Z8 stations data
const sampleZ8Stations = [
  {
    id: "Z8-001",
    serialNumber: "Z8-IGM-001-2024",
    ipAddress: "192.168.10.101",
    networkStatus: "ACTIVA",
    owner: "DEPARTAMENTO GEODESIA",
    pcName: "Z8-GEODESIA-01",
    pcSpecs: {
      processor: "Intel Core i7-12700K",
      ram: "32GB DDR4",
      storage: "1TB NVMe SSD",
      os: "Windows 11 Pro",
      graphics: "NVIDIA RTX 3070",
    },
    userName: "Dr. Roberto Silva",
    location: "Laboratorio Geodesia - Estación 1",
    lastConnection: "2024-06-18 14:30:25",
    macAddress: "00:1A:2B:3C:4D:5E",
    networkType: "Ethernet Gigabit",
    assignedDate: "2024-03-15",
  },
  {
    id: "Z8-002",
    serialNumber: "Z8-IGM-002-2024",
    ipAddress: "192.168.10.102",
    networkStatus: "ACTIVA",
    owner: "DEPARTAMENTO TOPOGRAFIA",
    pcName: "Z8-TOPOGRAFIA-01",
    pcSpecs: {
      processor: "Intel Core i5-11600K",
      ram: "16GB DDR4",
      storage: "512GB NVMe SSD",
      os: "Windows 10 Pro",
    },
    userName: "Ing. Carmen López",
    location: "Departamento Topografía",
    lastConnection: "2024-06-18 13:45:12",
    macAddress: "00:1A:2B:3C:4D:5F",
    networkType: "Ethernet Gigabit",
    assignedDate: "2024-04-02",
  },
  {
    id: "Z8-003",
    serialNumber: "Z8-IGM-003-2024",
    ipAddress: "192.168.10.103",
    networkStatus: "ACTIVA",
    owner: "DEPARTAMENTO CARTOGRAFIA",
    pcName: "Z8-CARTOGRAFIA-01",
    pcSpecs: {
      processor: "AMD Ryzen 7 5800X",
      ram: "24GB DDR4",
      storage: "1TB NVMe SSD + 2TB HDD",
      os: "Ubuntu 22.04 LTS",
      graphics: "NVIDIA GTX 1660 Ti",
    },
    userName: "Téc. Miguel Herrera",
    location: "Departamento Cartografía",
    lastConnection: "2024-06-17 16:20:08",
    macAddress: "00:1A:2B:3C:4D:60",
    networkType: "Ethernet Gigabit",
    assignedDate: "2024-02-28",
  },
  {
    id: "Z8-004",
    serialNumber: "Z8-IGM-004-2024",
    ipAddress: "192.168.10.104",
    networkStatus: "INACTIVO",
    owner: "ADMINISTRACION",
    pcName: "Z8-ADMIN-01",
    pcSpecs: {
      processor: "Intel Core i5-10400",
      ram: "16GB DDR4",
      storage: "256GB SSD",
      os: "Windows 11 Pro",
    },
    userName: "Sra. Ana Martínez",
    location: "Oficina Administrativa",
    lastConnection: "2024-06-16 09:15:33",
    macAddress: "00:1A:2B:3C:4D:61",
    networkType: "WiFi 802.11ac",
    assignedDate: "2024-05-10",
  },
]

const statusFilters = [
  { value: "TODOS", label: "Todas las Estaciones", icon: Wifi, count: 4 },
  { value: "ACTIVA", label: "Activa", icon: Wifi, count: 3 },
  { value: "INACTIVO", label: "Inactivo", icon: WifiOff, count: 1 },
]

export function Z8StationsTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [activeFilter, setActiveFilter] = useState("TODOS")
  const [selectedStation, setSelectedStation] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Filter data based on search term and active filter
  const filteredData = sampleZ8Stations.filter((station) => {
    const matchesSearch =
      station.pcName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.ipAddress.includes(searchTerm) ||
      station.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.userName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = activeFilter === "TODOS" || station.networkStatus === activeFilter

    return matchesSearch && matchesFilter
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  const handleViewDetails = (station: any) => {
    setSelectedStation(station)
    setIsModalOpen(true)
  }

  const handleEdit = (station: any) => {
    console.log("Edit Z8 station:", station)
    // TODO: Implement edit functionality
  }

  const handleDelete = (station: any) => {
    console.log("Delete Z8 station:", station)
    // TODO: Implement delete functionality
  }

  const handleExport = () => {
    console.log("Export Z8 stations data to Excel")
    // TODO: Implement Excel export functionality
  }

  const handleAddStation = () => {
    console.log("Add new Z8 station")
    // TODO: Implement add station functionality
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACTIVA":
        return <Wifi className="w-4 h-4 text-green-600" />
      case "INACTIVO":
        return <WifiOff className="w-4 h-4 text-red-600" />
      default:
        return <Wifi className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Status Filters */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">Filtrar por Estado</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {statusFilters.map((filter) => (
            <Button
              key={filter.value}
              variant="outline"
              className={`flex items-center gap-2 justify-start p-3 h-auto transition-all duration-200 ${
                activeFilter === filter.value
                  ? "bg-white text-purple-600 border-white hover:bg-gray-100 shadow-md"
                  : "bg-purple-500/20 border-white/40 text-white hover:bg-white/10 hover:border-white/60 backdrop-blur-sm"
              }`}
              onClick={() => setActiveFilter(filter.value)}
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

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <Button onClick={handleAddStation} className="bg-purple-600 hover:bg-purple-700">
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
          Mostrando {filteredData.length} estación{filteredData.length !== 1 ? "es" : ""}
          {activeFilter !== "TODOS" && ` con estado ${activeFilter}`}
        </span>
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          Estaciones Z8
        </Badge>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden shadow-lg">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Wifi className="w-5 h-5" />
            Estaciones Z8 - Instituto Geográfico Militar
          </h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-gray-50 to-purple-50">
              <TableHead className="font-semibold text-gray-700">Número de Serie</TableHead>
              <TableHead className="font-semibold text-gray-700">Dirección IP</TableHead>
              <TableHead className="font-semibold text-gray-700">Estado de Conexión</TableHead>
              <TableHead className="font-semibold text-gray-700">Propietario</TableHead>
              <TableHead className="font-semibold text-gray-700">Nombre PC</TableHead>
              <TableHead className="font-semibold text-gray-700">Especificaciones PC</TableHead>
              <TableHead className="font-semibold text-gray-700">Nombre Usuario</TableHead>
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
                  key={`${station.id}-${index}`}
                  className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 transition-all duration-200"
                >
                  <TableCell className="font-mono text-xs">{station.serialNumber}</TableCell>
                  <TableCell className="font-mono text-sm">{station.ipAddress}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(station.networkStatus)}
                      <Badge
                        variant="default"
                        className={station.networkStatus === "ACTIVA" ? "bg-green-500" : "bg-red-500"}
                      >
                        {station.networkStatus}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-40 truncate" title={station.owner}>
                    {station.owner}
                  </TableCell>
                  <TableCell className="font-semibold">{station.pcName}</TableCell>
                  <TableCell
                    className="max-w-48 truncate"
                    title={`${station.pcSpecs.processor} | ${station.pcSpecs.ram}`}
                  >
                    {station.pcSpecs.processor} | {station.pcSpecs.ram}
                  </TableCell>
                  <TableCell>{station.userName}</TableCell>
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

          {/* Page numbers */}
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

      {/* Z8 Station Detail Modal */}
      <Z8StationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} station={selectedStation} />
    </div>
  )
}
