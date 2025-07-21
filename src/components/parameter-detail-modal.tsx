"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface Parameter {
  codigo: number
  descripcion: string
  tipo: string
}

interface ParameterDetailModalProps {
  parameter: Parameter | null
  isOpen: boolean
  onClose: () => void
  columns: string[]
  relatedData: Record<string, any>[]
  loading?: boolean
  parameterType: string
}

export function ParameterDetailModal({
  parameter,
  isOpen,
  onClose,
  columns,
  relatedData,
  loading = false,
  parameterType
}: ParameterDetailModalProps) {
  if (!parameter) return null

  const getColumnLabel = (col: string) => {
    const labels: Record<string, string> = {
      'rut': 'RUT',
      'nombre_completo': 'Nombre Completo',
      'cargo': 'Cargo',
      'equipo_nombre': 'Equipo',
      'equipo_serie': 'Serie',
      'equipo_modelo': 'Modelo',
      'nombre_pc': 'Nombre PC',
      'numero_serie': 'N° Serie',
      'modelo': 'Modelo',
      'ip': 'IP',
      'marca': 'Marca',
      'ubicacion': 'Ubicación',
      'usuario': 'Usuario'
    }
    return labels[col] || col.charAt(0).toUpperCase() + col.slice(1)
  }

  const getModalTitle = () => {
    switch (parameterType) {
      case 'CARGO':
        return 'Personas y Equipos Asociados'
      case 'PROPIETARIO':
        return 'Equipos del Propietario'
      default:
        return 'Equipos Asociados'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div>
              <span className="text-lg font-semibold">
                {getModalTitle()} - {parameter.descripcion}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="font-mono">
                  Código: {parameter.codigo}
                </Badge>
                <Badge variant="secondary">{parameter.tipo}</Badge>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Cargando datos relacionados...</p>
            </div>
          ) : (
            <>
              <div className="text-sm text-gray-600 mb-4">
                {relatedData.length} registro(s) encontrado(s)
              </div>
              
              <div className="overflow-x-auto rounded border">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      {columns.map((col) => (
                        <th key={col} className="px-3 py-2 border-b font-semibold text-left bg-slate-100">
                          {getColumnLabel(col)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {relatedData.length === 0 ? (
                      <tr>
                        <td colSpan={columns.length} className="text-center py-8 text-gray-400">
                          No hay datos relacionados
                        </td>
                      </tr>
                    ) : (
                      relatedData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
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
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
