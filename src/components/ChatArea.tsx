/// <reference types="react" />
import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  Bot,
  Trash2,
  Settings
} from 'lucide-react';
import ProcessingSteps from './ProcessingSteps';
import DependencyManager from './DependencyManager';
import AIAssistant from './AIAssistant';
import TemplatesModal from './TemplatesModal';
import { useProjects } from '../contexts/ProjectContext';
import { useMultiAgent } from '../hooks/useMultiAgent';
import { useUI } from '../contexts/UIContext';
import { getTranslation } from '../lib/i18n';
import { FileProcessor, FileContext } from '../utils/fileProcessor';
import { FolderPlus, FileArchive } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  type: 'react' | 'vue' | 'next' | 'html' | 'node' | 'python' | 'angular';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  preview: string;
  downloads: number;
  rating: number;
  author: string;
  lastUpdated: string;
  isPopular: boolean;
  isFree: boolean;
  features: string[];
  demoUrl?: string;
  sourceUrl?: string;
}

interface OllamaConfig {
  endpoint: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

const DEFAULT_OLLAMA_CONFIG: OllamaConfig = {
  endpoint: 'http://localhost:11434',
  model: 'llama2',
  temperature: 0.7,
  maxTokens: 2048
};

interface ChatAreaProps {
  onCodeGenerated: (code: string) => void;
  currentCode: string;
}

const ChatArea: React.FC<ChatAreaProps> = ({ onCodeGenerated, currentCode }) => {
  const { addProject } = useProjects();
  const { orchestrateFeature } = useMultiAgent();
  const { 
    setShowAgentReasoning, 
    setAgentName,
    setSecurityStatus,
    setVulnerabilities,
    language
  } = useUI();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Olá! Sou sua IA de desenvolvimento. O que você gostaria de construir hoje?',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [showDependencyManager, setShowDependencyManager] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [aiProvider, setAiProvider] = useState<'openai' | 'ollama'>('openai');
  const [ollamaConfig] = useState<OllamaConfig>(DEFAULT_OLLAMA_CONFIG);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const simulateAIResponse = async (userMessage: string) => {
    setIsProcessing(true);
    
    // Choose AI provider
    if (aiProvider === 'ollama') {
      await handleOllamaResponse(userMessage);
    } else {
      await handleOpenAIResponse(userMessage);
    }
    
    setIsProcessing(false);
  };

  const handleOllamaResponse = async (userMessage: string) => {
    // Add AI message with streaming
    const aiMessageId = Date.now().toString();
    const aiMessage: Message = {
      id: aiMessageId,
      type: 'ai',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    };
    
    setMessages(prev => [...prev, aiMessage]);

    try {
      // Call Ollama API
      const response = await fetch(`${ollamaConfig.endpoint}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: ollamaConfig.model,
          prompt: `Você é um assistente de desenvolvimento especializado em criar código React/TypeScript. Responda de forma concisa e prática.\n\nUsuário: ${userMessage}\n\nAssistente:`,
          stream: false,
          options: {
            temperature: ollamaConfig.temperature,
            num_predict: ollamaConfig.maxTokens
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.response || 'Desculpe, não consegui processar sua solicitação.';

      // Update message with Ollama response
      setMessages((prev: Message[]) => prev.map((msg: Message) =>
        msg.id === aiMessageId
          ? { ...msg, content: aiResponse, isStreaming: false }
          : msg
      ));

    } catch (error) {
      console.error('Erro ao conectar com Ollama:', error);

      // Fallback to simulated response
      const fallbackResponse = `❌ Erro ao conectar com Ollama (${ollamaConfig.endpoint})\n\nVerifique se:\n• Ollama está rodando\n• Modelo ${ollamaConfig.model} está instalado\n• Endpoint está correto\n\n🔄 Alternando para modo simulado...`;

      setMessages((prev: Message[]) => prev.map((msg: Message) =>
        msg.id === aiMessageId
          ? { ...msg, content: fallbackResponse, isStreaming: false }
          : msg
      ));

      // Auto-switch to OpenAI mode
      setTimeout(() => {
        setAiProvider('openai');
        alert('⚠️ Ollama Indisponível!\n\n❌ Não foi possível conectar\n🔄 Alternado para OpenAI\n⚙️ Configure Ollama nas configurações');
      }, 2000);
    }
  };

  const handleOpenAIResponse = async (userMessage: string) => {
    // 1. Processar Arquivos Anexados (se houver)
    let contextFromFiles = "";
    if (attachedFiles.length > 0) {
      setAgentName('Cipher');
      setShowAgentReasoning(true);
      const processed = await FileProcessor.processFiles(attachedFiles);
      contextFromFiles = FileProcessor.formatForAI(processed);
      
      if (FileProcessor.needsUnzip(attachedFiles)) {
        // Log específico para ZIP
        console.log("📦 ZIP detectado, IA preparando extração virtual...");
      }
    }

    // Add AI message with streaming
    const aiMessageId = Date.now().toString();
    const aiMessage: Message = {
      id: aiMessageId,
      type: 'ai',
      content: '🤖 Enviando para o Sistema Multi-Agente...',
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages((prev: Message[]) => [...prev, aiMessage]);

    try {
      // Trigger Reasoning Phase
      setAgentName('Architect');
      setShowAgentReasoning(true);
      
      // Wait a bit for the "reasoning" feel
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Use the actual Orchestrator with full message history for context
      const result = await orchestrateFeature(
        `Contexto atual do código:\n${currentCode}\n${contextFromFiles}\n\nSolicitação do usuário: ${userMessage}`,
        messages
      );

      // Sincronizar Segurança com UI
      if (result.securityStatus) {
        setSecurityStatus(result.securityStatus.level);
        setVulnerabilities(result.security || []);
      }

      let finalContent = `✅ **Feature processada com sucesso!**\n\n` +
        `🛡️ **Segurança**: ${result.security.length} vulnerabilidades encontradas.\n` +
        `🎨 **UI/Frontend**: Gerado.\n` +
        `⚙️ **API/Backend**: Gerado.\n` +
        `🧪 **Testes**: ${result.tests.success ? 'Gerados com sucesso' : 'Falha na geração'}.\n` +
        `⚡ **Performance**: ${result.performance.suggestions.length} sugestões de otimização.\n` +
        `📝 **Doc**: README e JSDoc gerados.\n\n` +
        `📦 **Créditos Economizados**: ${result.credits.savings}`;

      if (result.performance?.suggestions && result.performance.suggestions.length > 0) {
        finalContent += `\n\n🚀 **Ações de Performance Realizadas**:\n${result.performance.suggestions.map((s: string) => `- ${s}`).join('\n')}`;
      }

      if (result.tests?.tests) {
        finalContent += `\n\n🧪 **Test Unitário Gerado**:\n\`\`\`typescript\n${result.tests.tests}\n\`\`\``;
      }

      if (result.discussion && result.discussion.length > 0) {
        finalContent += `\n\n💬 **Discussão entre Agentes (Backstage)**:\n` +
          result.discussion.map((d: { agent: string; thought: string }) => `> **${d.agent}**: ${d.thought}`).join('\n');
      }

      setMessages((prev: Message[]) => prev.map((msg: Message) =>
        msg.id === aiMessageId
          ? { ...msg, content: finalContent, isStreaming: false }
          : msg
      ));

      // In a real scenario, we might want to show both or a combined view.
      onCodeGenerated(result.frontend.code || '');
      
      // Hide reasoning
      setShowAgentReasoning(false);

    } catch (error) {
      console.error('Erro na orquestração:', error);
      setMessages((prev: Message[]) => prev.map((msg: Message) =>
        msg.id === aiMessageId
          ? { ...msg, content: '❌ Erro ao processar com Multi-Agente.', isStreaming: false }
          : msg
      ));
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputValue.trim() && attachedFiles.length === 0) || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue + (attachedFiles.length > 0 ? `\n\n📎 ${attachedFiles.length} arquivo(s) anexado(s)` : ''),
      timestamp: new Date(),
    };

    setMessages((prev: Message[]) => [...prev, userMessage]);
    setInputValue('');
    setAttachedFiles([]);

    // Adjust textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    await simulateAIResponse(inputValue);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const handleTemplateSelect = async (template: Template) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: `🎨 Carregar template: ${template.name}`,
      timestamp: new Date(),
    };
    setMessages((prev: Message[]) => [...prev, userMessage]);

