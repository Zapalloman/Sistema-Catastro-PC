# Generador de PDF de Equipos

## Descripción
Componente React que genera un listado PDF de todos los equipos computacionales (CPU y NOTEBOOK) del sistema, incluyendo equipos de tipo IGM, LATSUR, Z8 y MAC.

## Uso del Componente

### Importación
```tsx
import { PDFEquipmentGenerator } from "@/components/pdf-equipment-generator"
```

### Uso Básico
```tsx
<PDFEquipmentGenerator />
```

### Con Estilos Personalizados
```tsx
<PDFEquipmentGenerator className="mt-4 bg-red-600 hover:bg-red-700" />
```

## Funcionalidades

### Datos Incluidos en el PDF
- **ID**: Identificador único del equipo
- **Equipo**: Nombre del PC/equipo
- **Tipo**: IGM, LATSUR, Z8, MAC
- **Categoría**: Workstation, Notebook, etc.
- **Modelo**: Modelo del equipo
- **Nº Serie**: Número de serie
- **Ubicación**: Ubicación física del equipo

### Características del PDF
- Formato A4 profesional
- Encabezado con logo institucional
- Fecha y hora de generación
- Numeración automática de páginas
- Alternar colores de fila para mejor legibilidad
- Manejo automático de salto de página
- Pie de página institucional

### Fuente de Datos
El componente obtiene los datos del endpoint:
```
GET /api/software/equipos/computacionales
```

Este endpoint combina equipos de todas las fuentes:
- Equipos IGM (tipo 'CPU' o 'NOTEBOOK')
- Equipos LATSUR (categoría 'WORKSTATION' o 'NOTEBOOK')
- Equipos MAC (activos)
- Equipos Z8 (activos)

## Ejemplo de Implementación

### En la página de Equipos IGM
```tsx
// src/equipos.tsx
import { PDFEquipmentGenerator } from "@/components/pdf-equipment-generator"

export default function Equipos() {
  return (
    <div>
      {/* Otros controles */}
      <div className="flex gap-4">
        <Button onClick={handleAddEquipment}>
          Agregar Equipo
        </Button>
        <PDFEquipmentGenerator className="bg-red-600 hover:bg-red-700" />
      </div>
    </div>
  )
}
```

### En la página de Equipamiento LATSUR
```tsx
// src/equipamiento-latsur.tsx
import { PDFEquipmentGenerator } from "@/components/pdf-equipment-generator"

export default function EquipamientoLatsur() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="flex-1">
          <h1>Equipamiento LATSUR</h1>
        </div>
        <PDFEquipmentGenerator />
      </div>
    </div>
  )
}
```

## Estados del Componente
- **Normal**: Botón disponible para generar PDF
- **Cargando**: Muestra spinner mientras genera el PDF
- **Error**: Muestra mensaje de error si falla la generación

## Dependencias
- `pdf-lib`: Para la generación de PDFs
- `@/components/ui/button`: Componente de botón UI
- `lucide-react`: Para los iconos

## Manejo de Errores
El componente maneja automáticamente:
- Errores de conexión al API
- Datos vacíos o malformados
- Errores durante la generación del PDF
- Mostrará alertas informativas al usuario

## Personalización

### Modificar Columnas del PDF
Para cambiar las columnas del PDF, edite las siguientes constantes en el componente:

```tsx
const headers = ['ID', 'EQUIPO', 'TIPO', 'CATEGORÍA', 'MODELO', 'Nº SERIE', 'UBICACIÓN']
const colWidths = [40, 90, 50, 80, 90, 90, 95]
```

### Cambiar Formato de Fecha
```tsx
const fechaGeneracion = new Date().toLocaleDateString('es-CL', {
  year: 'numeric',
  month: 'long', 
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})
```

## Notas Técnicas
- El PDF se genera completamente en el cliente (browser)
- No requiere servidor adicional para la generación
- El archivo se descarga automáticamente al finalizar
- Nombre del archivo incluye la fecha: `Listado_Equipos_Computacionales_YYYY-MM-DD.pdf`
