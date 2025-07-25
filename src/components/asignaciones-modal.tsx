"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, Monitor, User, MapPin, Building, Search, CheckCircle, Clock, Trash2, Plus } from "lucide-react"
import { RutAutocomplete } from "./rut-autocomplete"

export function AsignacionesModal({ open, onClose }: {
  open: boolean,
  onClose: () => void
}) {
  // Estados existentes
  const [selectedUser, setSelectedUser] = useState("")
  const [selectedUserData, setSelectedUserData] = useState<any>(null) // NUEVO: Datos completos del usuario
  const [selectedEquipos, setSelectedEquipos] = useState<number[]>([])
  const [equipos, setEquipos] = useState<any[]>([])
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  
  // Estados de búsqueda
  const [searchEquipos, setSearchEquipos] = useState("")
  const [selectedCategoriaEquipo, setSelectedCategoriaEquipo] = useState("TODOS")
  const [categoriasEquipos, setCategoriasEquipos] = useState<any[]>([])
  
  // NUEVOS ESTADOS para el documento
  const [grado, setGrado] = useState("")
  const [seccion, setSeccion] = useState("")
  const [nDePt, setNDePt] = useState("")
  const [ubicacionTipo, setUbicacionTipo] = useState("") // TORRE o TALLERES
  const [ubicacionEspecifica, setUbicacionEspecifica] = useState("")
  const [personaInterviene, setPersonaInterviene] = useState("")
  const [personaIntervieneData, setPersonaIntervieneData] = useState<any>(null)
  const [distribucion, setDistribucion] = useState("2. Ejs. 1 Hja")
  const [nota, setNota] = useState("") // NUEVO: Campo para nota
  
  // Estados para ubicaciones
  const [ubicacionesTorre, setUbicacionesTorre] = useState<any[]>([])
  const [ubicacionesTalleres, setUbicacionesTalleres] = useState<any[]>([])

  // Estados para mostrar asignaciones activas e historial
  const [activeTab, setActiveTab] = useState("asignar")
  const [asignacionesActivas, setAsignacionesActivas] = useState<any[]>([])
  const [historialAsignaciones, setHistorialAsignaciones] = useState<any[]>([])

  useEffect(() => {
    if (open) {
      // Cargar equipos disponibles
      fetch("http://localhost:3000/api/equipos/disponibles")
        .then(res => res.json())
        .then(data => setEquipos(Array.isArray(data) ? data : []))

      // Cargar categorías de equipos
      fetch("http://localhost:3000/api/equipos/categorias")
        .then(res => res.json())
        .then(data => {
          const categoriasArray = Array.isArray(data) ? data : []
          setCategoriasEquipos(categoriasArray)
        })
        .catch(err => {
          console.error("Error fetching categorias:", err)
          setCategoriasEquipos([])
        })

      // Cargar usuarios IGM
      fetch("http://localhost:3000/api/igm/usuarios")
        .then(res => res.json())
        .then(data => setUsuarios(Array.isArray(data) ? data : []))

      // Cargar ubicaciones
      fetch("http://localhost:3000/api/equipos/ubicaciones")
        .then(res => res.json())
        .then(data => {
          const torre = data.filter((ub: any) => ub.cod_ti_ubicacion >= 1 && ub.cod_ti_ubicacion <= 9)
          const talleres = data.filter((ub: any) => ub.cod_ti_ubicacion >= 10 && ub.cod_ti_ubicacion <= 13)
          setUbicacionesTorre(torre)
          setUbicacionesTalleres(talleres)
        })

      // Cargar asignaciones activas
      fetch("http://localhost:3000/api/asignaciones")
        .then(res => res.json())
        .then(data => setAsignacionesActivas(Array.isArray(data) ? data : []))

      // Cargar historial
      fetch("http://localhost:3000/api/asignaciones/historial")
        .then(res => res.json())
        .then(data => setHistorialAsignaciones(Array.isArray(data) ? data : []))
    }
  }, [open])

  const handleAsignar = async () => {
    if (!selectedUser || selectedEquipos.length === 0) {
      alert("Seleccione un usuario y al menos un equipo")
      return
    }

    // Validar campos obligatorios para el documento
    if (!grado || !seccion || !nDePt || !ubicacionTipo || !ubicacionEspecifica || !personaInterviene) {
      alert("Complete todos los campos obligatorios para generar el documento")
      return
    }

    try {
      setLoading(true)

      // 1. Crear asignaciones individuales
      for (const equipoId of selectedEquipos) {
        await fetch("http://localhost:3000/api/asignaciones", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_equipo: equipoId,
            rut_usuario: selectedUser
          })
        })
      }

      // 2. Generar documento Word
      const response = await fetch("http://localhost:3000/api/asignaciones/generar-documento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rut_usuario: selectedUser,
          equipos_ids: selectedEquipos,
          grado: selectedUserData?.grado || grado,
          seccion,
          n_de_pt: nDePt,
          ubicacion_tipo: ubicacionTipo,
          ubicacion_especifica: ubicacionEspecifica,
          persona_interviene: personaInterviene,
          persona_interviene_datos: personaIntervieneData, // NUEVO: Datos completos de la persona que interviene
          usuario_datos: selectedUserData, // NUEVO: Datos completos del usuario destinatario
          distribucion,
          nota
        })
      })

      if (response.ok) {
        // Descargar documento automáticamente
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `asignacion_${selectedUser}_${new Date().toISOString().split('T')[0]}.docx`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        alert("Asignación creada y documento generado correctamente")
        
        // Recargar datos
        fetch("http://localhost:3000/api/asignaciones")
          .then(res => res.json())
          .then(data => setAsignacionesActivas(Array.isArray(data) ? data : []))
        
        fetch("http://localhost:3000/api/asignaciones/historial")
          .then(res => res.json())
          .then(data => setHistorialAsignaciones(Array.isArray(data) ? data : []))

        // Limpiar formulario
        setSelectedUser("")
        setSelectedUserData(null) // NUEVO: Limpiar datos del usuario
        setSelectedEquipos([])
        setGrado("")
        setSeccion("")
        setNDePt("")
        setUbicacionTipo("")
        setUbicacionEspecifica("")
        setPersonaInterviene("")
        setPersonaIntervieneData(null)
        setDistribucion("2. Ejs. 1 Hja")
        setNota("")
        
        setActiveTab("activas")
      } else {
        throw new Error('Error al generar documento')
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al procesar la asignación")
    } finally {
      setLoading(false)
    }
  }

  const handleEliminarAsignacion = async (id: number) => {
    if (confirm("¿Está seguro de eliminar esta asignación?")) {
      try {
        await fetch(`http://localhost:3000/api/asignaciones/${id}`, {
          method: "DELETE"
        })
        
        // Recargar datos
        fetch("http://localhost:3000/api/asignaciones")
          .then(res => res.json())
          .then(data => setAsignacionesActivas(Array.isArray(data) ? data : []))
      } catch (error) {
        console.error("Error eliminando asignación:", error)
        alert("Error al eliminar la asignación")
      }
    }
  }

  // Obtener ubicaciones según el tipo seleccionado
  const getUbicacionesDisponibles = () => {
    return ubicacionTipo === "TORRE" ? ubicacionesTorre : 
           ubicacionTipo === "TALLERES" ? ubicacionesTalleres : []
  }

  // Filtrar equipos
  const filteredEquipos = equipos.filter(eq => {
    const matchesSearch = (eq.nombre_pc?.toLowerCase().includes(searchEquipos.toLowerCase()) || 
                          eq.numero_serie?.toLowerCase().includes(searchEquipos.toLowerCase()) ||
                          eq.modelo?.toLowerCase().includes(searchEquipos.toLowerCase()))
    
    const matchesCategory = selectedCategoriaEquipo === "TODOS" || 
                           eq.categoria?.desc_tipo === selectedCategoriaEquipo
    
    return matchesSearch && matchesCategory
  })

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50">
      <div 
        className="fixed inset-0 w-full h-full bg-white flex flex-col"
        style={{ 
          margin: 0,
          padding: 0,
          width: '100vw',
          height: '100vh',
          maxWidth: 'none',
          maxHeight: 'none'
        }}
      >
        {/* HEADER FIJO - OCUPA TODO EL ANCHO */}
        <div className="w-full shrink-0 border-b bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-6">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-6">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Sistema de Asignaciones de Equipos IGM</h1>
                <p className="text-blue-100 text-lg font-normal mt-1">
                  Gestión integral de asignaciones y documentación automática
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="text-white hover:bg-white/20 p-3 h-auto text-3xl"
            >
              ×
            </Button>
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL - EXPANSIÓN TOTAL */}
        <div className="flex-1 bg-gray-50 w-full overflow-y-auto" style={{ maxHeight: 'calc(100vh - 120px)' }}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col w-full">
            {/* TABS NAVIGATION - ANCHO COMPLETO */}
            <div className="shrink-0 bg-white border-b shadow-sm w-full sticky top-0 z-10">
              <div className="px-8 py-4 w-full">
                <TabsList className="grid w-full max-w-2xl grid-cols-3 h-12 text-lg">
                  <TabsTrigger value="asignar" className="flex items-center gap-3 text-base font-medium py-3">
                    <FileText className="w-5 h-5" />
                    Nueva Asignación
                  </TabsTrigger>
                  <TabsTrigger value="activas" className="flex items-center gap-3 text-base font-medium py-3">
                    <CheckCircle className="w-5 h-5" />
                    Activas ({asignacionesActivas.length})
                  </TabsTrigger>
                  <TabsTrigger value="historial" className="flex items-center gap-3 text-base font-medium py-3">
                    <Clock className="w-5 h-5" />
                    Historial ({historialAsignaciones.length})
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            {/* TAB: Nueva Asignación - LAYOUT SÚPER EXPANDIDO */}
            <TabsContent value="asignar" className="flex-1 overflow-hidden m-0 w-full">
              <div className="h-full w-full p-8">
                <div className="grid grid-cols-12 gap-8 h-full w-full">
                  
                  {/* COLUMNA IZQUIERDA: Usuario y Equipos (8 columnas - 66%) */}
                  <div className="col-span-8 space-y-6 h-full flex flex-col">
                    
                    {/* Card de Usuario - EXPANDIDA */}
                    <Card className="shadow-xl border-0 shrink-0">
                      <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-lg py-4">
                        <CardTitle className="flex items-center gap-4 text-indigo-900 text-xl">
                          <User className="w-6 h-6" />
                          Selección de Usuario Destinatario
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="grid grid-cols-3 gap-8">
                          <div className="col-span-2">
                            <label className="block text-base font-semibold mb-3 text-gray-700">Usuario Destinatario:</label>
                            <RutAutocomplete 
                              value={selectedUser} 
                              onChange={setSelectedUser}
                              onUserSelected={(user) => {
                                console.log("Usuario seleccionado para asignación:", user)
                                setSelectedUserData(user)
                                // Auto-completar campos si están vacíos
                                if (user.grado && !grado) {
                                  setGrado(user.grado)
                                }
                              }}
                            />
                            {/* Mostrar datos del usuario seleccionado */}
                            {selectedUserData && (
                              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                <div className="text-sm">
                                  <div><strong>Nombre:</strong> {selectedUserData.nombres} {selectedUserData.apaterno} {selectedUserData.amaterno}</div>
                                  <div><strong>Grado:</strong> {selectedUserData.grado || 'No especificado'}</div>
                                  <div><strong>Cargo:</strong> {selectedUserData.cargo || 'No especificado'}</div>
                                  <div><strong>Departamento:</strong> {selectedUserData.departamento}</div>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="col-span-1 flex items-end">
                            <Badge variant="secondary" className="py-3 px-5 bg-emerald-100 text-emerald-800 text-base">
                              {selectedEquipos.length} equipo(s) seleccionado(s)
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Card de Equipos - MÁXIMA EXPANSIÓN */}
                    <Card className="shadow-xl border-0 flex-1 flex flex-col overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-t-lg shrink-0 py-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-4 text-emerald-900 text-xl">
                            <Monitor className="w-6 h-6" />
                            Equipos Disponibles para Asignación
                          </CardTitle>
                          <Badge variant="secondary" className="py-2 px-4 bg-emerald-100 text-emerald-800 text-lg">
                            {selectedEquipos.length} de {filteredEquipos.length} seleccionados
                          </Badge>
                        </div>
                        {/* Buscador y filtros integrados en el header */}
                        <div className="mt-4 flex gap-4">
                          <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                              placeholder="Buscar equipos por nombre, serie o modelo..."
                              value={searchEquipos}
                              onChange={(e) => setSearchEquipos(e.target.value)}
                              className="pl-12 h-12 text-base bg-white"
                            />
                          </div>
                          <div className="w-64">
                            <Select value={selectedCategoriaEquipo} onValueChange={setSelectedCategoriaEquipo}>
                              <SelectTrigger className="h-12 text-base bg-white">
                                <SelectValue placeholder="Filtrar por tipo..." />
                              </SelectTrigger>
                              <SelectContent className="z-[10000]">
                                <SelectItem value="TODOS">Todos los tipos</SelectItem>
                                {categoriasEquipos
                                  .filter((cat) => cat && cat.desc_tipo && cat.desc_tipo !== "OTRO")
                                  .sort((a, b) => (a.desc_tipo || "").localeCompare(b.desc_tipo || ""))
                                  .map((cat) => (
                                    <SelectItem key={cat.id_tipo} value={cat.desc_tipo}>
                                      {cat.desc_tipo}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
                        {/* Tabla expandida al máximo */}
                        <div className="flex-1 overflow-auto">
                          <Table>
                            <TableHeader className="sticky top-0 bg-gray-100">
                              <TableRow>
                                <TableHead className="w-16 text-center">
                                  <input
                                    type="checkbox"
                                    checked={selectedEquipos.length === filteredEquipos.length && filteredEquipos.length > 0}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedEquipos(filteredEquipos.map(eq => eq.id_equipo))
                                      } else {
                                        setSelectedEquipos([])
                                      }
                                    }}
                                    className="w-5 h-5"
                                  />
                                </TableHead>
                                <TableHead className="font-semibold text-base">Nombre PC</TableHead>
                                <TableHead className="font-semibold text-base">Serie</TableHead>
                                <TableHead className="font-semibold text-base">Modelo</TableHead>
                                <TableHead className="font-semibold text-base">Categoría</TableHead>
                                <TableHead className="font-semibold text-base">Estado</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredEquipos.map(eq => (
                                <TableRow key={eq.id_equipo} className="hover:bg-gray-50 transition-colors">
                                  <TableCell className="text-center">
                                    <input
                                      type="checkbox"
                                      checked={selectedEquipos.includes(eq.id_equipo)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedEquipos([...selectedEquipos, eq.id_equipo])
                                        } else {
                                          setSelectedEquipos(selectedEquipos.filter(id => id !== eq.id_equipo))
                                        }
                                      }}
                                      className="w-5 h-5"
                                    />
                                  </TableCell>
                                  <TableCell className="font-medium text-base">{eq.nombre_pc || "-"}</TableCell>
                                  <TableCell className="font-mono text-base">{eq.numero_serie || "-"}</TableCell>
                                  <TableCell className="text-base">{eq.modelo || "-"}</TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className="text-sm">
                                      {eq.categoria?.desc_tipo || "-"}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge className="bg-green-500 hover:bg-green-600 text-sm">
                                      DISPONIBLE
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* COLUMNA DERECHA: Datos del Documento (4 columnas - 33%) */}
                  <div className="col-span-4 h-full">
                    <Card className="shadow-xl border-0 h-full flex flex-col">
                      <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-t-lg py-4 shrink-0">
                        <CardTitle className="flex items-center gap-4 text-amber-900 text-xl">
                          <FileText className="w-6 h-6" />
                          Datos para Documento de Asignación
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 flex-1 overflow-auto">
                        <div className="space-y-6">
                          <div>
                            <label className="block text-base font-semibold mb-2 text-gray-700">Grado *</label>
                            <Input
                              value={grado}
                              onChange={(e) => setGrado(e.target.value)}
                              placeholder="ej: Sargento Segundo"
                              className="h-12 text-base"
                            />
                          </div>

                          <div>
                            <label className="block text-base font-semibold mb-2 text-gray-700">Sección *</label>
                            <Input
                              value={seccion}
                              onChange={(e) => setSeccion(e.target.value)}
                              placeholder="ej: U de Cuartel"
                              className="h-12 text-base"
                            />
                          </div>

                          <div>
                            <label className="block text-base font-semibold mb-2 text-gray-700">N° DE P.T. *</label>
                            <Input
                              value={nDePt}
                              onChange={(e) => setNDePt(e.target.value)}
                              placeholder="ej: 2"
                              className="h-12 text-base"
                            />
                          </div>

                          <div>
                            <label className="block text-base font-semibold mb-2 text-gray-700">Ubicación *</label>
                            <Select value={ubicacionTipo} onValueChange={setUbicacionTipo}>
                              <SelectTrigger className="h-12 text-base">
                                <SelectValue placeholder="Seleccione ubicación" />
                              </SelectTrigger>
                              <SelectContent className="z-[10000]">
                                <SelectItem value="TORRE">Torre</SelectItem>
                                <SelectItem value="TALLERES">Talleres</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {ubicacionTipo && (
                            <div>
                              <label className="block text-base font-semibold mb-2 text-gray-700">
                                {ubicacionTipo === "TORRE" ? "Piso" : "Área"} *
                              </label>
                              <Select value={ubicacionEspecifica} onValueChange={setUbicacionEspecifica}>
                                <SelectTrigger className="h-12 text-base">
                                  <SelectValue placeholder={`Seleccione ${ubicacionTipo === "TORRE" ? "piso" : "área"}`} />
                                </SelectTrigger>
                                <SelectContent className="z-[10000]">
                                  {getUbicacionesDisponibles().map(ub => (
                                    <SelectItem key={ub.cod_ti_ubicacion} value={ub.des_ti_ubicacion}>
                                      {ub.des_ti_ubicacion}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          <div>
                            <label className="block text-base font-semibold mb-2 text-gray-700">Persona que Interviene *</label>
                            <RutAutocomplete 
                              value={personaInterviene} 
                              onChange={setPersonaInterviene}
                              onUserSelected={(user) => {
                                console.log("Persona que interviene seleccionada:", user)
                                setPersonaIntervieneData(user)
                              }}
                            />
                          </div>

                          <div>
                            <label className="block text-base font-semibold mb-2 text-gray-700">Distribución</label>
                            <textarea
                              className="w-full p-3 border rounded-lg resize-none h-20 text-base"
                              value={distribucion}
                              onChange={(e) => setDistribucion(e.target.value)}
                              placeholder="Distribución del documento..."
                            />
                          </div>

                          <div>
                            <label className="block text-base font-semibold mb-2 text-gray-700">Nota Adicional</label>
                            <textarea
                              className="w-full p-3 border rounded-lg resize-none h-24 text-base"
                              value={nota}
                              onChange={(e) => setNota(e.target.value)}
                              placeholder="Observaciones o notas adicionales para el documento..."
                            />
                          </div>

                          <Button 
                            onClick={handleAsignar} 
                            disabled={!selectedUser || selectedEquipos.length === 0 || loading}
                            className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-xl"
                            size="lg"
                          >
                            {loading ? (
                              <div className="flex items-center gap-3">
                                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                                Generando...
                              </div>
                            ) : (
                              `Asignar ${selectedEquipos.length} Equipo(s) y Generar Documento`
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB: Asignaciones Activas - EXPANDIDA */}
            <TabsContent value="activas" className="flex-1 overflow-hidden m-0 w-full">
              <div className="h-full p-8 w-full">
                <Card className="h-full shadow-xl border-0 w-full">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg py-4">
                    <CardTitle className="flex items-center gap-4 text-green-900 text-xl">
                      <CheckCircle className="w-6 h-6" />
                      Asignaciones Activas ({asignacionesActivas.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 h-full">
                    <div className="overflow-auto h-full">
                      <Table>
                        <TableHeader className="sticky top-0 bg-gray-100">
                          <TableRow>
                            <TableHead className="font-semibold text-base">Usuario</TableHead>
                            <TableHead className="font-semibold text-base">Equipo</TableHead>
                            <TableHead className="font-semibold text-base">Modelo</TableHead>
                            <TableHead className="font-semibold text-base">Serie</TableHead>
                            <TableHead className="font-semibold text-base">Fecha Asignación</TableHead>
                            <TableHead className="font-semibold text-base">Estado</TableHead>
                            <TableHead className="font-semibold text-base">Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {asignacionesActivas.map((asignacion) => (
                            <TableRow key={asignacion.id_asignacion} className="hover:bg-gray-50">
                              <TableCell className="font-medium text-base">
                                {asignacion.usuario_nombre || asignacion.rut_usuario}
                              </TableCell>
                              <TableCell className="text-base">{asignacion.equipo_nombre || "-"}</TableCell>
                              <TableCell className="text-base">{asignacion.equipo_modelo || "-"}</TableCell>
                              <TableCell className="font-mono text-base">{asignacion.equipo_serie || "-"}</TableCell>
                              <TableCell className="text-base">{new Date(asignacion.fecha_asignacion).toLocaleDateString('es-CL')}</TableCell>
                              <TableCell>
                                <Badge className="bg-green-500 hover:bg-green-600 text-sm">ACTIVA</Badge>
                              </TableCell>
                              <TableCell>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleEliminarAsignacion(asignacion.id_asignacion)}
                                  className="h-10"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* TAB: Historial - EXPANDIDA */}
            <TabsContent value="historial" className="flex-1 overflow-hidden m-0 w-full">
              <div className="h-full p-8 w-full">
                <Card className="h-full shadow-xl border-0 w-full">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-t-lg py-4">
                    <CardTitle className="flex items-center gap-4 text-purple-900 text-xl">
                      <Clock className="w-6 h-6" />
                      Historial de Asignaciones ({historialAsignaciones.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 h-full">
                    <div className="overflow-auto h-full">
                      <Table>
                        <TableHeader className="sticky top-0 bg-gray-100">
                          <TableRow>
                            <TableHead className="font-semibold text-base">Usuario</TableHead>
                            <TableHead className="font-semibold text-base">Equipo</TableHead>
                            <TableHead className="font-semibold text-base">Modelo</TableHead>
                            <TableHead className="font-semibold text-base">Serie</TableHead>
                            <TableHead className="font-semibold text-base">Fecha Asignación</TableHead>
                            <TableHead className="font-semibold text-base">Duración</TableHead>
                            <TableHead className="font-semibold text-base">Estado</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {historialAsignaciones.map((registro) => (
                            <TableRow key={registro.id_asignacion} className="hover:bg-gray-50">
                              <TableCell className="font-medium text-base">
                                {registro.usuario_nombre || registro.rut_usuario}
                              </TableCell>
                              <TableCell className="text-base">{registro.equipo_nombre || "-"}</TableCell>
                              <TableCell className="text-base">{registro.equipo_modelo || "-"}</TableCell>
                              <TableCell className="font-mono text-base">{registro.equipo_serie || "-"}</TableCell>
                              <TableCell className="text-base">{new Date(registro.fecha_asignacion).toLocaleDateString('es-CL')}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-sm">
                                  {registro.duracion_dias || 0} días
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant={registro.activa ? "default" : "secondary"} 
                                  className={registro.activa ? "bg-green-500" : "bg-gray-500"}
                                >
                                  {registro.activa ? "ACTIVA" : "FINALIZADA"}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}