import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Book, 
  Code, 
  Zap, 
  Database, 
  Globe,
  ArrowRight,
  ExternalLink,
  Copy,
  CheckCircle,
  Play,
  Download,
  Star,
  Clock,
  User,
  Tag,
  Filter,
  Grid3X3,
  List,
  Bookmark,
  Heart,
  Eye,
  MessageSquare,
  ThumbsUp,
  Share,
  ArrowLeft
} from 'lucide-react';

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DocSection {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readTime: string;
  lastUpdated: string;
  views: number;
  likes: number;
  isBookmarked: boolean;
  content: string;
  codeExample?: string;
}

const DocsModal: React.FC<DocsModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
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

  const categories = [
    { id: 'all', name: 'Todos', icon: Book },
    { id: 'getting-started', name: 'Começando', icon: Zap },
    { id: 'components', name: 'Componentes', icon: Code },
    { id: 'database', name: 'Database', icon: Database },
    { id: 'deployment', name: 'Deploy', icon: Globe },
    { id: 'api', name: 'API', icon: Code },
    { id: 'examples', name: 'Exemplos', icon: Play }
  ];

  const docs: DocSection[] = [
    {
      id: '1',
      title: 'Primeiros Passos com MAXIMUS.DEV',
      description: 'Aprenda a criar seu primeiro projeto em minutos',
      category: 'getting-started',
      difficulty: 'beginner',
      readTime: '5 min',
      lastUpdated: '2 dias atrás',
      views: 15420,
      likes: 342,
      isBookmarked: false,
      content: `# Primeiros Passos com MAXIMUS.DEV

Bem-vindo ao MAXIMUS.DEV! Esta documentação vai te guiar pelos primeiros passos para criar aplicações incríveis.

## O que é MAXIMUS.DEV?

MAXIMUS.DEV é uma plataforma de desenvolvimento que usa IA para acelerar a criação de aplicações web modernas.

## Criando seu Primeiro Projeto

1. **Descreva sua ideia**: Digite o que você quer construir
2. **IA gera o código**: Nossa IA cria código otimizado
3. **Deploy instantâneo**: Publique em segundos

## Recursos Principais

- 🤖 **IA Avançada**: GPT-4 integrado
- ⚡ **Deploy 1-Click**: CDN global automático
- 🗄️ **Database IA**: Supabase auto-configurado
- 💳 **Payments**: Stripe integrado
- 🔒 **Segurança**: SSL A+ automático`,
      codeExample: `// Exemplo: Criar um componente React
import React from 'react';

function Welcome() {
  return (
    <div className="text-center p-8">
      <h1 className="text-4xl font-bold text-blue-600">
        Bem-vindo ao MAXIMUS.DEV! 🚀
      </h1>
    </div>
  );
}

export default Welcome;`
    },
    {
      id: '2',
      title: 'Componentes React Avançados',
      description: 'Criando componentes reutilizáveis e performáticos',
      category: 'components',
      difficulty: 'intermediate',
      readTime: '12 min',
      lastUpdated: '1 semana atrás',
      views: 8930,
      likes: 156,
      isBookmarked: true,
      content: `# Componentes React Avançados

Aprenda a criar componentes React profissionais com TypeScript e Tailwind CSS.

## Estrutura de Componentes

### Props Interface
Sempre defina interfaces TypeScript para suas props:

\`\`\`typescript
interface ButtonProps {
  variant: 'primary' | 'secondary';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}
\`\`\`

### Componente Reutilizável
\`\`\`typescript
const Button: React.FC<ButtonProps> = ({ 
  variant, 
  size, 
  children, 
  onClick 
}) => {
  const baseClasses = 'font-medium rounded-lg transition-colors';
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800'
  };
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      onClick={onClick}
      className={\`\${baseClasses} \${variantClasses[variant]} \${sizeClasses[size]}\`}
    >
      {children}
    </button>
  );
};
\`\`\`

## Boas Práticas

1. **Sempre use TypeScript** para type safety
2. **Componentes pequenos** e focados
3. **Props bem definidas** com interfaces
4. **Memoização** quando necessário`,
      codeExample: `import React, { memo } from 'react';

interface CardProps {
  title: string;
  description: string;
  image?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = memo(({ 
  title, 
  description, 
  image, 
  onClick 
}) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
    >
      {image && (
        <img 
          src={image} 
          alt={title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-gray-600">
          {description}
        </p>
      </div>
    </div>
  );
});

export default Card;`
    },
    {
      id: '3',
      title: 'Configuração de Database com Supabase',
      description: 'Setup completo de banco de dados PostgreSQL',
      category: 'database',
      difficulty: 'intermediate',
      readTime: '15 min',
      lastUpdated: '3 dias atrás',
      views: 12450,
      likes: 289,
      isBookmarked: false,
      content: `# Configuração de Database com Supabase

O MAXIMUS.DEV integra automaticamente com Supabase para fornecer um banco PostgreSQL completo.

## Setup Automático

1. **Clique em "Conectar Supabase"** no topo da tela
2. **IA configura tudo** automaticamente
3. **Tabelas criadas** com RLS habilitado
4. **Tipos TypeScript** gerados automaticamente

## Estrutura de Tabelas

### Tabela de Usuários
\`\`\`sql
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);
\`\`\`

## Client Setup

\`\`\`typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

// Buscar dados
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId);

// Inserir dados
const { data, error } = await supabase
  .from('users')
  .insert([{ name: 'João', email: 'joao@example.com' }]);
\`\`\``,
      codeExample: `import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Erro:', error);
      } else {
        setUser(data);
      }
      setLoading(false);
    }

    fetchUser();
  }, [userId]);

  if (loading) return <div>Carregando...</div>;
  if (!user) return <div>Usuário não encontrado</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-2">{user.name}</h2>
      <p className="text-gray-600">{user.email}</p>
    </div>
  );
}`
    },
    {
      id: '4',
      title: 'Deploy Automático',
      description: 'Como fazer deploy de suas aplicações instantaneamente',
      category: 'deployment',
      difficulty: 'beginner',
      readTime: '8 min',
      lastUpdated: '1 dia atrás',
      views: 18750,
      likes: 445,
      isBookmarked: true,
      content: `# Deploy Automático

O MAXIMUS.DEV oferece deploy instantâneo com CDN global e SSL automático.

## Como Funciona

1. **Código pronto**: Sua aplicação está funcionando
2. **Um clique**: Botão "Deploy" no topo
3. **IA otimiza**: Build automático otimizado
4. **CDN global**: Distribuição em 200+ locais
5. **SSL A+**: Certificado automático
6. **URL única**: Link personalizado gerado

## Recursos do Deploy

- ⚡ **Build otimizado**: Minificação automática
- 🌐 **CDN global**: Edge locations worldwide
- 🔒 **SSL A+**: Certificado Let's Encrypt
- 📊 **Analytics**: Métricas integradas
- 🔄 **Auto-scaling**: Escala conforme demanda
- 💾 **Backup**: Versões anteriores salvas

## Configurações Avançadas

### Custom Domain
\`\`\`bash
# Configurar domínio personalizado
maximus domain add meusite.com
maximus ssl enable meusite.com
\`\`\`

### Environment Variables
\`\`\`bash
# Adicionar variáveis de ambiente
maximus env set API_KEY=sua_chave_aqui
maximus env set DATABASE_URL=sua_url_aqui
\`\`\``,
      codeExample: `// Configuração de deploy no package.json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "maximus deploy"
  },
  "maximus": {
    "buildCommand": "npm run build",
    "outputDirectory": "dist",
    "environmentVariables": {
      "NODE_ENV": "production"
    }
  }
}`
    },
    {
      id: '5',
      title: 'API Reference Completa',
      description: 'Documentação completa da API MAXIMUS.DEV',
      category: 'api',
      difficulty: 'advanced',
      readTime: '20 min',
      lastUpdated: '5 dias atrás',
      views: 6780,
      likes: 123,
      isBookmarked: false,
      content: `# API Reference

A API MAXIMUS.DEV permite integração completa com sua plataforma.

## Autenticação

Todas as requisições precisam de um token de API:

\`\`\`bash
curl -H "Authorization: Bearer YOUR_API_TOKEN" \\
     https://api.maximus.dev/v1/projects
\`\`\`

## Endpoints Principais

### Projetos

#### Listar Projetos
\`GET /v1/projects\`

#### Criar Projeto
\`POST /v1/projects\`

\`\`\`json
{
  "name": "Meu Projeto",
  "description": "Descrição do projeto",
  "template": "react-typescript",
  "framework": "react"
}
\`\`\`

#### Fazer Deploy
\`POST /v1/projects/:id/deploy\`

### IA

#### Gerar Código
\`POST /v1/ai/generate\`

\`\`\`json
{
  "prompt": "Criar um dashboard com gráficos",
  "framework": "react",
  "style": "tailwind"
}
\`\`\`

## Rate Limits

- **Free**: 100 requests/hour
- **Pro**: 1000 requests/hour  
- **Enterprise**: Unlimited

## Webhooks

Configure webhooks para receber notificações:

\`\`\`json
{
  "url": "https://seu-site.com/webhook",
  "events": ["deploy.completed", "project.created"],
  "secret": "webhook_secret"
}
\`\`\``,
      codeExample: `// SDK JavaScript para MAXIMUS.DEV
import { MAXIMUS.DEVClient } from '@maximusdev/sdk';

const client = new MAXIMUS.DEVClient({
  apiKey: process.env.MAXIMUS.DEV_API_KEY
});

// Criar projeto
const project = await client.projects.create({
  name: 'Minha App',
  template: 'react-typescript'
});

// Gerar código com IA
const code = await client.ai.generate({
  prompt: 'Dashboard com métricas',
  framework: 'react'
});

// Fazer deploy
const deployment = await client.projects.deploy(project.id);

console.log('Deploy URL:', deployment.url);`
    }
  ];

  const filteredDocs = docs.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const selectedDocData = selectedDoc ? docs.find(doc => doc.id === selectedDoc) : null;

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

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      alert('📋 Código copiado para área de transferência!');
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-[1200px] h-[800px] shadow-xl flex">
        {/* Sidebar */}
        <div className="w-80 bg-gray-50 dark:bg-gray-700 rounded-l-lg border-r border-gray-200 dark:border-gray-600">
          <div className="p-6 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-3">
              <Book className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Documentação
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
                <ArrowLeft className="w-4 h-4 rotate-180" />
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

        {/* Content */}
        <div className="flex-1 flex flex-col">
          {!selectedDoc ? (
            <>
              {/* Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      Documentação MAXIMUS.DEV
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Guias completos e exemplos práticos
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors mt-6"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Search and View Mode */}
                <div className="flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar na documentação..."
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
              </div>

              {/* Docs List */}
              <div className="flex-1 overflow-y-auto p-6">
                {filteredDocs.length > 0 ? (
                  viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredDocs.map((doc) => (
                        <div
                          key={doc.id}
                          onClick={() => setSelectedDoc(doc.id)}
                          className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-semibold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {doc.title}
                            </h3>
                            <div className="flex items-center space-x-1">
                              {doc.isBookmarked && (
                                <Bookmark className="w-4 h-4 text-yellow-500" fill="currentColor" />
                              )}
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                            {doc.description}
                          </p>
                          
                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                            <span className={`px-2 py-1 rounded-full font-medium ${getDifficultyColor(doc.difficulty)}`}>
                              {getDifficultyLabel(doc.difficulty)}
                            </span>
                            <div className="flex items-center space-x-3">
                              <span className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{doc.readTime}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Eye className="w-3 h-3" />
                                <span>{doc.views.toLocaleString()}</span>
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Atualizado {doc.lastUpdated}
                            </span>
                            <div className="flex items-center space-x-1">
                              <ThumbsUp className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500 dark:text-gray-400">{doc.likes}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredDocs.map((doc) => (
                        <div
                          key={doc.id}
                          onClick={() => setSelectedDoc(doc.id)}
                          className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
                                {doc.title}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                {doc.description}
                              </p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                                <span className={`px-2 py-1 rounded-full font-medium ${getDifficultyColor(doc.difficulty)}`}>
                                  {getDifficultyLabel(doc.difficulty)}
                                </span>
                                <span className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{doc.readTime}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <Eye className="w-3 h-3" />
                                  <span>{doc.views.toLocaleString()}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <ThumbsUp className="w-3 h-3" />
                                  <span>{doc.likes}</span>
                                </span>
                                <span>Atualizado {doc.lastUpdated}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              {doc.isBookmarked && (
                                <Bookmark className="w-4 h-4 text-yellow-500" fill="currentColor" />
                              )}
                              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="text-center py-12">
                    <Book className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-300 font-medium">
                      Nenhuma documentação encontrada
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Tente ajustar os termos de busca
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Doc Content View */
            <div className="flex flex-col h-full">
              {/* Doc Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setSelectedDoc(null)}
                    className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Voltar para lista</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {selectedDocData && (
                  <div className="mt-4">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                      {selectedDocData.title}
                    </h1>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                      <span className={`px-2 py-1 rounded-full font-medium ${getDifficultyColor(selectedDocData.difficulty)}`}>
                        {getDifficultyLabel(selectedDocData.difficulty)}
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{selectedDocData.readTime}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{selectedDocData.views.toLocaleString()} visualizações</span>
                      </span>
                      <span>Atualizado {selectedDocData.lastUpdated}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Doc Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {selectedDocData && (
                  <div className="max-w-4xl">
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                      <div className="whitespace-pre-wrap text-gray-800 dark:text-white leading-relaxed">
                        {selectedDocData.content}
                      </div>
                    </div>
                    
                    {selectedDocData.codeExample && (
                      <div className="mt-8">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                            💻 Exemplo de Código
                          </h3>
                          <button
                            onClick={() => handleCopyCode(selectedDocData.codeExample!)}
                            className="flex items-center space-x-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copiar</span>
                          </button>
                        </div>
                        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{selectedDocData.codeExample}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Doc Footer */}
              {selectedDocData && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => {
                          // Toggle bookmark
                          const updatedDocs = docs.map(doc => 
                            doc.id === selectedDocData.id 
                              ? { ...doc, isBookmarked: !doc.isBookmarked }
                              : doc
                          );
                          console.log('Bookmark toggled');
                        }}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
                          selectedDocData.isBookmarked
                            ? 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900 dark:text-yellow-300'
                            : 'text-gray-600 dark:text-gray-300 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900'
                        }`}
                      >
                        <Bookmark className="w-4 h-4" fill={selectedDocData.isBookmarked ? 'currentColor' : 'none'} />
                        <span className="text-sm">
                          {selectedDocData.isBookmarked ? 'Salvo' : 'Salvar'}
                        </span>
                      </button>
                      
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href);
                          alert('🔗 Link copiado para área de transferência!');
                        }}
                        className="flex items-center space-x-1 px-3 py-1 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        <Share className="w-4 h-4" />
                        <span className="text-sm">Compartilhar</span>
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                      <span>Esta documentação foi útil?</span>
                      <button
                        onClick={() => alert('👍 Obrigado pelo feedback!')}
                        className="flex items-center space-x-1 px-2 py-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded transition-colors"
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>Sim</span>
                      </button>
                      <button
                        onClick={() => alert('👎 Obrigado pelo feedback! Vamos melhorar.')}
                        className="flex items-center space-x-1 px-2 py-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors"
                      >
                        <ThumbsUp className="w-3 h-3 rotate-180" />
                        <span>Não</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocsModal;