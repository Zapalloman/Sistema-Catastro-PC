"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileText, Loader2, User, UserCheck, Building2, X } from "lucide-react"
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

interface EquipoBaja {
  codigo: string
  fechaAdquisicion: string
  marca: string
  serie: string
  causa: string
}

interface Firmante {
  nombre: string
  grado: string
  cargo: string
}

interface PDFBajasGeneratorProps {
  className?: string
}

export function PDFBajasGenerator({ className }: PDFBajasGeneratorProps) {
  const [loading, setLoading] = useState(false)
  const [showFirmanteModal, setShowFirmanteModal] = useState(false)
  const [firmante, setFirmante] = useState<Firmante>({
    nombre: "",
    grado: "",
    cargo: ""
  })

  const obtenerEquiposBajas = async (): Promise<EquipoBaja[]> => {
    try {
      // ✅ USAR ENDPOINT ESPECÍFICO PARA BAJAS
      const response = await fetch('http://localhost:3000/api/equipos/bajas')
      if (!response.ok) {
        throw new Error('Error al obtener equipos en proceso de baja')
      }
      const equipos = await response.json()
      
      console.log('📋 Datos recibidos del backend (equipos/bajas):', equipos)
      
      // ✅ DEBUGGING ADICIONAL: Verificar también endpoint de dados-de-baja
      try {
        const responseDados = await fetch('http://localhost:3000/api/equipos/dados-de-baja')
        const equiposDados = await responseDados.json()
        console.log('📋 Datos del endpoint dados-de-baja:', equiposDados)
      } catch (error) {
        console.log('⚠️ No se pudo obtener datos de dados-de-baja:', error)
      }
      
      // Los datos ya vienen mapeados correctamente desde el backend
      return equipos.map((equipo: any) => ({
        codigo: equipo.codigo || 'Sin código',
        fechaAdquisicion: equipo.fechaAdquisicion || 'Sin fecha',
        marca: equipo.marca || 'Sin marca',
        serie: equipo.serie || 'Sin serie',
        causa: equipo.causa || 'Sin especificar' // ✅ Ya viene procesada desde las observaciones
      }))
    } catch (error) {
      console.error('Error obteniendo equipos de baja:', error)
      throw error // ✅ LANZAR ERROR EN LUGAR DE RETORNAR DATOS DE EJEMPLO
    }
  }

  const generarInformeBajasPDF = async (
    fecha: string,
    equipos: EquipoBaja[],
    firmante: Firmante
  ): Promise<Uint8Array> => {
    const pdfDoc = await PDFDocument.create()
    let currentPage = pdfDoc.addPage([612, 792]) // carta vertical

    const { width } = currentPage.getSize()

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    const drawText = (page: any, text: string, x: number, y: number, options: any = {}) => {
      page.drawText(text, {
        x,
        y,
        size: 10,
        font,
        color: rgb(0, 0, 0),
        ...options,
      })
    }

    const drawCenteredText = (page: any, text: string, y: number, options: any = {}) => {
      const textSize = options.size || 10
      const selectedFont = options.font || font
      const textWidth = selectedFont.widthOfTextAtSize(text, textSize)
      page.drawText(text, {
        x: (width - textWidth) / 2,
        y,
        size: textSize,
        font: selectedFont,
        color: rgb(0, 0, 0),
        ...options,
      })
    }

    // Función para dibujar texto que se ajuste a un ancho específico
    const drawWrappedText = (page: any, text: string, x: number, y: number, maxWidth: number, options: any = {}) => {
      const textSize = options.size || 8
      const selectedFont = options.font || font
      
      if (selectedFont.widthOfTextAtSize(text, textSize) <= maxWidth) {
        page.drawText(text, { x, y, size: textSize, font: selectedFont, color: rgb(0, 0, 0), ...options })
        return y
      }
      
      // Si es muy largo, truncar con "..."
      let truncated = text
      while (selectedFont.widthOfTextAtSize(truncated + "...", textSize) > maxWidth && truncated.length > 0) {
        truncated = truncated.slice(0, -1)
      }
      page.drawText(truncated + "...", { x, y, size: textSize, font: selectedFont, color: rgb(0, 0, 0), ...options })
      return y
    }

    const drawTableHeader = (page: any, y: number) => {
      const headers = [
        "N.º",
        "CÓDIGO DEL BIEN", 
        "FECHA ADQUISICIÓN",
        "MARCA",
        "N.º DE SERIE",
        "CAUSA",
      ]
      // ✅ AJUSTAR POSICIONES PARA EVITAR SOBREPOSICIÓN
      const colX = [50, 80, 170, 270, 335, 410]

      // Dibujar cabecera con fondo
      page.drawRectangle({
        x: 45,
        y: y - 5,
        width: width - 90,
        height: 18,
        color: rgb(0.95, 0.95, 0.95),
      })

      headers.forEach((header, i) => {
        drawText(page, header, colX[i], y, { font: boldFont, size: 8 })
      })
      
      return y - 20
    }

    let y = 750

    // Cabecera en primera página
    drawText(currentPage, "EJEMPLAR N.º __/__/ HOJA N.º __/__/", 400, y, { size: 8 })
    y -= 35

    // ✅ ENCABEZADO CENTRADO EN LA PARTE SUPERIOR IZQUIERDA
    
    // Función para centrar texto en un área específica (mitad izquierda de la página)
    const drawLeftCenteredHeaderText = (page: any, text: string, y: number, options: any = {}) => {
      const textWidth = (options.font || font).widthOfTextAtSize(text, options.size || 12)
      // Centrar en la mitad izquierda de la página (desde margen izquierdo hasta centro)
      const leftAreaWidth = 300 // Ancho del área izquierda
      const startX = 50 // Margen izquierdo
      const centeredX = startX + (leftAreaWidth - textWidth) / 2
      drawText(page, text, centeredX, y, options)
    }
    
    drawLeftCenteredHeaderText(currentPage, "EJÉRCITO DE CHILE", y, { font: boldFont, size: 12 })
    y -= 18
    drawLeftCenteredHeaderText(currentPage, "INSTITUTO GEOGRÁFICO MILITAR", y, { font: boldFont, size: 12 })
    y -= 18
    drawLeftCenteredHeaderText(currentPage, "SICE", y, { font: boldFont, size: 12 })
    y -= 35

    drawCenteredText(currentPage, `ACTA DE ENTREGA DE BAJAS ${fecha.slice(-4)}`, y, {
      font: boldFont,
      size: 14,
    })
    y -= 40

    // Texto de certificación con mejor formato y justificación
    const textoCertificacion = `Con fecha ${fecha} el Administrador de Soporte Computacional de la SICE que suscribe certifica los bienes de Activo Fijo dados de baja durante la gestión año ${fecha.slice(-4)} que a continuación se detallan:`
    
    // Función para justificar texto
    const drawJustifiedText = (page: any, text: string, startX: number, startY: number, maxWidth: number, lineHeight: number = 15) => {
      const words = text.split(' ')
      let currentLine = ''
      let currentY = startY
      
      for (let i = 0; i < words.length; i++) {
        const testLine = currentLine + (currentLine ? ' ' : '') + words[i]
        const testWidth = font.widthOfTextAtSize(testLine, 10)
        
        if (testWidth > maxWidth && currentLine) {
          // Justificar la línea actual (excepto la última)
          if (i < words.length - 1) {
            const lineWords = currentLine.split(' ')
            if (lineWords.length > 1) {
              const totalWordWidth = lineWords.reduce((sum, word) => sum + font.widthOfTextAtSize(word, 10), 0)
              const totalSpaceWidth = maxWidth - totalWordWidth
              const spaceWidth = totalSpaceWidth / (lineWords.length - 1)
              
              let x = startX
              for (let j = 0; j < lineWords.length; j++) {
                drawText(page, lineWords[j], x, currentY, { size: 10 })
                if (j < lineWords.length - 1) {
                  x += font.widthOfTextAtSize(lineWords[j], 10) + spaceWidth
                }
              }
            } else {
              drawText(page, currentLine, startX, currentY, { size: 10 })
            }
          } else {
            // Última línea, alineación normal
            drawText(page, currentLine, startX, currentY, { size: 10 })
          }
          
          currentLine = words[i]
          currentY -= lineHeight
        } else {
          currentLine = testLine
        }
      }
      
      // Dibujar la última línea sin justificar
      if (currentLine) {
        drawText(page, currentLine, startX, currentY, { size: 10 })
        currentY -= lineHeight
      }
      
      return currentY
    }
    
    // Aplicar texto justificado
    const maxWidthTexto = width - 100
    y = drawJustifiedText(currentPage, textoCertificacion, 50, y, maxWidthTexto)
    
    y -= 20

    drawText(currentPage, "Especies:", 50, y, { font: boldFont, size: 11 })
    y -= 25

    // Cabecera tabla
    // ✅ AJUSTAR POSICIONES PARA EVITAR SOBREPOSICIÓN - DEBE COINCIDIR CON drawTableHeader
    const colX = [50, 80, 170, 270, 335, 410]
    const colWidths = [30, 90, 100, 65, 75, 180]
    y = drawTableHeader(currentPage, y)

    // Tabla equipos con mejor formato
    equipos.forEach((item, idx) => {
      if (y < 120) { // ✅ MÁS ESPACIO PARA PIE DE PÁGINA
        currentPage = pdfDoc.addPage([612, 792])
        y = 750
        
        // Redibujar cabecera en nueva página
        y = drawTableHeader(currentPage, y)
      }

      // Alternar color de fila
      if (idx % 2 === 0) {
        currentPage.drawRectangle({
          x: 45,
          y: y - 3,
          width: width - 90,
          height: 15,
          color: rgb(0.98, 0.98, 0.98),
        })
      }

      const values = [
        (idx + 1).toString(),
        item.codigo,
        item.fechaAdquisicion,
        item.marca,
        item.serie,
        item.causa,
      ]
      
      values.forEach((text, i) => {
        drawWrappedText(currentPage, text, colX[i], y, colWidths[i] - 5, { size: 8 })
      })
      y -= 15
    })

    // Total
    y -= 15
    drawText(
      currentPage,
      `TOTAL: ${equipos.length} Especies dadas de baja durante la gestión año ${fecha.slice(-4)}.`,
      50,
      y,
      { font: boldFont, size: 11 }
    )
    y -= 50

    // Recibe / Entrega
    drawText(currentPage, "RECIBE", 150, y, { font: boldFont, size: 11 })
    drawText(currentPage, "ENTREGA", 370, y, { font: boldFont, size: 11 })
    y -= 50

    drawText(currentPage, "NESTOR CARRASCO CATRIL", 100, y, { font: boldFont, size: 10 })
    drawText(currentPage, "FABRIZIO PÉREZ GUZMÁN", 340, y, { font: boldFont, size: 10 })
    y -= 15
    
    // ✅ CARGOS CENTRADOS CON RESPECTO A LOS NOMBRES
    drawText(currentPage, "CBO", 165, y, { size: 10 }) // Centrado bajo "NESTOR CARRASCO CATRIL"
    drawText(currentPage, "PAC", 405, y, { size: 10 }) // Centrado bajo "FABRIZIO PÉREZ GUZMÁN"
    y -= 15
    
    // ✅ DESCRIPCIONES DE CARGO PERFECTAMENTE CENTRADAS
    drawText(currentPage, "Supervisor de Bienes uso PAF", 110, y, { size: 9 }) // Mejor centrado bajo nombre izquierdo
    drawText(currentPage, "Administrador Soporte Computacional", 335, y, { size: 9 }) // Mejor centrado bajo nombre derecho

    // Firma final con datos del formulario
    y -= 60
    drawCenteredText(currentPage, firmante.nombre, y, { font: boldFont, size: 11 })
    y -= 18
    drawCenteredText(currentPage, firmante.grado, y, { size: 10 })
    y -= 18
    drawCenteredText(currentPage, firmante.cargo, y, { size: 10 })

    // Distribución
    y -= 50
    drawText(currentPage, "DISTRIBUCIÓN:", 50, y, { font: boldFont, size: 9 })
    y -= 15
    drawText(currentPage, "UCTL INVENTARIO", 50, y, { size: 9 })
    y -= 12
    drawText(currentPage, "SICE (Archivo)", 50, y, { size: 9 })
    y -= 12
    drawText(currentPage, "2. Ejs. 2 Hjs.", 50, y, { size: 9 })
    y -= 12
    drawText(currentPage, "SDIR/SICE/PACFPG", 50, y, { size: 9 })

    return await pdfDoc.save()
  }

  const handleGenerarPDF = async () => {
    try {
      setLoading(true)
      console.log('🔄 Iniciando generación de PDF de bajas...')
      
      // Obtener equipos en proceso de baja
      const equipos = await obtenerEquiposBajas()
      console.log(`📊 Equipos en baja obtenidos: ${equipos.length}`)
      
      if (equipos.length === 0) {
        alert('No se encontraron equipos dados de baja para generar el informe.')
        return
      }

      // Mostrar modal para datos del firmante
      setShowFirmanteModal(true)
      
    } catch (error) {
      console.error('❌ Error obteniendo equipos de bajas:', error)
      alert('Error al obtener los equipos dados de baja. Verifique la conexión con el servidor.')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmarGeneracion = async () => {
    if (!firmante.nombre.trim() || !firmante.grado.trim() || !firmante.cargo.trim()) {
      alert('Por favor complete todos los campos del firmante.')
      return
    }

    try {
      setLoading(true)
      console.log('📄 Generando documento PDF...')
      
      // Obtener equipos nuevamente
      const equipos = await obtenerEquiposBajas()
      
      // Configurar fecha
      const fechaActual = new Date()
      const fecha = `${fechaActual.getDate().toString().padStart(2, '0')}${
        fechaActual.toLocaleDateString('es-CL', { month: 'short' }).toUpperCase().replace('.', '')
      }${fechaActual.getFullYear()}`

      // Generar PDF
      const pdfBytes = await generarInformeBajasPDF(fecha, equipos, firmante)
      console.log('✅ PDF de bajas generado correctamente')
      
      // Crear blob y descargar
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      const fechaArchivo = new Date().toISOString().split('T')[0]
      link.download = `Informe_Bajas_${fechaArchivo}.pdf`
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      console.log(`💾 Archivo descargado: Informe_Bajas_${fechaArchivo}.pdf`)
      
      // Cerrar modal y limpiar formulario
      setShowFirmanteModal(false)
      setFirmante({ nombre: "", grado: "", cargo: "" })
      
    } catch (error) {
      console.error('❌ Error generando PDF de bajas:', error)
      alert('Error al generar el PDF de bajas. Revise la consola para más detalles.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        onClick={handleGenerarPDF}
        disabled={loading}
        className={`bg-red-600 hover:bg-red-700 text-white ${className}`}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generando...
          </>
        ) : (
          <>
            <FileText className="w-4 h-4 mr-2" />
            PDF BAJAS
          </>
        )}
      </Button>

      {/* Modal para datos del firmante */}
      {showFirmanteModal && (
        <div className="fixed inset-0 z-[10000] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <UserCheck className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Datos del Firmante</h3>
                  <p className="text-sm text-gray-500">Complete la información para el PDF</p>
                </div>
                <button
                  onClick={() => {
                    setShowFirmanteModal(false)
                    setFirmante({ nombre: "", grado: "", cargo: "" })
                  }}
                  className="ml-auto p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Nombre Completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={firmante.nombre}
                    onChange={(e) => setFirmante({ ...firmante, nombre: e.target.value })}
                    placeholder="Ej: JUAN CARLOS PÉREZ GONZÁLEZ"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Building2 className="w-4 h-4 inline mr-1" />
                    Grado <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={firmante.grado}
                    onChange={(e) => setFirmante({ ...firmante, grado: e.target.value })}
                    placeholder="Ej: PAC, CBO, SGT"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Building2 className="w-4 h-4 inline mr-1" />
                    Cargo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={firmante.cargo}
                    onChange={(e) => setFirmante({ ...firmante, cargo: e.target.value })}
                    placeholder="Ej: Administrador Soporte Computacional"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowFirmanteModal(false)
                    setFirmante({ nombre: "", grado: "", cargo: "" })
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmarGeneracion}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generando...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      Generar PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
