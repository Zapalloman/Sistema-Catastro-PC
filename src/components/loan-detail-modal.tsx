"use client"

import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Download } from "lucide-react"

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

  console.log("Datos completos del préstamo en modal:", loan); // Debug

  const estadoTexto = {
    "1": "ACTIVO",
    "0": "FINALIZADO", 
    "2": "NO APTO",
    1: "ACTIVO",
    0: "FINALIZADO",
    2: "NO APTO"
  } as Record<string | number, string>;

  // Los datos reales están en loan.raw - esto viene del mapeo en loans-table.tsx
  const prestamoData = loan.raw || loan;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Detalles del Préstamo #{prestamoData?.id_prestamo || loan?.nroRecibo || "-"}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-xs text-gray-500">Nro. Préstamo</div>
              <div className="font-semibold">{prestamoData?.id_prestamo || loan?.nroRecibo || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">RUT Revisor</div>
              <div className="font-semibold">{prestamoData?.rut_revisor || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Estado</div>
              <div className="font-semibold">
                <Badge 
                  variant="default" 
                  className={prestamoData?.estado === "1" || prestamoData?.estado === 1 ? "bg-green-500" : "bg-gray-500"}
                >
                  {estadoTexto[prestamoData?.estado] || loan?.estadoRecibo || "-"}
                </Badge>
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Fecha Préstamo</div>
              <div className="font-semibold">{prestamoData?.fecha_prestamo ? prestamoData.fecha_prestamo.slice(0, 10) : loan?.fechaRecibo || "-"}</div>
            </div>
            
            <div>
              <div className="text-xs text-gray-500">RUT Entrega</div>
              <div className="font-semibold">{prestamoData?.rut_entrega || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">RUT Responsable</div>
              <div className="font-semibold">{prestamoData?.rut_responsable || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Cargo Préstamo</div>
              <div className="font-semibold">{prestamoData?.cargo_prestamo || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Fecha Devolución</div>
              <div className="font-semibold">{prestamoData?.fecha_devolucion ? prestamoData.fecha_devolucion.slice(0, 10) : "-"}</div>
            </div>
            
            {/* Botón para descargar documento */}
            <div className="md:col-span-2">
              <div className="text-xs text-gray-500 mb-2">Documento</div>
              <Button 
                onClick={() => {
                  const prestamoId = prestamoData?.id_prestamo || loan?.nroRecibo;
                  if (prestamoId) {
                    const url = `http://localhost:3000/api/prestamos/${prestamoId}/documento`;
                    window.open(url, '_blank');
                  }
                }}
                className="bg-blue-500 hover:bg-blue-600"
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar Salvoconducto
              </Button>
            </div>
            
            <div className="md:col-span-2">
              <div className="text-xs text-gray-500">Descripción/Motivo</div>
              <div className="font-semibold">{prestamoData?.descripcion || loan?.descripcion || "-"}</div>
            </div>
          </div>

          {/* Información de Firmas */}
          {(prestamoData?.firma1_nombre || prestamoData?.firma2_nombre) && (
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-4">Información de Firmas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {prestamoData?.firma1_nombre && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Firma 1</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Nombre:</strong> {prestamoData.firma1_nombre}</div>
                      {prestamoData.firma1_cargo_militar && <div><strong>Cargo Militar:</strong> {prestamoData.firma1_cargo_militar}</div>}
                      {prestamoData.firma1_cargo_departamento && <div><strong>Departamento:</strong> {prestamoData.firma1_cargo_departamento}</div>}
                      {prestamoData.firma1_subrogante && <div><strong>Subrogante:</strong> Sí</div>}
                    </div>
                  </div>
                )}
                {prestamoData?.firma2_nombre && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Firma 2</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Nombre:</strong> {prestamoData.firma2_nombre}</div>
                      {prestamoData.firma2_cargo_militar && <div><strong>Cargo Militar:</strong> {prestamoData.firma2_cargo_militar}</div>}
                      {prestamoData.firma2_cargo_departamento && <div><strong>Departamento:</strong> {prestamoData.firma2_cargo_departamento}</div>}
                      {prestamoData.firma2_subrogante && <div><strong>Subrogante:</strong> Sí</div>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Distribución */}
          {prestamoData?.distribucion && (
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-4">Distribución</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm">{prestamoData.distribucion}</pre>
              </div>
            </div>
          )}

          {/* Lista de equipos en el préstamo */}
          {prestamoData?.equipos && prestamoData.equipos.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-4">Equipos en el Préstamo ({prestamoData.equipos.length})</h3>
              <div className="space-y-3">
                {prestamoData.equipos.map((eq, index) => (
                  <div key={eq.id_equipo || index} className="border rounded-lg p-4 bg-gray-50">
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
                      <div>
                        <label className="text-xs font-medium text-gray-600">IP</label>
                        <p className="text-sm">{eq.ip || "-"}</p>
                      </div>
                    </div>
                    {(eq.ram || eq.procesador || eq.version_sistema_operativo || eq.version_office) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-3 pt-3 border-t border-gray-200">
                        {eq.ram && (
                          <div>
                            <label className="text-xs font-medium text-gray-600">RAM</label>
                            <p className="text-sm">{eq.ram}</p>
                          </div>
                        )}
                        {eq.procesador && (
                          <div>
                            <label className="text-xs font-medium text-gray-600">Procesador</label>
                            <p className="text-sm">{eq.procesador}</p>
                          </div>
                        )}
                        {eq.version_sistema_operativo && (
                          <div>
                            <label className="text-xs font-medium text-gray-600">Sistema Operativo</label>
                            <p className="text-sm">{eq.version_sistema_operativo}</p>
                          </div>
                        )}
                        {eq.version_office && (
                          <div>
                            <label className="text-xs font-medium text-gray-600">Office</label>
                            <p className="text-sm">{eq.version_office}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Si no hay equipos, mostrar mensaje */}
          {(!prestamoData?.equipos || prestamoData.equipos.length === 0) && (
            <div className="border-t pt-4">
              <div className="text-center py-8 text-gray-500">
                No se encontraron equipos asociados a este préstamo.
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}