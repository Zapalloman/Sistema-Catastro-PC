"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface Parameter {
  codigo: number
  descripcion: string
  estado: string
}

interface ParameterDetailModalProps {
  parameter: Parameter | null
  isOpen: boolean
  onClose: () => void
  columns: string[]
  relatedData: Record<string, any>[]
}

export function ParameterDetailModal({
  parameter,
  isOpen,
  onClose,
  columns,
  relatedData,
}: ParameterDetailModalProps) {
  if (!parameter) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Detalles del Parámetro
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Código</label>
            <p className="text-lg font-semibold">{parameter.codigo}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Descripción</label>
            <p className="text-base">{parameter.descripcion}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Estado</label>
            <div className="mt-1">
              <Badge variant={parameter.estado === "ACTIVO" ? "default" : "secondary"} className="bg-green-500">
                {parameter.estado}
              </Badge>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-2 block">Datos relacionados</label>
            <div className="overflow-x-auto rounded border">
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    {columns.map((col) => (
                      <th key={col} className="px-3 py-2 border-b font-semibold text-left bg-slate-100">
                        {col.charAt(0).toUpperCase() + col.slice(1)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {relatedData.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length} className="text-center py-4 text-gray-400">
                        Sin datos relacionados
                      </td>
                    </tr>
                  ) : (
                    relatedData.map((row, idx) => (
                      <tr key={idx}>
                        {columns.map((col) => (
                          <td key={col} className="px-3 py-2 border-b">
                            {row[col] ?? "-"}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
