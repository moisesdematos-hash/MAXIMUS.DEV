import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Sparkles, 
  Zap, 
  CheckCircle, 
  AlertCircle, 
  Code, 
  Lightbulb,
  Target,
  Rocket,
  X,
  Settings,
  Activity
} from 'lucide-react';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  prompt?: string;
  onOptimizedPrompt?: (optimizedPrompt: string) => void;
}

interface AICapability {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'active' | 'processing' | 'inactive';
  confidence: number;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ 
  isOpen, 
  onClose, 
  prompt = '', 
  onOptimizedPrompt 
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [optimizedPrompt, setOptimizedPrompt] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [aiCapabilities, setAiCapabilities] = useState<AICapability[]>([
    {
      id: 'code-generation',
      name: 'Geração de Código',
      description: 'IA gerando código otimizado baseado em seus requisitos',
      icon: <Code className="w-4 h-4" />,
      status: 'active',
      confidence: 95
    },
    {
      id: 'prompt-optimization',
      name: 'Otimização de Prompts',
      description: 'Melhorando clareza e especificidade dos seus prompts',
      icon: <Lightbulb className="w-4 h-4" />,
      status: 'active',
      confidence: 88
    },
    {
      id: 'architecture-analysis',
      name: 'Análise de Arquitetura',
      description: 'Sugerindo melhores práticas e padrões de design',
      icon: <Target className="w-4 h-4" />,
      status: 'processing',
      confidence: 92
    },
    {
      id: 'performance-optimization',
      name: 'Otimização de Performance',
      description: 'Identificando gargalos e sugerindo melhorias',
      icon: <Zap className="w-4 h-4" />,
      status: 'active',
      confidence: 90
    },
    {
      id: 'predictive-analytics',
      name: 'Análise Preditiva',
      description: 'Prevendo tendências e comportamentos futuros',
      icon: <Target className="w-4 h-4" />,
      status: 'active',
      confidence: 94
    }
  ]);

  useEffect(() => {
    if (isOpen && prompt) {
      analyzePrompt();
    }
  }, [isOpen, prompt]);

  const analyzePrompt = async () => {
    setIsAnalyzing(true);
    setAnalysisComplete(false);

    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate optimized prompt
    const optimized = generateOptimizedPrompt(prompt);
    setOptimizedPrompt(optimized);

    // Generate suggestions
    const newSuggestions = generateSuggestions(prompt);
    setSuggestions(newSuggestions);

    // Update capabilities status
    setAiCapabilities(prev => prev.map(cap => ({
      ...cap,
      status: Math.random() > 0.3 ? 'active' : 'processing',
      confidence: Math.floor(Math.random() * 20) + 80
    })));

    setIsAnalyzing(false);
    setAnalysisComplete(true);
  };

  const generateOptimizedPrompt = (originalPrompt: string): string => {
    if (!originalPrompt) return '';

    const optimizations = [
      `🎯 **Objetivo Claro**: ${originalPrompt}`,
      '',
      '📋 **Especificações Técnicas**:',
      '- Framework: React + TypeScript',
      '- Styling: Tailwind CSS',
      '- Responsividade: Mobile-first',
      '- Acessibilidade: WCAG 2.1 AA',
      '',
      '🎨 **Design Requirements**:',
      '- Interface moderna e limpa',
      '- Animações suaves (Framer Motion)',
      '- Dark mode support',
      '- Componentes reutilizáveis',
      '',
      '⚡ **Performance**:',
      '- Lazy loading de componentes',
      '- Otimização de imagens',
      '- Bundle splitting',
      '- SEO otimizado',
      '',
      '🔧 **Funcionalidades Extras**:',
      '- Estados de loading',
      '- Tratamento de erros',
      '- Validação de formulários',
      '- Testes unitários'
    ].join('\n');

    return optimizations;
  };

  const generateSuggestions = (prompt: string): string[] => {
    const baseSuggestions = [
      '🚀 Adicionar animações de entrada para melhor UX',
      '📱 Implementar design responsivo para todos os dispositivos',
      '🎨 Usar sistema de cores consistente com tokens de design',
      '⚡ Otimizar performance com React.memo e useMemo',
      '🔒 Implementar validação robusta de dados',
      '🌙 Adicionar suporte a tema escuro',
      '♿ Garantir acessibilidade com ARIA labels',
      '🧪 Incluir testes automatizados para componentes críticos'
    ];

    // Customize suggestions based on prompt content
    if (prompt.toLowerCase().includes('dashboard')) {
      baseSuggestions.unshift('📊 Implementar gráficos interativos com Chart.js');
      baseSuggestions.unshift('🔄 Adicionar refresh automático de dados');
    }

    if (prompt.toLowerCase().includes('form')) {
      baseSuggestions.unshift('✅ Implementar validação em tempo real');
      baseSuggestions.unshift('💾 Adicionar auto-save de rascunhos');
    }

    return baseSuggestions.slice(0, 6);
  };

  const handleUseOptimizedPrompt = () => {
    if (onOptimizedPrompt && optimizedPrompt) {
      onOptimizedPrompt(optimizedPrompt);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-[800px] h-[700px] shadow-xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  🤖 IA Assistente
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Otimizando seu prompt com inteligência artificial
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* AI Status */}
        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-800 dark:text-white">
                  IA Ativa
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {isAnalyzing ? 'Analisando...' : analysisComplete ? 'Análise Completa' : 'Pronto'}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-purple-600" />
              <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                Neural Network v2.1
              </span>
            </div>
          </div>
        </div>

        {/* AI Capabilities */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-800 dark:text-white mb-3">
            Capacidades da IA
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {aiCapabilities.map((capability) => (
              <div
                key={capability.id}
                className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  capability.status === 'active' 
                    ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                    : capability.status === 'processing'
                    ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400'
                    : 'bg-gray-100 dark:bg-gray-600 text-gray-400'
                }`}>
                  {capability.status === 'processing' ? (
                    <div className="animate-spin">{capability.icon}</div>
                  ) : (
                    capability.icon
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                    {capability.name}
                  </p>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-1">
                      <div 
                        className="bg-purple-600 h-1 rounded-full transition-all duration-500"
                        style={{ width: `${capability.confidence}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {capability.confidence}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                <Brain className="w-8 h-8 text-white animate-pulse" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                IA Analisando seu Prompt
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
                Processando requisitos e gerando otimizações...
              </p>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          ) : analysisComplete ? (
            <div className="space-y-6">
              {/* Optimized Prompt */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Prompt Otimizado pela IA
                  </h3>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border-l-4 border-purple-500">
                  <pre className="text-sm text-gray-800 dark:text-white whitespace-pre-wrap font-mono">
                    {optimizedPrompt}
                  </pre>
                </div>
              </div>

              {/* AI Suggestions */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Sugestões Inteligentes
                  </h3>
                </div>
                <div className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900 rounded-lg"
                    >
                      <CheckCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-800 dark:text-white">
                        {suggestion}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <Brain className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                IA Pronta para Análise
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Envie um prompt para que a IA possa otimizá-lo
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {analysisComplete && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <Rocket className="w-4 h-4" />
                <span>IA processou {prompt.length} caracteres em 2.3s</span>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUseOptimizedPrompt}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-200 flex items-center space-x-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Usar Prompt Otimizado</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;