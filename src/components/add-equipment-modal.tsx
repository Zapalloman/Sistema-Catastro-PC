"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface AddEquipmentModalProps {
  open: boolean
  onClose: () => void
  onAdded: () => void
  propietarioOptions: string[]
}

export function AddEquipmentModal({ open, onClose, onAdded, propietarioOptions }: AddEquipmentModalProps) {
  // Estados para selects
  const [marcas, setMarcas] = useState<{ id_marca: number, nombre: string }[]>([])
  const [ubicaciones, setUbicaciones] = useState<{ id_ubicacion: number, nombre: string }[]>([])

  // Estado del formulario
  const [form, setForm] = useState<any>({
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
    id_ubicacion: "",
    nuevo_propietario: "",
    nueva_marca: "",
    nueva_ubicacion: "",
    ubicacion: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("http://localhost:3000/api/marcas").then(res => res.json()).then(setMarcas)
    fetch("http://localhost:3000/api/ubicaciones").then(res => res.json()).then(setUbicaciones)
  }, [open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Maneja el guardado de nuevas entidades si corresponde
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      let id_propietario = form.id_propietario
      let id_marca = form.id_marca
      let id_ubicacion = form.id_ubicacion

      // Si es nuevo propietario, crea y usa el nuevo id
      if (id_propietario === "__nuevo__") {
        const res = await fetch("http://localhost:3000/api/propietarios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre: form.nuevo_propietario }),
        })
        const data = await res.json()
        id_propietario = data.id_propietario
      }

      // Si es nueva marca, crea y usa el nuevo id
      if (id_marca === "__nuevo__") {
        const res = await fetch("http://localhost:3000/api/marcas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre: form.nueva_marca }),
        })
        const data = await res.json()
        id_marca = data.id_marca
      }

      // Si es nueva ubicación, crea y usa el nuevo id
      if (id_ubicacion === "__nuevo__") {
        const res = await fetch("http://localhost:3000/api/ubicaciones", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre: form.nueva_ubicacion }),
        })
        const data = await res.json()
        id_ubicacion = data.id_ubicacion
      }

      // Ahora sí, guarda el equipo
      const equipoPayload = {
        numero_serie: form.numero_serie,
        modelo: form.modelo,
        almacenamiento: form.almacenamiento,
        ram: form.ram,
        procesador: form.procesador,
        ip: form.ip,
        direccion_mac: form.direccion_mac,
        nombre_pc: form.nombre_pc,
        id_propietario: id_propietario && id_propietario !== "__nuevo__" ? Number(id_propietario) : null,
        id_marca: id_marca && id_marca !== "__nuevo__" ? Number(id_marca) : null,
        id_ubicacion: id_ubicacion && id_ubicacion !== "__nuevo__" ? Number(id_ubicacion) : null,
      }

      // Validación extra antes de enviar
      if (!equipoPayload.id_propietario || !equipoPayload.id_marca || !equipoPayload.id_ubicacion) {
        setError("Debe seleccionar o crear propietario, marca y ubicación.")
        setLoading(false)
        return
      }

      const res = await fetch("http://localhost:3000/api/equipos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(equipoPayload),
      })
      if (!res.ok) throw new Error("Error al agregar equipo")
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
        id_ubicacion: "",
        nuevo_propietario: "",
        nueva_marca: "",
        nueva_ubicacion: "",
        ubicacion: "",
      })
      onAdded()
      onClose()
    } catch (err: any) {
      setError(err.message || "Error al agregar equipo")
    } finally {
      setLoading(false)
    }
  }

  // Opciones para selects
  const propietariosSinTodos = propietarioOptions.filter(p => p !== "TODOS")

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar Equipo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
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

            {/* Ubicación */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
              <select
                name="id_ubicacion"
                value={form.id_ubicacion}
                onChange={handleChange}
                required
                className="border rounded px-2 py-2 text-gray-700 w-full"
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

            {/* Propietario */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Propietario (empresa)</label>
              <select
                name="id_propietario"
                value={form.id_propietario}
                onChange={handleChange}
                required
                className="border rounded px-2 py-2 text-gray-700 w-full"
              >
                <option value="">Seleccione un propietario...</option>
                {propietarioOptions.map((p) => (
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
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={loading}>{loading ? "Agregando..." : "Agregar"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}