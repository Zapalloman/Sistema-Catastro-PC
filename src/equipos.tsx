"use client"

import { useEffect, useState } from "react"
import { ProcessLayout } from "./components/process-layout"
import { EquipmentTable } from "./components/equipment-table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Monitor, Filter, Plus } from "lucide-react"
import { AddEquipmentModal } from "./components/add-equipment-modal"


function groupCount(arr, keyFn) {
  const map = new Map();
  arr.forEach(item => {
    const key = keyFn(item);
    if (!key) return;
    map.set(key, (map.get(key) || 0) + 1);
  });
  return Array.from(map.entries()).map(([key, count]) => ({ key, count }));
}

export default function Equipos() {
  const [selectedPropietario, setSelectedPropietario] = useState("TODOS")
  const [propietarioOptions, setPropietarioOptions] = useState<{id_propietario: number, nombre: string}[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [totalEquipos, setTotalEquipos] = useState(0)

  useEffect(() => {
    fetch("http://localhost:3000/api/equipos/propietarios")
      .then(res => res.json())
      .then(data => setPropietarioOptions(data))
      .catch(() => setPropietarioOptions([]))
  }, [])

  const handleAddEquipment = () => setShowAddModal(true)

  const handleAdded = () => {
    setRefresh(r => !r)
    fetch("http://localhost:3000/api/equipos/propietarios")
      .then(res => res.json())
      .then(data => setPropietarioOptions(data))
      .catch(() => setPropietarioOptions([]))
  }

  const propietarioNombre = selectedPropietario === "TODOS"
    ? ""
    : propietarioOptions.find(p => p.id_propietario.toString() === selectedPropietario)?.nombre || "";

  // Estado para equipos filtrados
  const [equiposFiltrados, setEquiposFiltrados] = useState<any[]>([]);

  // Actualiza equipos filtrados cuando cambia el propietario o refresh
  useEffect(() => {
    fetch("http://localhost:3000/api/equipos")
      .then(res => res.json())
      .then(data => {
        let equipos = Array.isArray(data) ? data : [];
        if (selectedPropietario !== "TODOS") {
          equipos = equipos.filter(eq => eq.id_propietario?.toString() === selectedPropietario);
        }
        setEquiposFiltrados(equipos);
        setTotalEquipos(equipos.length);
      });
  }, [selectedPropietario, refresh]);

  // Agrupa por versión de Windows
  const windowsCounts = groupCount(equiposFiltrados, eq => {
    const v = eq.version_sistema_operativo?.toLowerCase() || "";
    if (v.includes("windows")) {
      const match = v.match(/windows\s*([0-9]+(\.[0-9]+)?)/i);
      return match ? `Windows ${match[1]}` : "Windows";
    }
    return null;
  });

  // Agrupa por versión de Office
  const officeCounts = groupCount(equiposFiltrados, eq => {
    const v = eq.version_office?.toLowerCase() || "";
    if (v.includes("office")) {
      const match = v.match(/office\s*([0-9]{4}|365)/i);
      return match ? `Office ${match[1]}` : "Office";
    }
    return null;
  });

  // Agrupa por marca
  const marcaCounts = groupCount(equiposFiltrados, eq => {
    if (typeof eq.marca === "object" && eq.marca !== null) return eq.marca.nombre;
    return eq.marca || null;
  });

  // Paleta de colores pastel para los recuadros
  const cardColors = [
    { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-900", number: "text-blue-600", desc: "text-blue-700" },
    { bg: "bg-green-50", border: "border-green-200", text: "text-green-900", number: "text-green-600", desc: "text-green-700" },
    { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-900", number: "text-yellow-600", desc: "text-yellow-700" },
    { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-900", number: "text-purple-600", desc: "text-purple-700" },
    { bg: "bg-pink-50", border: "border-pink-200", text: "text-pink-900", number: "text-pink-600", desc: "text-pink-700" },
    { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-900", number: "text-orange-600", desc: "text-orange-700" },
    { bg: "bg-cyan-50", border: "border-cyan-200", text: "text-cyan-900", number: "text-cyan-600", desc: "text-cyan-700" },
  ];

  return (
    <ProcessLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Monitor className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Equipos</h1>
            <p className="text-gray-600 mt-1">
              Gestiona y visualiza todos los equipos de cómputo del Instituto Geográfico Militar. Filtra por propietario
              para ver información detallada de cada equipo.
            </p>
          </div>
        </div>

        {/* Filter Selection */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-4 mb-6">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filtrar por Propietario de Equipos</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">Propietario</label>
              <Select value={selectedPropietario} onValueChange={setSelectedPropietario}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un propietario..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODOS">Todos los propietarios</SelectItem>
                  {propietarioOptions.map((option) => (
                    <SelectItem key={option.id_propietario} value={option.id_propietario.toString()}>
                      {option.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddEquipment} className="mt-6 bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Equipo
            </Button>
          </div>
        </div>

        {/* Equipment Table */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <EquipmentTable
            selectedPropietario={selectedPropietario}
            refresh={refresh}
            onCountChange={setTotalEquipos}
          />
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Total Equipos */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">Total Equipos</h3>
            <p className="text-2xl font-bold text-blue-600">{totalEquipos}</p>
            <p className="text-sm text-blue-700">Equipos registrados por propietario</p>
          </div>
          {/* Windows */}
          {windowsCounts.map((w, i) => {
            const color = cardColors[(i + 1) % cardColors.length];
            return (
              <div key={w.key} className={`${color.bg} rounded-lg p-4 border ${color.border}`}>
                <h3 className={`font-semibold ${color.text} mb-2`}>{w.key}</h3>
                <p className={`text-2xl font-bold ${color.number}`}>{w.count}</p>
                <p className={`text-sm ${color.desc}`}>Equipos con {w.key}</p>
              </div>
            );
          })}
          {/* Office */}
          {officeCounts.map((o, i) => {
            const color = cardColors[(i + 3) % cardColors.length];
            return (
              <div key={o.key} className={`${color.bg} rounded-lg p-4 border ${color.border}`}>
                <h3 className={`font-semibold ${color.text} mb-2`}>{o.key}</h3>
                <p className={`text-2xl font-bold ${color.number}`}>{o.count}</p>
                <p className={`text-sm ${color.desc}`}>Equipos con {o.key}</p>
              </div>
            );
          })}
          {/* Marcas */}
          {marcaCounts.map((m, i) => {
            const color = cardColors[(i + 5) % cardColors.length];
            return (
              <div key={m.key} className={`${color.bg} rounded-lg p-4 border ${color.border}`}>
                <h3 className={`font-semibold ${color.text} mb-2`}>{m.key}</h3>
                <p className={`text-2xl font-bold ${color.number}`}>{m.count}</p>
                <p className={`text-sm ${color.desc}`}>Equipos de marca {m.key}</p>
              </div>
            );
          })}
        </div>
      </div>

      <AddEquipmentModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdded={handleAdded}
        propietarioOptions={propietarioOptions}
      />
    </ProcessLayout>
  )
}
