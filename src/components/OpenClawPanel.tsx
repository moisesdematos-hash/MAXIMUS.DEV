import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Activity, 
  Cpu, 
  Database, 
  ShieldCheck, 
  FileCode,
  Zap,
  Clock
} from 'lucide-react';
import { useUI } from '../contexts/UIContext';

interface LogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'thought' | 'action';
  message: string;
  details?: string;
}

const OpenClawPanel: React.FC = () => {
  const { openClawStatus, setOpenClawStatus, credits } = useUI();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  // Simulated logs for demonstration
  useEffect(() => {
    if (openClawStatus === 'busy') {
      const demoLogs: LogEntry[] = [
        { id: '1', timestamp: '14:20:01', type: 'info', message: 'Iniciando OpenClaw Runtime v1.2.4...' },
        { id: '2', timestamp: '14:20:02', type: 'success', message: 'Conectado ao Gateway: http://localhost:3000' },
        { id: '3', timestamp: '14:20:03', type: 'action', message: 'Analisando estrutura do projeto Maximus.DEV' },
        { id: '4', timestamp: '14:20:05', type: 'thought', message: 'Identificando pontos de otimização no hook useMultiAgent' },
        { id: '5', timestamp: '14:20:08', type: 'info', message: 'Lendo 12 arquivos de contexto...' },
        { id: '6', timestamp: '14:20:10', type: 'action', message: 'Implementando melhorias de performance via useCallback' },
        { id: '7', timestamp: '14:20:12', type: 'warning', message: 'Loop de renderização detectado em PresenceAvatars.tsx' },
        { id: '8', timestamp: '14:20:13', type: 'action', message: 'Aplicando correção de dependências em useEffect' },
      ];

      setActiveTask('Otimização de Performance e Estabilidade');
      
      let i = 0;
      const interval = setInterval(() => {
        if (i < demoLogs.length) {
          setLogs(prev => [...prev, demoLogs[i]]);
          setProgress((prev) => Math.min(prev + (100 / demoLogs.length), 100));
          i++;
        } else {
          clearInterval(interval);
        }
      }, 1500);

      return () => clearInterval(interval);
    } else {
      setLogs([]);
      setActiveTask(null);
      setProgress(0);
    }
  }, [openClawStatus]);

  const toggleAgent = () => {
    if (openClawStatus === 'offline') {
      setOpenClawStatus('online');
      setTimeout(() => setOpenClawStatus('busy'), 1000);
    } else {
      setOpenClawStatus('offline');
    }
  };

  const getLogTypeColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'success': return 'text-emerald-500';
      case 'warning': return 'text-amber-500';
      case 'error': return 'text-rose-500';
      case 'thought': return 'text-purple-400 italic';
      case 'action': return 'text-blue-400 font-bold';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-950 text-gray-300 font-mono text-xs border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full animate-pulse ${
            openClawStatus === 'busy' ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 
            openClawStatus === 'online' ? 'bg-emerald-500' : 'bg-gray-600'
          }`} />
          <h2 className="text-[10px] font-bold uppercase tracking-widest flex items-center space-x-2">
            <Terminal className="w-3.5 h-3.5" />
            <span>OpenClaw Autonomous Monitor</span>
          </h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="px-2 py-0.5 bg-gray-800 rounded text-[9px] border border-gray-700">
            PID: 14592
          </div>
          <button 
            onClick={toggleAgent}
            className={`px-3 py-1 rounded transition-all text-[9px] font-bold uppercase ${
              openClawStatus === 'offline' 
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                : 'bg-rose-600/20 hover:bg-rose-600/40 text-rose-500 border border-rose-500/50'
            }`}
          >
            {openClawStatus === 'offline' ? 'Iniciar Agente' : 'Interromper'}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Logs Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
            {logs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-30 space-y-4">
                <Activity className="w-12 h-12 animate-pulse" />
                <p className="text-sm">Aguardando inicialização do agente...</p>
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="flex space-x-3 group hover:bg-white/5 transition-colors leading-relaxed">
                  <span className="text-gray-600 whitespace-nowrap">[{log.timestamp}]</span>
                  <span className={`whitespace-pre-wrap ${getLogTypeColor(log.type)}`}>
                    {log.type === 'thought' && '💭 '}
                    {log.type === 'action' && '⚙️ '}
                    {log.message}
                  </span>
                </div>
              ))
            )}
            <div ref={logsEndRef} />
          </div>

          {/* Progress Bar (Bottom of Logs) */}
          {activeTask && (
            <div className="px-4 py-3 bg-gray-900/50 border-t border-gray-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[9px] text-gray-500 truncate mr-4">TARFA ATUAL: {activeTask}</span>
                <span className="text-[9px] text-orange-400 font-bold">{Math.round(progress)}%</span>
              </div>
              <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange-500 transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="w-48 bg-gray-900 border-l border-gray-800 p-4 space-y-6 hidden md:block">
          {/* Stats Section */}
          <div className="space-y-3">
            <h3 className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">Performance</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-gray-400 flex items-center">
                  <Cpu className="w-3 h-3 mr-1" /> CPU
                </span>
                <span className="text-[10px] text-white">4.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-gray-400 flex items-center">
                  <Database className="w-3 h-3 mr-1" /> RAM
                </span>
                <span className="text-[10px] text-white">124MB</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-gray-400 flex items-center">
                  <Zap className="w-3 h-3 mr-1" /> Tokens
                </span>
                <span className="text-[10px] text-orange-400">1.2k/s</span>
              </div>
            </div>
          </div>

          {/* Credits Section */}
          <div className="space-y-3 pt-4 border-t border-gray-800">
            <h3 className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">Recursos</h3>
            <div className="p-2 bg-orange-500/10 rounded border border-orange-500/20 text-center">
              <span className="text-orange-400 font-bold text-lg">{credits.toLocaleString()}</span>
              <p className="text-[8px] text-orange-500 uppercase font-bold">Créditos Disponíveis</p>
            </div>
          </div>

          {/* Context Section */}
          <div className="space-y-3 pt-4 border-t border-gray-800">
            <h3 className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">Contexto Ativo</h3>
            <div className="space-y-1">
              <div className="flex items-center space-x-1 text-[9px] text-emerald-500">
                <ShieldCheck className="w-2.5 h-2.5" />
                <span>Mode: Standard</span>
              </div>
              <div className="flex items-center space-x-1 text-[9px] text-blue-400">
                <FileCode className="w-2.5 h-2.5" />
                <span>Files: 42</span>
              </div>
              <div className="flex items-center space-x-1 text-[9px] text-gray-500">
                <Clock className="w-2.5 h-2.5" />
                <span>Session: 14m</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenClawPanel;
