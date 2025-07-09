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

  const estadoTexto = {
    1: "ACTIVO",
    0: "DISPONIBLE",
    2: "NO APTO"
  } as Record<string | number, string>;

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-xs text-gray-500">Nro. Recibo</div>
              <div className="font-semibold">{loan?.id_prestamo ?? "-"}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Funcionario</div>
              <div className="font-semibold">{loan?.rut_revisor ?? loan?.rut_usuario ?? "-"}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Estado</div>
              <div className="font-semibold">
                {estadoTexto[loan?.estado] ?? loan?.estado ?? "-"}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Fecha Préstamo</div>
              <div className="font-semibold">{loan?.fecha_prestamo ? loan.fecha_prestamo.slice(0, 10) : "-"}</div>
            </div>
            <div className="md:col-span-2">
              <div className="text-xs text-gray-500">Descripción</div>
              <div className="font-semibold">{loan?.descripcion ?? "-"}</div>
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

          {/* Lista de equipos en el préstamo (nuevo) */}
          {loan.equipos && loan.equipos.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-4">Equipos en el Préstamo</h3>
              <ul className="list-disc list-inside space-y-2">
                {loan.equipos.map(eq => (
                  <li key={eq.id_equipo} className="text-base">
                    {eq.nombre_pc || eq.modelo} - Serie: {eq.numero_serie} - Capacidad: {eq.almacenamiento}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}