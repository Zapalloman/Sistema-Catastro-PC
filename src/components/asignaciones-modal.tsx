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
import { Users, FileText, Monitor, User, MapPin, Building, Search, CheckCircle, Clock, Trash2 } from "lucide-react"

export function AsignacionesModal({ open, onClose }: {
  open: boolean,
  onClose: () => void
}) {
  // Estados existentes
  const [selectedUser, setSelectedUser] = useState("")
  const [selectedEquipos, setSelectedEquipos] = useState<number[]>([])
  const [equipos, setEquipos] = useState<any[]>([])
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  
  // Estados de búsqueda
  const [searchEquipos, setSearchEquipos] = useState("")
  const [searchUsuarios, setSearchUsuarios] = useState("")
  
  // NUEVOS ESTADOS para el documento
  const [grado, setGrado] = useState("")
  const [seccion, setSeccion] = useState("")
  const [nDePt, setNDePt] = useState("")
  const [ubicacionTipo, setUbicacionTipo] = useState("") // TORRE o TALLERES
  const [ubicacionEspecifica, setUbicacionEspecifica] = useState("")
  const [personaInterviene, setPersonaInterviene] = useState("")
  const [distribucion, setDistribucion] = useState("2. Ejs. 1 Hja")
  
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

      // Cargar usuarios IGM
      fetch("http://localhost:3000/api/igm/usuarios")
        .then(res => res.json())
        .then(data => setUsuarios(Array.isArray(data) ? data : []))

      // Cargar ubicaciones
      fetch("http://localhost:3000/api/equipos/ubicaciones")
        .then(res => res.json())
        .then(data => {
          const torre = data.filter(ub => ub.cod_ti_ubicacion >= 1 && ub.cod_ti_ubicacion <= 9)
          const talleres = data.filter(ub => ub.cod_ti_ubicacion >= 10 && ub.cod_ti_ubicacion <= 13)
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
          grado,
          seccion,
          n_de_pt: nDePt,
          ubicacion_tipo: ubicacionTipo,
          ubicacion_especifica: ubicacionEspecifica,
          persona_interviene: personaInterviene,
          distribucion
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
        setSelectedEquipos([])
        setGrado("")
        setSeccion("")
        setNDePt("")
        setUbicacionTipo("")
        setUbicacionEspecifica("")
        setPersonaInterviene("")
        setDistribucion("2. Ejs. 1 Hja")
        
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

  // Filtrar equipos y usuarios
  const filteredEquipos = equipos.filter(eq => 
    (eq.nombre_pc?.toLowerCase().includes(searchEquipos.toLowerCase()) || 
     eq.numero_serie?.toLowerCase().includes(searchEquipos.toLowerCase()) ||
     eq.modelo?.toLowerCase().includes(searchEquipos.toLowerCase()))
  )

  const filteredUsuarios = usuarios.filter(user =>
    user.nombre_completo?.toLowerCase().includes(searchUsuarios.toLowerCase()) ||
    user.pers_rut?.includes(searchUsuarios)
  )

  const selectedUserData = usuarios.find(u => u.pers_rut === selectedUser)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      {/* MODAL ULTRA EXPANDIDO - OCUPA TODA LA PANTALLA */}
      <DialogContent 
        className="fixed inset-0 w-full h-full max-w-none max-h-none m-0 p-0 border-0 rounded-none overflow-hidden flex flex-col bg-gray-100"
        style={{ 
          width: '100vw', 
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999
        }}
      >
        {/* HEADER FIJO - MÁS COMPACTO */}
        <DialogHeader className="shrink-0 border-b bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-4">
          <DialogTitle className="text-2xl font-bold flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl">Sistema de Asignaciones de Equipos IGM</h1>
                <p className="text-blue-100 text-sm font-normal">
                  Gestión integral de asignaciones y documentación automática
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2"
            >
              <span className="text-2xl">×</span>
            </Button>
          </DialogTitle>
        </DialogHeader>

        {/* CONTENIDO PRINCIPAL - ULTRA EXPANDIDO */}
        <div className="flex-1 overflow-hidden bg-gray-50">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            {/* TABS NAVIGATION - MÁS COMPACTA */}
            <div className="shrink-0 bg-white border-b shadow-sm">
              <div className="px-8 py-3">
                <TabsList className="grid w-full max-w-lg grid-cols-3 h-10">
                  <TabsTrigger value="asignar" className="flex items-center gap-2 text-sm font-medium">
                    <FileText className="w-4 h-4" />
                    Nueva Asignación
                  </TabsTrigger>
                  <TabsTrigger value="activas" className="flex items-center gap-2 text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    Activas ({asignacionesActivas.length})
                  </TabsTrigger>
                  <TabsTrigger value="historial" className="flex items-center gap-2 text-sm font-medium">
                    <Clock className="w-4 h-4" />
                    Historial ({historialAsignaciones.length})
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            {/* TAB: Nueva Asignación - LAYOUT HORIZONTAL EXTREMO */}
            <TabsContent value="asignar" className="flex-1 overflow-hidden m-0">
              <div className="h-full flex gap-6 p-6">
                
                {/* SECCIÓN IZQUIERDA: USUARIO Y EQUIPOS - 60% del ancho */}
                <div className="w-3/5 space-y-4 overflow-hidden flex flex-col">
                  
                  {/* Selección de Usuario - MÁS COMPACTA */}
                  <Card className="shadow-lg border-0 shrink-0">
                    <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-lg py-3">
                      <CardTitle className="flex items-center gap-3 text-indigo-900 text-lg">
                        <User className="w-5 h-5" />
                        Selección de Usuario Destinatario
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-semibold mb-2 text-gray-700">Buscar Usuario:</label>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              placeholder="Buscar por nombre o RUT..."
                              value={searchUsuarios}
                              onChange={(e) => setSearchUsuarios(e.target.value)}
                              className="pl-10 h-10"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2 text-gray-700">Usuario Seleccionado:</label>
                          <Select value={selectedUser} onValueChange={setSelectedUser}>
                            <SelectTrigger className="h-10">
                              <SelectValue placeholder="Seleccione usuario IGM" />
                            </SelectTrigger>
                            <SelectContent className="max-h-60">
                              {filteredUsuarios.map(user => (
                                <SelectItem key={user.pers_rut} value={user.pers_rut}>
                                  <div className="flex flex-col">
                                    <span className="font-medium">{user.nombre_completo}</span>
                                    <span className="text-xs text-gray-500">RUT: {user.pers_rut}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-end">
                          {selectedUserData && (
                            <div className="p-3 bg-green-50 border border-green-200 rounded-lg w-full">
                              <div className="flex items-center gap-2 text-green-800 text-sm">
                                <CheckCircle className="w-4 h-4" />
                                <span className="font-semibold truncate">{selectedUserData.nombre_completo}</span>
                              </div>
                            </div>
                          )}
                          {!selectedUserData && (
                            <Badge variant="secondary" className="py-2 px-4 bg-emerald-100 text-emerald-800">
                              {selectedEquipos.length} equipo(s) seleccionado(s)
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Selección de Equipos - EXPANDIDA AL MÁXIMO */}
                  <Card className="shadow-lg border-0 flex-1 flex flex-col overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-t-lg shrink-0 py-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-3 text-emerald-900 text-lg">
                          <Monitor className="w-5 h-5" />
                          Equipos Disponibles para Asignación
                        </CardTitle>
                        <Badge variant="secondary" className="py-1 px-3 bg-emerald-100 text-emerald-800">
                          {selectedEquipos.length} de {filteredEquipos.length} seleccionados
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 flex-1 flex flex-col overflow-hidden">
                      {/* Buscador de equipos */}
                      <div className="mb-3 shrink-0">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            placeholder="Buscar equipos por nombre, serie o modelo..."
                            value={searchEquipos}
                            onChange={(e) => setSearchEquipos(e.target.value)}
                            className="pl-10 h-10"
                          />
                        </div>
                      </div>

                      {/* Tabla de equipos - MÁXIMA EXPANSIÓN */}
                      <div className="flex-1 border rounded-lg bg-white overflow-hidden">
                        <Table>
                          <TableHeader className="sticky top-0 bg-gray-100">
                            <TableRow>
                              <TableHead className="w-12">
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
                                  className="w-4 h-4"
                                />
                              </TableHead>
                              <TableHead className="font-semibold">Nombre PC</TableHead>
                              <TableHead className="font-semibold">Serie</TableHead>
                              <TableHead className="font-semibold">Modelo</TableHead>
                              <TableHead className="font-semibold">Categoría</TableHead>
                              <TableHead className="font-semibold">Estado</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredEquipos.map(eq => (
                              <TableRow key={eq.id_equipo} className="hover:bg-gray-50 transition-colors">
                                <TableCell>
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
                                    className="w-4 h-4"
                                  />
                                </TableCell>
                                <TableCell className="font-medium">{eq.nombre_pc || "-"}</TableCell>
                                <TableCell className="font-mono text-sm">{eq.numero_serie || "-"}</TableCell>
                                <TableCell>{eq.modelo || "-"}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="text-xs">
                                    {eq.categoria?.desc_tipo || "-"}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge className="bg-green-500 hover:bg-green-600 text-xs">
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

                {/* SECCIÓN DERECHA: DATOS PARA DOCUMENTO - 40% del ancho */}
                <div className="w-2/5 overflow-auto">
                  <Card className="shadow-lg border-0 h-full">
                    <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-t-lg py-3">
                      <CardTitle className="flex items-center gap-3 text-amber-900 text-lg">
                        <FileText className="w-5 h-5" />
                        Datos para Documento de Asignación
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-semibold mb-1 text-gray-700">Grado *</label>
                          <Input
                            value={grado}
                            onChange={(e) => setGrado(e.target.value)}
                            placeholder="ej: Sargento Segundo"
                            className="h-10"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold mb-1 text-gray-700">Sección *</label>
                          <Input
                            value={seccion}
                            onChange={(e) => setSeccion(e.target.value)}
                            placeholder="ej: U de Cuartel"
                            className="h-10"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold mb-1 text-gray-700">N° DE P.T. *</label>
                          <Input
                            value={nDePt}
                            onChange={(e) => setNDePt(e.target.value)}
                            placeholder="ej: 2"
                            className="h-10"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold mb-1 text-gray-700">Ubicación *</label>
                          <Select value={ubicacionTipo} onValueChange={setUbicacionTipo}>
                            <SelectTrigger className="h-10">
                              <SelectValue placeholder="Seleccione ubicación" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="TORRE">Torre</SelectItem>
                              <SelectItem value="TALLERES">Talleres</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {ubicacionTipo && (
                          <div>
                            <label className="block text-sm font-semibold mb-1 text-gray-700">
                              {ubicacionTipo === "TORRE" ? "Piso" : "Área"} *
                            </label>
                            <Select value={ubicacionEspecifica} onValueChange={setUbicacionEspecifica}>
                              <SelectTrigger className="h-10">
                                <SelectValue placeholder={`Seleccione ${ubicacionTipo === "TORRE" ? "piso" : "área"}`} />
                              </SelectTrigger>
                              <SelectContent>
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
                          <label className="block text-sm font-semibold mb-1 text-gray-700">Persona que Interviene *</label>
                          <Select value={personaInterviene} onValueChange={setPersonaInterviene}>
                            <SelectTrigger className="h-10">
                              <SelectValue placeholder="Seleccione persona" />
                            </SelectTrigger>
                            <SelectContent>
                              {usuarios.map(user => (
                                <SelectItem key={user.pers_rut} value={user.pers_rut}>
                                  {user.nombre_completo}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold mb-1 text-gray-700">Distribución</label>
                          <textarea
                            className="w-full p-2 border rounded-lg resize-none h-16 text-sm"
                            value={distribucion}
                            onChange={(e) => setDistribucion(e.target.value)}
                            placeholder="Distribución del documento..."
                          />
                        </div>

                        <Button 
                          onClick={handleAsignar} 
                          disabled={!selectedUser || selectedEquipos.length === 0 || loading}
                          className="w-full h-12 text-base bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg mt-4"
                          size="lg"
                        >
                          {loading ? (
                            <div className="flex items-center gap-2">
                              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
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
            </TabsContent>

            {/* TAB: Asignaciones Activas - EXPANDIDA HORIZONTAL */}
            <TabsContent value="activas" className="flex-1 overflow-hidden m-0">
              <div className="h-full p-6">
                <Card className="h-full shadow-lg border-0">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg py-3">
                    <CardTitle className="flex items-center gap-3 text-green-900 text-lg">
                      <CheckCircle className="w-5 h-5" />
                      Asignaciones Activas ({asignacionesActivas.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 h-full">
                    <div className="overflow-auto h-full">
                      <Table>
                        <TableHeader className="sticky top-0 bg-gray-100">
                          <TableRow>
                            <TableHead className="font-semibold">Usuario</TableHead>
                            <TableHead className="font-semibold">Equipo</TableHead>
                            <TableHead className="font-semibold">Modelo</TableHead>
                            <TableHead className="font-semibold">Serie</TableHead>
                            <TableHead className="font-semibold">Fecha Asignación</TableHead>
                            <TableHead className="font-semibold">Estado</TableHead>
                            <TableHead className="font-semibold">Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {asignacionesActivas.map((asignacion) => (
                            <TableRow key={asignacion.id_asignacion} className="hover:bg-gray-50">
                              <TableCell className="font-medium">
                                {asignacion.usuario_nombre || asignacion.rut_usuario}
                              </TableCell>
                              <TableCell>{asignacion.equipo_nombre || "-"}</TableCell>
                              <TableCell>{asignacion.equipo_modelo || "-"}</TableCell>
                              <TableCell className="font-mono text-sm">{asignacion.equipo_serie || "-"}</TableCell>
                              <TableCell>{new Date(asignacion.fecha_asignacion).toLocaleDateString('es-CL')}</TableCell>
                              <TableCell>
                                <Badge className="bg-green-500 hover:bg-green-600">ACTIVA</Badge>
                              </TableCell>
                              <TableCell>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleEliminarAsignacion(asignacion.id_asignacion)}
                                  className="h-8"
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

            {/* TAB: Historial - EXPANDIDA HORIZONTAL */}
            <TabsContent value="historial" className="flex-1 overflow-hidden m-0">
              <div className="h-full p-6">
                <Card className="h-full shadow-lg border-0">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-t-lg py-3">
                    <CardTitle className="flex items-center gap-3 text-purple-900 text-lg">
                      <Clock className="w-5 h-5" />
                      Historial de Asignaciones ({historialAsignaciones.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 h-full">
                    <div className="overflow-auto h-full">
                      <Table>
                        <TableHeader className="sticky top-0 bg-gray-100">
                          <TableRow>
                            <TableHead className="font-semibold">Usuario</TableHead>
                            <TableHead className="font-semibold">Equipo</TableHead>
                            <TableHead className="font-semibold">Modelo</TableHead>
                            <TableHead className="font-semibold">Serie</TableHead>
                            <TableHead className="font-semibold">Fecha Asignación</TableHead>
                            <TableHead className="font-semibold">Duración</TableHead>
                            <TableHead className="font-semibold">Estado</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {historialAsignaciones.map((registro) => (
                            <TableRow key={registro.id_asignacion} className="hover:bg-gray-50">
                              <TableCell className="font-medium">
                                {registro.usuario_nombre || registro.rut_usuario}
                              </TableCell>
                              <TableCell>{registro.equipo_nombre || "-"}</TableCell>
                              <TableCell>{registro.equipo_modelo || "-"}</TableCell>
                              <TableCell className="font-mono text-sm">{registro.equipo_serie || "-"}</TableCell>
                              <TableCell>{new Date(registro.fecha_asignacion).toLocaleDateString('es-CL')}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-xs">
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
      </DialogContent>
    </Dialog>
  )
}