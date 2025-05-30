# Guía de Pruebas - Carga de Imágenes en Slots

## Problemas Identificados y Solucionados

### 1. **Manejo inconsistente de archivos en FileStorageService**
- **Problema**: El servicio solo esperaba Buffer, pero recibía diferentes tipos de archivos
- **Solución**: Mejorado para manejar múltiples formatos (Buffer, archivos de multer, etc.)

### 2. **Falta de validación y logging en saveMicroSiteImage**
- **Problema**: Errores silenciosos al procesar archivos de microsite
- **Solución**: Añadido logging detallado y manejo de errores específicos

### 3. **Estructura de archivos inconsistente en controllers**
- **Problema**: Los archivos llegaban como array pero se esperaban como objeto
- **Solución**: Mejorada la conversión de array a objeto en controllers

### 4. **Manejo de errores insuficiente**
- **Problema**: Errores genéricos sin información útil para debugging
- **Solución**: Añadido logging detallado y manejo específico de errores

## Funcionalidades Mejoradas

### Crear Nuevo Slot (`POST /slots/new-slot`)
- ✅ Mejor logging de archivos recibidos
- ✅ Manejo robusto de imágenes de microsite
- ✅ Validación de tipos de archivo
- ✅ Manejo de errores específicos para PDFs

### Actualizar Slot (`POST /slots/update-single-slot/:id`)
- ✅ Procesamiento mejorado de archivos
- ✅ Logging detallado de cambios
- ✅ Manejo de archivos opcionales
- ✅ Validación de ID de slot

### Establecer Imagen Destacada (`POST /slots/set-feature-image/:id`)
- ✅ Validación de archivo obligatorio
- ✅ Manejo de nombres de archivo seguros
- ✅ Mejor gestión de errores

## Cómo Probar

### 1. Crear un nuevo slot con microsite
```bash
curl -X POST "http://localhost:3000/slots/new-slot" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "gameCode=TEST001" \
  -F "title=Test Game" \
  -F "microSite=true" \
  -F "gameId=TEST001" \
  -F "msBanner=@banner.jpg" \
  -F "msBannerMod=@banner-mod.jpg" \
  -F "msIllustrative[]=@image1.jpg" \
  -F "msIllustrative[]=@image2.jpg"
```

### 2. Actualizar un slot existente
```bash
curl -X POST "http://localhost:3000/slots/update-single-slot/SLOT_ID" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=Updated Title" \
  -F "microSite=true" \
  -F "msBanner=@new-banner.jpg"
```

### 3. Establecer imagen destacada
```bash
curl -X POST "http://localhost:3000/slots/set-feature-image/SLOT_ID" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "feature=@feature-image.jpg"
```

## Logging para Debugging

Los siguientes mensajes aparecerán en consola para ayudar con el debugging:

1. **Controller Level**:
   - `Controller - Received files: X`
   - `Processing file: fieldname, originalname: filename`

2. **Service Level**:
   - `Creating new slot with data: {...}`
   - `Processing microsite images for gameId: X`
   - `Saved microsite files: {...}`

3. **FileStorage Level**:
   - `File saved successfully. Host path: /path/to/file`

## Variables de Entorno Necesarias

Asegúrate de que estas variables estén configuradas:

```env
IMAGE_HOST=http://localhost:3000
```

## Archivos Soportados

- **Imágenes**: jpg, jpeg, png, gif, webp
- **PDFs**: pdf
- **Tamaño máximo**: Configurado en el interceptor (por defecto sin límite)

## Estructura de Carpetas

```
uploads/
├── slots/          # Imágenes de slots y microsite
├── pdf/            # Archivos PDF de reglas
└── banners/        # Banners generales
```
