# Solución a problemas de manejo de imágenes en NestJS

## Problema identificado

El error "No feature image provided" se debe a que el método `setFeatureImage` no estaba recibiendo correctamente los archivos del interceptor `AnyFilesInterceptor()` de NestJS.

## Cambios realizados

### 1. Mejoras en GamesService

#### Método `setFeatureImage`
- **Antes**: Solo buscaba `files.feature`
- **Después**: Busca archivos en múltiples ubicaciones posibles:
  - `files.feature`
  - `files.image`  
  - Primera posición si files es un array
  - Primera clave disponible en el objeto files

#### Método `setBanner`
- Aplicadas las mismas mejoras que `setFeatureImage`

#### Método `saveMicroSiteImage`
- Mejorado manejo de errores con tipos más específicos
- Mejor logging para debug
- Manejo más robusto de diferentes estructuras de archivos

### 2. Mejoras en FileStorageService

- **Logging mejorado**: Ahora muestra información detallada sobre el tipo de datos recibidos
- **Manejo de buffers**: Soporte para convertir objetos buffer a Buffer real
- **Mejor manejo de errores**: Mensajes más específicos sobre qué tipo de datos se recibió

### 3. Estructura del Controller

El controller en `games.controller.ts` ya estaba bien configurado:

```typescript
@UseInterceptors(AnyFilesInterceptor())
setFeatureImage(@Param('id') id: string, @UploadedFiles() files: any, @Req() req: Request) {
  const filesObject: any = {};
  if (files && files.length > 0) {
    files.forEach((file: any) => {
      filesObject[file.fieldname] = file;
    });
  }
  return this.gamesService.setFeatureImage(id, { files: filesObject });
}
```

## Cómo probar

### 1. Subir imagen destacada (feature image)

```bash
curl -X POST \
  http://localhost:3000/slots/set-feature-image/630549e7f3828b437af2835f \
  -H 'Content-Type: multipart/form-data' \
  -F 'feature=@/path/to/image.jpg'
```

### 2. Crear nuevo slot con imágenes

```bash
curl -X POST \
  http://localhost:3000/slots/new-slot \
  -H 'Content-Type: multipart/form-data' \
  -F 'title=Test Slot' \
  -F 'gameCode=TEST001' \
  -F 'integrationChannelCode=TEST' \
  -F 'microSite=true' \
  -F 'gameId=test123' \
  -F 'msBanner=@/path/to/banner.jpg' \
  -F 'msBannerMod=@/path/to/banner-mod.jpg' \
  -F 'msIllustrative[]=@/path/to/image1.jpg' \
  -F 'msIllustrative[]=@/path/to/image2.jpg'
```

## Logging habilitado

Ahora cuando haya problemas con archivos, verás logs detallados como:

```
FileStorageService.saveFile called with: { fileName: '1735564448123-image.jpg', folder: 'slots', fileDataType: 'object' }
File data has buffer property
Creating directory: /path/to/uploads/slots
Writing file to: /path/to/uploads/slots/1735564448123-image.jpg
File saved successfully. Host path: http://localhost:3000/slots/1735564448123-image.jpg
```

## Variables de entorno requeridas

Asegúrate de tener configurado en tu `.env`:

```
IMAGE_HOST=http://localhost:3000
```

## Errores comunes y soluciones

### Error: "No feature image provided"
- **Causa**: El campo del formulario no se llama 'feature' o 'image'
- **Solución**: El servicio ahora toma el primer archivo disponible automáticamente

### Error: "Invalid file data type"
- **Causa**: Estructura de archivo no reconocida
- **Solución**: Verificar que se esté usando `AnyFilesInterceptor()` y no `FileInterceptor()`

### Error: "Express-fileupload files not supported"
- **Causa**: Intentando usar archivos de express-fileupload en contexto NestJS
- **Solución**: Usar solo multer/AnyFilesInterceptor en NestJS

## Próximos pasos

1. **Testing**: Probar todos los endpoints de carga de imágenes
2. **Validación**: Agregar validación de tipos de archivo (MIME types)
3. **Compresión**: Implementar compresión de imágenes si es necesario
4. **Límites**: Configurar límites de tamaño de archivo
