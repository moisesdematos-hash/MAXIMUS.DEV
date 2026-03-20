import React, { useState, useEffect } from 'react';
import { Clock, Rewind, FastForward, Play, Pause, Save, RotateCcw, Zap } from 'lucide-react';
import { useUI } from '../contexts/UIContext';
import { TimeTravelAgent, StateSnapshot } from '../lib/timeTravelAgent';

const TimeScrubber: React.FC = () => {
  const { language, showTimeTravel, setShowTimeTravel } = useUI();
  const [history, setHistory] = useState<StateSnapshot[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isReplaying, setIsReplaying] = useState(false);

  useEffect(() => {
    const agent = TimeTravelAgent.getInstance();
    setHistory(agent.getHistory());
  }, []);

  if (!showTimeTravel) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl border-t border-blue-500/20 z-[70] animate-in slide-in-from-bottom duration-500">
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center space-x-8">
        {/* Controls */}
        <div className="flex items-center space-x-4">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-blue-500 uppercase mb-1">Temporal Shift</span>
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-xl shadow-inner">
              <button 
                className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-all text-gray-500"
                onClick={() => setCurrentIndex(Math.min(history.length - 1, currentIndex + 1))}
              >
                <Rewind className="w-4 h-4" />
              </button>
              <button 
                className="p-3 bg-blue-600 text-white rounded-lg shadow-lg shadow-blue-500/30 hover:scale-110 active:scale-95 transition-all"
                onClick={() => setIsReplaying(!isReplaying)}
              >
                {isReplaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              </button>
              <button 
                className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-all text-gray-500"
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              >
                <FastForward className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="relative h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden mb-4 shadow-inner">
            <div 
              className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"
              style={{ width: `${(currentIndex / Math.max(1, history.length - 1)) * 100}%` }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/30 blur-sm animate-pulse" />
            </div>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <span>{language === 'pt' ? 'Gênese do Projeto' : 'Project Genesis'}</span>
            <span className="text-blue-500">{history[currentIndex]?.timestamp.toLocaleTimeString() || 'LIVE'}</span>
            <span>{language === 'pt' ? 'Estado Atual' : 'Present State'}</span>
          </div>
        </div>

        {/* Snapshot Info */}
        <div className="w-64 bg-blue-500/5 dark:bg-blue-500/10 rounded-2xl p-3 border border-blue-500/20">
          <div className="flex items-center space-x-2 mb-1">
            <Clock className="w-3 h-3 text-blue-500" />
            <span className="text-[10px] font-bold text-gray-900 dark:text-white">Neural Snapshot</span>
          </div>
          <p className="text-[9px] text-gray-500 dark:text-gray-400 line-clamp-2 italic leading-tight">
            "{history[currentIndex]?.description || 'Monitoramento em tempo real ativo...'}"
          </p>
        </div>

        {/* Close */}
        <button 
          onClick={() => setShowTimeTravel(false)}
          className="p-2 hover:bg-red-500/10 text-gray-400 hover:text-red-500 rounded-full transition-all"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default TimeScrubber;
