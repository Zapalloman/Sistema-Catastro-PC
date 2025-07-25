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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-xs text-gray-500">Serie</div>
              <div className="font-semibold">{equipment?.serie ?? "-"}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Nombre PC</div>
              <div className="font-semibold">{equipment?.nombrePC ?? "-"}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Estado de Préstamo</div>
              <div className="font-semibold">
                <Badge
                  variant="default"
                  className={
                    equipment?.estadoPrestamo === "DISPONIBLE" ? "bg-green-500 hover:bg-green-600" :
                    equipment?.estadoPrestamo === "ACTIVO" ? "bg-blue-500 hover:bg-blue-600" :
                    "bg-red-500 hover:bg-red-600"
                  }
                >
                  {equipment?.estadoPrestamo || "DISPONIBLE"}
                </Badge>
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Propietario</div>
              <div className="font-semibold">{equipment.propietario}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Estado</div>
              <div className="mt-1">
                <Badge variant={equipment.estado === "ACTIVO" ? "default" : "secondary"} className="bg-green-500">
                  {equipment.estado}
                </Badge>
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
                  <Monitor className="w-4 h-4 text-purple-600" />
                  <div>
                    <label className="text-sm font-medium text-gray-600">RAM</label>
                    <p className="text-sm">{equipment.ram}</p>
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
                  <Monitor className="w-4 h-4 text-blue-600" />
                  <div>
                    <label className="text-sm font-medium text-gray-600">Modelo</label>
                    <p className="text-sm">{equipment.modeloPC}</p>
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

          {/* Software Information - Solo si tiene datos */}
          {(equipment.version_sistema_operativo || equipment.version_office) && (
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Monitor className="w-5 h-5" />
                Información de Software
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {equipment.version_sistema_operativo && (
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-blue-600" />
                    <div>
                      <label className="text-sm font-medium text-gray-600">Sistema Operativo</label>
                      <p className="text-sm">{equipment.version_sistema_operativo}</p>
                    </div>
                  </div>
                )}
                {equipment.version_office && (
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-green-600" />
                    <div>
                      <label className="text-sm font-medium text-gray-600">Versión de Office</label>
                      <p className="text-sm">{equipment.version_office}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
