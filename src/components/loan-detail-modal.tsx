"use client"

import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { Select, SelectItem } from "@/components/ui/select"
import { Download } from "lucide-react";

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
            
            {/* Agregar botón para descargar documento */}
            <div className="md:col-span-2">
              <div className="text-xs text-gray-500 mb-2">Documento</div>
              <Button 
                onClick={() => {
                  const url = `http://localhost:3000/api/prestamos/${loan?.id_prestamo}/documento`;
                  window.open(url, '_blank');
                }}
                className="bg-blue-500 hover:bg-blue-600"
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar Salvoconducto
              </Button>
            </div>
            
            <div className="md:col-span-2">
              <div className="text-xs text-gray-500">Descripción</div>
              <div className="font-semibold">{loan?.descripcion ?? "-"}</div>
            </div>
          </div>

          {/* Lista de equipos en el préstamo */}
          {loan.equipos && loan.equipos.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-4">Equipos en el Préstamo</h3>
              <div className="space-y-3">
                {loan.equipos.map(eq => (
                  <div key={eq.id_equipo} className="border rounded-lg p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div>
                        <label className="text-xs font-medium text-gray-600">Nombre PC</label>
                        <p className="text-sm font-medium">{eq.nombre_pc || "-"}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600">Serie</label>
                        <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{eq.numero_serie || "-"}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600">Modelo</label>
                        <p className="text-sm">{eq.modelo || "-"}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600">Capacidad</label>
                        <p className="text-sm">{eq.almacenamiento || "-"}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
                      <div>
                        <label className="text-xs font-medium text-gray-600">Categoría</label>
                        <p className="text-sm">{eq.categoria?.desc_tipo || "-"}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600">Marca</label>
                        <p className="text-sm">{eq.marca?.des_ti_marca || eq.marca?.nombre || "-"}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600">Ubicación</label>
                        <p className="text-sm">{eq.ubicacion?.des_ti_ubicacion || eq.ubicacion?.nombre || "-"}</p>
                      </div>
                      {eq.ip && (
                        <div>
                          <label className="text-xs font-medium text-gray-600">IP</label>
                          <p className="text-sm font-mono bg-blue-50 px-2 py-1 rounded">{eq.ip}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}