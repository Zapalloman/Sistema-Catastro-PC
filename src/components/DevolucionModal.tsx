import React, { useState, useEffect } from 'react';
import { 
  X, 
  RefreshCw, 
  Search, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Download,
  Calendar,
  User
} from 'lucide-react';

interface Prestamo {
  id_prestamo: number;
  fecha_prestamo: string;
  rut_revisor: string;
  rut_entrega: string;
  rut_responsable: string;
  cargo_prestamo: string;
  motivo: string;
  estado: string;
  equipos?: any[];
  nombre_revisor?: string;
  nombre_entrega?: string;
  nombre_responsable?: string;
}

interface DevolucionModalProps {
  open: boolean;
  onClose: () => void;
}

const DevolucionModal: React.FC<DevolucionModalProps> = ({ open, onClose }) => {
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [prestamosFiltrados, setPrestamosFiltrados] = useState<Prestamo[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para el modal de confirmación
  const [selectedPrestamo, setSelectedPrestamo] = useState<Prestamo | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [motivoDevolucion, setMotivoDevolucion] = useState('');
  const [observacionesDevolucion, setObservacionesDevolucion] = useState('');
  const [procesando, setProcesando] = useState(false);

  // Cargar préstamos activos
  const cargarPrestamosActivos = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/prestamos');
      const data = await response.json();
      
      // Filtrar solo préstamos activos (estado = '1')
      const prestamosActivos = Array.isArray(data) ? data.filter(p => p.estado === '1') : [];
      setPrestamos(prestamosActivos);
      setPrestamosFiltrados(prestamosActivos);
      console.log(`✅ ${prestamosActivos.length} préstamos activos cargados`);
    } catch (error) {
      console.error('Error cargando préstamos activos:', error);
      setPrestamos([]);
      setPrestamosFiltrados([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar préstamos
  useEffect(() => {
    const filtered = prestamos.filter(prestamo =>
      prestamo.cargo_prestamo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prestamo.motivo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prestamo.rut_responsable?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prestamo.nombre_responsable?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setPrestamosFiltrados(filtered);
  }, [searchTerm, prestamos]);

  // Cargar datos al abrir modal
  useEffect(() => {
    if (open) {
      cargarPrestamosActivos();
      setSearchTerm('');
      setSelectedPrestamo(null);
      setMotivoDevolucion('');
      setObservacionesDevolucion('');
    }
  }, [open]);

  // Manejar devolución
  const handleDevolver = async () => {
    if (!selectedPrestamo || !motivoDevolucion.trim()) {
      alert('Por favor ingrese el motivo de la devolución');
      return;
    }

    setProcesando(true);
    try {
      const response = await fetch(`http://localhost:3000/api/prestamos/devolver/${selectedPrestamo.id_prestamo}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          motivo_devolucion: motivoDevolucion.trim(),
          observaciones_devolucion: observacionesDevolucion.trim() || null
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      const resultado = await response.json();
      const mensajeCompleto = resultado.mensaje || 'Préstamo devuelto exitosamente';
      
      alert(`${mensajeCompleto}\n\nEquipos devueltos: ${resultado.equipos_devueltos}\nDocumento generado: ${resultado.documento_path}`);
      
      console.log('✅ Resultado de la devolución:', resultado);
      
      setShowConfirmModal(false);
      setSelectedPrestamo(null);
      setMotivoDevolucion('');
      setObservacionesDevolucion('');
      cargarPrestamosActivos(); // Recargar lista
    } catch (error) {
      console.error('Error:', error);
      alert(`Error al devolver el préstamo: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setProcesando(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Sistema de Devolución de Equipos Externos</h2>
                <p className="text-orange-100 text-sm">Procesar devolución de equipos en préstamo activo</p>
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

        {/* Content */}
        <div className="flex-1 p-6 overflow-hidden flex flex-col">
          
          {/* Search and Stats */}
          <div className="mb-6 flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por cargo, motivo, o responsable..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            
            <div className="ml-6 flex gap-4">
              <div className="bg-orange-50 px-4 py-2 rounded-lg border border-orange-200">
                <div className="text-orange-600 font-semibold text-lg">{prestamosFiltrados.length}</div>
                <div className="text-orange-500 text-sm">Préstamos Activos</div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-hidden bg-white rounded-lg border border-gray-200 shadow-sm">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600">Cargando préstamos activos...</p>
                </div>
              </div>
            ) : (
              <div className="overflow-auto h-full">
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Préstamo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Responsable
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cargo/Motivo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Equipos
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {prestamosFiltrados.map((prestamo) => (
                      <tr key={prestamo.id_prestamo} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <FileText className="w-5 h-5 text-gray-400 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                #{prestamo.id_prestamo}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {prestamo.id_prestamo}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {new Date(prestamo.fecha_prestamo).toLocaleDateString('es-CL')}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {prestamo.nombre_responsable || prestamo.rut_responsable}
                          </div>
                          <div className="text-sm text-gray-500">
                            {prestamo.rut_responsable}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{prestamo.cargo_prestamo}</div>
                          <div className="text-sm text-gray-500">{prestamo.motivo}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {prestamo.equipos?.length || 0} equipos
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              setSelectedPrestamo(prestamo);
                              setShowConfirmModal(true);
                            }}
                            className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-orange-100 text-orange-700 hover:bg-orange-200"
                            title="Devolver préstamo"
                          >
                            <RefreshCw className="w-4 h-4 mr-1" />
                            Devolver
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {prestamosFiltrados.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No se encontraron préstamos activos</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de confirmación de devolución */}
      {showConfirmModal && selectedPrestamo && (
        <div className="fixed inset-0 z-[10000] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Confirmar Devolución de Préstamo</h3>
                  <p className="text-sm text-gray-500">Se generará documento de devolución</p>
                </div>
              </div>

              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Préstamo seleccionado:</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>ID:</strong> #{selectedPrestamo.id_prestamo}</p>
                  <p><strong>Fecha:</strong> {new Date(selectedPrestamo.fecha_prestamo).toLocaleDateString('es-CL')}</p>
                  <p><strong>Responsable:</strong> {selectedPrestamo.nombre_responsable || selectedPrestamo.rut_responsable}</p>
                  <p><strong>Cargo:</strong> {selectedPrestamo.cargo_prestamo}</p>
                  <p><strong>Motivo original:</strong> {selectedPrestamo.motivo}</p>
                  <p><strong>Equipos:</strong> {selectedPrestamo.equipos?.length || 0} equipos</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivo de la devolución <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={motivoDevolucion}
                  onChange={(e) => setMotivoDevolucion(e.target.value)}
                  placeholder="Ingrese el motivo de la devolución (ej: Fin de actividad, Cambio de destino, etc.)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observaciones adicionales
                </label>
                <textarea
                  value={observacionesDevolucion}
                  onChange={(e) => setObservacionesDevolucion(e.target.value)}
                  placeholder="Observaciones adicionales sobre la devolución (opcional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows={2}
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
                  onClick={handleDevolver}
                  disabled={procesando || !motivoDevolucion.trim()}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {procesando ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Procesando...
                    </div>
                  ) : (
                    'Confirmar Devolución'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevolucionModal;