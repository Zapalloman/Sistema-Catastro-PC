"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RutAutocomplete } from "@/components/rut-autocomplete"
import { 
  Users, 
  FileText, 
  CheckCircle, 
  Clock, 
  Monitor, 
  User, 
  Search,
  X,           // <- ESTE IMPORT ES CRUCIAL
  Building,
  Calendar,
  MapPin,
  Phone,
  Mail,
  AlertTriangle,
  Trash2
} from "lucide-react"

export function AsignacionesModal({ open, onClose }: {
  open: boolean,
  onClose: () => void
}) {
  // Estados existentes
  const [selectedUser, setSelectedUser] = useState("")
  const [selectedUserData, setSelectedUserData] = useState<any>(null)
  const [selectedEquipos, setSelectedEquipos] = useState<number[]>([])
  const [equipos, setEquipos] = useState<any[]>([])
  
  // NUEVO: Estados para tipo de equipo
  const [tipoEquipoSeleccionado, setTipoEquipoSeleccionado] = useState<'IGM' | 'LATSUR' | 'MAC' | 'Z8'>('IGM')
  const [cargandoEquipos, setCargandoEquipos] = useState(false)

  // Estados existentes...
  const [loading, setLoading] = useState(false)
  const [searchEquipos, setSearchEquipos] = useState("")
  const [selectedCategoriaEquipo, setSelectedCategoriaEquipo] = useState("TODOS")
  const [categoriasEquipos, setCategoriasEquipos] = useState<any[]>([])
  
  // Estados del documento...
  const [grado, setGrado] = useState("")
  const [seccion, setSeccion] = useState("")
  const [nDePt, setNDePt] = useState("")
  const [ubicacionTipo, setUbicacionTipo] = useState("")
  const [ubicacionEspecifica, setUbicacionEspecifica] = useState("")
  const [personaInterviene, setPersonaInterviene] = useState("")
  const [personaIntervieneData, setPersonaIntervieneData] = useState<any>(null)
  const [distribucion, setDistribucion] = useState("2. Ejs. 1 Hja")
  const [nota, setNota] = useState("")

  // Estados de ubicaciones y asignaciones...
  const [ubicacionesTorre, setUbicacionesTorre] = useState<any[]>([])
  const [ubicacionesTalleres, setUbicacionesTalleres] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("asignar")
  const [asignacionesActivas, setAsignacionesActivas] = useState<any[]>([])
  const [historialAsignaciones, setHistorialAsignaciones] = useState<any[]>([])

  // NUEVA: Función para cargar equipos según el tipo seleccionado
  const cargarEquiposPorTipo = async (tipo: 'IGM' | 'LATSUR' | 'MAC' | 'Z8') => {
    try {
      setCargandoEquipos(true)
      console.log(`=== FRONTEND: Cargando equipos tipo: ${tipo} ===`)
      
      const url = `http://localhost:3000/api/asignaciones/equipos/${tipo}`
      console.log('URL solicitada:', url)
      
      const response = await fetch(url)
      console.log('Respuesta HTTP:', response.status, response.statusText)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error HTTP:', errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }
      
      const result = await response.json()
      console.log('Respuesta JSON completa:', result)
      
      // Manejar tanto respuesta directa como respuesta con wrapper
      const data = result.data || result
      
      if (!Array.isArray(data)) {
        console.error('Los datos recibidos no son un array:', data)
        setEquipos([])
      } else {
        setEquipos(data)
        console.log(`✅ Equipos ${tipo} cargados exitosamente:`, data.length)
        
        // Debug: mostrar estructura del primer equipo y sus propiedades
        if (data.length > 0) {
          console.log(`📋 Estructura completa de equipos ${tipo}:`, data)
          console.log('🔍 Estructura del primer equipo:', data[0])
          console.log('🔍 Propiedades disponibles:', Object.keys(data[0]))
          console.log('🔍 Categoría del primer equipo:', data[0].categoria)
        }
      }
      
      setSelectedEquipos([]) // Limpiar selección al cambiar tipo
      
    } catch (error) {
      console.error(`❌ Error cargando equipos ${tipo}:`, error)
      setEquipos([])
      // Mostrar error al usuario
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      alert(`Error cargando equipos ${tipo}: ${errorMessage}`)
    } finally {
      setCargandoEquipos(false)
    }
  }

  // NUEVA: Función para cargar categorías según el tipo seleccionado
  const cargarCategoriasPorTipo = async (tipo: 'IGM' | 'LATSUR' | 'MAC' | 'Z8') => {
    try {
      console.log(`=== FRONTEND: Cargando categorías tipo: ${tipo} ===`)
      
      const url = `http://localhost:3000/api/asignaciones/categorias/${tipo}`
      console.log('URL categorías solicitada:', url)
      
      const response = await fetch(url)
      console.log('Respuesta HTTP categorías:', response.status, response.statusText)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error HTTP categorías:', errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }
      
      const result = await response.json()
      console.log('Respuesta JSON categorías completa:', result)
      
      // Manejar tanto respuesta directa como respuesta con wrapper
      const data = result.data || result
      
      if (!Array.isArray(data)) {
        console.error('Las categorías recibidas no son un array:', data)
        setCategoriasEquipos([])
      } else {
        setCategoriasEquipos(data)
        console.log(`✅ Categorías ${tipo} cargadas exitosamente:`, data.length)
        
        // Debug: mostrar estructura de todas las categorías
        console.log(`📋 Estructura completa de categorías ${tipo}:`, data)
        if (data.length > 0) {
          console.log('🔍 Estructura de la primera categoría:', data[0])
          console.log('🔍 Propiedades disponibles:', Object.keys(data[0]))
        }
      }
      
      // Resetear filtro de categoría
      setSelectedCategoriaEquipo("TODOS")
      
    } catch (error) {
      console.error(`❌ Error cargando categorías ${tipo}:`, error)
      setCategoriasEquipos([])
      // No mostrar alert para categorías, usar fallback silencioso
    }
  }

  useEffect(() => {
    if (open) {
      // Cargar equipos Y categorías del tipo seleccionado inicialmente
      cargarEquiposPorTipo(tipoEquipoSeleccionado)
      cargarCategoriasPorTipo(tipoEquipoSeleccionado)

      // Cargar ubicaciones
      fetch("http://localhost:3000/api/equipos/ubicaciones")
        .then(res => res.json())
        .then(data => {
          const torre = data.filter((ub: any) => ub.cod_ti_ubicacion >= 1 && ub.cod_ti_ubicacion <= 9)
          const talleres = data.filter((ub: any) => ub.cod_ti_ubicacion >= 10 && ub.cod_ti_ubicacion <= 13)
          setUbicacionesTorre(torre)
          setUbicacionesTalleres(talleres)
        })

      // Cargar asignaciones activas e historial
      fetch("http://localhost:3000/api/asignaciones")
        .then(res => res.json())
        .then(data => setAsignacionesActivas(Array.isArray(data) ? data : []))

      fetch("http://localhost:3000/api/asignaciones/historial")
        .then(res => res.json())
        .then(data => setHistorialAsignaciones(Array.isArray(data) ? data : []))
    }
  }, [open, tipoEquipoSeleccionado])

  // ACTUALIZADO: Función de asignación con tipo de equipo
  const handleAsignar = async () => {
    if (!selectedUser || selectedEquipos.length === 0) {
      alert("Seleccione un usuario y al menos un equipo")
      return
    }

    if (!grado || !seccion || !nDePt || !ubicacionTipo || !ubicacionEspecifica || !personaInterviene) {
      alert("Por favor complete todos los campos obligatorios para el documento")
      return
    }

    setLoading(true)
    
    try {
      const datosAsignacion = {
        usuario_rut: selectedUser,
        equipos_ids: selectedEquipos,
        tipo_equipo: tipoEquipoSeleccionado, // NUEVO: Incluir tipo de equipo
        grado: grado,
        seccion: seccion,
        n_de_pt: nDePt,
        ubicacion_tipo: ubicacionTipo,
        ubicacion_especifica: ubicacionEspecifica,
        persona_interviene_rut: personaInterviene,
        distribucion: distribucion,
        nota: nota,
        usuario_datos: selectedUserData,
        persona_interviene_datos: personaIntervieneData
      }

      console.log("Enviando datos de asignación multi-tipo:", datosAsignacion)

      const response = await fetch("http://localhost:3000/api/asignaciones/generar-documento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosAsignacion),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `Asignacion_${tipoEquipoSeleccionado}_${selectedUser}_${new Date().getTime()}.docx`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        alert(`Asignación de equipos ${tipoEquipoSeleccionado} creada exitosamente`)
        
        // Recargar datos
        fetch("http://localhost:3000/api/asignaciones")
          .then(res => res.json())
          .then(data => setAsignacionesActivas(Array.isArray(data) ? data : []))
        
        fetch("http://localhost:3000/api/asignaciones/historial")
          .then(res => res.json())
          .then(data => setHistorialAsignaciones(Array.isArray(data) ? data : []))

        // Limpiar formulario
        setSelectedUser("")
        setSelectedUserData(null)
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
    
    // Para MAC y Z8 no aplicar filtro de categoría (no tienen categorías)
    if (tipoEquipoSeleccionado === 'MAC' || tipoEquipoSeleccionado === 'Z8') {
      return matchesSearch
    }
    
    // Para IGM y LATSUR aplicar filtro de categoría
    const matchesCategory = selectedCategoriaEquipo === "TODOS" || eq.categoria === selectedCategoriaEquipo
    
    // Debug mejorado para todos los tipos
    if (selectedCategoriaEquipo !== "TODOS") {
      console.log(`🔍 Filtro ${tipoEquipoSeleccionado}:`)
      console.log(`   - Equipo ID: ${eq.id_equipo}`)
      console.log(`   - Equipo categoria: "${eq.categoria}"`)
      console.log(`   - Filtro seleccionado: "${selectedCategoriaEquipo}"`)
      console.log(`   - Match: ${matchesCategory}`)
      console.log(`   - Estructura completa del equipo:`, eq)
    }
    
    return matchesSearch && matchesCategory
  })

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-2">
      <div 
        className="bg-white rounded-lg shadow-2xl flex flex-col w-full h-full max-w-none overflow-hidden"
        style={{ width: '98vw', height: '96vh' }}
      >
        {/* HEADER */}
        <div className="w-full shrink-0 border-b bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-3 rounded-t-lg">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Sistema de Asignaciones Multi-Equipos IGM</h1>
                <p className="text-blue-100 text-xs font-normal mt-0.5">
                  Gestión integral de asignaciones para equipos IGM, LATSUR, MAC y Z8
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 h-auto"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col w-full">
            {/* TABS NAVIGATION */}
            <div className="w-full shrink-0 border-b bg-gray-50">
              <div className="px-4 py-2">
                <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm border">
                  <TabsTrigger value="asignar" className="flex items-center gap-1.5 text-xs font-medium py-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    Nueva Asignación
                  </TabsTrigger>
                  <TabsTrigger value="activas" className="flex items-center gap-1.5 text-xs font-medium py-1.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Activas ({asignacionesActivas.length})
                  </TabsTrigger>
                  <TabsTrigger value="historial" className="flex items-center gap-1.5 text-xs font-medium py-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Historial ({historialAsignaciones.length})
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            {/* TAB: Nueva Asignación */}
            <TabsContent value="asignar" className="flex-1 overflow-hidden m-0 w-full">
              <div className="h-full w-full p-3">
                <div className="grid grid-cols-12 gap-3 h-full w-full">
                  
                  {/* COLUMNA IZQUIERDA: Tipo de Equipos, Usuario y Equipos */}
                  <div className="col-span-8 space-y-3 h-full flex flex-col">
                    
                    {/* NUEVO: Selector de Tipo de Equipo */}
                    <Card className="shadow-lg border-0 shrink-0">
                      <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-t-lg py-2">
                        <CardTitle className="flex items-center gap-2 text-purple-900 text-base">
                          <Monitor className="w-4 h-4" />
                          Tipo de Equipos a Asignar
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-3">
                        <div className="grid grid-cols-4 gap-2">
                          {(['IGM', 'LATSUR', 'MAC', 'Z8'] as const).map((tipo) => (
                            <Button
                              key={tipo}
                              variant={tipoEquipoSeleccionado === tipo ? "default" : "outline"}
                              onClick={() => {
                                setTipoEquipoSeleccionado(tipo)
                                cargarEquiposPorTipo(tipo)
                                cargarCategoriasPorTipo(tipo)
                                // Resetear filtro de categoría para MAC y Z8 (no tienen categorías)
                                if (tipo === 'MAC' || tipo === 'Z8') {
                                  setSelectedCategoriaEquipo("TODOS")
                                }
                              }}
                              className={`text-xs h-8 ${
                                tipoEquipoSeleccionado === tipo 
                                  ? 'bg-purple-600 hover:bg-purple-700' 
                                  : 'hover:bg-purple-50'
                              }`}
                              disabled={cargandoEquipos}
                            >
                              {cargandoEquipos && tipoEquipoSeleccionado === tipo ? (
                                <div className="animate-spin w-3 h-3 border border-white border-t-transparent rounded-full mr-1" />
                              ) : null}
                              Equipos {tipo}
                            </Button>
                          ))}
                        </div>
                        <div className="mt-2 text-xs text-gray-600">
                          <Badge variant="secondary" className="text-xs">
                            {equipos.length} equipos disponibles de tipo {tipoEquipoSeleccionado}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Card de Usuario - EXISTENTE */}
                    <Card className="shadow-lg border-0 shrink-0">
                      <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-lg py-2">
                        <CardTitle className="flex items-center gap-2 text-indigo-900 text-base">
                          <User className="w-4 h-4" />
                          Selección de Usuario Destinatario
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-3">
                        <div className="grid grid-cols-3 gap-3">
                          <div className="col-span-2">
                            <label className="block text-xs font-semibold mb-1.5 text-gray-700">Usuario Destinatario:</label>
                            <RutAutocomplete 
                              value={selectedUser} 
                              onChange={setSelectedUser}
                              onUserSelected={(user) => {
                                setSelectedUserData(user)
                                // Auto-completar campos si están vacíos
                                if (user.grado && !grado) {
                                  setGrado(user.grado)
                                }
                              }}
                            />
                            {/* Mostrar datos del usuario seleccionado */}
                            {selectedUserData && (
                              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                                <div className="text-xs">
                                  <div><strong>Nombre:</strong> {selectedUserData.nombres} {selectedUserData.apaterno} {selectedUserData.amaterno}</div>
                                  <div><strong>Grado:</strong> {selectedUserData.grado || 'No especificado'}</div>
                                  <div><strong>Cargo:</strong> {selectedUserData.cargo || 'No especificado'}</div>
                                  <div><strong>Departamento:</strong> {selectedUserData.departamento}</div>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="col-span-1 flex items-end">
                            <Badge variant="secondary" className="py-2 px-3 bg-emerald-100 text-emerald-800 text-sm">
                              {selectedEquipos.length} equipo(s) seleccionado(s)
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Card de Equipos - ACTUALIZADO */}
                    <Card className="shadow-xl border-0 flex-1 flex flex-col overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-t-lg shrink-0 py-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-3 text-emerald-900 text-base">
                            <Monitor className="w-4 h-4" />
                            Equipos {tipoEquipoSeleccionado} Disponibles
                          </CardTitle>
                          <Badge variant="secondary" className="py-1 px-3 bg-emerald-100 text-emerald-800 text-sm">
                            {selectedEquipos.length} de {filteredEquipos.length} seleccionados
                          </Badge>
                        </div>
                        {/* Buscador y filtros */}
                        <div className="mt-2 flex gap-3">
                          <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              placeholder={`Buscar equipos ${tipoEquipoSeleccionado}...`}
                              value={searchEquipos}
                              onChange={(e) => setSearchEquipos(e.target.value)}
                              className="pl-10 h-8 text-sm bg-white"
                            />
                          </div>
                          {/* Solo mostrar filtro de categoría para IGM y LATSUR */}
                          {(tipoEquipoSeleccionado === 'IGM' || tipoEquipoSeleccionado === 'LATSUR') && (
                            <div className="w-48">
                              <Select value={selectedCategoriaEquipo} onValueChange={setSelectedCategoriaEquipo}>
                                <SelectTrigger className="h-8 text-sm bg-white">
                                  <SelectValue placeholder="Filtrar por tipo..." />
                                </SelectTrigger>
                                <SelectContent className="z-[10000]">
                                  <SelectItem value="TODOS">Todos los tipos</SelectItem>
                                  {categoriasEquipos
                                    .filter((cat) => {
                                      // Para IGM: filtrar por desc_tipo
                                      if (tipoEquipoSeleccionado === 'IGM') {
                                        return cat && cat.desc_tipo && cat.desc_tipo !== "OTRO"
                                      }
                                      // Para LATSUR: filtrar por desc_tipo (que viene mapeado desde nomcategoria)
                                      return cat && cat.desc_tipo
                                    })
                                    .sort((a, b) => (a.desc_tipo || "").localeCompare(b.desc_tipo || ""))
                                    .map((cat) => (
                                      <SelectItem key={cat.id_tipo} value={cat.desc_tipo}>
                                        {cat.desc_tipo}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
                        {cargandoEquipos ? (
                          <div className="flex-1 flex items-center justify-center">
                            <div className="flex items-center gap-2 text-gray-600">
                              <div className="animate-spin w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full" />
                              Cargando equipos {tipoEquipoSeleccionado}...
                            </div>
                          </div>
                        ) : (
                          <div className="flex-1 overflow-auto">
                            <Table>
                              <TableHeader className="sticky top-0 bg-gray-100 z-10">
                                <TableRow>
                                  <TableHead className="w-12 text-center text-xs">
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
                                  <TableHead className="font-semibold text-xs">Nombre PC</TableHead>
                                  <TableHead className="font-semibold text-xs">Serie</TableHead>
                                  <TableHead className="font-semibold text-xs">Modelo</TableHead>
                                  <TableHead className="font-semibold text-xs">Categoría</TableHead>
                                  <TableHead className="font-semibold text-xs">Estado</TableHead>
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
                                        className="w-4 h-4"
                                      />
                                    </TableCell>
                                    <TableCell className="font-medium text-xs">{eq.nombre_pc || "-"}</TableCell>
                                    <TableCell className="font-mono text-xs">{eq.numero_serie || "-"}</TableCell>
                                    <TableCell className="text-xs">{eq.modelo || "-"}</TableCell>
                                    <TableCell>
                                      <Badge variant="outline" className="text-xs">
                                        {eq.categoria || "-"}
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
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* COLUMNA DERECHA: Datos del Documento - EXISTENTE */}
                  <div className="col-span-4 h-full">
                    <Card className="shadow-xl border-0 h-full flex flex-col">
                      <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-t-lg py-2 shrink-0">
                        <CardTitle className="flex items-center gap-3 text-amber-900 text-base">
                          <FileText className="w-4 h-4" />
                          Datos para Documento de Asignación
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 flex-1 overflow-auto">
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-semibold mb-1 text-gray-700">Grado *</label>
                            <Input
                              value={grado}
                              onChange={(e) => setGrado(e.target.value)}
                              placeholder="ej: Subteniente"
                              className="h-8 text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold mb-1 text-gray-700">Sección *</label>
                            <Input
                              value={seccion}
                              onChange={(e) => setSeccion(e.target.value)}
                              placeholder="ej: Cartografía"
                              className="h-8 text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold mb-1 text-gray-700">N° de PT *</label>
                            <Input
                              value={nDePt}
                              onChange={(e) => setNDePt(e.target.value)}
                              placeholder="ej: 2"
                              className="h-8 text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold mb-1 text-gray-700">Ubicación *</label>
                            <Select value={ubicacionTipo} onValueChange={setUbicacionTipo}>
                              <SelectTrigger className="h-8 text-xs">
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
                              <label className="block text-xs font-semibold mb-1 text-gray-700">
                                {ubicacionTipo === "TORRE" ? "Piso" : "Área"} *
                              </label>
                              <Select value={ubicacionEspecifica} onValueChange={setUbicacionEspecifica}>
                                <SelectTrigger className="h-8 text-xs">
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
                            <label className="block text-xs font-semibold mb-1 text-gray-700">Persona que Interviene *</label>
                            <RutAutocomplete 
                              value={personaInterviene} 
                              onChange={setPersonaInterviene}
                              onUserSelected={setPersonaIntervieneData}
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold mb-1 text-gray-700">Distribución</label>
                            <Input
                              value={distribucion}
                              onChange={(e) => setDistribucion(e.target.value)}
                              placeholder="Distribución del documento..."
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold mb-1 text-gray-700">Nota Adicional</label>
                            <textarea
                              className="w-full p-2 border rounded-lg resize-none h-16 text-xs"
                              value={nota}
                              onChange={(e) => setNota(e.target.value)}
                              placeholder="Observaciones o notas adicionales para el documento..."
                            />
                          </div>

                          <Button 
                            onClick={handleAsignar} 
                            disabled={!selectedUser || selectedEquipos.length === 0 || loading}
                            className="w-full h-10 text-sm bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-xl"
                            size="sm"
                          >
                            {loading ? (
                              <div className="flex items-center gap-2">
                                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                                Generando...
                              </div>
                            ) : (
                              `Asignar ${selectedEquipos.length} Equipo(s) ${tipoEquipoSeleccionado} y Generar Documento`
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB: Asignaciones Activas - EXISTENTE */}
            <TabsContent value="activas" className="flex-1 overflow-hidden m-0 w-full">
              <div className="h-full p-3 w-full">
                <Card className="h-full shadow-lg border-0 w-full">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg py-2">
                    <CardTitle className="flex items-center gap-2 text-green-900 text-base">
                      <CheckCircle className="w-4 h-4" />
                      Asignaciones Activas ({asignacionesActivas.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 h-full">
                    <div className="overflow-auto h-full">
                      <Table>
                        <TableHeader className="sticky top-0 bg-gray-100 z-10">
                          <TableRow>
                            <TableHead className="font-semibold text-xs">Usuario</TableHead>
                            <TableHead className="font-semibold text-xs">Equipo</TableHead>
                            <TableHead className="font-semibold text-xs">Modelo</TableHead>
                            <TableHead className="font-semibold text-xs">Serie</TableHead>
                            <TableHead className="font-semibold text-xs">Fecha Asignación</TableHead>
                            <TableHead className="font-semibold text-xs">Estado</TableHead>
                            <TableHead className="font-semibold text-xs">Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {asignacionesActivas.map((asignacion) => (
                            <TableRow key={asignacion.id_asignacion} className="hover:bg-gray-50">
                              <TableCell className="font-medium text-xs">
                                {asignacion.usuario_nombre || asignacion.rut_usuario}
                              </TableCell>
                              <TableCell className="text-xs">{asignacion.equipo_nombre || "-"}</TableCell>
                              <TableCell className="text-xs">{asignacion.equipo_modelo || "-"}</TableCell>
                              <TableCell className="font-mono text-xs">{asignacion.equipo_serie || "-"}</TableCell>
                              <TableCell className="text-xs">{new Date(asignacion.fecha_asignacion).toLocaleDateString('es-CL')}</TableCell>
                              <TableCell>
                                <Badge className="bg-green-500 hover:bg-green-600 text-xs">ACTIVA</Badge>
                              </TableCell>
                              <TableCell>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleEliminarAsignacion(asignacion.id_asignacion)}
                                  className="h-6 w-8 p-0"
                                >
                                  <Trash2 className="w-3 h-3" />
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

            {/* TAB: Historial - EXISTENTE */}
            <TabsContent value="historial" className="flex-1 overflow-hidden m-0 w-full">
              <div className="h-full p-3 w-full">
                <Card className="h-full shadow-lg border-0 w-full">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-t-lg py-2">
                    <CardTitle className="flex items-center gap-2 text-purple-900 text-base">
                      <Clock className="w-4 h-4" />
                      Historial de Asignaciones ({historialAsignaciones.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 h-full">
                    <div className="overflow-auto h-full">
                      <Table>
                        <TableHeader className="sticky top-0 bg-gray-100 z-10">
                          <TableRow>
                            <TableHead className="font-semibold text-xs">Usuario</TableHead>
                            <TableHead className="font-semibold text-xs">Equipo</TableHead>
                            <TableHead className="font-semibold text-xs">Modelo</TableHead>
                            <TableHead className="font-semibold text-xs">Serie</TableHead>
                            <TableHead className="font-semibold text-xs">Fecha Asignación</TableHead>
                            <TableHead className="font-semibold text-xs">Fecha Liberación</TableHead>
                            <TableHead className="font-semibold text-xs">Duración</TableHead>
                            <TableHead className="font-semibold text-xs">Estado</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {historialAsignaciones.map((registro) => (
                            <TableRow key={registro.id_asignacion} className="hover:bg-gray-50">
                              <TableCell className="font-medium text-xs">
                                {registro.usuario_nombre || registro.rut_usuario}
                              </TableCell>
                              <TableCell className="text-xs">{registro.equipo_nombre || "-"}</TableCell>
                              <TableCell className="text-xs">{registro.equipo_modelo || "-"}</TableCell>
                              <TableCell className="font-mono text-xs">{registro.equipo_serie || "-"}</TableCell>
                              <TableCell className="text-xs">{new Date(registro.fecha_asignacion).toLocaleDateString('es-CL')}</TableCell>
                              <TableCell className="text-xs">
                                {registro.fecha_liberacion ? (
                                  <span className="text-red-600">
                                    {new Date(registro.fecha_liberacion).toLocaleDateString('es-CL')}
                                  </span>
                                ) : (
                                  <span className="text-green-600 font-medium">-</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-xs">
                                  {registro.duracion_dias || 0} días
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant={registro.activa ? "default" : "secondary"} 
                                  className={`text-xs ${registro.activa ? "bg-green-500" : "bg-gray-500"}`}
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