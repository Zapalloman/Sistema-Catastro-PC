"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, UserPlus, Eye, Trash2, CheckCircle, AlertCircle, Users, Database, Filter, Calendar, User } from "lucide-react"

// Componente mejorado para autocompletar RUT
function RutAutocompleteAsignacion({ value, onChange, onUserSelected, placeholder = "Buscar por RUT, nombre o apellido..." }) {
  const [search, setSearch] = useState("")
  const [options, setOptions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [userDetail, setUserDetail] = useState<any>(null)

  // Buscar por rut, nombre o apellido
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearch(val)
    onChange(val)
    setLoading(true)
    
    if (val.length >= 3) {
      try {
        const res = await fetch(`http://localhost:3000/igm/usuarios/buscar?q=${encodeURIComponent(val)}`)
        if (res.ok) {
          const data = await res.json()
          setOptions(Array.isArray(data) ? data : [])
        } else {
          console.error('Error en la respuesta:', res.status)
          setOptions([])
        }
      } catch (error) {
        console.error("Error buscando usuarios:", error)
        setOptions([])
      }
    } else {
      setOptions([])
    }
    setLoading(false)
  }

  // Al seleccionar un usuario, obtener datos completos
  const handleSelect = async (rut: string) => {
    setSearch(rut)
    onChange(rut)
    setOptions([])
    
    try {
      // Obtener datos completos del usuario
      const res = await fetch(`http://localhost:3000/igm/usuarios/detalle?rut=${encodeURIComponent(rut)}`)
      if (res.ok) {
        const userData = await res.json()
        if (userData) {
          setUserDetail({
            rut: userData.rut,
            nombres: userData.nombres,
            apaterno: userData.apaterno,
            amaterno: userData.amaterno,
            cargo: userData.cargo
          })
          
          if (onUserSelected) {
            onUserSelected({
              rut: userData.rut,
              nombres: `${userData.nombres} ${userData.apaterno} ${userData.amaterno}`.trim()
            })
          }
        } else {
          throw new Error('Usuario no encontrado')
        }
      } else {
        throw new Error('Error al obtener datos del usuario')
      }
    } catch (error) {
      console.error('Error obteniendo datos del usuario:', error)
      // Fallback con datos básicos
      setUserDetail({
        rut: rut,
        nombres: "Usuario",
        apaterno: "del",
        amaterno: "IGM",
        cargo: "Por verificar"
      })
      
      if (onUserSelected) {
        onUserSelected({
          rut: rut,
          nombres: "Usuario del IGM"
        })
      }
    }
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder={placeholder}
          value={search}
          onChange={handleSearch}
          className="w-full pl-10 h-12 text-base border-2 border-gray-200 focus:border-blue-500 rounded-lg"
          autoComplete="off"
        />
      </div>
      
      {loading && (
        <div className="absolute top-full left-0 right-0 bg-white border-2 border-t-0 border-gray-200 px-4 py-3 text-sm text-gray-500 z-50 rounded-b-lg shadow-lg">
          <div className="flex items-center gap-2">
            <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            Buscando usuarios...
          </div>
        </div>
      )}
      
      {options.length > 0 && (
        <ul className="absolute top-full left-0 right-0 bg-white border-2 border-t-0 border-gray-200 max-h-72 overflow-y-auto z-50 shadow-xl rounded-b-lg">
          {options.map(opt => (
            <li
              key={opt.rut}
              className="p-4 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
              onClick={() => handleSelect(opt.rut)}
            >
              <div className="font-semibold text-gray-900">{opt.nombres} {opt.apaterno} {opt.amaterno}</div>
              <div className="text-sm text-gray-600 mt-1">{opt.rut} • {opt.cargo}</div>
            </li>
          ))}
        </ul>
      )}
      
      {userDetail && (
        <div className="mt-4 p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="font-semibold text-blue-900">
                {userDetail.nombres} {userDetail.apaterno} {userDetail.amaterno}
              </div>
              <div className="text-sm text-blue-700">
                RUT: {userDetail.rut} • Cargo: {userDetail.cargo || "No especificado"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function AsignacionesModal({ open, onClose }: {
  open: boolean,
  onClose: () => void
}) {
  const [activeTab, setActiveTab] = useState("nueva-asignacion")
  const [asignaciones, setAsignaciones] = useState([])
  const [historialAsignaciones, setHistorialAsignaciones] = useState([])
  const [equipos, setEquipos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Estados para nueva asignación
  const [selectedEquipos, setSelectedEquipos] = useState<number[]>([])
  const [rutUsuario, setRutUsuario] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [error, setError] = useState("")
  const [selectedCategoria, setSelectedCategoria] = useState("TODOS")
  const [searchEquipos, setSearchEquipos] = useState("")

  useEffect(() => {
    if (open) {
      loadAsignaciones()
      loadEquiposDisponibles()
      loadCategorias()
      loadHistorialAsignaciones()
    }
  }, [open])

  const loadCategorias = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/equipos/categorias")
      if (response.ok) {
        const data = await response.json()
        setCategorias(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error("Error cargando categorías:", error)
      setCategorias([])
    }
  }

  const loadAsignaciones = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/asignaciones")
      if (response.ok) {
        const data = await response.json()
        setAsignaciones(Array.isArray(data) ? data : [])
      } else {
        console.error("Error al cargar asignaciones:", response.status)
        setAsignaciones([])
      }
    } catch (error) {
      console.error("Error cargando asignaciones:", error)
      setAsignaciones([])
    }
  }

  const loadHistorialAsignaciones = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/asignaciones/historial")
      if (response.ok) {
        const data = await response.json()
        setHistorialAsignaciones(Array.isArray(data) ? data : [])
      } else {
        console.error("Error al cargar historial:", response.status)
        setHistorialAsignaciones([])
      }
    } catch (error) {
      console.error("Error cargando historial:", error)
      setHistorialAsignaciones([])
    }
  }

  const loadEquiposDisponibles = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/equipos/disponibles")
      if (response.ok) {
        const data = await response.json()
        setEquipos(Array.isArray(data) ? data : [])
      } else {
        console.error("Error al cargar equipos:", response.status)
        setEquipos([])
      }
    } catch (error) {
      console.error("Error cargando equipos:", error)
      setEquipos([])
    }
  }

  const handleAsignar = async () => {
    if (selectedEquipos.length === 0 || !rutUsuario) {
      setError("Debe seleccionar al menos un equipo y un usuario")
      return
    }

    try {
      setLoading(true)
      setError("")
      
      // Crear asignaciones individuales para cada equipo
      const asignacionesPromises = selectedEquipos.map(idEquipo => 
        fetch("http://localhost:3000/api/asignaciones", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            id_equipo: idEquipo,
            rut_usuario: rutUsuario
          })
        })
      )

      const responses = await Promise.all(asignacionesPromises)
      
      // Verificar que todas las asignaciones fueron exitosas
      const allSuccessful = responses.every(response => response.ok)
      
      if (!allSuccessful) {
        throw new Error("Error en algunas asignaciones")
      }

      // Limpiar formulario
      setSelectedEquipos([])
      setRutUsuario("")
      setSelectedUser(null)
      setSelectedCategoria("TODOS")
      setSearchEquipos("")
      
      // Recargar datos
      await loadAsignaciones()
      await loadEquiposDisponibles()
      await loadHistorialAsignaciones()
      
      alert(`${selectedEquipos.length} equipo(s) asignado(s) exitosamente`)
    } catch (error) {
      console.error("Error completo:", error)
      setError(error.message || "Error al asignar equipos")
    } finally {
      setLoading(false)
    }
  }

  const handleLiberar = async (idAsignacion: number) => {
    if (!confirm("¿Está seguro de liberar este equipo?")) return

    try {
      const response = await fetch(`http://localhost:3000/api/asignaciones/${idAsignacion}`, {
        method: "DELETE"
      })

      if (!response.ok) throw new Error("Error al liberar equipo")

      loadAsignaciones()
      loadEquiposDisponibles()
      loadHistorialAsignaciones()
      alert("Equipo liberado exitosamente")
    } catch (error) {
      console.error("Error:", error)
      alert("Error al liberar equipo")
    }
  }

  // Filtrar equipos por categoría y búsqueda
  const filteredEquipos = equipos.filter(equipo => {
    const matchesCategoria = selectedCategoria === "TODOS" || equipo.categoria?.desc_tipo === selectedCategoria
    const matchesSearch = 
      (equipo.nombre_pc || "").toLowerCase().includes(searchEquipos.toLowerCase()) ||
      (equipo.numero_serie || "").toLowerCase().includes(searchEquipos.toLowerCase()) ||
      (equipo.modelo || "").toLowerCase().includes(searchEquipos.toLowerCase())
    
    return matchesCategoria && matchesSearch
  })

  // Filtrar asignaciones activas
  const filteredAsignaciones = asignaciones.filter(asignacion =>
    asignacion.equipo_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asignacion.usuario_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asignacion.rut_usuario?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className="w-screen max-w-none h-[95vh] mx-4 p-0 overflow-hidden"
        style={{ width: 'calc(100vw - 2rem)', maxWidth: 'none' }}
      >
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <UserPlus className="w-6 h-6" />
              </div>
              Gestión de Asignaciones de Equipos
            </DialogTitle>
            <p className="text-blue-100 mt-2">
              Administra la asignación de equipos a usuarios del IGM
            </p>
          </DialogHeader>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 overflow-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 h-14 bg-gray-100 p-1 rounded-xl">
              <TabsTrigger 
                value="nueva-asignacion" 
                className="text-base py-3 px-6 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Nueva Asignación
              </TabsTrigger>
              <TabsTrigger 
                value="asignaciones-activas" 
                className="text-base py-3 px-6 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Asignaciones Activas
              </TabsTrigger>
              <TabsTrigger 
                value="historial" 
                className="text-base py-3 px-6 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Database className="w-5 h-5 mr-2" />
                Historial
              </TabsTrigger>
            </TabsList>

            {/* Nueva Asignación */}
            <TabsContent value="nueva-asignacion" className="space-y-8">
              {/* Información del Usuario */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-8 rounded-2xl border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Información del Usuario</h3>
                    <p className="text-gray-600">Selecciona el usuario que recibirá los equipos</p>
                  </div>
                </div>
                
                <div className="max-w-2xl">
                  <label className="block mb-3 text-sm font-semibold text-gray-700">
                    Usuario IGM <span className="text-red-500">*</span>
                  </label>
                  <RutAutocompleteAsignacion 
                    value={rutUsuario} 
                    onChange={setRutUsuario}
                    onUserSelected={setSelectedUser}
                    placeholder="Buscar por RUT, nombre o apellido..."
                  />
                </div>
              </div>

              {/* Selección de Equipos */}
              <div className="bg-gradient-to-br from-gray-50 to-green-50 p-8 rounded-2xl border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Filter className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Selección de Equipos</h3>
                    <p className="text-gray-600">Filtra y selecciona los equipos a asignar</p>
                  </div>
                </div>
                
                {/* Filtros */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block mb-3 text-sm font-semibold text-gray-700">
                      Categoría <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full h-12 px-4 text-base border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-0 bg-white"
                      value={selectedCategoria}
                      onChange={(e) => setSelectedCategoria(e.target.value)}
                    >
                      <option value="TODOS">Todas las Categorías</option>
                      {categorias
                        .filter((cat) => cat && cat.desc_tipo && cat.desc_tipo !== "OTRO")
                        .sort((a, b) => (a.desc_tipo || "").localeCompare(b.desc_tipo || ""))
                        .map((cat) => (
                          <option key={cat.id_tipo} value={cat.desc_tipo}>
                            {cat.desc_tipo}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-3 text-sm font-semibold text-gray-700">Buscar equipo</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        placeholder="Buscar por nombre, serie, modelo..."
                        value={searchEquipos}
                        onChange={(e) => setSearchEquipos(e.target.value)}
                        className="w-full pl-11 h-12 text-base border-2 border-gray-200 focus:border-green-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Tabla de equipos */}
                <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden shadow-sm">
                  <div className="max-h-96 overflow-y-auto">
                    <Table>
                      <TableHeader className="bg-gray-50 border-b-2 border-gray-200">
                        <TableRow>
                          <TableHead className="w-16 text-center font-semibold text-gray-900 py-4">
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
                              className="w-5 h-5 rounded border-2 border-gray-300"
                            />
                          </TableHead>
                          <TableHead className="font-semibold text-gray-900 py-4">Nombre PC</TableHead>
                          <TableHead className="font-semibold text-gray-900 py-4">N° Serie</TableHead>
                          <TableHead className="font-semibold text-gray-900 py-4">Modelo</TableHead>
                          <TableHead className="font-semibold text-gray-900 py-4">Capacidad</TableHead>
                          <TableHead className="font-semibold text-gray-900 py-4">Categoría</TableHead>
                          <TableHead className="font-semibold text-gray-900 py-4">Marca</TableHead>
                          <TableHead className="font-semibold text-gray-900 py-4">Ubicación</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredEquipos.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-12">
                              <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                  <AlertCircle className="w-8 h-8 text-gray-400" />
                                </div>
                                <div>
                                  <p className="text-gray-500 text-lg font-medium">
                                    {equipos.length === 0 ? "No hay equipos disponibles" : "No se encontraron equipos"}
                                  </p>
                                  <p className="text-gray-400 text-sm mt-1">
                                    {equipos.length === 0 ? "Todos los equipos están asignados o en préstamo" : "Intenta cambiar los filtros de búsqueda"}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredEquipos.map((eq) => (
                            <TableRow key={eq.id_equipo} className="hover:bg-gray-50 transition-colors">
                              <TableCell className="text-center py-4">
                                <input
                                  type="checkbox"
                                  checked={selectedEquipos.includes(eq.id_equipo)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedEquipos([...selectedEquipos, eq.id_equipo])
                                    } else {
                                      setSelectedEquipos(selectedEquipos.filter((id) => id !== eq.id_equipo))
                                    }
                                  }}
                                  className="w-5 h-5 rounded border-2 border-gray-300"
                                />
                              </TableCell>
                              <TableCell className="font-semibold text-gray-900 py-4">
                                {eq.nombre_pc || "-"}
                              </TableCell>
                              <TableCell className="font-mono text-sm bg-gray-50 py-4">
                                {eq.numero_serie || "-"}
                              </TableCell>
                              <TableCell className="text-gray-700 py-4">
                                {eq.modelo || "-"}
                              </TableCell>
                              <TableCell className="text-gray-700 py-4">
                                {eq.almacenamiento || "-"}
                              </TableCell>
                              <TableCell className="py-4">
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                  {eq.categoria?.desc_tipo || "-"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-gray-700 py-4">
                                {eq.marca?.des_ti_marca || eq.marca?.nombre || "-"}
                              </TableCell>
                              <TableCell className="text-gray-700 py-4">
                                {eq.ubicacion?.des_ti_ubicacion || eq.ubicacion?.nombre || "-"}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                
                {selectedEquipos.length > 0 && (
                  <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <span className="text-green-800 font-semibold text-lg">
                        {selectedEquipos.length} equipo(s) seleccionado(s)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                    <span className="text-red-800 font-medium">{error}</span>
                  </div>
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex justify-end gap-4 pt-6 border-t-2 border-gray-200">
                <Button 
                  variant="outline" 
                  onClick={onClose} 
                  disabled={loading} 
                  size="lg"
                  className="px-8 py-3 text-base border-2"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleAsignar}
                  disabled={!rutUsuario || selectedEquipos.length === 0 || loading}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-base shadow-lg"
                  size="lg"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                      Asignando equipos...
                    </div>
                  ) : (
                    `Asignar ${selectedEquipos.length} Equipo(s)`
                  )}
                </Button>
              </div>
            </TabsContent>

            {/* Asignaciones Activas */}
            <TabsContent value="asignaciones-activas" className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl border border-gray-200">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    Asignaciones Activas
                  </h3>
                  <p className="text-gray-600 mt-2">Gestiona las asignaciones actuales de equipos</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="Buscar asignaciones..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-11 w-80 h-12 border-2 border-gray-200 focus:border-green-500"
                    />
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 px-4 py-2 text-base">
                    <Users className="w-4 h-4 mr-2" />
                    {filteredAsignaciones.length} asignaciones
                  </Badge>
                </div>
              </div>

              <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-sm">
                <Table>
                  <TableHeader className="bg-gray-50 border-b-2 border-gray-200">
                    <TableRow>
                      <TableHead className="font-semibold text-gray-900 py-4 px-6">Equipo</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-4 px-6">Serie</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-4 px-6">Usuario</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-4 px-6">RUT</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-4 px-6">Cargo</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-4 px-6">Fecha Asignación</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-4 px-6">Estado</TableHead>
                      <TableHead className="text-center font-semibold text-gray-900 py-4 px-6">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAsignaciones.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-16">
                          <div className="flex flex-col items-center gap-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                              <AlertCircle className="w-10 h-10 text-gray-400" />
                            </div>
                            <div>
                              <p className="text-gray-500 text-xl font-medium">No hay asignaciones activas</p>
                              <p className="text-gray-400 text-sm mt-2">Los equipos asignados aparecerán aquí</p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAsignaciones.map((asignacion, index) => (
                        <TableRow key={index} className="hover:bg-gray-50 transition-colors">
                          <TableCell className="font-semibold text-gray-900 py-4 px-6">
                            {asignacion.equipo_nombre || asignacion.equipo_modelo}
                          </TableCell>
                          <TableCell className="font-mono text-sm bg-gray-50 py-4 px-6">
                            {asignacion.equipo_serie}
                          </TableCell>
                          <TableCell className="font-semibold text-gray-900 py-4 px-6">
                            {asignacion.usuario_nombre}
                          </TableCell>
                          <TableCell className="font-mono text-sm py-4 px-6">
                            {asignacion.rut_usuario}
                          </TableCell>
                          <TableCell className="text-gray-700 py-4 px-6">
                            {asignacion.usuario_cargo}
                          </TableCell>
                          <TableCell className="py-4 px-6">
                            <div className="flex items-center gap-2 text-gray-700">
                              <Calendar className="w-4 h-4" />
                              {asignacion.fecha_asignacion ? new Date(asignacion.fecha_asignacion).toLocaleDateString() : "-"}
                            </div>
                          </TableCell>
                          <TableCell className="py-4 px-6">
                            <Badge className="bg-green-100 text-green-800 border-green-300 px-3 py-1">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Activa
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center py-4 px-6">
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-blue-500 hover:bg-blue-600 text-white border-blue-500 h-9"
                                title="Ver detalles"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-red-500 hover:bg-red-600 text-white border-red-500 h-9"
                                onClick={() => handleLiberar(asignacion.id_asignacion)}
                                title="Liberar equipo"
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
            </TabsContent>

            {/* Historial */}
            <TabsContent value="historial" className="space-y-6">
              <div className="flex justify-between items-center bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-2xl border border-gray-200">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
                    <Database className="w-8 h-8 text-purple-600" />
                    Historial de Asignaciones
                  </h3>
                  <p className="text-gray-600 mt-2">Registro completo de todas las asignaciones realizadas</p>
                </div>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300 px-4 py-2 text-base">
                  <Database className="w-4 h-4 mr-2" />
                  {historialAsignaciones.length} registros
                </Badge>
              </div>

              <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-sm">
                <Table>
                  <TableHeader className="bg-gray-50 border-b-2 border-gray-200">
                    <TableRow>
                      <TableHead className="font-semibold text-gray-900 py-4 px-6">Equipo</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-4 px-6">Usuario</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-4 px-6">Fecha Asignación</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-4 px-6">Fecha Liberación</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-4 px-6">Estado</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-4 px-6">Duración</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historialAsignaciones.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-16">
                          <div className="flex flex-col items-center gap-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                              <Database className="w-10 h-10 text-gray-400" />
                            </div>
                            <div>
                              <p className="text-gray-500 text-xl font-medium">No hay historial disponible</p>
                              <p className="text-gray-400 text-sm mt-2">El historial de asignaciones aparecerá aquí</p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      historialAsignaciones.map((registro, index) => (
                        <TableRow key={index} className="hover:bg-gray-50 transition-colors">
                          <TableCell className="font-semibold text-gray-900 py-4 px-6">
                            {registro.equipo_nombre}
                          </TableCell>
                          <TableCell className="font-semibold text-gray-900 py-4 px-6">
                            {registro.usuario_nombre}
                          </TableCell>
                          <TableCell className="py-4 px-6">
                            <div className="flex items-center gap-2 text-gray-700">
                              <Calendar className="w-4 h-4" />
                              {registro.fecha_asignacion ? new Date(registro.fecha_asignacion).toLocaleDateString() : "-"}
                            </div>
                          </TableCell>
                          <TableCell className="py-4 px-6">
                            <div className="flex items-center gap-2 text-gray-700">
                              <Calendar className="w-4 h-4" />
                              {registro.fecha_liberacion ? new Date(registro.fecha_liberacion).toLocaleDateString() : "-"}
                            </div>
                          </TableCell>
                          <TableCell className="py-4 px-6">
                            <Badge className={
                              registro.activa 
                                ? "bg-green-100 text-green-800 border-green-300 px-3 py-1"
                                : "bg-gray-100 text-gray-800 border-gray-300 px-3 py-1"
                            }>
                              {registro.activa ? "Activa" : "Finalizada"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-700 py-4 px-6">
                            {registro.duracion_dias ? `${registro.duracion_dias} días` : "-"}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}