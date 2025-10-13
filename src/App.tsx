import './App.css'
import { getWordOfTheDay } from './data/vocabulary'
import { useEffect, useState } from 'react'
import { SpeakButton } from './components/SpeakButton'
import { ShareImageButton } from './components/ShareImageButton'

function App() {
  // Obtener la palabra del día
  const [wordOfTheDay, setWordOfTheDay] = useState(getWordOfTheDay());

  // Verificar si cambió el día cada minuto
  useEffect(() => {
    const checkDayChange = () => {
      const newWord = getWordOfTheDay();
      if (newWord.russian !== wordOfTheDay.russian) {
        setWordOfTheDay(newWord);
      }
    };

    // Verificar cada minuto si cambió el día
    const interval = setInterval(checkDayChange, 60000);

    return () => clearInterval(interval);
  }, [wordOfTheDay]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-slate-100">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12 max-w-5xl">
        
        {/* Header - Palabra del día */}
        <header className="text-center mb-8 sm:mb-10 md:mb-12 space-y-2 sm:space-y-3 md:space-y-4">
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-2">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-blue-100 tracking-tight px-2">
              {wordOfTheDay.russian}
            </h1>
            <div className="flex items-center gap-2 sm:gap-3">
              <SpeakButton 
                text={wordOfTheDay.russian} 
                lang="ru-RU" 
                size="large"
                variant="primary"
              />
              <ShareImageButton 
                wordData={wordOfTheDay}
                size="large"
                variant="primary"
              />
            </div>
          </div>
          <p className="text-xl sm:text-2xl md:text-3xl text-slate-300 font-light italic px-2">
            {wordOfTheDay.transliteration}
          </p>
          <p className="text-lg sm:text-xl md:text-2xl text-slate-400 border-t border-slate-700 pt-3 sm:pt-4 mt-3 sm:mt-4 inline-block px-6 sm:px-8">
            {wordOfTheDay.translation}
          </p>
        </header>

        {/* Imagen representativa */}
        <div className="mb-8 sm:mb-12 md:mb-16 flex justify-center px-2">
          <div className="relative group w-full max-w-2xl">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
            <img 
              src={wordOfTheDay.imageUrl} 
              alt={wordOfTheDay.translation}
              className="relative rounded-lg shadow-2xl w-full object-cover h-48 sm:h-64 md:h-80 border border-slate-700"
            />
          </div>
        </div>

        {/* Tabla de ejemplos */}
        <section className="mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold text-blue-200 mb-4 sm:mb-6 text-center px-2">
            Ejemplos de uso
          </h2>
          
          {/* Vista móvil - Cards */}
          <div className="block sm:hidden space-y-4 px-2">
            {wordOfTheDay.examples.map((example, index) => (
              <div 
                key={index}
                className="bg-slate-800/50 backdrop-blur rounded-lg border border-slate-700 p-4 space-y-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-blue-200 font-semibold uppercase tracking-wider">Ruso</p>
                    <SpeakButton 
                      text={example.russian} 
                      lang="ru-RU" 
                      size="small"
                      variant="ghost"
                    />
                  </div>
                  <p className="text-slate-100 font-medium">{example.russian}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-blue-200 font-semibold uppercase tracking-wider">Transliteración</p>
                  <p className="text-slate-300 italic">{example.transliteration}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-blue-200 font-semibold uppercase tracking-wider">Español</p>
                  <p className="text-slate-400">{example.spanish}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Vista tablet/desktop - Tabla */}
          <div className="hidden sm:block overflow-x-auto rounded-lg border border-slate-700 shadow-xl">
            <table className="w-full text-left bg-slate-800/50 backdrop-blur">
              <thead className="bg-slate-900/70 border-b border-slate-700">
                <tr>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-blue-200 font-semibold text-xs md:text-sm uppercase tracking-wider">
                    Ruso
                  </th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-blue-200 font-semibold text-xs md:text-sm uppercase tracking-wider">
                    Transliteración
                  </th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-blue-200 font-semibold text-xs md:text-sm uppercase tracking-wider">
                    Español
                  </th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-blue-200 font-semibold text-xs md:text-sm uppercase tracking-wider w-16">
                    Audio
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {wordOfTheDay.examples.map((example, index) => (
                  <tr 
                    key={index}
                    className="hover:bg-slate-700/30 transition-colors duration-200"
                  >
                    <td className="px-3 md:px-6 py-3 md:py-4 text-sm md:text-base text-slate-100 font-medium">
                      {example.russian}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-sm md:text-base text-slate-300 italic">
                      {example.transliteration}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-sm md:text-base text-slate-400">
                      {example.spanish}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-center">
                      <SpeakButton 
                        text={example.russian} 
                        lang="ru-RU" 
                        size="small"
                        variant="ghost"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-slate-500 text-xs sm:text-sm mt-12 sm:mt-16 pb-6 sm:pb-8 px-2">
          <p>Una palabra rusa al día · Aprende con paciencia</p>
        </footer>
      </div>
    </div>
  )
}

export default App

