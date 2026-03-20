import React, { useState } from 'react';
import { 
  X, 
  Search, 
  HelpCircle, 
  MessageSquare, 
  Phone, 
  Mail, 
  ExternalLink,
  ChevronRight,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  Info,
  Lightbulb,
  Book,
  Video,
  FileText,
  Headphones,
  Star,
  ThumbsUp,
  Eye,
  Calendar,
  Tag,
  Filter,
  Grid3X3,
  List,
  Plus,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

interface HelpCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

interface HelpArticle {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'article' | 'video' | 'tutorial' | 'faq';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readTime: string;
  views: number;
  likes: number;
  lastUpdated: string;
  isPopular: boolean;
  content: string;
  tags: string[];
}

interface SupportTicket {
  id: string;
  subject: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created: string;
  lastReply: string;
}

const HelpCenter: React.FC<HelpCenterProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'articles' | 'contact' | 'tickets'>('articles');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketMessage, setNewTicketMessage] = useState('');
  const [tabHistory, setTabHistory] = useState<string[]>(['articles']);
  const [tabHistoryIndex, setTabHistoryIndex] = useState(0);
  const [categoryHistory, setCategoryHistory] = useState<string[]>(['all']);
  const [categoryHistoryIndex, setCategoryHistoryIndex] = useState(0);

  const navigateToTab = (tabId: string) => {
    setActiveTab(tabId);
    
    // Update history
    const newHistory = tabHistory.slice(0, tabHistoryIndex + 1);
    newHistory.push(tabId);
    setTabHistory(newHistory);
    setTabHistoryIndex(newHistory.length - 1);
  };

  const goBackTab = () => {
    if (tabHistoryIndex > 0) {
      const newIndex = tabHistoryIndex - 1;
      setTabHistoryIndex(newIndex);
      setActiveTab(tabHistory[newIndex]);
    }
  };

  const goForwardTab = () => {
    if (tabHistoryIndex < tabHistory.length - 1) {
      const newIndex = tabHistoryIndex + 1;
      setTabHistoryIndex(newIndex);
      setActiveTab(tabHistory[newIndex]);
    }
  };

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

  const categories = [
    { id: 'all', name: 'Todos', icon: Book },
    { id: 'getting-started', name: 'Começando', icon: Lightbulb },
    { id: 'projects', name: 'Projetos', icon: FileText },
    { id: 'deployment', name: 'Deploy', icon: ExternalLink },
    { id: 'billing', name: 'Billing', icon: MessageSquare },
    { id: 'troubleshooting', name: 'Problemas', icon: AlertCircle },
    { id: 'api', name: 'API', icon: FileText }
  ];

  const articles: HelpArticle[] = [
    {
      id: '1',
      title: 'Como criar meu primeiro projeto?',
      description: 'Guia passo-a-passo para criar seu primeiro projeto no MAXIMUS.DEV',
      category: 'getting-started',
      type: 'tutorial',
      difficulty: 'beginner',
      readTime: '5 min',
      views: 25420,
      likes: 456,
      lastUpdated: '2 dias atrás',
      isPopular: true,
      tags: ['iniciante', 'projeto', 'tutorial'],
      content: `# Como criar meu primeiro projeto?

## Passo 1: Acesse o MAXIMUS.DEV
Faça login na sua conta ou crie uma nova gratuitamente.

## Passo 2: Descreva sua ideia
No chat, digite o que você quer construir. Por exemplo:
- "Criar um contador simples"
- "Dashboard com gráficos"
- "Blog pessoal"

## Passo 3: IA gera o código
Nossa IA vai analisar sua descrição e gerar código otimizado automaticamente.

## Passo 4: Visualize o resultado
O código aparece no editor e o preview é atualizado em tempo real.

## Passo 5: Deploy (opcional)
Clique em "Deploy" para publicar seu projeto instantaneamente.

## Dicas importantes:
- Seja específico na descrição
- Use exemplos visuais quando possível
- Teste diferentes prompts para melhores resultados`
    },
    {
      id: '2',
      title: 'Como fazer deploy do meu projeto?',
      description: 'Aprenda a publicar suas aplicações com um clique',
      category: 'deployment',
      type: 'article',
      difficulty: 'beginner',
      readTime: '3 min',
      views: 18750,
      likes: 234,
      lastUpdated: '1 semana atrás',
      isPopular: true,
      tags: ['deploy', 'publicação', 'cdn'],
      content: `# Como fazer deploy do meu projeto?

## Deploy Automático
O MAXIMUS.DEV oferece deploy com um clique:

1. **Clique em "Deploy"** no topo da tela
2. **IA otimiza** o build automaticamente
3. **CDN global** distribui em 200+ locais
4. **SSL A+** configurado automaticamente
5. **URL única** gerada instantaneamente

## Recursos inclusos:
- ⚡ Build otimizado
- 🌐 CDN global
- 🔒 SSL automático
- 📊 Analytics integrado
- 🔄 Auto-scaling
- 💾 Backup automático

## Domínio personalizado:
Para usar seu próprio domínio, acesse as configurações de deploy.`
    },
    {
      id: '3',
      title: 'Problemas comuns e soluções',
      description: 'Resolva os problemas mais frequentes rapidamente',
      category: 'troubleshooting',
      type: 'faq',
      difficulty: 'intermediate',
      readTime: '10 min',
      views: 12340,
      likes: 189,
      lastUpdated: '4 dias atrás',
      isPopular: false,
      tags: ['problemas', 'soluções', 'debug'],
      content: `# Problemas comuns e soluções

## ❌ "Código não está sendo gerado"
**Solução:**
- Verifique sua conexão com internet
- Tente ser mais específico no prompt
- Reinicie a página se necessário

## ❌ "Deploy falhou"
**Solução:**
- Verifique se há erros no código
- Confirme que todas as dependências estão instaladas
- Tente fazer deploy novamente

## ❌ "Preview não carrega"
**Solução:**
- Aguarde o código ser totalmente gerado
- Verifique se há erros de sintaxe
- Recarregue o preview manualmente

## ❌ "IA não responde"
**Solução:**
- Verifique se você tem créditos disponíveis
- Tente um prompt mais simples
- Entre em contato com o suporte`
    },
    {
      id: '4',
      title: 'Configuração de pagamentos com Stripe',
      description: 'Integre pagamentos em seus projetos facilmente',
      category: 'billing',
      type: 'tutorial',
      difficulty: 'intermediate',
      readTime: '8 min',
      views: 9870,
      likes: 167,
      lastUpdated: '1 semana atrás',
      isPopular: false,
      tags: ['stripe', 'pagamentos', 'integração'],
      content: `# Configuração de pagamentos com Stripe

## Setup automático
O MAXIMUS.DEV configura Stripe automaticamente:

1. **Conecte sua conta Stripe**
2. **IA configura webhooks**
3. **Métodos de pagamento** ativados
4. **Dashboard** integrado

## Métodos suportados:
- 💳 Cartões (Visa, Master, Elo)
- 🇧🇷 PIX (Brasil)
- 📄 Boleto bancário
- 💰 Carteiras digitais

## Configuração manual:
Se preferir configurar manualmente, acesse o painel de integrações.`
    },
    {
      id: '5',
      title: 'API Reference - Endpoints principais',
      description: 'Documentação completa da API MAXIMUS.DEV',
      category: 'api',
      type: 'article',
      difficulty: 'advanced',
      readTime: '15 min',
      views: 5670,
      likes: 89,
      lastUpdated: '2 semanas atrás',
      isPopular: false,
      tags: ['api', 'endpoints', 'integração'],
      content: `# API Reference

## Autenticação
Todas as requisições precisam de um token:

\`\`\`bash
curl -H "Authorization: Bearer YOUR_TOKEN" \\
     https://api.maximus.dev/v1/projects
\`\`\`

## Endpoints principais:

### GET /v1/projects
Lista todos os projetos

### POST /v1/projects
Cria um novo projeto

### POST /v1/ai/generate
Gera código com IA

### POST /v1/deploy
Faz deploy de um projeto

## Rate limits:
- Free: 100 req/hour
- Pro: 1000 req/hour
- Enterprise: Unlimited`
    }
  ];

  const tickets: SupportTicket[] = [
    {
      id: 'TKT-001',
      subject: 'Deploy não está funcionando',
      status: 'in-progress',
      priority: 'high',
      created: '2 horas atrás',
      lastReply: '1 hora atrás'
    },
    {
      id: 'TKT-002',
      subject: 'Dúvida sobre billing',
      status: 'resolved',
      priority: 'medium',
      created: '1 dia atrás',
      lastReply: '6 horas atrás'
    },
    {
      id: 'TKT-003',
      subject: 'Integração com Stripe',
      status: 'open',
      priority: 'low',
      created: '3 dias atrás',
      lastReply: '2 dias atrás'
    }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const selectedArticleData = selectedArticle ? articles.find(article => article.id === selectedArticle) : null;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'video': return <Video className="w-4 h-4 text-red-500" />;
      case 'tutorial': return <Book className="w-4 h-4 text-green-500" />;
      case 'faq': return <HelpCircle className="w-4 h-4 text-purple-500" />;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'advanced': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Iniciante';
      case 'intermediate': return 'Intermediário';
      case 'advanced': return 'Avançado';
      default: return difficulty;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'in-progress': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'resolved': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'closed': return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open': return 'Aberto';
      case 'in-progress': return 'Em Andamento';
      case 'resolved': return 'Resolvido';
      case 'closed': return 'Fechado';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      case 'high': return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'Urgente';
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return priority;
    }
  };

  const handleCreateTicket = () => {
    if (!newTicketSubject.trim() || !newTicketMessage.trim()) return;
    
    console.log('Criando ticket:', { subject: newTicketSubject, message: newTicketMessage });
    setNewTicketSubject('');
    setNewTicketMessage('');
    alert('🎫 Ticket Criado!\n\n✅ Sua solicitação foi registrada\n📧 Você receberá atualizações por email\n⏱️ Tempo de resposta: 2-4 horas');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-[1200px] h-[800px] shadow-xl flex">
        {/* Sidebar */}
        {activeTab === 'articles' && !selectedArticle && (
          <div className="w-80 bg-gray-50 dark:bg-gray-700 rounded-l-lg border-r border-gray-200 dark:border-gray-600">
            <div className="p-6 border-b border-gray-200 dark:border-gray-600">
              <div className="flex items-center space-x-3">
                <HelpCircle className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Central de Ajuda
                </h2>
              </div>
            </div>
            
            <div className="p-4">
              {/* Navigation Controls */}
              <div className="flex items-center space-x-1 mb-4 pb-4 border-b border-gray-200 dark:border-gray-600">
                <button
                  onClick={goBackCategory}
                  disabled={categoryHistoryIndex <= 0}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Voltar"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={goForwardCategory}
                  disabled={categoryHistoryIndex >= categoryHistory.length - 1}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Avançar"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="flex-1 text-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {categoryHistoryIndex + 1}/{categoryHistory.length}
                  </span>
                </div>
              </div>

              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Categorias</h3>
              <div className="space-y-1">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => navigateToCategory(category.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{category.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {selectedArticle && (
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Voltar</span>
                  </button>
                )}
                
                {!selectedArticle && (
                  <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                    {/* Tab Navigation Controls */}
                    <div className="flex items-center space-x-1 mr-2">
                      <button
                        onClick={goBackTab}
                        disabled={tabHistoryIndex <= 0}
                        className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Voltar"
                      >
                        <ArrowLeft className="w-3 h-3" />
                      </button>
                      <button
                        onClick={goForwardTab}
                        disabled={tabHistoryIndex >= tabHistory.length - 1}
                        className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Avançar"
                      >
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    {[
                      { id: 'articles', label: 'Artigos', icon: Book },
                      { id: 'contact', label: 'Contato', icon: MessageSquare },
                      { id: 'tickets', label: 'Tickets', icon: Headphones }
                    ].map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => navigateToTab(tab.id)}
                          className={`flex items-center space-x-2 px-3 py-2 rounded text-sm font-medium transition-colors ${
                            activeTab === tab.id
                              ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-white shadow-sm'
                              : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search (only for articles tab and not viewing specific article) */}
            {activeTab === 'articles' && !selectedArticle && (
              <div className="mt-4 flex items-center space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar artigos, tutoriais, FAQs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'articles' && !selectedArticle && (
              <div className="p-6">
                {filteredArticles.length > 0 ? (
                  viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredArticles.map((article) => (
                        <div
                          key={article.id}
                          onClick={() => setSelectedArticle(article.id)}
                          className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              {getTypeIcon(article.type)}
                              {article.isPopular && (
                                <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 text-xs font-medium rounded-full">
                                  Popular
                                </span>
                              )}
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(article.difficulty)}`}>
                              {getDifficultyLabel(article.difficulty)}
                            </span>
                          </div>
                          
                          <h3 className="font-semibold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                            {article.title}
                          </h3>
                          
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                            {article.description}
                          </p>
                          
                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center space-x-3">
                              <span className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{article.readTime}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Eye className="w-3 h-3" />
                                <span>{article.views.toLocaleString()}</span>
                              </span>
                            </div>
                            <span>{article.lastUpdated}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredArticles.map((article) => (
                        <div
                          key={article.id}
                          onClick={() => setSelectedArticle(article.id)}
                          className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                {getTypeIcon(article.type)}
                                <h3 className="font-semibold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                  {article.title}
                                </h3>
                                {article.isPopular && (
                                  <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 text-xs font-medium rounded-full">
                                    Popular
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                {article.description}
                              </p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                                <span className={`px-2 py-1 rounded-full font-medium ${getDifficultyColor(article.difficulty)}`}>
                                  {getDifficultyLabel(article.difficulty)}
                                </span>
                                <span className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{article.readTime}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <Eye className="w-3 h-3" />
                                  <span>{article.views.toLocaleString()}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <ThumbsUp className="w-3 h-3" />
                                  <span>{article.likes}</span>
                                </span>
                                <span>{article.lastUpdated}</span>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors ml-4" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="text-center py-12">
                    <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-300 font-medium">
                      Nenhum artigo encontrado
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Tente ajustar os termos de busca ou categoria
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'articles' && selectedArticle && selectedArticleData && (
              <div className="p-6 h-full overflow-y-auto">
                <div className="max-w-4xl">
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                    {selectedArticleData.title}
                  </h1>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300 mb-6">
                    <span className={`px-2 py-1 rounded-full font-medium ${getDifficultyColor(selectedArticleData.difficulty)}`}>
                      {getDifficultyLabel(selectedArticleData.difficulty)}
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{selectedArticleData.readTime}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{selectedArticleData.views.toLocaleString()}</span>
                    </span>
                    <span>Atualizado {selectedArticleData.lastUpdated}</span>
                  </div>
                  
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <div className="whitespace-pre-wrap text-gray-800 dark:text-white leading-relaxed">
                      {selectedArticleData.content}
                    </div>
                  </div>
                  
                  {selectedArticleData.codeExample && (
                    <div className="mt-8">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                          💻 Exemplo de Código
                        </h3>
                        <button
                          onClick={() => navigator.clipboard.writeText(selectedArticleData.codeExample!)}
                          className="flex items-center space-x-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copiar</span>
                        </button>
                      </div>
                      <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{selectedArticleData.codeExample}</code>
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
                  Entre em Contato
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg">
                      <div className="flex items-center space-x-3 mb-4">
                        <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        <h4 className="font-semibold text-blue-800 dark:text-blue-200">Chat ao Vivo</h4>
                      </div>
                      <p className="text-blue-700 dark:text-blue-300 mb-4">
                        Suporte instantâneo 24/7 para usuários Pro
                      </p>
                      <button
                        onClick={() => alert('💬 Chat ao Vivo Iniciado!\n\n🤖 IA + Humano disponível\n⚡ Resposta em segundos\n🎯 Suporte especializado')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Iniciar Chat
                      </button>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900 p-6 rounded-lg">
                      <div className="flex items-center space-x-3 mb-4">
                        <Mail className="w-6 h-6 text-green-600 dark:text-green-400" />
                        <h4 className="font-semibold text-green-800 dark:text-green-200">Email</h4>
                      </div>
                      <p className="text-green-700 dark:text-green-300 mb-4">
                        suporte@maximus.dev
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        Resposta em até 24h
                      </p>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900 p-6 rounded-lg">
                      <div className="flex items-center space-x-3 mb-4">
                        <Phone className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        <h4 className="font-semibold text-purple-800 dark:text-purple-200">Telefone</h4>
                      </div>
                      <p className="text-purple-700 dark:text-purple-300 mb-4">
                        +55 11 3000-0000
                      </p>
                      <p className="text-sm text-purple-600 dark:text-purple-400">
                        Seg-Sex, 9h às 18h
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                      Enviar Mensagem
                    </h4>
                    <form className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Assunto
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Descreva brevemente seu problema"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Mensagem
                        </label>
                        <textarea
                          rows={6}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Descreva seu problema em detalhes..."
                        />
                      </div>
                      <button
                        type="submit"
                        onClick={(e) => {
                          e.preventDefault();
                          alert('📧 Mensagem Enviada!\n\n✅ Recebemos sua mensagem\n📧 Resposta em até 24h\n🎯 Ticket criado automaticamente');
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                      >
                        Enviar Mensagem
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tickets' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Meus Tickets de Suporte
                  </h3>
                  <button
                    onClick={() => {
                      setNewTicketSubject('');
                      setNewTicketMessage('');
                      // Show create ticket form
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Novo Ticket</span>
                  </button>
                </div>

                {/* Create Ticket Form */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-6">
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                    Criar Novo Ticket
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Assunto
                      </label>
                      <input
                        type="text"
                        value={newTicketSubject}
                        onChange={(e) => setNewTicketSubject(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Descreva brevemente o problema"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Descrição
                      </label>
                      <textarea
                        value={newTicketMessage}
                        onChange={(e) => setNewTicketMessage(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Descreva o problema em detalhes..."
                      />
                    </div>
                    <button
                      onClick={handleCreateTicket}
                      disabled={!newTicketSubject.trim() || !newTicketMessage.trim()}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Criar Ticket
                    </button>
                  </div>
                </div>

                {/* Tickets List */}
                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-800 dark:text-white">
                          {ticket.subject}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                            {getPriorityLabel(ticket.priority)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                            {getStatusLabel(ticket.status)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                        <span>#{ticket.id}</span>
                        <div className="flex items-center space-x-4">
                          <span>Criado {ticket.created}</span>
                          <span>Última resposta {ticket.lastReply}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;