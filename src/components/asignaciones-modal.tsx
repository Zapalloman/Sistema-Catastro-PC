"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// ✅ CORREGIR IMPORTS DE DIALOG
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { RutAutocomplete } from "@/components/rut-autocomplete"
import { 
  Users, 
  FileText, 
  CheckCircle, 
  Clock, 
  Monitor, 
  User, 
  Search,
  X,           
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
  
  // NUEVA: Estados para categorías dinámicas
  const [categoriasEquipos, setCategoriasEquipos] = useState<any[]>([])
  
  // Estados del documento...
  const [grado, setGrado] = useState("")
  const [seccion, setSeccion] = useState("")
  const [nDePt, setNDePt] = useState("")
  const [ubicacionTipo, setUbicacionTipo] = useState("")
  const [ubicacionEspecifica, setUbicacionEspecifica] = useState("")
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

  // ✅ FUNCIÓN SIMPLIFICADA: Solo descargar Word
  const descargarDocumentoWord = (response: any) => {
    try {
      // Crear blob del archivo Word
      const blob = new Blob([response], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });
      
      // Crear enlace de descarga
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Asignacion_${tipoEquipoSeleccionado}_${selectedUser}_${new Date().getTime()}.docx`;
      link.style.display = 'none';
      
      // Descargar
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Limpiar recursos
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 2000);
      
      console.log('✅ Documento Word descargado exitosamente');
      
    } catch (error) {
      console.error('Error descargando documento:', error);
      alert('Error al descargar el documento');
    }
  };

  // ACTUALIZADO: Función de asignación con apertura automática mejorada
  const handleAsignar = async () => {
    if (!selectedUser || selectedEquipos.length === 0) {
      alert("Seleccione un usuario y al menos un equipo")
      return
    }

    if (!grado || !seccion || !nDePt || !ubicacionTipo || !ubicacionEspecifica) {
      alert("Por favor complete todos los campos obligatorios para el documento")
      return
    }

    setLoading(true)
    
    try {
      const datosAsignacion = {
        usuario_rut: selectedUser,
        equipos_ids: selectedEquipos,
        tipo_equipo: tipoEquipoSeleccionado,
        grado: grado,
        seccion: seccion,
        n_de_pt: nDePt,
        ubicacion_tipo: ubicacionTipo,
        ubicacion_especifica: ubicacionEspecifica,
        distribucion: distribucion,
        nota: nota,
        usuario_datos: selectedUserData,
      }

      console.log("Enviando datos de asignación:", datosAsignacion)

      // ✅ VOLVER AL ENDPOINT ORIGINAL QUE FUNCIONA
      const response = await fetch("http://localhost:3000/api/asignaciones/generar-documento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosAsignacion),
      })

      if (response.ok) {
        // ✅ SIMPLIFICADO: Solo descargar Word
        const buffer = await response.arrayBuffer()
        descargarDocumentoWord(buffer)
        
        alert(`✅ Asignación de dispositivos ${tipoEquipoSeleccionado} creada exitosamente.\n\n📄 Documento Word descargado`)
        
        // Recargar datos y limpiar formulario
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className="p-0 overflow-hidden border-0"
        style={{
          maxWidth: '98vw',
          width: '98vw', 
          height: '98vh',
          maxHeight: '98vh'
        }}
      >
        {/* ✅ AGREGAR DialogHeader y DialogTitle para accesibilidad */}
        <DialogHeader className="sr-only">
          <DialogTitle>Sistema de Asignaciones Multi-Equipos IGM</DialogTitle>
        </DialogHeader>

        {/* HEADER VISUAL */}
        <div 
          className="w-full shrink-0 border-b bg-gradient-to-r from-blue-600 to-blue-800 text-white"
          style={{ padding: '24px' }}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Sistema de Asignaciones Multi-Equipos IGM</h1>
                <p className="text-blue-100 text-sm font-normal mt-1">
                  Gestión integral de asignaciones para equipos IGM, LATSUR, MAC y Z8
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 h-auto"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden" style={{ height: 'calc(98vh - 120px)' }}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden h-full">
            {/* TABS NAVIGATION */}
            <div className="w-full shrink-0 border-b bg-gray-50" style={{ padding: '16px 24px' }}>
              <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm border h-12">
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

            {/* TAB: Nueva Asignación */}
            <TabsContent value="asignar" className="flex-1 overflow-hidden m-0 w-full">
              <div className="h-full w-full" style={{ padding: '24px' }}>
                <div className="h-full w-full" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                  
                  {/* COLUMNA IZQUIERDA: Tipo de Equipos, Usuario y Equipos */}
                  <div className="h-full flex flex-col" style={{ gap: '16px' }}>
                    
                    {/* NUEVO: Selector de Tipo de Equipo */}
                    <Card className="shadow-lg border-0 shrink-0">
                      <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-t-lg" style={{ padding: '16px' }}>
                        <CardTitle className="flex items-center gap-2 text-purple-900 text-lg">
                          <Monitor className="w-5 h-5" />
                          Tipo de Equipos a Asignar
                        </CardTitle>
                      </CardHeader>
                      <CardContent style={{ padding: '16px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                          {(['IGM', 'LATSUR', 'MAC', 'Z8'] as const).map((tipo) => (
                            <Button
                              key={tipo}
                              variant={tipoEquipoSeleccionado === tipo ? "default" : "outline"}
                              onClick={() => {
                                setTipoEquipoSeleccionado(tipo)
                                cargarEquiposPorTipo(tipo)
                                cargarCategoriasPorTipo(tipo)
                                if (tipo === 'MAC' || tipo === 'Z8') {
                                  setSelectedCategoriaEquipo("TODOS")
                                }
                              }}
                              className={`text-sm ${
                                tipoEquipoSeleccionado === tipo 
                                  ? 'bg-purple-600 hover:bg-purple-700' 
                                  : 'hover:bg-purple-50'
                              }`}
                              style={{ height: '40px' }}
                              disabled={cargandoEquipos}
                            >
                              {cargandoEquipos && tipoEquipoSeleccionado === tipo ? (
                                <div className="animate-spin w-4 h-4 border border-white border-t-transparent rounded-full mr-2" />
                              ) : null}
                              Equipos {tipo}
                            </Button>
                          ))}
                        </div>
                        <div style={{ marginTop: '12px' }} className="text-sm text-gray-600">
                          <Badge variant="secondary" className="text-sm">
                            {equipos.length} equipos disponibles de tipo {tipoEquipoSeleccionado}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Card de Usuario */}
                    <Card className="shadow-lg border-0 shrink-0">
                      <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-lg" style={{ padding: '16px' }}>
                        <CardTitle className="flex items-center gap-2 text-indigo-900 text-lg">
                          <User className="w-5 h-5" />
                          Selección de Usuario Destinatario
                        </CardTitle>
                      </CardHeader>
                      <CardContent style={{ padding: '16px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                          <div>
                            <label className="block text-sm font-semibold mb-2 text-gray-700">Usuario Destinatario:</label>
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
                          <div className="flex items-end">
                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 text-sm" style={{ padding: '12px 16px' }}>
                              {selectedEquipos.length} equipo(s) seleccionado(s)
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Card de Equipos */}
                    <Card className="shadow-xl border-0 flex-1 flex flex-col overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-t-lg shrink-0" style={{ padding: '16px' }}>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-3 text-emerald-900 text-lg">
                            <Monitor className="w-5 h-5" />
                            Equipos {tipoEquipoSeleccionado} Disponibles
                          </CardTitle>
                          <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 text-sm" style={{ padding: '8px 16px' }}>
                            {selectedEquipos.length} de {filteredEquipos.length} seleccionados
                          </Badge>
                        </div>
                        {/* Buscador y filtros */}
                        <div style={{ marginTop: '12px', display: 'flex', gap: '16px' }}>
                          <div className="relative flex-1" style={{ maxWidth: '400px' }}>
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              placeholder={`Buscar equipos ${tipoEquipoSeleccionado}...`}
                              value={searchEquipos}
                              onChange={(e) => setSearchEquipos(e.target.value)}
                              className="pl-10 bg-white"
                              style={{ height: '40px' }}
                            />
                          </div>
                          {(tipoEquipoSeleccionado === 'IGM' || tipoEquipoSeleccionado === 'LATSUR') && (
                            <div style={{ width: '250px' }}>
                              <Select value={selectedCategoriaEquipo} onValueChange={setSelectedCategoriaEquipo}>
                                <SelectTrigger className="bg-white" style={{ height: '40px' }}>
                                  <SelectValue placeholder="Filtrar por tipo..." />
                                </SelectTrigger>
                                <SelectContent className="z-[10000]">
                                  <SelectItem value="TODOS">Todos los tipos</SelectItem>
                                  {categoriasEquipos
                                    .filter((cat) => {
                                      if (tipoEquipoSeleccionado === 'IGM') {
                                        return cat && cat.desc_tipo && cat.desc_tipo !== "OTRO"
                                      }
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
                            <div className="flex items-center gap-3 text-gray-600">
                              <div className="animate-spin w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full" />
                              <span className="text-lg">Cargando equipos {tipoEquipoSeleccionado}...</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex-1 overflow-auto">
                            <Table>
                              <TableHeader className="sticky top-0 bg-gray-100 z-10">
                                <TableRow>
                                  <TableHead className="w-16 text-center text-sm">
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
                                  <TableHead className="font-semibold text-sm">Nombre PC</TableHead>
                                  <TableHead className="font-semibold text-sm">Serie</TableHead>
                                  <TableHead className="font-semibold text-sm">Modelo</TableHead>
                                  <TableHead className="font-semibold text-sm">Categoría</TableHead>
                                  <TableHead className="font-semibold text-sm">Estado</TableHead>
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
                                    <TableCell className="font-medium text-sm">{eq.nombre_pc || "-"}</TableCell>
                                    <TableCell className="font-mono text-sm">{eq.numero_serie || "-"}</TableCell>
                                    <TableCell className="text-sm">{eq.modelo || "-"}</TableCell>
                                    <TableCell>
                                      <Badge variant="outline" className="text-sm">
                                        {eq.categoria || "-"}
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
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* COLUMNA DERECHA: Formulario del Documento */}
                  <div className="h-full flex flex-col">
                    
                    {/* Card de Formulario del Documento */}
                    <Card className="shadow-lg border-0 flex-1 flex flex-col">
                      <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-t-lg shrink-0" style={{ padding: '16px' }}>
                        <CardTitle className="flex items-center gap-2 text-orange-900 text-lg">
                          <FileText className="w-5 h-5" />
                          Datos del Documento de Asignación
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1 overflow-auto" style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                            <div>
                              <label className="block text-sm font-semibold mb-2 text-gray-700">Grado *</label>
                              <Input
                                value={grado}
                                onChange={(e) => setGrado(e.target.value)}
                                placeholder="ej: Subteniente"
                                style={{ height: '40px' }}
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-semibold mb-2 text-gray-700">Sección *</label>
                              <Input
                                value={seccion}
                                onChange={(e) => setSeccion(e.target.value)}
                                placeholder="ej: Cartografía"
                                style={{ height: '40px' }}
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-semibold mb-2 text-gray-700">N° de PT *</label>
                              <Input
                                value={nDePt}
                                onChange={(e) => setNDePt(e.target.value)}
                                placeholder="ej: 2"
                                style={{ height: '40px' }}
                              />                              
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                            <div>
                              <label className="block text-sm font-semibold mb-2 text-gray-700">Tipo de Ubicación *</label>
                              <Select value={ubicacionTipo} onValueChange={setUbicacionTipo}>
                                <SelectTrigger style={{ height: '40px' }}>
                                  <SelectValue placeholder="Seleccione tipo" />
                                </SelectTrigger>
                                <SelectContent className="z-[10000]">
                                  <SelectItem value="TORRE">Torre</SelectItem>
                                  <SelectItem value="TALLERES">Talleres</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {ubicacionTipo && (
                              <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-700">
                                  {ubicacionTipo === "TORRE" ? "Piso" : "Área"} *
                                </label>
                                <Select value={ubicacionEspecifica} onValueChange={setUbicacionEspecifica}>
                                  <SelectTrigger style={{ height: '40px' }}>
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
                          </div>

                          <div>
                            <label className="block text-sm font-semibold mb-2 text-gray-700">Distribución</label>
                            <Input
                              value={distribucion}
                              onChange={(e) => setDistribucion(e.target.value)}
                              placeholder="Distribución del documento..."
                              style={{ height: '40px' }}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold mb-2 text-gray-700">Nota Adicional</label>
                            <textarea
                              className="w-full p-3 border rounded-lg resize-none text-sm"
                              value={nota}
                              onChange={(e) => setNota(e.target.value)}
                              placeholder="Observaciones o notas adicionales para el documento..."
                              style={{ height: '80px' }}
                            />
                          </div>

                          {/* ✅ ACTUALIZAR el botón del formulario */}
                          <Button 
                            onClick={handleAsignar} 
                            disabled={!selectedUser || selectedEquipos.length === 0 || loading}
                            className="w-full text-sm bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-xl"
                            style={{ height: '48px' }}
                          >
                            {loading ? (
                              <div className="flex items-center gap-2">
                                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                                Generando documento...
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                {`Asignar ${selectedEquipos.length} Dispositivo(s) ${tipoEquipoSeleccionado}`}
                                <span className="text-xs opacity-90 ml-2">
                                  (📄 Word)
                                </span>
                              </div>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB: Asignaciones Activas */}
            <TabsContent value="activas" className="flex-1 overflow-hidden m-0 w-full">
              <div className="h-full w-full" style={{ padding: '24px' }}>
                <Card className="h-full shadow-lg border-0 w-full">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg" style={{ padding: '16px' }}>
                    <CardTitle className="flex items-center gap-2 text-green-900 text-lg">
                      <CheckCircle className="w-5 h-5" />
                      Asignaciones Activas ({asignacionesActivas.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 h-full">
                    <div className="overflow-auto h-full">
                      <Table>
                        <TableHeader className="sticky top-0 bg-gray-100 z-10">
                          <TableRow>
                            <TableHead className="font-semibold text-sm">Usuario</TableHead>
                            <TableHead className="font-semibold text-sm">Equipo</TableHead>
                            <TableHead className="font-semibold text-sm">Modelo</TableHead>
                            <TableHead className="font-semibold text-sm">Serie</TableHead>
                            <TableHead className="font-semibold text-sm">Fecha Asignación</TableHead>
                            <TableHead className="font-semibold text-sm">Estado</TableHead>
                            <TableHead className="font-semibold text-sm">Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {asignacionesActivas.map((asignacion) => (
                            <TableRow key={asignacion.id_asignacion} className="hover:bg-gray-50">
                              <TableCell className="font-medium text-sm">
                                {asignacion.usuario_nombre || asignacion.rut_usuario}
                              </TableCell>
                              <TableCell className="text-sm">{asignacion.equipo_nombre || "-"}</TableCell>
                              <TableCell className="text-sm">{asignacion.equipo_modelo || "-"}</TableCell>
                              <TableCell className="font-mono text-sm">{asignacion.equipo_serie || "-"}</TableCell>
                              <TableCell className="text-sm">{new Date(asignacion.fecha_asignacion).toLocaleDateString('es-CL')}</TableCell>
                              <TableCell>
                                <Badge className="bg-green-500 hover:bg-green-600 text-sm">ACTIVA</Badge>
                              </TableCell>
                              <TableCell>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleEliminarAsignacion(asignacion.id_asignacion)}
                                  style={{ height: '32px', width: '32px', padding: '0' }}
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

            {/* TAB: Historial */}
            <TabsContent value="historial" className="flex-1 overflow-hidden m-0 w-full">
              <div className="h-full w-full" style={{ padding: '24px' }}>
                <Card className="h-full shadow-lg border-0 w-full">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-t-lg" style={{ padding: '16px' }}>
                    <CardTitle className="flex items-center gap-2 text-purple-900 text-lg">
                      <Clock className="w-5 h-5" />
                      Historial de Asignaciones ({historialAsignaciones.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 h-full">
                    <div className="overflow-auto h-full">
                      <Table>
                        <TableHeader className="sticky top-0 bg-gray-100 z-10">
                          <TableRow>
                            <TableHead className="font-semibold text-sm">Usuario</TableHead>
                            <TableHead className="font-semibold text-sm">Equipo</TableHead>
                            <TableHead className="font-semibold text-sm">Modelo</TableHead>
                            <TableHead className="font-semibold text-sm">Serie</TableHead>
                            <TableHead className="font-semibold text-sm">Fecha Asignación</TableHead>
                            <TableHead className="font-semibold text-sm">Fecha Liberación</TableHead>
                            <TableHead className="font-semibold text-sm">Duración</TableHead>
                            <TableHead className="font-semibold text-sm">Estado</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {historialAsignaciones.map((registro) => (
                            <TableRow key={registro.id_asignacion} className="hover:bg-gray-50">
                              <TableCell className="font-medium text-sm">
                                {registro.usuario_nombre || registro.rut_usuario}
                              </TableCell>
                              <TableCell className="text-sm">{registro.equipo_nombre || "-"}</TableCell>
                              <TableCell className="text-sm">{registro.equipo_modelo || "-"}</TableCell>
                              <TableCell className="font-mono text-sm">{registro.equipo_serie || "-"}</TableCell>
                              <TableCell className="text-sm">{new Date(registro.fecha_asignacion).toLocaleDateString('es-CL')}</TableCell>
                              <TableCell className="text-sm">
                                {registro.fecha_liberacion ? (
                                  <span className="text-red-600">
                                    {new Date(registro.fecha_liberacion).toLocaleDateString('es-CL')}
                                  </span>
                                ) : (
                                  <span className="text-green-600 font-medium">-</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-sm">
                                  {registro.duracion_dias || 0} días
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant={registro.activa ? "default" : "secondary"} 
                                  className={`text-sm ${registro.activa ? "bg-green-500" : "bg-gray-500"}`}
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