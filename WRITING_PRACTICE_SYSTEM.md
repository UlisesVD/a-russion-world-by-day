# ✍️ Sistema de Práctica de Escritura

## Descripción General

El sistema de práctica de escritura permite a los usuarios practicar escribiendo palabras rusas con validación en tiempo real, hints inteligentes y tracking de progreso. Es una herramienta interactiva diseñada para reforzar el aprendizaje activo del alfabeto cirílico.

---

## 🎯 Características Implementadas

### ✅ Funcionalidades

- **Validación Instantánea**: Compara la entrada del usuario con la palabra correcta
- **Hints Inteligentes**: Muestra pistas después del segundo intento fallido
- **Feedback Visual**: Colores y emojis para indicar correcto/incorrecto
- **Auto-completado**: Marca automáticamente la palabra como aprendida al acertar
- **Tracking de Intentos**: Registra intentos y aciertos en el sistema de progreso
- **Contador de Intentos**: Muestra cuántas veces lo ha intentado
- **Botón Reintentar**: Permite limpiar el input y volver a intentar
- **Auto-cierre**: Se cierra automáticamente 3 segundos después de acertar
- **Keyboard Support**: Enter para verificar, ESC para cerrar

---

## 📁 Arquitectura

### Componente Principal: `WritingPractice.tsx`

```typescript
interface WritingPracticeProps {
  word: string;                    // Palabra en ruso a escribir
  transliteration: string;         // Transliteración para ayuda
  onSuccess?: () => void;          // Callback al acertar
  onAttempt?: (correct: boolean) => void; // Callback en cada intento
}
```

### Estados del Componente

```typescript
const [input, setInput] = useState('');              // Texto ingresado
const [showPractice, setShowPractice] = useState(false); // Mostrar/ocultar panel
const [attempts, setAttempts] = useState(0);         // Contador de intentos
const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
const [showHint, setShowHint] = useState(false);     // Mostrar pista
```

---

## 🎨 Estados Visuales

### Estado Inicial (Botón)
```
┌────────────────────────────────────┐
│  ✏️  Practicar Escritura    →     │  (Púrpura-Rosa)
└────────────────────────────────────┘
```

### Estado Abierto (Panel de Práctica)
```
┌─────────────────────────────────────────┐
│ ✏️ Práctica de Escritura          ✕    │
├─────────────────────────────────────────┤
│ Escribe la palabra en ruso...           │
│ Transliteración: Kniga                  │
├─────────────────────────────────────────┤
│ [Input Field]                           │
├─────────────────────────────────────────┤
│ [Verificar]  [Reintentar]               │
│                                          │
│ Intentos: 2                             │
└─────────────────────────────────────────┘
```

### Estado Incorrecto
```
❌ Intenta de nuevo
Escribiste: Kniga
Revisa cada letra cuidadosamente
```

### Estado Correcto
```
🎉 ¡Correcto! ¡Excelente trabajo!
Has escrito correctamente: Книга
```

### Estado con Hint (después de 2 intentos)
```
┌─────────────────────────────────────┐
│ 💡 Pista:                           │
│ La palabra empieza con: К            │
│ Intenta copiar exactamente: Книга   │
└─────────────────────────────────────┘
```

---

## 🔧 Uso

### Ejemplo Básico

```tsx
<WritingPractice
  word="Книга"
  transliteration="Kniga"
  onSuccess={() => {
    console.log('¡Palabra escrita correctamente!');
  }}
  onAttempt={(correct) => {
    console.log(`Intento: ${correct ? 'correcto' : 'incorrecto'}`);
  }}
/>
```

### Integración con Sistema de Progreso

```tsx
<WritingPractice
  word={wordOfTheDay.russian}
  transliteration={wordOfTheDay.transliteration}
  onSuccess={() => {
    // Marcar automáticamente como aprendida
    if (!isLearned(wordOfTheDay.russian)) {
      toggleLearned(wordOfTheDay.russian);
    }
  }}
  onAttempt={(correct) => {
    // Trackear en estadísticas
    trackWritingAttempt(wordOfTheDay.russian, correct);
  }}
/>
```

---

## 🎯 Flujo de Usuario

### Paso 1: Inicio
1. Usuario ve el botón "Practicar Escritura"
2. Click abre el panel de práctica
3. Input está auto-focused

### Paso 2: Primer Intento
1. Usuario escribe en el input
2. Presiona Enter o click en "Verificar"
3. Sistema compara con la palabra correcta
4. Muestra feedback visual

