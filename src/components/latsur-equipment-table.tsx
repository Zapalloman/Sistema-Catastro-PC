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
  Monitor,
  Printer,
  Zap,
  Wifi,
  Glasses,
  Mouse,
  Laptop,
  HardDrive,
} from "lucide-react"
import { LatsurEquipmentModal } from "./latsur-equipment-modal"

// Sample LATSUR equipment data
const sampleLatsurEquipment = [
  {
    id: "LATSUR-WS-001",
    tipo: "Workstation",
    modelo: "Dell Precision 7760",
    serie: "LATSUR-WS-001-2024",
    marca: "Dell",
    estado: "OPERATIVO",
    ubicacion: "Laboratorio LATSUR - Estación 1",
    fechaInstalacion: "15/01/2024",
    responsable: "Dr. Carlos Mendoza",
    especificaciones: {
      procesador: "Intel Xeon W-11955M",
      ram: "64GB DDR4",
      almacenamiento: "2TB NVMe SSD",
      tarjeta_grafica: "NVIDIA RTX A4000",
      sistema_operativo: "Windows 11 Pro",
    },
    dispositivosRelacionados: [
      {
        id: "LATSUR-UPS-001",
        tipo: "UPS",
        modelo: "APC Smart-UPS 1500VA",
        serie: "UPS-001-2024",
        relacion: "Alimentación",
      },
      {
        id: "LATSUR-MON-001",
        tipo: "Monitor",
        modelo: 'Dell UltraSharp 32"',
        serie: "MON-001-2024",
        relacion: "Display Principal",
      },
      {
        id: "LATSUR-MON-002",
        tipo: "Monitor",
        modelo: 'Dell UltraSharp 24"',
        serie: "MON-002-2024",
        relacion: "Display Secundario",
      },
    ],
  },
  {
    id: "LATSUR-WS-002",
    tipo: "Workstation",
    modelo: "HP Z6 G4",
    serie: "LATSUR-WS-002-2024",
    marca: "HP",
    estado: "OPERATIVO",
    ubicacion: "Laboratorio LATSUR - Estación 2",
    fechaInstalacion: "20/01/2024",
    responsable: "Ing. María González",
    especificaciones: {
      procesador: "Intel Xeon Silver 4214",
      ram: "32GB DDR4",
      almacenamiento: "1TB NVMe SSD + 2TB HDD",
      tarjeta_grafica: "NVIDIA Quadro RTX 4000",
      sistema_operativo: "Ubuntu 22.04 LTS",
    },
    dispositivosRelacionados: [
      {
        id: "LATSUR-UPS-002",
        tipo: "UPS",
        modelo: "APC Smart-UPS 1000VA",
        serie: "UPS-002-2024",
        relacion: "Alimentación",
      },
      { id: "LATSUR-MON-003", tipo: "Monitor", modelo: "HP Z27", serie: "MON-003-2024", relacion: "Display Principal" },
    ],
  },
  {
    id: "LATSUR-IMP-001",
    tipo: "Impresora",
    modelo: "HP LaserJet Pro M404dn",
    serie: "LATSUR-IMP-001-2024",
    marca: "HP",
    estado: "OPERATIVO",
    ubicacion: "Laboratorio LATSUR - Área Común",
    fechaInstalacion: "10/02/2024",
    responsable: "Técnico Juan Pérez",
    especificaciones: {
      tipo_impresion: "Láser Monocromático",
      velocidad: "38 ppm",
      resolucion: "1200 x 1200 dpi",
      conectividad: "Ethernet, USB",
      capacidad_papel: "250 hojas",
    },
    dispositivosRelacionados: [],
  },
  {
    id: "LATSUR-3DG-001",
    tipo: "Gafas 3D",
    modelo: "NVIDIA 3D Vision 2",
    serie: "LATSUR-3DG-001-2024",
    marca: "NVIDIA",
    estado: "OPERATIVO",
    ubicacion: "Laboratorio LATSUR - Estación 1",
    fechaInstalacion: "15/01/2024",
    responsable: "Dr. Carlos Mendoza",
    especificaciones: {
      tipo: "Activas con IR",
      frecuencia: "120Hz",
      bateria: "Recargable Li-ion",
      compatibilidad: "NVIDIA Quadro/GeForce",
      alcance: "6 metros",
    },
    dispositivosRelacionados: [
      {
        id: "LATSUR-WS-001",
        tipo: "Workstation",
        modelo: "Dell Precision 7760",
        serie: "LATSUR-WS-001-2024",
        relacion: "Estación Principal",
      },
    ],
  },
  {
    id: "LATSUR-3DM-001",
    tipo: "Mouse 3D",
    modelo: "3Dconnexion SpaceMouse Pro",
    serie: "LATSUR-3DM-001-2024",
    marca: "3Dconnexion",
    estado: "OPERATIVO",
    ubicacion: "Laboratorio LATSUR - Estación 1",
    fechaInstalacion: "15/01/2024",
    responsable: "Dr. Carlos Mendoza",
    especificaciones: {
      grados_libertad: "6 DOF",
      conectividad: "USB",
      botones: "15 botones programables",
      software: "3DxWare 10",
      compatibilidad: "CAD/3D Software",
    },
    dispositivosRelacionados: [
      {
        id: "LATSUR-WS-001",
        tipo: "Workstation",
        modelo: "Dell Precision 7760",
        serie: "LATSUR-WS-001-2024",
        relacion: "Estación Principal",
      },
    ],
  },
]

