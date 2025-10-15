import { useSpeech } from '../../hooks/useSpeech';

interface SpeakButtonProps {
  text: string;
  lang?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
}

export function SpeakButton({ 
  text, 
  lang = 'ru-RU', 
  size = 'medium',
  variant = 'primary',
  className = ''
}: SpeakButtonProps) {
  const { speak, speaking, supported } = useSpeech();

  if (!supported) {
    return null; // No mostrar el botón si no está soportado
  }

  const sizeClasses = {
    small: 'w-8 h-8 text-sm',
    medium: 'w-10 h-10 text-base',
    large: 'w-12 h-12 text-lg'
  };

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-slate-100',
    ghost: 'bg-transparent hover:bg-slate-700/30 text-slate-300 hover:text-white'
  };

  return (
    <button
      onClick={() => speak(text, lang)}
      disabled={speaking}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded-full
        flex items-center justify-center
        transition-all duration-200
        shadow-lg
        disabled:opacity-50 disabled:cursor-not-allowed
        ${speaking ? 'animate-pulse scale-110' : 'hover:scale-110'}
        ${className}
      `}
      aria-label="Reproducir pronunciación"
      title="Escuchar pronunciación"
    >
      {speaking ? (
        // Icono de ondas de sonido animadas
        <svg 
          className="w-5 h-5" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" 
          />
        </svg>
      ) : (
        // Icono de altavoz
        <svg 
          className="w-5 h-5" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" 
          />
        </svg>
      )}
    </button>
  );
}
