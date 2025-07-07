"use client"

import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { Select, SelectItem } from "@/components/ui/select"

interface LoanDetailModalProps {
  loan: Record<string, any> | null
  isOpen: boolean
  onClose: () => void
  columns: string[]
}

export function LoanDetailModal({
  loan,
  isOpen,
  onClose,
}: LoanDetailModalProps) {
  if (!loan) return null

  const equipo = loan.equipo && Object.keys(loan.equipo).length > 0 ? loan.equipo : null
  const availableDevices = Array.isArray(loan.disponibles) ? loan.disponibles : []
  const [selectedDeviceId, setSelectedDeviceId] = React.useState<string | null>(null)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Detalles del Préstamo
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Nro. Recibo</label>
                <p className="text-lg font-semibold">{loan.nroRecibo}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Funcionario</label>
                <p className="text-base">{loan.funcionario}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Estado</label>
                <div className="mt-1">
                  <Badge variant={loan.estadoRecibo === "ACTIVO" ? "default" : "secondary"} className="bg-green-500">
                    {loan.estadoRecibo}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Fecha Préstamo</label>
                <p className="text-base">{loan.fechaRecibo}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Ubicación</label>
                <p className="text-base">{loan.ubicacion}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Descripción</label>
                <p className="text-base">{loan.descripcion}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Departamento</label>
                <p className="text-base">{loan.departamento}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Sección</label>
                <p className="text-base">{loan.seccion}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Grado</label>
                <p className="text-base">{loan.grado}</p>
              </div>
            </div>
          </div>

          {/* Información del equipo asociado */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-4">Equipo Asociado</h3>
            {equipo ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nombre Dispositivo</label>
                    <p className="text-base">{equipo.nombre_pc || equipo.nombre || "-"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Serie</label>
                    <p className="font-mono text-sm bg-gray-100 p-2 rounded">{equipo.numero_serie || "-"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Modelo</label>
                    <p className="text-base">{equipo.modelo || "-"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Categoría</label>
                    <p className="text-base">{equipo.categoria?.nombre || loan.dispositivo || "-"}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Capacidad</label>
                    <p className="text-base">{equipo.almacenamiento || loan.capacidad || "-"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Procesador</label>
                    <p className="text-base">{equipo.procesador || "-"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">RAM</label>
                    <p className="text-base">{equipo.ram || "-"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">MAC</label>
                    <p className="font-mono text-sm bg-green-50 p-2 rounded border">{equipo.direccion_mac || "-"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">IP</label>
                    <p className="font-mono text-sm bg-blue-50 p-2 rounded border">{equipo.ip || "-"}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-gray-500">No hay equipo asociado a este préstamo.</div>
            )}

            {/* Selección de dispositivo para préstamo */}
            <div className="mt-6">
              <label className="text-sm font-medium text-gray-600">Seleccionar Dispositivo</label>
              <Select value={selectedDeviceId} onValueChange={setSelectedDeviceId}>
                {availableDevices.map(device => (
                  <SelectItem key={device.id_equipo} value={device.id_equipo}>
                    {device.nombre_pc || device.nombre} ({device.categoria?.nombre || "-"})
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}