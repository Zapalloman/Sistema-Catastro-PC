"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, Server, Thermometer, Shield, Zap, Network, MapPin, Calendar, User } from "lucide-react"

interface DatacenterAsset {
  id: string
  marca: string
  modelo: string
  numeroSerie: string
  cantidad: number
  lugar: string
  categoria: string
  estado: string
  fechaInstalacion: string
  responsable: string
  especificaciones: Record<string, string>
  mantenimiento: {
    ultimoMantenimiento: string
    proximoMantenimiento: string
    tipoMantenimiento: string
  }
  ubicacionDetallada: {
    rack: string
    unidad: string
    sala: string
  }
}

interface DatacenterAssetModalProps {
  asset: DatacenterAsset | null
  isOpen: boolean
  onClose: () => void
}

//
const getCategoryIcon = (categoria: string) => {
  switch (categoria.toLowerCase()) {
    case "a.c.":
      return <Thermometer className="w-5 h-5" />
    case "servidores":
      return <Server className="w-5 h-5" />
    case "core central coms":
      return <Network className="w-5 h-5" />
    case "firewall":
      return <Shield className="w-5 h-5" />
    case "ups":
      return <Zap className="w-5 h-5" />
    default:
      return <Server className="w-5 h-5" />
  }
}

const getCategoryColor = (categoria: string) => {
  switch (categoria.toLowerCase()) {
    case "a.c.":
      return "from-cyan-50 to-blue-50 border-cyan-200"
    case "servidores":
      return "from-green-50 to-emerald-50 border-green-200"
    case "core central coms":
      return "from-purple-50 to-indigo-50 border-purple-200"
    case "firewall":
      return "from-red-50 to-orange-50 border-red-200"
    case "ups":
      return "from-yellow-50 to-amber-50 border-yellow-200"
    default:
      return "from-gray-50 to-slate-50 border-gray-200"
  }
}

export function DatacenterAssetModal({ asset, isOpen, onClose }: DatacenterAssetModalProps) {
  if (!asset) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getCategoryIcon(asset.categoria)}
              Detalles del Activo de Datacenter
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Asset Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className={`bg-gradient-to-r ${getCategoryColor(asset.categoria)} p-4 rounded-lg border`}>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  {getCategoryIcon(asset.categoria)}
                  Información del Activo
                </h3>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Marca</label>
                    <p className="text-base font-semibold">{asset.marca}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Modelo</label>
                    <p className="text-base">{asset.modelo}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Número de Serie</label>
                    <p className="font-mono text-sm bg-white p-2 rounded border">{asset.numeroSerie}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Cantidad</label>
                    <p className="text-lg font-bold text-blue-600">{asset.cantidad} unidades</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Ubicación y Estado
                </h3>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Lugar</label>
                    <p className="text-base">{asset.lugar}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Categoría</label>
                    <div className="mt-1">
                      <Badge variant="outline" className="bg-white">
                        {asset.categoria}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Estado</label>
                    <div className="mt-1">
                      <Badge
                        variant="default"
                        className={asset.estado === "OPERATIVO" ? "bg-green-500" : "bg-orange-500"}
                      >
                        {asset.estado}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Responsable</label>
                    <p className="text-base flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-600" />
                      {asset.responsable}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Location */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-green-900">
              <MapPin className="w-5 h-5" />
              Ubicación Detallada
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-3 rounded border">
                <label className="text-sm font-medium text-gray-600">Sala</label>
                <p className="text-sm font-semibold">{asset.ubicacionDetallada.sala}</p>
              </div>
              <div className="bg-white p-3 rounded border">
                <label className="text-sm font-medium text-gray-600">Rack</label>
                <p className="text-sm font-semibold">{asset.ubicacionDetallada.rack}</p>
              </div>
              <div className="bg-white p-3 rounded border">
                <label className="text-sm font-medium text-gray-600">Unidad</label>
                <p className="text-sm font-semibold">{asset.ubicacionDetallada.unidad}</p>
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-purple-900">
              <Server className="w-5 h-5" />
              Especificaciones Técnicas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(asset.especificaciones).map(([key, value]) => (
                <div key={key} className="bg-white p-3 rounded border">
                  <label className="text-sm font-medium text-gray-600 capitalize">{key.replace("_", " ")}</label>
                  <p className="text-sm font-semibold">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Maintenance Information */}
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-lg border border-orange-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-orange-900">
              <Calendar className="w-5 h-5" />
              Información de Mantenimiento
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Último Mantenimiento</label>
                <p className="text-sm">{asset.mantenimiento.ultimoMantenimiento}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Próximo Mantenimiento</label>
                <p className="text-sm">{asset.mantenimiento.proximoMantenimiento}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Tipo de Mantenimiento</label>
                <p className="text-sm">{asset.mantenimiento.tipoMantenimiento}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
