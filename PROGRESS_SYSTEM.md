# 📊 Sistema de Progreso del Usuario

## Descripción General

El sistema de progreso permite a los usuarios rastrear su aprendizaje de vocabulario ruso con métricas motivacionales: racha diaria, palabras aprendidas, ejemplos favoritos y estadísticas de uso. Toda la información se guarda en **localStorage** para persistencia sin necesidad de backend.

---

## 🎯 Características Implementadas

### ✅ Funcionalidades

- **Racha Diaria (Streak)**: Contador de días consecutivos visitando la app
- **Palabras Aprendidas**: Marcar/desmarcar palabras que ya dominas
- **Ejemplos Favoritos**: Guardar ejemplos específicos para revisar
- **Historial de Vistas**: Tracking de cuántas veces viste cada palabra
- **Estadísticas Visuales**: Dashboard con métricas clave
- **Persistencia Local**: Todo guardado en localStorage del navegador
- **Reset de Progreso**: Opción para empezar de cero

---

## 📁 Arquitectura

### Hook Principal: `useProgress.ts`

```typescript
interface UserProgress {
  learnedWords: Set<string>;        // Palabras marcadas como aprendidas
  lastVisitDate: string;            // Última visita (YYYY-MM-DD)
  currentStreak: number;            // Racha actual de días
  longestStreak: number;            // Mejor racha histórica
  totalWordsViewed: number;         // Total de palabras vistas
  viewHistory: { [word: string]: number }; // Contador por palabra
  favoriteExamples: string[];       // IDs de ejemplos favoritos
}
```

### Componentes

1. **ProgressStats** (`ProgressStats.tsx`): Dashboard visual de estadísticas
2. **LearnedButton** (`LearnedButton.tsx`): Botón para marcar palabras como aprendidas

---

## 🔧 Uso del Hook

### Ejemplo Básico

```tsx
import { useProgress } from './hooks/useProgress';

function App() {
  const {
    stats,
    updateStreak,
    toggleLearned,
    isLearned,
    trackWordView,
  } = useProgress();

  useEffect(() => {
    updateStreak(); // Actualizar racha al cargar
    trackWordView('Книга'); // Registrar que viste esta palabra
  }, []);

  return (
    <div>
      <p>Racha actual: {stats.currentStreak} días</p>
      <p>Palabras aprendidas: {stats.learnedCount}</p>
      <button onClick={() => toggleLearned('Книга')}>
        {isLearned('Книга') ? 'Aprendida ✓' : 'Marcar como aprendida'}
      </button>
    </div>
  );
}
```

---

## 🎨 Componente ProgressStats

### Props

```typescript
interface ProgressStatsProps {
  learnedCount: number;      // Palabras marcadas como aprendidas
  currentStreak: number;     // Racha actual
  longestStreak: number;     // Mejor racha
  totalWordsViewed: number;  // Total de vistas
  favoriteCount: number;     // Ejemplos favoritos
}
```

### Uso

```tsx
<ProgressStats
  learnedCount={stats.learnedCount}
  currentStreak={stats.currentStreak}
  longestStreak={stats.longestStreak}
  totalWordsViewed={stats.totalWordsViewed}
  favoriteCount={stats.favoriteCount}
/>
```

### Visualización

El componente muestra un grid responsive (2 columnas en móvil, 4 en desktop) con:

| Icono | Métrica | Color |
|-------|---------|-------|
| 🔥 | Racha actual | Naranja-Rojo |
| ✅ | Palabras aprendidas | Verde-Esmeralda |
| 🏆 | Mejor racha | Amarillo-Ámbar |
| ⭐ | Favoritos | Azul-Cyan |

---

## 🎯 Componente LearnedButton

### Props

```typescript
interface LearnedButtonProps {
  isLearned: boolean;        // Si la palabra está aprendida
  onToggle: () => void;      // Callback al hacer clic
  size?: 'small' | 'medium' | 'large'; // Tamaño del botón
}
```

### Estados Visuales

#### No Aprendida
- Fondo gris (slate-700)
- Icono de plus (+)
- Border gris

#### Aprendida
- Fondo verde gradiente (green-600 → emerald-600)
- Icono de check (✓)
- Animación de confetti (4 puntos brillantes)
- Sombra verde

### Uso

```tsx
<LearnedButton
  isLearned={isLearned(wordData.russian)}
  onToggle={() => toggleLearned(wordData.russian)}
  size="large"
/>
```

---

## 📊 Cálculo de Racha (Streak)

### Algoritmo

