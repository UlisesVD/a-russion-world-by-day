# 🔊 Sistema de Audio para Pronunciación - Documentación

## ✅ **Implementación Completada**

Se ha agregado un sistema completo de audio para la pronunciación de palabras y frases en ruso usando **Web Speech API**.

---

## 📁 **Archivos Creados**

### 1. **`src/hooks/useSpeech.ts`**
Hook personalizado de React para manejar la síntesis de voz:

**Características:**
- ✅ Soporte para múltiples idiomas (ruso por defecto)
- ✅ Control de velocidad (0.85 para mejor comprensión)
- ✅ Estados de reproducción (speaking/idle)
- ✅ Función para cancelar reproducción
- ✅ Detección automática de compatibilidad del navegador

**API del Hook:**
```typescript
const { speak, speaking, supported, cancel } = useSpeech();

// Reproducir texto en ruso
speak("Привет", "ru-RU");

// Verificar si está hablando
if (speaking) { /* ... */ }

// Cancelar reproducción
cancel();
```

---

### 2. **`src/components/SpeakButton.tsx`**
Componente de botón reutilizable para reproducir audio:

**Props:**
- `text`: Texto a reproducir
- `lang`: Idioma (default: "ru-RU")
- `size`: "small" | "medium" | "large"
- `variant`: "primary" | "secondary" | "ghost"
- `className`: Clases CSS adicionales

**Características visuales:**
- 🎨 Icono de altavoz cuando está en reposo
- 🌊 Icono de ondas animadas cuando está reproduciendo
- ✨ Animación de pulso y escala durante reproducción
- 🎯 Hover effects y transiciones suaves
- 🌙 Diseño minimalista acorde con el tema oscuro

---

## 🎯 **Ubicaciones de los Botones**

### 1. **Palabra Principal** (Header)
```tsx
<SpeakButton 
  text={wordOfTheDay.russian} 
  lang="ru-RU" 
  size="large"
  variant="primary"
/>
```
- Tamaño grande
- Estilo primario (azul brillante)
- Al lado del título principal

### 2. **Ejemplos en Móvil** (Cards)
```tsx
<SpeakButton 
  text={example.russian} 
  lang="ru-RU" 
  size="small"
  variant="ghost"
/>
```
- Tamaño pequeño
- Estilo ghost (transparente con hover)
- En la esquina superior derecha de cada card

### 3. **Ejemplos en Desktop** (Tabla)
```tsx
<SpeakButton 
  text={example.russian} 
  lang="ru-RU" 
  size="small"
  variant="ghost"
/>
```
- Columna dedicada "Audio"
- Centrado en la celda
- Estilo ghost

---

## 🌐 **Compatibilidad de Navegadores**

### ✅ **Navegadores Compatibles:**
- **Chrome/Edge**: Excelente soporte
- **Safari**: Buen soporte
- **Firefox**: Soporte básico
- **Opera**: Buen soporte

### ❌ **Navegadores NO Compatibles:**
- Internet Explorer
- Navegadores muy antiguos

**Nota:** El botón se oculta automáticamente si el navegador no es compatible.

---

## 🎛️ **Configuración de la Voz**

### Parámetros Actuales:
```typescript
utterance.lang = 'ru-RU';  // Idioma ruso
utterance.rate = 0.85;      // Velocidad (más lento = mejor comprensión)
utterance.pitch = 1.0;      // Tono normal
utterance.volume = 1.0;     // Volumen máximo
```

### Personalizar Velocidad:
Para cambiar la velocidad, edita `src/hooks/useSpeech.ts`:
```typescript
utterance.rate = 0.7;  // Más lento
utterance.rate = 1.0;  // Velocidad normal
utterance.rate = 1.2;  // Más rápido
```

---

## 🎨 **Estilos y Variantes**

### Tamaños Disponibles:
```typescript
size="small"   // 32x32px - Para tablas y cards
size="medium"  // 40x40px - Uso general
size="large"   // 48x48px - Para títulos
```

### Variantes de Color:
```typescript
variant="primary"    // Azul brillante - Botones principales
variant="secondary"  // Gris oscuro - Botones secundarios
variant="ghost"      // Transparente - Uso discreto
```

