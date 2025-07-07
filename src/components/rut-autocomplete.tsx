import { useState } from "react"
import { Input } from "@/components/ui/input"

export function RutAutocomplete({ value, onChange, onUserSelected }) {
  const [search, setSearch] = useState("")
  const [options, setOptions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [userDetail, setUserDetail] = useState<any>(null)

  // Buscar por rut, nombre o apellido
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearch(val)
    onChange(val)
    setLoading(true)
    if (val.length >= 3) {
      const res = await fetch(`http://localhost:3000/igm/usuarios/buscar?q=${encodeURIComponent(val)}`)
      const data = await res.json()
      setOptions(data)
    } else {
      setOptions([])
    }
    setLoading(false)
  }

  // Al seleccionar un usuario
  const handleSelect = async (rut: string) => {
    setSearch(rut)
    onChange(rut)
    setOptions([])
    const res = await fetch(`http://localhost:3000/igm/usuarios/detalle?rut=${rut}`)
    const data = await res.json()
    setUserDetail(data)
    if (onUserSelected) onUserSelected(data)
  }

  return (
    <div style={{ position: "relative" }}>
      <Input
        placeholder="Buscar por RUT, nombre o apellido..."
        value={search}
        onChange={handleSearch}
        className="w-full"
        autoComplete="off"
      />
      {loading && <div className="text-xs text-gray-500">Cargando...</div>}
      {options.length > 0 && (
        <ul className="border bg-white max-h-40 overflow-y-auto absolute z-50 w-full">
          {options.map(opt => (
            <li
              key={opt.rut}
              className="p-2 hover:bg-blue-100 cursor-pointer"
              onClick={() => handleSelect(opt.rut)}
            >
              {opt.rut} - {opt.nombres} {opt.apaterno} {opt.amaterno}
            </li>
          ))}
        </ul>
      )}
      {userDetail && (
        <div className="mt-2 p-2 border rounded bg-gray-50 text-xs">
          <div><b>Nombre:</b> {userDetail.nombres} {userDetail.apaterno} {userDetail.amaterno}</div>
          <div><b>Departamento:</b> {userDetail.departamento}</div>
        </div>
      )}
    </div>
  )
}