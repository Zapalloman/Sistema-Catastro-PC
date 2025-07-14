"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Search } from "lucide-react"

interface Parametro {
  id_parametro: number
  nombre: string
  valor: string
  descripcion: string
  estado: number
}

interface ParametersTableProps {
  selectedParameterType: string
  parametros: Parametro[]
  loading: boolean
  onParametroAdded: () => void
}

export function ParametersTable({ 
  selectedParameterType, 
  parametros, 
  loading, 
  onParametroAdded 
}: ParametersTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingParametro, setEditingParametro] = useState<Parametro | null>(null)
  const [form, setForm] = useState({
    valor: "",
    descripcion: ""
  })
  const [submitting, setSubmitting] = useState(false)

  // Filtrar parámetros por búsqueda
  const filteredParametros = parametros.filter(p =>
    p.valor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.descripcion || "").toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAdd = () => {
    setForm({ valor: "", descripcion: "" })
    setEditingParametro(null)
    setShowAddModal(true)
  }

  const handleEdit = (parametro: Parametro) => {
    setForm({ valor: parametro.valor, descripcion: parametro.descripcion || "" })
    setEditingParametro(parametro)
    setShowAddModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.valor.trim()) return

    setSubmitting(true)
    try {
      const url = editingParametro 
        ? `http://localhost:3000/api/parametros-generales/${editingParametro.id_parametro}`
        : "http://localhost:3000/api/parametros-generales"
      
      const method = editingParametro ? "PUT" : "POST"
      
      const payload = editingParametro 
        ? { valor: form.valor, descripcion: form.descripcion }
        : { 
            nombre: selectedParameterType, 
            valor: form.valor, 
            descripcion: form.descripcion 
          }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        setShowAddModal(false)
        setForm({ valor: "", descripcion: "" })
        setEditingParametro(null)
        onParametroAdded()
      } else {
        alert("Error al guardar parámetro")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al guardar parámetro")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("¿Está seguro de eliminar este parámetro?")) return

    try {
      const response = await fetch(`http://localhost:3000/api/parametros-generales/${id}`, {
        method: "DELETE"
      })

      if (response.ok) {
        onParametroAdded()
      } else {
        alert("Error al eliminar parámetro")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al eliminar parámetro")
    }
  }

  return (
    <>
      <div className="p-6">
        {/* Header con búsqueda y botón agregar */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold">
              {selectedParameterType} ({filteredParametros.length})
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar parámetros..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar
          </Button>
        </div>

        {/* Tabla */}
        {loading ? (
          <div className="text-center py-8">Cargando parámetros...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Valor</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParametros.map((parametro) => (
                <TableRow key={parametro.id_parametro}>
                  <TableCell className="font-medium">{parametro.valor}</TableCell>
                  <TableCell>{parametro.descripcion || "-"}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      parametro.estado === 1 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {parametro.estado === 1 ? 'Activo' : 'Inactivo'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(parametro)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(parametro.id_parametro)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredParametros.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    No se encontraron parámetros
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Modal para agregar/editar */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingParametro ? "Editar" : "Agregar"} {selectedParameterType}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Valor</label>
              <Input
                value={form.valor}
                onChange={(e) => setForm(prev => ({ ...prev, valor: e.target.value }))}
                placeholder="Ingrese el valor"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Descripción</label>
              <Input
                value={form.descripcion}
                onChange={(e) => setForm(prev => ({ ...prev, descripcion: e.target.value }))}
                placeholder="Descripción opcional"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Guardando..." : "Guardar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