```typescript
const updateStreak = () => {
  const today = getTodayDate(); // YYYY-MM-DD
  const yesterday = getYesterdayDate();

  if (lastVisitDate === today) {
    // Ya visitó hoy, no hacer nada
    return;
  }

  if (lastVisitDate === yesterday) {
    // Visitó ayer → Incrementar racha
    currentStreak++;
  } else if (lastVisitDate !== '') {
    // No visitó ayer → Reiniciar a 1
    currentStreak = 1;
  } else {
    // Primera visita → Iniciar en 1
    currentStreak = 1;
  }

  longestStreak = Math.max(currentStreak, longestStreak);
  lastVisitDate = today;
};
```

### Casos de Uso

| Escenario | Última Visita | Resultado |
|-----------|---------------|-----------|
| Primera vez | - | currentStreak = 1 |
| Visitó ayer | 2025-10-14 | currentStreak++ |
| Visitó hace 2 días | 2025-10-13 | currentStreak = 1 |
| Ya visitó hoy | 2025-10-15 | Sin cambios |

---

## 💾 Almacenamiento (localStorage)

### Estructura de Datos

```json
{
  "learnedWords": ["Книга", "Дом", "Вода"],
  "lastVisitDate": "2025-10-15",
  "currentStreak": 7,
  "longestStreak": 12,
  "totalWordsViewed": 45,
  "viewHistory": {
    "Книга": 5,
    "Дом": 3,
    "Вода": 2
  },
  "favoriteExamples": ["Книга:0", "Дом:2"]
}
```

### Key de localStorage

```typescript
const STORAGE_KEY = 'russian-word-progress';
```

### Serialización

- **Set → Array**: `learnedWords` se convierte a array para JSON
- **Guardado Automático**: useEffect se activa en cada cambio del estado
- **Recuperación**: Al cargar, array se convierte de vuelta a Set

---

## 🔍 API del Hook useProgress

### Métodos Principales

#### `updateStreak()`
Actualiza la racha diaria del usuario.
```typescript
updateStreak(); // Llamar al cargar la app
```

#### `toggleLearned(word: string)`
Marca/desmarca una palabra como aprendida.
```typescript
toggleLearned('Книга');
```

#### `isLearned(word: string): boolean`
Verifica si una palabra está aprendida.
```typescript
if (isLearned('Книга')) {
  console.log('Ya aprendiste esta palabra!');
}
```

#### `trackWordView(word: string)`
Registra que el usuario vio una palabra.
```typescript
trackWordView('Книга'); // Incrementa contador
```

#### `toggleFavoriteExample(exampleId: string)`
Marca/desmarca un ejemplo como favorito.
```typescript
toggleFavoriteExample('Книга:0'); // Formato: "palabra:índice"
```

#### `isFavoriteExample(exampleId: string): boolean`
Verifica si un ejemplo es favorito.
```typescript
if (isFavoriteExample('Книга:0')) {
  console.log('Este es un ejemplo favorito!');
}
```

#### `resetProgress()`
Reinicia todo el progreso del usuario.
```typescript
resetProgress(); // Borra localStorage y resetea estado
```

### Objeto stats

```typescript
const stats = {
  learnedCount: number;      // Cantidad de palabras aprendidas
  currentStreak: number;     // Racha actual
  longestStreak: number;     // Mejor racha
  totalWordsViewed: number;  // Total de palabras vistas
  favoriteCount: number;     // Cantidad de favoritos
};
```

---

## 🎯 Integración en App.tsx

### Setup Inicial

```tsx
import { useProgress } from './hooks/useProgress';
import { ProgressStats } from './components/ProgressStats/ProgressStats';
import { LearnedButton } from './components/LearnedButton/LearnedButton';

function App() {
  const [wordOfTheDay, setWordOfTheDay] = useState(getWordOfTheDay());
  
  const {
    stats,
    updateStreak,
    toggleLearned,
    isLearned,
    trackWordView,
  } = useProgress();

  // Actualizar racha al cargar palabra del día
  useEffect(() => {
    updateStreak();
    trackWordView(wordOfTheDay.russian);
  }, [wordOfTheDay.russian, updateStreak, trackWordView]);

  return (
    <>
      {/* Dashboard de estadísticas */}
      <ProgressStats {...stats} />

      {/* Botón para marcar como aprendida */}
      <LearnedButton
        isLearned={isLearned(wordOfTheDay.russian)}
        onToggle={() => toggleLearned(wordOfTheDay.russian)}
      />
    </>
  );
}
```

---

## 🚀 Flujo de Usuario

### Primera Visita

1. Usuario abre la app
2. `useProgress` carga estado por defecto
3. `updateStreak()` se llama → racha = 1
4. Dashboard muestra: 🔥 1 día, ✅ 0 palabras

