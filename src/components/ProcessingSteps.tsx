import React, { useState, useEffect } from 'react';
import { Brain, Palette, Package, Wrench, CheckCircle, Clock } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'pending' | 'processing' | 'completed';
}

const ProcessingSteps: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([
    {
      id: '1',
      title: '🤖 Análise IA do Prompt',
      description: 'IA interpretando requisitos e contexto',
      icon: <Brain className="w-4 h-4" />,
      status: 'processing',
    },
    {
      id: '2',
      title: '🎯 Auto-scaling Inteligente',
      description: 'IA configurando escalabilidade automática',
      icon: <Palette className="w-4 h-4" />,
      status: 'pending',
    },
    {
      id: '3',
      title: '🤖 Auto-Conectando Serviços',
      description: 'IA conectando Supabase, GitHub, Stripe, OpenAI automaticamente',
      icon: <Package className="w-4 h-4" />,
      status: 'pending',
    },
    {
      id: '4',
      title: '🗄️ Configuração Database IA',
      description: 'IA configurando banco de dados otimizado',
      icon: <Package className="w-4 h-4" />,
      status: 'pending',
    },
    {
      id: '5',
      title: '⚡ Geração de Código IA',
      description: 'IA implementando funcionalidades otimizadas',
      icon: <Package className="w-4 h-4" />,
      status: 'pending',
    },
    {
      id: '6',
      title: '🔍 Análise e Correção IA',
      description: 'IA analisando qualidade, performance e segurança',
      icon: <Wrench className="w-4 h-4" />,
      status: 'pending',
    },
    {
      id: '7',
      title: '🔮 Análise Preditiva IA',
      description: 'IA prevendo performance e otimizações futuras',
      icon: <Wrench className="w-4 h-4" />,
      status: 'pending',
    },
    {
      id: '8',
      title: '🔄 Deploy Zero-Config',
      description: 'Preparando deploy automático',
      icon: <Wrench className="w-4 h-4" />,
      status: 'pending',
    },
  ]);

  const [progress, setProgress] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setSteps(prevSteps => {
        const newSteps = [...prevSteps];
        const processingIndex = newSteps.findIndex(step => step.status === 'processing');
        const pendingIndex = newSteps.findIndex(step => step.status === 'pending');

        if (processingIndex !== -1) {
          // Complete current processing step
          newSteps[processingIndex].status = 'completed';
          
          // Start next pending step
          if (pendingIndex !== -1) {
            newSteps[pendingIndex].status = 'processing';
          }
        }

        return newSteps;
      });

    }, 1200); // Even faster processing for better UX

    return () => clearInterval(progressTimer);
  }, []);

  useEffect(() => {
    const completed = steps.filter(s => s.status === 'completed').length;
    setProgress(Math.min((completed / steps.length) * 100, 100));
  }, [steps]);

  useEffect(() => {
    // Smooth progress animation
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const completed = steps.filter(s => s.status === 'completed').length;
        const target = (completed / steps.length) * 100;
        if (prev < target) {
          return Math.min(prev + 2, target);
        }
        return prev;
      });
    }, 50);

    return () => clearInterval(progressTimer);
  }, [steps]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const completedSteps = steps.filter(s => s.status === 'completed').length;
  const estimatedTimeLeft = Math.max(0, (steps.length - completedSteps) * 2);

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-800 dark:text-white">Processamento Inteligente</h3>
        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{formatTime(timeElapsed)}</span>
          </div>
          <span>~{estimatedTimeLeft}s restantes</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
          <span>Progresso</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              step.status === 'completed' 
                ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' 
                : step.status === 'processing'
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                : 'bg-gray-100 dark:bg-gray-600 text-gray-400'
            }`}>
              {step.status === 'completed' ? (
                <CheckCircle className="w-4 h-4" />
              ) : step.status === 'processing' ? (
                <div className="animate-spin">{step.icon}</div>
              ) : (
                step.icon
              )}
            </div>
            
            <div className="flex-1">
              <p className={`font-medium text-sm ${
                step.status === 'completed' 
                  ? 'text-green-800 dark:text-green-300' 
                  : step.status === 'processing'
                  ? 'text-blue-800 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                {step.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{step.description}</p>
            </div>

            {step.status === 'processing' && (
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" />
                <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProcessingSteps;