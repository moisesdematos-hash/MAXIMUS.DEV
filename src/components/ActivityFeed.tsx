import React from 'react';
import { useUI } from '../contexts/UIContext';
import { Clock, Zap, MessageSquare } from 'lucide-react';

const ActivityFeed: React.FC = () => {
  const { activities, language } = useUI();

  if (activities.length === 0) return null;

  return (
    <div className="fixed bottom-24 right-8 w-72 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-right duration-500 z-40">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 flex items-center">
          <Clock className="w-3 h-3 mr-2" />
          {language === 'pt' ? 'Atividade Recente' : 'Recent Activity'}
        </h3>
        <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
      </div>
      
      <div className="max-h-64 overflow-y-auto p-2 space-y-2 scrollbar-hide">
        {activities.map((activity) => (
          <div 
            key={activity.id}
            className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700/50 flex items-start space-x-3 transition-all hover:border-blue-500/30"
          >
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-900 dark:text-white leading-tight mb-1">
                {activity.action}
              </p>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500">
                  {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="text-[10px] text-gray-300 dark:text-gray-600">•</span>
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">
                  AGENT LOG
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-3 bg-gray-50 dark:bg-gray-800/30 border-t border-gray-200 dark:border-gray-800 text-center">
        <button className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline uppercase tracking-widest">
          {language === 'pt' ? 'Ver histórico completo' : 'View full history'}
        </button>
      </div>
    </div>
  );
};

export default ActivityFeed;