---

## 🔧 **Mejoras Futuras Posibles**

### 1. **Voces Premium** (Opcional)
Integrar servicios como:
- **Google Cloud Text-to-Speech**
- **Amazon Polly**
- **Microsoft Azure Speech**

**Ventajas:**
- ✅ Mejor calidad de pronunciación
- ✅ Voces más naturales
- ✅ Mayor variedad de acentos

**Desventajas:**
- ❌ Costo por uso
- ❌ Requiere API keys
- ❌ Necesita conexión a internet

### 2. **Audio Precargado**
Grabar archivos de audio reales:
- ✅ Pronunciación perfecta
- ✅ Sin dependencias de navegador
- ✅ Funciona offline

**Implementación:**
```typescript
const audio = new Audio('/audio/kniga.mp3');
audio.play();
```

### 3. **Control de Reproducción Avanzado**
- ⏸️ Pausar/Reanudar
- ⏹️ Detener
- 🔄 Repetir automáticamente
- 🎚️ Control de velocidad por el usuario

### 4. **Modo de Práctica**
- 🎤 Grabación de voz del usuario
- 📊 Comparación con pronunciación correcta
- 🎯 Feedback de precisión

---

## 📊 **Estadísticas de Uso**

Para rastrear el uso del audio (futuro):
```typescript
function trackAudioUsage(word: string) {
  // Guardar en localStorage o enviar a analytics
  const stats = {
    word,
    timestamp: new Date().toISOString(),
    language: 'ru-RU'
  };
  
  localStorage.setItem('audio-stats', JSON.stringify(stats));
}
```

---

## 🐛 **Solución de Problemas**

### **El audio no funciona:**
1. ✅ Verificar que el navegador sea compatible
2. ✅ Revisar permisos de audio del navegador
3. ✅ Comprobar que el volumen del sistema no esté silenciado
4. ✅ Intentar en modo incógnito (para descartar extensiones)

### **La pronunciación no es buena:**
- La calidad depende del navegador y del sistema operativo
- Chrome y Edge suelen tener mejor calidad
- Considerar servicios de voz premium para mejor calidad

### **El botón no aparece:**
- El navegador no soporta Web Speech API
- Revisar la consola del navegador para errores

---

## 💡 **Tips de UX**

### **Mejores Prácticas:**
1. ✅ Botón visible pero no intrusivo
2. ✅ Feedback visual durante reproducción (animación)
3. ✅ Posibilidad de cancelar reproducción
4. ✅ No reproducir automáticamente (solo al hacer clic)

### **Accesibilidad:**
- ✅ Aria-label para lectores de pantalla
- ✅ Títulos descriptivos
- ✅ Estados disabled claros
- ✅ Soporte de teclado (Space/Enter)

---

## 🚀 **Próximos Pasos Sugeridos**

1. 🎯 **Probar en diferentes navegadores**
2. 📱 **Verificar funcionamiento en móviles**
3. 🎨 **Ajustar velocidad según feedback de usuarios**
4. 📊 **Agregar analytics de uso**
5. 🔄 **Considerar audio pregrabado para palabras frecuentes**

---

## 📝 **Código de Ejemplo Completo**

### Uso Básico:
```tsx
import { SpeakButton } from './components/SpeakButton';

function MyComponent() {
  return (
    <div>
      <h1>Привет</h1>
      <SpeakButton 
        text="Привет" 
        lang="ru-RU"
        size="medium"
        variant="primary"
      />
    </div>
  );
}
```

### Uso Avanzado con Hook:
```tsx
import { useSpeech } from './hooks/useSpeech';

function MyComponent() {
  const { speak, speaking, cancel } = useSpeech();
  
  return (
    <div>
      <button onClick={() => speak("Здравствуйте", "ru-RU")}>
        {speaking ? 'Reproduciendo...' : 'Reproducir'}
      </button>
      <button onClick={cancel}>Detener</button>
    </div>
  );
}
```

---

¡El sistema de audio está listo y funcionando! 🎉
