import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { Input } from "@/components/ui/input"

interface RutAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onUserSelected?: (user: any) => void
}

export function RutAutocomplete({ value, onChange, onUserSelected }: RutAutocompleteProps) {
  const [options, setOptions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [userDetail, setUserDetail] = useState<any>(null)
  const [showOptions, setShowOptions] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 })
  const inputRef = useRef<HTMLInputElement>(null)

  // Sincronizar el input con el valor del prop
  useEffect(() => {
    if (!value) {
      setUserDetail(null)
      setOptions([])
      setShowOptions(false)
    }
  }, [value])

  // Manejar clicks fuera del componente
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (inputRef.current && !inputRef.current.contains(target) && 
          !target.closest('.autocomplete-dropdown')) {
        setShowOptions(false)
      }
    }

    if (showOptions) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showOptions])

  // Manejar scroll para reposicionar dropdown
  useEffect(() => {
    const handleScroll = () => {
      if (showOptions) {
        updateDropdownPosition()
      }
    }

    if (showOptions) {
      window.addEventListener('scroll', handleScroll, true)
      window.addEventListener('resize', handleScroll)
    }

    return () => {
      window.removeEventListener('scroll', handleScroll, true)
      window.removeEventListener('resize', handleScroll)
    }
  }, [showOptions])

  // Calcular posición del dropdown
  const updateDropdownPosition = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      })
    }
  }

  // Buscar por rut, nombre o apellido
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    onChange(val)
    setLoading(true)
    setShowOptions(true)
    updateDropdownPosition()
    
    try {
      if (val.length >= 3) {
        const res = await fetch(`http://localhost:3000/api/igm/usuarios/buscar?q=${encodeURIComponent(val)}`)
        const data = await res.json()
        console.log("Usuarios encontrados:", data)
        setOptions(Array.isArray(data) ? data : [])
      } else {
        setOptions([])
      }
    } catch (error) {
      console.error("Error buscando usuarios:", error)
      setOptions([])
    } finally {
      setLoading(false)
    }
  }

  // Al seleccionar un usuario
  const handleSelect = async (rut: string) => {
    console.log("Seleccionando usuario con RUT:", rut)
    
    // Actualizar el valor inmediatamente
    onChange(rut)
    
    // Limpiar y cerrar el dropdown
    setOptions([])
    setShowOptions(false)
    
    try {
      const res = await fetch(`http://localhost:3000/api/igm/usuarios/detalle?rut=${rut}`)
      const data = await res.json()
      console.log("Detalle usuario:", data)
      setUserDetail(data)
      if (onUserSelected) onUserSelected(data)
    } catch (error) {
      console.error("Error obteniendo detalle del usuario:", error)
    }
  }

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        placeholder="Buscar por RUT, nombre o apellido..."
        value={value}
        onChange={handleSearch}
        className="w-full"
        autoComplete="off"
        onFocus={() => {
          if (options.length > 0) {
            setShowOptions(true)
            updateDropdownPosition()
          }
        }}
        onBlur={() => {
          // No cerrar inmediatamente - dejar que el click handler maneje esto
        }}
      />
      {loading && <div className="text-xs text-gray-500 mt-1">Cargando...</div>}
      
      {/* Dropdown usando portal para evitar problemas de overflow */}
      {showOptions && options.length > 0 && (
        <div
          data-dropdown-content
          className="autocomplete-dropdown fixed bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto z-[99999]"
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width,
            minWidth: '200px'
          }}
        >
          {options.map(opt => (
            <div
              key={opt.rut}
              className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              onMouseDown={(e) => {
                e.preventDefault()
                console.log("Click en opción:", opt.rut)
                handleSelect(opt.rut)
              }}
            >
              <div className="font-medium text-sm">{opt.rut}</div>
              <div className="text-gray-600 text-xs">{opt.nombres} {opt.apaterno} {opt.amaterno}</div>
            </div>
          ))}
        </div>
      )}
      
      {userDetail && (
        <div className="mt-2 p-3 border rounded bg-gray-50 text-sm">
          <div><b>Nombre:</b> {userDetail.nombres} {userDetail.apaterno} {userDetail.amaterno}</div>
          <div><b>Departamento:</b> {userDetail.departamento}</div>
        </div>
      )}
    </div>
  )
}