### Visita Diaria

1. Usuario regresa al día siguiente
2. `updateStreak()` detecta nueva fecha
3. Si visitó ayer → racha++
4. Si no → racha = 1
5. Dashboard actualiza automáticamente

### Marcar Palabra como Aprendida

1. Usuario hace clic en LearnedButton
2. Botón cambia de gris (➕) a verde (✓)
3. Animación de confetti se reproduce
4. Counter de palabras aprendidas incrementa
5. Estado se guarda en localStorage

---

## 🔍 Solución de Problemas

### La racha no se actualiza

**Causa**: `updateStreak()` no se está llamando al cargar la app

**Solución**:
```typescript
useEffect(() => {
  updateStreak();
}, []); // Llamar solo al montar
```

### localStorage está lleno

**Causa**: Límite de 5-10MB en localStorage

**Solución**: Implementar limpieza periódica o migrar a IndexedDB
```typescript
// Limpiar historial antiguo
const cleanOldHistory = () => {
  const recentWords = Object.keys(viewHistory)
    .sort((a, b) => viewHistory[b] - viewHistory[a])
    .slice(0, 100); // Mantener solo las 100 más vistas
  
  // Actualizar estado con solo palabras recientes
};
```

### Racha se resetea incorrectamente

**Causa**: Zona horaria o cambio de día a medianoche

**Verificar**:
```typescript
console.log('Hoy:', getTodayDate());
console.log('Última visita:', progress.lastVisitDate);
```

### Las palabras aprendidas no persisten

**Causa**: Conversión Set ↔ Array puede fallar

**Debug**:
```typescript
console.log('learnedWords:', Array.from(progress.learnedWords));
console.log('localStorage:', localStorage.getItem(STORAGE_KEY));
```

---

## 🚀 Mejoras Futuras

### Prioridad Alta
- [ ] **Notificación de Racha**: Alert cuando se pierde la racha
- [ ] **Vista de Palabras Aprendidas**: Lista filtrable de palabras dominadas
- [ ] **Gráfico de Progreso**: Chart.js mostrando evolución semanal
- [ ] **Exportar Progreso**: Descargar JSON del progreso

### Prioridad Media
- [ ] **Metas Personalizadas**: "Aprende 50 palabras este mes"
- [ ] **Badges/Logros**: Desbloquear insignias (7 días, 30 días, 100 palabras)
- [ ] **Comparación Social**: Comparar racha con amigos
- [ ] **Recordatorios**: Push notification si no visitó hoy

### Prioridad Baja
- [ ] **Migrar a IndexedDB**: Mayor capacidad de almacenamiento
- [ ] **Sincronización Cloud**: Backup en Supabase
- [ ] **Estadísticas Avanzadas**: Palabras más difíciles, tiempo de estudio
- [ ] **Modo Estudio**: Revisar solo palabras no aprendidas

---

## 🧪 Testing

### Casos de Prueba

```typescript
// Test: Primera visita
expect(stats.currentStreak).toBe(1);
expect(stats.learnedCount).toBe(0);

// Test: Marcar palabra como aprendida
toggleLearned('Книга');
expect(isLearned('Книга')).toBe(true);
expect(stats.learnedCount).toBe(1);

// Test: Desmarcar palabra
toggleLearned('Книга');
expect(isLearned('Книга')).toBe(false);
expect(stats.learnedCount).toBe(0);

// Test: Racha consecutiva
// Simular visita ayer
updateStreak(); // día 1
// Simular cambio de fecha
updateStreak(); // día 2
expect(stats.currentStreak).toBe(2);

// Test: Reset progreso
resetProgress();
expect(stats.learnedCount).toBe(0);
expect(stats.currentStreak).toBe(0);
```

---

## 📊 Métricas de Engagement

### KPIs Sugeridos

- **Tasa de Retención D1**: % de usuarios que vuelven al día siguiente
- **Promedio de Racha**: Racha promedio de todos los usuarios
- **Palabras por Usuario**: Cuántas palabras aprende el usuario promedio
- **Tiempo hasta Primera Palabra Aprendida**: Cuánto tarda en marcar la primera

---

## 🤝 Contribuir

Para agregar nuevas funcionalidades al sistema de progreso:

1. **Nuevas Métricas**: Agregar campos a `UserProgress` interface
2. **Nuevos Componentes**: Crear visualizaciones adicionales
3. **Integración Backend**: Migrar de localStorage a Supabase
4. **Analytics**: Implementar tracking de eventos

---

## 📚 Referencias

- [localStorage API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [Date Object - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- [Set Object - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)

---

**Última actualización**: 15 de octubre de 2025
**Versión**: 1.0.0
