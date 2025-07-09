"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Search, Download, ChevronLeft, ChevronRight, Printer, Eye, Plus } from "lucide-react"
import { LoanDetailModal } from "./loan-detail-modal"
import { AddLoanModal } from "./add-loan-modal"
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"



interface LoansTableProps {
  deviceType: string
}

export function LoansTable({ deviceType }: LoansTableProps) {
  const [prestamos, setPrestamos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [showDetail, setShowDetail] = useState(false)
  const [selectedLoan, setSelectedLoan] = useState<any>(null)
  const [deviceTypeState, setDeviceType] = useState(deviceType)
  const [showAddModal, setShowAddModal] = useState(false)
  const [availableDevices, setAvailableDevices] = useState<any[]>([])
  const [selectedDevice, setSelectedDevice] = useState<string>("")
  const [equipos, setEquipos] = useState([]) // <--- AGREGA ESTA LÍNEA

  useEffect(() => {
    fetch("http://localhost:3000/api/prestamos")
      .then(res => res.json())
      .then(data => setPrestamos(data))
      .catch(() => setError("No se pudo cargar la lista de préstamos"))
      .finally(() => setLoading(false))
  }, [])

  // Cargar dispositivos disponibles al abrir el modal
  useEffect(() => {
    if (showAddModal) {
      fetch("http://localhost:3000/api/equipos/disponibles")
        .then(res => res.json())
        .then(data => setAvailableDevices(Array.isArray(data) ? data : []))
    }
  }, [showAddModal])

  // Cargar equipos (dispositivos) al cargar el componente
  useEffect(() => {
    fetch("http://localhost:3000/api/equipos/disponibles")
      .then(res => res.json())
      .then(data => setEquipos(Array.isArray(data) ? data : []))
  }, [])

  // Mapea los datos del backend al formato de la tabla
  const loansData = prestamos.map((p) => ({
    estadoRecibo: p.estado === 1 ? "ACTIVO" : p.estado === 0 ? "FINALIZADO" : p.estado === 2 ? "NO APTO" : "DESCONOCIDO",
    nroRecibo: p.id_prestamo,
    fechaRecibo: p.fecha_prestamo ? p.fecha_prestamo.slice(0, 10) : "",
    funcionario: p.nombre_revisor || p.rut_revisor || "-",
    dispositivos: p.equipos && p.equipos.length > 0
      ? p.equipos.map(eq => eq.nombre_pc || eq.modelo || eq.numero_serie).join(', ')
      : '-',
    cantidadDispositivos: p.equipos ? p.equipos.length : 0,
    descripcion: p.descripcion || "",
    raw: p,
  }));

  // Filtro por búsqueda, tipo y estado ACTIVO
  const filteredData = loansData.filter((loan) => {
    const matchesSearch =
      (loan.funcionario || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (loan.dispositivo || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (loan.serie || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (loan.nroRecibo ? loan.nroRecibo.toString() : "").includes(searchTerm)

    let matchesDeviceType = true
    if (deviceType !== "TODOS") {
      if (deviceType === "OTRO") {
        // Mostrar préstamos cuyo equipo no tiene categoría (o es nulo)
        matchesDeviceType =
          !loan.equipo?.categoria ||
          !loan.equipo.categoria.id_categoria
      } else {
        matchesDeviceType =
          !!loan.equipo?.categoria?.id_categoria &&
          String(loan.equipo.categoria.id_categoria) === deviceType
      }
    }

    return matchesSearch && matchesDeviceType
  })

  // Paginación
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  const handleView = (loan: any) => {
    setSelectedLoan(loan)
    setShowDetail(true)
  }

  const handleAddLoan = async () => {
    if (!selectedDevice) return
    // Aquí puedes pedir más datos si lo necesitas (ej: usuario, fecha, etc)
    await fetch("http://localhost:3000/api/prestamos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_equipo: Number(selectedDevice),
        rut_usuario: "PRUEBA", // Cambia esto por el usuario real
        fecha_prestamo: new Date().toISOString().slice(0, 10),
        estado: 1, // ACTIVO
        descripcion: "Préstamo generado desde UI"
      })
    })
    setShowAddModal(false)
    setSelectedDevice("")
    // Refresca la tabla de préstamos activos (puedes llamar a tu función de recarga aquí)
    window.location.reload()
  }

  const handleExportExcel = () => {
    // Solo exporta los datos filtrados y paginados
    const exportData = filteredData.map(loan => ({
      "Estado Recibo": loan.estadoRecibo,
      "Nro. Recibo": loan.nroRecibo,
      "Fecha Recibo": loan.fechaRecibo,
      "Funcionario": loan.funcionario,
      "Ubicación": loan.ubicacion,
      "Dispositivo": loan.equipo?.categoria?.nombre || "-",
      "Capacidad": loan.capacidad,
      "Serie": loan.serie,
      "Descripción": loan.descripcion,
    }))
    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Préstamos")
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" })
    saveAs(blob, "prestamos.xlsx")
  }

  return (
    <div className="space-y-4">
      {/* Acciones y filtros */}
      <div className="flex items-center gap-4">
        <Button onClick={() => setShowAddModal(true)} className="bg-teal-500 hover:bg-teal-600">
          <Plus className="w-4 h-4 mr-2" />
          Agregar Dispositivo
        </Button>
        <Button onClick={handleExportExcel} variant="outline" className="border-gray-300">
          <Download className="w-4 h-4 mr-2" />
          Exportar Excel
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
              <TableHead className="font-semibold text-gray-700">Estado Recibo</TableHead>
              <TableHead className="font-semibold text-gray-700">Nro. Recibo</TableHead>
              <TableHead className="font-semibold text-gray-700">Fecha Recibo</TableHead>
              <TableHead className="font-semibold text-gray-700">Funcionario</TableHead>
              <TableHead className="font-semibold text-gray-700">Dispositivos</TableHead>
              <TableHead className="font-semibold text-gray-700">Cantidad</TableHead>
              <TableHead className="font-semibold text-gray-700">Descripción</TableHead>
              <TableHead className="font-semibold text-gray-700">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                  No hay préstamos activos para los criterios seleccionados.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((loan) => (
                <TableRow key={loan.nroRecibo} className="hover:bg-gray-50">
                  <TableCell>
                    <Badge
                      variant="default"
                      className={loan.estadoRecibo === "ACTIVO" ? "bg-green-500" : "bg-gray-500"}
                    >
                      {loan.estadoRecibo}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{loan.nroRecibo}</TableCell>
                  <TableCell>{loan.fechaRecibo}</TableCell>
                  <TableCell className="max-w-48 truncate" title={loan.funcionario}>
                    {loan.funcionario}
                  </TableCell>
                  <TableCell className="max-w-40 truncate" title={loan.dispositivos}>
                    {loan.dispositivos}
                  </TableCell>
                  <TableCell>{loan.cantidadDispositivos}</TableCell>
                  <TableCell>{loan.descripcion}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleView(loan.raw)} variant="ghost" size="icon" title="Ver Detalle">
                      <Eye className="w-5 h-5" />
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

      {/* Loan Detail Modal */}
      <LoanDetailModal
        loan={selectedLoan}
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        columns={Object.keys(loansData[0] || {})}
      />

      {/* Modal para agregar préstamo */}
      <AddLoanModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        availableDevices={availableDevices}
        selectedDevice={selectedDevice}
        setSelectedDevice={setSelectedDevice}
        onAddLoan={handleAddLoan}
      />
    </div>
  )
}
