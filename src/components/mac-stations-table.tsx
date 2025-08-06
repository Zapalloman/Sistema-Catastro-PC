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
  Wifi,
  WifiOff,
  Plus,
  Apple,
} from "lucide-react"
import { MacStationModal } from "./mac-stations-modal"

// Sample MAC stations data
const sampleMacStations = [
  /*{
    id: "MAC-001",
    serialNumber: "MAC-IGM-001-2024",
    macAddress: "A4:83:E7:12:34:56",
    networkStatus: "ACTIVA",
    owner: "DEPARTAMENTO CARTOGRAFIA",
    deviceModel: "MacBook Pro 16-inch M3 Pro",
    userName: "Arq. Patricia Morales",
    location: "Departamento Cartografía - Estación 1",
    lastConnection: "2024-06-18 15:20:45",
    ipAddress: "192.168.20.101",
    deviceSpecs: {
      processor: "Apple M3 Pro 12-core",
      ram: "32GB Unified Memory",
      storage: "1TB SSD",
      os: "macOS Sonoma 14.5",
      graphics: "Apple M3 Pro GPU",
      display: "16.2-inch Liquid Retina XDR",
    },
    assignedDate: "2024-03-20",
    networkType: "WiFi 6E",
  },
  {
    id: "MAC-002",
    serialNumber: "MAC-IGM-002-2024",
    macAddress: "A4:83:E7:12:34:57",
    networkStatus: "ACTIVA",
    owner: "DEPARTAMENTO GEODESIA",
    deviceModel: "iMac 24-inch M3",
    userName: "Dr. Fernando Castro",
    location: "Laboratorio Geodesia - Estación 2",
    lastConnection: "2024-06-18 14:15:30",
    ipAddress: "192.168.20.102",
    deviceSpecs: {
      processor: "Apple M3 8-core",
      ram: "24GB Unified Memory",
      storage: "512GB SSD",
      os: "macOS Sonoma 14.5",
      graphics: "Apple M3 GPU",
      display: "24-inch 4.5K Retina",
    },
    assignedDate: "2024-04-15",
    networkType: "Ethernet Gigabit",
  },
  {
    id: "MAC-003",
    serialNumber: "MAC-IGM-003-2024",
    macAddress: "A4:83:E7:12:34:58",
    networkStatus: "ACTIVA",
    owner: "DIRECCION",
    deviceModel: "MacBook Air 15-inch M3",
    userName: "Gral. Ricardo Vásquez",
    location: "Oficina Dirección",
    lastConnection: "2024-06-18 16:45:12",
    ipAddress: "192.168.20.103",
    deviceSpecs: {
      processor: "Apple M3 8-core",
      ram: "16GB Unified Memory",
      storage: "512GB SSD",
      os: "macOS Sonoma 14.5",
      graphics: "Apple M3 GPU",
      display: "15.3-inch Liquid Retina",
    },
    assignedDate: "2024-02-10",
    networkType: "WiFi 6E",
  },
  {
    id: "MAC-004",
    serialNumber: "MAC-IGM-004-2024",
    macAddress: "A4:83:E7:12:34:59",
    networkStatus: "INACTIVO",
    owner: "DEPARTAMENTO TOPOGRAFIA",
    deviceModel: "Mac Studio M2 Ultra",
    userName: "Ing. Carlos Mendoza",
    location: "Departamento Topografía",
    lastConnection: "2024-06-17 11:30:25",
    ipAddress: "192.168.20.104",
    deviceSpecs: {
      processor: "Apple M2 Ultra 24-core",
      ram: "64GB Unified Memory",
      storage: "2TB SSD",
      os: "macOS Sonoma 14.5",
      graphics: "Apple M2 Ultra GPU",
    },
    assignedDate: "2024-05-05",
    networkType: "Ethernet 10Gb",
  },
  {
    id: "MAC-005",
    serialNumber: "MAC-IGM-005-2024",
    macAddress: "A4:83:E7:12:34:60",
    networkStatus: "ACTIVA",
    owner: "ADMINISTRACION",
    deviceModel: "MacBook Pro 14-inch M3",
    userName: "Lic. Ana Rodríguez",
    location: "Oficina Administrativa",
    lastConnection: "2024-06-18 13:20:18",
    ipAddress: "192.168.20.105",
    deviceSpecs: {
      processor: "Apple M3 8-core",
      ram: "18GB Unified Memory",
      storage: "512GB SSD",
      os: "macOS Sonoma 14.5",
      graphics: "Apple M3 GPU",
      display: "14.2-inch Liquid Retina XDR",
    },
    assignedDate: "2024-04-28",
    networkType: "WiFi 6E",
  },
  */
]

