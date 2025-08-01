import React, { useState } from 'react';
import { X, Plus, Trash2, Calendar } from 'lucide-react';

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

interface EquiposSoftwareModalProps {
  software: Software;
  equipos: EquipoSoftware[];
  onClose: () => void;
  onRefresh: () => void;
}

const EquiposSoftwareModal: React.FC<EquiposSoftwareModalProps> = ({ 
  software, 
  equipos, 
  onClose, 
  onRefresh 
}) => {
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    idEquipo: '',
    observaciones: ''
  });
  const [loading, setLoading] = useState(false);

  // Asignar software a equipo
  const asignarSoftware = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch('http://localhost:3000/api/software/asignar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idEquipo: parseInt(newAssignment.idEquipo),
          idSoftware: software.idSoftware,
          observaciones: newAssignment.observaciones || undefined
        }),
      });

      setNewAssignment({ idEquipo: '', observaciones: '' });
      setShowAssignForm(false);
      onRefresh();
    } catch (error) {
      console.error('Error asignando software:', error);
      alert('Error al asignar el software');
    } finally {
      setLoading(false);
    }
  };

  // Desasignar software de equipo
  const desasignarSoftware = async (idAsignacion: number) => {
    if (confirm('¿Estás seguro de desasignar este software del equipo?')) {
      try {
        await fetch(`http://localhost:3000/api/software/desasignar/${idAsignacion}`, {
          method: 'PUT',
        });
        onRefresh();
      } catch (error) {
        console.error('Error desasignando software:', error);
        alert('Error al desasignar el software');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold">Equipos con {software.nombreSoftware}</h2>
            {software.version && (
              <p className="text-sm text-gray-600">Versión: {software.version}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Botón para asignar a nuevo equipo */}
        <div className="mb-4">
          <button
            onClick={() => setShowAssignForm(!showAssignForm)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Asignar a Equipo
          </button>
        </div>

        {/* Formulario de asignación */}
        {showAssignForm && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="font-medium mb-3">Asignar a Nuevo Equipo</h3>
            <form onSubmit={asignarSoftware} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID del Equipo *
                </label>
                <input
                  type="number"
                  required
                  value={newAssignment.idEquipo}
                  onChange={(e) => setNewAssignment({ ...newAssignment, idEquipo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ingresa el ID del equipo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observaciones
                </label>
                <input
                  type="text"
                  value={newAssignment.observaciones}
                  onChange={(e) => setNewAssignment({ ...newAssignment, observaciones: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Notas opcionales"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Asignando...' : 'Asignar'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAssignForm(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de equipos */}
        <div className="bg-white rounded-lg border">
          {equipos.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Equipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ubicación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Asignación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Observaciones
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {equipos.map((equipo) => (
                    <tr key={equipo.idAsignacion} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {equipo.equipo?.nombre || `Equipo ${equipo.idEquipo}`}
                        </div>
                        {equipo.equipo?.modelo && (
                          <div className="text-xs text-gray-500">
                            {equipo.equipo.modelo}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          equipo.equipo?.tipo === 'IGM' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {equipo.equipo?.tipo || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {equipo.equipo?.ubicacion || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          {new Date(equipo.fechaAsignacion).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {equipo.observaciones || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => desasignarSoftware(equipo.idAsignacion)}
                          className="text-red-600 hover:text-red-900"
                          title="Desasignar software"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="mb-2">
                Este software no está asignado a ningún equipo
              </div>
              <div className="text-sm">
                Usa el botón "Asignar a Equipo" para asignarlo
              </div>
            </div>
          )}
        </div>

        {/* Botón cerrar */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EquiposSoftwareModal;
