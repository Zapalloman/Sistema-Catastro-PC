"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  X, 
  Save, 
  HardDrive, 
  Monitor, 
  Cpu, 
  MemoryStick,
  Calendar,
  FileText,
  Tag,
  Hash,
  Building,
  AlertCircle,
  Info
} from "lucide-react"

interface AddLatsurEquipmentModalProps {
  open: boolean
  onClose: () => void
  onEquipmentAdded: () => void
}

interface Marca {
  cod_ti_marca: number
  des_ti_marca: string
}

interface LatsurCategoria {
  idcategoria: number
  nomcategoria: string
  descripcion: string
  vigente: number
}

export function AddLatsurEquipmentModal({ open, onClose, onEquipmentAdded }: AddLatsurEquipmentModalProps) {
  const [marcas, setMarcas] = useState<Marca[]>([])
  const [categorias, setCategorias] = useState<LatsurCategoria[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [form, setForm] = useState({
    llave_inventario: "",
    nombre_pc: "",
    cod_ti_marca: "",
    modelo: "",
    numero_serie: "",
    almacenamiento: "",
    ram: "",
    procesador: "",
    version_sistema_operativo: "",
    version_office: "",
    idcategoria: "",
    observaciones: "",
  })

  useEffect(() => {
    if (open) {
      // Cargar marcas
      fetch("http://localhost:3000/api/equipos/marcas")
        .then(res => res.json())
        .then(data => setMarcas(Array.isArray(data) ? data : []))
        .catch(err => console.error("Error al cargar marcas:", err))

      // Cargar categorías LATSUR
      fetch("http://localhost:3000/api/equipos-latsur/categorias")
        .then(res => res.json())
        .then(data => setCategorias(Array.isArray(data) ? data : []))
        .catch(err => console.error("Error al cargar categorías:", err))
    }
  }, [open])

  const handleChange = (name: string, value: string) => {
    setForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Validación de campos obligatorios (sin llave_inventario)
      if (!form.numero_serie || !form.modelo || !form.cod_ti_marca || !form.idcategoria) {
        throw new Error("Por favor complete todos los campos obligatorios")
      }

      const equipoData = {
        llave_inventario: form.llave_inventario || null, // Puede ser null
        nombre_pc: form.nombre_pc || null,
        cod_ti_marca: Number(form.cod_ti_marca),
        modelo: form.modelo,
        numero_serie: form.numero_serie,
        almacenamiento: form.almacenamiento || null,
        ram: form.ram || null,
        procesador: form.procesador || null,
        version_sistema_operativo: form.version_sistema_operativo || null,
        version_office: form.version_office || null,
        idcategoria: Number(form.idcategoria),
        observaciones: form.observaciones || null,
        cod_ti_propietario: 4 // Automático para EMCO
      }

      console.log("Enviando datos del equipo LATSUR:", equipoData)

      const response = await fetch("http://localhost:3000/api/equipos-latsur", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(equipoData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error al crear el equipo")
      }

      const result = await response.json()
      console.log("Equipo LATSUR creado:", result)

      // Limpiar formulario
      setForm({
        llave_inventario: "",
        nombre_pc: "",
        cod_ti_marca: "",
        modelo: "",
        numero_serie: "",
        almacenamiento: "",
        ram: "",
        procesador: "",
        version_sistema_operativo: "",
        version_office: "",
        idcategoria: "",
        observaciones: "",
      })

      onEquipmentAdded()
      onClose()

    } catch (err: any) {
      console.error("Error al crear equipo LATSUR:", err)
      setError(err.message || "Error al crear el equipo")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setForm({
      llave_inventario: "",
      nombre_pc: "",
      cod_ti_marca: "",
      modelo: "",
      numero_serie: "",
      almacenamiento: "",
      ram: "",
      procesador: "",
      version_sistema_operativo: "",
      version_office: "",
      idcategoria: "",
      observaciones: "",
    })
    setError("")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="w-6 h-6 text-cyan-600" />
              <span className="text-xl font-bold">Agregar Equipo LATSUR</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {/* Información del propietario automático */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Building className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">Propietario Automático</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-blue-700">Todos los equipos LATSUR se asignan automáticamente a:</span>
            <Badge variant="outline" className="bg-blue-100 text-blue-800 font-semibold">
              EMCO (Propietario de equipos)
            </Badge>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
              <Hash className="w-5 h-5" />
              Información Básica (Obligatorio)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="llave_inventario" className="text-sm font-medium">
                  Llave Inventario <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="llave_inventario"
                  value={form.llave_inventario}
                  onChange={(e) => handleChange("llave_inventario", e.target.value)}
                  placeholder="Ej: INV-LATSUR-001"
                  className="bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nombre_pc" className="text-sm font-medium">
                  Nombre <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nombre_pc"
                  value={form.nombre_pc}
                  onChange={(e) => handleChange("nombre_pc", e.target.value)}
                  placeholder="Ej: LATSUR-WS01"
                  className="bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cod_ti_marca" className="text-sm font-medium">
                  Marca <span className="text-red-500">*</span>
                </Label>
                <Select value={form.cod_ti_marca} onValueChange={(value) => handleChange("cod_ti_marca", value)}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Seleccione una marca" />
                  </SelectTrigger>
                  <SelectContent>
                    {marcas.map((marca) => (
                      <SelectItem key={marca.cod_ti_marca} value={marca.cod_ti_marca.toString()}>
                        {marca.des_ti_marca}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="idcategoria" className="text-sm font-medium">
                  Categoría <span className="text-red-500">*</span>
                </Label>
                <Select value={form.idcategoria} onValueChange={(value) => handleChange("idcategoria", value)}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Seleccione una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((categoria) => (
                      <SelectItem key={categoria.idcategoria} value={categoria.idcategoria.toString()}>
                        {categoria.nomcategoria}
                        {categoria.descripcion && (
                          <span className="text-xs text-gray-500 ml-2">- {categoria.descripcion}</span>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Información del Equipo */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-900 mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Información del Equipo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="modelo" className="text-sm font-medium">
                  Modelo
                </Label>
                <Input
                  id="modelo"
                  value={form.modelo}
                  onChange={(e) => handleChange("modelo", e.target.value)}
                  placeholder="Ej: OptiPlex 7070"
                  className="bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numero_serie" className="text-sm font-medium">
                  Número de Serie
                </Label>
                <Input
                  id="numero_serie"
                  value={form.numero_serie}
                  onChange={(e) => handleChange("numero_serie", e.target.value)}
                  placeholder="Ej: SN12345678"
                  className="bg-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Especificaciones Técnicas */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200">
            <h3 className="font-semibold text-purple-900 mb-4 flex items-center gap-2">
              <Cpu className="w-5 h-5" />
              Especificaciones Técnicas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="procesador" className="text-sm font-medium flex items-center gap-1">
                  <Cpu className="w-4 h-4" />
                  Procesador
                </Label>
                <Input
                  id="procesador"
                  value={form.procesador}
                  onChange={(e) => handleChange("procesador", e.target.value)}
                  placeholder="Ej: Intel i7-9700"
                  className="bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ram" className="text-sm font-medium flex items-center gap-1">
                  <MemoryStick className="w-4 h-4" />
                  RAM
                </Label>
                <Input
                  id="ram"
                  value={form.ram}
                  onChange={(e) => handleChange("ram", e.target.value)}
                  placeholder="Ej: 16GB DDR4"
                  className="bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="almacenamiento" className="text-sm font-medium flex items-center gap-1">
                  <HardDrive className="w-4 h-4" />
                  Almacenamiento
                </Label>
                <Input
                  id="almacenamiento"
                  value={form.almacenamiento}
                  onChange={(e) => handleChange("almacenamiento", e.target.value)}
                  placeholder="Ej: 500GB SSD"
                  className="bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="version_sistema_operativo" className="text-sm font-medium flex items-center gap-1">
                  <Monitor className="w-4 h-4" />
                  Sistema Operativo
                </Label>
                <Input
                  id="version_sistema_operativo"
                  value={form.version_sistema_operativo}
                  onChange={(e) => handleChange("version_sistema_operativo", e.target.value)}
                  placeholder="Ej: Windows 11 Pro"
                  className="bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="version_office" className="text-sm font-medium flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  Versión Office
                </Label>
                <Input
                  id="version_office"
                  value={form.version_office}
                  onChange={(e) => handleChange("version_office", e.target.value)}
                  placeholder="Ej: Office 2021"
                  className="bg-white"
                />
              </div>
            </div>
          </div>

          {/* Propietario Info */}
          

          {/* Observaciones */}
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Observaciones
            </h3>
            <div className="space-y-2">
              <Label htmlFor="observaciones" className="text-sm font-medium">
                Observaciones adicionales
              </Label>
              <Textarea
                id="observaciones"
                value={form.observaciones}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange("observaciones", e.target.value)}
                placeholder="Ingrese cualquier observación adicional sobre el equipo..."
                rows={3}
                className="bg-white resize-none"
              />
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Equipo
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
