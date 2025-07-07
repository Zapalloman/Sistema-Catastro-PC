import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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
  const [selectedEquipo, setSelectedEquipo] = useState(null)
  const [rutFuncionario, setRutFuncionario] = useState("") // NUEVO
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch("http://localhost:3000/api/categorias")
      .then(res => res.json())
      .then(data => setCategorias(Array.isArray(data) ? data : data.categorias || []))
  }, [])

  useEffect(() => {
    if (selectedCategoria) {
      fetch(`http://localhost:3000/api/equipos/disponibles?categoria=${selectedCategoria}`)
        .then(res => res.json())
        .then(data => setEquipos(Array.isArray(data) ? data : []))
    } else {
      setEquipos([])
    }
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
    if (!selectedEquipo || !rutFuncionario) return
    setLoading(true)
    await fetch("http://localhost:3000/api/prestamos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_equipo: selectedEquipo,
        rut_usuario: rutFuncionario, // Usa el rut ingresado
        fecha_prestamo: new Date().toISOString().slice(0, 10),
        estado: "1"
      })
    })
    setLoading(false)
    onLoanAdded && onLoanAdded()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={open => { if (!open) onClose(); }}>
      <DialogContent
        className="w-[950px] max-w-[98vw] p-6"
        style={{ minWidth: 1000 }}
      >
        <DialogHeader>
          <DialogTitle>Agregar Préstamo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Campo para RUT */}
          <div>
            <label className="block mb-1 font-medium">RUT Funcionario</label>
            <Input
              placeholder="Ingrese el RUT del funcionario"
              value={rutFuncionario}
              onChange={e => setRutFuncionario(e.target.value)}
              className="w-full"
            />
          </div>
          {/* Select de categoría */}
          <div>
            <label className="block mb-1 font-medium">Categoría</label>
            <select
              className="border rounded px-2 py-2 w-full"
              value={selectedCategoria}
              onChange={e => setSelectedCategoria(e.target.value)}
            >
              <option value="">Seleccione una categoría...</option>
              {categorias.map(cat => (
                <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombre}</option>
              ))}
            </select>
          </div>
          {/* Filtro de búsqueda */}
          <Input
            placeholder="Buscar dispositivo por nombre, serie, modelo, etc..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full"
            disabled={!selectedCategoria}
          />
          {/* Tabla responsiva de dispositivos */}
          <div className="overflow-x-auto rounded border">
            <Table className="min-w-[900px]">
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
                    <TableRow
                      key={eq.id_equipo}
                      className={selectedEquipo === eq.id_equipo ? "bg-blue-100" : ""}
                      onClick={() => setSelectedEquipo(eq.id_equipo)}
                      style={{ cursor: "pointer" }}
                    >
                      <TableCell>
                        <input
                          type="radio"
                          name="equipo"
                          checked={selectedEquipo === eq.id_equipo}
                          onChange={() => setSelectedEquipo(eq.id_equipo)}
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
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleAddLoan} disabled={!selectedEquipo || !rutFuncionario || loading}>
              {loading ? "Agregando..." : "Agregar Préstamo"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}