import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RutAutocomplete } from "./rut-autocomplete"

export function YourComponent() {
  const [showAddLoan, setShowAddLoan] = useState(false)

  const refrescaPrestamos = () => {
    // Lógica para refrescar la tabla de préstamos
  }

  return (
    <div>
      {/* Botón para abrir el modal */}
      <Button onClick={() => setShowAddLoan(true)}>Agregar Dispositivo</Button>

      {/* Modal */}
      <AddLoanModal
        open={showAddLoan}
        onClose={() => {
          console.log("Cerrando modal");
          setShowAddLoan(false);
        }}
        onLoanAdded={refrescaPrestamos}
      />
    </div>
  )
}

export function AddLoanModal({ open, onClose = () => {}, onLoanAdded }) {
  const [categorias, setCategorias] = useState([])
  const [selectedCategoria, setSelectedCategoria] = useState("")
  const [equipos, setEquipos] = useState([])
  const [search, setSearch] = useState("")
  const [selectedEquipos, setSelectedEquipos] = useState<number[]>([])
  const [rutRevisor, setRutRevisor] = useState("")
  const [rutEntrega, setRutEntrega] = useState("")
  const [rutResponsable, setRutResponsable] = useState("")
  const [cargoPrestamo, setCargoPrestamo] = useState("")
  const [motivo, setMotivo] = useState("")
  const [firma1, setFirma1] = useState({ nombre: "", cargoMilitar: "", cargoDepto: "", subrogante: false })
  const [firma2, setFirma2] = useState({ nombre: "", cargoMilitar: "", cargoDepto: "", subrogante: false })
  const [distribucion, setDistribucion] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch("http://localhost:3000/api/categorias")
      .then(res => res.json())
      .then(data => setCategorias(Array.isArray(data) ? data : data.categorias || []))
  }, [])

  useEffect(() => {
    let url = "http://localhost:3000/api/equipos/disponibles";
    if (selectedCategoria) {
      url += `?categoria=${selectedCategoria}`;
    }
    fetch(url)
      .then(res => res.json())
      .then(data => setEquipos(Array.isArray(data) ? data : []));
  }, [selectedCategoria])

  const filteredEquipos = equipos.filter(eq =>
    (eq.nombre_pc || "").toLowerCase().includes(search.toLowerCase()) ||
    (eq.numero_serie || "").toLowerCase().includes(search.toLowerCase()) ||
    (eq.modelo || "").toLowerCase().includes(search.toLowerCase()) ||
    (eq.almacenamiento || "").toLowerCase().includes(search.toLowerCase()) ||
    (eq.marca?.nombre || "").toLowerCase().includes(search.toLowerCase()) ||
    (eq.ubicacion?.nombre || "").toLowerCase().includes(search.toLowerCase())
  )

  const handleAddLoan = async () => {
    if (!rutRevisor || !rutEntrega || !rutResponsable || selectedEquipos.length === 0 || !cargoPrestamo) return;
    setLoading(true);
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
        estado: "1"
      })
    });
    const prestamo = await response.json();
    // Descargar el Word
    window.open(`http://localhost:3000/api/prestamos/${prestamo.id_prestamo}/documento`, "_blank");
    setLoading(false);
    onLoanAdded && onLoanAdded();
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={open => { if (!open) onClose(); }}>
      <DialogContent
        className="max-w-[1200px] w-full p-6"
        style={{ minWidth: 1100 }}
      >
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
                onChange={e => setSelectedCategoria(e.target.value)}
              >
                <option value="">Todos los dispositivos</option>
                {categorias.map(cat => (
                  <option key={cat.id_categoria} value={cat.id_categoria.toString()}>{cat.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Buscar dispositivo</label>
              <Input
                placeholder="Buscar por nombre, serie, modelo, etc..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full"
                autoComplete="off"
              />
            </div>
          </div>
          {/* Tabla de dispositivos con selección múltiple */}
          <div className="overflow-x-auto rounded border bg-white">
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
                  filteredEquipos.map(eq => (
                    <TableRow key={eq.id_equipo}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedEquipos.includes(eq.id_equipo)}
                          onChange={e => {
                            if (e.target.checked) setSelectedEquipos([...selectedEquipos, eq.id_equipo]);
                            else setSelectedEquipos(selectedEquipos.filter(id => id !== eq.id_equipo));
                          }}
                        />
                      </TableCell>
                      <TableCell>{eq.nombre_pc}</TableCell>
                      <TableCell>{eq.numero_serie}</TableCell>
                      <TableCell>{eq.modelo}</TableCell>
                      <TableCell>{eq.almacenamiento}</TableCell>
                      <TableCell>{eq.categoria?.nombre || "-"}</TableCell>
                      <TableCell>{eq.marca?.nombre || "-"}</TableCell>
                      <TableCell>{eq.ubicacion?.nombre || "-"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {/* Cargo del préstamo */}
          <div>
            <label className="block mb-1 font-medium">Cargo del préstamo</label>
            <select
              value={cargoPrestamo}
              onChange={e => setCargoPrestamo(e.target.value)}
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
              onChange={e => setMotivo(e.target.value)}
              className="w-full border rounded"
            />
          </div>
          {/* Firmas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Firma 1</label>
              <input
                placeholder="Nombre"
                value={firma1.nombre}
                onChange={e => setFirma1({ ...firma1, nombre: e.target.value })}
                className="border rounded px-2 py-2 w-full mb-2"
              />
              <input
                placeholder="Cargo militar"
                value={firma1.cargoMilitar}
                onChange={e => setFirma1({ ...firma1, cargoMilitar: e.target.value })}
                className="border rounded px-2 py-2 w-full mb-2"
              />
              <input
                placeholder="Cargo departamento"
                value={firma1.cargoDepto}
                onChange={e => setFirma1({ ...firma1, cargoDepto: e.target.value })}
                className="border rounded px-2 py-2 w-full mb-2"
              />
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={firma1.subrogante}
                  onChange={e => setFirma1({ ...firma1, subrogante: e.target.checked })}
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
                onChange={e => setFirma2({ ...firma2, nombre: e.target.value })}
                className="border rounded px-2 py-2 w-full mb-2"
              />
              <input
                placeholder="Cargo militar"
                value={firma2.cargoMilitar}
                onChange={e => setFirma2({ ...firma2, cargoMilitar: e.target.value })}
                className="border rounded px-2 py-2 w-full mb-2"
              />
              <input
                placeholder="Cargo departamento"
                value={firma2.cargoDepto}
                onChange={e => setFirma2({ ...firma2, cargoDepto: e.target.value })}
                className="border rounded px-2 py-2 w-full mb-2"
              />
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={firma2.subrogante}
                  onChange={e => setFirma2({ ...firma2, subrogante: e.target.checked })}
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
              onChange={e => setDistribucion(e.target.value)}
              className="w-full border rounded"
            />
          </div>
          {/* Botones */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
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