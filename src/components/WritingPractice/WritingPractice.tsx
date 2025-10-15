import { useState } from 'react';

interface WritingPracticeProps {
  word: string;
  transliteration: string;
  onSuccess?: () => void;
  onAttempt?: (correct: boolean) => void;
}

/**
 * Componente de práctica de escritura
 * Permite al usuario escribir la palabra en ruso y valida si es correcta
 */
export function WritingPractice({
  word,
  transliteration,
  onSuccess,
  onAttempt,
}: WritingPracticeProps) {
  const [input, setInput] = useState('');
  const [showPractice, setShowPractice] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
  const [showHint, setShowHint] = useState(false);

  const handleCheck = () => {
    const isCorrect = input.trim().toLowerCase() === word.toLowerCase();
    setResult(isCorrect ? 'correct' : 'incorrect');
    setAttempts((prev) => prev + 1);

    if (onAttempt) {
      onAttempt(isCorrect);
    }

    if (isCorrect) {
      if (onSuccess) {
        onSuccess();
      }
      // Celebración y auto-cerrar después de 3 segundos
      setTimeout(() => {
        setShowPractice(false);
        setInput('');
        setResult(null);
        setAttempts(0);
        setShowHint(false);
      }, 3000);
    } else {
      // Mostrar hint después del segundo intento fallido
      if (attempts >= 1) {
        setShowHint(true);
      }
    }
  };

  const handleReset = () => {
    setInput('');
    setResult(null);
    setShowHint(false);
  };

  const handleClose = () => {
    setShowPractice(false);
    setInput('');
    setResult(null);
    setAttempts(0);
    setShowHint(false);
  };

  if (!showPractice) {
    return (
      <button
        onClick={() => setShowPractice(true)}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg shadow-purple-500/30 transition-all duration-200 flex items-center justify-center gap-2 group"
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
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
        <span>Practicar Escritura</span>
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
        <h3 className="text-lg font-semibold text-blue-200 flex items-center gap-2">
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
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
          Práctica de Escritura
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
      <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4">
        <p className="text-sm text-slate-300 mb-2">
          Escribe la palabra en ruso usando el teclado cirílico o la transliteración:
        </p>
        <div className="flex items-center gap-2 text-lg">
          <span className="text-blue-300 font-semibold">Transliteración:</span>
          <span className="text-slate-200 font-mono bg-slate-800 px-3 py-1 rounded">
            {transliteration}
          </span>
        </div>
      </div>

      {/* Input */}
      <div className="space-y-2">
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (result) setResult(null);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && input.trim()) {
              handleCheck();
            }
          }}
          placeholder="Escribe aquí..."
          className={`
            w-full px-4 py-3 bg-slate-900 border-2 rounded-lg
            text-xl font-semibold text-white
            placeholder-slate-500
            focus:outline-none focus:ring-2 focus:ring-purple-500
            transition-all duration-200
            ${
              result === 'correct'
                ? 'border-green-500 bg-green-900/20'
                : result === 'incorrect'
                ? 'border-red-500 bg-red-900/20'
                : 'border-slate-600 hover:border-slate-500'
            }
          `}
          disabled={result === 'correct'}
          autoFocus
        />

        {/* Hint */}
        {showHint && result !== 'correct' && (
          <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-3 animate-fade-in">
            <div className="flex items-start gap-2">
              <svg
                className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              <div className="text-sm text-yellow-200">
                <p className="font-semibold mb-1">💡 Pista:</p>
                <p>
                  La palabra empieza con: <span className="font-mono bg-yellow-900/30 px-2 py-0.5 rounded">{word[0]}</span>
                </p>
                <p className="mt-1 text-xs text-yellow-300">
                  Intenta copiar exactamente: {word}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Resultado */}
        {result && (
          <div
            className={`
              rounded-lg p-4 animate-fade-in
              ${
                result === 'correct'
                  ? 'bg-green-900/30 border-2 border-green-500'
                  : 'bg-red-900/30 border-2 border-red-500'
              }
            `}
          >
            <div className="flex items-center gap-3">
              {result === 'correct' ? (
                <>
                  <div className="text-4xl">🎉</div>
                  <div>
                    <p className="text-lg font-bold text-green-400">
                      ¡Correcto! ¡Excelente trabajo!
                    </p>
                    <p className="text-sm text-green-300 mt-1">
                      Has escrito correctamente: <span className="font-semibold">{word}</span>
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-3xl">❌</div>
                  <div>
                    <p className="text-lg font-bold text-red-400">Intenta de nuevo</p>
                    <p className="text-sm text-red-300 mt-1">
                      Escribiste: <span className="font-mono">{input}</span>
                    </p>
                    <p className="text-xs text-red-400 mt-1">
                      Revisa cada letra cuidadosamente
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Botones */}
      <div className="flex gap-3">
        <button
          onClick={handleCheck}
          disabled={!input.trim() || result === 'correct'}
          className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50"
        >
          Verificar
        </button>
        {result === 'incorrect' && (
          <button
            onClick={handleReset}
            className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors duration-200"
          >
            Reintentar
          </button>
        )}
      </div>

      {/* Contador de intentos */}
      <div className="text-center text-sm text-slate-400">
        Intentos: {attempts}
      </div>
    </div>
  );
}
