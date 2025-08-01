import React, { useState, useEffect } from 'react';
import { Monitor, Calendar, FileText, Plus } from 'lucide-react';

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
}

interface EquipoSoftwareViewProps {
  idEquipo: number;
}

const EquipoSoftwareView: React.FC<EquipoSoftwareViewProps> = ({ idEquipo }) => {
  const [softwareAsignado, setSoftwareAsignado] = useState<EquipoSoftware[]>([]);
  const [todoElSoftware, setTodoElSoftware] = useState<Software[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Cargar software asignado al equipo
  const cargarSoftwareAsignado = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/software/equipo/${idEquipo}`);
      const data = await response.json();
      setSoftwareAsignado(data);
    } catch (error) {
      console.error('Error cargando software del equipo:', error);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarSoftwareAsignado();
    cargarTodoElSoftware();
  }, [idEquipo]);

  // Asignar software nuevo
  const asignarSoftware = async (idSoftware: number, observaciones?: string) => {
    try {
      await fetch('http://localhost:3000/api/software/asignar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idEquipo,
          idSoftware,
          observaciones
        }),
      });
      cargarSoftwareAsignado();
    } catch (error) {
      console.error('Error asignando software:', error);
    }
  };

  // Desasignar software
  const desasignarSoftware = async (idAsignacion: number) => {
    if (confirm('¿Estás seguro de desasignar este software?')) {
      try {
        await fetch(`http://localhost:3000/api/software/desasignar/${idAsignacion}`, {
          method: 'PUT',
        });
        cargarSoftwareAsignado();
      } catch (error) {
        console.error('Error desasignando software:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium flex items-center">
            <Monitor className="w-5 h-5 mr-2 text-blue-600" />
            Software del Equipo #{idEquipo}
          </h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Asignar Software
          </button>
        </div>
      </div>

      <div className="p-6">
        {softwareAsignado.length > 0 ? (
          <div className="space-y-4">
            {softwareAsignado.map((item) => (
              <div
                key={item.idAsignacion}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {item.software.nombreSoftware}
                    </h4>
                    {item.software.version && (
                      <p className="text-sm text-gray-600 mt-1">
                        Versión: {item.software.version}
                      </p>
                    )}
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      Asignado: {new Date(item.fechaAsignacion).toLocaleDateString()}
                    </div>
                    {item.observaciones && (
                      <div className="flex items-start mt-2 text-sm text-gray-600">
                        <FileText className="w-4 h-4 mr-1 mt-0.5" />
                        {item.observaciones}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => desasignarSoftware(item.idAsignacion)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Desasignar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Monitor className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Este equipo no tiene software asignado</p>
            <p className="text-sm mt-1">Usa el botón "Asignar Software" para agregar</p>
          </div>
        )}
      </div>

      {/* Modal simple para asignar software */}
      {showAddModal && (
        <AsignarSoftwareModal
          idEquipo={idEquipo}
          softwareDisponible={todoElSoftware}
          softwareAsignado={softwareAsignado}
          onClose={() => setShowAddModal(false)}
          onAssign={asignarSoftware}
        />
      )}
    </div>
  );
};

// Modal simple para asignar software
interface AsignarSoftwareModalProps {
  idEquipo: number;
  softwareDisponible: Software[];
  softwareAsignado: EquipoSoftware[];
  onClose: () => void;
  onAssign: (idSoftware: number, observaciones?: string) => void;
}

const AsignarSoftwareModal: React.FC<AsignarSoftwareModalProps> = ({
  softwareDisponible,
  softwareAsignado,
  onClose,
  onAssign
}) => {
  const [selectedSoftware, setSelectedSoftware] = useState('');
  const [observaciones, setObservaciones] = useState('');

  // Filtrar software ya asignado
  const idsAsignados = softwareAsignado.map(item => item.idSoftware);
  const softwareNoAsignado = softwareDisponible.filter(
    software => !idsAsignados.includes(software.idSoftware)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSoftware) {
      onAssign(parseInt(selectedSoftware), observaciones || undefined);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Asignar Software</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Software *
            </label>
            <select
              required
              value={selectedSoftware}
              onChange={(e) => setSelectedSoftware(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecciona un software</option>
              {softwareNoAsignado.map((software) => (
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Notas opcionales..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Asignar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EquipoSoftwareView;