### Paso 3: Intentos Adicionales
- **Si es correcto**:
  - Muestra 🎉 y celebración
  - Marca palabra como aprendida (opcional)
  - Cierra automáticamente después de 3s
  
- **Si es incorrecto**:
  - Muestra ❌ y mensaje de error
  - Muestra botón "Reintentar"
  - Después de 2 intentos → Muestra hint

### Paso 4: Hint Inteligente
- Muestra primera letra de la palabra
- Sugiere copiar la palabra completa
- Ayuda al usuario a completar

---

## 🧠 Lógica de Validación

### Algoritmo de Comparación

```typescript
const handleCheck = () => {
  const isCorrect = input.trim().toLowerCase() === word.toLowerCase();
  
  if (isCorrect) {
    // Celebración
    setResult('correct');
    onSuccess?.();
    
    // Auto-cerrar después de 3s
    setTimeout(() => {
      setShowPractice(false);
      resetState();
    }, 3000);
  } else {
    // Error
    setResult('incorrect');
    attempts++;
    
    // Mostrar hint después del 2do intento
    if (attempts >= 2) {
      setShowHint(true);
    }
  }
  
  onAttempt?.(isCorrect);
};
```

### Características de la Validación

- ✅ **Case insensitive**: Книга === книга
- ✅ **Trim spaces**: " Книга " === "Книга"
- ✅ **Exact match**: Debe ser idéntica carácter por carácter
- ❌ **No fuzzy matching**: No acepta errores de tipeo

---

## 📊 Tracking en Sistema de Progreso

### Estructura de Datos

```typescript
writingPractice: {
  "Книга": {
    attempts: 5,      // Total de intentos
    successes: 2      // Total de aciertos
  },
  "Дом": {
    attempts: 3,
    successes: 1
  }
}
```

### Función trackWritingAttempt

```typescript
const trackWritingAttempt = (word: string, correct: boolean) => {
  if (!writingPractice[word]) {
    writingPractice[word] = { attempts: 0, successes: 0 };
  }
  
  writingPractice[word].attempts++;
  if (correct) {
    writingPractice[word].successes++;
  }
};
```

### Métricas Calculables

```typescript
// Tasa de éxito por palabra
const successRate = (word: string) => {
  const data = writingPractice[word];
  return data ? (data.successes / data.attempts) * 100 : 0;
};

// Palabras más difíciles (más intentos)
const hardestWords = Object.entries(writingPractice)
  .sort((a, b) => b[1].attempts - a[1].attempts)
  .slice(0, 5);

// Total de práctica
const totalPracticeAttempts = Object.values(writingPractice)
  .reduce((sum, data) => sum + data.attempts, 0);
```

---

## 🎨 Estilos y Colores

### Paleta de Colores

| Elemento | Estado | Color | Clase Tailwind |
|----------|--------|-------|----------------|
| Botón principal | Normal | Púrpura-Rosa | `from-purple-600 to-pink-600` |
| Input | Normal | Gris oscuro | `bg-slate-900 border-slate-600` |
| Input | Correcto | Verde | `border-green-500 bg-green-900/20` |
| Input | Incorrecto | Rojo | `border-red-500 bg-red-900/20` |
| Mensaje éxito | - | Verde | `bg-green-900/30 border-green-500` |
| Mensaje error | - | Rojo | `bg-red-900/30 border-red-500` |
| Hint | - | Amarillo | `bg-yellow-900/20 border-yellow-700` |

### Animaciones

```css
/* Fade in para panel */
.animate-fade-in {
  animation: fadeIn 0.2s ease-in-out;
}

/* Hover en botón principal */
.group:hover .translate-x-1 {
  transform: translateX(0.25rem);
}
```

---

## ⌨️ Atajos de Teclado

| Tecla | Acción |
|-------|--------|
| **Enter** | Verificar respuesta |
| **Escape** | Cerrar panel de práctica |
| **Tab** | Navegar entre botones |

---

## 🔍 Solución de Problemas

### El input no acepta caracteres cirílicos

**Causa**: Teclado no configurado para ruso

**Soluciones**:
1. Instalar teclado ruso en sistema operativo
2. Usar teclado virtual online
3. Copiar y pegar la palabra
4. Usar transliteración (hint lo sugiere)

### La validación siempre falla

**Debug**:
```typescript
console.log('Input:', input);
console.log('Word:', word);
console.log('Match:', input.trim().toLowerCase() === word.toLowerCase());
```

**Verificar**:
- Espacios extra al principio/final
- Caracteres invisibles
- Mayúsculas vs minúsculas

