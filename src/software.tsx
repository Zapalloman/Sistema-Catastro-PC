"use client"

import React, { useState, useEffect } from 'react';
import { 
  Monitor, 
  Laptop, 
  Server, 
  Apple, 
  Plus, 
  Search, 
  Filter,
  Package,
  Calendar,
  ChevronRight,
  Zap,
  HardDrive,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { ProcessLayout } from "./components/process-layout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AsignarSoftwareModal from "./components/AsignarSoftwareModal";
import { PDFSoftwareGenerator } from "./components/pdf-software-generator";

interface Equipo {
  id: number;
  nombre: string;
  tipo: 'IGM' | 'Z8' | 'LATSUR' | 'MAC';
  ubicacion?: string;
  estado?: string;
}

interface Software {
  idSoftware: number;
  nombreSoftware: string;
  version?: string;
  observaciones?: string;
}

interface EquipoSoftware {
  idAsignacion: number;
  idEquipo: number;
  idSoftware: number;
  fechaAsignacion: string;
  observaciones?: string;
  software: Software;
}

export default function SoftwareEquipos() {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState<Equipo | null>(null);
  const [softwareEquipo, setSoftwareEquipo] = useState<EquipoSoftware[]>([]);
  const [todoElSoftware, setTodoElSoftware] = useState<Software[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSoftware, setLoadingSoftware] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [showAsignModal, setShowAsignModal] = useState(false);
  const [showAsignarMultipleModal, setShowAsignarMultipleModal] = useState(false);

  // Iconos por tipo de equipo
  const getIconoTipo = (tipo: string) => {
    switch (tipo) {
      case 'IGM': return <Monitor className="w-5 h-5" />;
      case 'Z8': return <Zap className="w-5 h-5" />;
      case 'LATSUR': return <HardDrive className="w-5 h-5" />;
      case 'MAC': return <Apple className="w-5 h-5" />;
      default: return <Laptop className="w-5 h-5" />;
    }
  };

  // Colores por tipo de equipo
  const getColorTipo = (tipo: string) => {
    switch (tipo) {
      case 'IGM': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Z8': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'LATSUR': return 'bg-green-50 text-green-700 border-green-200';
      case 'MAC': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Cargar equipos computacionales
  const cargarEquipos = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando equipos computacionales...');
      
      // Usar el nuevo endpoint que filtra solo equipos computacionales
      const response = await fetch('http://localhost:3000/api/software/equipos/computacionales');
      const equiposComputacionales = await response.json();
      
      const equiposUnificados: Equipo[] = equiposComputacionales.map((equipo: any) => ({
        id: equipo.id,
        nombre: equipo.nombre,
        tipo: equipo.tipo as 'IGM' | 'LATSUR' | 'Z8' | 'MAC',
        ubicacion: equipo.ubicacion || 'Sin ubicación',
        estado: 'Activo'
      }));

      // Solo usar datos reales de la base de datos
      console.log('✅ Total equipos computacionales cargados:', equiposUnificados.length);
      setEquipos(equiposUnificados);
    } catch (error) {
      console.error('Error general cargando equipos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar software de un equipo
  const cargarSoftwareEquipo = async (idEquipo: number) => {
    try {
      setLoadingSoftware(true);
      console.log(`🔄 Cargando software del equipo ${idEquipo}...`);
      const response = await fetch(`http://localhost:3000/api/software/equipo/${idEquipo}`);
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Software del equipo cargado:', data);
      setSoftwareEquipo(data);
    } catch (error) {
      console.error('❌ Error cargando software del equipo:', error);
      setSoftwareEquipo([]);
    } finally {
      setLoadingSoftware(false);
    }
  };

  // Cargar todo el software disponible
  const cargarTodoElSoftware = async () => {
    try {
      console.log('🔄 Cargando software desde /api/software...');
      const response = await fetch('http://localhost:3000/api/software');
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Software cargado:', data);
      setTodoElSoftware(data || []);
    } catch (error) {
      console.error('❌ Error cargando software:', error);
      setTodoElSoftware([]);
    }
  };

  useEffect(() => {
    cargarEquipos();
    cargarTodoElSoftware();
  }, []);

  // Seleccionar equipo
  const seleccionarEquipo = (equipo: Equipo) => {
    setEquipoSeleccionado(equipo);
    cargarSoftwareEquipo(equipo.id);
  };

  // Filtrar equipos
  const equiposFiltrados = equipos.filter(equipo => {
    const matchSearch = equipo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       (equipo.ubicacion && equipo.ubicacion.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchTipo = filtroTipo === 'todos' || equipo.tipo === filtroTipo;
    return matchSearch && matchTipo;
  });

  // Asignar software
  const asignarSoftware = async (idSoftware: number, observaciones?: string) => {
    if (!equipoSeleccionado) return;

    try {
      console.log(`🔄 Asignando software ${idSoftware} al equipo ${equipoSeleccionado.id}...`);
      const body = {
        idEquipo: equipoSeleccionado.id,
        idSoftware,
        observaciones
      };
      console.log('📤 Enviando datos:', body);
      
      const response = await fetch('http://localhost:3000/api/software/asignar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      console.log('✅ Software asignado exitosamente');
      cargarSoftwareEquipo(equipoSeleccionado.id);
      setShowAsignModal(false);
    } catch (error) {
      console.error('❌ Error asignando software:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      alert(`Error asignando software: ${errorMessage}`);
    }
  };

  // Desasignar software
  const desasignarSoftware = async (idAsignacion: number) => {
    try {
      await fetch(`http://localhost:3000/api/software/desasignar/${idAsignacion}`, {
        method: 'PUT',
      });
      if (equipoSeleccionado) {
        cargarSoftwareEquipo(equipoSeleccionado.id);
      }
    } catch (error) {
      console.error('Error desasignando software:', error);
    }
  };

  if (loading) {
    return (
      <ProcessLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
            <span className="text-lg text-gray-600">Cargando equipos...</span>
          </div>
        </div>
      </ProcessLayout>
    );
  }

  return (
    <ProcessLayout>
      <div className="space-y-6">
        {/* Header mejorado */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Package className="w-8 h-8 mr-3 text-blue-600" />
                Gestión de Software
              </h1>
              <p className="text-gray-600 mt-2">
                Administra el software instalado en {equipos.length} equipos computacionales
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <span className="text-blue-800 font-medium">{equiposFiltrados.length} equipos</span>
              </div>
              <PDFSoftwareGenerator className="min-w-[140px]" />
              <Button 
                onClick={() => {
                  cargarEquipos();
                  cargarTodoElSoftware();
                }}
                variant="outline"
                size="sm"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualizar
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Panel de Equipos - Mejorado */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-lg border shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Server className="w-6 h-6 mr-3 text-blue-600" />
                    Equipos
                  </h2>
                </div>

                {/* Controles de búsqueda y filtro mejorados */}
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Buscar equipos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                    <SelectTrigger>
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filtrar por tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los tipos</SelectItem>
                      <SelectItem value="IGM">IGM</SelectItem>
                      <SelectItem value="Z8">Z8</SelectItem>
                      <SelectItem value="LATSUR">LATSUR</SelectItem>
                      <SelectItem value="MAC">MAC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Lista de equipos mejorada */}
              <div className="max-h-[600px] overflow-y-auto">
                {equiposFiltrados.map((equipo) => (
                  <div
                    key={equipo.id}
                    onClick={() => seleccionarEquipo(equipo)}
                    className={`p-4 border-b border-gray-100 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                      equipoSeleccionado?.id === equipo.id
                        ? 'bg-blue-50 border-l-4 border-l-blue-500'
                        : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg border ${getColorTipo(equipo.tipo)}`}>
                          {getIconoTipo(equipo.tipo)}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{equipo.nombre}</h3>
                          <p className="text-sm text-gray-500">{equipo.ubicacion}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getColorTipo(equipo.tipo)}`}>
                          {equipo.tipo}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                ))}

                {equiposFiltrados.length === 0 && (
                  <div className="p-8 text-center">
                    <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No se encontraron equipos</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Panel de Software del Equipo - Mejorado */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-lg border shadow-sm">
              {equipoSeleccionado ? (
                <>
                  {/* Header del equipo seleccionado mejorado */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-lg border ${getColorTipo(equipoSeleccionado.tipo)}`}>
                          {getIconoTipo(equipoSeleccionado.tipo)}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {equipoSeleccionado.nombre}
                          </h3>
                          <p className="text-gray-600">{equipoSeleccionado.ubicacion}</p>
                          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${getColorTipo(equipoSeleccionado.tipo)}`}>
                            {equipoSeleccionado.tipo}
                          </span>
                        </div>
                      </div>
                      <Button onClick={() => setShowAsignarMultipleModal(true)} className="bg-green-600 hover:bg-green-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Asignar Software
                      </Button>
                    </div>
                  </div>

                  {/* Lista de software mejorada */}
                  <div className="p-6">
                    {loadingSoftware ? (
                      <div className="flex items-center justify-center h-32">
                        <RefreshCw className="h-6 w-6 animate-spin text-blue-600 mr-2" />
                        <span>Cargando software...</span>
                      </div>
                    ) : softwareEquipo.length > 0 ? (
                      <div className="space-y-4">
                        {softwareEquipo.map((item) => (
                          <div
                            key={item.idAsignacion}
                            className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <Package className="w-4 h-4 text-blue-600" />
                                  <h4 className="font-medium text-gray-900">{item.software.nombreSoftware}</h4>
                                  {item.software.version && (
                                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                      v{item.software.version}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center text-sm text-gray-500 mb-1">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  Instalado: {new Date(item.fechaAsignacion).toLocaleDateString()}
                                </div>
                                {item.observaciones && (
                                  <p className="text-sm text-gray-600">{item.observaciones}</p>
                                )}
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => desasignarSoftware(item.idAsignacion)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                Desasignar
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Sin software asignado</h3>
                        <p className="text-gray-500 mb-4">Este equipo no tiene software instalado registrado</p>
                        <Button
                          onClick={() => setShowAsignModal(true)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Asignar primer software
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="p-12 text-center">
                  <Monitor className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Selecciona un equipo</h3>
                  <p className="text-gray-500">Elige un equipo de la lista para ver su software instalado</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal de asignación de software */}
        {showAsignModal && equipoSeleccionado && (
          <ModalAsignacionSoftware
            equipo={equipoSeleccionado}
            softwareDisponible={todoElSoftware}
            softwareAsignado={softwareEquipo}
            onClose={() => setShowAsignModal(false)}
            onAsignar={asignarSoftware}
          />
        )}

        {/* Modal de asignación múltiple de software */}
        {showAsignarMultipleModal && equipoSeleccionado && (
          <AsignarSoftwareModal
            equipo={equipoSeleccionado}
            onClose={() => setShowAsignarMultipleModal(false)}
            onSuccess={() => {
              cargarSoftwareEquipo(equipoSeleccionado.id);
              setShowAsignarMultipleModal(false);
            }}
          />
        )}
      </div>
    </ProcessLayout>
  );
}

// Modal moderno para asignar software
interface ModalAsignacionSoftwareProps {
  equipo: Equipo;
  softwareDisponible: Software[];
  softwareAsignado: EquipoSoftware[];
  onClose: () => void;
  onAsignar: (idSoftware: number, observaciones?: string) => void;
}

const ModalAsignacionSoftware: React.FC<ModalAsignacionSoftwareProps> = ({
  equipo,
  softwareDisponible,
  softwareAsignado,
  onClose,
  onAsignar
}) => {
  const [selectedSoftware, setSelectedSoftware] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [searchSoftware, setSearchSoftware] = useState('');

  const idsAsignados = softwareAsignado.map(item => item.idSoftware);
  const softwareNoAsignado = softwareDisponible.filter(
    software => !idsAsignados.includes(software.idSoftware)
  );

  const softwareFiltrado = softwareNoAsignado.filter(software =>
    software.nombreSoftware.toLowerCase().includes(searchSoftware.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSoftware) {
      onAsignar(parseInt(selectedSoftware), observaciones || undefined);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Asignar Software</h3>
          <p className="text-gray-600">Equipo: <span className="font-medium">{equipo.nombre}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar Software
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchSoftware}
                onChange={(e) => setSearchSoftware(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Buscar software..."
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Software Disponible *
            </label>
            <select
              required
              value={selectedSoftware}
              onChange={(e) => setSelectedSoftware(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecciona software...</option>
              {softwareFiltrado.map((software) => (
                <option key={software.idSoftware} value={software.idSoftware}>
                  {software.nombreSoftware} {software.version && `(${software.version})`}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones
            </label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Notas sobre la instalación..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Asignar Software
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
