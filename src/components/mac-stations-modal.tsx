"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, Monitor, HardDrive, Cpu, Network, User, MapPin, Apple } from "lucide-react"

interface MacStation {
  id: string
  serialNumber: string
  macAddress: string
  networkStatus: string
  owner: string
  deviceModel: string
  userName: string
  location: string
  lastConnection: string
  ipAddress: string
  deviceSpecs: {
    processor: string
    ram: string
    storage: string
    os: string
    graphics?: string
    display?: string
  }
  assignedDate: string
  networkType: string
}

interface MacStationModalProps {
  station: MacStation | null
  isOpen: boolean
  onClose: () => void
}

export function MacStationModal({ station, isOpen, onClose }: MacStationModalProps) {
  if (!station) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Apple className="w-5 h-5 text-gray-800" />
              Detalles de Estación MAC
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Station Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Apple className="w-4 h-4" />
                  Información de Estación MAC
                </h3>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Número de Serie</label>
                    <p className="font-mono text-sm bg-white p-2 rounded border">{station.serialNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Modelo del Dispositivo</label>
                    <p className="text-base font-semibold">{station.deviceModel}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Propietario</label>
                    <p className="text-base">{station.owner}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Usuario Asignado</label>
                    <p className="text-base flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-600" />
                      {station.userName}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Network className="w-4 h-4" />
                  Información de Red
                </h3>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Dirección MAC</label>
                    <p className="font-mono text-sm bg-white p-2 rounded border">{station.macAddress}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Estado de Conexión</label>
                    <div className="mt-1">
                      <Badge
                        variant="default"
                        className={station.networkStatus === "ACTIVA" ? "bg-green-500" : "bg-red-500"}
                      >
                        {station.networkStatus}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Dirección IP</label>
                    <p className="font-mono text-xs bg-white p-2 rounded border">{station.ipAddress}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Tipo de Red</label>
                    <p className="text-sm">{station.networkType}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Device Specifications */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-green-900">
              <Monitor className="w-5 h-5" />
              Especificaciones del Dispositivo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white p-3 rounded border">
                <div className="flex items-center gap-2 mb-1">
                  <Cpu className="w-4 h-4 text-blue-600" />
                  <label className="text-sm font-medium text-gray-600">Procesador</label>
                </div>
                <p className="text-sm font-semibold">{station.deviceSpecs.processor}</p>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="flex items-center gap-2 mb-1">
                  <Monitor className="w-4 h-4 text-purple-600" />
                  <label className="text-sm font-medium text-gray-600">Memoria RAM</label>
                </div>
                <p className="text-sm font-semibold">{station.deviceSpecs.ram}</p>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="flex items-center gap-2 mb-1">
                  <HardDrive className="w-4 h-4 text-green-600" />
                  <label className="text-sm font-medium text-gray-600">Almacenamiento</label>
                </div>
                <p className="text-sm font-semibold">{station.deviceSpecs.storage}</p>
              </div>
              <div className="bg-white p-3 rounded border">
                <label className="text-sm font-medium text-gray-600">Sistema Operativo</label>
                <p className="text-sm font-semibold">{station.deviceSpecs.os}</p>
              </div>
              {station.deviceSpecs.graphics && (
                <div className="bg-white p-3 rounded border">
                  <label className="text-sm font-medium text-gray-600">Tarjeta Gráfica</label>
                  <p className="text-sm font-semibold">{station.deviceSpecs.graphics}</p>
                </div>
              )}
              {station.deviceSpecs.display && (
                <div className="bg-white p-3 rounded border">
                  <label className="text-sm font-medium text-gray-600">Pantalla</label>
                  <p className="text-sm font-semibold">{station.deviceSpecs.display}</p>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-lg border border-orange-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-orange-900">
              <MapPin className="w-5 h-5" />
              Información Adicional
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Ubicación</label>
                <p className="text-sm">{station.location}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Fecha de Asignación</label>
                <p className="text-sm">{station.assignedDate}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Última Conexión</label>
                <p className="text-sm">{station.lastConnection}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
