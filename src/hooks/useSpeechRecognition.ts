import { useState, useCallback, useRef, useEffect } from 'react';

// Tipos para Web Speech API
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognitionResult {
  0: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onstart: ((event: Event) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((event: Event) => void) | null;
}

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  confidence: number;
  error: string | null;
  startListening: (options?: { language?: string; timeout?: number }) => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

/**
 * Hook para reconocimiento de voz usando Web Speech API
 * Captura audio del usuario y lo convierte a texto para evaluación de pronunciación
 */
export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<number | null>(null);

  // Verificar si el navegador soporta Speech Recognition
  const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  // Limpiar recursos al desmontar
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const startListening = useCallback((options: { language?: string; timeout?: number } = {}) => {
    if (!isSupported) {
      setError('Reconocimiento de voz no soportado en este navegador');
      return;
    }

    if (isListening) return;

    setError(null);
    setTranscript('');
    setConfidence(0);

    try {
      // Crear nueva instancia de reconocimiento
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      // Configuración
      recognition.continuous = false; // Solo una frase
      recognition.interimResults = true; // Resultados parciales
      recognition.lang = options.language || 'ru-RU'; // Ruso por defecto
      recognition.maxAlternatives = 1;

      // Event handlers
      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const results = event.results;
        const lastResult = results[results.length - 1];
        
        if (lastResult) {
          const transcriptText = lastResult[0].transcript;
          const confidenceScore = lastResult[0].confidence || 0;
          
          setTranscript(transcriptText);
          setConfidence(confidenceScore);

          // Si es resultado final, detener automáticamente
          if (lastResult.isFinal) {
            setIsListening(false);
          }
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        setIsListening(false);
        let errorMessage = 'Error en el reconocimiento de voz';
        
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No se detectó audio. Intenta hablar más fuerte.';
            break;
          case 'audio-capture':
            errorMessage = 'No se puede acceder al micrófono. Verifica los permisos.';
            break;
          case 'not-allowed':
            errorMessage = 'Permisos de micrófono denegados.';
            break;
          case 'network':
            errorMessage = 'Error de red. Verifica tu conexión.';
            break;
          case 'language-not-supported':
            errorMessage = 'Idioma no soportado.';
            break;
        }
        
        setError(errorMessage);
      };

      recognition.onend = () => {
        setIsListening(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();

      // Timeout automático
      if (options.timeout) {
        timeoutRef.current = setTimeout(() => {
          if (recognition && isListening) {
            recognition.stop();
          }
        }, options.timeout);
      }

    } catch {
      setError('Error al inicializar el reconocimiento de voz');
      setIsListening(false);
    }
  }, [isSupported, isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setConfidence(0);
    setError(null);
  }, []);

  return {
    isListening,
    isSupported,
    transcript,
    confidence,
    error,
    startListening,
    stopListening,
    resetTranscript,
  };
}

// Extender el tipo global de Window para TypeScript
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}