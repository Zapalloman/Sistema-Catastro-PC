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

    // Cargar logo (opcional - si no se encuentra, se usará placeholder)
    let logoImage = null
    try {
      const logoResponse = await fetch('/images/logo-igm.png')
      
      if (logoResponse.ok) {
        const logoArrayBuffer = await logoResponse.arrayBuffer()
        
        // Intentar cargar como PNG primero
        try {
          logoImage = await pdfDoc.embedPng(logoArrayBuffer)
        } catch (pngError) {
          // Si falla PNG, intentar como JPEG
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
      
      // Dibujar encabezado en páginas de continuación (sin información de página por ahora)
      drawDocumentHeader()
      y -= 80 // Espacio después del encabezado
      drawTableHeader()
    }

    // Función para dibujar el encabezado del documento
    const drawDocumentHeader = () => {
      const headerHeight = 60
      const headerY = y
      
      // Configuración de las 3 columnas del encabezado
      const col1Width = 150  // Columna del logo
      const col2Width = 400  // Columna del título central
      const col3Width = 200  // Columna de información del documento
      const totalHeaderWidth = col1Width + col2Width + col3Width // 750px total
      
      // Centrar el encabezado en la página (A4 horizontal = 841.89px)
      const headerStartX = (841.89 - totalHeaderWidth) / 2
      
      // Dibujar bordes del encabezado
      // Columna 1 (Logo)
      currentPage.drawRectangle({
        x: headerStartX,
        y: headerY - headerHeight,
        width: col1Width,
        height: headerHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
        color: rgb(1, 1, 1)
      })
      
      // Columna 2 (Título)
      currentPage.drawRectangle({
        x: headerStartX + col1Width,
        y: headerY - headerHeight,
        width: col2Width,
        height: headerHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
        color: rgb(1, 1, 1)
      })
      
      // Columna 3 (Información del documento)
      currentPage.drawRectangle({
        x: headerStartX + col1Width + col2Width,
        y: headerY - headerHeight,
        width: col3Width,
        height: headerHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
        color: rgb(1, 1, 1)
      })
      
      // Columna 1: Logo o placeholder (disponible en todas las páginas)
      if (logoImage) {
        // Calcular dimensiones del logo manteniendo proporción
        const logoMaxWidth = col1Width - 20  // Margen de 10px a cada lado
        const logoMaxHeight = headerHeight - 20  // Margen de 10px arriba y abajo
        
        const logoOriginalWidth = logoImage.width
        const logoOriginalHeight = logoImage.height
        const logoAspectRatio = logoOriginalWidth / logoOriginalHeight
        
        let logoDisplayWidth = logoMaxWidth
        let logoDisplayHeight = logoMaxWidth / logoAspectRatio
        
        // Si la altura calculada excede el máximo, ajustar por altura
        if (logoDisplayHeight > logoMaxHeight) {
          logoDisplayHeight = logoMaxHeight
          logoDisplayWidth = logoMaxHeight * logoAspectRatio
        }
        
        // Centrar el logo en la columna
        const logoX = headerStartX + (col1Width - logoDisplayWidth) / 2
        const logoY = headerY - headerHeight + (headerHeight - logoDisplayHeight) / 2
        
        currentPage.drawImage(logoImage, {
          x: logoX,
          y: logoY,
          width: logoDisplayWidth,
          height: logoDisplayHeight
        })
      } else {
        // Placeholder de texto si no hay logo
        currentPage.drawText('IGM', {
          x: headerStartX + col1Width/2 - font.widthOfTextAtSize('IGM', 16)/2,
          y: headerY - headerHeight/2 - 8,
          size: 16,
          font: boldFont,
          color: rgb(0, 0, 0)
        })
        
        currentPage.drawText('LOGO', {
          x: headerStartX + col1Width/2 - font.widthOfTextAtSize('LOGO', 10)/2,
          y: headerY - headerHeight/2 - 25,
          size: 10,
          font,
          color: rgb(0.5, 0.5, 0.5)
        })
      }
      
      // Texto en columna 2 (Título principal)
      const tituloTexto = 'LISTADO DE EQUIPOS COMPUTACIONALES'
      const tituloWidth = boldFont.widthOfTextAtSize(tituloTexto, 14)
      currentPage.drawText(tituloTexto, {
        x: headerStartX + col1Width + (col2Width - tituloWidth) / 2,
        y: headerY - headerHeight/2 - 7,
        size: 14,
        font: boldFont,
        color: rgb(0, 0, 0)
      })
      
      // Texto en columna 3 (Información del documento)
      const infoX = headerStartX + col1Width + col2Width + 10
      const fechaRevision = '25-08-17' // Fecha fija de revisión
      
      currentPage.drawText('Código: IGM PSAP 7.1.3-1.2.1', {
        x: infoX,
        y: headerY - 15,
        size: 8,
        font,
        color: rgb(0, 0, 0)
      })
      
      // NO dibujar número de página aquí - se dibujará al final
      
      currentPage.drawText('Revisión: 2', {
        x: infoX,
        y: headerY - 39,
        size: 8,
        font,
        color: rgb(0, 0, 0)
      })
      
      currentPage.drawText(`Fecha Revisión: ${fechaRevision}`, {
        x: infoX,
        y: headerY - 51,
        size: 8,
        font,
        color: rgb(0, 0, 0)
      })
    }

    // Dibujar encabezado en la primera página
    drawDocumentHeader()
    y -= 80 // Espacio después del encabezado

    // Definir encabezados y anchos de columna (ajustados para formato horizontal)
    const headers = ['IDENTIFICACIÓN', 'EQUIPO', 'MARCA', 'Nº SERIE', 'MODELO', 'UBICACIÓN', 'RESPONSABLE']
    const colWidths = [80, 60, 80, 120, 130, 120, 180] // Total: ~770 (más espacio horizontal)
    const rowHeight = 20
    
    // Calcular posición centrada para la tabla
    const totalTableWidth = colWidths.reduce((sum, width) => sum + width, 0) // 770px
    const tableStartX = (841.89 - totalTableWidth) / 2

    // Función para dibujar encabezados de tabla
    const drawTableHeader = () => {
      let x = tableStartX
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

      let x = tableStartX
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

    // Actualizar números de página en todos los encabezados y agregar pie de página
    const totalPages = pdfDoc.getPageCount()
    const fechaGeneracion = new Date().toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    
    // Calcular posición centrada del encabezado (mismos valores que en drawDocumentHeader)
    const col1Width = 150
    const col2Width = 400
    const col3Width = 200
    const totalHeaderWidth = col1Width + col2Width + col3Width
    const headerStartX = (841.89 - totalHeaderWidth) / 2
    
    for (let i = 0; i < totalPages; i++) {
      const page = pdfDoc.getPages()[i]
      
      // Actualizar número de página en el encabezado
      const infoX = headerStartX + col1Width + col2Width + 10 // Posición de la columna de información centrada
      const headerY = 595.28 - marginY // Posición Y del encabezado
      
      // Dibujar rectángulo blanco para cubrir el área del número de página
      page.drawRectangle({
        x: infoX - 2,
        y: headerY - 33,
        width: col3Width - 15, // Usar el ancho de la columna menos márgenes
        height: 12,
        color: rgb(1, 1, 1),
        borderWidth: 0
      })
      
      // Dibujar el número de página correcto (alineado a la izquierda como el resto del texto)
      const pageText = `Página: ${i + 1} de ${totalPages}`
      const pageTextX = headerStartX + col1Width + col2Width + 10 // Misma posición X que los otros textos
      
      page.drawText(pageText, {
        x: pageTextX,
        y: headerY - 27,
        size: 8,
        font,
        color: rgb(0, 0, 0)
      })
      
      // Pie de página (mantener el existente)
      page.drawText(`Página ${i + 1} de ${totalPages} - Instituto Geográfico Militar`, {
        x: 50,
        y: 30,
        size: 8,
        font,
        color: rgb(0.5, 0.5, 0.5)
      })
      
      // Fecha de generación (derecha)
      const fechaText = `Fecha de generación: ${fechaGeneracion}`
      const fechaWidth = font.widthOfTextAtSize(fechaText, 8)
      page.drawText(fechaText, {
        x: 841.89 - 50 - fechaWidth, // Posicionado en la esquina inferior derecha
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
          PDF EQUIPOS ISO
        </>
      )}
    </Button>
  )
}
