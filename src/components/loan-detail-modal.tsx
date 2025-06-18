"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

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
  columns,
}: LoanDetailModalProps) {
  if (!loan) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-4xl min-w-fit overflow-x-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Detalles del Préstamo
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
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
            <label className="text-sm font-medium text-gray-600 mb-2 block">Datos del préstamo</label>
            <div className="overflow-x-auto w-full">
              <table className="w-full min-w-[900px] text-sm">
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
                  <tr>
                    {columns.map((col) => (
                      <td key={col} className="px-3 py-2 border-b">
                        {loan[col] ?? "-"}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}