import { useState, useCallback } from 'react';

interface UseSpeechReturn {
  speak: (text: string, lang?: string) => void;
  speaking: boolean;
  supported: boolean;
  cancel: () => void;
}

/**
 * Hook para síntesis de voz usando Web Speech API
 * Soporta múltiples idiomas incluyendo ruso
 */
export function useSpeech(): UseSpeechReturn {
  const [speaking, setSpeaking] = useState(false);
  
  // Verificar si el navegador soporta Web Speech API
  const supported = 'speechSynthesis' in window;

  const speak = useCallback((text: string, lang: string = 'ru-RU') => {
    if (!supported) {
      console.warn('Web Speech API no está soportada en este navegador');
      return;
    }

    // Cancelar cualquier síntesis en progreso
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.85; // Velocidad un poco más lenta para mejor comprensión
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => {
      setSpeaking(false);
      console.error('Error en la síntesis de voz');
    };

    window.speechSynthesis.speak(utterance);
  }, [supported]);

  const cancel = useCallback(() => {
    if (supported) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  }, [supported]);

  return { speak, speaking, supported, cancel };
}