### El hint no aparece

**Causa**: No ha intentado suficientes veces

**Solución**: El hint aparece después del 2do intento fallido (attempts >= 2)

### El panel no se cierra al acertar

**Causa**: Posible interferencia con el timeout

**Verificar**: Console errors que interrumpan el setTimeout de 3000ms

---

## 🚀 Mejoras Futuras

### Prioridad Alta
- [ ] **Modo de Práctica Específico**: Practicar solo palabras no aprendidas
- [ ] **Teclado Cirílico Virtual**: Integrado en el componente
- [ ] **Modo de Dictado**: Audio → Usuario escribe
- [ ] **Estadísticas de Práctica**: Mostrar tasa de éxito por palabra

### Prioridad Media
- [ ] **Hints Progresivos**: Primera letra → Primera sílaba → Palabra completa
- [ ] **Timer de Práctica**: Cronómetro opcional
- [ ] **Leaderboard**: Comparar velocidad con otros usuarios
- [ ] **Práctica de Frases**: Extender a oraciones completas

### Prioridad Baja
- [ ] **Modo Competitivo**: Retos diarios
- [ ] **Badges**: "10 palabras perfectas seguidas"
- [ ] **Replay**: Mostrar historial de intentos
- [ ] **Export**: Descargar estadísticas de práctica

---

## 🧪 Testing

### Casos de Prueba

```typescript
describe('WritingPractice', () => {
  test('Valida palabra correcta', () => {
    const { getByRole } = render(
      <WritingPractice word="Книга" transliteration="Kniga" />
    );
    
    const input = getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Книга' } });
    
    const button = getByText('Verificar');
    fireEvent.click(button);
    
    expect(getByText('¡Correcto!')).toBeInTheDocument();
  });

  test('Muestra error en palabra incorrecta', () => {
    // Similar test para caso incorrecto
  });

  test('Muestra hint después de 2 intentos', () => {
    // Test para verificar que hint aparece
  });

  test('Llama onSuccess callback al acertar', () => {
    const onSuccess = jest.fn();
    // Test del callback
  });
});
```

---

## 📈 Métricas de Uso

### KPIs Sugeridos

- **Tasa de Uso**: % de usuarios que practican escritura
- **Intentos Promedio**: Cuántos intentos antes de acertar
- **Palabras Más Difíciles**: Palabras con más intentos fallidos
- **Tasa de Abandono**: % que cierran sin completar
- **Tiempo Promedio**: Cuánto tardan en escribir correctamente

### Análisis de Datos

```typescript
// Palabras más practicadas
const mostPracticed = Object.entries(writingPractice)
  .sort((a, b) => b[1].attempts - a[1].attempts)
  .slice(0, 10);

// Tasa de éxito general
const overallSuccessRate = 
  Object.values(writingPractice).reduce((sum, data) => 
    sum + data.successes, 0) /
  Object.values(writingPractice).reduce((sum, data) => 
    sum + data.attempts, 0) * 100;
```

---

## 🎓 Pedagogía

### Principios de Aprendizaje Aplicados

1. **Práctica Activa**: Escribir es más efectivo que solo leer
2. **Feedback Inmediato**: Validación instantánea refuerza aprendizaje
3. **Repetición Espaciada**: Tracking permite revisitar palabras difíciles
4. **Andamiaje**: Hints progresivos guían al usuario
5. **Motivación**: Celebración visual al lograr el objetivo

### Curva de Aprendizaje

```
Dificultad
│
│     ┌─── Hint (después de 2 intentos)
│    ╱
│   ╱
│  ╱
│ ╱
│╱────────────────────────────────
                           Tiempo
```

---

## 🤝 Contribuir

### Agregar Nuevas Funcionalidades

1. **Nuevo Tipo de Práctica**: Extender interface props
2. **Hints Personalizados**: Modificar lógica de `showHint`
3. **Validación Fuzzy**: Implementar algoritmo de distancia Levenshtein
4. **Teclado Virtual**: Agregar componente `CyrillicKeyboard`

---

## 📚 Referencias

- [Alfabeto Cirílico - Wikipedia](https://es.wikipedia.org/wiki/Alfabeto_cir%C3%ADlico)
- [Russian Keyboard Layout](https://en.wikipedia.org/wiki/JCUKEN)
- [Spaced Repetition - Learning Science](https://en.wikipedia.org/wiki/Spaced_repetition)

---

**Última actualización**: 15 de octubre de 2025  
**Versión**: 1.0.0
