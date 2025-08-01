import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Software {
  idSoftware: number;
  nombreSoftware: string;
  version?: string;
  observaciones?: string;
  fechaCreacion: string;
  activo: boolean;
}

interface SoftwareModalProps {
  software: Software | null;
  onClose: () => void;
  onSave: () => void;
}

const SoftwareModal: React.FC<SoftwareModalProps> = ({ software, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nombreSoftware: '',
    version: '',
    observaciones: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (software) {
      setFormData({
        nombreSoftware: software.nombreSoftware,
        version: software.version || '',
        observaciones: software.observaciones || ''
      });
    } else {
      setFormData({
        nombreSoftware: '',
        version: '',
        observaciones: ''
      });
    }
  }, [software]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = software 
        ? `http://localhost:3000/api/software/${software.idSoftware}`
        : 'http://localhost:3000/api/software';
      
      const method = software ? 'PUT' : 'POST';

      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      onSave();
    } catch (error) {
      console.error('Error guardando software:', error);
      alert('Error al guardar el software');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {software ? 'Editar Software' : 'Agregar Software'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Nombre del software */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Software *
            </label>
            <input
              type="text"
              required
              value={formData.nombreSoftware}
              onChange={(e) => setFormData({ ...formData, nombreSoftware: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Microsoft Office"
            />
          </div>

          {/* Versión */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Versión
            </label>
            <input
              type="text"
              value={formData.version}
              onChange={(e) => setFormData({ ...formData, version: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: 2019"
            />
          </div>

          {/* Observaciones */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones
            </label>
            <textarea
              value={formData.observaciones}
              onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Notas adicionales..."
            />
          </div>

          {/* Botones */}
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
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Guardando...' : (software ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SoftwareModal;
