interface ProgressStatsProps {
  learnedCount: number;
  currentStreak: number;
  longestStreak: number;
  totalWordsViewed: number;
  favoriteCount: number;
}

/**
 * Componente que muestra las estadísticas de progreso del usuario
 * Racha diaria, palabras aprendidas, etc.
 */
export function ProgressStats({
  learnedCount,
  currentStreak,
  longestStreak,
  favoriteCount,
}: ProgressStatsProps) {
  const stats = [
    {
      icon: '🔥',
      label: 'Racha actual',
      value: currentStreak,
      suffix: currentStreak === 1 ? 'día' : 'días',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: '✅',
      label: 'Palabras aprendidas',
      value: learnedCount,
      suffix: learnedCount === 1 ? 'palabra' : 'palabras',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: '🏆',
      label: 'Mejor racha',
      value: longestStreak,
      suffix: longestStreak === 1 ? 'día' : 'días',
      color: 'from-yellow-500 to-amber-500',
    },
    {
      icon: '⭐',
      label: 'Favoritos',
      value: favoriteCount,
      suffix: favoriteCount === 1 ? 'ejemplo' : 'ejemplos',
      color: 'from-blue-500 to-cyan-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4 text-center hover:bg-slate-800/70 transition-colors duration-200"
        >
          <div className="text-3xl mb-2">{stat.icon}</div>
          <div className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
            {stat.value}
          </div>
          <div className="text-xs sm:text-sm text-slate-400">
            {stat.suffix}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
