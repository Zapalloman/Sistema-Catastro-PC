"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileText, Loader2 } from "lucide-react"
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

interface Software {
  idSoftware: number
  nombreSoftware: string
  version?: string
  observaciones?: string
  cantidadLicencias?: string
  empresaProductora?: string
  fechaCreacion: string
}

interface PDFSoftwareGeneratorProps {
  className?: string
}

export function PDFSoftwareGenerator({ className }: PDFSoftwareGeneratorProps) {
  const [loading, setLoading] = useState(false)

  const obtenerListadoSoftware = async (): Promise<Software[]> => {
    try {
      const response = await fetch('http://localhost:3000/api/software/lista/completa')
      if (!response.ok) {
        throw new Error('Error al obtener listado de software')
      }
      const software = await response.json()
      
      return software.map((item: any) => ({
        idSoftware: item.idSoftware,
        nombreSoftware: item.nombreSoftware || 'Sin nombre',
        version: item.version || 'Sin versión',
        observaciones: item.observaciones || '',
        cantidadLicencias: item.cantidadLicencias || 'No especificada',
        empresaProductora: item.empresaProductora || 'No especificada',
        fechaCreacion: item.fechaCreacion
      }))
    } catch (error) {
      console.error('Error obteniendo listado de software:', error)
      throw error
    }
  }

  const generarListadoPDF = async (software: Software[]) => {
    const pdfDoc = await PDFDocument.create()
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    
    const pageWidth = 595 // A4 vertical
    const pageHeight = 842
    const margin = 40
    const rowHeight = 20
    const usableHeight = pageHeight - margin * 2 - 120 // espacio para header/footer ajustado
    const rowsPerPage = Math.floor(usableHeight / rowHeight)

    // Cargar logo (opcional)
    let logoImage = null
    try {
      const logoResponse = await fetch('/images/logo-igm.png')
      
      if (logoResponse.ok) {
        const logoArrayBuffer = await logoResponse.arrayBuffer()
        
        try {
          logoImage = await pdfDoc.embedPng(logoArrayBuffer)
        } catch (pngError) {
          try {
            logoImage = await pdfDoc.embedJpg(logoArrayBuffer)
          } catch (jpgError) {
            console.error('Error cargando logo:', jpgError)
          }
        }
      }
    } catch (error) {
      console.error('Error cargando logo:', error)
    }

    const drawHeader = (page: any, pageIndex: number, totalPages: number) => {
      // FILA 1: Logo a la izquierda, información del documento a la derecha
      // Logo
      if (logoImage) {
        page.drawImage(logoImage, {
          x: margin,
          y: pageHeight - 60, // Primera fila
          width: 100,
          height: 40,
        })
      } else {
        // Placeholder si no hay logo
        page.drawText('IGM', {
          x: margin + 40,
          y: pageHeight - 40,
          size: 16,
          font: boldFont,
          color: rgb(0, 0, 0)
        })
      }

      // Información del documento (primera fila, lado derecho)
      page.drawText('Código: IGM PSAP 7.1.3-1.6.1', {
        x: pageWidth - 200,
        y: pageHeight - 25, // Primera fila
        size: 9,
        font,
      })

      page.drawText('Revisión: 4', {
        x: pageWidth - 200,
        y: pageHeight - 40, // Primera fila
        size: 9,
        font,
      })

      page.drawText('Fecha Revisión: 25-08-17', {
        x: pageWidth - 200,
        y: pageHeight - 55, // Primera fila
        size: 9,
        font,
      })

      // FILA 2: Título centrado (con suficiente espacio desde la fila 1)
      const titulo = 'LISTADO DE SOFTWARE PRODUCTIVOS Y ADMINISTRATIVOS'
      const tituloWidth = boldFont.widthOfTextAtSize(titulo, 12)
      page.drawText(titulo, {
        x: (pageWidth - tituloWidth) / 2,
        y: pageHeight - 85, // Segunda fila, bien separada
        size: 12,
        font: boldFont,
        color: rgb(0, 0, 0),
      })

      // Número de página (abajo derecha)
      page.drawText(`Página ${pageIndex + 1} de ${totalPages}`, {
        x: pageWidth - margin - 100,
        y: margin - 10,
        size: 10,
        font,
      })

      // Fecha actualización (abajo izquierda)
      const fechaActual = new Date().toLocaleDateString('es-CL', {
        year: 'numeric',
        month: 'long'
      })
      page.drawText(`Fecha actualización: Santiago, ${fechaActual}.`, {
        x: margin,
        y: margin - 10,
        size: 10,
        font,
      })

      // Encabezados de columnas (con más espacio desde el título)
      const headers = ['SOFTWARE', 'VERSIÓN', 'LICENCIAS', 'EMPRESA']
      const columnWidths = [200, 80, 100, 135]
      let x = margin
      let y = pageHeight - 120 // Más espacio desde el título

      // Dibujar línea superior de encabezados
      page.drawLine({
        start: { x: margin, y: y + 15 },
        end: { x: pageWidth - margin, y: y + 15 },
        thickness: 1,
        color: rgb(0, 0, 0),
      })

      headers.forEach((header, i) => {
        page.drawText(header, {
          x,
          y,
          size: 10,
          font: boldFont,
          color: rgb(0, 0, 0),
        })
        x += columnWidths[i]
      })

      // Dibujar línea inferior de encabezados
      page.drawLine({
        start: { x: margin, y: y - 5 },
        end: { x: pageWidth - margin, y: y - 5 },
        thickness: 1,
        color: rgb(0, 0, 0),
      })

      return y - 15
    }

    const totalPages = Math.ceil(software.length / rowsPerPage)

    for (let i = 0; i < totalPages; i++) {
      const page = pdfDoc.addPage([pageWidth, pageHeight])
      let y = drawHeader(page, i, totalPages)

      const columnWidths = [200, 80, 100, 135]
      
      for (let j = 0; j < rowsPerPage; j++) {
        const idx = i * rowsPerPage + j
        if (idx >= software.length) break

        const entry = software[idx]
        let x = margin

        const values = [
          entry.nombreSoftware || 'Sin nombre',
          entry.version || 'Sin versión',
          entry.cantidadLicencias || 'No especificada',
          entry.empresaProductora || 'No especificada'
        ]

        values.forEach((text, col) => {
          // Asegurar que text es string y no undefined/null
          let displayText = String(text || '')
          const maxWidth = columnWidths[col] - 10
          while (font.widthOfTextAtSize(displayText, 10) > maxWidth && displayText.length > 3) {
            displayText = displayText.substring(0, displayText.length - 4) + '...'
          }

          page.drawText(displayText, {
            x,
            y,
            size: 10,
            font,
            color: rgb(0, 0, 0),
          })
          x += columnWidths[col]
        })

        y -= rowHeight
      }
    }

    // Guardar PDF
    const pdfBytes = await pdfDoc.save()
    
    // Crear blob y descargar
    const blob = new Blob([pdfBytes], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    
    const fecha = new Date().toISOString().split('T')[0]
    link.download = `Listado_Software_${fecha}.pdf`
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleGenerarPDF = async () => {
    try {
      setLoading(true)
      console.log('🔄 Iniciando generación de PDF de software...')
      
      // Obtener listado completo de software
      const software = await obtenerListadoSoftware()
      console.log(`📊 Software obtenido: ${software.length}`)
      
      if (software.length === 0) {
        alert('No se encontró software para generar el PDF.')
        return
      }

      // Generar PDF
      await generarListadoPDF(software)
      console.log('✅ PDF de software generado correctamente')
      
    } catch (error) {
      console.error('❌ Error generando PDF de software:', error)
      alert('Error al generar el PDF. Revise la consola para más detalles.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleGenerarPDF}
      disabled={loading}
      className={`bg-green-600 hover:bg-green-700 text-white ${className}`}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Generando PDF...
        </>
      ) : (
        <>
          <FileText className="w-4 h-4 mr-2" />
          PDF SOFTWARE
        </>
      )}
    </Button>
  )
}
