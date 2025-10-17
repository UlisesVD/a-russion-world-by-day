import { useState } from 'react';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useSpeech } from '../../hooks/useSpeech';

interface PronunciationPracticeProps {
  word: string;
  transliteration: string;
  onSuccess?: () => void;
  onAttempt?: (correct: boolean, similarity: number) => void;
}

/**
 * Componente de práctica de pronunciación
 * Permite escuchar una palabra, repetirla y recibir feedback sobre la pronunciación
 */
export function PronunciationPractice({
  word,
  transliteration,
  onSuccess,
  onAttempt,
}: PronunciationPracticeProps) {
  const [showPractice, setShowPractice] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);

  // Hooks de audio
  const { speak, speaking } = useSpeech();
  const {
    isListening,
    isSupported,
    transcript,
    confidence,
    error,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  // Calcular similitud entre palabras (algoritmo simple)
  const calculateSimilarity = (spoken: string, target: string): number => {
    const normalizeText = (text: string) => 
      text.toLowerCase().trim().replace(/[.,!?]/g, '');
    
    const spokenNorm = normalizeText(spoken);
    const targetNorm = normalizeText(target);
    
    // Coincidencia exacta
    if (spokenNorm === targetNorm) return 100;
    
    // Algoritmo de distancia de Levenshtein simplificado
    const longer = spokenNorm.length > targetNorm.length ? spokenNorm : targetNorm;
    const shorter = spokenNorm.length > targetNorm.length ? targetNorm : spokenNorm;
    
    if (longer.length === 0) return 100;
    
    const editDistance = levenshteinDistance(longer, shorter);
    const similarity = ((longer.length - editDistance) / longer.length) * 100;
    
    // Bonus por confianza del reconocimiento
    const confidenceBonus = confidence * 10;
    
    return Math.min(100, Math.max(0, similarity + confidenceBonus));
  };

  // Algoritmo de distancia de Levenshtein
  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  };

  const handlePlayExample = () => {
    speak(word, 'ru-RU');
  };

  const handleStartRecording = () => {
    resetTranscript();
    startListening({ 
      language: 'ru-RU', 
      timeout: 5000 // 5 segundos máximo
    });
  };

  const handleStopRecording = () => {
    stopListening();
  };

  const handleEvaluate = () => {
    if (!transcript) return;
    
    const similarity = calculateSimilarity(transcript, word);
    const isCorrect = similarity >= 70; // Umbral de 70% para considerarlo correcto
    
    setLastScore(similarity);
    setAttempts(prev => prev + 1);
    
    if (onAttempt) {
      onAttempt(isCorrect, similarity);
    }
    
    if (isCorrect && onSuccess) {
      onSuccess();
      // Auto-cerrar después de 3 segundos si fue exitoso
      setTimeout(() => {
        setShowPractice(false);
        resetState();
      }, 3000);
    }
  };

  const resetState = () => {
    setAttempts(0);
    setLastScore(null);
    setShowInstructions(true);
    resetTranscript();
  };

  const handleClose = () => {
    setShowPractice(false);
    stopListening();
    resetState();
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return '¡Excelente pronunciación!';
    if (score >= 70) return '¡Buena pronunciación!';
    if (score >= 50) return 'Pronunciación aceptable, sigue practicando';
    return 'Intenta de nuevo, enfócate en cada sonido';
  };

  if (!isSupported) {
    return (
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6 text-center">
        <div className="text-4xl mb-3">🚫</div>
        <p className="text-slate-400 text-sm">
          El reconocimiento de voz no está disponible en este navegador.
          <br />
          Intenta usar Chrome, Safari o Edge para acceder a esta función.
        </p>
      </div>
    );
  }

  if (!showPractice) {
    return (
      <button
        onClick={() => setShowPractice(true)}
        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg shadow-emerald-500/30 transition-all duration-200 flex items-center justify-center gap-2 group"
      >
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
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
        <span>Practicar Pronunciación</span>
        <svg
          className="w-4 h-4 transition-transform group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    );
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6 space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-emerald-200 flex items-center gap-2">
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
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
          Práctica de Pronunciación
        </h3>
        <button
          onClick={handleClose}
          className="text-slate-400 hover:text-slate-200 transition-colors"
          aria-label="Cerrar práctica"
        >
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Instrucciones */}
      {showInstructions && (
        <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4 space-y-3">
          <h4 className="font-semibold text-emerald-300 text-sm">📢 Cómo practicar:</h4>
          <ol className="text-sm text-slate-300 space-y-1 ml-4">
            <li>1. Escucha la pronunciación correcta</li>
            <li>2. Presiona "Grabar" y repite la palabra</li>
            <li>3. Recibe feedback sobre tu pronunciación</li>
          </ol>
          <button
            onClick={() => setShowInstructions(false)}
            className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            ✓ Entendido
          </button>
        </div>
      )}

      {/* Palabra objetivo */}
      <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-emerald-300 font-semibold">Palabra a pronunciar:</span>
          <button
            onClick={handlePlayExample}
            disabled={speaking}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            {speaking ? (
              <>
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                Reproduciendo...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
                Escuchar
              </>
            )}
          </button>
        </div>
        <div className="text-2xl font-bold text-white mb-1">{word}</div>
        <div className="text-slate-400 italic text-sm">{transliteration}</div>
      </div>

      {/* Control de grabación */}
      <div className="space-y-3">
        <div className="flex gap-3">
          {!isListening ? (
            <button
              onClick={handleStartRecording}
              disabled={speaking}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              Grabar Pronunciación
            </button>
          ) : (
            <button
              onClick={handleStopRecording}
              className="flex-1 bg-red-500 animate-pulse text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <div className="w-3 h-3 bg-white rounded-full animate-ping" />
              Grabando... (Presiona para parar)
            </button>
          )}
          
          {transcript && !isListening && (
            <button
              onClick={handleEvaluate}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200 font-semibold"
            >
              Evaluar
            </button>
          )}
        </div>

        {/* Resultado de transcripción */}
        {transcript && (
          <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4">
            <p className="text-sm text-slate-300 mb-1">Tu pronunciación detectada:</p>
            <p className="text-lg font-semibold text-white">{transcript}</p>
            {confidence > 0 && (
              <p className="text-xs text-slate-400 mt-1">
                Confianza del reconocimiento: {(confidence * 100).toFixed(0)}%
              </p>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-3 animate-fade-in">
            <p className="text-red-400 text-sm">❌ {error}</p>
          </div>
        )}

        {/* Resultado de evaluación */}
        {lastScore !== null && (
          <div className={`
            rounded-lg p-4 animate-fade-in border-2
            ${lastScore >= 70 
              ? 'bg-green-900/30 border-green-500' 
              : 'bg-yellow-900/30 border-yellow-600'
            }
          `}>
            <div className="flex items-center gap-3">
              <div className="text-3xl">
                {lastScore >= 90 ? '🎉' : lastScore >= 70 ? '👍' : '💪'}
              </div>
              <div>
                <p className="font-bold text-lg">
                  Puntuación: <span className={getScoreColor(lastScore)}>{lastScore.toFixed(0)}%</span>
                </p>
                <p className="text-sm mt-1">{getScoreMessage(lastScore)}</p>
                {lastScore >= 70 && (
                  <p className="text-xs text-green-400 mt-1">¡Palabra dominada! 🎯</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contador de intentos */}
      <div className="text-center text-sm text-slate-400">
        Intentos: {attempts}
        {confidence > 0 && ` | Confianza: ${(confidence * 100).toFixed(0)}%`}
      </div>
    </div>
  );
}