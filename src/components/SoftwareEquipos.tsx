'use client';

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
  HardDrive
} from 'lucide-react';

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

const SoftwareEquipos = () => {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState<Equipo | null>(null);
  const [softwareEquipo, setSoftwareEquipo] = useState<EquipoSoftware[]>([]);
  const [todoElSoftware, setTodoElSoftware] = useState<Software[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSoftware, setLoadingSoftware] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [showAsignModal, setShowAsignModal] = useState(false);

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
      case 'IGM': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Z8': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LATSUR': return 'bg-green-100 text-green-800 border-green-200';
      case 'MAC': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Cargar equipos computacionales
  const cargarEquipos = async () => {
    try {
      setLoading(true);
      
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

      setEquipos(equiposUnificados);
    } catch (error) {
      console.error('Error general cargando equipos:', error);
      // Fallback con datos de ejemplo si fallan las APIs
      const equiposSimulados: Equipo[] = [
        { id: 1, nombre: 'PC-IGM-001', tipo: 'IGM', ubicacion: 'Oficina 1', estado: 'Activo' },
        { id: 2, nombre: 'PC-IGM-002', tipo: 'IGM', ubicacion: 'Oficina 2', estado: 'Activo' },
        { id: 3, nombre: 'WS-Z8-001', tipo: 'Z8', ubicacion: 'Lab Técnico', estado: 'Activo' },
        { id: 4, nombre: 'PC-LATSUR-001', tipo: 'LATSUR', ubicacion: 'Sala 3', estado: 'Activo' },
        { id: 5, nombre: 'MAC-001', tipo: 'MAC', ubicacion: 'Diseño', estado: 'Activo' },
      ];
      setEquipos(equiposSimulados);
    } finally {
      setLoading(false);
    }
  };

  // Cargar software de un equipo
  const cargarSoftwareEquipo = async (idEquipo: number) => {
    try {
      setLoadingSoftware(true);
      const response = await fetch(`http://localhost:3000/api/software/equipo/${idEquipo}`);
      const data = await response.json();
      setSoftwareEquipo(data);
    } catch (error) {
      console.error('Error cargando software del equipo:', error);
      setSoftwareEquipo([]);
    } finally {
      setLoadingSoftware(false);
    }
  };

  // Cargar todo el software disponible
  const cargarTodoElSoftware = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/software');
      const data = await response.json();
      setTodoElSoftware(data);
    } catch (error) {
      console.error('Error cargando software:', error);
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
      await fetch('http://localhost:3000/api/software/asignar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idEquipo: equipoSeleccionado.id,
          idSoftware,
          observaciones
        })
      });
      
      cargarSoftwareEquipo(equipoSeleccionado.id);
      setShowAsignModal(false);
    } catch (error) {
      console.error('Error asignando software:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Software por Equipos</h1>
        <p className="text-gray-600">Administra el software instalado en todos los equipos computacionales</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel de Equipos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Server className="w-6 h-6 mr-3 text-blue-600" />
                Equipos Computacionales
              </h2>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {equiposFiltrados.length} equipos
              </span>
            </div>

            {/* Controles de búsqueda y filtro */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar equipos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="todos">Todos</option>
                  <option value="IGM">IGM</option>
                  <option value="Z8">Z8</option>
                  <option value="LATSUR">LATSUR</option>
                  <option value="MAC">MAC</option>
                </select>
              </div>
            </div>
          </div>

          {/* Lista de equipos */}
          <div className="p-2 max-h-96 overflow-y-auto">
            {equiposFiltrados.map((equipo) => (
              <div
                key={equipo.id}
                onClick={() => seleccionarEquipo(equipo)}
                className={`p-4 m-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                  equipoSeleccionado?.id === equipo.id
                    ? 'bg-blue-50 border-2 border-blue-200 shadow-md'
                    : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getColorTipo(equipo.tipo)}`}>
                      {getIconoTipo(equipo.tipo)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{equipo.nombre}</h3>
                      <p className="text-sm text-gray-500">{equipo.ubicacion}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getColorTipo(equipo.tipo)}`}>
                      {equipo.tipo}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel de Software del Equipo */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {equipoSeleccionado ? (
            <>
              {/* Header del equipo seleccionado */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                      <div className={`p-2 rounded-lg mr-3 ${getColorTipo(equipoSeleccionado.tipo)}`}>
                        {getIconoTipo(equipoSeleccionado.tipo)}
                      </div>
                      {equipoSeleccionado.nombre}
                    </h3>
                    <p className="text-gray-600">{equipoSeleccionado.ubicacion}</p>
                  </div>
                  <button
                    onClick={() => setShowAsignModal(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Asignar Software</span>
                  </button>
                </div>
              </div>

              {/* Lista de software */}
              <div className="p-6">
                {loadingSoftware ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : softwareEquipo.length > 0 ? (
                  <div className="space-y-3">
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
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Sin software asignado</h3>
                    <p className="text-gray-500 mb-4">Este equipo no tiene software instalado registrado</p>
                    <button
                      onClick={() => setShowAsignModal(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Asignar primer software
                    </button>
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
    </div>
  );
};

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
          <p className="text-gray-600">Equipo: {equipo.nombre}</p>
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
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Asignar Software
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SoftwareEquipos;
