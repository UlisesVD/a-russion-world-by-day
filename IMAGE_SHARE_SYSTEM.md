# 📸 Sistema de Compartir Imágenes

## Descripción General

El sistema de compartir imágenes genera automáticamente una imagen visual atractiva de la palabra del día usando **Canvas API** y permite compartirla en redes sociales o descargarla. Ideal para Instagram, Twitter, Facebook y otras plataformas visuales.

---

## 🎯 Características

### ✅ Funcionalidades Implementadas

- **Generación Dinámica de Imágenes**: Crea imágenes personalizadas usando Canvas
- **Diseño Profesional**: Gradiente oscuro y tipografía clara con estética rusa
- **Optimizado para Redes Sociales**: Formato cuadrado 1080x1080px (Instagram)
- **Web Share API**: Comparte directamente desde móviles
- **Descarga Automática**: Fallback para navegadores que no soportan compartir archivos
- **Feedback Visual**: Spinner durante generación y tooltip de éxito
- **Responsive**: Botón adaptable con múltiples tamaños

---

## 📁 Arquitectura

### Hook: `useImageGenerator.ts`

```typescript
interface UseImageGeneratorReturn {
  generateImage: (wordData: WordOfDay) => Promise<Blob | null>;
}
```

**Proceso de Generación:**
1. Crea un canvas de 1080x1080px
2. Dibuja fondo con gradiente (slate-900 → slate-800 → blue-900)
3. Renderiza texto con fuentes del sistema
4. Incluye:
   - Título "🇷🇺 Palabra del día"
   - Palabra en ruso (140px, bold)
   - Transliteración (56px, italic)
   - Traducción (64px)
   - Primer ejemplo con traducción
   - Footer
5. Convierte canvas a Blob (PNG)

### Componente: `ShareImageButton.tsx`

```typescript
interface ShareImageButtonProps {
  wordData: WordOfDay;           // Datos de la palabra a compartir
  size?: 'small' | 'medium' | 'large'; // Tamaño del botón
  variant?: 'primary' | 'secondary' | 'ghost'; // Estilo visual
}
```

---

## 🔧 Uso

### Ejemplo Básico

```tsx
import { ShareImageButton } from './components/ShareImageButton';

<ShareImageButton
  wordData={wordOfTheDay}
  size="large"
  variant="primary"
/>
```

### Integración en Header

```tsx
<div className="flex items-center gap-2 sm:gap-3">
  <SpeakButton {...audioProps} />
  <ShareImageButton 
    wordData={wordOfTheDay}
    size="large"
    variant="primary"
  />
</div>
```

### Variantes de Estilo

```tsx
// Botón primario (gradiente azul-cyan con sombra)
<ShareImageButton {...props} variant="primary" />

// Botón secundario (gris sólido)
<ShareImageButton {...props} variant="secondary" />

// Botón fantasma (transparente)
<ShareImageButton {...props} variant="ghost" />
```

---

## 🎨 Diseño de la Imagen Generada

### Dimensiones y Layout

```
┌─────────────────────────────┐
│     🇷🇺 Palabra del día      │  ← 150px (blue-300)
│                             │
│                             │
│         КНИГА               │  ← 350px (140px, blue-100, bold)
│                             │
│         Kniga               │  ← 480px (56px, slate-300, italic)
│        ─────────            │  ← 560px (línea separadora)
│         Libro               │  ← 650px (64px, slate-400)
│                             │
│  ┌───────────────────────┐  │
│  │ Я читаю книгу.        │  │  ← 750-930px (ejemplo)
│  │ Estoy leyendo...      │  │  (fondo slate-800/70)
│  └───────────────────────┘  │
│                             │
│  Una palabra rusa al día    │  ← 1000px (footer, slate-500)
└─────────────────────────────┘
    1080px × 1080px
```

### Paleta de Colores

| Elemento | Color | Hex |
|----------|-------|-----|
| Fondo (inicio) | slate-900 | #0f172a |
| Fondo (medio) | slate-800 | #1e293b |
| Fondo (fin) | blue-900 | #1e3a8a |
| Palabra rusa | blue-100 | #dbeafe |
| Transliteración | slate-300 | #cbd5e1 |
| Traducción | slate-400 | #94a3b8 |
| Ejemplo | slate-200 | #e2e8f0 |
| Footer | slate-500 | #64748b |

### Tipografía

- **Sistema de fuentes**: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
- **Tamaños**:
  - Título: 48px bold
  - Palabra: 140px bold
  - Transliteración: 56px italic
  - Traducción: 64px regular
  - Ejemplo ruso: 36px
  - Ejemplo español: 28px italic
  - Footer: 32px

