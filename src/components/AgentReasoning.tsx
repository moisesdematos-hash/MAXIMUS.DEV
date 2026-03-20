import React, { useState, useEffect, useRef } from 'react';
import { Brain, Terminal, Activity, Cpu, Sparkles } from 'lucide-react';

interface Thought {
  id: string;
  text: string;
  type: 'action' | 'analysis' | 'decision' | 'success';
  timestamp: string;
}

interface AgentReasoningProps {
  agentName: string;
  isActive: boolean;
  onComplete?: () => void;
}

const AgentReasoning: React.FC<AgentReasoningProps> = ({ agentName, isActive, onComplete }) => {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const steps = [
    { text: `Inicializando ${agentName}...`, type: 'action' },
    { text: 'Analisando contexto do projeto e código atual...', type: 'analysis' },
    { text: 'Identificando padrões de design e dependências...', type: 'analysis' },
    { text: 'Gerando estratégia de implementação otimizada...', type: 'decision' },
    { text: 'Validando consistência arquitetural...', type: 'analysis' },
    { text: 'Finalizando geração de código...', type: 'success' }
  ];

  useEffect(() => {
    if (isActive && currentStep < steps.length) {
      const timer = setTimeout(() => {
        const newThought: Thought = {
          id: Math.random().toString(36).substring(2, 9),
          text: steps[currentStep].text,
          type: steps[currentStep].type as any,
          timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
        };
        setThoughts(prev => [...prev, newThought]);
        setCurrentStep(prev => prev + 1);
      }, 800 + Math.random() * 1200);

      return () => clearTimeout(timer);
    } else if (isActive && currentStep === steps.length) {
      onComplete?.();
    }
  }, [isActive, currentStep]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [thoughts]);

  if (!isActive && thoughts.length === 0) return null;

  return (
    <div className="bg-gray-900/90 backdrop-blur-md border border-blue-500/30 rounded-lg overflow-hidden flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="bg-blue-600/20 border-b border-blue-500/30 p-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Brain className="w-5 h-5 text-blue-400" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          </div>
          <span className="text-sm font-bold text-blue-100 tracking-wider">REASONING ENGINE: {agentName.toUpperCase()}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-[10px] text-emerald-400 font-mono">LIVE_STREAM</span>
        </div>
      </div>

      {/* Terminal Area */}
      <div 
        ref={scrollRef}
        className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-3 custom-scrollbar"
      >
        {thoughts.map((thought, idx) => (
          <div 
            key={thought.id} 
            className={`flex items-start space-x-2 animate-in fade-in slide-in-from-left-2 duration-300 ${
              idx === thoughts.length - 1 ? 'border-l-2 border-blue-500 pl-2' : 'opacity-70'
            }`}
          >
            <span className="text-gray-500 whitespace-nowrap">[{thought.timestamp}]</span>
            <span className={
              thought.type === 'action' ? 'text-blue-400' :
              thought.type === 'analysis' ? 'text-cyan-400' :
              thought.type === 'decision' ? 'text-purple-400' :
              'text-emerald-400'
            }>
              {thought.type === 'success' ? '✓' : '>'}
            </span>
            <span className="text-gray-300 leading-relaxed">{thought.text}</span>
          </div>
        ))}
        {isActive && currentStep < steps.length && (
          <div className="flex items-center space-x-1 text-blue-400 ml-12">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="bg-black/40 p-2 flex items-center justify-between text-[10px] font-mono text-gray-500">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1">
            <Cpu className="w-3 h-3" />
            <span>NEURAL_LOAD: 42%</span>
          </span>
          <span className="flex items-center space-x-1">
            <Sparkles className="w-3 h-3" />
            <span>PATTERN_MATCH: HIGH</span>
          </span>
        </div>
        <div className="flex items-center space-x-1 text-blue-500/50">
          <Terminal className="w-3 h-3" />
          <span>v2.4.0-STABLE</span>
        </div>
      </div>
    </div>
  );
};

export default AgentReasoning;
