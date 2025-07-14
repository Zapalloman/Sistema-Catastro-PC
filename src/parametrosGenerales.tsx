"use client"

import { useState, useEffect } from "react"
import { ProcessLayout } from "./components/process-layout"
import { ParametersTable } from "./components/parameters-table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Filter } from "lucide-react"
import { PropietariosEquiposTable } from "./components/propietarios-equipos-table"

// Tipos de parámetros disponibles
const parameterOptions = [
	{ value: "PROPIETARIO EQUIPO", label: "Propietario de Equipo" },
	{ value: "CARGO", label: "Cargo" },
	{ value: "EDIFICIO", label: "Edificio" },
	{ value: "UBICACION", label: "Ubicación" },
	{ value: "RED", label: "Red" },
	{ value: "DOMINIO DE RED", label: "Dominio de Red" },
	{ value: "DEPARTAMENTO", label: "Departamento" },
]

export default function ParametrosGenerales() {
	const [selectedParameter, setSelectedParameter] = useState("")
	const [parametros, setParametros] = useState([])
	const [loading, setLoading] = useState(false)
	const [refresh, setRefresh] = useState(0)

	// Cargar parámetros cuando se selecciona un tipo
	useEffect(() => {
		if (selectedParameter) {
			setLoading(true)
			fetch(`http://localhost:3000/api/parametros-generales?tipo=${selectedParameter}`)
				.then((res) => res.json())
				.then((data) => {
					setParametros(Array.isArray(data) ? data : [])
				})
				.catch((err) => {
					console.error("Error fetching parametros:", err)
					setParametros([])
				})
				.finally(() => setLoading(false))
		}
	}, [selectedParameter, refresh])

	const handleParameterSelect = () => {
		if (selectedParameter) {
			console.log("Selected parameter:", selectedParameter)
			// Los datos ya se cargan automáticamente en el useEffect
		}
	}

	const handleParametroAdded = () => {
		setRefresh((prev) => prev + 1) // Recargar datos
	}

	const handleSincronizar = async () => {
		try {
			setLoading(true)
			await fetch('http://localhost:3000/api/parametros-generales/sincronizar-propietarios', {
				method: 'POST'
			})
			setRefresh((prev) => prev + 1) // Recargar datos
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
							Visualiza y gestiona los parámetros dentro de la plataforma. Aquí puedes seleccionar y filtrar
							diferentes parámetros para personalizar la visualización de datos.
						</p>
					</div>
				</div>

				{/* Selector de parámetros */}
				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex items-center gap-4 mb-6">
						<Filter className="w-5 h-5 text-gray-600" />
						<h3 className="text-lg font-semibold text-gray-900">Seleccione parámetro</h3>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Opción</label>
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

						<Button
							onClick={handleParameterSelect}
							disabled={!selectedParameter || loading}
							className="mt-6"
						>
							{loading ? "Cargando..." : "Filtrar"}
						</Button>

						<Button
							onClick={handleSincronizar}
							disabled={loading}
							variant="outline"
							className="mt-6"
						>
							Sincronizar Propietarios
						</Button>
					</div>
				</div>

				{/* Tabla de parámetros */}
				{selectedParameter && (
					<div className="bg-white rounded-lg shadow">
						<ParametersTable
							selectedParameterType={selectedParameter}
							parametros={parametros}
							loading={loading}
							onParametroAdded={handleParametroAdded}
						/>
					</div>
				)}

				{/* Cards de resumen */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
						<h3 className="font-semibold text-blue-900 mb-2">Parámetros Activos</h3>
						<p className="text-2xl font-bold text-blue-600">
							{parametros.filter((p) => p.estado === 1).length}
						</p>
						<p className="text-sm text-blue-700">Configuraciones en uso</p>
					</div>

					<div className="bg-green-50 rounded-lg p-4 border border-green-200">
						<h3 className="font-semibold text-green-900 mb-2">Última Actualización</h3>
						<p className="text-sm text-green-700">Sistema sincronizado</p>
					</div>

					<div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
						<h3 className="font-semibold text-orange-900 mb-2">Pendientes</h3>
						<p className="text-2xl font-bold text-orange-600">0</p>
						<p className="text-sm text-orange-700">Requieren revisión</p>
					</div>
				</div>

				{/* Propietarios Equipos Table - Solo se muestra si el parámetro seleccionado es "PROPIETARIO EQUIPO" */}
				{selectedParameter === "PROPIETARIO EQUIPO" ? (
  <PropietariosEquiposTable />
) : selectedParameter ? (
  <div className="bg-white rounded-lg shadow">
    <ParametersTable
      selectedParameterType={selectedParameter}
      parametros={parametros}
      loading={loading}
      onParametroAdded={handleParametroAdded}
    />
  </div>
) : null}
			</div>
		</ProcessLayout>
	)
}
