"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Trash2, Search, Download, ChevronLeft, ChevronRight, Printer, Eye, Plus } from "lucide-react"

// Sample loans data - easily replaceable with real company data
const sampleLoans = [
  //CAMBIAR EN BACKEND 
  {
    estadoRecibo: "ACTIVO",
    nroRecibo: 1,
    fechaRecibo: "06/04/2023",
    grado: "PAC",
    funcionario: "NATALIA NICOLE LOBOS ALARCON",
    departamento: "DEPARTAMENTO COMERCIAL",
    seccion: "SECCION MARKETING",
    dispositivo: "PENDRIVE",
    capacidad: "8 GB",
    serie: "200517382004743310C9",
  },
  

]

const loanTabs = [
  { value: "activos", label: "Pendrives Activos", count: 5 },
  { value: "pendientes", label: "Pendrives Pendientes", count: 0 },
  { value: "disponible", label: "Pendrives Disponible", count: 18 },
  { value: "bajas", label: "Pendrives Bajas", count: 0 },
]

export function LoansTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [activeTab, setActiveTab] = useState("activos")

  // Filter data based on search term and active tab
  const filteredData = sampleLoans.filter((loan) => {
    const matchesSearch =
      loan.funcionario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.departamento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.dispositivo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.serie.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.nroRecibo.toString().includes(searchTerm)

    // Filter by tab (for now, all sample data is "ACTIVO")
    const matchesTab = activeTab === "activos" ? loan.estadoRecibo === "ACTIVO" : true

    return matchesSearch && matchesTab
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  const handleView = (loan: any) => {
    console.log("View loan:", loan)
    // TODO: Implement view functionality
  }

  const handleEdit = (loan: any) => {
    console.log("Edit loan:", loan)
    // TODO: Implement edit functionality
  }

  const handlePrint = (loan: any) => {
    console.log("Print loan:", loan)
    // TODO: Implement print functionality
  }

  const handleDelete = (loan: any) => {
    console.log("Delete loan:", loan)
    // TODO: Implement delete functionality
  }

  const handleExport = () => {
    console.log("Export loans to Excel")
    // TODO: Implement Excel export functionality
  }

  const handleAddDevice = () => {
    console.log("Add new device")
    // TODO: Implement add device functionality
  }

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-blue-500">
          {loanTabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <Button onClick={handleAddDevice} className="bg-teal-500 hover:bg-teal-600">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Dispositivo
            </Button>
            <Button onClick={handleExport} variant="outline" className="border-gray-300">
              <Download className="w-4 h-4 mr-2" />
              Exportar Excel
            </Button>
          </div>

          {/* Search and Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
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

          {/* Table */}
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
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500 p-2"
                          onClick={() => handleEdit(loan)}
                          title="Editar"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-blue-500 hover:bg-blue-600 text-white border-blue-500 p-2"
                          onClick={() => handlePrint(loan)}
                          title="Imprimir"
                        >
                          <Printer className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-cyan-500 hover:bg-cyan-600 text-white border-cyan-500 p-2"
                          onClick={() => handleView(loan)}
                          title="Ver"
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-red-500 hover:bg-red-600 text-white border-red-500 p-2"
                          onClick={() => handleDelete(loan)}
                          title="Eliminar"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
