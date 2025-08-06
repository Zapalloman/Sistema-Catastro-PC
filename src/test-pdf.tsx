"use client"

import { PDFEquipmentGenerator } from "@/components/pdf-equipment-generator"

// Componente de prueba para verificar la funcionalidad del PDF
export default function TestPDF() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Prueba Generador PDF</h1>
      <p className="mb-4">Haz clic en el botón para generar un PDF con todos los equipos computacionales:</p>
      <PDFEquipmentGenerator />
    </div>
  )
}
