import React, { useState } from 'react';
import { 
  X, 
  Database, 
  Github, 
  CreditCard, 
  Zap, 
  Brain, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  Key,
  Settings,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  Shield,
  Globe,
  Code,
  Webhook,
  Link,
  Activity,
  Star,
  Crown,
  Sparkles,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

interface IntegrationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'connected' | 'disconnected' | 'connecting' | 'error';
  category: 'database' | 'payments' | 'ai' | 'deployment' | 'version-control';
  features: string[];
  setupTime: string;
  pricing: string;
  color: string;
}

const IntegrationsModal: React.FC<IntegrationsModalProps> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isConnecting, setIsConnecting] = useState<string>('');
  const [showApiKeys, setShowApiKeys] = useState<string>('');
  const [isAutoConnecting, setIsAutoConnecting] = useState<boolean>(false);
  const [categoryHistory, setCategoryHistory] = useState<string[]>(['all']);
  const [categoryHistoryIndex, setCategoryHistoryIndex] = useState(0);

  const navigateToCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    
    // Update history
    const newHistory = categoryHistory.slice(0, categoryHistoryIndex + 1);
    newHistory.push(categoryId);
    setCategoryHistory(newHistory);
    setCategoryHistoryIndex(newHistory.length - 1);
  };

  const goBackCategory = () => {
    if (categoryHistoryIndex > 0) {
      const newIndex = categoryHistoryIndex - 1;
      setCategoryHistoryIndex(newIndex);
      setSelectedCategory(categoryHistory[newIndex]);
    }
  };

  const goForwardCategory = () => {
    if (categoryHistoryIndex < categoryHistory.length - 1) {
      const newIndex = categoryHistoryIndex + 1;
      setCategoryHistoryIndex(newIndex);
      setSelectedCategory(categoryHistory[newIndex]);
    }
  };

  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'supabase',
      name: 'Supabase',
      description: 'Backend-as-a-Service com PostgreSQL, Auth e Storage',
      icon: <Database className="w-6 h-6" />,
      status: 'disconnected',
      category: 'database',
      features: ['PostgreSQL', 'Authentication', 'Real-time', 'Storage', 'Edge Functions'],
      setupTime: '2 min',
      pricing: 'Gratuito até 500MB',
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'github',
      name: 'GitHub',
      description: 'Controle de versão e colaboração de código',
      icon: <Github className="w-6 h-6" />,
      status: 'disconnected',
      category: 'version-control',
      features: ['Git Repository', 'CI/CD', 'Issues', 'Pull Requests', 'Actions'],
      setupTime: '1 min',
      pricing: 'Gratuito para públicos',
      color: 'from-gray-700 to-gray-900'
    },
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Plataforma de pagamentos online completa',
      icon: <CreditCard className="w-6 h-6" />,
      status: 'disconnected',
      category: 'payments',
      features: ['Cartões', 'PIX', 'Boleto', 'Webhooks', 'Dashboard'],
      setupTime: '3 min',
      pricing: '2.9% + R$0,30 por transação',
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 'lemonsqueezy',
      name: 'Lemon Squeezy',
      description: 'Plataforma de pagamentos para produtos digitais',
      icon: <Zap className="w-6 h-6" />,
      status: 'disconnected',
      category: 'payments',
      features: ['Produtos Digitais', 'Assinaturas', 'Afiliados', 'Analytics', 'Tax Handling'],
      setupTime: '2 min',
      pricing: '5% + taxas do processador',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      id: 'openai',
      name: 'OpenAI',
      description: 'API de Inteligência Artificial GPT-4 e DALL-E',
      icon: <Brain className="w-6 h-6" />,
      status: 'disconnected',
      category: 'ai',
      features: ['GPT-4', 'DALL-E 3', 'Whisper', 'Embeddings', 'Fine-tuning'],
      setupTime: '1 min',
      pricing: 'Pay-per-use a partir de $0.002/1K tokens',
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'vercel',
      name: 'Vercel',
      description: 'Plataforma de deploy para aplicações modernas',
      icon: <Zap className="w-6 h-6" />,
      status: 'disconnected',
      category: 'deployment',
      features: ['Edge Functions', 'Auto Deploy', 'Analytics', 'Preview URLs', 'Custom Domains'],
      setupTime: '2 min',
      pricing: 'Gratuito até 100GB bandwidth',
      color: 'from-black to-gray-800'
    },
    {
      id: 'netlify',
      name: 'Netlify',
      description: 'Deploy e hospedagem com CI/CD integrado',
      icon: <Globe className="w-6 h-6" />,
      status: 'disconnected',
      category: 'deployment',
      features: ['CI/CD', 'Serverless Functions', 'Forms', 'Split Testing', 'Analytics'],
      setupTime: '2 min',
      pricing: 'Gratuito até 100GB bandwidth',
      color: 'from-teal-500 to-cyan-600'
    },
    {
      id: 'render',
      name: 'Render',
      description: 'Plataforma cloud unificada para apps e sites',
      icon: <Activity className="w-6 h-6" />,
      status: 'disconnected',
      category: 'deployment',
      features: ['Auto Deploy', 'PostgreSQL', 'Redis', 'Cron Jobs', 'Docker Support'],
      setupTime: '3 min',
      pricing: 'Gratuito para sites estáticos',
      color: 'from-indigo-500 to-blue-600'
    }
  ]);

  const categories = [
    { id: 'all', label: 'Todas', icon: Globe },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'payments', label: 'Pagamentos', icon: CreditCard },
    { id: 'ai', label: 'IA', icon: Brain },
    { id: 'version-control', label: 'Git', icon: Github },
    { id: 'deployment', label: 'Deploy', icon: Zap }
  ];

  const filteredIntegrations = selectedCategory === 'all' 
    ? integrations 
    : integrations.filter(integration => integration.category === selectedCategory);

  const handleConnect = async (integrationId: string, mode: 'manual' | 'automatic' = 'manual') => {
    setIsConnecting(integrationId);
    
    const integration = integrations.find(i => i.id === integrationId);
    
    if (mode === 'automatic') {
      // IA Automatic connection
      const steps = [
        `🤖 IA detectando ${integration?.name}...`,
        '🔍 Analisando credenciais no ambiente...',
        '🔐 Configurando autenticação automática...',
        '⚙️ IA aplicando configurações otimizadas...',
        '⚡ Testando conexão inteligente...',
        '✅ Conexão automática estabelecida!'
      ];
      
      for (let i = 0; i < steps.length; i++) {
        console.log(steps[i]);
        await new Promise(resolve => setTimeout(resolve, 800));
      }
    } else {
      // Manual connection
      const steps = [
        'Verificando credenciais...',
        'Configurando webhooks...',
        'Testando conexão...',
        'Aplicando configurações...',
        'Conexão estabelecida!'
      ];
      
      for (let i = 0; i < steps.length; i++) {
        console.log(`${integration?.name}: ${steps[i]}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // Update integration status
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { ...integration, status: 'connected' as const }
        : integration
    ));
    
    setIsConnecting('');
    
    // Show success message
    const modeText = mode === 'automatic' ? '🤖 Configuração automática' : '🔧 Configuração manual';
    alert(`🎉 ${integration?.name} Conectado!\n\n✅ ${modeText} concluída\n🔧 Todas as funcionalidades ativas\n⚡ Pronto para usar!`);
  };

  const handleDisconnect = (integrationId: string) => {
    if (confirm('Tem certeza que deseja desconectar esta integração?')) {
      setIntegrations(prev => prev.map(integration => 
        integration.id === integrationId 
          ? { ...integration, status: 'disconnected' as const }
          : integration
      ));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-50 dark:bg-green-900 dark:text-green-300';
      case 'connecting': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900 dark:text-yellow-300';
      case 'disconnected': return 'text-gray-600 bg-gray-50 dark:bg-gray-900 dark:text-gray-300';
      case 'error': return 'text-red-600 bg-red-50 dark:bg-red-900 dark:text-red-300';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'connected': return 'Conectado';
      case 'connecting': return 'Conectando...';
      case 'disconnected': return 'Desconectado';
      case 'error': return 'Erro';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'connecting': return <RefreshCw className="w-4 h-4 text-yellow-500 animate-spin" />;
      case 'disconnected': return <AlertCircle className="w-4 h-4 text-gray-400" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-[1000px] h-[700px] shadow-xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                {isAutoConnecting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Link className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  🔗 Gerenciador de Integrações
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Configure serviços manualmente ou com IA automática
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

          {/* Category Filter */}
          <div className="flex items-center space-x-1 mt-4 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
            {/* Navigation Controls */}
            <div className="flex items-center space-x-1 mr-2">
              <button
                onClick={goBackCategory}
                disabled={categoryHistoryIndex <= 0}
                className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Voltar"
              >
                <ArrowLeft className="w-3 h-3" />
              </button>
              <button
                onClick={goForwardCategory}
                disabled={categoryHistoryIndex >= categoryHistory.length - 1}
                className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Avançar"
              >
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => navigateToCategory(category.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-300">
                {integrations.filter(i => i.status === 'connected').length} Conectadas
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-300">
                {integrations.filter(i => i.status === 'disconnected').length} Disponíveis
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-3 h-3 text-yellow-500" />
              <span className="text-gray-600 dark:text-gray-300">
                Setup rápido disponível
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-300">
                Manual + IA disponível
              </span>
            </div>
          </div>
        </div>

        {/* Integrations Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredIntegrations.map((integration) => (
              <div
                key={integration.id}
                className="border border-gray-200 dark:border-gray-600 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 bg-gradient-to-r ${integration.color} rounded-lg flex items-center justify-center text-white`}>
                      {integration.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white">
                        {integration.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {integration.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(integration.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(integration.status)}`}>
                      {getStatusLabel(integration.status)}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Funcionalidades:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {integration.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Info */}
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-4">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <Activity className="w-3 h-3" />
                      <span>{integration.setupTime}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Crown className="w-3 h-3" />
                      <span>{integration.pricing}</span>
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  {integration.status === 'connected' ? (
                    <>
                      <button
                        onClick={() => console.log(`Configurando ${integration.name}`)}
                        className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center justify-center space-x-2"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Configurar</span>
                      </button>
                      <button
                        onClick={() => handleDisconnect(integration.id)}
                        className="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleConnect(integration.id, 'manual')}
                        disabled={isConnecting === integration.id}
                        className="flex-1 px-3 py-2 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
                      >
                        {isConnecting === integration.id ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            <span className="text-xs">Manual...</span>
                          </>
                        ) : (
                          <>
                            <Settings className="w-3 h-3" />
                            <span className="text-xs">Manual</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleConnect(integration.id, 'automatic')}
                        disabled={isConnecting === integration.id}
                        className={`flex-1 px-3 py-2 bg-gradient-to-r ${integration.color} hover:opacity-90 disabled:opacity-50 text-white rounded-lg transition-all duration-200 flex items-center justify-center space-x-2`}
                      >
                        {isConnecting === integration.id ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            <span className="text-xs">IA...</span>
                          </>
                        ) : (
                          <>
                            <div className="w-3 h-3 relative">
                              <div className="absolute inset-0 bg-white rounded-full animate-pulse opacity-75"></div>
                              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">🤖</span>
                            </div>
                            <span className="text-xs">🤖 IA</span>
                          </>
                        )}
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => window.open(`https://${integration.id}.com`, '_blank')}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Abrir documentação"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center space-x-4">
              <span>
                {integrations.filter(i => i.status === 'connected').length} de {integrations.length} integrações ativas
              </span>
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Manual + IA disponível</span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Conexões seguras</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsModal;