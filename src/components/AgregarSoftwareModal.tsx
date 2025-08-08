"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { X, Plus, Package } from 'lucide-react';

interface AgregarSoftwareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSoftwareAgregado: () => void;
}

export default function AgregarSoftwareModal({ 
  isOpen, 
  onClose, 
  onSoftwareAgregado 
}: AgregarSoftwareModalProps) {
  const [formData, setFormData] = useState({
    nombreSoftware: '',
    version: '',
    cantidadLicencias: '',
    empresaProductora: '',
    observaciones: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setFormData({
      nombreSoftware: '',
      version: '',
      cantidadLicencias: '',
      empresaProductora: '',
      observaciones: ''
    });
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombreSoftware.trim()) {
      setError('El nombre del software es obligatorio');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/api/software', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombreSoftware: formData.nombreSoftware.trim(),
          version: formData.version.trim() || undefined,
          cantidadLicencias: formData.cantidadLicencias.trim() || undefined,
          empresaProductora: formData.empresaProductora.trim() || undefined,
          observaciones: formData.observaciones.trim() || undefined
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al agregar el software');
      }

      // Limpiar formulario y cerrar modal
      resetForm();
      onClose();
      onSoftwareAgregado();
      
      // Mostrar mensaje de éxito
      alert('Software agregado exitosamente');
      
    } catch (error) {
      console.error('Error agregando software:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="bg-green-100 p-2 rounded-lg mr-3">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Agregar Nuevo Software</h2>
              <p className="text-sm text-gray-600">Ingresa la información del nuevo software</p>
            </div>
          </div>
          <Button
            onClick={handleClose}
            variant="ghost"
            size="sm"
            className="rounded-full p-2"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Nombre del Software - Obligatorio */}
            <div>
              <label htmlFor="nombreSoftware" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Software <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nombreSoftware"
                name="nombreSoftware"
                value={formData.nombreSoftware}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: Microsoft Office, Adobe Photoshop, AutoCAD..."
                required
              />
            </div>

            {/* Versión - Opcional */}
            <div>
              <label htmlFor="version" className="block text-sm font-medium text-gray-700 mb-2">
                Versión
              </label>
              <input
                type="text"
                id="version"
                name="version"
                value={formData.version}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: 2024, v15.2, 3.1.5..."
              />
            </div>

            {/* Cantidad de Licencias - Opcional */}
            <div>
              <label htmlFor="cantidadLicencias" className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad de Licencias
              </label>
              <input
                type="text"
                id="cantidadLicencias"
                name="cantidadLicencias"
                value={formData.cantidadLicencias}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: 10, Ilimitada, 1 por equipo..."
              />
            </div>

            {/* Empresa Productora - Opcional */}
            <div>
              <label htmlFor="empresaProductora" className="block text-sm font-medium text-gray-700 mb-2">
                Empresa Productora
              </label>
              <input
                type="text"
                id="empresaProductora"
                name="empresaProductora"
                value={formData.empresaProductora}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: Microsoft, Adobe, Autodesk..."
              />
            </div>

            {/* Observaciones - Opcional */}
            <div>
              <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700 mb-2">
                Observaciones
              </label>
              <textarea
                id="observaciones"
                name="observaciones"
                value={formData.observaciones}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Notas adicionales sobre el software..."
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <Button
              type="button"
              onClick={handleClose}
              variant="outline"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.nombreSoftware.trim()}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Agregando...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Software
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
