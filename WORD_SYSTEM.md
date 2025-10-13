# 📚 Sistema de Palabra del Día - Guía de Implementación

## ✅ **Opción 1: Array Local con Rotación Diaria (IMPLEMENTADA)**

### Ventajas:
- ✅ **Simple y rápida** de implementar
- ✅ **No requiere backend** ni base de datos
- ✅ **Funciona offline**
- ✅ **Sin costos** adicionales
- ✅ **Perfecta para empezar**

### Desventajas:
- ❌ Limitado al vocabulario hardcodeado
- ❌ Para actualizar hay que hacer deploy
- ❌ No permite contenido dinámico desde admin

### Cómo funciona:
```typescript
// La función calcula qué día es desde una fecha de referencia
// y rota entre las palabras disponibles
const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
const index = daysSinceEpoch % vocabularyDatabase.length;
```

### Agregar más palabras:
Simplemente edita el archivo `src/data/vocabulary.ts` y agrega más objetos al array.

---

## 🔥 **Opción 2: Supabase (Recomendada para Producción)**

### Ventajas:
- ✅ **Escalable** - Miles de palabras
- ✅ **Panel de administración** fácil
- ✅ **API gratuita** (hasta 500MB)
- ✅ **Actualizaciones en tiempo real**
- ✅ **Gestión de imágenes** en Storage
- ✅ **Sin necesidad de deploy** para actualizar contenido

### Desventajas:
- ❌ Requiere configuración inicial
- ❌ Necesita conexión a internet
- ❌ Curva de aprendizaje de Supabase

### Estructura de la Base de Datos:

```sql
-- Tabla de palabras
CREATE TABLE words (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  russian TEXT NOT NULL,
  transliteration TEXT NOT NULL,
  translation TEXT NOT NULL,
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de ejemplos
CREATE TABLE examples (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  word_id UUID REFERENCES words(id) ON DELETE CASCADE,
  russian TEXT NOT NULL,
  transliteration TEXT NOT NULL,
  spanish TEXT NOT NULL,
  order_index INTEGER DEFAULT 0
);

-- Tabla de calendario (opcional - para control manual)
CREATE TABLE daily_words (
  date DATE PRIMARY KEY,
  word_id UUID REFERENCES words(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Instalación:
```bash
npm install @supabase/supabase-js
```

### Código de ejemplo:
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SUPABASE_ANON_KEY'
);

// Obtener palabra del día
async function getWordOfTheDay() {
  const { data, error } = await supabase
    .from('words')
    .select('*, examples(*)')
    .eq('active', true)
    .order('created_at')
    .limit(1)
    .single();
    
  return data;
}
```

---

## 🌐 **Opción 3: API Externa (JSON File en GitHub/Vercel)**

### Ventajas:
- ✅ **Gratis** completamente
- ✅ **Simple de mantener**
- ✅ **Versionado con Git**
- ✅ **CDN global** gratis

### Desventajas:
- ❌ Requiere commit para actualizar
- ❌ Sin panel admin visual

### Implementación:
```bash
# Crear archivo JSON público
mkdir public/data
touch public/data/vocabulary.json
```

```json
// public/data/vocabulary.json
{
  "words": [
    {
      "russian": "Книга",
      "transliteration": "Kniga",
      "translation": "Libro",
      "imageUrl": "...",
      "examples": [...]
    }
  ]
}
```

```typescript
// Cargar desde API
async function loadVocabulary() {
  const response = await fetch('/data/vocabulary.json');
  const data = await response.json();
  return data.words;
}
```

---

## 🎯 **Opción 4: LocalStorage + Manual Selection**

### Ventajas:
- ✅ **Persistencia local**
- ✅ **El usuario puede elegir** palabras anteriores
- ✅ **Historial de aprendizaje**

### Código de ejemplo:
```typescript
function saveProgress(word: string) {
  const history = JSON.parse(localStorage.getItem('wordHistory') || '[]');
  history.push({
    word,
    date: new Date().toISOString(),
    reviewed: false
  });
  localStorage.setItem('wordHistory', JSON.stringify(history));
}
```

---

## 📊 **Comparación Rápida**

| Característica | Local Array | Supabase | API JSON | LocalStorage |
|---------------|-------------|----------|----------|--------------|
| **Costo** | Gratis | Gratis (límite) | Gratis | Gratis |
| **Complejidad** | ⭐ Muy Fácil | ⭐⭐⭐ Media | ⭐⭐ Fácil | ⭐⭐ Fácil |
| **Escalabilidad** | ❌ Limitada | ✅ Excelente | ⭐⭐ Media | ❌ Limitada |
| **Admin Panel** | ❌ No | ✅ Sí | ❌ No | ❌ No |
| **Offline** | ✅ Sí | ❌ No | ❌ No | ✅ Sí |
| **Real-time** | ❌ No | ✅ Sí | ❌ No | ❌ No |

---

## 🚀 **Recomendación Final**

### Para empezar (ACTUAL):
✅ **Array Local** - Ya está implementado, funciona perfecto

### Para escalar:
✅ **Supabase** - Cuando tengas +50 palabras y quieras un panel admin

### Para simplicidad:
✅ **JSON File** - Si solo quieres editar un archivo

---

## 📝 **Próximos Pasos Sugeridos**

1. ✅ **Ya tienes**: Sistema básico funcionando
2. 🔜 **Agregar más palabras** al archivo `vocabulary.ts`
3. 🔜 **Sistema de progreso**: Marcar palabras como "aprendidas"
4. 🔜 **Quiz/Flashcards**: Para repasar
5. 🔜 **Audio de pronunciación**: Usando Web Speech API
6. 🔜 **Migrar a Supabase**: Cuando tengas +30 palabras

---

## 💡 **Tips Adicionales**

### Agregar más palabras fácilmente:
Edita `/src/data/vocabulary.ts` y copia/pega este template:

```typescript
{
  russian: "Слово",
  transliteration: "Slovo",
  translation: "Palabra",
  imageUrl: "https://images.unsplash.com/photo-XXXXX",
  examples: [
    {
      russian: "...",
      transliteration: "...",
      spanish: "..."
    },
    // ... 4 ejemplos más
  ]
}
```

### Encontrar buenas imágenes:
- [Unsplash](https://unsplash.com/) - Gratis, alta calidad
- [Pexels](https://www.pexels.com/) - Gratis, buena selección
- Usa el formato: `?w=800&h=600&fit=crop` para optimizar

### Orden sugerido de palabras:
1. **Básicas**: дом, вода, еда (casa, agua, comida)
2. **Acciones**: идти, быть, делать (ir, ser, hacer)
3. **Emociones**: любовь, радость, грусть (amor, alegría, tristeza)
4. **Tiempo**: день, ночь, утро (día, noche, mañana)
5. **Lugares**: город, улица, магазин (ciudad, calle, tienda)

---

¿Necesitas ayuda implementando alguna de estas opciones?
