"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, Monitor, HardDrive, Cpu, Zap, Wifi, Printer, Glasses, Mouse, Laptop } from "lucide-react"

interface LatsurEquipment {
  id: string
  tipo: string
  modelo: string
  serie: string
  marca: string
  estado: string
  ubicacion: string
  fechaInstalacion: string
  responsable: string
  especificaciones: Record<string, string>
  dispositivosRelacionados: RelatedDevice[]
}

interface RelatedDevice {
  id: string
  tipo: string
  modelo: string
  serie: string
  relacion: string
}

interface LatsurEquipmentModalProps {
  equipment: LatsurEquipment | null
  isOpen: boolean
  onClose: () => void
}

const getEquipmentIcon = (tipo: string) => {
  switch (tipo.toLowerCase()) {
    case "workstation":
      return <Monitor className="w-5 h-5" />
    case "impresora":
      return <Printer className="w-5 h-5" />
    case "ups":
      return <Zap className="w-5 h-5" />
    case "kvm":
      return <Wifi className="w-5 h-5" />
    case "monitor":
      return <Monitor className="w-5 h-5" />
    case "gafas 3d":
      return <Glasses className="w-5 h-5" />
    case "mouse 3d":
      return <Mouse className="w-5 h-5" />
    case "notebook":
      return <Laptop className="w-5 h-5" />
    case "disco externo":
      return <HardDrive className="w-5 h-5" />
    default:
      return <Cpu className="w-5 h-5" />
  }
}

export function LatsurEquipmentModal({ equipment, isOpen, onClose }: LatsurEquipmentModalProps) {
  if (!equipment) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getEquipmentIcon(equipment.tipo)}
              Detalles del Equipo LATSUR
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-3">Información General</h3>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Tipo de Equipo</label>
                    <p className="text-lg font-semibold flex items-center gap-2">
                      {getEquipmentIcon(equipment.tipo)}
                      {equipment.tipo}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Modelo</label>
                    <p className="text-base">{equipment.modelo}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Serie</label>
                    <p className="font-mono text-sm bg-white p-2 rounded border">{equipment.serie}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Estado</label>
                    <div className="mt-1">
                      <Badge
                        variant={equipment.estado === "OPERATIVO" ? "default" : "secondary"}
                        className={equipment.estado === "OPERATIVO" ? "bg-green-500" : "bg-orange-500"}
                      >
                        {equipment.estado}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-900 mb-3">Información de Asignación</h3>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Marca</label>
                    <p className="text-base">{equipment.marca}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Ubicación</label>
                    <p className="text-base">{equipment.ubicacion}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Fecha Instalación</label>
                    <p className="text-base">{equipment.fechaInstalacion}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Responsable</label>
                    <p className="text-base">{equipment.responsable}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-purple-900">
              <Cpu className="w-5 h-5" />
              Especificaciones Técnicas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(equipment.especificaciones).map(([key, value]) => (
                <div key={key} className="bg-white p-3 rounded border">
                  <label className="text-sm font-medium text-gray-600 capitalize">{key.replace("_", " ")}</label>
                  <p className="text-sm font-semibold">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Related Devices */}
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-lg border border-orange-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-orange-900">
              <Wifi className="w-5 h-5" />
              Dispositivos Relacionados ({equipment.dispositivosRelacionados.length})
            </h3>
            {equipment.dispositivosRelacionados.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No hay dispositivos relacionados</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {equipment.dispositivosRelacionados.map((device) => (
                  <div key={device.id} className="bg-white p-4 rounded-lg border shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getEquipmentIcon(device.tipo)}
                        <span className="font-semibold">{device.tipo}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {device.relacion}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>
                        <strong>Modelo:</strong> {device.modelo}
                      </p>
                      <p>
                        <strong>Serie:</strong> <span className="font-mono">{device.serie}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
