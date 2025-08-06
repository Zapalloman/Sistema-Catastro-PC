"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, FileText, Loader2 } from "lucide-react"
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

interface Equipo {
  id: number
  nombre: string
  modelo: string
  numeroSerie: string
  ubicacion: string
  categoria: string
  marca: string
  responsable: string
  tipo: 'IGM' | 'LATSUR' | 'Z8' | 'MAC'
}

interface PDFEquipmentGeneratorProps {
  className?: string
}

export function PDFEquipmentGenerator({ className }: PDFEquipmentGeneratorProps) {
  const [loading, setLoading] = useState(false)

  const obtenerEquiposComputacionales = async (): Promise<Equipo[]> => {
    try {
      const response = await fetch('http://localhost:3000/api/software/equipos/computacionales')
      if (!response.ok) {
        throw new Error('Error al obtener equipos computacionales')
      }
      const equiposComputacionales = await response.json()
      
      return equiposComputacionales.map((equipo: any) => ({
        id: equipo.id,
        nombre: equipo.nombre || 'Sin nombre',
        modelo: equipo.modelo || 'Sin modelo', 
        numeroSerie: equipo.numeroSerie || 'Sin serie',
        ubicacion: equipo.ubicacion || 'Sin ubicación',
        categoria: equipo.categoria || 'Sin categoría',
        marca: equipo.marca || 'Sin marca',
        responsable: equipo.responsable || 'Sin responsable',
        tipo: equipo.tipo as 'IGM' | 'LATSUR' | 'Z8' | 'MAC'
      }))
    } catch (error) {
      console.error('Error obteniendo equipos computacionales:', error)
      throw error
    }
  }

  const generarListadoPDF = async (equipos: Equipo[]) => {
    const pdfDoc = await PDFDocument.create()
    let currentPage = pdfDoc.addPage([841.89, 595.28]) // A4 Horizontal (landscape)
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    const fontSize = 10
    const headerFontSize = 12
    const titleFontSize = 14
    const marginX = 30
    const marginY = 30
    let y = 595.28 - marginY // Altura inicial con margen (ajustada para horizontal)

    // Función para dibujar una celda con borde
    const drawCell = (text: string, x: number, y: number, width: number, height: number, isHeader = false) => {
      // Dibujar borde de la celda
      currentPage.drawRectangle({
        x: x,
        y: y - height,
        width: width,
        height: height,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
        color: isHeader ? rgb(0.9, 0.9, 0.9) : rgb(1, 1, 1)
      })
      
      // Dibujar texto centrado en la celda
      const textWidth = font.widthOfTextAtSize(text, fontSize)
      const textX = x + (width - textWidth) / 2
      const textY = y - height/2 - fontSize/2
      
      currentPage.drawText(text, {
        x: textX,
        y: textY,
        size: fontSize,
        font: isHeader ? boldFont : font,
        color: rgb(0, 0, 0)
      })
    }

    // Función para agregar una nueva página
    const addNewPage = () => {
      currentPage = pdfDoc.addPage([841.89, 595.28]) // A4 Horizontal
      y = 595.28 - marginY // Ajustado para horizontal
      
      // Encabezado de continuación
      currentPage.drawText('LISTADO DE EQUIPOS COMPUTACIONALES (Continuación)', {
        x: marginX,
        y: y,
        size: headerFontSize,
        font: boldFont,
        color: rgb(0, 0, 0)
      })
      y -= 40
      drawTableHeader()
    }

    // Título principal
    currentPage.drawText('INSTITUTO GEOGRÁFICO MILITAR', {
      x: 841.89/2 - font.widthOfTextAtSize('INSTITUTO GEOGRÁFICO MILITAR', titleFontSize)/2, // Centrado horizontal
      y: y,
      size: titleFontSize,
      font: boldFont,
      color: rgb(0, 0, 0)
    })

    y -= 25
    currentPage.drawText('LISTADO DE EQUIPOS COMPUTACIONALES', {
      x: 841.89/2 - font.widthOfTextAtSize('LISTADO DE EQUIPOS COMPUTACIONALES', headerFontSize)/2, // Centrado horizontal
      y: y,
      size: headerFontSize,
      font: boldFont,
      color: rgb(0, 0, 0)
    })

    y -= 30
    const fechaGeneracion = new Date().toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    
    currentPage.drawText(`Fecha de generación: ${fechaGeneracion}`, {
      x: marginX,
      y: y,
      size: fontSize,
      font
    })

    y -= 40

    // Definir encabezados y anchos de columna (ajustados para formato horizontal)
    const headers = ['IDENTIFICACIÓN', 'EQUIPO', 'MARCA', 'Nº SERIE', 'MODELO', 'UBICACIÓN', 'RESPONSABLE']
    const colWidths = [80, 60, 80, 120, 130, 120, 180] // Total: ~770 (más espacio horizontal)
    const rowHeight = 20

    // Función para dibujar encabezados de tabla
    const drawTableHeader = () => {
      let x = marginX
      headers.forEach((header, i) => {
        drawCell(header, x, y, colWidths[i], rowHeight, true)
        x += colWidths[i]
      })
      y -= rowHeight
    }

    // Dibujar encabezados
    drawTableHeader()

    // Dibujar filas de datos
    equipos.forEach((equipo, index) => {
      // Verificar si necesitamos una nueva página (ajustado para horizontal)
      if (y < 60) {
        addNewPage()
      }

      let x = marginX
      const values = [
        equipo.id.toString(),
        'PC', // Siempre PC ya que son equipos computacionales
        equipo.marca,
        equipo.numeroSerie,
        equipo.modelo,
        equipo.ubicacion,
        equipo.responsable
      ]

      values.forEach((val, i) => {
        // Truncar texto si es muy largo para que quepa en la celda
        let displayText = val
        const maxWidth = colWidths[i] - 10 // Dejar margen
        while (font.widthOfTextAtSize(displayText, fontSize) > maxWidth && displayText.length > 3) {
          displayText = displayText.substring(0, displayText.length - 4) + '...'
        }
        
        drawCell(displayText, x, y, colWidths[i], rowHeight, false)
        x += colWidths[i]
      })

      y -= rowHeight
    })

    // Pie de página
    const totalPages = pdfDoc.getPageCount()
    for (let i = 0; i < totalPages; i++) {
      const page = pdfDoc.getPages()[i]
      page.drawText(`Página ${i + 1} de ${totalPages} - Instituto Geográfico Militar`, {
        x: 50,
        y: 30,
        size: 8,
        font,
        color: rgb(0.5, 0.5, 0.5)
      })
    }

    // Guardar PDF
    const pdfBytes = await pdfDoc.save()
    
    // Crear blob y descargar
    const blob = new Blob([pdfBytes], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    
    const fecha = new Date().toISOString().split('T')[0]
    link.download = `Listado_Equipos_${fecha}.pdf`
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleGenerarPDF = async () => {
    try {
      setLoading(true)
      console.log('🔄 Iniciando generación de PDF...')
      
      // Obtener equipos computacionales
      const equipos = await obtenerEquiposComputacionales()
      console.log(`📊 Equipos obtenidos: ${equipos.length}`)
      
      if (equipos.length === 0) {
        alert('No se encontraron equipos computacionales para generar el PDF.')
        return
      }

      // Generar PDF
      await generarListadoPDF(equipos)
      console.log('✅ PDF generado correctamente')
      
    } catch (error) {
      console.error('❌ Error generando PDF:', error)
      alert('Error al generar el PDF. Revise la consola para más detalles.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleGenerarPDF}
      disabled={loading}
      className={`bg-red-600 hover:bg-red-700 text-white ${className}`}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Generando PDF...
        </>
      ) : (
        <>
          <FileText className="w-4 h-4 mr-2" />
          Listado PDF Equipos
        </>
      )}
    </Button>
  )
}
