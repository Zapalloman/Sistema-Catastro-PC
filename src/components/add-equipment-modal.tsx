"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AddEquipmentModalProps {
  open: boolean
  onClose: () => void
  onAdded: () => void
  propietarioOptions: any[]
}

export function AddEquipmentModal({ open, onClose, onAdded, propietarioOptions }: AddEquipmentModalProps) {
  // Estados para selects
  const [marcas, setMarcas] = useState<{ id_marca: number, nombre: string }[]>([])
  const [ubicaciones, setUbicaciones] = useState<{ cod_ti_ubicacion: number, nombre: string }[]>([])
  const [categorias, setCategorias] = useState<any[]>([])
  const [propietarioOptionsLocal, setPropietarioOptions] = useState<any[]>([])
  const [redes, setRedes] = useState<any[]>([])
  const [dominios, setDominios] = useState<any[]>([])
  const [departamentos, setDepartamentos] = useState<any[]>([]) // NUEVO

  // Estado del formulario
  const [form, setForm] = useState({
    numero_serie: "",
    modelo: "",
    almacenamiento: "",
    ram: "",
    procesador: "",
    ip: "",
    direccion_mac: "",
    nombre_pc: "",
    id_propietario: "",
    id_marca: "",
    cod_ti_ubicacion: "",
    nuevo_propietario: "",
    nueva_marca: "",
    nueva_ubicacion: "",
    des_ti_ubicacion: "",
    llave_inventario: "",
    id_categoria: "",
    fecha_adquisicion: "",
    version_sistema_operativo: "",
    version_office: "",
    cod_ti_red: "",
    cod_ti_dominio: "",
    cod_ti_departamento: "", // NUEVO
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (open) {
      // Cargar categorías
      fetch("http://localhost:3000/api/equipos/categorias")
        .then(res => res.json())
        .then(data => setCategorias(Array.isArray(data) ? data : []))
        .catch(() => setCategorias([]))

      // Cargar marcas
      fetch("http://localhost:3000/api/marcas")
        .then(res => res.json())
        .then(data => setMarcas(data.map(m => ({
          id_marca: m.cod_ti_marca,
          nombre: m.des_ti_marca
        }))))

      // Cargar ubicaciones
      fetch("http://localhost:3000/api/ubicaciones")
        .then(res => res.json())
        .then(data => setUbicaciones(data.map(u => ({
          cod_ti_ubicacion: u.cod_ti_ubicacion,
          nombre: u.des_ti_ubicacion
        }))))

      // Cargar propietarios
      fetch("http://localhost:3000/api/propietarios")
        .then(res => res.json())
        .then(data => setPropietarioOptions(data.map(p => ({
          id_propietario: p.cod_ti_propietario,
          nombre: p.des_ti_propietario
        }))))

      // Cargar redes
      fetch("http://localhost:3000/api/parametros-generales/RED")
        .then(res => res.json())
        .then(data => setRedes(Array.isArray(data) ? data : []))
        .catch(() => setRedes([]))

      // Cargar dominios
      fetch("http://localhost:3000/api/parametros-generales/DOMINIO_RED")
        .then(res => res.json())
        .then(data => setDominios(Array.isArray(data) ? data : []))
        .catch(() => setDominios([]))

      // NUEVO: Cargar departamentos
      fetch("http://localhost:3000/api/equipos/departamentos")
        .then(res => res.json())
        .then(data => setDepartamentos(Array.isArray(data) ? data.map(d => ({
          cod_ti_departamento: d.cod_ti_departamento,
          nombre: d.des_ti_departamento
        })) : []))
        .catch(() => setDepartamentos([]))
    }
  }, [open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Función para verificar si la categoría seleccionada es CPU o NOTEBOOK
  const isCpuOrNotebook = () => {
    if (!form.id_categoria) return false
    const cat = categorias.find(cat => cat.id_tipo === Number(form.id_categoria))
    if (!cat) return false
    const nombre = cat.desc_tipo.toLowerCase()
    return nombre.includes("cpu") || nombre.includes("notebook")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    try {
      let id_propietario = form.id_propietario
      let id_marca = form.id_marca
      let id_ubicacion = form.cod_ti_ubicacion

      // Crear propietario si es nuevo
      if (id_propietario === "__nuevo__") {
        const res = await fetch("http://localhost:3000/api/propietarios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre: form.nuevo_propietario }),
        })
        const data = await res.json()
        id_propietario = data.id_propietario
      }

      // Crear marca si es nueva
      if (id_marca === "__nuevo__") {
        const res = await fetch("http://localhost:3000/api/marcas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre: form.nueva_marca }),
        })
        const data = await res.json()
        id_marca = data.id_marca
      }

      // Crear ubicación si es nueva
      if (id_ubicacion === "__nuevo__") {
        const res = await fetch("http://localhost:3000/api/ubicaciones", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre: form.nueva_ubicacion }),
        })
        const data = await res.json()
        id_ubicacion = data.id_ubicacion
      }

      // Preparar payload
      const equipoPayload = {
        numero_serie: form.numero_serie,
        modelo: form.modelo,
        almacenamiento: form.almacenamiento,
        ram: form.ram,
        procesador: form.procesador,
        ip: form.ip,
        direccion_mac: form.direccion_mac,
        nombre_pc: form.nombre_pc,
        cod_ti_propietario: id_propietario ? Number(id_propietario) : null,
        cod_ti_marca: id_marca ? Number(id_marca) : null,
        cod_ti_ubicacion: id_ubicacion ? Number(id_ubicacion) : null,
        id_tipo: form.id_categoria ? Number(form.id_categoria) : null,
        llave_inventario: form.llave_inventario || null,
        fecha_adquisicion: form.fecha_adquisicion || null,
        version_sistema_operativo: form.version_sistema_operativo || null,
        version_office: form.version_office || null,
        // Solo agregar red y dominio si es CPU o NOTEBOOK
        cod_ti_red: isCpuOrNotebook() && form.cod_ti_red ? Number(form.cod_ti_red) : null,
        cod_ti_dominio: isCpuOrNotebook() && form.cod_ti_dominio ? Number(form.cod_ti_dominio) : null,
        // NUEVO: Agregar departamento
        cod_ti_departamento: form.cod_ti_departamento ? Number(form.cod_ti_departamento) : null,
      }

      const res = await fetch("http://localhost:3000/api/equipos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(equipoPayload),
      })

      if (!res.ok) throw new Error("Error al agregar equipo")

      // Limpiar formulario
      setForm({
        numero_serie: "",
        modelo: "",
        almacenamiento: "",
        ram: "",
        procesador: "",
        ip: "",
        direccion_mac: "",
        nombre_pc: "",
        id_propietario: "",
        id_marca: "",
        cod_ti_ubicacion: "",
        nuevo_propietario: "",
        nueva_marca: "",
        nueva_ubicacion: "",
        des_ti_ubicacion: "",
        llave_inventario: "",
        id_categoria: "",
        fecha_adquisicion: "",
        version_sistema_operativo: "",
        version_office: "",
        cod_ti_red: "",
        cod_ti_dominio: "",
        cod_ti_departamento: "", // NUEVO
      })
      
      onAdded()
      onClose()
    } catch (err: any) {
      setError(err.message || "Error al agregar equipo")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar Equipo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input name="numero_serie" placeholder="N° Serie" value={form.numero_serie} onChange={handleChange} required />
            <Input name="modelo" placeholder="Modelo" value={form.modelo} onChange={handleChange} required />
            <Input name="almacenamiento" placeholder="Disco" value={form.almacenamiento} onChange={handleChange} />
            <Input name="ram" placeholder="RAM" value={form.ram} onChange={handleChange} />
            <Input name="procesador" placeholder="Procesador" value={form.procesador} onChange={handleChange} />
            <Input name="ip" placeholder="IP" value={form.ip} onChange={handleChange} />
            <Input name="direccion_mac" placeholder="MAC" value={form.direccion_mac} onChange={handleChange} />
            <Input name="nombre_pc" placeholder="Nombre PC" value={form.nombre_pc} onChange={handleChange} />

            {/* Marca */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
              <select
                name="id_marca"
                value={form.id_marca}
                onChange={handleChange}
                required
                className="border rounded px-2 py-2 text-gray-700 w-full"
              >
                <option value="">Seleccione una marca...</option>
                {marcas.map(m => (
                  <option key={m.id_marca} value={m.id_marca}>{m.nombre}</option>
                ))}
                <option value="__nuevo__">Otra (escribir nueva)</option>
              </select>
              {form.id_marca === "__nuevo__" && (
                <Input
                  name="nueva_marca"
                  placeholder="Nueva marca"
                  value={form.nueva_marca}
                  onChange={handleChange}
                  className="mt-2"
                  required
                />
              )}
            </div>

            {/* Ubicación */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
              <select
                name="cod_ti_ubicacion"
                value={form.cod_ti_ubicacion}
                onChange={handleChange}
                required
                className="border rounded px-2 py-2 text-gray-700 w-full"
              >
                <option value="">Seleccione una ubicación...</option>
                {ubicaciones.map(u => (
                  <option key={u.cod_ti_ubicacion} value={u.cod_ti_ubicacion}>{u.nombre}</option>
                ))}
                <option value="__nuevo__">Otra (escribir nueva)</option>
              </select>
              {form.cod_ti_ubicacion === "__nuevo__" && (
                <Input
                  name="nueva_ubicacion"
                  placeholder="Nueva ubicación"
                  value={form.nueva_ubicacion}
                  onChange={handleChange}
                  className="mt-2"
                  required
                />
              )}
            </div>

            {/* Propietario */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Propietario</label>
              <select
                name="id_propietario"
                value={form.id_propietario}
                onChange={handleChange}
                required
                className="border rounded px-2 py-2 text-gray-700 w-full"
              >
                <option value="">Seleccione un propietario...</option>
                {propietarioOptionsLocal.map((p) => (
                  <option key={p.id_propietario} value={p.id_propietario}>{p.nombre}</option>
                ))}
                <option value="__nuevo__">Otro (escribir nuevo)</option>
              </select>
              {form.id_propietario === "__nuevo__" && (
                <Input
                  name="nuevo_propietario"
                  placeholder="Nuevo propietario"
                  value={form.nuevo_propietario}
                  onChange={handleChange}
                  className="mt-2"
                  required
                />
              )}
            </div>

            {/* Categoría */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select
                name="id_categoria"
                value={form.id_categoria}
                onChange={handleChange}
                required
                className="border rounded px-2 py-2 text-gray-700 w-full"
              >
                <option value="">Seleccione una categoría...</option>
                {categorias.map(cat => (
                  <option key={cat.id_tipo} value={cat.id_tipo}>{cat.desc_tipo}</option>
                ))}
              </select>
            </div>

            {/* NUEVO: Departamento */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
              <select
                name="cod_ti_departamento"
                value={form.cod_ti_departamento}
                onChange={handleChange}
                className="border rounded px-2 py-2 text-gray-700 w-full"
              >
                <option value="">Seleccione un departamento...</option>
                {departamentos.map(dept => (
                  <option key={dept.cod_ti_departamento} value={dept.cod_ti_departamento}>
                    {dept.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Red y Dominio - Solo para CPU y NOTEBOOK */}
            {isCpuOrNotebook() && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Red</label>
                  <select
                    name="cod_ti_red"
                    value={form.cod_ti_red}
                    onChange={handleChange}
                    className="border rounded px-2 py-2 text-gray-700 w-full"
                  >
                    <option value="">Seleccione una red...</option>
                    {redes.map(red => (
                      <option key={red.codigo} value={red.codigo}>{red.descripcion}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dominio de Red</label>
                  <select
                    name="cod_ti_dominio"
                    value={form.cod_ti_dominio}
                    onChange={handleChange}
                    className="border rounded px-2 py-2 text-gray-700 w-full"
                  >
                    <option value="">Seleccione un dominio...</option>
                    {dominios.map(dominio => (
                      <option key={dominio.codigo} value={dominio.codigo}>{dominio.descripcion}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* Fecha de Adquisición */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Adquisición</label>
              <input
                type="date"
                name="fecha_adquisicion"
                value={form.fecha_adquisicion}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              />
            </div>

            {/* Llave de Inventario - solo para IGM */}
            {form.id_propietario === "1" && (
              <div>
                <Input
                  name="llave_inventario"
                  placeholder="Llave de Inventario"
                  value={form.llave_inventario}
                  onChange={handleChange}
                  required
                />
                <span className="text-xs text-gray-500">Obligatorio para equipos IGM</span>
              </div>
            )}

            {/* Campos adicionales para CPU/NOTEBOOK */}
            {isCpuOrNotebook() && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sistema Operativo</label>
                  <input
                    type="text"
                    name="version_sistema_operativo"
                    value={form.version_sistema_operativo || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                    placeholder="Ej: Windows 10 Pro, Ubuntu 22.04"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Versión de Office</label>
                  <input
                    type="text"
                    name="version_office"
                    value={form.version_office || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                    placeholder="Ej: Office 365, Office 2019"
                  />
                </div>
              </>
            )}
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}
          
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

