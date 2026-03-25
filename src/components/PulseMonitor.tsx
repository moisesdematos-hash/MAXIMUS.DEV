import React, { useState, useEffect } from 'react';
import { Activity, Shield, Globe, Zap, X, ChevronRight, AlertCircle, TrendingUp, Info } from 'lucide-react';

interface PulseData {
  performance: number;
  seo: number;
  accessibility: number;
  bestPractices: number;
  timestamp: number;
}

interface PulseMonitorProps {
  isOpen: boolean;
  onClose: () => void;
  data: PulseData;
  code: string;
}

const PulseMonitor: React.FC<PulseMonitorProps> = ({ isOpen, onClose, data, code }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'details'>('overview');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  if (!isOpen && !isVisible) return null;

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500';
    if (score >= 50) return 'text-orange-500';
    return 'text-red-500';
  };

  const getStrokeColor = (score: number) => {
    if (score >= 90) return '#10b981';
    if (score >= 50) return '#f97316';
    return '#ef4444';
  };

  const CircularScore = ({ score, label, icon: Icon }: { score: number, label: string, icon: any }) => {
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
      <div className="flex flex-col items-center group">
        <div className="relative w-24 h-24 mb-4">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              className="text-white/5"
            />
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke={getStrokeColor(score)}
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Icon className={`w-4 h-4 mb-1 ${getScoreColor(score)} opacity-70`} />
            <span className="text-xl font-black tracking-tighter">{score}</span>
          </div>
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white/80 transition-colors">
          {label}
        </span>
      </div>
    );
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className={`relative w-full max-w-2xl bg-zinc-950/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl transition-transform duration-500 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}>
        
        {/* Animated Glow */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full animate-pulse [animation-delay:2s]" />

        <div className="relative p-10">
          <header className="flex justify-between items-center mb-10">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                <Zap className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tighter italic">MAXIMUS.PULSE</h2>
                <p className="text-[10px] text-white/40 uppercase font-black flex items-center">
                  Live Neural Analysis <span className="mx-2 opacity-50">•</span> v2.4 Engine
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white">
              <X size={24} />
            </button>
          </header>

          <div className="grid grid-cols-4 gap-4 mb-10 p-8 bg-white/5 rounded-[2rem] border border-white/5">
            <CircularScore score={data.performance} label="Performance" icon={Activity} />
            <CircularScore score={data.seo} label="SEO" icon={Globe} />
            <CircularScore score={data.accessibility} label="Access" icon={Shield} />
            <CircularScore score={data.bestPractices} label="Practices" icon={AlertCircle} />
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-white/50 mb-4 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Sugestões da IA Neural
            </h3>
            
            <div className="grid grid-cols-1 gap-3">
              {activeTab === 'overview' ? (
                <>
                  {[
                    { type: 'perf', msg: `Otimizar renderização (Código: ${code.length} chars)`, priority: 'High' },
                    { type: 'seo', msg: 'Adicionar tags Canonical para evitar conteúdo duplicado.', priority: 'Medium' },
                    { type: 'access', msg: 'Aprimorar contraste de cores em elementos de navegação.', priority: 'Medium' }
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all cursor-pointer group">
                      <div className="flex items-center space-x-4">
                        <div className={`w-2 h-2 rounded-full ${s.priority === 'High' ? 'bg-red-500' : 'bg-orange-500'} animate-pulse`} />
                        <span className="text-sm font-medium text-white/80">{s.msg}</span>
                      </div>
                      <ChevronRight size={18} className="text-white/20 group-hover:text-emerald-500 transition-colors" />
                    </div>
                  ))}
                </>
              ) : (
                <div className="p-8 text-center text-white/20 italic text-xs">
                  Análise detalhada indisponível no momento.
                </div>
              )}
            </div>
          </div>

          <footer className="mt-10 pt-8 border-t border-white/5 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/30">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setActiveTab(activeTab === 'overview' ? 'details' : 'overview')}
                className="flex items-center hover:text-white transition-colors"
              >
                <Info size={12} className="mr-1" /> View {activeTab === 'overview' ? 'Details' : 'Overview'}
              </button>
            </div>
            <button className="text-emerald-500 hover:text-emerald-400 transition-colors">Ver Relatório Completo</button>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default PulseMonitor;
