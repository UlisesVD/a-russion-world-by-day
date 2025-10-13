import { useState } from 'react';
import { useImageGenerator } from '../hooks/useImageGenerator';
import type { WordOfDay } from '../data/vocabulary';

interface ShareImageButtonProps {
  wordData: WordOfDay;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'ghost';
}

/**
 * Botón para compartir una imagen de la palabra del día
 * Genera una imagen con Canvas y la comparte usando Web Share API
 */
export function ShareImageButton({ 
  wordData,
  size = 'medium',
  variant = 'primary'
}: ShareImageButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { generateImage } = useImageGenerator();

  const handleShare = async () => {
    setIsGenerating(true);
    
    try {
      // Generar la imagen
      const imageBlob = await generateImage(wordData);
      
      if (!imageBlob) {
        alert('No se pudo generar la imagen. Intenta de nuevo.');
        setIsGenerating(false);
        return;
      }

      // Crear archivo desde el blob
      const file = new File(
        [imageBlob], 
        `palabra-rusa-${wordData.russian}.png`, 
        { type: 'image/png' }
      );

      // Intentar compartir con Web Share API
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: `🇷🇺 ${wordData.russian}`,
            text: `Palabra rusa del día: ${wordData.russian} (${wordData.translation})`,
            files: [file],
          });
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 2000);
        } catch (error) {
          // Usuario canceló o error
          if ((error as Error).name !== 'AbortError') {
            console.error('Error al compartir:', error);
            // Fallback: descargar la imagen
            downloadImage(imageBlob, wordData.russian);
          }
        }
      } else {
        // Fallback: descargar la imagen directamente
        downloadImage(imageBlob, wordData.russian);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un error al procesar la imagen.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `palabra-rusa-${filename}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Estilos según tamaño
  const sizeClasses = {
    small: 'w-8 h-8 text-xs',
    medium: 'w-10 h-10 text-sm',
    large: 'w-12 h-12 text-base',
  };

  // Estilos según variante
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/30',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-slate-200',
    ghost: 'bg-transparent hover:bg-slate-700/50 text-slate-300',
  };

  return (
    <div className="relative inline-block">
      <button
        id="share-image-button"
        onClick={handleShare}
        disabled={isGenerating}
        className={`
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          rounded-lg
          transition-all duration-200
          flex items-center justify-center
          focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900
          disabled:opacity-50 disabled:cursor-not-allowed
          group
          relative
          overflow-hidden
        `}
        title="Compartir imagen de la palabra"
        aria-label="Generar y compartir imagen de la palabra del día"
      >
        {isGenerating ? (
          // Spinner de carga
          <svg 
            className="animate-spin w-5 h-5" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          // Icono de compartir
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" 
            />
          </svg>
        )}

        {/* Efecto de brillo */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
      </button>

      {/* Tooltip de éxito */}
      {showSuccess && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-3 py-2 rounded-md whitespace-nowrap shadow-lg z-50 animate-fade-in">
          ✓ ¡Imagen lista!
        </div>
      )}
    </div>
  );
}
