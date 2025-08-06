import React, { useState, useEffect } from 'react';
import { 
  X, 
  AlertTriangle, 
  Search, 
  Monitor, 
  Trash2, 
  Info,
  CheckCircle,
  Clock,
  Archive,
  Eye,
  Calendar
} from 'lucide-react';

interface Equipo {
  id_equipo: number;
  nombre_pc: string;
  modelo: string;
  numero_serie: string;
  llave_inventario?: string;
  marca: string;
  tipo: string;
  ubicacion: string;
  observaciones?: string;
  fecha_baja?: string; // ✅ AGREGAR fecha_baja
  estado: 'ASIGNADO' | 'DISPONIBLE' | 'DADO DE BAJA';
  estado_asignacion?: 'ASIGNADO' | 'DISPONIBLE';
}

interface BajasEquipoModalProps {
  open: boolean;
  onClose: () => void;
}

const BajasEquipoModal: React.FC<BajasEquipoModalProps> = ({ open, onClose }) => {
  // Estados existentes
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [equiposFiltrados, setEquiposFiltrados] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEquipo, setSelectedEquipo] = useState<Equipo | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [motivo, setMotivo] = useState('');
  const [procesando, setProcesando] = useState(false);

  // ✅ NUEVOS: Estados para la pestaña de equipos dados de baja
  const [activeTab, setActiveTab] = useState<'activos' | 'dados-de-baja'>('activos');
  const [equiposDadosDeBaja, setEquiposDadosDeBaja] = useState<Equipo[]>([]);
  const [equiposDadosDeBajaFiltrados, setEquiposDadosDeBajaFiltrados] = useState<Equipo[]>([]);
  const [loadingDadosDeBaja, setLoadingDadosDeBaja] = useState(false);
  const [searchTermDadosDeBaja, setSearchTermDadosDeBaja] = useState('');
  const [selectedEquipoDadoDeBaja, setSelectedEquipoDadoDeBaja] = useState<Equipo | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Cargar equipos activos (función existente)
  const cargarEquipos = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/equipos/activos');
      const data = await response.json();
      setEquipos(Array.isArray(data) ? data : []);
      setEquiposFiltrados(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error cargando equipos:', error);
      setEquipos([]);
      setEquiposFiltrados([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ NUEVA: Cargar equipos dados de baja
  const cargarEquiposDadosDeBaja = async () => {
    try {
      setLoadingDadosDeBaja(true);
      const response = await fetch('http://localhost:3000/api/equipos/dados-de-baja');
      const data = await response.json();
      setEquiposDadosDeBaja(Array.isArray(data) ? data : []);
      setEquiposDadosDeBajaFiltrados(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error cargando equipos dados de baja:', error);
      setEquiposDadosDeBaja([]);
      setEquiposDadosDeBajaFiltrados([]);
    } finally {
      setLoadingDadosDeBaja(false);
    }
  };

  // Filtrar equipos activos (función existente)
  useEffect(() => {
    const filtered = equipos.filter(equipo =>
      equipo.nombre_pc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipo.numero_serie?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipo.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipo.marca?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setEquiposFiltrados(filtered);
  }, [searchTerm, equipos]);

  // ✅ NUEVO: Filtrar equipos dados de baja
  useEffect(() => {
    const filtered = equiposDadosDeBaja.filter(equipo =>
      equipo.nombre_pc?.toLowerCase().includes(searchTermDadosDeBaja.toLowerCase()) ||
      equipo.numero_serie?.toLowerCase().includes(searchTermDadosDeBaja.toLowerCase()) ||
      equipo.modelo?.toLowerCase().includes(searchTermDadosDeBaja.toLowerCase()) ||
      equipo.marca?.toLowerCase().includes(searchTermDadosDeBaja.toLowerCase())
    );
    setEquiposDadosDeBajaFiltrados(filtered);
  }, [searchTermDadosDeBaja, equiposDadosDeBaja]);

  // Cargar datos al abrir modal
  useEffect(() => {
    if (open) {
      cargarEquipos();
      cargarEquiposDadosDeBaja();
      setSearchTerm('');
      setSearchTermDadosDeBaja('');
      setSelectedEquipo(null);
      setSelectedEquipoDadoDeBaja(null);
      setMotivo('');
      setActiveTab('activos');
    }
  }, [open]);

  // Manejar dar de baja (función existente)
  const handleDarDeBaja = async () => {
    if (!selectedEquipo || !motivo.trim()) {
      alert('Por favor ingrese el motivo de la baja');
      return;
    }

    setProcesando(true);
    try {
      const response = await fetch(`http://localhost:3000/api/equipos/dar-baja/${selectedEquipo.id_equipo}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          motivo: motivo.trim(),
          observaciones: `Baja realizada el ${new Date().toLocaleDateString()}`
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      const resultado = await response.json();
      const mensajeCompleto = resultado.mensaje || 'Equipo dado de baja exitosamente';
      
      alert(mensajeCompleto);
      
      console.log('✅ Resultado de la baja:', resultado);
      
      setShowConfirmModal(false);
      setSelectedEquipo(null);
      setMotivo('');
      cargarEquipos(); // Recargar lista de activos
      cargarEquiposDadosDeBaja(); // Recargar lista de dados de baja
    } catch (error) {
      console.error('Error:', error);
      alert(`Error al dar de baja el equipo: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setProcesando(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Sistema de Bajas de Equipos IGM</h2>
                <p className="text-red-100 text-sm">Gestión y consulta de bajas para equipos institucionales</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ✅ NUEVO: Tabs */}
        <div className="bg-white border-b flex-shrink-0">
          <div className="flex">
            <button
              onClick={() => setActiveTab('activos')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'activos'
                  ? 'border-red-500 text-red-600 bg-red-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Dar de Baja ({equiposFiltrados.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('dados-de-baja')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'dados-de-baja'
                  ? 'border-gray-500 text-gray-600 bg-gray-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Archive className="w-4 h-4" />
                Dados de Baja ({equiposDadosDeBajaFiltrados.length})
              </div>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-hidden flex flex-col">
          
          {/* ✅ TAB: Dar de Baja (contenido existente actualizado) */}
          {activeTab === 'activos' && (
            <>
              {/* Search and Stats */}
              <div className="mb-6 flex items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre, serie, modelo o marca..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                
                <div className="ml-6 flex gap-4">
                  <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                    <div className="text-blue-600 font-semibold text-lg">{equiposFiltrados.length}</div>
                    <div className="text-blue-500 text-sm">Equipos Activos</div>
                  </div>
                  <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                    <div className="text-green-600 font-semibold text-lg">
                      {equiposFiltrados.filter(e => e.estado_asignacion === 'DISPONIBLE').length}
                    </div>
                    <div className="text-green-500 text-sm">Disponibles</div>
                  </div>
                  <div className="bg-yellow-50 px-4 py-2 rounded-lg border border-yellow-200">
                    <div className="text-yellow-600 font-semibold text-lg">
                      {equiposFiltrados.filter(e => e.estado_asignacion === 'ASIGNADO').length}
                    </div>
                    <div className="text-yellow-500 text-sm">Asignados</div>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="flex-1 overflow-hidden bg-white rounded-lg border border-gray-200 shadow-sm">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-gray-600">Cargando equipos...</p>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-auto h-full">
                    <table className="w-full">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Equipo
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Llave/Serie
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Modelo
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Marca/Tipo
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ubicación
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Estado
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {equiposFiltrados.map((equipo) => (
                          <tr key={equipo.id_equipo} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <Monitor className="w-5 h-5 text-gray-400 mr-3" />
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {equipo.nombre_pc || 'Sin nombre'}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    ID: {equipo.id_equipo}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">
                                {equipo.llave_inventario || '-'}
                              </div>
                              <div className="text-sm font-mono text-gray-500">
                                {equipo.numero_serie || '-'}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">{equipo.modelo || '-'}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">{equipo.marca || '-'}</div>
                              <div className="text-sm text-gray-500">{equipo.tipo || '-'}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">{equipo.ubicacion || '-'}</div>
                            </td>
                            <td className="px-6 py-4">
                              {equipo.estado_asignacion === 'DISPONIBLE' ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Disponible
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  <Clock className="w-3 h-3 mr-1" />
                                  Asignado
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => {
                                  setSelectedEquipo(equipo);
                                  setShowConfirmModal(true);
                                }}
                                className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-red-100 text-red-700 hover:bg-red-200"
                                title="Dar de baja equipo"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Dar de Baja
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {equiposFiltrados.length === 0 && !loading && (
                      <div className="text-center py-12">
                        <Monitor className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No se encontraron equipos</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ✅ NUEVA TAB: Equipos Dados de Baja (actualizada) */}
          {activeTab === 'dados-de-baja' && (
            <>
              {/* Search and Stats */}
              <div className="mb-6 flex items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar equipos dados de baja..."
                    value={searchTermDadosDeBaja}
                    onChange={(e) => setSearchTermDadosDeBaja(e.target.value)}
                    className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  />
                </div>
                
                <div className="ml-6 flex gap-4">
                  <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                    <div className="text-gray-600 font-semibold text-lg">{equiposDadosDeBajaFiltrados.length}</div>
                    <div className="text-gray-500 text-sm">Total Dados de Baja</div>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="flex-1 overflow-hidden bg-white rounded-lg border border-gray-200 shadow-sm">
                {loadingDadosDeBaja ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="animate-spin w-8 h-8 border-4 border-gray-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-gray-600">Cargando equipos dados de baja...</p>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-auto h-full">
                    <table className="w-full">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Equipo
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Llave/Serie
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Modelo
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Marca/Tipo
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ubicación
                          </th>
                          {/* ✅ NUEVA COLUMNA: Fecha de Baja */}
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fecha de Baja
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Estado
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {equiposDadosDeBajaFiltrados.map((equipo) => (
                          <tr key={equipo.id_equipo} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <Archive className="w-5 h-5 text-gray-400 mr-3" />
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {equipo.nombre_pc || 'Sin nombre'}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    ID: {equipo.id_equipo}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">
                                {equipo.llave_inventario || '-'}
                              </div>
                              <div className="text-sm font-mono text-gray-500">
                                {equipo.numero_serie || '-'}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">{equipo.modelo || '-'}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">{equipo.marca || '-'}</div>
                              <div className="text-sm text-gray-500">{equipo.tipo || '-'}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">{equipo.ubicacion || '-'}</div>
                            </td>
                            {/* ✅ NUEVA CELDA: Fecha de Baja */}
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">
                                {equipo.fecha_baja ? (
                                  <div className="flex items-center">
                                    <Calendar className="w-4 h-4 text-red-500 mr-2" />
                                    <span className="font-medium text-red-600">
                                      {new Date(equipo.fecha_baja).toLocaleDateString('es-CL', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-gray-400">Sin fecha</span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <Archive className="w-3 h-3 mr-1" />
                                Dado de Baja
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => {
                                  setSelectedEquipoDadoDeBaja(equipo);
                                  setShowDetailModal(true);
                                }}
                                className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200"
                                title="Ver detalles"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Ver Detalles
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {equiposDadosDeBajaFiltrados.length === 0 && !loadingDadosDeBaja && (
                      <div className="text-center py-12">
                        <Archive className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No hay equipos dados de baja</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal de confirmación de baja (existente) */}
      {showConfirmModal && selectedEquipo && (
        <div className="fixed inset-0 z-[10000] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Confirmar Baja de Equipo</h3>
                  <p className="text-sm text-gray-500">Esta acción no se puede deshacer</p>
                </div>
              </div>

              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Equipo seleccionado:</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>Nombre:</strong> {selectedEquipo.nombre_pc}</p>
                  <p><strong>Modelo:</strong> {selectedEquipo.modelo}</p>
                  <p><strong>Serie:</strong> {selectedEquipo.numero_serie}</p>
                  <p><strong>Marca:</strong> {selectedEquipo.marca}</p>
                  <p><strong>Estado:</strong> 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      selectedEquipo.estado_asignacion === 'ASIGNADO' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {selectedEquipo.estado_asignacion}
                    </span>
                  </p>
                </div>
                
                {selectedEquipo.estado_asignacion === 'ASIGNADO' && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2" />
                      <p className="text-sm text-yellow-800">
                        <strong>Equipo Asignado:</strong> Al dar de baja este equipo, 
                        se liberará automáticamente su asignación actual y quedará 
                        registrada en el historial.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivo de la baja <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  placeholder="Ingrese el motivo de la baja (ej: Equipo dañado, Obsoleto, etc.)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDarDeBaja}
                  disabled={procesando || !motivo.trim()}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {procesando ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Procesando...
                    </div>
                  ) : (
                    'Confirmar Baja'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ NUEVO: Modal de detalles de equipo dado de baja */}
      {showDetailModal && selectedEquipoDadoDeBaja && (
        <div className="fixed inset-0 z-[10000] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Info className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Detalles del Equipo Dado de Baja</h3>
                  <p className="text-sm text-gray-500">Información completa del equipo</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">ID Equipo</label>
                    <p className="text-sm text-gray-900">{selectedEquipoDadoDeBaja.id_equipo}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nombre PC</label>
                    <p className="text-sm text-gray-900">{selectedEquipoDadoDeBaja.nombre_pc || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Llave de Inventario</label>
                    <p className="text-sm font-medium text-blue-600">{selectedEquipoDadoDeBaja.llave_inventario || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Modelo</label>
                    <p className="text-sm text-gray-900">{selectedEquipoDadoDeBaja.modelo || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Número Serie</label>
                    <p className="text-sm font-mono text-gray-900">{selectedEquipoDadoDeBaja.numero_serie || '-'}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Marca</label>
                    <p className="text-sm text-gray-900">{selectedEquipoDadoDeBaja.marca || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Tipo</label>
                    <p className="text-sm text-gray-900">{selectedEquipoDadoDeBaja.tipo || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Ubicación</label>
                    <p className="text-sm text-gray-900">{selectedEquipoDadoDeBaja.ubicacion || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Estado</label>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <Archive className="w-3 h-3 mr-1" />
                      Dado de Baja
                    </span>
                  </div>
                </div>
              </div>

              {/* ✅ AGREGAR: Fecha de Baja */}
              <div className="mb-6">
                <label className="text-sm font-medium text-red-600 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Fecha de Baja
                </label>
                <p className="text-sm font-medium text-red-700 bg-red-50 px-2 py-1 rounded">
                  {selectedEquipoDadoDeBaja.fecha_baja ? 
                    new Date(selectedEquipoDadoDeBaja.fecha_baja).toLocaleDateString('es-CL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 
                    'Sin fecha registrada'
                  }
                </p>
              </div>

              {selectedEquipoDadoDeBaja.observaciones && (
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-500">Observaciones</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {selectedEquipoDadoDeBaja.observaciones}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BajasEquipoModal;