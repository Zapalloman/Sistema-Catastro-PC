"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Monitor, 
  Printer, 
  Laptop, 
  HardDrive,
  Calendar,
  Hash,
  Tag,
  Cpu,
  MemoryStick,
  Settings,
  FileText,
  User,
  X
} from "lucide-react"

interface LatsurEquipment {
  id_equipo: number
  llave_inventario: string
  nombre_pc: string
  modelo: string
  numero_serie: string
  almacenamiento: string
  ram: string
  procesador: string
  version_sistema_operativo: string
  version_office: string
  observaciones: string
  fecha_ingreso: Date
  marca: string
  categoria: string
  idcategoria: number
  cod_ti_marca: number
  activo: boolean
}

interface LatsurEquipmentModalProps {
  equipment: LatsurEquipment | null
  isOpen: boolean
  onClose: () => void
}

const getEquipmentIcon = (categoria: string) => {
  const categoriaLower = categoria.toLowerCase()
  if (categoriaLower.includes("workstation") || categoriaLower.includes("pc")) {
    return <Monitor className="w-5 h-5" />
  } else if (categoriaLower.includes("impresora")) {
    return <Printer className="w-5 h-5" />
  } else if (categoriaLower.includes("notebook") || categoriaLower.includes("laptop")) {
    return <Laptop className="w-5 h-5" />
  } else if (categoriaLower.includes("disco") || categoriaLower.includes("storage")) {
    return <HardDrive className="w-5 h-5" />
  } else {
    return <Cpu className="w-5 h-5" />
  }
}

const formatDate = (date: Date | string) => {
  if (!date) return "No especificada"
  const d = new Date(date)
  return d.toLocaleDateString('es-CL')
}

export function LatsurEquipmentModal({ equipment, isOpen, onClose }: LatsurEquipmentModalProps) {
  if (!equipment) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getEquipmentIcon(equipment.categoria)}
              Detalles del Equipo LATSUR
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información Básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Información General
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">ID Equipo</label>
                    <p className="text-lg font-semibold">{equipment.id_equipo}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Llave Inventario</label>
                    <p className="font-mono text-sm bg-white p-2 rounded border">{equipment.llave_inventario}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nombre PC</label>
                    <p className="text-base">{equipment.nombre_pc}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Categoría</label>
                    <div className="mt-1">
                      <Badge variant="outline" className="flex items-center gap-1 w-fit">
                        {getEquipmentIcon(equipment.categoria)}
                        {equipment.categoria}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Identificación
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Marca</label>
                    <p className="text-base">{equipment.marca}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Modelo</label>
                    <p className="text-base">{equipment.modelo}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Número de Serie</label>
                    <p className="font-mono text-sm bg-white p-2 rounded border">{equipment.numero_serie}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Estado</label>
                    <div className="mt-1">
                      <Badge
                        variant={equipment.activo ? "default" : "secondary"}
                        className={equipment.activo ? "bg-green-500" : "bg-red-500"}
                      >
                        {equipment.activo ? "ACTIVO" : "INACTIVO"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Especificaciones Técnicas */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-purple-900">
              <Cpu className="w-5 h-5" />
              Especificaciones Técnicas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white p-3 rounded border">
                <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                  <Cpu className="w-3 h-3" />
                  Procesador
                </label>
                <p className="text-sm font-semibold">{equipment.procesador || "No especificado"}</p>
              </div>
              <div className="bg-white p-3 rounded border">
                <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                  <MemoryStick className="w-3 h-3" />
                  RAM
                </label>
                <p className="text-sm font-semibold">{equipment.ram || "No especificado"}</p>
              </div>
              <div className="bg-white p-3 rounded border">
                <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                  <HardDrive className="w-3 h-3" />
                  Almacenamiento
                </label>
                <p className="text-sm font-semibold">{equipment.almacenamiento || "No especificado"}</p>
              </div>
              <div className="bg-white p-3 rounded border">
                <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                  <Settings className="w-3 h-3" />
                  Sistema Operativo
                </label>
                <p className="text-sm font-semibold">{equipment.version_sistema_operativo || "No especificado"}</p>
              </div>
              <div className="bg-white p-3 rounded border">
                <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  Office
                </label>
                <p className="text-sm font-semibold">{equipment.version_office || "No especificado"}</p>
              </div>
              <div className="bg-white p-3 rounded border">
                <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Fecha Ingreso
                </label>
                <p className="text-sm font-semibold">{formatDate(equipment.fecha_ingreso)}</p>
              </div>
            </div>
          </div>

          {/* Observaciones */}
          {equipment.observaciones && (
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-lg border border-orange-200">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-orange-900">
                <FileText className="w-5 h-5" />
                Observaciones
              </h3>
              <div className="bg-white p-4 rounded border">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{equipment.observaciones}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