const equipmentTypes = [
  { value: "TODOS", label: "Todos los Equipos", icon: Monitor, count: 5 },
  { value: "Workstation", label: "Workstations", icon: Monitor, count: 2 },
  { value: "Impresora", label: "Impresoras", icon: Printer, count: 1 },
  { value: "UPS", label: "UPS", icon: Zap, count: 0 },
  { value: "KVM", label: "KVM", icon: Wifi, count: 0 },
  { value: "Monitor", label: "Monitores", icon: Monitor, count: 0 },
  { value: "Gafas 3D", label: "Gafas 3D", icon: Glasses, count: 1 },
  { value: "Mouse 3D", label: "Mouse 3D", icon: Mouse, count: 1 },
  { value: "Notebook", label: "Notebooks", icon: Laptop, count: 0 },
  { value: "Disco Externo", label: "Discos Externos", icon: HardDrive, count: 0 },
]

export function LatsurEquipmentTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [activeFilter, setActiveFilter] = useState("TODOS")
  const [selectedEquipment, setSelectedEquipment] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Filter data based on search term and active filter
  const filteredData = sampleLatsurEquipment.filter((equipment) => {
    const matchesSearch =
      equipment.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.serie.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.responsable.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = activeFilter === "TODOS" || equipment.tipo === activeFilter

    return matchesSearch && matchesFilter
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  const handleViewDetails = (equipment: any) => {
    setSelectedEquipment(equipment)
    setIsModalOpen(true)
  }

  const handleEdit = (equipment: any) => {
    console.log("Edit LATSUR equipment:", equipment)
    // TODO: Implement edit functionality
  }

  const handleDelete = (equipment: any) => {
    console.log("Delete LATSUR equipment:", equipment)
    // TODO: Implement delete functionality
  }

  const handleExport = () => {
    console.log("Export LATSUR equipment data to Excel")
    // TODO: Implement Excel export functionality
  }

  const getEquipmentIcon = (tipo: string) => {
    const equipmentType = equipmentTypes.find((t) => t.value === tipo)
    return equipmentType ? <equipmentType.icon className="w-4 h-4" /> : <Monitor className="w-4 h-4" />
  }

  return (
    <div className="space-y-6">
      {/* Equipment Type Filters */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">Filtrar por Tipo de Equipo</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {equipmentTypes.map((type) => (
            <Button
              key={type.value}
              variant="outline"
              className={`flex items-center gap-2 justify-start p-3 h-auto transition-all duration-200 ${
                activeFilter === type.value
                  ? "bg-white text-blue-600 border-white hover:bg-gray-100 shadow-md"
                  : "bg-blue-500/20 border-white/40 text-white hover:bg-white/10 hover:border-white/60 backdrop-blur-sm"
              }`}
              onClick={() => setActiveFilter(type.value)}
            >
              <type.icon className="w-4 h-4" />
              <div className="text-left">
                <div className="text-sm font-medium">{type.label}</div>
                <div className="text-xs opacity-75">{type.count} equipos</div>
              </div>
            </Button>
          ))}
        </div>
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

        <Button
          onClick={handleExport}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar Excel
        </Button>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">
          Mostrando {filteredData.length} equipo{filteredData.length !== 1 ? "s" : ""}
          {activeFilter !== "TODOS" && ` de tipo ${activeFilter}`}
        </span>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          Equipamiento LATSUR
        </Badge>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden shadow-lg">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Monitor className="w-5 h-5" />
            Equipamiento Laboratorio LATSUR
          </h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-gray-50 to-blue-50">
              <TableHead className="font-semibold text-gray-700">Tipo</TableHead>
              <TableHead className="font-semibold text-gray-700">Modelo</TableHead>
              <TableHead className="font-semibold text-gray-700">Serie</TableHead>
              <TableHead className="font-semibold text-gray-700">Marca</TableHead>
              <TableHead className="font-semibold text-gray-700">Estado</TableHead>
              <TableHead className="font-semibold text-gray-700">Ubicación</TableHead>
              <TableHead className="font-semibold text-gray-700">Responsable</TableHead>
              <TableHead className="font-semibold text-gray-700">Dispositivos Relacionados</TableHead>
              <TableHead className="font-semibold text-gray-700">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                  No se encontraron equipos para los criterios seleccionados
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((equipment, index) => (
                <TableRow
                  key={`${equipment.id}-${index}`}
                  className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-200"
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getEquipmentIcon(equipment.tipo)}
                      <span className="font-medium">{equipment.tipo}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{equipment.modelo}</TableCell>
                  <TableCell className="font-mono text-xs">{equipment.serie}</TableCell>
                  <TableCell>{equipment.marca}</TableCell>
                  <TableCell>
                    <Badge
                      variant="default"
                      className={equipment.estado === "OPERATIVO" ? "bg-green-500" : "bg-orange-500"}
                    >
                      {equipment.estado}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-48 truncate" title={equipment.ubicacion}>
                    {equipment.ubicacion}
                  </TableCell>
                  <TableCell>{equipment.responsable}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {equipment.dispositivosRelacionados.length} dispositivos
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0"
                        onClick={() => handleViewDetails(equipment)}
                        title="Ver detalles y relaciones"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0"
                        onClick={() => handleEdit(equipment)}
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0"
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
                className={currentPage === pageNum ? "bg-gradient-to-r from-blue-500 to-cyan-500" : ""}
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
      {isModalOpen && (
        <LatsurEquipmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          equipment={selectedEquipment}
        />
      )}
    </div>
  )
}
