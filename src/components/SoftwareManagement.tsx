import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Monitor, Search } from 'lucide-react';
import SoftwareModal from './SoftwareModal';
import EquiposSoftwareModal from './EquiposSoftwareModal';

interface Software {
  idSoftware: number;
  nombreSoftware: string;
  version?: string;
  observaciones?: string;
  fechaCreacion: string;
  activo: boolean;
}

interface EquipoSoftware {
  idAsignacion: number;
  idEquipo: number;
  idSoftware: number;
  fechaAsignacion: string;
  observaciones?: string;
  software: Software;
  equipo?: {
    id: number;
    nombre: string;
    modelo?: string;
    numeroSerie?: string;
    ubicacion?: string;
    tipo: string;
  };
}

const SoftwareManagement = () => {
  const [software, setSoftware] = useState<Software[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedSoftware, setSelectedSoftware] = useState<Software | null>(null);
  const [equiposConSoftware, setEquiposConSoftware] = useState<EquipoSoftware[]>([]);

  // Cargar lista de software
  const cargarSoftware = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/software');
      const data = await response.json();
      setSoftware(data);
    } catch (error) {
      console.error('Error cargando software:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar equipos con software específico
  const cargarEquiposConSoftware = async (idSoftware: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/software/instalado/${idSoftware}`);
      const data = await response.json();
      setEquiposConSoftware(data);
    } catch (error) {
      console.error('Error cargando equipos:', error);
    }
  };

  useEffect(() => {
    cargarSoftware();
  }, []);

  // Filtrar software por término de búsqueda
  const softwareFiltrado = software.filter(item =>
    item.nombreSoftware.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.version && item.version.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Eliminar software
  const eliminarSoftware = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este software?')) {
      try {
        await fetch(`http://localhost:3000/api/software/${id}`, { method: 'DELETE' });
        cargarSoftware();
      } catch (error) {
        console.error('Error eliminando software:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Gestión de Software</h1>
        
        <div className="flex justify-between items-center mb-4">
          {/* Barra de búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar software..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Botón agregar */}
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Agregar Software
          </button>
        </div>
      </div>

      {/* Tabla de software */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Software
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Versión
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Observaciones
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Creación
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {softwareFiltrado.map((item) => (
              <tr key={item.idSoftware} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {item.nombreSoftware}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {item.version || '-'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs truncate">
                    {item.observaciones || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(item.fechaCreacion).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedSoftware(item);
                        cargarEquiposConSoftware(item.idSoftware);
                        setShowAssignModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                      title="Ver equipos con este software"
                    >
                      <Monitor className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedSoftware(item);
                        setShowAddModal(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => eliminarSoftware(item.idSoftware)}
                      className="text-red-600 hover:text-red-900"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {softwareFiltrado.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No se encontró software que coincida con la búsqueda
          </div>
        )}
      </div>

      {/* Modal de agregar/editar software */}
      {showAddModal && (
        <SoftwareModal
          software={selectedSoftware}
          onClose={() => {
            setShowAddModal(false);
            setSelectedSoftware(null);
          }}
          onSave={() => {
            cargarSoftware();
            setShowAddModal(false);
            setSelectedSoftware(null);
          }}
        />
      )}

      {/* Modal de equipos con software */}
      {showAssignModal && selectedSoftware && (
        <EquiposSoftwareModal
          software={selectedSoftware}
          equipos={equiposConSoftware}
          onClose={() => {
            setShowAssignModal(false);
            setSelectedSoftware(null);
          }}
          onRefresh={() => {
            if (selectedSoftware) {
              cargarEquiposConSoftware(selectedSoftware.idSoftware);
            }
          }}
        />
      )}
    </div>
  );
};

export default SoftwareManagement;
