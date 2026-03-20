import React from 'react';
import { X, Sparkles, AlertTriangle, Zap, Rocket, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useUI } from '../contexts/UIContext';

const SuggestionsPanel: React.FC = () => {
  const { showSuggestions, setShowSuggestions, suggestions, language } = useUI();

  if (!showSuggestions) return null;

  return (
    <div className="fixed top-20 right-6 w-80 z-[60] animate-in slide-in-from-right duration-300">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {language === 'pt' ? 'Sugestões da IA' : 'AI Suggestions'}
            </span>
          </div>
          <button 
            onClick={() => setShowSuggestions(false)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* List */}
        <div className="max-h-[70vh] overflow-y-auto p-4 space-y-3">
          {suggestions.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-50" />
              <p className="text-xs text-gray-400 italic">
                {language === 'pt' ? 'Tudo limpo! Sua arquitetura está sólida.' : 'All clean! Your architecture is solid.'}
              </p>
            </div>
          ) : (
            suggestions.map((s) => (
              <div 
                key={s.id}
                className="group relative p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-transparent hover:border-blue-500/30 transition-all hover:bg-white dark:hover:bg-gray-800"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-1.5 rounded-lg ${
                    s.type === 'security' ? 'bg-red-100 text-red-600' :
                    s.type === 'optimization' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {s.type === 'security' ? <AlertTriangle className="w-3.5 h-3.5" /> : 
                     s.type === 'optimization' ? <Zap className="w-3.5 h-3.5" /> : 
                     <Rocket className="w-3.5 h-3.5" />}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    s.impact === 'high' ? 'bg-red-500/10 text-red-500' :
                    s.impact === 'medium' ? 'bg-yellow-500/10 text-yellow-500' :
                    'bg-blue-500/10 text-blue-500'
                  }`}>
                    {s.impact.toUpperCase()}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-500 transition-colors">
                  {s.title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3">
                  {s.description}
                </p>
                <button className="w-full flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600 hover:border-blue-500 text-[10px] font-bold text-gray-600 dark:text-gray-300 transition-all">
                  <span>{s.actionLabel}</span>
                  <ChevronRight className="w-3 h-3 text-gray-400" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-800">
          <p className="text-[9px] text-center text-gray-400 uppercase tracking-widest font-bold">
            Analysis active • v2.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuggestionsPanel;