---

## 🌐 Web Share API con Archivos

### Compatibilidad

| Plataforma | Soporte | Notas |
|------------|---------|-------|
| iOS Safari | ✅ | Full support |
| Android Chrome | ✅ | Full support |
| Samsung Internet | ✅ | Full support |
| Desktop Chrome | ❌ | No soporta compartir archivos |
| Firefox | ❌ | No soporta Web Share API |
| Safari Desktop | ❌ | No soporta compartir archivos |

### Detección y Fallback

```typescript
if (navigator.share && 
    navigator.canShare && 
    navigator.canShare({ files: [file] })) {
  // Compartir con menú nativo
  await navigator.share({
    title: `🇷🇺 ${wordData.russian}`,
    text: `Palabra rusa del día: ${wordData.russian}`,
    files: [file],
  });
} else {
  // Fallback: descargar imagen
  downloadImage(blob, wordData.russian);
}
```

---

## 🚀 Flujo de Usuario

### En Móviles (iOS/Android)

1. Usuario toca el botón 📸
2. Aparece spinner de carga (1-2 segundos)
3. Se abre el menú nativo de compartir
4. Usuario elige app (Instagram, WhatsApp, Twitter, etc.)
5. La imagen se adjunta automáticamente
6. Aparece tooltip "✓ ¡Imagen lista!"

### En Desktop

1. Usuario hace clic en el botón 📸
2. Aparece spinner de carga
3. La imagen se descarga automáticamente
4. Se guarda como `palabra-rusa-[palabra].png`
5. Aparece tooltip "✓ ¡Imagen lista!"
6. Usuario puede subirla manualmente a sus redes

---

## 🎯 Estados del Componente

### Estado Normal
- Icono de imagen (📸)
- Gradiente azul-cyan con sombra
- Efecto hover con brillo animado

### Estado Generando
- Spinner animado (rotación infinita)
- Botón deshabilitado
- Cursor `not-allowed`
- Opacidad reducida

### Estado Éxito
- Tooltip verde con ✓
- Animación fadeIn
- Desaparece después de 2 segundos

---

## 🔍 Solución de Problemas

### La imagen se ve pixelada

**Causa**: Canvas con resolución baja

**Solución**: Ya está optimizado a 1080x1080px. Si necesitas mayor calidad:
```typescript
const width = 2160; // 4K
const height = 2160;
```

### Las fuentes no se cargan correctamente

**Causa**: Canvas usa fuentes del sistema inmediatamente

**Solución**: Las fuentes -apple-system y Segoe UI están disponibles en todos los navegadores modernos. Si quieres fuentes personalizadas:

```typescript
// Precargar fuente antes de dibujar
const font = new FontFace('CustomFont', 'url(/fonts/custom.woff2)');
await font.load();
document.fonts.add(font);
```

### El compartir no funciona en desktop

**Comportamiento esperado**: Desktop no soporta `navigator.share()` con archivos. El componente automáticamente descarga la imagen como fallback.

### La imagen no incluye todos los ejemplos

**Diseño intencional**: Solo incluye el primer ejemplo para mantener el diseño limpio y legible. Para incluir más:

```typescript
// Modificar useImageGenerator.ts
wordData.examples.slice(0, 3).forEach((example, i) => {
  const y = 750 + (i * 100);
  ctx.fillText(example.russian, width / 2, y);
});
```

---

## 🚀 Mejoras Futuras

### Prioridad Alta
- [ ] **Templates Personalizables**: Múltiples diseños (minimalista, colorido, vintage)
- [ ] **Vista Previa**: Modal mostrando la imagen antes de compartir
- [ ] **Seleccionar Ejemplos**: Permitir elegir qué ejemplo incluir

### Prioridad Media
- [ ] **Formato Vertical**: Opción para Stories de Instagram (1080x1920)
- [ ] **Marca de Agua**: Logo o URL de la app
- [ ] **Incluir Imagen de Fondo**: Usar `wordData.imageUrl` como fondo difuminado
- [ ] **Múltiples Formatos**: JPG (menor tamaño) además de PNG

### Prioridad Baja
- [ ] **Animación de Generación**: Mostrar progreso paso a paso
- [ ] **Filtros de Estilo**: Instagram-like filters
- [ ] **Texto Personalizado**: Agregar nota personal antes de compartir
- [ ] **Stickers/Emojis**: Decoraciones adicionales

---

## 🧪 Testing

