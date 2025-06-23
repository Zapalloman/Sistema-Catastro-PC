"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, Monitor, HardDrive, Cpu } from "lucide-react"

interface EquipmentParameter {
  codigo: number
  descripcion: string
  estado: string
  tipo: string
  fechaCreacion: string
  ultimaModificacion: string
  usuario: string
  categoria: string
  observaciones: string
  equiposAsociados: string[]
}

interface EquipmentParameterDetailModalProps {
  parameter: EquipmentParameter | null
  isOpen: boolean
  onClose: () => void
}

export function EquipmentParameterDetailModal({ parameter, isOpen, onClose }: EquipmentParameterDetailModalProps) {
  if (!parameter) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              Detalles del Parámetro de Equipo
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
                <label className="text-sm font-medium text-gray-600">Código</label>
                <p className="text-lg font-semibold">{parameter.codigo}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Descripción</label>
                <p className="text-base">{parameter.descripcion}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Tipo de Parámetro</label>
                <p className="text-base font-medium text-green-700">{parameter.tipo}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Estado</label>
                <div className="mt-1">
                  <Badge variant={parameter.estado === "ACTIVO" ? "default" : "secondary"} className="bg-green-500">
                    {parameter.estado}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Categoría</label>
                <p className="text-base">{parameter.categoria}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Fecha Creación</label>
                <p className="text-base">{parameter.fechaCreacion}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Última Modificación</label>
                <p className="text-base">{parameter.ultimaModificacion}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Usuario</label>
                <p className="text-base">{parameter.usuario}</p>
              </div>
            </div>
          </div>

          {/* Observations */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-2 block">Observaciones</label>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">{parameter.observaciones}</p>
            </div>
          </div>

          {/* Associated Equipment */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-2 block flex items-center gap-2">
              <HardDrive className="w-4 h-4" />
              Equipos Asociados ({parameter.equiposAsociados.length})
            </label>
            <div className="bg-gray-50 rounded-lg border p-4">
              {parameter.equiposAsociados.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No hay equipos asociados a este parámetro</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {parameter.equiposAsociados.map((equipo, index) => (
                    <div key={index} className="bg-white p-3 rounded border flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-blue-600" />
                      <span className="font-mono text-sm">{equipo}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-900 mb-3">Información Técnica</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-green-800">Aplicación:</span>
                <p className="text-green-700">Gestión de inventario de equipos IGM</p>
              </div>
              <div>
                <span className="font-medium text-green-800">Compatibilidad:</span>
                <p className="text-green-700">Sistema de Catastro Computacional</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
