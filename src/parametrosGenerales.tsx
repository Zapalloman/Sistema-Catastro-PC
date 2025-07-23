"use client"

import { useState, useEffect } from "react"
import { Settings, Search, Plus, Filter, Database, Network, Users, MapPin, Building, Globe } from "lucide-react"
import { ProcessLayout } from "@/components/process-layout"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ParametersTable } from "@/components/parameters-table"
import { PropietariosEquiposTable } from "@/components/propietarios-equipos-table"

const parameterOptions = [
    { value: "RED", label: "Red", icon: Network, description: "Configuración de redes del sistema" },
    { value: "CARGO", label: "Cargo", icon: Users, description: "Cargos y responsabilidades del personal" },
    { value: "UBICACION", label: "Ubicación", icon: MapPin, description: "Ubicaciones físicas de equipos" },
    { value: "DEPARTAMENTO", label: "Departamento", icon: Building, description: "Departamentos organizacionales" },
    { value: "DOMINIO_RED", label: "Dominio de Red", icon: Globe, description: "Dominios y configuraciones de red" },
    { value: "PROPIETARIO", label: "Propietario de Equipo", icon: Database, description: "Propietarios y responsables de equipos" },
]

export default function ParametrosGenerales() {
    const [selectedParameter, setSelectedParameter] = useState("")
    const [parametros, setParametros] = useState([])
    const [equiposAsociados, setEquiposAsociados] = useState([])
    const [selectedParametroId, setSelectedParametroId] = useState(null)
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(0)

    // Cargar parámetros cuando cambia el tipo seleccionado
    useEffect(() => {
        if (selectedParameter && selectedParameter !== "PROPIETARIO") {
            loadParametros(selectedParameter)
        }
    }, [selectedParameter, refresh])

    const loadParametros = async (tipo: string) => {
        try {
            setLoading(true)
            const response = await fetch(`http://localhost:3000/api/parametros-generales/${tipo}`)
            const data = await response.json()
            setParametros(data)
            setEquiposAsociados([])
            setSelectedParametroId(null)
        } catch (error) {
            console.error(`Error al cargar parámetros de ${tipo}:`, error)
            setParametros([])
        } finally {
            setLoading(false)
        }
    }

    const loadEquiposAsociados = async (tipo: string, codigo: number) => {
        try {
            setLoading(true)
            const response = await fetch(`http://localhost:3000/api/parametros-generales/${tipo}/${codigo}/equipos`)
            const data = await response.json()
            setEquiposAsociados(data)
            setSelectedParametroId(codigo)
        } catch (error) {
            console.error(`Error al cargar equipos asociados:`, error)
            setEquiposAsociados([])
        } finally {
            setLoading(false)
        }
    }

    const handleParametroSelect = (parametro: any) => {
        if (parametro && parametro.codigo) {
            loadEquiposAsociados(selectedParameter, parametro.codigo)
        }
    }

    const handleParametroAdded = () => {
        setRefresh((prev) => prev + 1)
    }

    const handleSincronizar = async () => {
        try {
            setLoading(true)
            await fetch('http://localhost:3000/api/parametros-generales/sincronizar-propietarios', {
                method: 'POST'
            })
            setRefresh((prev) => prev + 1)
            alert('Propietarios sincronizados correctamente')
        } catch (error) {
            console.error('Error sincronizando:', error)
            alert('Error al sincronizar propietarios')
        } finally {
            setLoading(false)
        }
    }

    return (
        <ProcessLayout>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="container mx-auto px-4 py-8 space-y-8">
                    {/* Header mejorado */}
                    <div className="text-center space-y-4">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
                                <Settings className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900">Parámetros Generales</h1>
                                <p className="text-lg text-gray-600 mt-2">
                                    Gestión centralizada de configuraciones del sistema IGM
                                </p>
                            </div>
                        </div>
                    </div>

                    {!selectedParameter ? (
                        /* Vista inicial mejorada */
                        <div className="space-y-8">
                            {/* Selector principal */}
                            <div className="max-w-2xl mx-auto">
                                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                                    <div className="text-center mb-6">
                                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                                            Seleccionar Tipo de Parámetro
                                        </h2>
                                        <p className="text-gray-600">
                                            Elija el tipo de configuración que desea gestionar
                                        </p>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <Select value={selectedParameter} onValueChange={setSelectedParameter}>
                                            <SelectTrigger className="h-14 text-lg border-2 hover:border-blue-300 transition-colors">
                                                <SelectValue placeholder="🔧 Seleccione un tipo de parámetro..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {parameterOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value} className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <option.icon className="w-5 h-5 text-blue-600" />
                                                            <div>
                                                                <div className="font-medium">{option.label}</div>
                                                                <div className="text-sm text-gray-500">{option.description}</div>
                                                            </div>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            {/* Grid de opciones visuales */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                                {parameterOptions.map((option) => (
                                    <div
                                        key={option.value}
                                        onClick={() => setSelectedParameter(option.value)}
                                        className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                                                <option.icon className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                                    {option.label}
                                                </h3>
                                                <p className="text-sm text-gray-600 leading-relaxed">
                                                    {option.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Información adicional */}
                            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                                <div className="text-center space-y-4">
                                    <div className="flex items-center justify-center gap-2 text-blue-600">
                                        <Database className="w-6 h-6" />
                                        <h3 className="text-xl font-semibold">Sistema de Gestión de Parámetros</h3>
                                    </div>
                                    <p className="text-gray-600 max-w-2xl mx-auto">
                                        Este módulo permite visualizar los parámetros fundamentales 
                                        del sistema, incluyendo configuraciones de red, ubicaciones, cargos del personal 
                                        y propietarios de equipos. Selecciona un tipo de parámetro para comenzar.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Vista con parámetro seleccionado */
                        <div className="space-y-6">
                            {/* Breadcrumb y controles */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Button
                                            variant="outline"
                                            onClick={() => setSelectedParameter("")}
                                            className="shrink-0"
                                        >
                                            ← Volver
                                        </Button>
                                        <div className="flex items-center gap-3">
                                            {(() => {
                                                const option = parameterOptions.find(opt => opt.value === selectedParameter)
                                                return option ? (
                                                    <>
                                                        <div className="p-2 bg-blue-50 rounded-lg">
                                                            <option.icon className="w-5 h-5 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <h2 className="text-xl font-semibold text-gray-900">
                                                                {option.label}
                                                            </h2>
                                                            <p className="text-sm text-gray-600">
                                                                {option.description}
                                                            </p>
                                                        </div>
                                                    </>
                                                ) : null
                                            })()}
                                        </div>
                                    </div>

                                    {selectedParameter === "PROPIETARIO" && (
                                        <Button
                                            onClick={handleSincronizar}
                                            disabled={loading}
                                            className="bg-blue-600 hover:bg-blue-700 text-white shrink-0"
                                        >
                                            <Database className="w-4 h-4 mr-2" />
                                            Sincronizar Propietarios
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Tabla principal de parámetros */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                                {selectedParameter === "PROPIETARIO" ? (
                                    <PropietariosEquiposTable />
                                ) : (
                                    <ParametersTable
                                        selectedParameterType={selectedParameter}
                                        parametros={parametros}
                                        loading={loading}
                                        onParametroAdded={handleParametroAdded}
                                        onParametroSelect={handleParametroSelect}
                                    />
                                )}
                            </div>

                            {/* Tabla de equipos asociados */}
                            {equiposAsociados.length > 0 && selectedParametroId && (
                                <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl">
                                        <h3 className="font-semibold flex items-center gap-3">
                                            <Filter className="w-5 h-5" />
                                            Equipos/Personas Asociadas - {parameterOptions.find(p => p.value === selectedParameter)?.label}
                                        </h3>
                                    </div>
                                    <div className="p-6">
                                        <EquiposAsociadosTable
                                            data={equiposAsociados}
                                            tipo={selectedParameter}
                                            loading={loading}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </ProcessLayout>
    )
}

// Componente para mostrar equipos asociados (sin cambios en la lógica)
function EquiposAsociadosTable({ data, tipo, loading }: { data: any[], tipo: string, loading: boolean }) {
    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando equipos asociados...</p>
            </div>
        )
    }

    if (data.length === 0) {
        return (
            <div className="text-center py-12">
                <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No hay equipos asociados</p>
            </div>
        )
    }

    // Renderizar según el tipo (misma lógica existente pero con clases mejoradas)
    switch (tipo) {
        case 'CARGO':
            return (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">RUT</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nombre Completo</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Cargo</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Equipo</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Serie</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Modelo</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {data.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-900">{item.rut}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{item.nombre_completo}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{item.cargo}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{item.equipo_nombre}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{item.equipo_serie}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{item.equipo_modelo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )

        case 'PROPIETARIO':
            return (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nombre Equipo</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Usuario Asignado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {data.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-900">{item.nombre_pc || "Sin nombre"}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{item.usuario || "Sin asignar"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )

        default:
            return (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nombre PC</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Serie</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Modelo</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">IP</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Marca</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Ubicación</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Usuario</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {data.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-900">{item.nombre_pc || "Sin nombre"}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{item.numero_serie || "-"}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{item.modelo || "-"}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{item.ip || "-"}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{item.marca || "-"}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{item.ubicacion || "-"}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{item.usuario || "Sin asignar"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )
    }
}
