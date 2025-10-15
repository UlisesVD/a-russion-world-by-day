import { useState, useEffect, useCallback } from 'react';

export interface UserProgress {
  learnedWords: Set<string>; // Palabras marcadas como aprendidas
  lastVisitDate: string; // Última fecha de visita (YYYY-MM-DD)
  currentStreak: number; // Racha actual de días consecutivos
  longestStreak: number; // Racha más larga registrada
  totalWordsViewed: number; // Total de palabras vistas
  viewHistory: { [word: string]: number }; // Contador de veces vista cada palabra
  favoriteExamples: string[]; // IDs de ejemplos favoritos (word:index)
  writingPractice: { [word: string]: { attempts: number; successes: number } }; // Tracking de práctica de escritura
}

const STORAGE_KEY = 'russian-word-progress';

const getDefaultProgress = (): UserProgress => ({
  learnedWords: new Set<string>(),
  lastVisitDate: '',
  currentStreak: 0,
  longestStreak: 0,
  totalWordsViewed: 0,
  viewHistory: {},
  favoriteExamples: [],
  writingPractice: {},
});

const getTodayDate = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // YYYY-MM-DD
};

const getYesterdayDate = (): string => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
};

/**
 * Hook para manejar el progreso del usuario
 * Guarda datos en localStorage con persistencia
 */
export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convertir array a Set para learnedWords
        return {
          ...parsed,
          learnedWords: new Set(parsed.learnedWords || []),
        };
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
    return getDefaultProgress();
  });

  // Guardar en localStorage cuando cambie el progreso
  useEffect(() => {
    try {
      const toStore = {
        ...progress,
        learnedWords: Array.from(progress.learnedWords), // Set -> Array para JSON
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }, [progress]);

  // Actualizar racha cuando el usuario visita
  const updateStreak = useCallback(() => {
    const today = getTodayDate();
    const yesterday = getYesterdayDate();

    setProgress((prev) => {
      // Si ya visitó hoy, no hacer nada
      if (prev.lastVisitDate === today) {
        return prev;
      }

      let newStreak = prev.currentStreak;

      // Si la última visita fue ayer, aumentar racha
      if (prev.lastVisitDate === yesterday) {
        newStreak = prev.currentStreak + 1;
      } 
      // Si no visitó ayer, reiniciar racha a 1
      else if (prev.lastVisitDate !== '') {
        newStreak = 1;
      } 
      // Primera visita
      else {
        newStreak = 1;
      }

      const newLongestStreak = Math.max(newStreak, prev.longestStreak);

      return {
        ...prev,
        lastVisitDate: today,
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
      };
    });
  }, []);

  // Marcar palabra como aprendida
  const markAsLearned = useCallback((word: string) => {
    setProgress((prev) => {
      const newLearnedWords = new Set(prev.learnedWords);
      newLearnedWords.add(word);
      return {
        ...prev,
        learnedWords: newLearnedWords,
      };
    });
  }, []);

  // Desmarcar palabra como aprendida
  const unmarkAsLearned = useCallback((word: string) => {
    setProgress((prev) => {
      const newLearnedWords = new Set(prev.learnedWords);
      newLearnedWords.delete(word);
      return {
        ...prev,
        learnedWords: newLearnedWords,
      };
    });
  }, []);

  // Toggle palabra aprendida
  const toggleLearned = useCallback((word: string) => {
    setProgress((prev) => {
      const newLearnedWords = new Set(prev.learnedWords);
      if (newLearnedWords.has(word)) {
        newLearnedWords.delete(word);
      } else {
        newLearnedWords.add(word);
      }
      return {
        ...prev,
        learnedWords: newLearnedWords,
      };
    });
  }, []);

  // Verificar si una palabra está aprendida
  const isLearned = useCallback(
    (word: string): boolean => {
      return progress.learnedWords.has(word);
    },
    [progress.learnedWords]
  );

  // Registrar que el usuario vio una palabra
  const trackWordView = useCallback((word: string) => {
    setProgress((prev) => {
      const newViewHistory = { ...prev.viewHistory };
      newViewHistory[word] = (newViewHistory[word] || 0) + 1;

      return {
        ...prev,
        viewHistory: newViewHistory,
        totalWordsViewed: prev.totalWordsViewed + 1,
      };
    });
  }, []);

  // Toggle ejemplo favorito
  const toggleFavoriteExample = useCallback((exampleId: string) => {
    setProgress((prev) => {
      const newFavorites = [...prev.favoriteExamples];
      const index = newFavorites.indexOf(exampleId);
      
      if (index > -1) {
        newFavorites.splice(index, 1);
      } else {
        newFavorites.push(exampleId);
      }

      return {
        ...prev,
        favoriteExamples: newFavorites,
      };
    });
  }, []);

  // Verificar si un ejemplo es favorito
  const isFavoriteExample = useCallback(
    (exampleId: string): boolean => {
      return progress.favoriteExamples.includes(exampleId);
    },
    [progress.favoriteExamples]
  );

  // Resetear todo el progreso
  const resetProgress = useCallback(() => {
    setProgress(getDefaultProgress());
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Trackear intento de práctica de escritura
  const trackWritingAttempt = useCallback((word: string, correct: boolean) => {
    setProgress((prev) => {
      const newWritingPractice = { ...prev.writingPractice };
      
      if (!newWritingPractice[word]) {
        newWritingPractice[word] = { attempts: 0, successes: 0 };
      }
      
      newWritingPractice[word].attempts++;
      if (correct) {
        newWritingPractice[word].successes++;
      }

      return {
        ...prev,
        writingPractice: newWritingPractice,
      };
    });
  }, []);

  // Calcular estadísticas
  const stats = {
    learnedCount: progress.learnedWords.size,
    currentStreak: progress.currentStreak,
    longestStreak: progress.longestStreak,
    totalWordsViewed: progress.totalWordsViewed,
    favoriteCount: progress.favoriteExamples.length,
  };

  return {
    progress,
    stats,
    updateStreak,
    markAsLearned,
    unmarkAsLearned,
    toggleLearned,
    isLearned,
    trackWordView,
    toggleFavoriteExample,
    isFavoriteExample,
    trackWritingAttempt,
    resetProgress,
  };
}
