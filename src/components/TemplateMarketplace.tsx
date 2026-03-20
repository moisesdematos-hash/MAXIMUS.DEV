import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Sparkles, 
  Zap, 
  ShoppingBag, 
  Layout, 
  Smartphone, 
  Database, 
  TrendingUp, 
  ChevronRight,
  Star
} from 'lucide-react';
import { useUI } from '../contexts/UIContext';
import { useProjects } from '../contexts/ProjectContext';
import { useMultiAgent } from '../hooks/useMultiAgent';
import { UserDna } from '../lib/userDna';

interface Blueprint {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  tags: string[];
  color: string;
  popular?: boolean;
  industry: string;
}

const blueprints: Blueprint[] = [
  {
    id: 'ecommerce-pro',
    name: 'E-commerce Pro',
    description: 'Plataforma completa de vendas com Stripe, Supabase e SEO otimizado.',
    category: 'Vendas',
    icon: <ShoppingBag className="w-6 h-6" />,
    tags: ['React', 'Stripe', 'Supabase'],
    color: 'from-blue-500 to-indigo-600',
    popular: true,
    industry: 'Varejo'
  },
  {
    id: 'saas-moderno',
    name: 'SaaS Moderno',
    description: 'Painel administrativo com assinaturas, autenticação e suporte a múltiplos workspaces.',
    category: 'Software',
    icon: <Layout className="w-6 h-6" />,
    tags: ['Next.js', 'Auth', 'Dashboards'],
    color: 'from-purple-500 to-pink-600',
    popular: true,
    industry: 'B2B'
  },
  {
    id: 'fintech-ai',
    name: 'Fintech AI',
    description: 'Gestor financeiro inteligente com análise preditiva e gráficos em tempo real.',
    category: 'Finanças',
    icon: <TrendingUp className="w-6 h-6" />,
    tags: ['Charts', 'AI', 'Real-time'],
    color: 'from-emerald-500 to-teal-600',
    industry: 'Banking'
  },
  {
    id: 'app-mobile-first',
    name: 'App Mobile First',
    description: 'PWA otimizada para dispositivos móveis com notificações push e offline mode.',
    category: 'Mobile',
    icon: <Smartphone className="w-6 h-6" />,
    tags: ['PWA', 'Tailwind', 'Push'],
    color: 'from-orange-500 to-red-600',
    industry: 'Utilidades'
  },
  {
    id: 'data-hub',
    name: 'Data Hub',
    description: 'Central de dados com integração de APIs externas e armazenamento distribuído.',
    category: 'Dados',
    icon: <Database className="w-6 h-6" />,
    tags: ['API', 'SQL', 'Caching'],
    color: 'from-cyan-500 to-blue-600',
    industry: 'Infraestrutura'
  }
];

const TemplateMarketplace: React.FC = () => {
  const { showTemplates, setShowTemplates, language } = useUI();
  const { addProject } = useProjects();
  const { getBlueprintInit } = useMultiAgent();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  const userDna = UserDna.getInstance().getProfile();

  if (!showTemplates) return null;

  const categories = ['Todas', 'Recomendados', 'Vendas', 'Software', 'Finanças', 'Mobile', 'Dados'];

  const filteredBlueprints = blueprints.filter(bp => {
    const matchesSearch = bp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         bp.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesCategory = selectedCategory === 'Todas' || bp.category === selectedCategory;
    
    if (selectedCategory === 'Recomendados') {
      const isFintechStrict = bp.id === 'fintech-ai' && userDna.safetyLevel === 'strict';
      const isEcommerceReact = bp.id === 'ecommerce-pro' && userDna.preferredLibraries.includes('react');
      const isSaasB2B = bp.id === 'saas-moderno' && userDna.designPatterns === 'functional';
      matchesCategory = isFintechStrict || isEcommerceReact || isSaasB2B;
    }
    
    return matchesSearch && matchesCategory;
  });

  const handleCreateFromBlueprint = async (blueprint: Blueprint) => {
    try {
      const blueprintData = await getBlueprintInit(blueprint.id);
      const projectName = `${blueprint.name} - ${new Date().toLocaleDateString()}`;
      
      await addProject({
        name: projectName,
        type: 'react',
        code: blueprintData.code,
        description: blueprint.description,
        blueprintId: blueprint.id,
        features: blueprintData.suggestedPrompts
      });
      
      setShowTemplates(false);
      alert(language === 'pt' ? `🚀 Projeto "${projectName}" criado com sucesso a partir do blueprint ${blueprint.name}!` : `🚀 Project "${projectName}" successfully created from blueprint ${blueprint.name}!`);
    } catch (error) {
      console.error('Failed to create project from blueprint:', error);
      alert('Erro ao criar projeto a partir do blueprint.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-blue-600/5 to-purple-600/5">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="text-white w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {language === 'pt' ? 'Blueprints Inteligentes' : 'Intelligent Blueprints'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {language === 'pt' ? 'Inicie projetos completos com arquitetura otimizada por IA' : 'Launch complete projects with AI-optimized architecture'}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowTemplates(false)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text"
                placeholder={language === 'pt' ? 'Buscar blueprints...' : 'Search blueprints...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm dark:text-white"
              />
            </div>
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-blue-400'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlueprints.map(bp => (
              <div 
                key={bp.id}
                className={`group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 flex flex-col h-full hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${
                  bp.popular ? 'hover:border-blue-500/50 shadow-[0_0_20px_-12px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.5)]' : 'hover:border-gray-400'
                }`}
              >
                {bp.popular && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center shadow-sm">
                    <Star className="w-2.5 h-2.5 mr-1 fill-current" />
                    POPULAR
                  </div>
                )}
                
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${bp.color} flex items-center justify-center text-white mb-6 group-hover:rotate-6 transition-transform duration-300 shadow-lg`}>
                  {bp.icon}
                </div>
                
                <div className="mb-2 flex items-center space-x-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    {bp.industry}
                  </span>
                  <span className="text-gray-300 dark:text-gray-600">•</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {bp.category}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                  {bp.name}
                </h3>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 flex-1 line-clamp-3">
                  {bp.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {bp.tags.map(tag => (
                    <span 
                      key={tag}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700/50 text-[10px] font-medium text-gray-500 dark:text-gray-400 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <button 
                  onClick={() => handleCreateFromBlueprint(bp)}
                  className="w-full bg-gray-900 dark:bg-gray-700 text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center space-x-2 hover:bg-blue-600 dark:hover:bg-blue-600 transition-colors shadow-lg group/btn"
                >
                  <Zap className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                  <span>{language === 'pt' ? 'Implementar agora' : 'Deploy Blueprint'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          
          {filteredBlueprints.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Nenhum blueprint encontrado
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Tente ajustar seus filtros ou busca
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/30 border-t border-gray-200 dark:border-gray-800 text-center">
          <p className="text-[10px] text-gray-500 dark:text-gray-400">
            {language === 'pt' ? 'Todos os blueprints incluem suporte a CI/CD e monitoramento automático.' : 'All blueprints include CI/CD support and automatic monitoring.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TemplateMarketplace;