    // Start processing
    setIsProcessing(true);
    setAgentName('Template-Loader');
    setShowAgentReasoning(true);

    // Add AI response with streaming
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      type: 'ai',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    };
    setMessages(prev => [...prev, aiMessage]);

    // Simulate AI processing steps
    const steps = [
      `🎯 Carregando template "${template.name}"...`,
      '🤖 IA analisando estrutura do template...',
      '📦 Configurando dependências automáticas...',
      '🎨 Aplicando design system...',
      '⚡ Otimizando performance...',
      '🔧 Configurando funcionalidades...',
      '✅ Template aplicado com sucesso!'
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setMessages((prev: Message[]) => prev.map((msg: Message) => 
        msg.id === aiMessageId 
          ? { ...msg, content: steps.slice(0, i + 1).join('\n\n') }
          : msg
      ));
    }

    // Finish streaming
    setMessages((prev: Message[]) => prev.map((msg: Message) => 
      msg.id === aiMessageId 
        ? { ...msg, isStreaming: false }
        : msg
    ));

    // Hide reasoning if it was shown (though templates have their own steps, we can use the panel too)
    setShowAgentReasoning(false);

    // Generate code based on template
    const templateCode = generateTemplateCode(template);
    onCodeGenerated(templateCode);

    // Create project
    addProject({
      name: template.name,
      description: template.description,
      type: template.type,
      status: 'active',
      collaborators: 1,
      isStarred: false,
      tags: template.tags,
      size: `${Math.round(templateCode.length / 1024 * 10) / 10} KB`,
      framework: template.type === 'react' ? 'React + TypeScript' : 
                template.type === 'vue' ? 'Vue.js + TypeScript' :
                template.type === 'next' ? 'Next.js + TypeScript' :
                template.type === 'angular' ? 'Angular + TypeScript' :
                'HTML + CSS + JS',
      code: templateCode,
      version: '1.0.0',
      dependencies: template.type === 'react' ? ['react', 'react-dom', 'typescript', 'tailwindcss'] :
                    template.type === 'vue' ? ['vue', 'typescript', 'tailwindcss'] :
                    template.type === 'next' ? ['next', 'react', 'react-dom', 'typescript'] :
                    ['typescript', 'tailwindcss'],
      features: template.features,
      analytics: {
        views: 1,
        deploys: 0,
        performance: Math.floor(Math.random() * 20) + 80
      }
    });

    setIsProcessing(false);
  };

  const generateTemplateCode = (template: any): string => {
    switch (template.id) {
      case '1': // E-commerce Moderno
        return generateEcommerceCode();
      case '2': // Dashboard Analytics  
        return generateDashboardCode();
      case '3': // Blog Pessoal
        return generateBlogCode();
      case '4': // Portfolio Criativo
        return generatePortfolioCode();
      case '5': // Landing Page SaaS
        return generateLandingCode();
      case '6': // App Mobile UI Kit
        return generateMobileUICode();
      case '7': // Admin Panel Pro
        return generateAdminPanelCode();
      case '8': // Social Media App
        return generateSocialAppCode();
      case '9': // SaaS Moderno
        return generateSaaSCode();
      case '10': // Uber Clone
        return generateUberCloneCode();
      default:
        return generateDefaultTemplateCode(template);
    }
  };

  const generateEcommerceCode = (): string => {
    return `import React, { useState, useEffect } from 'react';
import { ShoppingCart, Star, Heart, Search, Filter, Grid3X3, List, Plus, Minus, Eye, Share } from 'lucide-react';

function EcommerceApp() {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [wishlist, setWishlist] = useState([]);

  const products = [
    { 
      id: 1, 
      name: 'iPhone 15 Pro Max', 
      price: 8999, 
      originalPrice: 9999,
      rating: 4.9, 
      reviews: 1247,
      category: 'smartphones',
      image: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg',
      description: 'O smartphone mais avançado da Apple com chip A17 Pro',
      inStock: true,
      discount: 10
    },
    { 
      id: 2, 
      name: 'MacBook Pro M3', 
      price: 12999, 
      originalPrice: 14999,
      rating: 4.8, 
      reviews: 892,
      category: 'laptops',
      image: 'https://images.pexels.com/photos/18105/pexels-photo-18105.jpeg',
      description: 'Laptop profissional com chip M3 e 16GB RAM',
      inStock: true,
      discount: 13
    },
    { 
      id: 3, 
      name: 'AirPods Pro 2', 
      price: 1899, 
      originalPrice: 2199,
      rating: 4.7, 
      reviews: 2156,
      category: 'audio',
      image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
      description: 'Fones com cancelamento ativo de ruído',
      inStock: true,
      discount: 14
    },
    { 
      id: 4, 
      name: 'Apple Watch Ultra', 
      price: 4999, 
      originalPrice: 5499,
      rating: 4.6, 
      reviews: 743,
      category: 'wearables',
      image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg',
      description: 'Smartwatch resistente para aventuras',
      inStock: false,
      discount: 9
    },
    { 
      id: 5, 
      name: 'iPad Pro M2', 
      price: 6999, 
      originalPrice: 7999,
      rating: 4.8, 
      reviews: 1089,
      category: 'tablets',
      image: 'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg',
      description: 'Tablet profissional com tela Liquid Retina',
      inStock: true,
      discount: 13
    },
    { 
      id: 6, 
      name: 'Magic Keyboard', 
      price: 1299, 
      originalPrice: 1499,
      rating: 4.5, 
      reviews: 456,
      category: 'accessories',
      image: 'https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg',
      description: 'Teclado sem fio com retroiluminação',
      inStock: true,
      discount: 13
    }
  ];

  const categories = [
    { id: 'all', name: 'Todos os Produtos' },
    { id: 'smartphones', name: 'Smartphones' },
    { id: 'laptops', name: 'Laptops' },
    { id: 'tablets', name: 'Tablets' },
    { id: 'audio', name: 'Áudio' },
    { id: 'wearables', name: 'Wearables' },
    { id: 'accessories', name: 'Acessórios' }
  ];

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const toggleWishlist = (productId) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TechStore Pro
              </h1>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                🔥 Black Friday -50%
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <button className="relative p-2 text-gray-700 hover:text-red-500 transition-colors">
                <Heart className="w-6 h-6" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>
              
              <button className="relative p-2 text-gray-700 hover:text-blue-500 transition-colors">
                <ShoppingCart className="w-6 h-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-semibold text-gray-900 mb-4">Categorias</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={\`w-full text-left px-3 py-2 rounded-lg transition-colors \${
                      selectedCategory === category.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }\`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCategory === 'all' ? 'Todos os Produtos' : categories.find(c => c.id === selectedCategory)?.name}
                </h2>
                <p className="text-gray-600">{filteredProducts.length} produtos encontrados</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={\`p-2 rounded-lg transition-colors \${
                    viewMode === 'grid' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }\`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={\`p-2 rounded-lg transition-colors \${
                    viewMode === 'list' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }\`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Products Grid */}
            <div className={\`\${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}\`}>
              {filteredProducts.map(product => (
                <div key={product.id} className={\`bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-300 group \${viewMode === 'list' ? 'flex items-center space-x-6 p-4' : 'overflow-hidden'}\`}>
                  <div className={\`\${viewMode === 'list' ? 'w-24 h-24 flex-shrink-0' : 'relative'}\`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className={\`\${viewMode === 'list' ? 'w-full h-full object-cover rounded-lg' : 'w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300'}\`}
                    />
                    {viewMode === 'grid' && (
                      <>
                        {product.discount > 0 && (
                          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-medium">
                            -{product.discount}%
                          </div>
                        )}
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className={\`absolute top-3 right-3 p-2 rounded-full bg-white shadow-lg transition-colors \${
                            wishlist.includes(product.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                          }\`}
                        >
                          <Heart className="w-4 h-4" fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} />
                        </button>
                      </>
                    )}
                  </div>
                  
                  <div className={\`\${viewMode === 'list' ? 'flex-1' : 'p-4'}\`}>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </h3>
                      {!product.inStock && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                          Esgotado
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                    
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={\`w-4 h-4 \${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}\`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">({product.reviews} avaliações)</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-gray-900">
                            R$ {product.price.toLocaleString()}
                          </span>
                          {product.originalPrice > product.price && (
                            <span className="text-sm text-gray-500 line-through">
                              R$ {product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-green-600">
                          ou 12x de R$ {Math.round(product.price / 12)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {viewMode === 'list' && (
                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className={\`p-2 rounded-lg transition-colors \${
                              wishlist.includes(product.id) ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                            }\`}
                          >
                            <Heart className="w-4 h-4" fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} />
                          </button>
                        )}
                        <button
                          onClick={() => addToCart(product)}
                          disabled={!product.inStock}
                          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span>{product.inStock ? 'Adicionar' : 'Indisponível'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      {cartItemsCount > 0 && (
        <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-xl border max-w-sm">
          <h3 className="font-semibold text-gray-900 mb-2">Carrinho ({cartItemsCount} itens)</h3>
          <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
            {cart.map(item => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <span className="truncate">{item.name}</span>
                <span className="font-medium">
                  {item.quantity}x R$ {item.price.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t pt-2">
            <div className="flex items-center justify-between font-bold text-lg">
              <span>Total:</span>
              <span className="text-blue-600">R$ {cartTotal.toLocaleString()}</span>
            </div>
            <button className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors">
              Finalizar Compra
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EcommerceApp;`;
  };

  const generateDashboardCode = (): string => {
    return generateSmartCode('dashboard analytics com gráficos e métricas');
  };

  const generateBlogCode = (): string => {
    return generateSmartCode('blog pessoal com posts e categorias');
  };

  const generatePortfolioCode = (): string => {
    return `import React, { useState } from 'react';
import { Github, ExternalLink, Mail, Linkedin, Twitter, Eye, Star, Calendar, Code, Palette, Globe } from 'lucide-react';

function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const projects = [
    {
      id: 1,
      title: 'E-commerce Platform',
      description: 'Plataforma completa de e-commerce com React, Node.js e PostgreSQL',
      image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg',
      category: 'fullstack',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
      liveUrl: 'https://ecommerce-demo.com',
      githubUrl: 'https://github.com/user/ecommerce',
      featured: true
    },
    {
      id: 2,
      title: 'Dashboard Analytics',
      description: 'Dashboard interativo com gráficos em tempo real e métricas avançadas',
      image: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpg',
      category: 'frontend',
      technologies: ['React', 'D3.js', 'TypeScript', 'Tailwind'],
      liveUrl: 'https://dashboard-demo.com',
      githubUrl: 'https://github.com/user/dashboard',
      featured: true
    },
    {
      id: 3,
      title: 'Mobile App UI',
      description: 'Interface moderna para aplicativo móvel com React Native',
      image: 'https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg',
      category: 'mobile',
      technologies: ['React Native', 'Expo', 'TypeScript'],
      liveUrl: 'https://mobile-demo.com',
      githubUrl: 'https://github.com/user/mobile-app',
      featured: false
    }
  ];

  const skills = [
    { name: 'React', level: 95, color: 'bg-blue-500' },
    { name: 'TypeScript', level: 90, color: 'bg-blue-600' },
    { name: 'Node.js', level: 85, color: 'bg-green-500' },
    { name: 'Python', level: 80, color: 'bg-yellow-500' },
    { name: 'PostgreSQL', level: 75, color: 'bg-indigo-500' },
    { name: 'AWS', level: 70, color: 'bg-orange-500' }
  ];

  const categories = [
    { id: 'all', name: 'Todos' },
    { id: 'fullstack', name: 'Full Stack' },
    { id: 'frontend', name: 'Frontend' },
    { id: 'mobile', name: 'Mobile' }
  ];

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-32 h-32 bg-white rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-4xl font-bold text-gray-800">JS</span>
          </div>
          <h1 className="text-5xl font-bold mb-4">João Silva</h1>
          <p className="text-xl text-blue-100 mb-6">
            Desenvolvedor Full Stack • Especialista em React & Node.js
          </p>
          <p className="text-lg text-blue-200 mb-8 max-w-2xl mx-auto">
            Transformo ideias em soluções digitais inovadoras. 
            Apaixonado por criar experiências web excepcionais.
          </p>
          
          <div className="flex items-center justify-center space-x-4">
            <button className="bg-white text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Ver Projetos
            </button>
            <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-800 transition-colors">
              Entrar em Contato
            </button>
          </div>
          
          <div className="flex items-center justify-center space-x-6 mt-8">
            <a href="#" className="text-blue-200 hover:text-white transition-colors">
              <Github className="w-6 h-6" />
            </a>
            <a href="#" className="text-blue-200 hover:text-white transition-colors">
              <Linkedin className="w-6 h-6" />
            </a>
            <a href="#" className="text-blue-200 hover:text-white transition-colors">
              <Twitter className="w-6 h-6" />
            </a>
            <a href="#" className="text-blue-200 hover:text-white transition-colors">
              <Mail className="w-6 h-6" />
            </a>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Habilidades Técnicas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skills.map(skill => (
              <div key={skill.name} className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-800">{skill.name}</span>
                  <span className="text-sm text-gray-600">{skill.level}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={\`\${skill.color} h-2 rounded-full transition-all duration-1000\`}
                    style={{ width: \`\${skill.level}%\` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Projetos em Destaque</h2>
          <p className="text-center text-gray-600 mb-12">Alguns dos meus trabalhos mais recentes</p>
          
          <div className="flex justify-center space-x-4 mb-8">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={\`px-4 py-2 rounded-full transition-colors \${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }\`}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map(project => (
              <div key={project.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {project.featured && (
                    <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-sm font-medium">
                      ⭐ Destaque
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                      >
                        <Eye className="w-4 h-4 text-gray-700" />
                      </a>
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                      >
                        <Github className="w-4 h-4 text-gray-700" />
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map(tech => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Vamos Trabalhar Juntos?</h2>
          <p className="text-gray-300 mb-8">
            Estou sempre aberto a novos projetos e oportunidades interessantes
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a
              href="mailto:joao@example.com"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
            >
              <Mail className="w-5 h-5" />
              <span>Enviar Email</span>
            </a>
            <a
              href="https://linkedin.com/in/joaosilva"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-gray-600 text-gray-300 hover:border-white hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
            >
              <Linkedin className="w-5 h-5" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Portfolio;`;
  };

  const generateLandingCode = (): string => {
    return generateSmartCode('landing page saas com preços e features');
  };

  const generateMobileUICode = (): string => {
    return `import React, { useState } from 'react';
import { Home, Search, Heart, User, Bell, Plus, Star, MessageCircle, Share, MoreVertical } from 'lucide-react';

function MobileApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [notifications, setNotifications] = useState(3);

  const posts = [
    {
      id: 1,
      user: 'Maria Silva',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
      time: '2h',
      content: 'Acabei de lançar meu novo projeto! 🚀',
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
      likes: 42,
      comments: 8,
      isLiked: false
    },
    {
      id: 2,
      user: 'Pedro Costa',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
      time: '4h',
      content: 'Que vista incrível! 🌅',
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg',
      likes: 128,
      comments: 23,
      isLiked: true
    }
  ];

  const toggleLike = (postId) => {
    console.log('Toggle like:', postId);
  };

  return (
    <div className="max-w-sm mx-auto bg-white min-h-screen">
      {/* Status Bar */}
      <div className="bg-gray-900 text-white px-4 py-2 flex items-center justify-between text-sm">
        <span>9:41</span>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-2 bg-white rounded-sm"></div>
          <div className="w-1 h-2 bg-white rounded-sm"></div>
          <div className="w-6 h-3 border border-white rounded-sm">
            <div className="w-4 h-1 bg-white rounded-sm m-0.5"></div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">SocialApp</h1>
          <div className="flex items-center space-x-3">
            <button className="relative">
              <Bell className="w-6 h-6 text-gray-700" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
            <button>
              <Plus className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'home' && (
          <div className="space-y-4 p-4">
            {posts.map(post => (
              <div key={post.id} className="bg-white border border-gray-200 rounded-lg">
                {/* Post Header */}
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={post.avatar}
                      alt={post.user}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{post.user}</h3>
                      <p className="text-sm text-gray-500">{post.time}</p>
                    </div>
                  </div>
                  <button>
                    <MoreVertical className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Post Content */}
                <div className="px-4 pb-3">
                  <p className="text-gray-800">{post.content}</p>
                </div>

                {/* Post Image */}
                <img
                  src={post.image}
                  alt="Post"
                  className="w-full h-64 object-cover"
                />

                {/* Post Actions */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => toggleLike(post.id)}
                        className={\`flex items-center space-x-1 \${post.isLiked ? 'text-red-500' : 'text-gray-500'}\`}
                      >
                        <Heart className={\`w-5 h-5 \${post.isLiked ? 'fill-current' : ''}\`} />
                        <span className="text-sm">{post.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-gray-500">
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm">{post.comments}</span>
                      </button>
                      <button className="text-gray-500">
                        <Share className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'search' && (
          <div className="p-4">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Digite algo para buscar</p>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="p-4">
            <div className="text-center mb-6">
              <img
                src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"
                alt="Profile"
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h2 className="text-xl font-bold text-gray-900">João Silva</h2>
              <p className="text-gray-600">Desenvolvedor Full Stack</p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center mb-6">
              <div>
                <p className="text-2xl font-bold text-gray-900">127</p>
                <p className="text-sm text-gray-600">Posts</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">1.2K</p>
                <p className="text-sm text-gray-600">Seguidores</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">890</p>
                <p className="text-sm text-gray-600">Seguindo</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-around">
          {[
            { id: 'home', icon: Home, label: 'Início' },
            { id: 'search', icon: Search, label: 'Buscar' },
            { id: 'favorites', icon: Heart, label: 'Favoritos' },
            { id: 'profile', icon: User, label: 'Perfil' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={\`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-colors \${
                activeTab === tab.id 
                  ? 'text-blue-600' 
                  : 'text-gray-500'
              }\`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-xs">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MobileApp;`;
  };

  const generateAdminPanelCode = (): string => {
    return `import React, { useState } from 'react';
import { Users, BarChart3, Settings, Bell, Search, Plus, Edit, Trash2, Eye, Filter } from 'lucide-react';

function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([
    { id: 1, name: 'João Silva', email: 'joao@example.com', role: 'Admin', status: 'active', lastLogin: '2h atrás' },
    { id: 2, name: 'Maria Santos', email: 'maria@example.com', role: 'Editor', status: 'active', lastLogin: '1 dia atrás' },
    { id: 3, name: 'Pedro Costa', email: 'pedro@example.com', role: 'User', status: 'inactive', lastLogin: '1 semana atrás' }
  ]);

  const stats = [
    { label: 'Total Users', value: '2,847', change: '+12%', color: 'blue' },
    { label: 'Revenue', value: 'R$ 45.2K', change: '+8%', color: 'green' },
    { label: 'Orders', value: '1,234', change: '+23%', color: 'purple' },
    { label: 'Conversion', value: '3.2%', change: '+0.5%', color: 'orange' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
        </div>
        <nav className="p-4">
          <div className="space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'users', label: 'Usuários', icon: Users },
              { id: 'settings', label: 'Configurações', icon: Settings }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={\`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors \${
                  activeTab === item.id 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }\`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {activeTab === 'dashboard' ? 'Dashboard' : 
               activeTab === 'users' ? 'Gerenciar Usuários' : 'Configurações'}
            </h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="relative p-2 text-gray-600 hover:text-gray-800">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  3
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className={\`text-sm \${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}\`}>
                          {stat.change} vs mês anterior
                        </p>
                      </div>
                      <div className={\`w-12 h-12 bg-\${stat.color}-100 rounded-lg flex items-center justify-center\`}>
                        <BarChart3 className={\`w-6 h-6 text-\${stat.color}-600\`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chart Placeholder */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendas dos Últimos 30 Dias</h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-16 h-16 text-gray-400" />
                  <span className="ml-4 text-gray-600">Gráfico seria renderizado aqui</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* Users Table */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Lista de Usuários</h3>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                      <Plus className="w-4 h-4" />
                      <span>Novo Usuário</span>
                    </button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Usuário
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Último Login
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map(user => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={\`px-2 py-1 text-xs font-medium rounded-full \${
                              user.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                              user.role === 'Editor' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }\`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={\`px-2 py-1 text-xs font-medium rounded-full \${
                              user.status === 'active' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                            }\`}>
                              {user.status === 'active' ? 'Ativo' : 'Inativo'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.lastLogin}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button className="text-blue-600 hover:text-blue-700">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="text-green-600 hover:text-green-700">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="text-red-600 hover:text-red-700">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;`;
  };

  const generateSocialAppCode = (): string => {
    return generateMobileUICode(); // Reuse mobile UI for social app
  };

  const generateSaaSCode = (): string => {
    return `import React, { useState } from 'react';
import { BarChart3, Users, CreditCard, Settings, Bell, Search, Plus, TrendingUp, DollarSign, Activity } from 'lucide-react';

function SaaSPlatform() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentPlan, setCurrentPlan] = useState('pro');

  const metrics = {
    mrr: 125000,
    customers: 1247,
    churn: 2.3,
    growth: 23.5
  };

  const plans = [
    { id: 'starter', name: 'Starter', price: 29, features: ['5 projetos', 'Suporte básico'] },
    { id: 'pro', name: 'Pro', price: 99, features: ['Projetos ilimitados', 'Suporte prioritário', 'Analytics'] },
    { id: 'enterprise', name: 'Enterprise', price: 299, features: ['Tudo do Pro', 'SSO', 'SLA dedicado'] }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-900">SaaS Platform</h1>
        </div>
        <nav className="p-4">
          <div className="space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'customers', label: 'Clientes', icon: Users },
              { id: 'billing', label: 'Faturamento', icon: CreditCard },
              { id: 'settings', label: 'Configurações', icon: Settings }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={\`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors \${
                  activeTab === item.id 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }\`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {activeTab === 'dashboard' ? 'Dashboard' : 
               activeTab === 'customers' ? 'Clientes' :
               activeTab === 'billing' ? 'Faturamento' : 'Configurações'}
            </h2>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">MRR</p>
                      <p className="text-2xl font-bold text-gray-900">R$ {metrics.mrr.toLocaleString()}</p>
                      <p className="text-sm text-green-600">+{metrics.growth}% vs mês anterior</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Clientes</p>
                      <p className="text-2xl font-bold text-gray-900">{metrics.customers.toLocaleString()}</p>
                      <p className="text-sm text-blue-600">+156 este mês</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Churn Rate</p>
                      <p className="text-2xl font-bold text-gray-900">{metrics.churn}%</p>
                      <p className="text-sm text-red-600">-0.5% vs mês anterior</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Crescimento</p>
                      <p className="text-2xl font-bold text-gray-900">{metrics.growth}%</p>
                      <p className="text-sm text-green-600">Acima da meta</p>
                    </div>
                    <Activity className="w-8 h-8 text-orange-600" />
                  </div>
                </div>
              </div>

              {/* Revenue Chart */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Receita Mensal</h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-16 h-16 text-gray-400" />
                  <span className="ml-4 text-gray-600">Gráfico de receita seria renderizado aqui</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Planos Disponíveis</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {plans.map(plan => (
                    <div
                      key={plan.id}
                      className={\`border-2 rounded-lg p-6 transition-colors \${
                        currentPlan === plan.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }\`}
                    >
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h4>
                      <div className="text-3xl font-bold text-gray-900 mb-4">
                        R$ {plan.price}
                        <span className="text-sm text-gray-600 font-normal">/mês</span>
                      </div>
                      <ul className="space-y-2 mb-6">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                            <span className="text-sm text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <button
                        className={\`w-full py-2 rounded-lg font-medium transition-colors \${
                          currentPlan === plan.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }\`}
                      >
                        {currentPlan === plan.id ? 'Plano Atual' : 'Selecionar'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SaaSPlatform;`;
  };

  const generateUberCloneCode = (): string => {
    return `import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, Star, Car, User, CreditCard, Phone } from 'lucide-react';

function UberClone() {
  const [currentStep, setCurrentStep] = useState('booking'); // booking, searching, matched, riding, completed
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('standard');

  const vehicles = [
    { id: 'economy', name: 'UberX', price: 15.50, time: '3 min', capacity: '4 pessoas', icon: '🚗' },
    { id: 'standard', name: 'Uber Comfort', price: 22.80, time: '5 min', capacity: '4 pessoas', icon: '🚙' },
    { id: 'premium', name: 'Uber Black', price: 35.90, time: '8 min', capacity: '4 pessoas', icon: '🖤' }
  ];

  const driver = {
    name: 'Carlos Silva',
    rating: 4.9,
    reviews: 1247,
    car: 'Honda Civic Prata',
    plate: 'ABC-1234',
    photo: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
  };

  const requestRide = () => {
    setCurrentStep('searching');
    setTimeout(() => setCurrentStep('matched'), 3000);
  };

  return (
    <div className="max-w-sm mx-auto bg-white min-h-screen">
      {/* Status Bar */}
      <div className="bg-gray-900 text-white px-4 py-2 flex items-center justify-between text-sm">
        <span>9:41</span>
        <span>Uber</span>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-2 bg-white rounded-sm"></div>
          <div className="w-1 h-2 bg-white rounded-sm"></div>
          <div className="w-6 h-3 border border-white rounded-sm">
            <div className="w-4 h-1 bg-white rounded-sm m-0.5"></div>
          </div>
        </div>
      </div>

      {/* Map Area */}
      <div className="h-64 bg-gradient-to-br from-green-400 to-blue-500 relative flex items-center justify-center">
        <div className="text-white text-center">
          <MapPin className="w-12 h-12 mx-auto mb-2" />
          <p className="text-sm">Mapa seria renderizado aqui</p>
          <p className="text-xs opacity-75">Google Maps / Mapbox</p>
        </div>
        
        {/* Current Location */}
        <div className="absolute bottom-4 left-4 bg-white p-2 rounded-full shadow-lg">
          <Navigation className="w-5 h-5 text-blue-600" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        {currentStep === 'booking' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Para onde vamos?</h2>
            
            {/* Location Inputs */}
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-green-500 rounded-full"></div>
                <input
                  type="text"
                  placeholder="Local de partida"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full"></div>
                <input
                  type="text"
                  placeholder="Para onde?"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Vehicle Selection */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Escolha seu veículo</h3>
              {vehicles.map(vehicle => (
                <button
                  key={vehicle.id}
                  onClick={() => setSelectedVehicle(vehicle.id)}
                  className={\`w-full p-4 border-2 rounded-lg transition-colors \${
                    selectedVehicle === vehicle.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }\`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{vehicle.icon}</span>
                      <div className="text-left">
                        <h4 className="font-semibold text-gray-900">{vehicle.name}</h4>
                        <p className="text-sm text-gray-600">{vehicle.capacity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">R$ {vehicle.price.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">{vehicle.time}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={requestRide}
              disabled={!pickup || !destination}
              className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white py-4 rounded-lg font-semibold transition-colors"
            >
              Solicitar {vehicles.find(v => v.id === selectedVehicle)?.name}
            </button>
          </div>
        )}

        {currentStep === 'searching' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Procurando motorista...</h2>
            <p className="text-gray-600">Encontrando o melhor motorista para você</p>
          </div>
        )}

        {currentStep === 'matched' && (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Motorista encontrado!</h2>
              <p className="text-gray-600">Chegará em 3 minutos</p>
            </div>

            {/* Driver Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-4">
                <img
                  src={driver.photo}
                  alt={driver.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{driver.name}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{driver.rating} ({driver.reviews} viagens)</span>
                  </div>
                  <p className="text-sm text-gray-600">{driver.car} • {driver.plate}</p>
                </div>
                <div className="flex flex-col space-y-2">
                  <button className="p-2 bg-green-600 text-white rounded-lg">
                    <Phone className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-blue-600 text-white rounded-lg">
                    <User className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Trip Details */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">Preço estimado</span>
                <span className="font-bold text-gray-900">
                  R$ {vehicles.find(v => v.id === selectedVehicle)?.price.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tempo estimado</span>
                <span className="font-bold text-gray-900">12 min</span>
              </div>
            </div>

            <button
              onClick={() => setCurrentStep('riding')}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Cancelar Viagem
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default UberClone;`;
  };

  const generateDefaultTemplateCode = (template: any): string => {
    return `import React from 'react';
import { ${template.name.includes('Dashboard') ? 'BarChart3' : 'Code'} } from 'lucide-react';

function ${template.name.replace(/\s+/g, '')}() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          ${template.name}
        </h1>
        <p className="text-gray-600 mb-8">
          ${template.description}
        </p>
        <div className="bg-white p-8 rounded-lg shadow-sm border">
          <${template.name.includes('Dashboard') ? 'BarChart3' : 'Code'} className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">
            Template ${template.name} carregado com sucesso!
          </p>
        </div>
      </div>
    </div>
  );
}

export default ${template.name.replace(/\s+/g, '')};`;
  };

  const generateSmartCode = (prompt: string): string => {
    const lowerPrompt = prompt.toLowerCase();
    
    // Dashboard/Analytics
    if (lowerPrompt.includes('dashboard') || lowerPrompt.includes('analytics')) {
      return `import React, { useState, useEffect } from 'react';
import { BarChart3, Users, TrendingUp, DollarSign, Activity } from 'lucide-react';

function Dashboard() {
  const [metrics, setMetrics] = useState({
    users: 12420,
    revenue: 89500,
    growth: 23.5,
    active: 1847
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Analytics</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.users.toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">R$ {metrics.revenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Growth</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.growth}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Now</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.active.toLocaleString()}</p>
              </div>
              <Activity className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Overview</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <BarChart3 className="w-16 h-16 text-gray-400" />
            <span className="ml-4 text-gray-600">Chart visualization would go here</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;`;
    }
    
    // E-commerce
    if (lowerPrompt.includes('ecommerce') || lowerPrompt.includes('loja') || lowerPrompt.includes('shop')) {
      return `import React, { useState } from 'react';
import { ShoppingCart, Star, Heart, Search } from 'lucide-react';

function EcommerceApp() {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const products = [
    { id: 1, name: 'Smartphone Pro', price: 1299, rating: 4.8, image: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg' },
    { id: 2, name: 'Laptop Ultra', price: 2499, rating: 4.9, image: 'https://images.pexels.com/photos/18105/pexels-photo-18105.jpeg' },
    { id: 3, name: 'Headphones', price: 299, rating: 4.7, image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg' },
    { id: 4, name: 'Smart Watch', price: 599, rating: 4.6, image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg' }
  ];

  const addToCart = (product) => {
    setCart(prev => [...prev, product]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">TechStore</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <ShoppingCart className="w-6 h-6 text-gray-700" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                <div className="flex items-center space-x-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={\`w-4 h-4 \${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}\`}
                    />
                  ))}
                  <span className="text-sm text-gray-600">({product.rating})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-gray-900">R$ {product.price}</span>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default EcommerceApp;`;
    }
    
    // Blog
    if (lowerPrompt.includes('blog') || lowerPrompt.includes('artigo')) {
      return `import React, { useState } from 'react';
import { Calendar, User, Tag, Search, Heart, MessageCircle } from 'lucide-react';

function BlogApp() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const posts = [
    {
      id: 1,
      title: 'Como Criar Apps com IA em 2024',
      excerpt: 'Descubra as melhores práticas para desenvolver aplicações usando inteligência artificial...',
      author: 'João Silva',
      date: '15 Jan 2024',
      category: 'Tecnologia',
      image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg',
      likes: 42,
      comments: 8
    },
    {
      id: 2,
      title: 'O Futuro do Desenvolvimento Web',
      excerpt: 'Tendências que vão moldar o desenvolvimento web nos próximos anos...',
      author: 'Maria Santos',
      date: '12 Jan 2024',
      category: 'Web Dev',
      image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg',
      likes: 38,
      comments: 12
    },
    {
      id: 3,
      title: 'React vs Vue: Qual Escolher?',
      excerpt: 'Comparação detalhada entre os frameworks mais populares do mercado...',
      author: 'Pedro Costa',
      date: '10 Jan 2024',
      category: 'Frameworks',
      image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg',
      likes: 56,
      comments: 15
    }
  ];

  const categories = ['all', 'Tecnologia', 'Web Dev', 'Frameworks'];

  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">TechBlog</h1>
          <p className="text-gray-600 text-center">Artigos sobre tecnologia e desenvolvimento</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={\`px-4 py-2 rounded-full text-sm font-medium transition-colors \${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }\`}
            >
              {category === 'all' ? 'Todos' : category}
            </button>
          ))}
        </div>

        <div className="space-y-8">
          {filteredPosts.map(post => (
            <article key={post.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Tag className="w-4 h-4" />
                      <span>{post.category}</span>
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 cursor-pointer">
                    {post.title}
                  </h2>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                      Ler mais →
                    </button>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.comments}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}

export default BlogApp;`;
    }
    
    // Landing Page
    if (lowerPrompt.includes('landing') || lowerPrompt.includes('homepage') || lowerPrompt.includes('site')) {
      return `import React, { useState } from 'react';
import { Zap, Shield, Globe, Star, ArrowRight, CheckCircle } from 'lucide-react';

function LandingPage() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Transforme suas
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> ideias </span>
            em realidade
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A plataforma mais avançada para criar aplicações web modernas com inteligência artificial
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
              Começar Grátis
            </button>
            <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:border-gray-400 transition-colors">
              Ver Demo
            </button>
          </div>
          
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Sem cartão de crédito</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Setup em 30 segundos</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Suporte 24/7</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Por que escolher nossa plataforma?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Deploy Instantâneo</h3>
              <p className="text-gray-600">Publique suas aplicações em segundos com nossa infraestrutura global</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Segurança Avançada</h3>
              <p className="text-gray-600">SSL automático, proteção DDoS e backup contínuo dos seus projetos</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">CDN Global</h3>
              <p className="text-gray-600">Entrega ultrarrápida em mais de 200 locais ao redor do mundo</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Fique por dentro das novidades
          </h2>
          <p className="text-gray-300 mb-8">
            Receba dicas, tutoriais e atualizações diretamente no seu email
          </p>
          
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Seu melhor email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <span>Inscrever</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          
          {isSubscribed && (
            <div className="mt-4 p-4 bg-green-600 text-white rounded-lg">
              ✅ Obrigado! Você foi inscrito com sucesso.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default LandingPage;`;
    }
    
    // Default: Counter app
    return `import React, { useState } from 'react';
import { Plus, Minus, RotateCcw } from 'lucide-react';

function Counter() {
  const [count, setCount] = useState(0);
  const [history, setHistory] = useState([0]);

  const updateCount = (newCount) => {
    setCount(newCount);
    setHistory(prev => [...prev, newCount].slice(-10)); // Keep last 10 values
  };

  const increment = () => updateCount(count + 1);
  const decrement = () => updateCount(count - 1);
  const reset = () => updateCount(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Contador Inteligente</h1>
          <p className="text-gray-600">Contador com histórico e animações</p>
        </div>
        
        <div className="text-center mb-8">
          <div className="text-8xl font-bold text-blue-600 mb-4 transition-all duration-300 transform hover:scale-110">
            {count}
          </div>
          
          <div className="flex items-center justify-center space-x-4">
            <button 
              onClick={decrement}
              className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full font-medium transition-all duration-200 transform hover:scale-110 active:scale-95 shadow-lg"
            >
              <Minus className="w-6 h-6" />
            </button>
            
            <button 
              onClick={reset}
              className="bg-gray-500 hover:bg-gray-600 text-white p-4 rounded-full font-medium transition-all duration-200 transform hover:scale-110 active:scale-95 shadow-lg"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
            
            <button 
              onClick={increment}
              className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full font-medium transition-all duration-200 transform hover:scale-110 active:scale-95 shadow-lg"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        {history.length > 1 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Histórico:</h3>
            <div className="flex flex-wrap gap-2">
              {history.slice(-5).map((value, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                >
                  {value}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-6 text-center text-sm text-gray-500">
  const generateSocialAppCode = (): string => {
    return `// Redesigned Social App Logic\nimport React from 'react';\n\nexport default function SocialApp() { ... }`;
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-950 overflow-hidden">
      {/* Header */}
      <div className="h-10 flex items-center justify-between px-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center justify-center">
            <Bot className="w-3 h-3 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Assistant</span>
        </div>
        <div className="flex items-center space-x-1">
          <button 
            onClick={() => setMessages([])}
            className="btn-icon-sm text-gray-500 hover:text-red-500"
            title="Clear Chat"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button 
            className="btn-icon-sm"
            title="Settings"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((message: Message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
              <div
                className={`px-4 py-3 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white ml-4'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white mr-4'
                }`}
              >
                <p className="whitespace-pre-wrap">
                  {message.content}
                  {message.isStreaming && (
                    <span className="inline-block w-2 h-5 bg-current ml-1 animate-pulse" />
                  )}
                </p>
              </div>
              <p className={`text-xs text-gray-500 mt-1 ${
                message.type === 'user' ? 'text-right mr-4' : 'text-left ml-4'
              }`}>
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              message.type === 'user' 
                ? 'bg-blue-600 order-1' 
                : 'bg-gray-600 dark:bg-gray-600 order-2'
            }`}>
              {message.type === 'user' ? (
                <span className="text-white font-medium text-sm">U</span>
              ) : (
                <Bot className="w-5 h-5 text-white" />
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Processing Steps */}
      {isProcessing && (
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
          <ProcessingSteps />
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="relative flex items-end space-x-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-1.5 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Pergunte qualquer coisa..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-xs py-1.5 px-2 resize-none max-h-32 dark:text-gray-200 placeholder-gray-500"
              rows={1}
              disabled={isProcessing}
            />
            <div className="flex items-center space-x-1 pb-0.5">
              <input 
                type="file" 
                id="file-upload" 
                multiple 
                className="hidden" 
                onChange={(e) => setAttachedFiles(Array.from(e.target.files || []))}
              />
              <input 
                type="file" 
                id="folder-upload" 
                {...({ webkitdirectory: '', directory: '' } as any)}
                className="hidden" 
                onChange={(e) => setAttachedFiles(Array.from(e.target.files || []))}
              />
              
              <label 
                htmlFor="file-upload"
                className="btn-icon-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                title={getTranslation(language, 'chat.attach')}
              >
                <Paperclip className="w-3.5 h-3.5" />
              </label>

              <label 
                htmlFor="folder-upload"
                className="btn-icon-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                title={getTranslation(language, 'chat.folder')}
              >
                <FolderPlus className="w-3.5 h-3.5" />
              </label>
              <button
                type="submit"
                disabled={(!inputValue.trim() && attachedFiles.length === 0) || isProcessing}
                className={`btn-icon-sm bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all`}
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* AI Assistant Modal */}
      <AIAssistant 
        isOpen={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
        prompt={inputValue}
        onOptimizedPrompt={(optimized: string) => {
          setInputValue(optimized);
          // Auto-resize textarea
          if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
          }
        }}
      />

      {/* Dependency Manager Modal */}
      <DependencyManager 
        isOpen={showDependencyManager}
        onClose={() => setShowDependencyManager(false)}
      />

      {/* Ollama Settings Modal */}
      {/* Templates Modal */}
      <TemplatesModal 
        isOpen={showTemplatesModal}
        onClose={() => setShowTemplatesModal(false)}
        onTemplateSelect={handleTemplateSelect}
      />
    </div>
  );
};

export default ChatArea;