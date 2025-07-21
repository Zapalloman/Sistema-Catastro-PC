"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ParameterDetailModal } from "./parameter-detail-modal"

interface Parametro {
  codigo: number
  descripcion: string
  tipo: string
}

interface ParametersTableProps {
  selectedParameterType: string
  parametros: Parametro[]
  loading: boolean
  onParametroAdded: () => void
  onParametroSelect: (parametro: Parametro) => void
}

export function ParametersTable({ 
  selectedParameterType, 
  parametros, 
  loading, 
  onParametroAdded,
  onParametroSelect
}: ParametersTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedParameter, setSelectedParameter] = useState<Parametro | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [relatedData, setRelatedData] = useState<any[]>([])
  const [loadingRelated, setLoadingRelated] = useState(false)

  const filteredParametros = parametros.filter(param =>
    param.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    param.codigo?.toString().includes(searchTerm)
  )

  const handleViewDetails = async (parametro: Parametro) => {
    setSelectedParameter(parametro)
    setLoadingRelated(true)
    setIsModalOpen(true)
    
    try {
      const response = await fetch(`http://localhost:3000/api/parametros-generales/${selectedParameterType}/${parametro.codigo}/equipos`)
      const data = await response.json()
      setRelatedData(data)
    } catch (error) {
      console.error('Error al cargar datos relacionados:', error)
      setRelatedData([])
    } finally {
      setLoadingRelated(false)
    }

    // También ejecutar el callback original
    onParametroSelect(parametro)
  }

  const getColumns = () => {
    switch (selectedParameterType) {
      case 'CARGO':
        return ['rut', 'nombre_completo', 'cargo', 'equipo_nombre', 'equipo_serie', 'equipo_modelo']
      case 'PROPIETARIO':
        return ['nombre_pc', 'usuario']
      default:
        return ['nombre_pc', 'numero_serie', 'modelo', 'ip', 'marca', 'ubicacion', 'usuario']
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Cargando parámetros...</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Parámetros de {selectedParameterType}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {filteredParametros.length} parámetros encontrados
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={`Buscar en ${selectedParameterType}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      {filteredParametros.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron parámetros
          </h3>
          <p className="text-gray-600">
            {searchTerm 
              ? `No hay parámetros que coincidan con "${searchTerm}"`
              : `No hay parámetros de tipo ${selectedParameterType} disponibles`
            }
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-3 text-left">Código</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Descripción</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Tipo</th>
                <th className="border border-gray-300 px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredParametros.map((param, index) => (
                <tr key={param.codigo || index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">
                    <Badge variant="outline" className="font-mono">
                      {param.codigo}
                    </Badge>
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    <div className="font-medium">{param.descripcion}</div>
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    <Badge variant="secondary">{param.tipo}</Badge>
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetails(param)}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
                        title="Ver equipos asociados"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de detalles */}
      <ParameterDetailModal
        parameter={selectedParameter}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        columns={getColumns()}
        relatedData={relatedData}
        loading={loadingRelated}
        parameterType={selectedParameterType}
      />
    </div>
  )
}
