"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RutAutocomplete } from "./rut-autocomplete"

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
        className="w-screen max-w-none h-[90vh] mx-4 p-0"
        style={{ width: 'calc(100vw - 2rem)', maxWidth: 'none' }}
      >
        <div className="h-full flex flex-col">
          <DialogHeader className="p-8 pb-4 border-b bg-white sticky top-0 z-10">
            <DialogTitle className="text-xl font-bold text-gray-900">Agregar Préstamo de Equipos</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto p-8 pt-6 space-y-6">
          {/* Funcionarios - Una sola fila horizontal */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Información de Funcionarios</h3>
            <div className="grid grid-cols-3 gap-8">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Funcionario que revisa *</label>
                <RutAutocomplete 
                  value={rutRevisor} 
                  onChange={setRutRevisor}
                  onUserSelected={(user) => {
                    console.log("Usuario revisor seleccionado:", user)
                  }}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Funcionario que entrega *</label>
                <RutAutocomplete 
                  value={rutEntrega} 
                  onChange={setRutEntrega}
                  onUserSelected={(user) => {
                    console.log("Usuario entrega seleccionado:", user)
                  }}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Responsable de la unidad *</label>
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
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Selección de Equipos</h3>
            <div className="grid grid-cols-2 gap-8 mb-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Categoría *</label>
                <select
                  className="border rounded px-4 py-3 w-full text-base focus:ring-2 focus:ring-blue-500"
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

            {/* Tabla de equipos - Mucho más amplia */}
            {selectedCategoria && (
              <div className="border rounded-lg bg-white max-h-80 overflow-y-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-gray-100">
                    <TableRow>
                      <TableHead className="w-20 text-center">Seleccionar</TableHead>
                      <TableHead className="min-w-[180px]">Nombre PC</TableHead>
                      <TableHead className="min-w-[160px]">Serie</TableHead>
                      <TableHead className="min-w-[200px]">Modelo</TableHead>
                      <TableHead className="min-w-[140px]">Capacidad</TableHead>
                      <TableHead className="min-w-[120px]">Categoría</TableHead>
                      <TableHead className="min-w-[160px]">Marca</TableHead>
                      <TableHead className="min-w-[160px]">Ubicación</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEquipos.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                          {equipos.length === 0 ? "No hay dispositivos disponibles para esta categoría" : "No se encontraron dispositivos con ese criterio de búsqueda"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredEquipos.map((eq) => (
                        <TableRow key={eq.id_equipo} className="hover:bg-gray-50">
                          <TableCell className="text-center">
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
                              className="w-5 h-5"
                            />
                          </TableCell>
                          <TableCell className="font-medium text-base">{eq.nombre_pc || "-"}</TableCell>
                          <TableCell className="font-mono">{eq.numero_serie || "-"}</TableCell>
                          <TableCell className="text-base">{eq.modelo || "-"}</TableCell>
                          <TableCell className="text-base">{eq.almacenamiento || "-"}</TableCell>
                          <TableCell className="text-base">{eq.categoria?.desc_tipo || "-"}</TableCell>
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
              <div className="mt-4 text-base text-green-600 font-medium">
                {selectedEquipos.length} equipo(s) seleccionado(s)
              </div>
            )}
          </div>

          {/* Información del Préstamo e Firmas - Layout más horizontal */}
          <div className="grid grid-cols-2 gap-10">
            {/* Información del Préstamo */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-6 text-gray-800">Información del Préstamo</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Cargo del préstamo *</label>
                    <select
                      value={cargoPrestamo}
                      onChange={(e) => setCargoPrestamo(e.target.value)}
                      className="border rounded px-4 py-3 w-full text-base focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccione...</option>
                      <option value="FISCAL">Fiscal</option>
                      <option value="PARTICULAR">Particular</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Distribución</label>
                    <Input
                      value={distribucion}
                      onChange={(e) => setDistribucion(e.target.value)}
                      placeholder="Ej: 3 copias: Original - Triplicado - Archivo"
                      className="w-full text-base py-3"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Motivo del préstamo</label>
                  <textarea
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    className="w-full border rounded px-4 py-3 text-base focus:ring-2 focus:ring-blue-500"
                    rows={5}
                    placeholder="Describa el motivo del préstamo..."
                  />
                </div>
              </div>
            </div>

            {/* Firmas */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-6 text-gray-800">Firmas del Documento</h3>
              
              {/* Firma 1 */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-4">Primera Firma</h4>
                <div className="space-y-4">
                  <Input
                    value={firma1.nombre}
                    onChange={(e) => setFirma1({...firma1, nombre: e.target.value})}
                    placeholder="Nombre completo"
                    className="text-base py-3"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      value={firma1.cargoMilitar}
                      onChange={(e) => setFirma1({...firma1, cargoMilitar: e.target.value})}
                      placeholder="Cargo militar"
                      className="text-base py-3"
                    />
                    <Input
                      value={firma1.cargoDepto}
                      onChange={(e) => setFirma1({...firma1, cargoDepto: e.target.value})}
                      placeholder="Cargo departamento"
                      className="text-base py-3"
                    />
                  </div>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={firma1.subrogante}
                      onChange={(e) => setFirma1({...firma1, subrogante: e.target.checked})}
                      className="w-5 h-5"
                    />
                    <span className="text-base text-gray-600">Subrogante</span>
                  </label>
                </div>
              </div>

              {/* Firma 2 */}
              <div>
                <h4 className="font-medium text-gray-700 mb-4">Segunda Firma</h4>
                <div className="space-y-4">
                  <Input
                    value={firma2.nombre}
                    onChange={(e) => setFirma2({...firma2, nombre: e.target.value})}
                    placeholder="Nombre completo"
                    className="text-base py-3"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      value={firma2.cargoMilitar}
                      onChange={(e) => setFirma2({...firma2, cargoMilitar: e.target.value})}
                      placeholder="Cargo militar"
                      className="text-base py-3"
                    />
                    <Input
                      value={firma2.cargoDepto}
                      onChange={(e) => setFirma2({...firma2, cargoDepto: e.target.value})}
                      placeholder="Cargo departamento"
                      className="text-base py-3"
                    />
                  </div>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={firma2.subrogante}
                      onChange={(e) => setFirma2({...firma2, subrogante: e.target.checked})}
                      className="w-5 h-5"
                    />
                    <span className="text-base text-gray-600">Subrogante</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-6 pt-6 border-t border-gray-200">
            <Button variant="outline" onClick={handleClose} disabled={loading} size="lg">
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
              size="lg"
            >
              {loading ? "Generando préstamo..." : "Generar Préstamo"}
            </Button>
          </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}