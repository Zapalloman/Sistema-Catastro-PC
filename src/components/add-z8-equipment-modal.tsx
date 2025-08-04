"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Plus, Loader2 } from "lucide-react"

interface AddZ8EquipmentModalProps {
  open: boolean
  onClose: () => void
  onEquipmentAdded: () => void
}

export function AddZ8EquipmentModal({ open, onClose, onEquipmentAdded }: AddZ8EquipmentModalProps) {
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
    ip: '',
    direccion_mac: '',
    cod_ti_red: '',
    cod_ti_dominio_red: '',
    observaciones: ''
  })

  // Estados para opciones con valores por defecto seguros
  const [marcas, setMarcas] = useState<Array<{cod_ti_marca: number, des_ti_marca: string}>>([])
  const [redes, setRedes] = useState<Array<{cod_ti_red: number, descripcion: string}>>([])
  const [dominios, setDominios] = useState<Array<{cod_ti_dominio_red: number, descripcion: string}>>([])
  const [loadingOptions, setLoadingOptions] = useState(false)

  // Cargar opciones al abrir modal
  useEffect(() => {
    if (open) {
      console.log('🔄 Cargando opciones para modal Z8...')
      setLoadingOptions(true)
      loadOptions()
    }
  }, [open])

  // ✅ CORREGIR LOS ENDPOINTS PARA USAR LAS TABLAS CORRECTAS
  const loadOptions = async () => {
    try {
      // ✅ CARGAR MARCAS (correcto)
      console.log('📦 Cargando marcas...')
      try {
        const marcasRes = await fetch("http://localhost:3000/api/equipos/marcas")
        if (marcasRes.ok) {
          const marcasData = await marcasRes.json()
          console.log('✅ Marcas cargadas:', marcasData?.length || 0)
          
          const marcasValidas = Array.isArray(marcasData) 
            ? marcasData.filter(marca => 
                marca && 
                typeof marca.cod_ti_marca !== 'undefined' && 
                marca.cod_ti_marca !== null &&
                typeof marca.des_ti_marca === 'string'
              )
            : []
          
          setMarcas(marcasValidas)
          console.log(`✅ ${marcasValidas.length} marcas válidas cargadas`)
        } else {
          console.warn('⚠️ Error cargando marcas, usando valores por defecto')
          setMarcas([
            { cod_ti_marca: 1, des_ti_marca: 'DELL' },
            { cod_ti_marca: 2, des_ti_marca: 'HP' },
            { cod_ti_marca: 3, des_ti_marca: 'LENOVO' }
          ])
        }
      } catch (error) {
        console.error('❌ Error cargando marcas:', error)
        setMarcas([
          { cod_ti_marca: 1, des_ti_marca: 'DELL' },
          { cod_ti_marca: 2, des_ti_marca: 'HP' },
          { cod_ti_marca: 3, des_ti_marca: 'LENOVO' }
        ])
      }

      // ✅ CARGAR REDES DESDE TABLA TI_RED
      console.log('🌐 Cargando redes desde TI_RED...')
      try {
        const redesRes = await fetch("http://localhost:3000/api/redes") // ✅ ENDPOINT CORRECTO
        if (redesRes.ok) {
          const redesData = await redesRes.json()
          console.log('✅ Redes TI_RED cargadas:', redesData?.length || 0)
          
          // ✅ VALIDAR ESTRUCTURA DE TI_RED
          const redesValidas = Array.isArray(redesData) 
            ? redesData.filter(red => 
                red && 
                typeof red.cod_ti_red !== 'undefined' && 
                red.cod_ti_red !== null &&
                typeof red.des_ti_red === 'string' // ✅ CAMPO CORRECTO: des_ti_red
              )
            : []
          
          // ✅ MAPEAR A LA ESTRUCTURA ESPERADA
          const redesMapeadas = redesValidas.map(red => ({
            cod_ti_red: red.cod_ti_red,
            descripcion: red.des_ti_red // ✅ MAPEAR des_ti_red → descripcion
          }))
          
          setRedes(redesMapeadas)
          console.log(`✅ ${redesMapeadas.length} redes TI_RED válidas cargadas`)
        } else {
          console.warn('⚠️ Error cargando redes TI_RED, usando valores por defecto')
          setRedes([
            { cod_ti_red: 1, descripcion: 'Red Corporativa' },
            { cod_ti_red: 2, descripcion: 'Red WiFi' }
          ])
        }
      } catch (error) {
        console.error('❌ Error cargando redes TI_RED:', error)
        setRedes([
          { cod_ti_red: 1, descripcion: 'Red Corporativa' },
          { cod_ti_red: 2, descripcion: 'Red WiFi' }
        ])
      }

      // ✅ CARGAR DOMINIOS DESDE TABLA TI_DOMINIO
      console.log('🏢 Cargando dominios desde TI_DOMINIO...')
      try {
        const dominiosRes = await fetch("http://localhost:3000/api/dominios") // ✅ ENDPOINT CORRECTO
        if (dominiosRes.ok) {
          const dominiosData = await dominiosRes.json()
          console.log('✅ Dominios TI_DOMINIO cargados:', dominiosData?.length || 0)
          
          // ✅ VALIDAR ESTRUCTURA DE TI_DOMINIO
          const dominiosValidos = Array.isArray(dominiosData) 
            ? dominiosData.filter(dominio => 
                dominio && 
                typeof dominio.cod_ti_dominio !== 'undefined' && 
                dominio.cod_ti_dominio !== null &&
                typeof dominio.des_ti_dominio === 'string' // ✅ CAMPO CORRECTO: des_ti_dominio
              )
            : []
          
          // ✅ MAPEAR A LA ESTRUCTURA ESPERADA
          const dominiosMapeados = dominiosValidos.map(dominio => ({
            cod_ti_dominio_red: dominio.cod_ti_dominio, // ✅ MAPEAR cod_ti_dominio → cod_ti_dominio_red
            descripcion: dominio.des_ti_dominio // ✅ MAPEAR des_ti_dominio → descripcion
          }))
          
          setDominios(dominiosMapeados)
          console.log(`✅ ${dominiosMapeados.length} dominios TI_DOMINIO válidos cargados`)
        } else {
          console.warn('⚠️ Error cargando dominios TI_DOMINIO, usando valores por defecto')
          setDominios([
            { cod_ti_dominio_red: 1, descripcion: 'IGM.LOCAL' },
            { cod_ti_dominio_red: 2, descripcion: 'WORKGROUP' }
          ])
        }
      } catch (error) {
        console.error('❌ Error cargando dominios TI_DOMINIO:', error)
        setDominios([
          { cod_ti_dominio_red: 1, descripcion: 'IGM.LOCAL' },
          { cod_ti_dominio_red: 2, descripcion: 'WORKGROUP' }
        ])
      }

    } catch (error) {
      console.error('❌ Error general cargando opciones:', error)
    } finally {
      setLoadingOptions(false)
      console.log('✅ Carga de opciones completada')
    }
  }

  // ✅ ACTUALIZAR VALIDACIÓN PARA QUE NO REQUIERA LLAVE
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // ✅ VALIDAR SOLO CAMPOS REALMENTE OBLIGATORIOS
    if (!formData.nombre_pc || !formData.numero_serie || !formData.modelo || !formData.procesador || !formData.ram || !formData.almacenamiento) {
      alert('Por favor complete todos los campos obligatorios marcados con *')
      return
    }
    
    setLoading(true)

    try {
      const response = await fetch('http://localhost:3000/api/equipos-z8', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          // ✅ ENVIAR LLAVE COMO NULL SI ESTÁ VACÍA
          llave_inventario: formData.llave_inventario.trim() || null,
          cod_ti_marca: parseInt(formData.cod_ti_marca) || 2, // Default HP
          cod_ti_red: formData.cod_ti_red ? parseInt(formData.cod_ti_red) : null,
          cod_ti_dominio_red: formData.cod_ti_dominio_red ? parseInt(formData.cod_ti_dominio_red) : null,
          activo: true
        }),
      })

      if (response.ok) {
        console.log('✅ Estación Z8 creada exitosamente')
        onEquipmentAdded()
        onClose()
        // Limpiar formulario
        setFormData({
          llave_inventario: '',
          nombre_pc: '',
          cod_ti_marca: '',
          modelo: '',
          numero_serie: '',
          almacenamiento: '',
          ram: '',
          procesador: '',
          ip: '',
          direccion_mac: '',
          cod_ti_red: '',
          cod_ti_dominio_red: '',
          observaciones: ''
        })
      } else {
        const errorData = await response.text()
        console.error('❌ Error creando estación Z8:', errorData)
        alert('Error al crear la estación Z8: ' + errorData)
      }
    } catch (error) {
      console.error('❌ Error de conexión:', error)
      alert('Error de conexión al servidor')
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Agregar Nueva Estación Z8
          </DialogTitle>
        </DialogHeader>

        {/* Mostrar loading mientras cargan las opciones */}
        {loadingOptions ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin mr-3" />
            <span>Cargando opciones...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Básica */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-900 mb-4">Información Básica</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> {/* ✅ CAMBIAR A 3 COLUMNAS */}
                <div>
                  <Label htmlFor="llave_inventario" className="text-sm font-medium">
                    Llave de Inventario
                  </Label>
                  <Input
                    id="llave_inventario"
                    value={formData.llave_inventario}
                    onChange={(e) => handleInputChange('llave_inventario', e.target.value)}
                    placeholder="Z8-INV-001 (opcional)"
                    required={false}
                    className="mt-1"
                  />
                  <span className="text-xs text-gray-500">Opcional para equipos Z8</span>
                </div>
                <div>
                  <Label htmlFor="nombre_pc" className="text-sm font-medium">
                    Nombre del PC *
                  </Label>
                  <Input
                    id="nombre_pc"
                    value={formData.nombre_pc}
                    onChange={(e) => handleInputChange('nombre_pc', e.target.value)}
                    placeholder="Z8-GEODESIA-01"
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
                    placeholder="Z8-2024-001"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="marca" className="text-sm font-medium">
                    Marca *
                  </Label>
                  <Select 
                    value={formData.cod_ti_marca} 
                    onValueChange={(value) => handleInputChange('cod_ti_marca', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Seleccionar marca" />
                    </SelectTrigger>
                    <SelectContent>
                      {marcas && marcas.length > 0 ? (
                        marcas.map((marca) => {
                          if (!marca || typeof marca.cod_ti_marca === 'undefined' || !marca.des_ti_marca) {
                            return null
                          }
                          return (
                            <SelectItem 
                              key={`marca-${marca.cod_ti_marca}`} 
                              value={marca.cod_ti_marca.toString()}
                            >
                              {marca.des_ti_marca}
                            </SelectItem>
                          )
                        }).filter(Boolean)
                      ) : (
                        <SelectItem value="2">HP (por defecto)</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="modelo" className="text-sm font-medium">
                    Modelo *
                  </Label>
                  <Input
                    id="modelo"
                    value={formData.modelo}
                    onChange={(e) => handleInputChange('modelo', e.target.value)}
                    placeholder="Z8 G4 Workstation"
                    required
                    className="mt-1"
                  />
                </div>
                {/* ✅ AGREGAR UN CAMPO VACÍO PARA COMPLETAR EL GRID 3x2 */}
                <div></div>
              </div>
            </div>

            {/* Especificaciones Hardware */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-900 mb-4">Especificaciones de Hardware</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> {/* ✅ CAMBIAR A 3 COLUMNAS */}
                <div>
                  <Label htmlFor="procesador" className="text-sm font-medium">
                    Procesador *
                  </Label>
                  <Input
                    id="procesador"
                    value={formData.procesador}
                    onChange={(e) => handleInputChange('procesador', e.target.value)}
                    placeholder="Intel Xeon W-2255"
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
                    placeholder="32GB DDR4"
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
                    placeholder="1TB NVMe SSD"
                    required
                    className="mt-1"
                  />
                </div>
                {/* ✅ ELIMINAR COMPLETAMENTE EL CAMPO SISTEMA_OPERATIVO */}
              </div>
            </div>

            {/* Red y Conectividad */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-4">Red y Conectividad</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ip" className="text-sm font-medium">
                    Dirección IP
                  </Label>
                  <Input
                    id="ip"
                    value={formData.ip}
                    onChange={(e) => handleInputChange('ip', e.target.value)}
                    placeholder="192.168.1.100"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="direccion_mac" className="text-sm font-medium">
                    Dirección MAC
                  </Label>
                  <Input
                    id="direccion_mac"
                    value={formData.direccion_mac}
                    onChange={(e) => handleInputChange('direccion_mac', e.target.value)}
                    placeholder="00:1B:44:11:3A:B7"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="red" className="text-sm font-medium">
                    Red
                  </Label>
                  <Select 
                    value={formData.cod_ti_red} 
                    onValueChange={(value) => handleInputChange('cod_ti_red', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Seleccionar red" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* ✅ VALIDACIÓN ADICIONAL EN EL RENDER */}
                      {redes && redes.length > 0 ? (
                        redes.map((red) => {
                          // ✅ VALIDAR CADA ELEMENTO ANTES DE RENDERIZAR
                          if (!red || typeof red.cod_ti_red === 'undefined' || !red.descripcion) {
                            return null
                          }
                          return (
                            <SelectItem 
                              key={`red-${red.cod_ti_red}`} 
                              value={red.cod_ti_red.toString()}
                            >
                              {red.descripcion}
                            </SelectItem>
                          )
                        }).filter(Boolean) // Filtrar elementos null
                      ) : (
                        <SelectItem value="1">Red Corporativa (por defecto)</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dominio" className="text-sm font-medium">
                    Dominio de Red
                  </Label>
                  <Select 
                    value={formData.cod_ti_dominio_red} 
                    onValueChange={(value) => handleInputChange('cod_ti_dominio_red', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Seleccionar dominio" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* ✅ VALIDACIÓN ADICIONAL EN EL RENDER */}
                      {dominios && dominios.length > 0 ? (
                        dominios.map((dominio) => {
                          // ✅ VALIDAR CADA ELEMENTO ANTES DE RENDERIZAR
                          if (!dominio || typeof dominio.cod_ti_dominio_red === 'undefined' || !dominio.descripcion) {
                            return null
                          }
                          return (
                            <SelectItem 
                              key={`dominio-${dominio.cod_ti_dominio_red}`} 
                              value={dominio.cod_ti_dominio_red.toString()}
                            >
                              {dominio.descripcion}
                            </SelectItem>
                          )
                        }).filter(Boolean) // Filtrar elementos null
                      ) : (
                        <SelectItem value="1">IGM.LOCAL (por defecto)</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Observaciones */}
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Información Adicional</h3>
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
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creando...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Estación Z8
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}