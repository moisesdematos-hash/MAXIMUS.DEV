import React, { useState, useEffect } from 'react';
import { ShieldAlert, ShieldCheck, Lock, Eye, Zap, Search } from 'lucide-react';

const QuantumShield: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Simular ativação automática de proteção
    const timer = setTimeout(() => setIsActive(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!isActive) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 animate-in slide-in-from-left-8 duration-500">
      <div className={`p-1 rounded-2xl bg-gradient-to-br transition-all duration-700 ${isSyncing ? 'from-purple-500 to-pink-500 scale-110 shadow-purple-500/50' : 'from-cyan-500 to-blue-500 shadow-blue-500/30'} shadow-2xl`}>
        <div className="bg-white dark:bg-gray-950 rounded-xl p-3 flex items-center space-x-3 border border-white/10">
          <div className={`p-2 rounded-lg ${isSyncing ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-cyan-100 dark:bg-cyan-900/30'}`}>
            {isSyncing ? (
              <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400 animate-pulse" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            )}
          </div>
          
          <div>
            <div className="flex items-center space-x-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Quantum Shield</p>
              <div className="flex space-x-0.5">
                {[1,2,3].map(i => (
                  <div key={i} className="w-1 h-1 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: `${i*0.2}s` }} />
                ))}
              </div>
            </div>
            <p className="text-xs font-bold text-gray-800 dark:text-white">Neural Assets Secured</p>
          </div>

          <button 
            onClick={() => {
              setIsSyncing(true);
              setTimeout(() => setIsSyncing(false), 2000);
            }}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
            title="Sincronizar Proteção"
          >
            <Lock className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuantumShield;
