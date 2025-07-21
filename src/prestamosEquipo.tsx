"use client"

import { useState, useEffect } from "react"
import { Users, Filter } from "lucide-react"
import { LoansTable } from "./components/loans-table"
import { AvailableDevicesTable } from "./components/available-devices-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProcessLayout } from "@/components/process-layout"



/*
const deviceTypes = [
	{ value: "TODOS", label: "Todos los Dispositivos" },
	{ value: "PC", label: "PC" },
	{ value: "IMPRESORA", label: "Impresora" },
	{ value: "PLOTTER", label: "Plotter" },
	{ value: "PROYECTOR", label: "Proyector" },
	{ value: "CAMARA WEB", label: "Cámara Web" },
	{ value: "PC NORMAL", label: "PC Normal" },
	{ value: "WORKSTATION", label: "Workstation" },
	{ value: "ALMACENAMIENTO", label: "Almacenamiento" },
	{ value: "FIREWALL", label: "Firewall" },
	{ value: "KVM", label: "KVM" },
	{ value: "UPS", label: "UPS" },
	{ value: "MONITOR", label: "Monitor" },
	{ value: "NOTEBOOK", label: "Notebook" },
	{ value: "OTRO", label: "Otros" },
]
*/
export default function Prestamos() {
	const [selectedFilter, setSelectedFilter] = useState("TODOS")
	const [activeTab, setActiveTab] = useState("activos")
	const [categorias, setCategorias] = useState([])

	useEffect(() => {
		fetch("http://localhost:3000/api/equipos/categorias")
			.then(res => res.json())
			.then(data => {
				console.log("Categorías cargadas:", data); // Debug log
				const categoriasArray = Array.isArray(data) ? data : [];
				setCategorias(categoriasArray);
			})
			.catch(err => {
				console.error("Error fetching categorias:", err);
				setCategorias([]);
			})
	}, [])

	return (
		<ProcessLayout>
			<div className="space-y-6">
				{/* Header */}
				<div className="flex items-center gap-3 mb-8">
					<Users className="w-8 h-8 text-blue-600" />
					<div>
						<h1 className="text-3xl font-bold text-gray-900">Préstamos de Dispositivos Externos</h1>
						<p className="text-gray-600 mt-1">
							Gestiona los préstamos de dispositivos. Visualiza todos los préstamos activos y los dispositivos
							disponibles.
						</p>
					</div>
				</div>

				{/* Filtro por tipo de dispositivo */}
				<div className="bg-white rounded-lg shadow-sm border p-6">
					<div className="flex items-center gap-4 mb-6">
						<Filter className="w-5 h-5 text-gray-600" />
						<h2 className="text-lg font-semibold text-gray-900">Filtrar por tipo de dispositivo</h2>
					</div>
					<div className="flex items-center gap-4">
						<div className="flex-1 max-w-md">
							<Select value={selectedFilter} onValueChange={setSelectedFilter}>
								<SelectTrigger className="w-48">
									<SelectValue placeholder="Tipo de dispositivo" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="TODOS">Todos los Dispositivos</SelectItem>
									<SelectItem value="OTRO">OTRO</SelectItem>
									{categorias
										.filter(cat => cat.desc_tipo && cat.desc_tipo !== "OTRO") // <-- USAR desc_tipo
										.sort((a, b) => (a.desc_tipo || "").localeCompare(b.desc_tipo || "")) // <-- USAR desc_tipo
										.map(cat => (
											<SelectItem key={cat.id_tipo} value={cat.desc_tipo}>
												{cat.desc_tipo}
											</SelectItem>
										))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>

				{/* Tabs para activos y disponibles */}
				<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
					<TabsList className="grid w-full grid-cols-2 bg-gray-100">
						<TabsTrigger 
							value="activos" 
							className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
						>
							Préstamos Activos
						</TabsTrigger>
						<TabsTrigger 
							value="disponibles"
							className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
						>
							Dispositivos Disponibles
						</TabsTrigger>
					</TabsList>
					<TabsContent value="activos">
						<LoansTable deviceType={selectedFilter} />
					</TabsContent>
					<TabsContent value="disponibles">
						<AvailableDevicesTable deviceType={selectedFilter} />
					</TabsContent>
				</Tabs>
			</div>
		</ProcessLayout>
	)
}
