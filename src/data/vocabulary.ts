// Base de datos de vocabulario ruso
export interface WordExample {
  russian: string;
  transliteration: string;
  spanish: string;
}

export interface WordOfDay {
  russian: string;
  transliteration: string;
  translation: string;
  imageUrl: string;
  examples: WordExample[];
}

export const vocabularyDatabase: WordOfDay[] = [
  {
    russian: "Книга",
    transliteration: "Kniga",
    translation: "Libro",
    imageUrl: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&h=600&fit=crop",
    examples: [
      {
        russian: "Я читаю интересную книгу.",
        transliteration: "Ya chitayu interesnuyu knigu.",
        spanish: "Estoy leyendo un libro interesante."
      },
      {
        russian: "Эта книга очень старая.",
        transliteration: "Eta kniga ochen staraya.",
        spanish: "Este libro es muy antiguo."
      },
      {
        russian: "Где моя книга?",
        transliteration: "Gde moya kniga?",
        spanish: "¿Dónde está mi libro?"
      },
      {
        russian: "Книга лежит на столе.",
        transliteration: "Kniga lezhit na stole.",
        spanish: "El libro está sobre la mesa."
      },
      {
        russian: "Мне нравится эта книга.",
        transliteration: "Mne nravitsya eta kniga.",
        spanish: "Me gusta este libro."
      }
    ]
  },
  {
    russian: "Дом",
    transliteration: "Dom",
    translation: "Casa",
    imageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop",
    examples: [
      {
        russian: "Мой дом очень большой.",
        transliteration: "Moy dom ochen bolshoy.",
        spanish: "Mi casa es muy grande."
      },
      {
        russian: "Я иду домой.",
        transliteration: "Ya idu domoy.",
        spanish: "Voy a casa."
      },
      {
        russian: "Где твой дом?",
        transliteration: "Gde tvoy dom?",
        spanish: "¿Dónde está tu casa?"
      },
      {
        russian: "Дом находится в центре города.",
        transliteration: "Dom nakhoditsya v tsentre goroda.",
        spanish: "La casa está en el centro de la ciudad."
      },
      {
        russian: "Это новый дом.",
        transliteration: "Eto novyy dom.",
        spanish: "Esta es una casa nueva."
      }
    ]
  },
  {
    russian: "Вода",
    transliteration: "Voda",
    translation: "Agua",
    imageUrl: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800&h=600&fit=crop",
    examples: [
      {
        russian: "Мне нужна вода.",
        transliteration: "Mne nuzhna voda.",
        spanish: "Necesito agua."
      },
      {
        russian: "Вода холодная.",
        transliteration: "Voda kholodnaya.",
        spanish: "El agua está fría."
      },
      {
        russian: "Я пью много воды.",
        transliteration: "Ya pyu mnogo vody.",
        spanish: "Bebo mucha agua."
      },
      {
        russian: "В стакане есть вода.",
        transliteration: "V stakane yest voda.",
        spanish: "Hay agua en el vaso."
      },
      {
        russian: "Вода чистая.",
        transliteration: "Voda chistaya.",
        spanish: "El agua está limpia."
      }
    ]
  },
  {
    russian: "Друг",
    transliteration: "Drug",
    translation: "Amigo",
    imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop",
    examples: [
      {
        russian: "Мой друг живёт в Москве.",
        transliteration: "Moy drug zhivyot v Moskve.",
        spanish: "Mi amigo vive en Moscú."
      },
      {
        russian: "У меня много друзей.",
        transliteration: "U menya mnogo druzey.",
        spanish: "Tengo muchos amigos."
      },
      {
        russian: "Он мой лучший друг.",
        transliteration: "On moy luchshiy drug.",
        spanish: "Él es mi mejor amigo."
      },
      {
        russian: "Друг помогает мне.",
        transliteration: "Drug pomogayet mne.",
        spanish: "Mi amigo me ayuda."
      },
      {
        russian: "Я встречаюсь с другом.",
        transliteration: "Ya vstrechayus s drugom.",
        spanish: "Me encuentro con mi amigo."
      }
    ]
  },
  {
    russian: "Любовь",
    transliteration: "Lyubov",
    translation: "Amor",
    imageUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&h=600&fit=crop",
    examples: [
      {
        russian: "Любовь сильнее всего.",
        transliteration: "Lyubov silneye vsego.",
        spanish: "El amor es más fuerte que todo."
      },
      {
        russian: "Я люблю тебя.",
        transliteration: "Ya lyublyu tebya.",
        spanish: "Te amo."
      },
      {
        russian: "Это настоящая любовь.",
        transliteration: "Eto nastoyashchaya lyubov.",
        spanish: "Este es amor verdadero."
      },
      {
        russian: "Любовь к музыке.",
        transliteration: "Lyubov k muzyke.",
        spanish: "Amor por la música."
      },
      {
        russian: "Любовь делает нас счастливыми.",
        transliteration: "Lyubov delayet nas schastlivymi.",
        spanish: "El amor nos hace felices."
      }
    ]
  },
  {
    russian: "Время",
    transliteration: "Vremya",
    translation: "Tiempo",
    imageUrl: "https://images.unsplash.com/photo-1501139083538-0139583c060f?w=800&h=600&fit=crop",
    examples: [
      {
        russian: "У меня нет времени.",
        transliteration: "U menya net vremeni.",
        spanish: "No tengo tiempo."
      },
      {
        russian: "Который час?",
        transliteration: "Kotoryy chas?",
        spanish: "¿Qué hora es?"
      },
      {
        russian: "Время летит быстро.",
        transliteration: "Vremya letit bystro.",
        spanish: "El tiempo vuela rápido."
      },
      {
        russian: "Сейчас самое время.",
        transliteration: "Seychas samoye vremya.",
        spanish: "Ahora es el momento."
      },
      {
        russian: "Время идёт.",
        transliteration: "Vremya idyot.",
        spanish: "El tiempo pasa."
      }
    ]
  },
  {
    russian: "Солнце",
    transliteration: "Solntse",
    translation: "Sol",
    imageUrl: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&h=600&fit=crop",
    examples: [
      {
        russian: "Солнце светит ярко.",
        transliteration: "Solntse svetit yarko.",
        spanish: "El sol brilla intensamente."
      },
      {
        russian: "Солнце встаёт рано.",
        transliteration: "Solntse vstayot rano.",
        spanish: "El sol sale temprano."
      },
      {
        russian: "Я люблю солнце.",
        transliteration: "Ya lyublyu solntse.",
        spanish: "Me gusta el sol."
      },
      {
        russian: "Солнце заходит.",
        transliteration: "Solntse zakhodit.",
        spanish: "El sol se pone."
      },
      {
        russian: "На солнце тепло.",
        transliteration: "Na solntse teplo.",
        spanish: "Hace calor bajo el sol."
      }
    ]
  }
];

/**
 * Obtiene la palabra del día basándose en la fecha actual
 * La misma palabra aparecerá durante todo el día
 */
export function getWordOfTheDay(): WordOfDay {
  // Obtener la fecha actual sin hora
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Usar la fecha como semilla para seleccionar la palabra
  // Esto asegura que la misma palabra aparezca todo el día
  const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
  const index = daysSinceEpoch % vocabularyDatabase.length;
  
  return vocabularyDatabase[index];
}

/**
 * Obtiene todas las palabras para vista administrativa
 */
export function getAllWords(): WordOfDay[] {
  return vocabularyDatabase;
}
