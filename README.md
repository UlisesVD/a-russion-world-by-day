# 🇷🇺 Una Palabra Rusa al Día

> Aprende ruso una palabra a la vez con una experiencia minimalista y elegante.

![React](https://img.shields.io/badge/React-19.1-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)

## ✨ Características

- 📅 **Palabra diaria automática** - Nueva palabra cada día
- 🔊 **Pronunciación de audio** - Escucha la pronunciación correcta en ruso
- � **Compartir como imagen** - Genera y comparte imágenes visuales de las palabras
- �📱 **Diseño responsivo** - Optimizado para móvil, tablet y desktop
- 🌙 **Tema oscuro** - Estética minimalista inspirada en el frío ruso
- 🎨 **Tailwind CSS** - Diseño moderno sin CSS personalizado
- 📚 **Ejemplos contextuales** - 5 oraciones por palabra
- 🌐 **Transliteración** - Ayuda para la pronunciación
- 💾 **Funciona offline** - Sin necesidad de backend

## 🚀 Inicio Rápido

### Requisitos
- Node.js 18+ (recomendado: 20+)
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone [URL-del-repo]
cd a-russion-world-by-day

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── SpeakButton.tsx         # Botón de audio reutilizable
│   └── ShareImageButton.tsx    # Botón para compartir imágenes
├── data/
│   └── vocabulary.ts           # Base de datos de palabras
├── hooks/
│   ├── useSpeech.ts            # Hook para síntesis de voz
│   └── useImageGenerator.ts    # Hook para generar imágenes
├── App.tsx                     # Componente principal
├── index.css                   # Tailwind directives
└── main.tsx                    # Entry point
```

## 🎯 Cómo Funciona

### Sistema de Rotación Diaria

La aplicación calcula automáticamente qué palabra mostrar según la fecha:

```typescript
const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
const index = daysSinceEpoch % vocabularyDatabase.length;
```

- ✅ La misma palabra aparece durante todo el día
- ✅ Cambia automáticamente a medianoche
- ✅ Ciclo infinito de palabras

### Sistema de Audio

Usa **Web Speech API** para pronunciación en tiempo real:

- 🔊 Click en cualquier botón de audio para escuchar
- 🎚️ Velocidad ajustada (0.85) para mejor comprensión
- 🌐 Soporte para navegadores modernos (Chrome, Safari, Edge, Firefox)

## 📝 Agregar Más Palabras

Edita `src/data/vocabulary.ts` y agrega nuevos objetos:

```typescript
{
  russian: "Слово",
  transliteration: "Slovo",
  translation: "Palabra",
  imageUrl: "https://images.unsplash.com/...",
  examples: [
    {
      russian: "Ejemplo en ruso",
      transliteration: "Transliteración",
      spanish: "Traducción al español"
    },
    // ... 4 ejemplos más
  ]
}
```

## 🛠️ Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build para producción
npm run preview  # Preview del build
npm run lint     # Ejecutar ESLint
```

## 🎨 Personalización

### Colores
Los colores principales se pueden ajustar en las clases de Tailwind:
- `from-slate-900` → Fondo principal
- `text-blue-100` → Título principal
- `bg-blue-600` → Botones primarios

### Velocidad de Audio
En `src/hooks/useSpeech.ts`:
```typescript
utterance.rate = 0.85; // Ajustar entre 0.5 y 2.0
```

## 📚 Documentación Adicional

- [WORD_SYSTEM.md](./WORD_SYSTEM.md) - Guía completa del sistema de palabras
- [AUDIO_SYSTEM.md](./AUDIO_SYSTEM.md) - Documentación del sistema de audio
- [IMAGE_SHARE_SYSTEM.md](./IMAGE_SHARE_SYSTEM.md) - Sistema de compartir imágenes

## 🌐 Compatibilidad de Navegadores

| Feature | Chrome | Safari | Firefox | Edge |
|---------|--------|--------|---------|------|
| Layout | ✅ | ✅ | ✅ | ✅ |
| Audio | ✅ | ✅ | ⚠️ | ✅ |
| Responsive | ✅ | ✅ | ✅ | ✅ |

⚠️ = Soporte básico

## 🚀 Deploy

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Subir carpeta dist/
```

### GitHub Pages
```bash
npm run build
# Configurar gh-pages con carpeta dist/
```

## 📱 Screenshots

### Desktop
![Desktop View](./screenshots/desktop.png)

### Mobile
![Mobile View](./screenshots/mobile.png)

## 🔮 Roadmap

- [ ] Sistema de progreso de usuario
- [ ] Quiz interactivo
- [ ] Flashcards para repasar
- [ ] Backend con Supabase
- [ ] Audio pregrabado de calidad
- [ ] Modo de práctica con reconocimiento de voz
- [ ] Estadísticas de aprendizaje
- [ ] Compartir en redes sociales

## 🤝 Contribuir

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- Imágenes de [Unsplash](https://unsplash.com/)
- Iconos y diseño inspirados en la estética rusa
- Web Speech API por la funcionalidad de audio

---

Hecho con ❤️ para aprender ruso
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
