import React, { useState } from 'react';
import { Palette, Eye, Check, X, RefreshCw, Sun, Layout, Type, Accessibility } from 'lucide-react';
import { useUI } from '../contexts/UIContext';

const DesignPilot: React.FC = () => {
  const { language } = useUI();
  const [activeSuggestion, setActiveSuggestion] = useState<any>(null);

  const suggestions = [
    {
      id: 'd1',
      category: 'color',
      icon: <Palette className="w-4 h-4" />,
      title: language === 'pt' ? 'Paleta Oceânica' : 'Oceanic Palette',
      recommendation: language === 'pt' ? 'Usar #0F172A para fundos profundos.' : 'Use #0F172A for deep backgrounds.',
      impact: 'Estético'
    },
    {
      id: 'd2',
      category: 'layout',
      icon: <Layout className="w-4 h-4" />,
      title: language === 'pt' ? 'Grades Dinâmicas' : 'Dynamic Grids',
      recommendation: language === 'pt' ? 'Ajustar colunas para 12-col base flow.' : 'Adjust columns to 12-col base flow.',
      impact: 'UX'
    }
  ];

  return (
    <div className="fixed bottom-24 right-6 w-72 z-40 animate-in fade-in zoom-in duration-300">
      <div className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl rounded-[2rem] border border-blue-500/20 shadow-2xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Palette className="text-white w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">AI Design Pilot</h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-tighter">Estética Otimizada</p>
          </div>
        </div>

        <div className="space-y-4">
          {suggestions.map((s) => (
            <div 
              key={s.id}
              className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-transparent hover:border-blue-500/30 transition-all cursor-pointer group"
              onClick={() => setActiveSuggestion(s)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="p-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-md">
                    {s.icon}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">{s.category}</span>
                </div>
                <span className="text-[9px] font-bold text-blue-500">{s.impact}</span>
              </div>
              <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 group-hover:text-blue-500 transition-colors">
                {s.title}
              </h4>
            </div>
          ))}
        </div>

        <button className="w-full mt-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl text-[10px] font-bold hover:scale-105 transition-transform flex items-center justify-center space-x-2">
          <RefreshCw className="w-3 h-3" />
          <span>{language === 'pt' ? 'Escanear UI Completa' : 'Scan Full UI'}</span>
        </button>
      </div>
    </div>
  );
};

export default DesignPilot;
