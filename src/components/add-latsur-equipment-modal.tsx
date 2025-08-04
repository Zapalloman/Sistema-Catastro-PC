"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Plus, Loader2 } from "lucide-react"

interface AddLatsurEquipmentModalProps {
  open: boolean
  onClose: () => void
  onEquipmentAdded: () => void
}

export function AddLatsurEquipmentModal({ open, onClose, onEquipmentAdded }: AddLatsurEquipmentModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    llave_inventario: '',
    nombre_pc: '',
    cod_ti_marca: '',
    modelo: '',
    numero_serie: '',
    almacenamiento: '',
    ram: '',
    procesador: '',
    observaciones: ''
  })

  const marcas = [
    { value: 1, label: 'DELL' },
    { value: 2, label: 'HP' },
    { value: 3, label: 'LENOVO' },
    { value: 4, label: 'ASUS' },
    { value: 5, label: 'ACER' },
    { value: 6, label: 'APPLE' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('http://localhost:3000/api/equipos-latsur', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          cod_ti_marca: parseInt(formData.cod_ti_marca) || 2, // Default HP
          activo: true
        }),
      })

      if (response.ok) {
        console.log('✅ Equipo LATSUR creado exitosamente')
        onEquipmentAdded()
        onClose()
        setFormData({
          llave_inventario: '',
          nombre_pc: '',
          cod_ti_marca: '',
          modelo: '',
          numero_serie: '',
          almacenamiento: '',
          ram: '',
          procesador: '',
          observaciones: ''
        })
      } else {
        console.error('❌ Error creando equipo LATSUR')
        alert('Error al crear el equipo LATSUR')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Agregar Nuevo Equipo LATSUR
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200">
            <h3 className="font-semibold text-orange-900 mb-4">Información Básica</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="llave_inventario" className="text-sm font-medium">
                  Llave de Inventario *
                </Label>
                <Input
                  id="llave_inventario"
                  value={formData.llave_inventario}
                  onChange={(e) => handleInputChange('llave_inventario', e.target.value)}
                  placeholder="LATSUR-INV-001"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="nombre_pc" className="text-sm font-medium">
                  Nombre del PC *
                </Label>
                <Input
                  id="nombre_pc"
                  value={formData.nombre_pc}
                  onChange={(e) => handleInputChange('nombre_pc', e.target.value)}
                  placeholder="PC-LATSUR-001"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="numero_serie" className="text-sm font-medium">
                  Número de Serie *
                </Label>
                <Input
                  id="numero_serie"
                  value={formData.numero_serie}
                  onChange={(e) => handleInputChange('numero_serie', e.target.value)}
                  placeholder="LATSUR-2024-001"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="marca" className="text-sm font-medium">
                  Marca *
                </Label>
                <Select value={formData.cod_ti_marca} onValueChange={(value) => handleInputChange('cod_ti_marca', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Seleccionar marca" />
                  </SelectTrigger>
                  <SelectContent>
                    {marcas.map((marca) => (
                      <SelectItem key={marca.value} value={marca.value.toString()}>
                        {marca.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Especificaciones Hardware */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-900 mb-4">Especificaciones de Hardware</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="modelo" className="text-sm font-medium">
                  Modelo *
                </Label>
                <Input
                  id="modelo"
                  value={formData.modelo}
                  onChange={(e) => handleInputChange('modelo', e.target.value)}
                  placeholder="OptiPlex 3080"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="procesador" className="text-sm font-medium">
                  Procesador *
                </Label>
                <Input
                  id="procesador"
                  value={formData.procesador}
                  onChange={(e) => handleInputChange('procesador', e.target.value)}
                  placeholder="Intel Core i5-10500"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="ram" className="text-sm font-medium">
                  Memoria RAM *
                </Label>
                <Input
                  id="ram"
                  value={formData.ram}
                  onChange={(e) => handleInputChange('ram', e.target.value)}
                  placeholder="8GB DDR4"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="almacenamiento" className="text-sm font-medium">
                  Almacenamiento *
                </Label>
                <Input
                  id="almacenamiento"
                  value={formData.almacenamiento}
                  onChange={(e) => handleInputChange('almacenamiento', e.target.value)}
                  placeholder="256GB SSD"
                  required
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Observaciones */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-4">Información Adicional</h3>
            <div>
              <Label htmlFor="observaciones" className="text-sm font-medium">
                Observaciones
              </Label>
              <Textarea
                id="observaciones"
                value={formData.observaciones}
                onChange={(e) => handleInputChange('observaciones', e.target.value)}
                placeholder="Notas adicionales sobre el equipo..."
                rows={3}
                className="mt-1"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Equipo LATSUR
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
