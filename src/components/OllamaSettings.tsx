import React, { useState, useEffect } from 'react';
import { 
  X, 
  Settings, 
  Zap, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  Brain,
  Server,
  Activity,
  Globe,
  Download,
  Play,
  Pause,
  Monitor,
  Cpu,
  MemoryStick,
  HardDrive,
  Network,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  Terminal,
  Code,
  Database,
  Shield,
  Clock,
  Target,
  Sparkles,
  Rocket
} from 'lucide-react';

interface OllamaSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  config: {
    endpoint: string;
    model: string;
    temperature: number;
    maxTokens: number;
  };
  onConfigChange: (config: any) => void;
  currentProvider: 'openai' | 'ollama';
  onProviderChange: (provider: 'openai' | 'ollama') => void;
}

interface OllamaModel {
  name: string;
  size: string;
  modified: string;
  digest: string;
  details?: {
    format: string;
    family: string;
    families: string[];
    parameter_size: string;
    quantization_level: string;
  };
}

interface OllamaStatus {
  isRunning: boolean;
  version: string;
  models: OllamaModel[];
  systemInfo?: {
    totalMemory: string;
    availableMemory: string;
    gpuInfo: string;
  };
}

const OllamaSettings: React.FC<OllamaSettingsProps> = ({ 
  isOpen, 
  onClose, 
  config, 
  onConfigChange, 
  currentProvider, 
  onProviderChange 
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'error'>('unknown');
  const [ollamaStatus, setOllamaStatus] = useState<OllamaStatus>({
    isRunning: false,
    version: '',
    models: []
  });
  const [isTestingModel, setIsTestingModel] = useState(false);
  const [testResponse, setTestResponse] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const popularModels = [
    { name: 'llama2', size: '3.8GB', description: 'Meta Llama 2 - Modelo geral balanceado' },
    { name: 'llama2:13b', size: '7.3GB', description: 'Meta Llama 2 13B - Mais preciso' },
    { name: 'codellama', size: '3.8GB', description: 'Code Llama - Especializado em código' },
    { name: 'codellama:13b', size: '7.3GB', description: 'Code Llama 13B - Código avançado' },
    { name: 'mistral', size: '4.1GB', description: 'Mistral 7B - Rápido e eficiente' },
    { name: 'neural-chat', size: '4.1GB', description: 'Neural Chat - Conversação natural' },
    { name: 'starcode', size: '4.3GB', description: 'StarCoder - Programação especializada' },
    { name: 'wizardcoder', size: '3.8GB', description: 'WizardCoder - Assistente de código' }
  ];

  useEffect(() => {
    if (isOpen) {
      checkOllamaStatus();
    }
  }, [isOpen]);

  const checkOllamaStatus = async () => {
    setIsConnecting(true);
    
    try {
      // Check if Ollama is running
      const response = await fetch(`${config.endpoint}/api/tags`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOllamaStatus({
          isRunning: true,
          version: '0.1.17', // Default version
          models: data.models || []
        });
        setConnectionStatus('connected');
      } else {
        throw new Error('Ollama not responding');
      }
    } catch (error) {
      console.error('Erro ao conectar com Ollama:', error);
      setConnectionStatus('error');
      setOllamaStatus({
        isRunning: false,
        version: '',
        models: []
      });
    }
    
    setIsConnecting(false);
  };

  const handleTestModel = async () => {
    setIsTestingModel(true);
    setTestResponse('');
    
    try {
      const response = await fetch(`${config.endpoint}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: config.model,
          prompt: 'Olá! Você está funcionando corretamente? Responda em português de forma breve.',
          stream: false,
          options: {
            temperature: config.temperature,
            num_predict: 100
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        setTestResponse(data.response || 'Modelo respondeu mas sem conteúdo');
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Erro ao testar modelo:', error);
      setTestResponse(`❌ Erro: ${error instanceof Error ? error.message : 'Falha na conexão'}`);
    }
    
    setIsTestingModel(false);
  };

  const handlePullModel = async (modelName: string) => {
    try {
      console.log(`📥 Baixando modelo ${modelName}...`);
      
      // Start model pull
      const response = await fetch(`${config.endpoint}/api/pull`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: modelName
        })
      });

      if (response.ok) {
        alert(`📥 Download Iniciado!\n\n🤖 Modelo: ${modelName}\n⏳ Download em progresso\n🔄 Verifique o terminal do Ollama\n\n⚡ Será disponível em alguns minutos`);
        
        // Refresh models list after a delay
        setTimeout(() => {
          checkOllamaStatus();
        }, 5000);
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Erro ao baixar modelo:', error);
      alert(`❌ Erro no Download!\n\n🤖 Modelo: ${modelName}\n❌ Falha: ${error instanceof Error ? error.message : 'Erro desconhecido'}\n🔧 Verifique a conexão com Ollama`);
    }
  };

  const handleSaveConfig = () => {
    // Save to localStorage
    localStorage.setItem('ollama-config', JSON.stringify(config));
    localStorage.setItem('ai-provider', currentProvider);
    
    console.log('✅ Configurações Ollama salvas:', config);
    alert(`✅ Configurações Salvas!\n\n🤖 Provider: ${currentProvider === 'ollama' ? 'Ollama Local' : 'OpenAI Cloud'}\n🔗 Endpoint: ${config.endpoint}\n🧠 Modelo: ${config.model}\n🌡️ Temperature: ${config.temperature}\n📊 Max Tokens: ${config.maxTokens}\n\n🚀 Configuração aplicada!`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-[800px] h-[700px] shadow-xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  🦙 Configurações Ollama
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Configure IA local com Ollama
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                connectionStatus === 'connected' 
                  ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                  : connectionStatus === 'error'
                  ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}>
                {connectionStatus === 'connected' && <CheckCircle className="w-4 h-4" />}
                {connectionStatus === 'error' && <AlertCircle className="w-4 h-4" />}
                {connectionStatus === 'unknown' && <RefreshCw className="w-4 h-4" />}
                <span>
                  {connectionStatus === 'connected' ? 'Conectado' : 
                   connectionStatus === 'error' ? 'Desconectado' : 'Verificando...'}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Provider Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              🤖 Provedor de IA
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => onProviderChange('openai')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  currentProvider === 'openai'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                    : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-gray-800 dark:text-white">OpenAI Cloud</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">GPT-4, DALL-E, Whisper</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => onProviderChange('ollama')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  currentProvider === 'ollama'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900'
                    : 'border-gray-200 dark:border-gray-600 hover:border-green-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <Server className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-gray-800 dark:text-white">Ollama Local</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Llama 2, CodeLlama, Mistral</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Ollama Configuration */}
          {currentProvider === 'ollama' && (
            <div className="space-y-6">
              {/* Connection Settings */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                  🔗 Configuração de Conexão
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Endpoint do Ollama
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={config.endpoint}
                        onChange={(e) => onConfigChange({ ...config, endpoint: e.target.value })}
                        placeholder="http://localhost:11434"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <button
                        onClick={checkOllamaStatus}
                        disabled={isConnecting}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center space-x-2"
                      >
                        {isConnecting ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Testando...</span>
                          </>
                        ) : (
                          <>
                            <Activity className="w-4 h-4" />
                            <span>Testar</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {connectionStatus === 'connected' && (
                    <div className="bg-green-50 dark:bg-green-900 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-green-800 dark:text-green-200">
                          ✅ Ollama conectado com sucesso!
                        </span>
                      </div>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        Versão: {ollamaStatus.version} • {ollamaStatus.models.length} modelos disponíveis
                      </p>
                    </div>
                  )}

                  {connectionStatus === 'error' && (
                    <div className="bg-red-50 dark:bg-red-900 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                        <span className="text-sm font-medium text-red-800 dark:text-red-200">
                          ❌ Não foi possível conectar com Ollama
                        </span>
                      </div>
                      <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                        Verifique se o Ollama está rodando em {config.endpoint}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Model Selection */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                  🧠 Seleção de Modelo
                </h4>
                
                {ollamaStatus.models.length > 0 ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Modelo Ativo
                      </label>
                      <select
                        value={config.model}
                        onChange={(e) => onConfigChange({ ...config, model: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        {ollamaStatus.models.map((model) => (
                          <option key={model.name} value={model.name}>
                            {model.name} ({model.size || 'Tamanho desconhecido'})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={handleTestModel}
                        disabled={isTestingModel}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center space-x-2"
                      >
                        {isTestingModel ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Testando...</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" />
                            <span>Testar Modelo</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => window.open('http://localhost:11434', '_blank')}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Abrir Ollama</span>
                      </button>
                    </div>

                    {testResponse && (
                      <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                        <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                          🧪 Resposta do Teste:
                        </h5>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          {testResponse}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-300 font-medium mb-2">
                      Nenhum modelo encontrado
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Baixe um modelo para começar a usar o Ollama
                    </p>
                  </div>
                )}
              </div>

              {/* Popular Models */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                  📦 Modelos Populares
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {popularModels.map((model) => (
                    <div
                      key={model.name}
                      className="flex items-center justify-between p-3 bg-white dark:bg-gray-600 rounded-lg"
                    >
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-800 dark:text-white">
                          {model.name}
                        </h5>
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                          {model.description}
                        </p>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {model.size}
                        </span>
                      </div>
                      <button
                        onClick={() => handlePullModel(model.name)}
                        disabled={ollamaStatus.models.some(m => m.name === model.name)}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded text-sm transition-colors flex items-center space-x-1"
                      >
                        {ollamaStatus.models.some(m => m.name === model.name) ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            <span>Instalado</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3 h-3" />
                            <span>Baixar</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-800 dark:text-white">
                    ⚙️ Configurações Avançadas
                  </h4>
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    {showAdvanced ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>

                {showAdvanced && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Temperature (0.0 - 2.0)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="2"
                          step="0.1"
                          value={config.temperature}
                          onChange={(e) => onConfigChange({ ...config, temperature: parseFloat(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Max Tokens
                        </label>
                        <input
                          type="number"
                          min="100"
                          max="8192"
                          value={config.maxTokens}
                          onChange={(e) => onConfigChange({ ...config, maxTokens: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg">
                      <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                        💡 Dicas de Configuração
                      </h5>
                      <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                        <li>• Temperature baixa (0.1-0.3): Respostas mais precisas</li>
                        <li>• Temperature alta (0.7-1.0): Respostas mais criativas</li>
                        <li>• Max Tokens: Limite de palavras na resposta</li>
                        <li>• CodeLlama: Melhor para geração de código</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Installation Guide */}
              <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-3">
                  📋 Como Instalar o Ollama
                </h4>
                <div className="space-y-2 text-sm text-yellow-700 dark:text-yellow-300">
                  <p>
                    <strong>1. Download:</strong> Visite{" "}
                    <a
                      href="https://ollama.ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      ollama.ai
                    </a>
                  </p>
                  <p><strong>2. Instalar:</strong> Execute o instalador para seu sistema</p>
                  <p><strong>3. Iniciar:</strong> Execute <code className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">ollama serve</code></p>
                  <p><strong>4. Modelo:</strong> Execute <code className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">ollama pull llama2</code></p>
                  <p><strong>5. Testar:</strong> Use o botão "Testar" acima</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center space-x-1">
                <Server className="w-4 h-4" />
                <span>Provider: {currentProvider === 'ollama' ? 'Ollama Local' : 'OpenAI Cloud'}</span>
              </div>
              {currentProvider === 'ollama' && (
                <div className="flex items-center space-x-1">
                  <Brain className="w-4 h-4" />
                  <span>Modelo: {config.model}</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  handleSaveConfig();
                  onClose();
                }}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>Salvar Configurações</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OllamaSettings;