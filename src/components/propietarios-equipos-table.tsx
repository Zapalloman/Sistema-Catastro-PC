"use client"
import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function PropietariosEquiposTable() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch("http://localhost:3000/api/parametros-generales/propietarios-con-equipos")
      .then(res => res.json())
      .then(res => setData(Array.isArray(res) ? res : []))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Cargando...</div>

  return (
    <div className="p-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Propietario</TableHead>
            <TableHead>Equipos</TableHead>
            <TableHead>Usuarios</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row: any) => (
            <TableRow key={row.propietario.COD_TI_PROPIETARIO}>
              <TableCell>{row.propietario.DES_TI_PROPIETARIO}</TableCell>
              <TableCell>
                {row.equipos.map((eq: any) => (
                  <div key={eq.equipo.id_equipo}>
                    {eq.equipo.nombre_pc || eq.equipo.modelo || eq.equipo.numero_serie}
                  </div>
                ))}
              </TableCell>
              <TableCell>
                {row.equipos.flatMap((eq: any) => eq.usuarios).join(", ")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}