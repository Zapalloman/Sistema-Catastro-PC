"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RutAutocomplete } from "./rut-autocomplete"

interface Categoria {
  id_tipo: number      // <-- CAMBIAR de id_categoria a id_tipo
  desc_tipo: string    // <-- CAMBIAR de nombre a desc_tipo
}

interface Marca {
  nombre: string
}

interface Ubicacion {
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
  const [disponibles, setDisponibles] = useState<Equipo[]>([])
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
      let url = "http://localhost:3000/api/equipos/disponibles"
      if (selectedCategoria) {
        url += `?categoria=${selectedCategoria}`
      }
      fetch(url)
        .then((res) => res.json())
        .then((data) => setEquipos(Array.isArray(data) ? data : []))
        .catch((err) => console.error("Error fetching equipos:", err))
    }
  }, [selectedCategoria])

  const filteredEquipos = equipos.filter(
    (eq) =>
      (eq.nombre_pc || "").toLowerCase().includes(search.toLowerCase()) ||
      (eq.numero_serie || "").toLowerCase().includes(search.toLowerCase()) ||
      (eq.modelo || "").toLowerCase().includes(search.toLowerCase()) ||
      (eq.almacenamiento || "").toLowerCase().includes(search.toLowerCase()) ||
      (eq.marca?.nombre || "").toLowerCase().includes(search.toLowerCase()) ||
      (eq.ubicacion?.nombre || "").toLowerCase().includes(search.toLowerCase()),
  )

  const handleAddLoan = async () => {
    if (!rutRevisor || !rutEntrega || !rutResponsable || selectedEquipos.length === 0 || !cargoPrestamo) {
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

      const prestamo = await response.json()

      // Descargar el Word
      window.open(`http://localhost:3000/api/prestamos/${prestamo.id_prestamo}/documento`, "_blank")

      // Reset form
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

      onLoanAdded && onLoanAdded()
      onClose()
    } catch (error) {
      console.error("Error creating loan:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    // Reset form when closing
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
    onClose()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose()
      }}
    >
      <DialogContent className="max-w-[1200px] w-full p-6" style={{ minWidth: 1100 }}>
        <DialogHeader>
          <DialogTitle>Agregar Préstamo</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Selección de funcionarios */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 font-medium">Funcionario que revisa</label>
              <RutAutocomplete value={rutRevisor} onChange={setRutRevisor} />
            </div>
            <div>
              <label className="block mb-1 font-medium">Funcionario que entrega</label>
              <RutAutocomplete value={rutEntrega} onChange={setRutEntrega} />
            </div>
            <div>
              <label className="block mb-1 font-medium">Responsable de la unidad</label>
              <RutAutocomplete value={rutResponsable} onChange={setRutResponsable} />
            </div>
          </div>

          {/* Selección de categoría y búsqueda */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Categoría</label>
              <select
                className="border rounded px-2 py-2 w-full"
                value={selectedCategoria}
                onChange={(e) => setSelectedCategoria(e.target.value)}
              >
                <option value="">Seleccione una categoría</option>
                {categorias
                  .filter((cat) => cat && cat.desc_tipo && cat.desc_tipo !== "OTRO") // <-- USAR desc_tipo
                  .sort((a, b) => (a.desc_tipo || "").localeCompare(b.desc_tipo || ""))
                  .map((cat) => (
                    <option key={cat.id_tipo} value={cat.desc_tipo}> {/* <-- USAR id_tipo y desc_tipo */}
                      {cat.desc_tipo}  {/* <-- USAR desc_tipo */}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Buscar dispositivo</label>
              <Input
                placeholder="Buscar por nombre, serie, modelo, etc..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
                autoComplete="off"
              />
            </div>
          </div>

          {/* Tabla de dispositivos con selección múltiple */}
          {selectedCategoria && (
            <div className="overflow-x-auto rounded border bg-white max-h-[400px] mt-4">
              <Table className="min-w-[1000px]">
                <TableHeader>
                  <TableRow>
                    <TableHead></TableHead>
                    <TableHead>Nombre PC</TableHead>
                    <TableHead>Serie</TableHead>
                    <TableHead>Modelo</TableHead>
                    <TableHead>Capacidad</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Marca</TableHead>
                    <TableHead>Ubicación</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEquipos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-gray-500">
                        No hay dispositivos disponibles para esta categoría o búsqueda.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEquipos.map((eq) => (
                      <TableRow key={eq.id_equipo}>
                        <TableCell>
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
                          />
                        </TableCell>
                        <TableCell>{eq.nombre_pc}</TableCell>
                        <TableCell>{eq.numero_serie}</TableCell>
                        <TableCell>{eq.modelo}</TableCell>
                        <TableCell>{eq.almacenamiento}</TableCell>
                        <TableCell>{eq.categoria?.desc_tipo || eq.categoria?.nombre || "-"}</TableCell> {/* <-- AGREGAR desc_tipo */}
                        <TableCell>{eq.marca?.des_ti_marca || eq.marca?.nombre || "-"}</TableCell>     {/* <-- AGREGAR des_ti_marca */}
                        <TableCell>{eq.ubicacion?.des_ti_ubicacion || eq.ubicacion?.nombre || "-"}</TableCell> {/* <-- AGREGAR des_ti_ubicacion */}
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </div>
          )}

          {/* Cargo del préstamo */}
          <div>
            <label className="block mb-1 font-medium">Cargo del préstamo</label>
            <select
              value={cargoPrestamo}
              onChange={(e) => setCargoPrestamo(e.target.value)}
              className="border rounded px-2 py-2 w-full"
            >
              <option value="">Seleccione...</option>
              <option value="FISCAL">Fiscal</option>
              <option value="PARTICULAR">Particular</option>
            </select>
          </div>

          {/* Motivo */}
          <div>
            <label className="block mb-1 font-medium">Motivo</label>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="w-full border rounded px-2 py-2"
              rows={3}
            />
          </div>

          {/* Firmas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Firma 1</label>
              <input
                placeholder="Nombre"
                value={firma1.nombre}
                onChange={(e) => setFirma1({ ...firma1, nombre: e.target.value })}
                className="border rounded px-2 py-2 w-full mb-2"
              />
              <input
                placeholder="Cargo militar"
                value={firma1.cargoMilitar}
                onChange={(e) => setFirma1({ ...firma1, cargoMilitar: e.target.value })}
                className="border rounded px-2 py-2 w-full mb-2"
              />
              <input
                placeholder="Cargo departamento"
                value={firma1.cargoDepto}
                onChange={(e) => setFirma1({ ...firma1, cargoDepto: e.target.value })}
                className="border rounded px-2 py-2 w-full mb-2"
              />
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={firma1.subrogante}
                  onChange={(e) => setFirma1({ ...firma1, subrogante: e.target.checked })}
                  className="mr-2"
                />
                Subrogante
              </label>
            </div>
            <div>
              <label className="block mb-1 font-medium">Firma 2</label>
              <input
                placeholder="Nombre"
                value={firma2.nombre}
                onChange={(e) => setFirma2({ ...firma2, nombre: e.target.value })}
                className="border rounded px-2 py-2 w-full mb-2"
              />
              <input
                placeholder="Cargo militar"
                value={firma2.cargoMilitar}
                onChange={(e) => setFirma2({ ...firma2, cargoMilitar: e.target.value })}
                className="border rounded px-2 py-2 w-full mb-2"
              />
              <input
                placeholder="Cargo departamento"
                value={firma2.cargoDepto}
                onChange={(e) => setFirma2({ ...firma2, cargoDepto: e.target.value })}
                className="border rounded px-2 py-2 w-full mb-2"
              />
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={firma2.subrogante}
                  onChange={(e) => setFirma2({ ...firma2, subrogante: e.target.checked })}
                  className="mr-2"
                />
                Subrogante
              </label>
            </div>
          </div>

          {/* Distribución */}
          <div>
            <label className="block mb-1 font-medium">Distribución (destinatarios)</label>
            <textarea
              value={distribucion}
              onChange={(e) => setDistribucion(e.target.value)}
              className="w-full border rounded px-2 py-2"
              rows={3}
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
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
            >
              {loading ? "Agregando..." : "Agregar Préstamo"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
