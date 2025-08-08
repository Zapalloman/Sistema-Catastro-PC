# Imágenes para PDFs

## Logo del IGM

Para agregar el logo del Instituto Geográfico Militar al PDF de equipos:

1. **Ubicación del archivo**: Coloca la imagen del logo en esta carpeta con el nombre `logo-igm.png`

2. **Formato recomendado**: PNG con fondo transparente

3. **Resolución recomendada**: Al menos 200x200 píxeles para buena calidad

4. **Nombre del archivo**: Debe ser exactamente `logo-igm.png`

## Estructura actual:
```
public/images/
├── README.md (este archivo)
└── logo-igm.png (agregar aquí el logo)
```

## Cómo funciona:
- Si el archivo `logo-igm.png` existe, se cargará automáticamente en el PDF
- Si no existe, se mostrará un placeholder de texto "IGM LOGO"
- El logo se redimensiona automáticamente manteniendo sus proporciones
- Se centra en la columna izquierda del encabezado del documento

## Formatos soportados:
- PNG (recomendado)
- JPEG (cambiar la extensión en el código si usas .jpg)

## Próximos pasos:
1. Obtén el logo oficial del IGM
2. Guárdalo como `logo-igm.png` en esta carpeta
3. El PDF se generará automáticamente con el logo
