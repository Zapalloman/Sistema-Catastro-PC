"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, UserPlus, Eye, Trash2, CheckCircle, AlertCircle, Users, Database } from "lucide-react"

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
      <Input
        placeholder={placeholder}
        value={search}
        onChange={handleSearch}
        className="w-full"
        autoComplete="off"
      />
      {loading && (
        <div className="absolute top-full left-0 right-0 bg-white border border-t-0 px-3 py-2 text-xs text-gray-500 z-50">
          Buscando...
        </div>
      )}
      {options.length > 0 && (
        <ul className="absolute top-full left-0 right-0 bg-white border border-t-0 max-h-60 overflow-y-auto z-50 shadow-lg">
          {options.map(opt => (
            <li
              key={opt.rut}
              className="p-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
              onClick={() => handleSelect(opt.rut)}
            >
              <div className="font-medium text-sm">{opt.nombres} {opt.apaterno} {opt.amaterno}</div>
              <div className="text-xs text-gray-500">{opt.rut} - {opt.cargo}</div>
            </li>
          ))}
        </ul>
      )}
      {userDetail && (
        <div className="mt-2 p-3 border rounded-lg bg-blue-50 text-sm">
          <div className="font-medium text-blue-900">
            {userDetail.nombres} {userDetail.apaterno} {userDetail.amaterno}
          </div>
          <div className="text-blue-700 text-xs mt-1">
            RUT: {userDetail.rut} • Cargo: {userDetail.cargo || "No especificado"}
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
  const [equipos, setEquipos] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Estados para nueva asignación
  const [selectedEquipo, setSelectedEquipo] = useState("")
  const [rutUsuario, setRutUsuario] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    if (open) {
      loadAsignaciones()
      loadEquiposDisponibles()
    }
  }, [open])

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
    if (!selectedEquipo || !rutUsuario) {
      setError("Debe seleccionar un equipo y un usuario")
      return
    }

    try {
      setLoading(true)
      setError("")
      
      console.log("Enviando asignación:", {
        id_equipo: Number(selectedEquipo),
        rut_usuario: rutUsuario
      })

      const response = await fetch("http://localhost:3000/api/asignaciones", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          id_equipo: Number(selectedEquipo),
          rut_usuario: rutUsuario
        })
      })

      console.log("Respuesta del servidor:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error del servidor:", errorText)
        throw new Error(`Error ${response.status}: ${errorText}`)
      }

      const result = await response.json()
      console.log("Asignación creada:", result)

      // Limpiar formulario
      setSelectedEquipo("")
      setRutUsuario("")
      setSelectedUser(null)
      
      // Recargar datos
      await loadAsignaciones()
      await loadEquiposDisponibles()
      
      alert("Equipo asignado exitosamente")
    } catch (error) {
      console.error("Error completo:", error)
      setError(error.message || "Error al asignar equipo")
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
      alert("Equipo liberado exitosamente")
    } catch (error) {
      console.error("Error:", error)
      alert("Error al liberar equipo")
    }
  }

  // Filtrar asignaciones
  const filteredAsignaciones = asignaciones.filter(asignacion =>
    asignacion.equipo_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asignacion.usuario_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asignacion.rut_usuario?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <UserPlus className="w-7 h-7 text-blue-600" />
            Gestión de Asignaciones de Equipos
          </DialogTitle>
          <p className="text-gray-600 mt-2">
            Asigna equipos a usuarios del IGM y gestiona las asignaciones activas
          </p>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="nueva-asignacion" className="text-base py-3">
              <UserPlus className="w-4 h-4 mr-2" />
              Nueva Asignación
            </TabsTrigger>
            <TabsTrigger value="asignaciones-activas" className="text-base py-3">
              <CheckCircle className="w-4 h-4 mr-2" />
              Asignaciones Activas
            </TabsTrigger>
            <TabsTrigger value="historial" className="text-base py-3">
              <Database className="w-4 h-4 mr-2" />
              Historial
            </TabsTrigger>
          </TabsList>

          {/* Nueva Asignación */}
          <TabsContent value="nueva-asignacion" className="space-y-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl border border-blue-200">
              <h3 className="text-2xl font-semibold mb-6 text-blue-900 flex items-center gap-2">
                <UserPlus className="w-6 h-6" />
                Asignar Equipo a Usuario
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Selección de Equipo */}
                <div className="space-y-4">
                  <label className="block text-base font-semibold text-gray-700 mb-3">
                    Seleccionar Equipo *
                  </label>
                  <select
                    value={selectedEquipo}
                    onChange={(e) => setSelectedEquipo(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccione un equipo...</option>
                    {equipos.map(equipo => (
                      <option key={equipo.id_equipo} value={equipo.id_equipo}>
                        {equipo.nombre_pc || equipo.modelo} - {equipo.numero_serie} ({equipo.categoria?.desc_tipo})
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-green-600 font-medium">
                    ✅ {equipos.length} equipos disponibles para asignación
                  </p>
                </div>

                {/* Selección de Usuario */}
                <div className="space-y-4">
                  <label className="block text-base font-semibold text-gray-700 mb-3">
                    Usuario IGM *
                  </label>
                  <RutAutocompleteAsignacion 
                    value={rutUsuario} 
                    onChange={setRutUsuario}
                    onUserSelected={setSelectedUser}
                    placeholder="Buscar por RUT, nombre o apellido..."
                  />
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700">
                  {error}
                </div>
              )}

              <div className="mt-8 flex gap-4">
                <Button 
                  onClick={handleAsignar}
                  disabled={loading || !selectedEquipo || !rutUsuario}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                      Asignando...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Asignar Equipo
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={onClose} size="lg" className="px-8 py-3 text-base">
                  Cancelar
                </Button>
              </div>
            </div>

            {/* Resumen de equipos disponibles */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h4 className="text-lg font-semibold mb-4 text-gray-900">
                📊 Resumen de Equipos Disponibles
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
                  <div className="text-3xl font-bold text-green-600">{equipos.length}</div>
                  <div className="text-sm text-green-700 font-medium">Total Disponibles</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-200">
                  <div className="text-3xl font-bold text-blue-600">
                    {equipos.filter(e => e.categoria?.desc_tipo?.toLowerCase().includes("cpu")).length}
                  </div>
                  <div className="text-sm text-blue-700 font-medium">Computadores</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center border border-purple-200">
                  <div className="text-3xl font-bold text-purple-600">
                    {equipos.filter(e => e.categoria?.desc_tipo?.toLowerCase().includes("notebook")).length}
                  </div>
                  <div className="text-sm text-purple-700 font-medium">Notebooks</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg text-center border border-orange-200">
                  <div className="text-3xl font-bold text-orange-600">
                    {equipos.filter(e => !e.categoria?.desc_tipo?.toLowerCase().includes("cpu") && !e.categoria?.desc_tipo?.toLowerCase().includes("notebook")).length}
                  </div>
                  <div className="text-sm text-orange-700 font-medium">Otros</div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Asignaciones Activas */}
          <TabsContent value="asignaciones-activas" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Asignaciones Activas</h3>
                <p className="text-gray-600 mt-1">Gestiona las asignaciones actuales de equipos</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar asignaciones..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-80"
                  />
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 px-3 py-1">
                  <Users className="w-3 h-3 mr-1" />
                  {filteredAsignaciones.length} asignaciones
                </Badge>
              </div>
            </div>

            <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-900">Equipo</TableHead>
                    <TableHead className="font-semibold text-gray-900">Serie</TableHead>
                    <TableHead className="font-semibold text-gray-900">Usuario</TableHead>
                    <TableHead className="font-semibold text-gray-900">RUT</TableHead>
                    <TableHead className="font-semibold text-gray-900">Cargo</TableHead>
                    <TableHead className="font-semibold text-gray-900">Fecha Asignación</TableHead>
                    <TableHead className="font-semibold text-gray-900">Estado</TableHead>
                    <TableHead className="text-center font-semibold text-gray-900">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAsignaciones.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12">
                        <div className="flex flex-col items-center gap-3">
                          <AlertCircle className="w-12 h-12 text-gray-400" />
                          <div>
                            <p className="text-gray-500 text-lg font-medium">No hay asignaciones activas</p>
                            <p className="text-gray-400 text-sm">Los equipos asignados aparecerán aquí</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAsignaciones.map((asignacion, index) => (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          {asignacion.equipo_nombre || asignacion.equipo_modelo}
                        </TableCell>
                        <TableCell className="font-mono text-sm bg-gray-50">
                          {asignacion.equipo_serie}
                        </TableCell>
                        <TableCell className="font-medium">{asignacion.usuario_nombre}</TableCell>
                        <TableCell className="font-mono text-sm">{asignacion.rut_usuario}</TableCell>
                        <TableCell className="text-sm">{asignacion.usuario_cargo}</TableCell>
                        <TableCell className="text-sm">
                          {asignacion.fecha_asignacion ? new Date(asignacion.fecha_asignacion).toLocaleDateString() : "-"}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800 border-green-300">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Activa
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-blue-500 hover:bg-blue-600 text-white border-blue-500"
                              title="Ver detalles"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-red-500 hover:bg-red-600 text-white border-red-500"
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
          <TabsContent value="historial" className="space-y-4">
            <div className="text-center py-16">
              <div className="flex flex-col items-center gap-4">
                <Database className="w-16 h-16 text-gray-400" />
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Historial de Asignaciones</h3>
                  <p className="text-gray-600 max-w-md">
                    Aquí se mostrará el historial completo de todas las asignaciones realizadas,
                    incluyendo asignaciones finalizadas y transferencias.
                  </p>
                </div>
                <Button className="mt-4" variant="outline" size="lg">
                  <Database className="w-4 h-4 mr-2" />
                  Próximamente disponible
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}