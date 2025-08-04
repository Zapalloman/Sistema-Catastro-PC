"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Server,
  Calendar,
  MapPin,
  FileText,
  Thermometer,
  Shield,
  Zap,
  Network,
  Monitor,
  Cpu,
  HardDrive,
  MemoryStick,
  X
} from "lucide-react"

interface DatacenterAssetModalProps {
  isOpen: boolean
  onClose: () => void
  asset: any
}

export function DatacenterAssetModal({ isOpen, onClose, asset }: DatacenterAssetModalProps) {
  if (!asset) return null

  // ✅ ICONOS POR CATEGORÍA
  const getCategoryIcon = (categoria: string) => {
    if (!categoria) return <Server className="w-6 h-6" />
    
    const cat = categoria.toLowerCase()
    if (cat.includes('servidor')) return <Server className="w-6 h-6 text-blue-500" />
    if (cat.includes('a.c.') || cat.includes('aire')) return <Thermometer className="w-6 h-6 text-green-500" />
    if (cat.includes('firewall')) return <Shield className="w-6 h-6 text-red-500" />
    if (cat.includes('ups')) return <Zap className="w-6 h-6 text-yellow-500" />
    if (cat.includes('core') || cat.includes('switch')) return <Network className="w-6 h-6 text-purple-500" />
    
    return <Server className="w-6 h-6 text-gray-500" />
  }

  const getCategoryColor = (categoria: string) => {
    if (!categoria) return "bg-gray-100 text-gray-700"
    
    const cat = categoria.toLowerCase()
    if (cat.includes('servidor')) return "bg-blue-100 text-blue-700"
    if (cat.includes('a.c.')) return "bg-green-100 text-green-700"
    if (cat.includes('firewall')) return "bg-red-100 text-red-700"
    if (cat.includes('ups')) return "bg-yellow-100 text-yellow-700"
    if (cat.includes('core')) return "bg-purple-100 text-purple-700"
    
    return "bg-gray-100 text-gray-700"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getCategoryIcon(asset.categoria)}
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  {asset.nombre_pc || asset.modelo || 'Activo de Datacenter'}
                </DialogTitle>
                <p className="text-sm text-gray-500 mt-1">
                  {asset.marca} {asset.modelo}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* ✅ INFORMACIÓN BÁSICA - SOLO CAMPOS REALES */}
          <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg p-6 border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              Información Básica
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">ID Equipo</label>
                <p className="text-sm text-gray-900 font-mono">{asset.id_equipo}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Llave Inventario</label>
                <p className="text-sm text-gray-900 font-mono">{asset.llave_inventario || 'No asignada'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Nombre PC</label>
                <p className="text-sm text-gray-900">{asset.nombre_pc || 'Sin nombre'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Número de Serie</label>
                <p className="text-sm text-gray-900 font-mono">{asset.numero_serie || 'No disponible'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Marca</label>
                <p className="text-sm text-gray-900">{asset.marca}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Modelo</label>
                <p className="text-sm text-gray-900">{asset.modelo || 'Sin modelo'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Categoría</label>
                <div className="flex items-center gap-2 mt-1">
                  {getCategoryIcon(asset.categoria)}
                  <Badge className={getCategoryColor(asset.categoria)}>
                    {asset.categoria}
                  </Badge>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Fecha Ingreso</label>
                <p className="text-sm text-gray-900 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {asset.fecha_ingreso ? new Date(asset.fecha_ingreso).toLocaleDateString() : 'No disponible'}
                </p>
              </div>
            </div>
          </div>

          {/* ✅ ESPECIFICACIONES TÉCNICAS - SOLO CAMPOS REALES */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-600" />
              Especificaciones Técnicas
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {asset.procesador && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Procesador</label>
                  <p className="text-sm text-gray-900 flex items-center gap-1">
                    <Cpu className="w-4 h-4" />
                    {asset.procesador}
                  </p>
                </div>
              )}
              
              {asset.ram && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Memoria RAM</label>
                  <p className="text-sm text-gray-900 flex items-center gap-1">
                    <MemoryStick className="w-4 h-4" />
                    {asset.ram}
                  </p>
                </div>
              )}
              
              {asset.almacenamiento && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Almacenamiento</label>
                  <p className="text-sm text-gray-900 flex items-center gap-1">
                    <HardDrive className="w-4 h-4" />
                    {asset.almacenamiento}
                  </p>
                </div>
              )}
              
              {asset.version_sistema_operativo && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Sistema Operativo</label>
                  <p className="text-sm text-gray-900">{asset.version_sistema_operativo}</p>
                </div>
              )}
              
              {asset.version_office && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Versión Office</label>
                  <p className="text-sm text-gray-900">{asset.version_office}</p>
                </div>
              )}
            </div>
          </div>

          {/* ✅ UBICACIÓN - SOLO UBICACIÓN CALCULADA (SIN RESPONSABLE) */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              Ubicación
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Ubicación</label>
                <p className="text-sm text-gray-900">{asset.lugar}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Estado</label>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  {asset.estado || 'OPERATIVO'}
                </Badge>
              </div>
            </div>
          </div>

          {/* ✅ OBSERVACIONES - SOLO SI EXISTE */}
          {asset.observaciones && (
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-6 border border-amber-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-600" />
                Observaciones
              </h3>
              
              <div className="bg-white rounded-lg p-4 border">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {asset.observaciones}
                </p>
              </div>
            </div>
          )}

          {/* ✅ INFORMACIÓN DEL SISTEMA */}
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Server className="w-5 h-5 text-gray-600" />
              Información del Sistema
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Estado Activo</label>
                <Badge variant="outline" className={asset.activo ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}>
                  {asset.activo ? 'ACTIVO' : 'INACTIVO'}
                </Badge>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">ID Categoría</label>
                <p className="text-sm text-gray-900 font-mono">{asset.id_categoria || 'No asignada'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ BOTONES DE ACCIÓN */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-gray-50 hover:bg-gray-100"
          >
            Cerrar
          </Button>
          <Button
            className="bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700"
            onClick={() => {
              console.log('Editar activo:', asset)
              // TODO: Implement edit functionality
            }}
          >
            Editar Activo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
