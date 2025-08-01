import React, { useState, useEffect } from 'react';
import { X, Plus, Search, Check } from 'lucide-react';

interface Software {
  idSoftware: number;
  nombreSoftware: string;
  version?: string;
  observaciones?: string;
  fechaCreacion: string;
  activo: boolean;
}

interface Equipo {
  id: number;
  nombre: string;
  tipo: 'IGM' | 'Z8' | 'LATSUR' | 'MAC';
  ubicacion?: string;
  estado?: string;
}

interface AsignarSoftwareModalProps {
  equipo: Equipo;
  onClose: () => void;
  onSuccess: () => void;
}

const AsignarSoftwareModal: React.FC<AsignarSoftwareModalProps> = ({ 
  equipo, 
  onClose, 
  onSuccess 
}) => {
  const [software, setSoftware] = useState<Software[]>([]);
  const [softwareAsignado, setSoftwareAsignado] = useState<Software[]>([]);
  const [softwareSeleccionado, setSoftwareSeleccionado] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Cargar todo el software disponible
  const cargarSoftware = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/software');
      const data = await response.json();
      setSoftware(data || []);
    } catch (error) {
      console.error('Error cargando software:', error);
    }
  };

  // Cargar software ya asignado al equipo
  const cargarSoftwareAsignado = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/software/equipo/${equipo.id}`);
      const data = await response.json();
      setSoftwareAsignado(data.map((item: any) => item.software) || []);
    } catch (error) {
      console.error('Error cargando software asignado:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarSoftware();
    cargarSoftwareAsignado();
  }, [equipo.id]);

  // Filtrar software disponible (no asignado)
  const softwareDisponible = software.filter(item => {
    const yaAsignado = softwareAsignado.some(asignado => asignado.idSoftware === item.idSoftware);
    const matchSearch = item.nombreSoftware.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       (item.version && item.version.toLowerCase().includes(searchTerm.toLowerCase()));
    return !yaAsignado && matchSearch;
  });

  // Toggle selección de software
  const toggleSoftware = (idSoftware: number) => {
    setSoftwareSeleccionado(prev => 
      prev.includes(idSoftware)
        ? prev.filter(id => id !== idSoftware)
        : [...prev, idSoftware]
    );
  };

  // Asignar software seleccionado
  const asignarSoftware = async () => {
    if (softwareSeleccionado.length === 0) {
      alert('Selecciona al menos un software para asignar');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('http://localhost:3000/api/software/asignar-multiples', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idEquipo: equipo.id,
          softwareIds: softwareSeleccionado,
          observaciones: observaciones || undefined
        }),
      });

      const result = await response.json();
      
      if (result.errores && result.errores.length > 0) {
        const mensaje = `Asignación completada:\n• ${result.asignaciones} software(s) asignado(s)\n• ${result.errores.length} error(es):\n${result.errores.map((e: string) => `  - ${e}`).join('\n')}`;
        alert(mensaje);
      } else {
        alert(`${result.asignaciones} software(s) asignado(s) correctamente`);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error asignando software:', error);
      alert('Error al asignar el software');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-center mt-4">Cargando software...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold">Asignar Software</h2>
            <p className="text-sm text-gray-600">
              Equipo: <span className="font-medium">{equipo.nombre}</span>
              {equipo.ubicacion && (
                <span className="ml-2">• {equipo.ubicacion}</span>
              )}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Barra de búsqueda */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar software..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Lista de software disponible */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">
            Software Disponible ({softwareDisponible.length})
          </h3>
          <div className="bg-gray-50 rounded-lg max-h-64 overflow-y-auto">
            {softwareDisponible.length > 0 ? (
              <div className="space-y-2 p-4">
                {softwareDisponible.map((item) => (
                  <div
                    key={item.idSoftware}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      softwareSeleccionado.includes(item.idSoftware)
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => toggleSoftware(item.idSoftware)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">
                          {item.nombreSoftware}
                        </div>
                        {item.version && (
                          <div className="text-sm text-gray-600">
                            Versión: {item.version}
                          </div>
                        )}
                      </div>
                      {softwareSeleccionado.includes(item.idSoftware) && (
                        <Check className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? 'No se encontró software' : 'Todo el software ya está asignado a este equipo'}
              </div>
            )}
          </div>
        </div>

        {/* Software ya asignado */}
        {softwareAsignado.length > 0 && (
          <div className="mb-6">
            <h3 className="font-medium mb-3 text-gray-600">
              Software Ya Asignado ({softwareAsignado.length})
            </h3>
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {softwareAsignado.map((item) => (
                  <div key={item.idSoftware} className="text-sm text-gray-700">
                    • {item.nombreSoftware} {item.version && `(${item.version})`}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Observaciones */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Observaciones
          </label>
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Notas opcionales sobre la asignación..."
          />
        </div>

        {/* Resumen de selección */}
        {softwareSeleccionado.length > 0 && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">
              Software Seleccionado ({softwareSeleccionado.length})
            </h4>
            <div className="space-y-1">
              {softwareSeleccionado.map(id => {
                const item = software.find(s => s.idSoftware === id);
                return item ? (
                  <div key={id} className="text-sm text-blue-800">
                    • {item.nombreSoftware} {item.version && `(${item.version})`}
                  </div>
                ) : null;
              })}
            </div>
          </div>
        )}

        {/* Botones */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            onClick={asignarSoftware}
            disabled={softwareSeleccionado.length === 0 || saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Asignando...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Asignar ({softwareSeleccionado.length})
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AsignarSoftwareModal;
