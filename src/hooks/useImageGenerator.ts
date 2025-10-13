import { useCallback } from 'react';
import type { WordOfDay } from '../data/vocabulary';

/**
 * Hook para generar imágenes compartibles de la palabra del día
 * Usa Canvas API para crear una imagen con el diseño de la app
 */
export function useImageGenerator() {
  const generateImage = useCallback(async (wordData: WordOfDay): Promise<Blob | null> => {
    try {
      // Crear canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        console.error('No se pudo obtener el contexto 2D del canvas');
        return null;
      }

      // Dimensiones optimizadas para redes sociales (Instagram square)
      const width = 1080;
      const height = 1080;
      canvas.width = width;
      canvas.height = height;

      // Fondo con gradiente (similar al de la app)
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#0f172a'); // slate-900
      gradient.addColorStop(0.5, '#1e293b'); // slate-800
      gradient.addColorStop(1, '#1e3a8a'); // blue-900
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Configurar texto
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Título "Palabra del día"
      ctx.fillStyle = '#93c5fd'; // blue-300
      ctx.font = 'bold 48px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillText('🇷🇺 Palabra del día', width / 2, 150);

      // Palabra en ruso (grande y destacada)
      ctx.fillStyle = '#dbeafe'; // blue-100
      ctx.font = 'bold 140px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillText(wordData.russian, width / 2, 350);

      // Transliteración
      ctx.fillStyle = '#cbd5e1'; // slate-300
      ctx.font = 'italic 56px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillText(wordData.transliteration, width / 2, 480);

      // Línea separadora
      ctx.strokeStyle = '#475569'; // slate-600
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 200, 560);
      ctx.lineTo(width / 2 + 200, 560);
      ctx.stroke();

      // Traducción al español
      ctx.fillStyle = '#94a3b8'; // slate-400
      ctx.font = '64px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillText(wordData.translation, width / 2, 650);

      // Ejemplo destacado (primer ejemplo)
      if (wordData.examples && wordData.examples.length > 0) {
        const example = wordData.examples[0];
        
        // Fondo semi-transparente para el ejemplo
        ctx.fillStyle = 'rgba(30, 41, 59, 0.7)'; // slate-800 con opacidad
        ctx.fillRect(80, 750, width - 160, 180);
        
        ctx.fillStyle = '#e2e8f0'; // slate-200
        ctx.font = '36px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.fillText(example.russian, width / 2, 800);
        
        ctx.fillStyle = '#94a3b8'; // slate-400
        ctx.font = 'italic 28px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.fillText(example.spanish, width / 2, 870);
      }

      // Footer
      ctx.fillStyle = '#64748b'; // slate-500
      ctx.font = '32px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillText('Una palabra rusa al día', width / 2, 1000);

      // Convertir canvas a blob
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/png');
      });
    } catch (error) {
      console.error('Error al generar imagen:', error);
      return null;
    }
  }, []);

  return { generateImage };
}