### Pruebas Manuales

#### Generación de Imagen
```
✓ Palabra con caracteres cirílicos renderiza correctamente
✓ Transliteración se muestra en cursiva
✓ Gradiente de fondo es visible
✓ Ejemplo se renderiza en el recuadro
✓ Todos los textos están centrados
✓ No hay textos cortados o fuera del canvas
```

#### Compartir en Móvil
```
✓ Botón funciona en Safari iOS
✓ Botón funciona en Chrome Android
✓ Menú nativo aparece con apps instaladas
✓ Imagen se adjunta correctamente a WhatsApp
✓ Imagen se sube correctamente a Instagram
✓ Tooltip de éxito aparece
```

#### Descargar en Desktop
```
✓ Click genera la imagen
✓ Descarga automática se inicia
✓ Nombre de archivo incluye la palabra rusa
✓ Archivo PNG es válido y se abre correctamente
✓ Tamaño de archivo es razonable (< 500KB)
```

### Casos de Prueba

| Escenario | Input | Resultado Esperado |
|-----------|-------|-------------------|
| Palabra con caracteres especiales | "Здравствуйте" | Renderiza correctamente |
| Ejemplo muy largo | 100+ caracteres | Se trunca o usa fuente más pequeña |
| Sin ejemplos | `examples: []` | Imagen se genera sin sección de ejemplo |
| Usuario cancela compartir | Cancel en menú | Sin acción, sin error, spinner desaparece |
| Canvas no soportado | Navegador antiguo | Retorna `null`, muestra alert |

---

## 📊 Optimización de Performance

### Tamaño de Archivo

```
PNG 1080x1080: ~200-400 KB
Optimizaciones aplicadas:
- Formato PNG (mejor para texto)
- Sin transparencia (fondo sólido)
- Canvas API nativa (rápida)
```

### Tiempo de Generación

```
Dispositivo moderno: ~500ms
Dispositivo antiguo: ~1-2s
Componentes del tiempo:
- Crear canvas: ~50ms
- Dibujar gradiente: ~100ms
- Renderizar texto: ~200ms
- Convertir a blob: ~150ms
```

### Caché de Imágenes

Actualmente no hay caché. Para implementar:

```typescript
const imageCache = new Map<string, Blob>();

const getCachedImage = async (wordData: WordOfDay) => {
  const cacheKey = wordData.russian;
  
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey);
  }
  
  const blob = await generateImage(wordData);
  if (blob) imageCache.set(cacheKey, blob);
  return blob;
};
```

---

## 🎨 Personalización

### Cambiar Colores del Diseño

En `useImageGenerator.ts`:

```typescript
// Gradiente de fondo
gradient.addColorStop(0, '#tu-color-1');
gradient.addColorStop(0.5, '#tu-color-2');
gradient.addColorStop(1, '#tu-color-3');

// Color de texto principal
ctx.fillStyle = '#tu-color-texto';
```

### Cambiar Dimensiones

```typescript
// Para Instagram Stories (vertical)
const width = 1080;
const height = 1920;

// Para Twitter (horizontal)
const width = 1200;
const height = 675;

// Para Facebook
const width = 1200;
const height = 630;
```

### Agregar Logo/Marca de Agua

```typescript
// Después de dibujar todo el contenido
const logo = new Image();
logo.src = '/logo.png';
await logo.decode();
ctx.drawImage(logo, width - 150, height - 150, 100, 100);
```

---

## 📚 Referencias

- [Canvas API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [Web Share API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API)
- [CanShare() Method](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/canShare)
- [Image Dimensions for Social Media 2025](https://sproutsocial.com/insights/social-media-image-sizes-guide/)

---

## 🤝 Contribuir

Para mejorar el sistema de imágenes:

1. **Nuevos Templates**: Crear funciones de diseño alternativas
2. **Formatos Adicionales**: Exportar en JPG, WebP, SVG
3. **Editor Visual**: UI para personalizar colores y fuentes
4. **Integración con Unsplash**: Fondos dinámicos basados en la palabra

---

## 💡 Ideas de Uso

### Para Usuarios
- Compartir progreso de aprendizaje en Instagram Stories
- Crear colección de palabras en Pinterest
- Enviar palabras diarias a amigos por WhatsApp
- Construir portafolio visual de vocabulario

### Para Educadores
- Generar material visual para clases
- Crear flashcards digitales
- Compartir contenido en grupos de estudio
- Publicar contenido educativo en redes

---

**Última actualización**: 12 de octubre de 2025
**Versión**: 1.0.0
