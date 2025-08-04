"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  X, 
  Monitor, 
  HardDrive, 
  Cpu, 
  MemoryStick,  // ✅ CORREGIDO: Memory -> MemoryStick
  User, 
  MapPin, 
  Calendar,
  Building2,
  Hash,
  Laptop,
  Wifi,
  Network,
  Info,
  Settings,
  Package
} from "lucide-react"

interface Z8Equipment {
  id_equipo: number
  llave_inventario: string
  nombre_pc: string
  cod_ti_marca: number
  modelo: string
  numero_serie: string
  almacenamiento: string
  ram: string
  procesador: string
  observaciones?: string
  fecha_ingreso: string
  activo: boolean
  cod_ti_propietario: number
  marca: string
  propietario: string
  ubicacion: string
  estado_asignacion: string
  usuario_asignado?: string
  usuario_asignado_nombre?: string
  fecha_asignacion?: string
  ip?: string
  direccion_mac?: string
  // ✅ NUEVOS CAMPOS DE RED
  cod_ti_red?: number
  cod_ti_dominio_red?: number
  red?: string
  dominio_red?: string
}

interface Z8StationDetailsModalProps {
  station: Z8Equipment | null
  isOpen: boolean
  onClose: () => void
}

export function Z8StationDetailsModal({ station, isOpen, onClose }: Z8StationDetailsModalProps) {
  if (!station) return null

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'ASIGNADO':
        return <Badge className="bg-green-500 hover:bg-green-600">ASIGNADO</Badge>
      case 'DISPONIBLE':
        return <Badge className="bg-blue-500 hover:bg-blue-600">DISPONIBLE</Badge>
      case 'MANTENIMIENTO':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">MANTENIMIENTO</Badge>
      case 'FUERA_DE_SERVICIO':
        return <Badge className="bg-red-500 hover:bg-red-600">FUERA DE SERVICIO</Badge>
      default:
        return <Badge variant="secondary">DESCONOCIDO</Badge>
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Estación Z8 - {station.nombre_pc}
              </DialogTitle>
              <p className="text-gray-600 mt-1">Detalles completos del equipo</p>
            </div>
            <div className="flex items-center gap-3">
              {getStatusBadge(station.estado_asignacion)}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="hardware" className="flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              Hardware
            </TabsTrigger>
            <TabsTrigger value="network" className="flex items-center gap-2">
              <Network className="w-4 h-4" />
              Red
            </TabsTrigger>
            <TabsTrigger value="assignment" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Asignación
            </TabsTrigger>
          </TabsList>

          {/* TAB: Información General */}
          <TabsContent value="general" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Información Básica */}
              <Card className="border-purple-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
                  <CardTitle className="flex items-center gap-2 text-purple-900">
                    <Package className="w-5 h-5" />
                    Información Básica
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div>
                    <label className="text-sm font-medium text-gray-600">ID Equipo</label>
                    <p className="font-mono text-lg font-semibold text-purple-700">#{station.id_equipo}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Llave de Inventario</label>
                    <p className="font-mono text-sm bg-gray-100 p-2 rounded border">{station.llave_inventario}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Número de Serie</label>
                    <p className="font-mono text-sm bg-gray-100 p-2 rounded border">{station.numero_serie}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Modelo</label>
                    <p className="font-semibold">{station.modelo}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Marca</label>
                    <p className="font-medium">{station.marca}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Información Administrativa */}
              <Card className="border-blue-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                  <CardTitle className="flex items-center gap-2 text-blue-900">
                    <Building2 className="w-5 h-5" />
                    Información Administrativa
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Propietario</label>
                    <p className="font-semibold text-blue-700">{station.propietario}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Ubicación</label>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      {station.ubicacion}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Fecha de Ingreso</label>
                    <p className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      {new Date(station.fecha_ingreso).toLocaleDateString('es-CL', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Estado</label>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${station.activo ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="font-medium">{station.activo ? 'Activo' : 'Inactivo'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Observaciones */}
            {station.observaciones && (
              <Card className="border-gray-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50">
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Info className="w-5 h-5" />
                    Observaciones
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-700 whitespace-pre-wrap">{station.observaciones}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* TAB: Hardware */}
          <TabsContent value="hardware" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* ✅ PROCESADOR CON TÍTULO ALINEADO */}
              <Card className="border-orange-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
                  <CardTitle className="flex items-center gap-2 text-orange-900">
                    <Cpu className="w-5 h-5" />
                    Procesador
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="font-semibold text-lg text-orange-700">{station.procesador}</p>
                </CardContent>
              </Card>

              {/* ✅ MEMORIA RAM CON TÍTULO ALINEADO */}
              <Card className="border-green-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                  <CardTitle className="flex items-center gap-2 text-green-900">
                    <MemoryStick className="w-5 h-5" />
                    Memoria RAM
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="font-semibold text-lg text-green-700">{station.ram}</p>
                </CardContent>
              </Card>

              {/* ✅ ALMACENAMIENTO CON TÍTULO ALINEADO */}
              <Card className="border-blue-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                  <CardTitle className="flex items-center gap-2 text-blue-900">
                    <HardDrive className="w-5 h-5" />
                    Almacenamiento
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="font-semibold text-lg text-blue-700">{station.almacenamiento}</p>
                </CardContent>
              </Card>
            </div>

            {/* ✅ INFORMACIÓN ADICIONAL DE HARDWARE */}
            <Card className="border-gray-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Settings className="w-5 h-5" />
                  Información del Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Marca</label>
                    <p className="font-medium text-gray-900">{station.marca}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Modelo</label>
                    <p className="font-medium text-gray-900">{station.modelo}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Número de Serie</label>
                    <p className="font-medium text-gray-900">{station.numero_serie}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Propietario</label>
                    <p className="font-medium text-gray-900">{station.propietario}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB: Red */}
          <TabsContent value="network" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-blue-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                  <CardTitle className="flex items-center gap-2 text-blue-900">
                    <Wifi className="w-5 h-5" />
                    Configuración de Red
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Dirección IP</label>
                    <p className="font-mono text-sm bg-blue-50 p-2 rounded border border-blue-200">
                      {station.ip || "No asignada"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Dirección MAC</label>
                    <p className="font-mono text-sm bg-blue-50 p-2 rounded border border-blue-200">
                      {station.direccion_mac || "No disponible"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Red</label>
                    <p className="text-sm font-medium text-blue-700">
                      {station.red || "Sin red asignada"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Dominio de Red</label>
                    <p className="text-sm font-medium text-blue-700">
                      {station.dominio_red || "Sin dominio asignado"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                  <CardTitle className="flex items-center gap-2 text-green-900">
                    <Network className="w-5 h-5" />
                    Estado de Conectividad
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Estado: Conectado</span>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Configuración</label>
                    <div className="mt-2 p-3 bg-green-50 rounded border border-green-200">
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">IP:</span>
                          <span className="ml-2 font-mono">{station.ip || "Automática"}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Red:</span>
                          <span className="ml-2">{station.red || "Predeterminada"}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Dominio:</span>
                          <span className="ml-2">{station.dominio_red || "Workgroup"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB: Asignación */}
          <TabsContent value="assignment" className="space-y-6">
            <Card className="border-indigo-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <CardTitle className="flex items-center gap-2 text-indigo-900">
                  <User className="w-5 h-5" />
                  Estado de Asignación
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {station.estado_asignacion === 'ASIGNADO' && station.usuario_asignado ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-green-800">Equipo Asignado</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Usuario Asignado</label>
                        <p className="font-semibold text-lg">{station.usuario_asignado_nombre || station.usuario_asignado}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">RUT</label>
                        <p className="font-mono text-sm">{station.usuario_asignado}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Fecha de Asignación</label>
                        <p className="text-sm">
                          {station.fecha_asignacion 
                            ? new Date(station.fecha_asignacion).toLocaleDateString('es-CL', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })
                            : "No disponible"
                          }
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Duración</label>
                        <p className="text-sm">
                          {station.fecha_asignacion 
                            ? Math.floor((new Date().getTime() - new Date(station.fecha_asignacion).getTime()) / (1000 * 3600 * 24)) + " días"
                            : "No disponible"
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="font-medium text-blue-800">Equipo Disponible</span>
                    </div>
                    <p className="text-gray-600">
                      Esta estación Z8 está disponible para ser asignada a un usuario.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}