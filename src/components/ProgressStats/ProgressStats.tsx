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
    <>
      {/* Vista móvil - Compacta horizontal */}
      <div className="block sm:hidden mb-4">
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-3 mx-2">
          <div className="flex justify-between items-center text-center">
            {stats.map((stat, index) => (
              <div key={index} className="flex-1">
                <div className="text-sm mb-1">{stat.icon}</div>
                <div className={`text-base font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
                <div className="text-xs text-slate-400 leading-tight">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vista desktop - Grid completo */}
      <div className="hidden sm:grid sm:grid-cols-4 gap-4 mb-10">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4 text-center hover:bg-slate-800/70 transition-colors duration-200"
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
              {stat.value}
            </div>
            <div className="text-sm text-slate-400">
              {stat.suffix}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
