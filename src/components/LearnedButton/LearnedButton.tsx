interface LearnedButtonProps {
  isLearned: boolean;
  onToggle: () => void;
  size?: 'small' | 'medium' | 'large';
}

/**
 * Botón para marcar/desmarcar palabra como aprendida
 * Muestra check cuando está aprendida, plus cuando no
 */
export function LearnedButton({
  isLearned,
  onToggle,
  size = 'large',
}: LearnedButtonProps) {
  const sizeClasses = {
    small: 'w-8 h-8 text-xs',
    medium: 'w-10 h-10 text-sm',
    large: 'w-12 h-12 text-base',
  };

  return (
    <button
      onClick={onToggle}
      className={`
        ${sizeClasses[size]}
        ${
          isLearned
            ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/30'
            : 'bg-slate-700 hover:bg-slate-600 border-2 border-slate-600 hover:border-slate-500'
        }
        rounded-lg
        transition-all duration-200
        flex items-center justify-center
        text-white
        focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-slate-900
        group
        relative
        overflow-hidden
      `}
      title={isLearned ? 'Marcar como no aprendida' : 'Marcar como aprendida'}
      aria-label={isLearned ? 'Desmarcar palabra como aprendida' : 'Marcar palabra como aprendida'}
    >
      {isLearned ? (
        // Icono de check (aprendida)
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ) : (
        // Icono de plus (no aprendida)
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      )}

      {/* Efecto de brillo */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
      
      {/* Animación de confetti al marcar */}
      {isLearned && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-1 h-1 bg-yellow-400 rounded-full animate-ping" />
          <div className="absolute top-0 right-0 w-1 h-1 bg-green-400 rounded-full animate-ping animation-delay-100" />
          <div className="absolute bottom-0 left-0 w-1 h-1 bg-blue-400 rounded-full animate-ping animation-delay-200" />
          <div className="absolute bottom-0 right-0 w-1 h-1 bg-purple-400 rounded-full animate-ping animation-delay-300" />
        </div>
      )}
    </button>
  );
}
