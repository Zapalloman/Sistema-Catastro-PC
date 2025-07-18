"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, Monitor, HardDrive, Cpu, Zap, Wifi } from "lucide-react"

interface Equipment {
  serie: string
  modeloPC: string
  disco: string
  ram: string
  procesador: string
  velocidad: string
  marca: string
  mac: string
  ip: string
  nombrePC: string
  propietario: string
  estado: string
  fechaAsignacion: string
  ubicacion: string
  categoria: string // Nuevo campo añadido
  fechaAdquisicion?: string // Campo opcional añadido
}

interface EquipmentDetailModalProps {
  equipment: Equipment | null
  isOpen: boolean
  onClose: () => void
}

export function EquipmentDetailModal({ equipment, isOpen, onClose }: EquipmentDetailModalProps) {
  if (!equipment) return null

  // Utilidad para formatear fechas
  function formatFecha(fecha?: string) {
    if (!fecha) return "-"
    // Si viene con hora, corta solo la fecha
    const soloFecha = fecha.split("T")[0]
    if (!soloFecha || soloFecha === "0001-01-01" || soloFecha === "1970-01-01") return "-"
    return soloFecha.split("-").reverse().join("-")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              Detalles del Equipo
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Nombre PC</label>
                <p className="text-lg font-semibold">{equipment.nombrePC}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Serie</label>
                <p className="font-mono text-sm bg-gray-100 p-2 rounded">{equipment.serie}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Propietario</label>
                <p className="text-base">{equipment.propietario}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Estado</label>
                <div className="mt-1">
                  <Badge variant={equipment.estado === "ACTIVO" ? "default" : "secondary"} className="bg-green-500">
                    {equipment.estado}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Modelo PC</label>
                <p className="text-base">{equipment.modeloPC}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Marca</label>
                <p className="text-base">{equipment.marca}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Fecha Asignación</label>
                <p className="text-base">{formatFecha(equipment.fechaAdquisicion)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Ubicación</label>
                <p className="text-base">{equipment.ubicacion}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Categoría</label>
                <p className="text-base">{equipment.categoria}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Llave de Inventario</label>
                <p className="text-base">{equipment.llave_inventario}</p>
              </div>
            </div>
          </div>

          {/* Hardware Specifications */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Cpu className="w-5 h-5" />
              Especificaciones de Hardware
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-blue-600" />
                  <div>
                    <label className="text-sm font-medium text-gray-600">Procesador</label>
                    <p className="text-sm">{equipment.procesador}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-600" />
                  <div>
                    <label className="text-sm font-medium text-gray-600">Velocidad</label>
                    <p className="text-sm">{equipment.velocidad}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-green-600" />
                  <div>
                    <label className="text-sm font-medium text-gray-600">Disco</label>
                    <p className="text-sm">{equipment.disco}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-purple-600" />
                  <div>
                    <label className="text-sm font-medium text-gray-600">RAM</label>
                    <p className="text-sm">{equipment.ram}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Network Information */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Wifi className="w-5 h-5" />
              Información de Red
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Dirección IP</label>
                <p className="font-mono text-sm bg-blue-50 p-2 rounded border">{equipment.ip}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Dirección MAC</label>
                <p className="font-mono text-sm bg-green-50 p-2 rounded border">{equipment.mac}</p>
              </div>
            </div>
          </div>

          {/* Fecha de Adquisición - Nuevo campo añadido */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              Información Adicional
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Fecha de Adquisición</label>
                <p className="text-base">{formatFecha(equipment.fechaAdquisicion)}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
