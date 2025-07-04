"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Search, Download, ChevronLeft, ChevronRight, Printer, Eye, Plus } from "lucide-react"
import { LoanDetailModal } from "./loan-detail-modal"



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

  useEffect(() => {
    fetch("http://localhost:3000/api/prestamos")
      .then(res => res.json())
      .then(data => setPrestamos(data))
      .catch(() => setError("No se pudo cargar la lista de préstamos"))
      .finally(() => setLoading(false))
  }, [])

  // Mapea los datos del backend al formato de la tabla
  const loansData = prestamos.map((p) => ({
    estadoRecibo:
      p.estado === 1
        ? "ACTIVO"
        : p.estado === 0
        ? "FINALIZADO"
        : p.estado === 2
        ? "NO APTO"
        : "DESCONOCIDO",
    nroRecibo: p.id_prestamo,
    fechaRecibo: p.fecha_prestamo ? p.fecha_prestamo.slice(0, 10) : "",
    grado: "-", // Si tienes este dato en el equipo o usuario, cámbialo aquí
    funcionario: p.rut_usuario,
    departamento: "-", // Si tienes este dato, cámbialo aquí
    seccion: "-", // Si tienes este dato, cámbialo aquí
    dispositivo: p.equipo?.categoria || "OTRO",
    capacidad: p.equipo?.almacenamiento || "-",
    serie: p.equipo?.numero_serie || "-",
    descripcion: p.descripcion || "",
    equipo: p.equipo,
    raw: p,
  }))

  // Filtro por búsqueda, tipo y estado ACTIVO
  const filteredData = loansData.filter((loan) => {
    const matchesSearch =
      loan.funcionario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.departamento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.dispositivo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.serie.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.nroRecibo.toString().includes(searchTerm)

    const matchesDeviceType =
      deviceType === "TODOS" ? true : loan.dispositivo?.toUpperCase() === deviceType

    // Quita temporalmente el filtro de estado para debug
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

  return (
    <div className="space-y-4">
      {/* Acciones y filtros */}
      <div className="flex items-center gap-4">
        <Button onClick={() => {}} className="bg-teal-500 hover:bg-teal-600">
          <Plus className="w-4 h-4 mr-2" />
          Agregar Dispositivo
        </Button>
        <Button onClick={() => {}} variant="outline" className="border-gray-300">
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
              <TableHead className="font-semibold text-gray-700">Grado</TableHead>
              <TableHead className="font-semibold text-gray-700">Funcionario</TableHead>
              <TableHead className="font-semibold text-gray-700">Departamento</TableHead>
              <TableHead className="font-semibold text-gray-700">Sección</TableHead>
              <TableHead className="font-semibold text-gray-700">Dispositivo</TableHead>
              <TableHead className="font-semibold text-gray-700">Capacidad</TableHead>
              <TableHead className="font-semibold text-gray-700">Serie</TableHead>
              <TableHead className="font-semibold text-gray-700">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((loan, index) => (
              <TableRow key={`${loan.nroRecibo}-${index}`} className="hover:bg-gray-50">
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
                <TableCell>{loan.grado}</TableCell>
                <TableCell className="max-w-48 truncate" title={loan.funcionario}>
                  {loan.funcionario}
                </TableCell>
                <TableCell className="max-w-40 truncate" title={loan.departamento}>
                  {loan.departamento}
                </TableCell>
                <TableCell className="max-w-32 truncate" title={loan.seccion}>
                  {loan.seccion}
                </TableCell>
                <TableCell>{loan.dispositivo}</TableCell>
                <TableCell>{loan.capacidad}</TableCell>
                <TableCell className="font-mono text-xs" title={loan.serie}>
                  {loan.serie.substring(0, 15)}...
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {/* Aquí van los botones de acción */}
                    <Button size="sm" variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50" onClick={() => {}}>
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-gray-600 border-gray-200 hover:bg-gray-50" onClick={() => {}}>
                      <Printer className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50" onClick={() => handleView(loan)}>
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => {}}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
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
    </div>
  )
}
