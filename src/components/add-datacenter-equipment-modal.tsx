"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Server, Loader2, Building, Network, Shield, Calendar, Users } from "lucide-react"

interface AddDatacenterEquipmentModalProps {
  open: boolean
  onClose: () => void
  onEquipmentAdded: () => void
}

export function AddDatacenterEquipmentModal({ open, onClose, onEquipmentAdded }: AddDatacenterEquipmentModalProps) {
  // ✅ ESTADO DEL FORMULARIO - REMOVER CAMPOS INNECESARIOS
  const [formData, setFormData] = useState({
    llave_inventario: '',
    nombre_pc: '',
    cod_ti_marca: '',
    modelo: '',
    numero_serie: '',
    almacenamiento: '',
    ram: '',
    procesador: '',
    // ❌ REMOVIDOS: version_sistema_operativo, version_office
    id_categoria: '',
    observaciones: '',
    cod_ti_ubicacion: '',
    cod_ti_red: '',
    cod_ti_dominio: '',
    cod_ti_departamento: '',
    cod_ti_propietario: ''
  })

  // ✅ ESTADOS PARA LAS OPCIONES DE SELECTS
  const [marcas, setMarcas] = useState<any[]>([])
  const [categorias, setCategorias] = useState<any[]>([])
  const [ubicaciones, setUbicaciones] = useState<any[]>([])
  const [redes, setRedes] = useState<any[]>([])
  const [dominios, setDominios] = useState<any[]>([])
  const [departamentos, setDepartamentos] = useState<any[]>([])
  const [propietarios, setPropietarios] = useState<any[]>([])
  
  const [loading, setLoading] = useState(false)
  const [loadingOptions, setLoadingOptions] = useState(false)

  // ✅ CARGAR OPCIONES AL ABRIR MODAL
  useEffect(() => {
    if (open) {
      console.log('🔄 Cargando opciones para modal datacenter...')
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
          console.error('❌ Error cargando marcas HTTP:', marcasRes.status)
          setMarcas([])
        }
      } catch (error) {
        console.error('❌ Error cargando marcas:', error)
        setMarcas([])
      }

      // ✅ CARGAR CATEGORÍAS DATACENTER
      console.log('📂 Cargando categorías datacenter...')
      try {
        const categoriasRes = await fetch("http://localhost:3000/api/equipos-datacenter/categorias")
        if (categoriasRes.ok) {
          const categoriasData = await categoriasRes.json()
          console.log('✅ Categorías datacenter cargadas:', categoriasData?.length || 0)
          if (Array.isArray(categoriasData) && categoriasData.length > 0) {
            const categoriasValid = categoriasData.filter(c => c && c.id_categoria !== undefined && c.categoria)
            setCategorias(categoriasValid)
          } else {
            setCategorias([])
          }
        } else {
          console.error('❌ Error cargando categorías HTTP:', categoriasRes.status)
          setCategorias([])
        }
      } catch (error) {
        console.error('❌ Error cargando categorías:', error)
        setCategorias([])
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
          console.error('❌ Error cargando ubicaciones HTTP:', ubicacionesRes.status)
          setUbicaciones([])
        }
      } catch (error) {
        console.error('❌ Error cargando ubicaciones:', error)
        setUbicaciones([])
      }

      // ✅ CARGAR PROPIETARIOS DESDE TI_PROPIETARIO
      console.log('👥 Cargando propietarios...')
      try {
        const propietariosRes = await fetch("http://localhost:3000/api/equipos/propietarios")
        if (propietariosRes.ok) {
          const propietariosData = await propietariosRes.json()
          console.log('✅ Propietarios cargados:', propietariosData?.length || 0)
          console.log('📊 Estructura de propietarios:', propietariosData[0]) // Debug
          
          if (Array.isArray(propietariosData) && propietariosData.length > 0) {
            // ✅ VALIDAR ESTRUCTURA DE TI_PROPIETARIO
            const propietariosValidos = propietariosData.filter(propietario => 
              propietario && 
              typeof propietario.cod_ti_propietario !== 'undefined' && 
              propietario.cod_ti_propietario !== null &&
              typeof propietario.des_ti_propietario === 'string'
            )
            
            // ✅ MAPEAR A LA ESTRUCTURA ESPERADA
            const propietariosMapeados = propietariosValidos.map(propietario => ({
              cod_ti_propietario: propietario.cod_ti_propietario,
              nombre: propietario.des_ti_propietario
            }))
            
            setPropietarios(propietariosMapeados)
            console.log(`✅ ${propietariosMapeados.length} propietarios válidos cargados`)
            console.log('📋 Propietarios procesados:', propietariosMapeados)
          } else {
            console.warn('⚠️ No hay propietarios válidos, usando valores por defecto')
            setPropietarios([
              { cod_ti_propietario: 1, nombre: 'IGM' },
              { cod_ti_propietario: 2, nombre: 'LATSUR' },
              { cod_ti_propietario: 3, nombre: 'MAC' },
              { cod_ti_propietario: 4, nombre: 'INFOWORLD' }
            ])
          }
        } else {
          console.error('❌ Error cargando propietarios HTTP:', propietariosRes.status)
          setPropietarios([
            { cod_ti_propietario: 1, nombre: 'IGM' },
            { cod_ti_propietario: 2, nombre: 'LATSUR' },
            { cod_ti_propietario: 3, nombre: 'MAC' },
            { cod_ti_propietario: 4, nombre: 'INFOWORLD' }
          ])
        }
      } catch (error) {
        console.error('❌ Error cargando propietarios:', error)
        setPropietarios([
          { cod_ti_propietario: 1, nombre: 'IGM' },
          { cod_ti_propietario: 2, nombre: 'LATSUR' },
          { cod_ti_propietario: 3, nombre: 'MAC' },
          { cod_ti_propietario: 4, nombre: 'INFOWORLD' }
        ])
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
              cod_ti_dominio_red: dominio.cod_ti_dominio,
              descripcion: dominio.des_ti_dominio
            }))
            
            setDominios(dominiosMapeados)
          } else {
            setDominios([
              { cod_ti_dominio_red: 1, descripcion: 'IGM.LOCAL' },
              { cod_ti_dominio_red: 2, descripcion: 'WORKGROUP' }
            ])
          }
        } else {
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

      // ✅ CARGAR DEPARTAMENTOS
      console.log('🏢 Cargando departamentos...')
      try {
        const departamentosRes = await fetch("http://localhost:3000/api/equipos/departamentos")
        if (departamentosRes.ok) {
          const departamentosData = await departamentosRes.json()
          console.log('✅ Departamentos cargados:', departamentosData?.length || 0)
          if (Array.isArray(departamentosData) && departamentosData.length > 0) {
            const departamentosValid = departamentosData
              .filter(d => d && d.cod_ti_departamento !== undefined && d.des_ti_departamento)
              .map(d => ({
                cod_ti_departamento: d.cod_ti_departamento,
                nombre: d.des_ti_departamento
              }))
            setDepartamentos(departamentosValid)
          } else {
            setDepartamentos([])
          }
        } else {
          console.error('❌ Error cargando departamentos HTTP:', departamentosRes.status)
          setDepartamentos([])
        }
      } catch (error) {
        console.error('❌ Error cargando departamentos:', error)
        setDepartamentos([])
      }

    } catch (error) {
      console.error('❌ Error general cargando opciones:', error)
    } finally {
      setLoadingOptions(false)
      console.log('✅ Carga de opciones completada para datacenter')
    }
  }

  // ✅ MANEJAR CAMBIOS EN EL FORMULARIO
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // ✅ ENVIAR FORMULARIO - SIN CAMPOS REMOVIDOS
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // ✅ VALIDAR CAMPOS OBLIGATORIOS
    if (!formData.nombre_pc || !formData.numero_serie || !formData.modelo) {
      alert('Por favor complete todos los campos obligatorios marcados con *')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('http://localhost:3000/api/equipos-datacenter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          // ✅ CONVERTIR A NÚMEROS O NULL SEGÚN CORRESPONDA
          cod_ti_marca: formData.cod_ti_marca ? parseInt(formData.cod_ti_marca) : null,
          id_categoria: formData.id_categoria ? parseInt(formData.id_categoria) : null,
          cod_ti_ubicacion: formData.cod_ti_ubicacion ? parseInt(formData.cod_ti_ubicacion) : null,
          cod_ti_red: formData.cod_ti_red ? parseInt(formData.cod_ti_red) : null,
          cod_ti_dominio: formData.cod_ti_dominio ? parseInt(formData.cod_ti_dominio) : null,
          cod_ti_departamento: formData.cod_ti_departamento ? parseInt(formData.cod_ti_departamento) : null,
          cod_ti_propietario: formData.cod_ti_propietario ? parseInt(formData.cod_ti_propietario) : null,
          activo: true
        }),
      })

      if (response.ok) {
        console.log('✅ Equipo datacenter creado exitosamente')
        onEquipmentAdded()
        onClose()
        // ✅ LIMPIAR FORMULARIO - SIN CAMPOS REMOVIDOS
        setFormData({
          llave_inventario: '',
          nombre_pc: '',
          cod_ti_marca: '',
          modelo: '',
          numero_serie: '',
          almacenamiento: '',
          ram: '',
          procesador: '',
          id_categoria: '',
          observaciones: '',
          cod_ti_ubicacion: '',
          cod_ti_red: '',
          cod_ti_dominio: '',
          cod_ti_departamento: '',
          cod_ti_propietario: ''
        })
      } else {
        const errorData = await response.text()
        console.error('❌ Error creando equipo datacenter:', errorData)
        alert('Error al crear el equipo de datacenter')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-slate-600 to-gray-600 bg-clip-text text-transparent flex items-center gap-2">
            <Server className="w-6 h-6 text-slate-600" />
            Agregar Equipo de Datacenter
          </DialogTitle>
        </DialogHeader>

        {loadingOptions ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin w-6 h-6 border-2 border-slate-600 border-t-transparent rounded-full mr-3" />
            <span>Cargando opciones...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* ✅ INFORMACIÓN BÁSICA */}
            <div className="bg-gradient-to-r from-slate-50 to-gray-50 p-4 rounded-lg border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Server className="w-5 h-5 text-slate-600" />
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
                    placeholder="DC-IGM-001-2024"
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
                    placeholder="SERVER-DC-001"
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
                    placeholder="SRV-001-2024"
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
                    placeholder="PowerEdge R750"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="categoria" className="text-sm font-medium">
                    Categoría
                  </Label>
                  <Select 
                    value={formData.id_categoria} 
                    onValueChange={(value) => handleInputChange('id_categoria', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(categorias) && categorias.length > 0 ? (
                        categorias.map((categoria) => {
                          if (!categoria || categoria.id_categoria === undefined || !categoria.categoria) {
                            return null
                          }
                          return (
                            <SelectItem 
                              key={categoria.id_categoria} 
                              value={categoria.id_categoria.toString()}
                            >
                              {categoria.categoria}
                            </SelectItem>
                          )
                        }).filter(Boolean)
                      ) : (
                        <div className="px-2 py-1 text-sm text-gray-500">No hay categorías disponibles</div>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* ✅ ESPECIFICACIONES TÉCNICAS - SIMPLIFICADO */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-4">Especificaciones Técnicas</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div>
                  <Label htmlFor="procesador" className="text-sm font-medium">
                    Procesador
                  </Label>
                  <Input
                    id="procesador"
                    value={formData.procesador}
                    onChange={(e) => handleInputChange('procesador', e.target.value)}
                    placeholder="Intel Xeon Silver 4314"
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
                    placeholder="64GB DDR4"
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
                    placeholder="2TB SSD + 4TB HDD"
                    className="mt-1"
                  />
                </div>

                {/* ❌ REMOVIDOS: Sistema Operativo y Versión Office */}
              </div>
            </div>

            {/* ✅ PROPIETARIO Y UBICACIÓN */}
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Propietario y Ubicación
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div>
                  <Label htmlFor="propietario" className="text-sm font-medium">
                    Propietario ({propietarios.length} disponibles)
                  </Label>
                  <Select 
                    value={formData.cod_ti_propietario} 
                    onValueChange={(value) => handleInputChange('cod_ti_propietario', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Seleccionar propietario" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(propietarios) && propietarios.length > 0 ? (
                        propietarios.map((propietario) => {
                          if (!propietario || propietario.cod_ti_propietario === undefined || !propietario.nombre) {
                            return null
                          }
                          return (
                            <SelectItem 
                              key={propietario.cod_ti_propietario} 
                              value={propietario.cod_ti_propietario.toString()}
                            >
                              {propietario.nombre}
                            </SelectItem>
                          )
                        }).filter(Boolean)
                      ) : (
                        <div className="px-2 py-1 text-sm text-gray-500">No hay propietarios disponibles</div>
                      )}
                    </SelectContent>
                  </Select>
                </div>

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
                  <Label htmlFor="departamento" className="text-sm font-medium">
                    Departamento
                  </Label>
                  <Select 
                    value={formData.cod_ti_departamento} 
                    onValueChange={(value) => handleInputChange('cod_ti_departamento', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Seleccionar departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(departamentos) && departamentos.length > 0 ? (
                        departamentos.map((departamento) => {
                          if (!departamento || departamento.cod_ti_departamento === undefined || !departamento.nombre) {
                            return null
                          }
                          return (
                            <SelectItem 
                              key={departamento.cod_ti_departamento} 
                              value={departamento.cod_ti_departamento.toString()}
                            >
                              {departamento.nombre}
                            </SelectItem>
                          )
                        }).filter(Boolean)
                      ) : (
                        <div className="px-2 py-1 text-sm text-gray-500">No hay departamentos disponibles</div>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* ✅ CONFIGURACIÓN DE RED */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-900 mb-4 flex items-center gap-2">
                <Network className="w-5 h-5" />
                Configuración de Red
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
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
                          if (!dominio || dominio.cod_ti_dominio_red === undefined || !dominio.descripcion) {
                            return null
                          }
                          return (
                            <SelectItem 
                              key={dominio.cod_ti_dominio_red} 
                              value={dominio.cod_ti_dominio_red.toString()}
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
                  placeholder="Notas adicionales sobre el equipo de datacenter..."
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
                className="bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Server className="w-4 h-4 mr-2" />
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