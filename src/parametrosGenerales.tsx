"use client"

import { useState, useEffect } from "react"
import { Settings, Search, Plus, Filter } from "lucide-react"
import { ProcessLayout } from "@/components/process-layout"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ParametersTable } from "@/components/parameters-table" // <-- Este es el nombre correcto del import
import { PropietariosEquiposTable } from "@/components/propietarios-equipos-table"

const parameterOptions = [
	{ value: "RED", label: "Red" },
	{ value: "CARGO", label: "Cargo" },
	{ value: "EDIFICIO", label: "Edificio" },
	{ value: "UBICACION", label: "Ubicación" },
	{ value: "DEPARTAMENTO", label: "Departamento" },
	{ value: "DOMINIO_RED", label: "Dominio de Red" },
	{ value: "PROPIETARIO", label: "Propietario de Equipo" },
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
			setEquiposAsociados([]) // Limpiar equipos asociados
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
			<div className="space-y-6">
				{/* Header */}
				<div className="flex items-center gap-3 mb-8">
					<Settings className="w-8 h-8 text-blue-600" />
					<div>
						<h1 className="text-3xl font-bold text-gray-900">Parámetros Generales</h1>
						<p className="text-gray-600 mt-1">
							Gestión de parámetros del sistema de catastro
						</p>
					</div>
				</div>

				{/* Controls */}
				<div className="bg-white rounded-lg shadow-sm border p-6">
					<div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
						<div className="flex-1">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Tipo de Parámetro
							</label>
							<Select value={selectedParameter} onValueChange={setSelectedParameter}>
								<SelectTrigger>
									<SelectValue placeholder="Seleccione un tipo de parámetro..." />
								</SelectTrigger>
								<SelectContent>
									{parameterOptions.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{selectedParameter === "PROPIETARIO" && (
							<Button
								onClick={handleSincronizar}
								disabled={loading}
								variant="outline"
								className="mt-6"
							>
								Sincronizar Propietarios
							</Button>
						)}
					</div>
				</div>

				{/* Tabla principal de parámetros */}
				{selectedParameter && (
					<div className="bg-white rounded-lg shadow-sm border">
						{selectedParameter === "PROPIETARIO" ? (
							<PropietariosEquiposTable />
						) : (
							<ParametersTable  // <-- Cambiar ParametrosTable por ParametersTable
								selectedParameterType={selectedParameter}
								parametros={parametros}
								loading={loading}
								onParametroAdded={handleParametroAdded}
								onParametroSelect={handleParametroSelect}
							/>
						)}
					</div>
				)}

				{/* Tabla de equipos asociados */}
				{equiposAsociados.length > 0 && selectedParametroId && (
					<div className="bg-white rounded-lg shadow-sm border">
						<div className="bg-blue-500 text-white p-4">
							<h3 className="font-medium flex items-center gap-2">
								<Filter className="w-4 h-4" />
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

				{/* Statistics */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
						<h3 className="font-semibold text-blue-900 mb-2">Parámetros Activos</h3>
						<p className="text-2xl font-bold text-blue-600">
							{parametros.length}
						</p>
						<p className="text-sm text-blue-700">Configuraciones disponibles</p>
					</div>

					<div className="bg-green-50 rounded-lg p-4 border border-green-200">
						<h3 className="font-semibold text-green-900 mb-2">Equipos Asociados</h3>
						<p className="text-2xl font-bold text-green-600">
							{equiposAsociados.length}
						</p>
						<p className="text-sm text-green-700">Items relacionados</p>
					</div>

					<div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
						<h3 className="font-semibold text-orange-900 mb-2">Última Actualización</h3>
						<p className="text-2xl font-bold text-orange-600">Hoy</p>
						<p className="text-sm text-orange-700">Sistema actualizado</p>
					</div>
				</div>
			</div>
		</ProcessLayout>
	)
}

// Componente para mostrar equipos asociados
function EquiposAsociadosTable({ data, tipo, loading }: { data: any[], tipo: string, loading: boolean }) {
	if (loading) {
		return <div className="text-center py-8">Cargando equipos asociados...</div>
	}

	if (data.length === 0) {
		return <div className="text-center py-8 text-gray-500">No hay equipos asociados</div>
	}

	// Renderizar según el tipo
	switch (tipo) {
		case 'CARGO':
			return (
				<div className="overflow-x-auto">
					<table className="w-full border-collapse border border-gray-300">
						<thead>
							<tr className="bg-gray-100">
								<th className="border border-gray-300 px-4 py-2 text-left">RUT</th>
								<th className="border border-gray-300 px-4 py-2 text-left">Nombre Completo</th>
								<th className="border border-gray-300 px-4 py-2 text-left">Cargo</th>
								<th className="border border-gray-300 px-4 py-2 text-left">Equipo</th>
								<th className="border border-gray-300 px-4 py-2 text-left">Serie</th>
								<th className="border border-gray-300 px-4 py-2 text-left">Modelo</th>
							</tr>
						</thead>
						<tbody>
							{data.map((item, index) => (
								<tr key={index} className="hover:bg-gray-50">
									<td className="border border-gray-300 px-4 py-2">{item.rut}</td>
									<td className="border border-gray-300 px-4 py-2">{item.nombre_completo}</td>
									<td className="border border-gray-300 px-4 py-2">{item.cargo}</td>
									<td className="border border-gray-300 px-4 py-2">{item.equipo_nombre}</td>
									<td className="border border-gray-300 px-4 py-2">{item.equipo_serie}</td>
									<td className="border border-gray-300 px-4 py-2">{item.equipo_modelo}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)

		case 'PROPIETARIO':
			return (
				<div className="overflow-x-auto">
					<table className="w-full border-collapse border border-gray-300">
						<thead>
							<tr className="bg-gray-100">
								<th className="border border-gray-300 px-4 py-2 text-left">Nombre Equipo</th>
								<th className="border border-gray-300 px-4 py-2 text-left">Usuario Asignado</th>
							</tr>
						</thead>
						<tbody>
							{data.map((item, index) => (
								<tr key={index} className="hover:bg-gray-50">
									<td className="border border-gray-300 px-4 py-2">{item.nombre_pc || "Sin nombre"}</td>
									<td className="border border-gray-300 px-4 py-2">{item.usuario || "Sin asignar"}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)

		default:
			// Para RED, UBICACION, DOMINIO_RED
			return (
				<div className="overflow-x-auto">
					<table className="w-full border-collapse border border-gray-300">
						<thead>
							<tr className="bg-gray-100">
								<th className="border border-gray-300 px-4 py-2 text-left">Nombre PC</th>
								<th className="border border-gray-300 px-4 py-2 text-left">Serie</th>
								<th className="border border-gray-300 px-4 py-2 text-left">Modelo</th>
								<th className="border border-gray-300 px-4 py-2 text-left">IP</th>
								<th className="border border-gray-300 px-4 py-2 text-left">Marca</th>
								<th className="border border-gray-300 px-4 py-2 text-left">Ubicación</th>
								<th className="border border-gray-300 px-4 py-2 text-left">Usuario</th>
							</tr>
						</thead>
						<tbody>
							{data.map((item, index) => (
								<tr key={index} className="hover:bg-gray-50">
									<td className="border border-gray-300 px-4 py-2">{item.nombre_pc || "Sin nombre"}</td>
									<td className="border border-gray-300 px-4 py-2">{item.numero_serie || "-"}</td>
									<td className="border border-gray-300 px-4 py-2">{item.modelo || "-"}</td>
									<td className="border border-gray-300 px-4 py-2">{item.ip || "-"}</td>
									<td className="border border-gray-300 px-4 py-2">{item.marca || "-"}</td>
									<td className="border border-gray-300 px-4 py-2">{item.ubicacion || "-"}</td>
									<td className="border border-gray-300 px-4 py-2">{item.usuario || "Sin asignar"}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)
	}
}
