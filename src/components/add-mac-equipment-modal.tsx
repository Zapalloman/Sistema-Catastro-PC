"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Apple, Loader2, Building, Network, MonitorSpeaker } from "lucide-react"

interface AddMacEquipmentModalProps {
  open: boolean
  onClose: () => void
  onEquipmentAdded: () => void
}

export function AddMacEquipmentModal({ open, onClose, onEquipmentAdded }: AddMacEquipmentModalProps) {
  // ✅ ESTADO DEL FORMULARIO PARA MAC
  const [formData, setFormData] = useState({
    llave_inventario: '',
    nombre_pc: '',
    cod_ti_marca: '',
    modelo: '',
    numero_serie: '',
    almacenamiento: '',
    ram: '',
    procesador: '',
    observaciones: '',
    cod_ti_ubicacion: '',
    cod_ti_red: '',
    cod_ti_dominio: ''
  })

  // ✅ ESTADOS PARA LAS OPCIONES DE SELECTS
  const [marcas, setMarcas] = useState<any[]>([])
  const [ubicaciones, setUbicaciones] = useState<any[]>([])
  const [redes, setRedes] = useState<any[]>([])
  const [dominios, setDominios] = useState<any[]>([])
  
  const [loading, setLoading] = useState(false)
  const [loadingOptions, setLoadingOptions] = useState(false)

  // ✅ CARGAR OPCIONES AL ABRIR MODAL
  useEffect(() => {
    if (open) {
      console.log('🔄 Cargando opciones para modal MAC...')
      setLoadingOptions(true)
      loadOptions()
    }
  }, [open])

  const loadOptions = async () => {
    try {
      // ✅ CARGAR MARCAS
      console.log('📦 Cargando marcas...')
      try {
        const marcasRes = await fetch("http://localhost:3000/api/equipos/marcas")
        if (marcasRes.ok) {
          const marcasData = await marcasRes.json()
          console.log('✅ Marcas cargadas:', marcasData?.length || 0)
          if (Array.isArray(marcasData) && marcasData.length > 0) {
            const marcasValid = marcasData.filter(m => m && m.cod_ti_marca !== undefined && m.des_ti_marca)
            setMarcas(marcasValid)
          } else {
            setMarcas([])
          }
        } else {
          setMarcas([])
        }
      } catch (error) {
        console.error('❌ Error cargando marcas:', error)
        setMarcas([])
      }

      // ✅ CARGAR UBICACIONES
      console.log('📍 Cargando ubicaciones...')
      try {
        const ubicacionesRes = await fetch("http://localhost:3000/api/equipos/ubicaciones")
        if (ubicacionesRes.ok) {
          const ubicacionesData = await ubicacionesRes.json()
          console.log('✅ Ubicaciones cargadas:', ubicacionesData?.length || 0)
          if (Array.isArray(ubicacionesData) && ubicacionesData.length > 0) {
            const ubicacionesValid = ubicacionesData.filter(u => u && u.cod_ti_ubicacion !== undefined && u.des_ti_ubicacion)
            setUbicaciones(ubicacionesValid)
          } else {
            setUbicaciones([])
          }
        } else {
          setUbicaciones([])
        }
      } catch (error) {
        console.error('❌ Error cargando ubicaciones:', error)
        setUbicaciones([])
      }

      // ✅ CARGAR REDES DESDE TI_RED
      console.log('🌐 Cargando redes desde TI_RED...')
      try {
        const redesRes = await fetch("http://localhost:3000/api/redes")
        if (redesRes.ok) {
          const redesData = await redesRes.json()
          console.log('✅ Redes TI_RED cargadas:', redesData?.length || 0)
          
          if (Array.isArray(redesData) && redesData.length > 0) {
            const redesValidas = redesData.filter(red => 
              red && 
              typeof red.cod_ti_red !== 'undefined' && 
              red.cod_ti_red !== null &&
              typeof red.des_ti_red === 'string'
            )
            
            const redesMapeadas = redesValidas.map(red => ({
              cod_ti_red: red.cod_ti_red,
              descripcion: red.des_ti_red
            }))
            
            setRedes(redesMapeadas)
          } else {
            setRedes([
              { cod_ti_red: 1, descripcion: 'Red Corporativa' },
              { cod_ti_red: 2, descripcion: 'Red WiFi' }
            ])
          }
        } else {
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

      // ✅ CARGAR DOMINIOS DESDE TI_DOMINIO
      console.log('🔗 Cargando dominios desde TI_DOMINIO...')
      try {
        const dominiosRes = await fetch("http://localhost:3000/api/dominios")
        if (dominiosRes.ok) {
          const dominiosData = await dominiosRes.json()
          console.log('✅ Dominios TI_DOMINIO cargados:', dominiosData?.length || 0)
          
          if (Array.isArray(dominiosData) && dominiosData.length > 0) {
            const dominiosValidos = dominiosData.filter(dominio => 
              dominio && 
              typeof dominio.cod_ti_dominio !== 'undefined' && 
              dominio.cod_ti_dominio !== null &&
              typeof dominio.des_ti_dominio === 'string'
            )
            
            const dominiosMapeados = dominiosValidos.map(dominio => ({
              cod_ti_dominio: dominio.cod_ti_dominio,
              descripcion: dominio.des_ti_dominio
            }))
            
            setDominios(dominiosMapeados)
          } else {
            setDominios([
              { cod_ti_dominio: 1, descripcion: 'MAC.LOCAL' },
              { cod_ti_dominio: 2, descripcion: 'WORKGROUP' }
            ])
          }
        } else {
          setDominios([
            { cod_ti_dominio: 1, descripcion: 'MAC.LOCAL' },
            { cod_ti_dominio: 2, descripcion: 'WORKGROUP' }
          ])
        }
      } catch (error) {
        console.error('❌ Error cargando dominios TI_DOMINIO:', error)
        setDominios([
          { cod_ti_dominio: 1, descripcion: 'MAC.LOCAL' },
          { cod_ti_dominio: 2, descripcion: 'WORKGROUP' }
        ])
      }

    } catch (error) {
      console.error('❌ Error general cargando opciones:', error)
    } finally {
      setLoadingOptions(false)
      console.log('✅ Carga de opciones completada para MAC')
    }
  }

  // ✅ MANEJAR CAMBIOS EN EL FORMULARIO
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // ✅ ENVIAR FORMULARIO
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // ✅ VALIDAR CAMPOS OBLIGATORIOS
    if (!formData.nombre_pc || !formData.numero_serie || !formData.modelo) {
      alert('Por favor complete todos los campos obligatorios marcados con *')
      return
    }

    setLoading(true)

    try {
      console.log('📤 Enviando datos del equipo MAC:', formData)
      
      const response = await fetch('http://localhost:3000/api/equipos-mac', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          // ✅ CONVERTIR A NÚMEROS O NULL SEGÚN CORRESPONDA
          cod_ti_marca: formData.cod_ti_marca ? parseInt(formData.cod_ti_marca) : null,
          cod_ti_ubicacion: formData.cod_ti_ubicacion ? parseInt(formData.cod_ti_ubicacion) : null,
          cod_ti_red: formData.cod_ti_red ? parseInt(formData.cod_ti_red) : null,
          cod_ti_dominio: formData.cod_ti_dominio ? parseInt(formData.cod_ti_dominio) : null,
          activo: true
        }),
      })

      console.log('📡 Respuesta del servidor:', response.status)
      
      if (response.ok) {
        const resultado = await response.json()
        console.log('✅ Equipo MAC creado exitosamente:', resultado)
        alert('✅ Equipo MAC creado exitosamente')
        onEquipmentAdded()
        onClose()
        // ✅ LIMPIAR FORMULARIO
        setFormData({
          llave_inventario: '',
          nombre_pc: '',
          cod_ti_marca: '',
          modelo: '',
          numero_serie: '',
          almacenamiento: '',
          ram: '',
          procesador: '',
          observaciones: '',
          cod_ti_ubicacion: '',
          cod_ti_red: '',
          cod_ti_dominio: ''
        })
      } else {
        const errorData = await response.text()
        console.error('❌ Error creando equipo MAC:', errorData)
        alert(`❌ Error al crear el equipo MAC: ${errorData}`)
      }
    } catch (error) {
      console.error('❌ Error de conexión:', error)
      alert('❌ Error de conexión. Verifica que el servidor esté funcionando.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-gray-600 to-slate-600 bg-clip-text text-transparent flex items-center gap-2">
            <Apple className="w-6 h-6 text-gray-600" />
            Agregar Equipo MAC
          </DialogTitle>
        </DialogHeader>

        {loadingOptions ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin w-6 h-6 border-2 border-gray-600 border-t-transparent rounded-full mr-3" />
            <span>Cargando opciones...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* ✅ INFORMACIÓN BÁSICA */}
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Apple className="w-5 h-5 text-gray-600" />
                Información Básica
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div>
                  <Label htmlFor="llave_inventario" className="text-sm font-medium">
                    Llave de Inventario
                  </Label>
                  <Input
                    id="llave_inventario"
                    value={formData.llave_inventario}
                    onChange={(e) => handleInputChange('llave_inventario', e.target.value)}
                    placeholder="MAC-001-2024"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="nombre_pc" className="text-sm font-medium">
                    Nombre PC *
                  </Label>
                  <Input
                    id="nombre_pc"
                    value={formData.nombre_pc}
                    onChange={(e) => handleInputChange('nombre_pc', e.target.value)}
                    placeholder="MACBOOK-PRO-01"
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
                    placeholder="MAC001-2024"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="marca" className="text-sm font-medium">
                    Marca
                  </Label>
                  <Select 
                    value={formData.cod_ti_marca} 
                    onValueChange={(value) => handleInputChange('cod_ti_marca', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Seleccionar marca" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(marcas) && marcas.length > 0 ? (
                        marcas.map((marca) => {
                          if (!marca || marca.cod_ti_marca === undefined || !marca.des_ti_marca) {
                            return null
                          }
                          return (
                            <SelectItem 
                              key={marca.cod_ti_marca} 
                              value={marca.cod_ti_marca.toString()}
                            >
                              {marca.des_ti_marca}
                            </SelectItem>
                          )
                        }).filter(Boolean)
                      ) : (
                        <div className="px-2 py-1 text-sm text-gray-500">No hay marcas disponibles</div>
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
                    placeholder="MacBook Pro 14&quot;"
                    required
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* ✅ ESPECIFICACIONES TÉCNICAS */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
                <MonitorSpeaker className="w-5 h-5" />
                Especificaciones Técnicas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div>
                  <Label htmlFor="procesador" className="text-sm font-medium">
                    Procesador
                  </Label>
                  <Input
                    id="procesador"
                    value={formData.procesador}
                    onChange={(e) => handleInputChange('procesador', e.target.value)}
                    placeholder="Apple M3 Pro"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="ram" className="text-sm font-medium">
                    Memoria RAM
                  </Label>
                  <Input
                    id="ram"
                    value={formData.ram}
                    onChange={(e) => handleInputChange('ram', e.target.value)}
                    placeholder="16GB"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="almacenamiento" className="text-sm font-medium">
                    Almacenamiento
                  </Label>
                  <Input
                    id="almacenamiento"
                    value={formData.almacenamiento}
                    onChange={(e) => handleInputChange('almacenamiento', e.target.value)}
                    placeholder="512GB SSD"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* ✅ UBICACIÓN Y RED */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-900 mb-4 flex items-center gap-2">
                <Building className="w-5 h-5" />
                Ubicación y Red
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div>
                  <Label htmlFor="ubicacion" className="text-sm font-medium">
                    Ubicación
                  </Label>
                  <Select 
                    value={formData.cod_ti_ubicacion} 
                    onValueChange={(value) => handleInputChange('cod_ti_ubicacion', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Seleccionar ubicación" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(ubicaciones) && ubicaciones.length > 0 ? (
                        ubicaciones.map((ubicacion) => {
                          if (!ubicacion || ubicacion.cod_ti_ubicacion === undefined || !ubicacion.des_ti_ubicacion) {
                            return null
                          }
                          return (
                            <SelectItem 
                              key={ubicacion.cod_ti_ubicacion} 
                              value={ubicacion.cod_ti_ubicacion.toString()}
                            >
                              {ubicacion.des_ti_ubicacion}
                            </SelectItem>
                          )
                        }).filter(Boolean)
                      ) : (
                        <div className="px-2 py-1 text-sm text-gray-500">No hay ubicaciones disponibles</div>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="red" className="text-sm font-medium">
                    Red ({redes.length} disponibles)
                  </Label>
                  <Select 
                    value={formData.cod_ti_red} 
                    onValueChange={(value) => handleInputChange('cod_ti_red', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Seleccionar red" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(redes) && redes.length > 0 ? (
                        redes.map((red) => {
                          if (!red || red.cod_ti_red === undefined || !red.descripcion) {
                            return null
                          }
                          return (
                            <SelectItem 
                              key={red.cod_ti_red} 
                              value={red.cod_ti_red.toString()}
                            >
                              {red.descripcion}
                            </SelectItem>
                          )
                        }).filter(Boolean)
                      ) : (
                        <div className="px-2 py-1 text-sm text-gray-500">No hay redes disponibles</div>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="dominio" className="text-sm font-medium">
                    Dominio de Red ({dominios.length} disponibles)
                  </Label>
                  <Select 
                    value={formData.cod_ti_dominio} 
                    onValueChange={(value) => handleInputChange('cod_ti_dominio', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Seleccionar dominio" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(dominios) && dominios.length > 0 ? (
                        dominios.map((dominio) => {
                          if (!dominio || dominio.cod_ti_dominio === undefined || !dominio.descripcion) {
                            return null
                          }
                          return (
                            <SelectItem 
                              key={dominio.cod_ti_dominio} 
                              value={dominio.cod_ti_dominio.toString()}
                            >
                              {dominio.descripcion}
                            </SelectItem>
                          )
                        }).filter(Boolean)
                      ) : (
                        <div className="px-2 py-1 text-sm text-gray-500">No hay dominios disponibles</div>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* ✅ OBSERVACIONES */}
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-lg border border-amber-200">
              <h3 className="font-semibold text-amber-900 mb-4">Observaciones</h3>
              <div>
                <Textarea
                  id="observaciones"
                  value={formData.observaciones}
                  onChange={(e) => handleInputChange('observaciones', e.target.value)}
                  placeholder="Notas adicionales sobre el equipo MAC..."
                  rows={3}
                  className="mt-1"
                />
              </div>
            </div>

            {/* ✅ BOTONES */}
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
                className="bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Apple className="w-4 h-4 mr-2" />
                    Agregar Equipo
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