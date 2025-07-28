"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RutAutocomplete } from "./rut-autocomplete"
import { Users, X, Filter, Search, Download } from "lucide-react"

interface Categoria {
  id_tipo: number
  desc_tipo: string
}

interface Marca {
  des_ti_marca: string
  nombre: string
}

interface Ubicacion {
  des_ti_ubicacion: string
  nombre: string
}

interface Equipo {
  id_equipo: number
  nombre_pc: string
  numero_serie: string
  modelo: string
  almacenamiento: string
  categoria?: Categoria
  marca?: Marca
  ubicacion?: Ubicacion
}

interface Firma {
  nombre: string
  cargoMilitar: string
  cargoDepto: string
  subrogante: boolean
}

interface AddLoanModalProps {
  open: boolean
  onClose: () => void
  onLoanAdded?: () => void
}

export function AddLoanModal({ open, onClose, onLoanAdded }: AddLoanModalProps) {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [selectedCategoria, setSelectedCategoria] = useState("")
  const [equipos, setEquipos] = useState<Equipo[]>([])
  const [search, setSearch] = useState("")
  const [selectedEquipos, setSelectedEquipos] = useState<number[]>([])
  const [rutRevisor, setRutRevisor] = useState("")
  const [rutEntrega, setRutEntrega] = useState("")
  const [rutResponsable, setRutResponsable] = useState("")
  const [cargoPrestamo, setCargoPrestamo] = useState("")
  const [motivo, setMotivo] = useState("")
  const [firma1, setFirma1] = useState<Firma>({
    nombre: "",
    cargoMilitar: "",
    cargoDepto: "",
    subrogante: false,
  })
  const [firma2, setFirma2] = useState<Firma>({
    nombre: "",
    cargoMilitar: "",
    cargoDepto: "",
    subrogante: false,
  })
  const [distribucion, setDistribucion] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      fetch("http://localhost:3000/api/equipos/categorias")
        .then((res) => res.json())
        .then((data) => {
          console.log("Categorías cargadas:", data)
          const categoriasArray = Array.isArray(data) ? data : []
          setCategorias(categoriasArray)
        })
        .catch((err) => {
          console.error("Error fetching categorias:", err)
          setCategorias([])
        })
    }
  }, [open])

  useEffect(() => {
    if (selectedCategoria) {
      console.log("Cargando equipos para categoría:", selectedCategoria)
      let url = "http://localhost:3000/api/equipos/disponibles"
      if (selectedCategoria && selectedCategoria !== "TODOS") {
        url += `?categoria=${encodeURIComponent(selectedCategoria)}`
      }

      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          console.log("Equipos cargados:", data)
          setEquipos(Array.isArray(data) ? data : [])
        })
        .catch((err) => {
          console.error("Error fetching equipos:", err)
          setEquipos([])
        })
    }
  }, [selectedCategoria])

  const filteredEquipos = equipos.filter(
    (eq) =>
      (eq.nombre_pc || "").toLowerCase().includes(search.toLowerCase()) ||
      (eq.numero_serie || "").toLowerCase().includes(search.toLowerCase()) ||
      (eq.modelo || "").toLowerCase().includes(search.toLowerCase()) ||
      (eq.almacenamiento || "").toLowerCase().includes(search.toLowerCase())
  )

  const handleAddLoan = async () => {
    if (!rutRevisor || !rutEntrega || !rutResponsable || selectedEquipos.length === 0 || !cargoPrestamo) {
      alert("Por favor complete todos los campos obligatorios")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("http://localhost:3000/api/prestamos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rut_revisor: rutRevisor,
          rut_entrega: rutEntrega,
          rut_responsable: rutResponsable,
          equipos: selectedEquipos,
          cargo_prestamo: cargoPrestamo,
          descripcion: motivo,
          firma1_nombre: firma1.nombre,
          firma1_cargo_militar: firma1.cargoMilitar,
          firma1_cargo_departamento: firma1.cargoDepto,
          firma1_subrogante: firma1.subrogante,
          firma2_nombre: firma2.nombre,
          firma2_cargo_militar: firma2.cargoMilitar,
          firma2_cargo_departamento: firma2.cargoDepto,
          firma2_subrogante: firma2.subrogante,
          distribucion,
          fecha_prestamo: new Date().toISOString().slice(0, 10),
          estado: "1",
        }),
      })

      if (!response.ok) {
        throw new Error("Error al crear el préstamo")
      }

      const prestamo = await response.json()

      window.open(`http://localhost:3000/api/prestamos/${prestamo.id_prestamo}/documento`, "_blank")

      handleClose()
      onLoanAdded && onLoanAdded()
    } catch (error) {
      console.error("Error creating loan:", error)
      alert("Error al crear el préstamo")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    console.log("Cerrando modal y limpiando estado")
    setSelectedEquipos([])
    setRutRevisor("")
    setRutEntrega("")
    setRutResponsable("")
    setCargoPrestamo("")
    setMotivo("")
    setFirma1({ nombre: "", cargoMilitar: "", cargoDepto: "", subrogante: false })
    setFirma2({ nombre: "", cargoMilitar: "", cargoDepto: "", subrogante: false })
    setDistribucion("")
    setSelectedCategoria("")
    setSearch("")
    setEquipos([])
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent 
        className="p-0 overflow-hidden border-0 shadow-2xl"
        style={{ 
          width: '98vw',
          height: '96vh',
          maxWidth: '98vw',
          maxHeight: '96vh'
        }}
      >
        <DialogHeader className="shrink-0 border-b bg-gradient-to-r from-green-600 to-green-800 text-white px-4 py-3 rounded-t-lg m-0">
          <DialogTitle className="flex items-center justify-between w-full text-white">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Sistema de Préstamos de Equipos IGM</h1>
                <p className="text-green-100 text-xs font-normal mt-0.5">
                  Gestión integral de préstamos y documentación automática
                </p>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              onClick={handleClose}
              className="text-white hover:bg-white/20 p-2 h-auto"
              disabled={loading}
            >
              <X className="w-5 h-5" />
            </Button>
          </DialogTitle>
        </DialogHeader>

          {/* CONTENIDO CON SCROLL */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Funcionarios - Una sola fila horizontal */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="text-base font-semibold mb-2 text-gray-800">Información de Funcionarios</h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Funcionario que revisa *</label>
                <RutAutocomplete 
                  value={rutRevisor} 
                  onChange={setRutRevisor}
                  onUserSelected={(user) => {
                    console.log("Usuario revisor seleccionado:", user)
                  }}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Funcionario que entrega *</label>
                <RutAutocomplete 
                  value={rutEntrega} 
                  onChange={setRutEntrega}
                  onUserSelected={(user) => {
                    console.log("Usuario entrega seleccionado:", user)
                  }}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Responsable de la unidad *</label>
                <RutAutocomplete 
                  value={rutResponsable} 
                  onChange={setRutResponsable}
                  onUserSelected={(user) => {
                    console.log("Usuario responsable seleccionado:", user)
                  }}
                />
              </div>
            </div>
          </div>

          {/* Selección de Equipos - Layout horizontal */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="text-base font-semibold mb-2 text-gray-800">Selección de Equipos</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Categoría *</label>
                <select
                  className="border rounded px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-500"
                  value={selectedCategoria}
                  onChange={(e) => setSelectedCategoria(e.target.value)}
                >
                  <option value="">Seleccione una categoría</option>
                  {categorias
                    .filter((cat) => cat && cat.desc_tipo && cat.desc_tipo !== "OTRO")
                    .sort((a, b) => (a.desc_tipo || "").localeCompare(b.desc_tipo || ""))
                    .map((cat) => (
                      <option key={cat.id_tipo} value={cat.desc_tipo}>
                        {cat.desc_tipo}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Buscar dispositivo</label>
                <Input
                  placeholder="Buscar por nombre, serie, modelo..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full text-base py-3"
                />
              </div>
            </div>

            {/* Tabla de equipos - Compacta */}
            {selectedCategoria && (
              <div className="border rounded-lg bg-white max-h-60 overflow-y-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-gray-100">
                    <TableRow>
                      <TableHead className="w-16 text-center text-xs">Sel.</TableHead>
                      <TableHead className="min-w-[140px] text-xs">Nombre PC</TableHead>
                      <TableHead className="min-w-[120px] text-xs">Serie</TableHead>
                      <TableHead className="min-w-[150px] text-xs">Modelo</TableHead>
                      <TableHead className="min-w-[100px] text-xs">Capacidad</TableHead>
                      <TableHead className="min-w-[100px] text-xs">Categoría</TableHead>
                      <TableHead className="min-w-[120px] text-xs">Marca</TableHead>
                      <TableHead className="min-w-[120px] text-xs">Ubicación</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEquipos.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-4 text-gray-500 text-sm">
                          {equipos.length === 0 ? "No hay dispositivos disponibles para esta categoría" : "No se encontraron dispositivos con ese criterio de búsqueda"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredEquipos.map((eq) => (
                        <TableRow key={eq.id_equipo} className="hover:bg-gray-50">
                          <TableCell className="text-center py-2">
                            <input
                              type="checkbox"
                              checked={selectedEquipos.includes(eq.id_equipo)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedEquipos([...selectedEquipos, eq.id_equipo])
                                } else {
                                  setSelectedEquipos(selectedEquipos.filter((id) => id !== eq.id_equipo))
                                }
                              }}
                              className="w-4 h-4"
                            />
                          </TableCell>
                          <TableCell className="font-medium text-sm py-2">{eq.nombre_pc || "-"}</TableCell>
                          <TableCell className="font-mono text-sm py-2">{eq.numero_serie || "-"}</TableCell>
                          <TableCell className="text-sm py-2">{eq.modelo || "-"}</TableCell>
                          <TableCell className="text-sm py-2">{eq.almacenamiento || "-"}</TableCell>
                          <TableCell className="text-sm py-2">{eq.categoria?.desc_tipo || "-"}</TableCell>
                          <TableCell className="text-base">{eq.marca?.des_ti_marca || eq.marca?.nombre || "-"}</TableCell>
                          <TableCell className="text-base">{eq.ubicacion?.des_ti_ubicacion || eq.ubicacion?.nombre || "-"}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
            
            {selectedEquipos.length > 0 && (
              <div className="mt-2 text-sm text-green-600 font-medium">
                {selectedEquipos.length} equipo(s) seleccionado(s)
              </div>
            )}
          </div>

          {/* Información del Préstamo e Firmas - Layout más horizontal */}
          <div className="grid grid-cols-2 gap-6">
            {/* Información del Préstamo */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="text-base font-semibold mb-2 text-gray-800">Información del Préstamo</h3>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Cargo del préstamo *</label>
                    <select
                      value={cargoPrestamo}
                      onChange={(e) => setCargoPrestamo(e.target.value)}
                      className="border rounded px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccione...</option>
                      <option value="FISCAL">Fiscal</option>
                      <option value="PARTICULAR">Particular</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Distribución</label>
                    <Input
                      value={distribucion}
                      onChange={(e) => setDistribucion(e.target.value)}
                      placeholder="Ej: 3 copias: Original - Triplicado - Archivo"
                      className="w-full text-sm py-2"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Motivo del préstamo</label>
                  <textarea
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Describa el motivo del préstamo..."
                  />
                </div>
              </div>
            </div>

            {/* Firmas */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="text-base font-semibold mb-2 text-gray-800">Firmas del Documento</h3>
              
              {/* Firmas en layout horizontal */}
              <div className="grid grid-cols-2 gap-3">
                {/* Firma 1 */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-1 text-sm">Primera Firma</h4>
                  <div className="space-y-1">
                    <Input
                      value={firma1.nombre}
                      onChange={(e) => setFirma1({...firma1, nombre: e.target.value})}
                      placeholder="Nombre completo"
                      className="text-xs py-1"
                    />
                    <div className="grid grid-cols-2 gap-1">
                      <Input
                        value={firma1.cargoMilitar}
                        onChange={(e) => setFirma1({...firma1, cargoMilitar: e.target.value})}
                        placeholder="Cargo militar"
                        className="text-sm py-2"
                      />
                      <Input
                        value={firma1.cargoDepto}
                        onChange={(e) => setFirma1({...firma1, cargoDepto: e.target.value})}
                        placeholder="Cargo departamento"
                        className="text-sm py-2"
                      />
                    </div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={firma1.subrogante}
                        onChange={(e) => setFirma1({...firma1, subrogante: e.target.checked})}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-600">Subrogante</span>
                    </label>
                  </div>
                </div>

                {/* Firma 2 */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-2 text-sm">Segunda Firma</h4>
                  <div className="space-y-2">
                    <Input
                      value={firma2.nombre}
                      onChange={(e) => setFirma2({...firma2, nombre: e.target.value})}
                      placeholder="Nombre completo"
                      className="text-sm py-2"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        value={firma2.cargoMilitar}
                        onChange={(e) => setFirma2({...firma2, cargoMilitar: e.target.value})}
                        placeholder="Cargo militar"
                        className="text-sm py-2"
                      />
                      <Input
                        value={firma2.cargoDepto}
                        onChange={(e) => setFirma2({...firma2, cargoDepto: e.target.value})}
                        placeholder="Cargo departamento"
                        className="text-sm py-2"
                      />
                    </div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={firma2.subrogante}
                        onChange={(e) => setFirma2({...firma2, subrogante: e.target.checked})}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-600">Subrogante</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-4 pt-3 border-t border-gray-200">
            <Button variant="outline" onClick={handleClose} disabled={loading}>
              Cancelar
            </Button>
            <Button
              onClick={handleAddLoan}
              disabled={
                !rutRevisor ||
                !rutEntrega ||
                !rutResponsable ||
                selectedEquipos.length === 0 ||
                !cargoPrestamo ||
                loading
              }
              className="bg-teal-600 hover:bg-teal-700"
            >
              {loading ? "Generando préstamo..." : "Generar Préstamo"}
            </Button>
          </div>
          
          </div> {/* Fin contenido con scroll */}
      </DialogContent>
    </Dialog>
  )
}