"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Search, Download, ChevronLeft, ChevronRight, Eye, Monitor } from "lucide-react"
import { EquipmentDetailModal } from "./equipment-detail-modal"
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"



interface EquipmentTableProps {
  selectedPropietario: string
  refresh: boolean
  onCountChange?: (count: number) => void
}

export function EquipmentTable({ selectedPropietario, refresh, onCountChange }: EquipmentTableProps) {
  const [equipos, setEquipos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    setLoading(true)
    fetch("http://localhost:3000/api/equipos")
      .then(res => res.json())
      .then(data => {
        const mapped = data.map((eq: any) => ({
          serie: eq.numero_serie || "",
          modeloPC: eq.modelo || "",
          disco: eq.almacenamiento || "",
          ram: eq.ram || "",
          procesador: eq.procesador || "",
          velocidad: "", // Si tienes un campo de velocidad, mapea aquí
          marca: typeof eq.marca === "object" && eq.marca !== null ? eq.marca.nombre : eq.marca || "",
          mac: eq.direccion_mac || "",
          ip: eq.ip || "",
          nombrePC: eq.nombre_pc || "",
          propietario: eq.propietario || "",
          id_propietario: eq.id_propietario,
          ubicacion: typeof eq.ubicacion === "object" && eq.ubicacion !== null ? eq.ubicacion.nombre : eq.ubicacion || "",
          categoria: typeof eq.categoria === "object" && eq.categoria !== null
  ? eq.categoria.nombre
  : eq.categoria || "",
          id_equipo: eq.id_equipo,
          llave_inventario: eq.llave_inventario || "",
          fechaAdquisicion: formatFecha(eq.fecha_adquisicion),
          fechaAsignacion: formatFecha(eq.fecha_asignacion), // <-- AGREGA ESTA LÍNEA
          version_sistema_operativo: eq.version_sistema_operativo || "", // Agregado aquí
          version_office: eq.version_office || "", // Agregado aquí
        }))
        setEquipos(mapped)
      })
      .catch(() => setError("No se pudo cargar la lista de equipos"))
      .finally(() => setLoading(false))
  }, [refresh])

  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedEquipment, setSelectedEquipment] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategoria, setSelectedCategoria] = useState("TODOS")
  const [categorias, setCategorias] = useState<any[]>([])

  // Filtrado por propietario (si aplica)
  const filteredData = selectedPropietario === "TODOS"
    ? equipos
    : equipos.filter(eq => eq.id_propietario?.toString() === selectedPropietario);

  const filteredByCategoria = selectedCategoria === "TODOS"
    ? filteredData
    : filteredData.filter(eq => eq.categoria === selectedCategoria);

  // Fetch categories for filtering
  useEffect(() => {
    fetch("http://localhost:3000/api/categorias")
      .then(res => res.json())
      .then(data => setCategorias(data))
      .catch(() => setError("No se pudo cargar las categorías"))
  }, [])

  // Filter data based on search term, selected propietario, and selected categoria
  const dataToDisplay = filteredByCategoria.filter((equipment) => {
    const matchesSearch =
      equipment.nombrePC.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.serie.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.modeloPC.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.ip.includes(searchTerm)

    const matchesCategoria = selectedCategoria === "TODOS" || equipment.categoria === selectedCategoria

    return matchesSearch && matchesCategoria
  })

  // Pagination logic
  const totalPages = Math.ceil(dataToDisplay.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = dataToDisplay.slice(startIndex, startIndex + itemsPerPage)

  const handleViewDetails = (equipment: any) => {
    setSelectedEquipment(equipment)
    setIsModalOpen(true)
  }

  const handleEdit = (equipment: any) => {
    console.log("Edit equipment:", equipment)
    // TODO: Implement edit functionality
  }

  const handleDelete = (equipment: any) => {
    console.log("Delete equipment:", equipment)
    // TODO: Implement delete functionality
  }

  const handleExport = () => {
    console.log("Exporting data to Excel")
    // Exporta solo los datos visibles en la tabla
    const exportData = dataToDisplay.map(({ id_equipo, ...row }) => row) // quita id_equipo si no quieres exportarlo
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

  if (loading) return <div>Cargando...</div>
  if (error) return <div>{error}</div>

  // Encuentra el nombre del propietario seleccionado
  const propietarioSeleccionado = equipos.find(eq => eq.id_propietario?.toString() === selectedPropietario)
  const propietarioNombre = propietarioSeleccionado ? propietarioSeleccionado.propietario : ""

  // Utilidad para agrupar y contar
  function groupCount(arr, keyFn) {
    const map = new Map();
    arr.forEach(item => {
      const key = keyFn(item);
      if (!key) return;
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries()).map(([key, count]) => ({ key, count }));
  }

  // Agrupa por versión de Windows (detecta "windows" en version_sistema_operativo)
  const windowsCounts = groupCount(equipos, eq => {
    const v = eq.version_sistema_operativo?.toLowerCase() || "";
    if (v.includes("windows")) {
      // Extrae "Windows X" o "Windows X.X"
      const match = v.match(/windows\s*([0-9]+(\.[0-9]+)?)/i);
      return match ? `Windows ${match[1]}` : "Windows";
    }
    return null;
  }).sort((a, b) => b.count - a.count);

  // Agrupa por versión de Office
  const officeCounts = groupCount(equipos, eq => {
    const v = eq.version_office?.toLowerCase() || "";
    if (v.includes("office")) {
      // Extrae "Office XXXX" o "Office 365"
      const match = v.match(/office\s*([0-9]{4}|365)/i);
      return match ? `Office ${match[1]}` : "Office";
    }
    return null;
  }).sort((a, b) => b.count - a.count);

  // Agrupa por marca
  const marcaCounts = groupCount(equipos, eq => eq.marca || null).sort((a, b) => b.count - a.count);

  // Paleta de colores para los recuadros (puedes agregar más)
  const cardColors = [
    "bg-blue-500", "bg-green-500", "bg-orange-500", "bg-purple-500", "bg-pink-500", "bg-yellow-500", "bg-cyan-500"
  ];

  const handleShowDetail = (eq) => {
    setSelectedEquipment({
      ...eq,
      fechaAsignacion: eq.fecha_asignacion || eq.fechaAsignacion || "", // mapea correctamente
      fechaAdquisicion: eq.fecha_adquisicion || eq.fechaAdquisicion || "",
      // ...otros campos si es necesario
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Search and Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar equipos..."
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

        <Button onClick={handleExport} className="bg-green-600 hover:bg-green-700">
          <Download className="w-4 h-4 mr-2" />
          Exportar Excel
        </Button>
      </div>

      {/* Filter by category */}
      <div className="flex items-center gap-4 mb-2">
        <label className="text-sm">Filtrar por tipo:</label>
        <select
          value={selectedCategoria}
          onChange={e => setSelectedCategoria(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="TODOS">Todos</option>
          {categorias.map(cat => (
            <option key={cat.id_categoria} value={cat.nombre}>{cat.nombre}</option>
          ))}
        </select>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Mostrando {dataToDisplay.length} equipo{dataToDisplay.length !== 1 ? "s" : ""}
          {selectedPropietario !== "TODOS" && propietarioNombre && ` para ${propietarioNombre}`}
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
              <TableHead className="font-semibold text-gray-700 min-w-[70px]">MAC</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[70px]">IP</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[80px]">Nombre PC</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[60px]">Categoria</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[120px]">Versión SO</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[100px]">Versión Office</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[50px] whitespace-nowrap text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} className="text-center py-8 text-gray-500">
                  No se encontraron equipos para los criterios seleccionados
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((equipment, index) => (
                <TableRow key={equipment.serie + '-' + index}>
                  <TableCell className="font-mono text-xs">{equipment.serie}</TableCell>
                  <TableCell className="min-w-[110px]">
                    {equipment.fechaAdquisicion
    ? equipment.fechaAdquisicion.split("T")[0].split("-").reverse().join("-")
    : "-"}
                  </TableCell>
                  <TableCell className="min-w-[90px]">
                    {equipment.id_propietario === 1 && equipment.llave_inventario ? equipment.llave_inventario : ""}
                  </TableCell>
                  <TableCell>{equipment.modeloPC}</TableCell>
                  <TableCell>{equipment.disco}</TableCell>
                  <TableCell>{equipment.ram}</TableCell>
                  <TableCell className="max-w-24 truncate" title={equipment.procesador}>
                    {equipment.procesador}
                  </TableCell>
                  <TableCell>{equipment.marca}</TableCell>
                  <TableCell className="font-mono text-xs">{equipment.mac}</TableCell>
                  <TableCell className="font-mono text-xs">{equipment.ip}</TableCell>
                  <TableCell className="font-semibold">{equipment.nombrePC}</TableCell>
                  <TableCell>{equipment.categoria}</TableCell>
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

function formatFecha(fecha: string) {
  if (!fecha) return "";
  // Si viene con hora, corta solo la fecha
  return fecha.split("T")[0].split("-").reverse().join("-");
}