const statusFilters = [
  { value: "TODOS", label: "Todas las Estaciones", icon: Apple, count: 5 },
  { value: "ACTIVA", label: "Activa", icon: Wifi, count: 4 },
  { value: "INACTIVO", label: "Inactivo", icon: WifiOff, count: 1 },
]

export function MacStationsTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [activeFilter, setActiveFilter] = useState("TODOS")
  const [selectedStation, setSelectedStation] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Filter data based on search term and active filter
  const filteredData = sampleMacStations.filter((station) => {
    const matchesSearch =
      station.deviceModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.macAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    console.log("Edit MAC station:", station)
    // TODO: Implement edit functionality
  }

  const handleDelete = (station: any) => {
    console.log("Delete MAC station:", station)
    // TODO: Implement delete functionality
  }

  const handleExport = () => {
    console.log("Export MAC stations data to Excel")
    // TODO: Implement Excel export functionality
  }

  const handleAddStation = () => {
    console.log("Add new MAC station")
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
      <div className="bg-gradient-to-r from-gray-700 to-slate-700 rounded-lg p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">Filtrar por Estado</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {statusFilters.map((filter) => (
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
                <div className="text-xs opacity-75">{filter.count} estaciones</div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <Button onClick={handleAddStation} className="bg-gray-700 hover:bg-gray-800">
          <Plus className="w-4 h-4 mr-2" />
          Agregar Estación MAC
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
              placeholder="Buscar estaciones MAC..."
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
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
          Estaciones MAC
        </Badge>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden shadow-lg">
        <div className="bg-gradient-to-r from-gray-600 to-slate-600 text-white p-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Apple className="w-5 h-5" />
            Estaciones MAC - Instituto Geográfico Militar
          </h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-gray-50 to-slate-50">
              <TableHead className="font-semibold text-gray-700">Número de Serie</TableHead>
              <TableHead className="font-semibold text-gray-700">Dirección MAC</TableHead>
              <TableHead className="font-semibold text-gray-700">Estado de Conexión</TableHead>
              <TableHead className="font-semibold text-gray-700">Propietario</TableHead>
              <TableHead className="font-semibold text-gray-700">Modelo del Dispositivo</TableHead>
              <TableHead className="font-semibold text-gray-700">Nombre Usuario</TableHead>
              <TableHead className="font-semibold text-gray-700">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No se encontraron estaciones para los criterios seleccionados
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((station, index) => (
                <TableRow
                  key={`${station.id}-${index}`}
                  className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 transition-all duration-200"
                >
                  <TableCell className="font-mono text-xs">{station.serialNumber}</TableCell>
                  <TableCell className="font-mono text-sm">{station.macAddress}</TableCell>
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
                  <TableCell className="font-semibold max-w-48 truncate" title={station.deviceModel}>
                    {station.deviceModel}
                  </TableCell>
                  <TableCell>{station.userName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-gradient-to-r from-gray-500 to-slate-500 hover:from-gray-600 hover:to-slate-600 text-white border-0"
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
                className={currentPage === pageNum ? "bg-gradient-to-r from-gray-500 to-slate-500" : ""}
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

      {/* MAC Station Detail Modal */}
      <MacStationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} station={selectedStation} />
    </div>
  )
}
