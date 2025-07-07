"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function AddDeviceModal({ open, onClose, onDeviceAdded }: {
  open: boolean,
  onClose: () => void,
  onDeviceAdded?: () => void
}) {
  const [categorias, setCategorias] = useState<{ id_categoria: number, nombre: string }[]>([])
  const [marcas, setMarcas] = useState<{ id_marca: number, nombre: string }[]>([])
  const [ubicaciones, setUbicaciones] = useState<{ id_ubicacion: number, nombre: string }[]>([])
  const [propietarios, setPropietarios] = useState<{ id_propietario: number, nombre: string }[]>([])

  const [form, setForm] = useState<any>({
    nombre_pc: "",
    numero_serie: "",
    modelo: "",
    almacenamiento: "",
    ram: "",
    procesador: "",
    id_categoria: "",
    nueva_categoria: "",
    direccion_mac: "",
    ip: "",
    id_marca: "",
    nueva_marca: "",
    id_ubicacion: "",
    nueva_ubicacion: "",
    id_propietario: "",
    nuevo_propietario: "",
    descripcion: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("http://localhost:3000/api/categorias")
      .then(res => res.json())
      .then(data => setCategorias(Array.isArray(data) ? data : data.categorias || []))
    fetch("http://localhost:3000/api/marcas")
      .then(res => res.json())
      .then(data => setMarcas(Array.isArray(data) ? data : data.marcas || []))
    fetch("http://localhost:3000/api/ubicaciones")
      .then(res => res.json())
      .then(data => setUbicaciones(Array.isArray(data) ? data : data.ubicaciones || []))
    fetch("http://localhost:3000/api/propietarios")
      .then(res => res.json())
      .then(data => setPropietarios(Array.isArray(data) ? data : data.propietarios || []))
  }, [open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      let id_categoria = form.id_categoria
      let id_marca = form.id_marca
      let id_ubicacion = form.id_ubicacion
      let id_propietario = form.id_propietario

      // Si es nueva categoría, crea y usa el nuevo id
      if (id_categoria === "__nuevo__" && form.nueva_categoria) {
        const res = await fetch("http://localhost:3000/api/categorias", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre: form.nueva_categoria }),
        })
        const data = await res.json()
        id_categoria = data.id_categoria
      }

      // Si es nueva marca, crea y usa el nuevo id
      if (id_marca === "__nuevo__" && form.nueva_marca) {
        const res = await fetch("http://localhost:3000/api/marcas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre: form.nueva_marca }),
        })
        const data = await res.json()
        id_marca = data.id_marca
      }

      // Si es nueva ubicación, crea y usa el nuevo id
      if (id_ubicacion === "__nuevo__" && form.nueva_ubicacion) {
        const res = await fetch("http://localhost:3000/api/ubicaciones", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre: form.nueva_ubicacion }),
        })
        const data = await res.json()
        id_ubicacion = data.id_ubicacion
      }

      // Si es nuevo propietario, crea y usa el nuevo id
      if (id_propietario === "__nuevo__" && form.nuevo_propietario) {
        const res = await fetch("http://localhost:3000/api/propietarios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre: form.nuevo_propietario }),
        })
        const data = await res.json()
        id_propietario = data.id_propietario
      }

      // Validación extra
      if (!id_categoria || !id_marca || !id_ubicacion || !id_propietario) {
        setError("Debe seleccionar o crear categoría, marca, ubicación y propietario.")
        setLoading(false)
        return
      }

      // Construye el payload, permitiendo campos vacíos
      const payload = {
        nombre_pc: form.nombre_pc || null,
        numero_serie: form.numero_serie || null,
        modelo: form.modelo || null,
        almacenamiento: form.almacenamiento || null,
        ram: form.ram || null,
        procesador: form.procesador || null,
        id_categoria: id_categoria ? Number(id_categoria) : null,
        direccion_mac: form.direccion_mac || null,
        ip: form.ip || null,
        id_marca: id_marca ? Number(id_marca) : null,
        id_ubicacion: id_ubicacion ? Number(id_ubicacion) : null,
        descripcion: form.descripcion || null,
        id_propietario: id_propietario ? Number(id_propietario) : null,
      }

      const res = await fetch("http://localhost:3000/api/equipos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("Error al agregar dispositivo")
      setForm({
        nombre_pc: "",
        numero_serie: "",
        modelo: "",
        almacenamiento: "",
        ram: "",
        procesador: "",
        id_categoria: "",
        nueva_categoria: "",
        direccion_mac: "",
        ip: "",
        id_marca: "",
        nueva_marca: "",
        id_ubicacion: "",
        nueva_ubicacion: "",
        id_propietario: "",
        nuevo_propietario: "",
        descripcion: "",
      })
      onDeviceAdded && onDeviceAdded()
      onClose()
    } catch (err: any) {
      setError(err.message || "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar Dispositivo</DialogTitle>
        </DialogHeader>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <Input name="nombre_pc" placeholder="Nombre" value={form.nombre_pc} onChange={handleChange} />
          <Input name="numero_serie" placeholder="Número de Serie" value={form.numero_serie} onChange={handleChange} />
          <Input name="modelo" placeholder="Modelo" value={form.modelo} onChange={handleChange} />
          <Input name="almacenamiento" placeholder="Almacenamiento" value={form.almacenamiento} onChange={handleChange} />
          <Input name="ram" placeholder="RAM" value={form.ram} onChange={handleChange} />
          <Input name="procesador" placeholder="Procesador" value={form.procesador} onChange={handleChange} />

          {/* Select de categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
              name="id_categoria"
              value={form.id_categoria}
              onChange={handleChange}
              className="border rounded px-2 py-2 text-gray-700 w-full"
              required
            >
              <option value="">Seleccione una categoría...</option>
              {categorias.map((cat) => (
                <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombre}</option>
              ))}
              <option value="__nuevo__">Otra (escribir nueva)</option>
            </select>
            {form.id_categoria === "__nuevo__" && (
              <Input
                name="nueva_categoria"
                placeholder="Nueva categoría"
                value={form.nueva_categoria}
                onChange={handleChange}
                className="mt-2"
                required
              />
            )}
          </div>

          {/* Select de marca */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
            <select
              name="id_marca"
              value={form.id_marca}
              onChange={handleChange}
              className="border rounded px-2 py-2 text-gray-700 w-full"
              required
            >
              <option value="">Seleccione una marca...</option>
              {marcas.map((m) => (
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

          {/* Select de ubicación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
            <select
              name="id_ubicacion"
              value={form.id_ubicacion}
              onChange={handleChange}
              className="border rounded px-2 py-2 text-gray-700 w-full"
              required
            >
              <option value="">Seleccione una ubicación...</option>
              {ubicaciones.map((u) => (
                <option key={u.id_ubicacion} value={u.id_ubicacion}>{u.nombre}</option>
              ))}
              <option value="__nuevo__">Otra (escribir nueva)</option>
            </select>
            {form.id_ubicacion === "__nuevo__" && (
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

          {/* Select de propietario */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Propietario</label>
            <select
              name="id_propietario"
              value={form.id_propietario}
              onChange={handleChange}
              className="border rounded px-2 py-2 text-gray-700 w-full"
              required
            >
              <option value="">Seleccione un propietario...</option>
              {propietarios.map((p) => (
                <option key={p.id_propietario} value={p.id_propietario}>{p.nombre}</option>
              ))}
              <option value="__nuevo__">Otro (escribir nuevo)</option>
            </select>
            {form.id_propietario === "__nuevo__" && (
              <Input
                name="nuevo_propietario"
                placeholder="Nuevo propietario (empresa)"
                value={form.nuevo_propietario}
                onChange={handleChange}
                className="mt-2"
                required
              />
            )}
          </div>

          <Input name="direccion_mac" placeholder="MAC" value={form.direccion_mac} onChange={handleChange} />
          <Input name="ip" placeholder="IP" value={form.ip} onChange={handleChange} />
          <Input name="descripcion" placeholder="Descripción (opcional)" value={form.descripcion} onChange={handleChange} />

          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={loading}>{loading ? "Guardando..." : "Guardar"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}