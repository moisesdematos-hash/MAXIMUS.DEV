import React, { useState, useEffect } from 'react';
import { X, Search, Filter, Grid3X3, List, Star, Download, Eye, Code, Palette, Database, Globe, Smartphone, Monitor, Zap, Heart, User, Play, Layers, ShoppingCart, BarChart3, FileText, TowerControl as GameController2, Briefcase, GraduationCap, Stethoscope, Car, Home, Utensils, ArrowLeft, ArrowRight, Plus, Sparkles, Trash2, Save } from 'lucide-react';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTemplateSelect?: (template: Template) => void;
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

const TemplatesModal: React.FC<TemplatesModalProps> = ({ isOpen, onClose, onTemplateSelect }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [categoryHistory, setCategoryHistory] = useState<string[]>(['all']);
  const [categoryHistoryIndex, setCategoryHistoryIndex] = useState(0);
  const [activeView, setActiveView] = useState<'browse' | 'create'>('browse');
  const [customTemplates, setCustomTemplates] = useState<Template[]>([]);
  const [newTemplate, setNewTemplate] = useState<Partial<Template>>({
    name: '',
    description: '',
    category: 'custom',
    type: 'react',
    difficulty: 'beginner',
    features: [],
    tags: [],
    isFree: true,
    author: 'Você'
  });

  useEffect(() => {
    const saved = localStorage.getItem('maximus_custom_templates');
    if (saved) {
      setCustomTemplates(JSON.parse(saved));
    }
  }, []);

  const saveCustomTemplate = () => {
    if (!newTemplate.name || !newTemplate.description) return;
    
    const template: Template = {
      ...newTemplate as Template,
      id: `custom-${Date.now()}`,
      downloads: 0,
      rating: 5.0,
      lastUpdated: 'Recém criado',
      isPopular: false,
      preview: 'https://images.pexels.com/photos/11035481/pexels-photo-11035481.jpeg'
    };

    const updated = [...customTemplates, template];
    setCustomTemplates(updated);
    localStorage.setItem('maximus_custom_templates', JSON.stringify(updated));
    setActiveView('browse');
    setSelectedCategory('custom');
    
    // Reset form
    setNewTemplate({
      name: '',
      description: '',
      category: 'custom',
      type: 'react',
      difficulty: 'beginner',
      features: [],
      tags: [],
      isFree: true,
      author: 'Você'
    });
  };

  const deleteCustomTemplate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = customTemplates.filter(t => t.id !== id);
    setCustomTemplates(updated);
    localStorage.setItem('maximus_custom_templates', JSON.stringify(updated));
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
    { id: 'all', name: 'Todos', icon: Layers },
    { id: 'custom', name: 'Meus Templates', icon: Sparkles },
    { id: 'ecommerce', name: 'E-commerce', icon: ShoppingCart },
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'blog', name: 'Blog', icon: FileText },
    { id: 'portfolio', name: 'Portfolio', icon: User },
    { id: 'landing', name: 'Landing Page', icon: Globe },
    { id: 'app', name: 'Aplicativo', icon: Smartphone },
    { id: 'admin', name: 'Admin Panel', icon: Monitor },
    { id: 'social', name: 'Social Media', icon: Heart },
    { id: 'business', name: 'Negócios', icon: Briefcase },
    { id: 'education', name: 'Educação', icon: GraduationCap },
    { id: 'health', name: 'Saúde', icon: Stethoscope },
    { id: 'automotive', name: 'Automotivo', icon: Car },
    { id: 'realestate', name: 'Imóveis', icon: Home },
    { id: 'food', name: 'Alimentação', icon: Utensils },
    { id: 'entertainment', name: 'Entretenimento', icon: GameController2 },
    { id: 'mobility', name: 'Mobilidade', icon: Car },
  ];

  const templates: Template[] = [
    {
      id: '1',
      name: 'E-commerce Moderno',
      description: 'Loja online completa com carrinho, pagamentos e painel administrativo',
      category: 'ecommerce',
      type: 'react',
      difficulty: 'advanced',
      tags: ['e-commerce', 'stripe', 'admin', 'responsive'],
      preview: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg',
      downloads: 15420,
      rating: 4.9,
      author: 'MAXIMUS.DEV Team',
      lastUpdated: '2 dias atrás',
      isPopular: true,
      isFree: true,
      features: ['Carrinho de compras', 'Pagamentos Stripe', 'Painel admin', 'Responsivo', 'SEO otimizado'],
      demoUrl: 'https://demo.maximus.dev/ecommerce',
      sourceUrl: 'https://github.com/maximusdev/ecommerce-template'
    },
    {
      id: '2',
      name: 'Dashboard Analytics',
      description: 'Dashboard completo com gráficos interativos e métricas em tempo real',
      category: 'dashboard',
      type: 'react',
      difficulty: 'intermediate',
      tags: ['dashboard', 'charts', 'analytics', 'real-time'],
      preview: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpg',
      downloads: 12850,
      rating: 4.8,
      author: 'DataViz Pro',
      lastUpdated: '1 semana atrás',
      isPopular: true,
      isFree: true,
      features: ['Gráficos interativos', 'Tempo real', 'Filtros avançados', 'Exportação PDF', 'Dark mode'],
      demoUrl: 'https://demo.maximus.dev/dashboard',
      sourceUrl: 'https://github.com/maximusdev/dashboard-template'
    },
    {
      id: '3',
      name: 'Blog Pessoal',
      description: 'Blog moderno com CMS, comentários e sistema de tags',
      category: 'blog',
      type: 'next',
      difficulty: 'beginner',
      tags: ['blog', 'cms', 'markdown', 'seo'],
      preview: 'https://images.pexels.com/photos/261662/pexels-photo-261662.jpeg',
      downloads: 8930,
      rating: 4.7,
      author: 'BlogMaster',
      lastUpdated: '3 dias atrás',
      isPopular: false,
      isFree: true,
      features: ['Editor markdown', 'Sistema de tags', 'Comentários', 'SEO friendly', 'RSS feed'],
      demoUrl: 'https://demo.maximus.dev/blog',
      sourceUrl: 'https://github.com/maximusdev/blog-template'
    },
    {
      id: '4',
      name: 'Portfolio Criativo',
      description: 'Portfolio moderno com animações e galeria de projetos',
      category: 'portfolio',
      type: 'vue',
      difficulty: 'intermediate',
      tags: ['portfolio', 'animations', 'gallery', 'creative'],
      preview: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg',
      downloads: 7650,
      rating: 4.6,
      author: 'Creative Studio',
      lastUpdated: '5 dias atrás',
      isPopular: false,
      isFree: true,
      features: ['Animações suaves', 'Galeria interativa', 'Formulário contato', 'Responsivo', 'Performance otimizada'],
      demoUrl: 'https://demo.maximus.dev/portfolio',
      sourceUrl: 'https://github.com/maximusdev/portfolio-template'
    },
    {
      id: '5',
      name: 'Landing Page SaaS',
      description: 'Landing page para produtos SaaS com preços e depoimentos',
      category: 'landing',
      type: 'react',
      difficulty: 'beginner',
      tags: ['landing', 'saas', 'pricing', 'testimonials'],
      preview: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
      downloads: 11200,
      rating: 4.8,
      author: 'SaaS Templates',
      lastUpdated: '1 dia atrás',
      isPopular: true,
      isFree: true,
      features: ['Seção de preços', 'Depoimentos', 'FAQ', 'Call-to-action', 'Mobile first'],
      demoUrl: 'https://demo.maximus.dev/saas-landing',
      sourceUrl: 'https://github.com/maximusdev/saas-landing-template'
    },
    {
      id: '6',
      name: 'App Mobile UI Kit',
      description: 'Kit completo de componentes para aplicativos móveis',
      category: 'app',
      type: 'react',
      difficulty: 'advanced',
      tags: ['mobile', 'ui-kit', 'components', 'react-native'],
      preview: 'https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg',
      downloads: 9840,
      rating: 4.9,
      author: 'Mobile UI Pro',
      lastUpdated: '4 dias atrás',
      isPopular: true,
      isFree: false,
      features: ['50+ componentes', 'Navegação', 'Formulários', 'Animações', 'Tema customizável'],
      demoUrl: 'https://demo.maximus.dev/mobile-ui',
      sourceUrl: 'https://github.com/maximusdev/mobile-ui-template'
    },
    {
      id: '7',
      name: 'Admin Panel Pro',
      description: 'Painel administrativo completo com CRUD e relatórios',
      category: 'admin',
      type: 'angular',
      difficulty: 'advanced',
      tags: ['admin', 'crud', 'reports', 'angular'],
      preview: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpg',
      downloads: 6750,
      rating: 4.7,
      author: 'Admin Solutions',
      lastUpdated: '1 semana atrás',
      isPopular: false,
      isFree: false,
      features: ['CRUD completo', 'Relatórios', 'Permissões', 'Multi-idioma', 'Tema escuro'],
      demoUrl: 'https://demo.maximus.dev/admin-panel',
      sourceUrl: 'https://github.com/maximusdev/admin-panel-template'
    },
    {
      id: '8',
      name: 'Social Media App',
      description: 'Aplicativo de rede social com posts, likes e comentários',
      category: 'social',
      type: 'react',
      difficulty: 'advanced',
      tags: ['social', 'posts', 'likes', 'comments', 'real-time'],
      preview: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg',
      downloads: 13500,
      rating: 4.8,
      author: 'Social Dev',
      lastUpdated: '2 dias atrás',
      isPopular: true,
      isFree: true,
      features: ['Feed de posts', 'Sistema de likes', 'Comentários', 'Chat real-time', 'Notificações'],
      demoUrl: 'https://demo.maximus.dev/social-app',
      sourceUrl: 'https://github.com/maximusdev/social-app-template'
    },
    {
      id: '9',
      name: 'SaaS Moderno',
      description: 'Plataforma SaaS completa com dashboard, billing, autenticação e API',
      category: 'business',
      type: 'next',
      difficulty: 'advanced',
      tags: ['saas', 'dashboard', 'billing', 'auth', 'api', 'stripe'],
      preview: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
      downloads: 22400,
      rating: 4.9,
      author: 'SaaS Pro Team',
      lastUpdated: '1 dia atrás',
      isPopular: true,
      isFree: false,
      features: ['Dashboard completo', 'Sistema de billing', 'Autenticação JWT', 'API REST', 'Integração Stripe', 'Multi-tenant', 'Analytics', 'Notificações', '🤖 IA Integrada', '🎯 Auto-scaling', '🔄 Deploy Automático', '🔮 Análise Preditiva'],
      demoUrl: 'https://demo.maximus.dev/saas-moderno',
      sourceUrl: 'https://github.com/maximusdev/saas-moderno-template'
    },
    {
      id: '10',
      name: 'Uber Clone',
      description: 'Aplicativo completo de transporte com mapas, rastreamento em tempo real e pagamentos',
      category: 'app',
      type: 'react',
      difficulty: 'advanced',
      tags: ['uber', 'maps', 'real-time', 'payments', 'geolocation'],
      preview: 'https://images.pexels.com/photos/1118448/pexels-photo-1118448.jpeg',
      downloads: 18750,
      rating: 4.9,
      author: 'Transport Solutions',
      lastUpdated: '1 dia atrás',
      isPopular: true,
      isFree: false,
      features: ['Mapas integrados', 'GPS em tempo real', 'Sistema de pagamentos', 'Chat motorista/passageiro', 'Avaliações', 'Histórico de viagens'],
      demoUrl: 'https://demo.maximus.dev/uber-clone',
      sourceUrl: 'https://github.com/maximusdev/uber-clone-template'
    },
    {
      id: '11',
      name: 'AI SaaS Multi-tenant Dashboard',
      description: 'Plataforma SaaS completa com gestão de subscrições, análise preditiva e suporte a múltiplos clientes',
      category: 'business',
      type: 'next',
      difficulty: 'advanced',
      tags: ['saas', 'ai', 'multi-tenant', 'dashboard'],
      preview: 'https://images.pexels.com/photos/3183158/pexels-photo-3183158.jpeg',
      downloads: 4200,
      rating: 4.9,
      author: 'MAXIMUS AI Labs',
      lastUpdated: 'Recém atualizado',
      isPopular: true,
      isFree: false,
      features: ['Autenticação Multi-tenant', 'Motor de IA Preditiva', 'Billing Integrado', 'Analytics Avançado', 'Webhooks'],
      demoUrl: 'https://demo.maximus.dev/ai-saas'
    },
    {
      id: '12',
      name: 'Global Digital Asset Marketplace',
      description: 'Marketplace de ativos digitais com suporte a transações globais e painel de criadores',
      category: 'ecommerce',
      type: 'react',
      difficulty: 'advanced',
      tags: ['marketplace', 'digital-assets', 'creators', 'payments'],
      preview: 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg',
      downloads: 2800,
      rating: 4.8,
      author: 'AssetFlow',
      lastUpdated: '2 dias atrás',
      isPopular: false,
      isFree: false,
      features: ['Gestão de Inventário Digital', 'Pagamentos Globais', 'Royalty Sharing', 'Verificação de Identidade'],
      demoUrl: 'https://demo.maximus.dev/asset-marketplace'
    },
    {
      id: '13',
      name: 'Real-time FinTech Hub',
      description: 'Hub financeiro com rastreamento de ativos em tempo real, carteiras multi-moeda e gráficos avançados',
      category: 'dashboard',
      type: 'react',
      difficulty: 'advanced',
      tags: ['fintech', 'real-time', 'charts', 'crypto'],
      preview: 'https://images.pexels.com/photos/6770610/pexels-photo-6770610.jpeg',
      downloads: 5100,
      rating: 4.9,
      author: 'FinNexus',
      lastUpdated: '1 dia atrás',
      isPopular: true,
      isFree: false,
      features: ['WebSockets em Tempo Real', 'Gráficos TradingView', 'Gestão de Portfólio', 'Alertas de Preço'],
      demoUrl: 'https://demo.maximus.dev/fintech-hub'
    },
    {
      id: '14',
      name: 'HealthTech Telemedicine Portal',
      description: 'Portal de telemedicina seguro com vídeo consultas, registros de pacientes e agendamento inteligente',
      category: 'health',
      type: 'next',
      difficulty: 'intermediate',
      tags: ['healthtech', 'telemedicine', 'video', 'appointments'],
      preview: 'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg',
      downloads: 3300,
      rating: 4.8,
      author: 'MedConnect',
      lastUpdated: '3 dias atrás',
      isPopular: false,
      isFree: true,
      features: ['Video Conferência Segura', 'Prontuário Eletrônico', 'Agendamento Dinâmico', 'Segurança HIPAA'],
      demoUrl: 'https://demo.maximus.dev/healthtech'
    },
    {
      id: '15',
      name: 'Enterprise LMS Suite',
      description: 'Sistema de gestão de aprendizagem corporativo com construtor de cursos e rastreamento de progresso',
      category: 'education',
      type: 'react',
      difficulty: 'intermediate',
      tags: ['lms', 'education', 'e-learning', 'corporate'],
      preview: 'https://images.pexels.com/photos/5905709/pexels-photo-5905709.jpeg',
      downloads: 6400,
      rating: 4.7,
      author: 'EduStream',
      lastUpdated: '1 semana atrás',
      isPopular: true,
      isFree: false,
      features: ['Construtor de Cursos Drag-n-Drop', 'Fóruns de Discussão', 'Sistema de Certificação', 'Relatórios de Alunos'],
      demoUrl: 'https://demo.maximus.dev/enterprise-lms'
    },
    {
      id: '16',
      name: 'AI Logistic & Fleet Network',
      description: 'Rede de logística inteligente com gestão de frota, rastreamento IA e otimização de rotas',
      category: 'business',
      type: 'node',
      difficulty: 'advanced',
      tags: ['logistics', 'fleet', 'ai', 'tracking'],
      preview: 'https://images.pexels.com/photos/906494/pexels-photo-906494.jpeg',
      downloads: 2100,
      rating: 4.8,
      author: 'LogiSoft AI',
      lastUpdated: '4 dias atrás',
      isPopular: false,
      isFree: false,
      features: ['Otimização de Rotas por IA', 'Monitoramento de Combustível', 'Gestão de Motoristas', 'Telemetria em Direto'],
      demoUrl: 'https://demo.maximus.dev/logistics-network'
    },
    {
      id: '17',
      name: 'Smart Real Estate Engine',
      description: 'Plataforma imobiliária com tours virtuais 360, avaliação IA e funil de vendas integrado',
      category: 'realestate',
      type: 'next',
      difficulty: 'intermediate',
      tags: ['realestate', '360-tours', 'leads', 'automation'],
      preview: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
      downloads: 4700,
      rating: 4.7,
      author: 'PropTech Pro',
      lastUpdated: '2 dias atrás',
      isPopular: true,
      isFree: true,
      features: ['Tours Virtuais Imersivos', 'CRM de Imóveis', 'Calculadora Financeira', 'Chatbot de Vendas'],
      demoUrl: 'https://demo.maximus.dev/smart-real-estate'
    },
    {
      id: '18',
      name: 'Automated HR & Recruitment Suite',
      description: 'Suíte de RH com triagem de currículos por IA, agendamento de entrevistas e onboarding',
      category: 'business',
      type: 'react',
      difficulty: 'intermediate',
      tags: ['hr', 'recruitment', 'ats', 'automation'],
      preview: 'https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg',
      downloads: 2900,
      rating: 4.6,
      author: 'TalentHub',
      lastUpdated: '5 dias atrás',
      isPopular: false,
      isFree: true,
      features: ['Parsing de Currículos IA', 'Pipeline de Recrutamento', 'Testes de Avaliação', 'Onboarding Digital'],
      demoUrl: 'https://demo.maximus.dev/hr-recruitment'
    },
    {
      id: '19',
      name: 'Social Media Content Engine',
      description: 'Motor de automação de conteúdo social com agendamento multirede e analytics de engajamento',
      category: 'social',
      type: 'vue',
      difficulty: 'intermediate',
      tags: ['socialmedia', 'marketing', 'automation', 'analytics'],
      preview: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg',
      downloads: 8200,
      rating: 4.8,
      author: 'ContentFlow',
      lastUpdated: '1 dia atrás',
      isPopular: true,
      isFree: false,
      features: ['Agendamento Multirede', 'Design Studio Integrado', 'Relatórios de ROI', 'Monitoramento de Menções'],
      demoUrl: 'https://demo.maximus.dev/social-content'
    },
    {
      id: '20',
      name: 'Smart Urban Mobility Manager',
      description: 'Plataforma de gestão de mobilidade urbana com controle de micro-mobilidade e análise de tráfego',
      category: 'mobility',
      type: 'react',
      difficulty: 'advanced',
      tags: ['urban-mobility', 'smart-city', 'iot', 'tracking'],
      preview: 'https://images.pexels.com/photos/1118448/pexels-photo-1118448.jpeg',
      downloads: 3600,
      rating: 4.9,
      author: 'CityNexus',
      lastUpdated: 'Hoje',
      isPopular: true,
      isFree: false,
      features: ['Gestão de Frota IoT', 'Análise de Fluxo Urbano', 'Bilhetagem Digital', 'Integração com Mapas'],
      demoUrl: 'https://demo.maximus.dev/urban-mobility'
    },
    {
      id: 'social-media-neural',
      name: 'Social Media Neural',
      description: 'Template de rede social com feed auto-moderado por IA e chats criptografados.',
      category: 'social',
      type: 'react',
      difficulty: 'advanced',
      tags: ['social', 'ai', 'encryption', 'neural'],
      preview: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg',
      downloads: 4200,
      rating: 4.9,
      author: 'MAXIMUS AI Labs',
      lastUpdated: 'Novo',
      isPopular: true,
      isFree: false,
      features: ['Moderação por IA', 'Mensagens Criptografadas', 'Feed Dinâmico', 'Design Visionário'],
      demoUrl: 'https://demo.maximus.dev/social-neural'
    },
    {
      id: 'portfolio-3d-creative',
      name: 'Portfolio 3D Creative',
      description: 'Portfolio premium com Three.js, animações fluidas e design ultra-fino.',
      category: 'portfolio',
      type: 'react',
      difficulty: 'advanced',
      tags: ['portfolio', '3d', 'threejs', 'creative'],
      preview: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg',
      downloads: 3100,
      rating: 4.9,
      author: 'Visual Studio',
      lastUpdated: 'Novo',
      isPopular: true,
      isFree: false,
      features: ['Integração Three.js', 'Smooth Scroll', 'Dark Mode Nativo', 'Tipografia Moderna'],
      demoUrl: 'https://demo.maximus.dev/portfolio-3d'
    }
  ];

  const allTemplates = [...customTemplates, ...templates];

  const filteredTemplates = allTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesType = selectedType === 'all' || template.type === selectedType;
    const matchesDifficulty = selectedDifficulty === 'all' || template.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesType && matchesDifficulty;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'react': return <Code className="w-4 h-4 text-blue-500" />;
      case 'vue': return <Code className="w-4 h-4 text-green-500" />;
      case 'next': return <Globe className="w-4 h-4 text-gray-700" />;
      case 'angular': return <Code className="w-4 h-4 text-red-500" />;
      case 'html': return <Palette className="w-4 h-4 text-orange-500" />;
      case 'node': return <Database className="w-4 h-4 text-green-600" />;
      case 'python': return <Zap className="w-4 h-4 text-yellow-500" />;
      default: return <Code className="w-4 h-4 text-gray-500" />;
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

  const handleUseTemplate = (template: Template) => {
    console.log('Usando template:', template.name);
    if (onTemplateSelect) {
      onTemplateSelect(template);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-[1200px] h-[800px] shadow-xl flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-50 dark:bg-gray-700 rounded-l-lg border-r border-gray-200 dark:border-gray-600">
          <div className="p-6 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-3">
              <Layers className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Templates
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
                  Navegação: {categoryHistoryIndex + 1}/{categoryHistory.length}
                </span>
              </div>
            </div>

            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Categorias</h3>
            <div className="space-y-1 max-h-96 overflow-y-auto">
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
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Templates Profissionais
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {activeView === 'browse' ? 'Acelere seu desenvolvimento com templates prontos' : 'Crie seu próprio template personalizado'}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveView(activeView === 'browse' ? 'create' : 'browse')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    activeView === 'create'
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-600'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
                  }`}
                >
                  {activeView === 'browse' ? (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Novo Template</span>
                    </>
                  ) : (
                    <span>Voltar aos Templates</span>
                  )}
                </button>
                <button
                  onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search and Filters */}
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors ${
                  showFilters 
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Filter className="w-4 h-4" />
              </button>

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

            {/* Filters */}
            {showFilters && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tecnologia
                    </label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">Todas</option>
                      <option value="react">React</option>
                      <option value="vue">Vue.js</option>
                      <option value="next">Next.js</option>
                      <option value="angular">Angular</option>
                      <option value="html">HTML</option>
                      <option value="node">Node.js</option>
                      <option value="python">Python</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Dificuldade
                    </label>
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">Todas</option>
                      <option value="beginner">Iniciante</option>
                      <option value="intermediate">Intermediário</option>
                      <option value="advanced">Avançado</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Preço
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="all">Todos</option>
                      <option value="free">Gratuitos</option>
                      <option value="premium">Premium</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
            <div className="flex items-center space-x-8 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-300">
                  {filteredTemplates.length} Templates
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-3 h-3 text-yellow-500" />
                <span className="text-gray-600 dark:text-gray-300">
                  {templates.filter(t => t.isPopular).length} Populares
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-3 h-3 text-green-500" />
                <span className="text-gray-600 dark:text-gray-300">
                  {templates.filter(t => t.isFree).length} Gratuitos
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Download className="w-3 h-3 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-300">
                  {templates.reduce((acc, t) => acc + t.downloads, 0).toLocaleString()} Downloads
                </span>
              </div>
            </div>
          </div>

          {/* Templates Grid/List or Create Form */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeView === 'create' ? (
              <div className="max-w-2xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom duration-300">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-tighter">Nome do Template</label>
                    <input
                      type="text"
                      placeholder="Ex: App de Gestão Imobiliária"
                      value={newTemplate.name}
                      onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-tighter">Descrição Detalhada</label>
                    <textarea
                      placeholder="Descreva as funcionalidades e o objetivo deste template..."
                      value={newTemplate.description}
                      onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-tighter">Tecnologia</label>
                    <select
                      value={newTemplate.type}
                      onChange={(e) => setNewTemplate({ ...newTemplate, type: e.target.value as any })}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    >
                      <option value="react">React</option>
                      <option value="next">Next.js</option>
                      <option value="vue">Vue.js</option>
                      <option value="html">HTML/CSS</option>
                      <option value="python">Python/Backend</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-tighter">Dificuldade</label>
                    <select
                      value={newTemplate.difficulty}
                      onChange={(e) => setNewTemplate({ ...newTemplate, difficulty: e.target.value as any })}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    >
                      <option value="beginner">Iniciante</option>
                      <option value="intermediate">Intermediário</option>
                      <option value="advanced">Avançado</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-tighter">Funcionalidades (separadas por vírgula)</label>
                  <input
                    type="text"
                    placeholder="Ex: Auth, Dashboard, Stripe"
                    onChange={(e) => setNewTemplate({ ...newTemplate, features: e.target.value.split(',').map(s => s.trim()) })}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>

                <div className="pt-6 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-blue-500 font-bold text-xs uppercase tracking-widest animate-pulse">
                    <Sparkles className="w-4 h-4" />
                    <span>IA Pronta para Ativar</span>
                  </div>
                  <button
                    onClick={saveCustomTemplate}
                    disabled={!newTemplate.name || !newTemplate.description}
                    className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                  >
                    <Save className="w-5 h-5" />
                    <span>Criar e Ativar Agora</span>
                  </button>
                </div>
              </div>
            ) : filteredTemplates.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group relative"
                    >
                      {/* Delete Button for Custom Templates */}
                      {template.id.startsWith('custom-') && (
                        <button
                          onClick={(e) => deleteCustomTemplate(template.id, e)}
                          className="absolute top-2 right-2 p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-full z-20 opacity-0 group-hover:opacity-100 transition-all"
                          title="Excluir Template"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {/* Preview Image */}
                      <div className="relative h-48 bg-gray-200 dark:bg-gray-600 overflow-hidden">
                        <img
                          src={template.preview}
                          alt={template.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                            {template.demoUrl && (
                              <button
                                onClick={() => window.open(template.demoUrl, '_blank')}
                                className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                                title="Ver Demo"
                              >
                                <Eye className="w-4 h-4 text-gray-700" />
                              </button>
                            )}
                            <button
                              onClick={() => handleUseTemplate(template)}
                              className="p-2 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                              title="Usar Template"
                            >
                              <Play className="w-4 h-4 text-white" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex space-x-2">
                          {template.isPopular && (
                            <span className="px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded-full">
                              Popular
                            </span>
                          )}
                          {template.isFree ? (
                            <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                              Grátis
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-purple-500 text-white text-xs font-medium rounded-full">
                              Premium
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-800 dark:text-white text-sm">
                            {template.name}
                          </h3>
                          <div className="flex items-center space-x-1">
                            {getTypeIcon(template.type)}
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                          {template.description}
                        </p>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {template.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                          {template.tags.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                              +{template.tags.length - 3}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-yellow-500" />
                              <span>{template.rating}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Download className="w-3 h-3" />
                              <span>{template.downloads.toLocaleString()}</span>
                            </span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(template.difficulty)}`}>
                            {getDifficultyLabel(template.difficulty)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>por {template.author}</span>
                          <span>{template.lastUpdated}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors group"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={template.preview}
                            alt={template.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-800 dark:text-white">
                                {template.name}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {template.description}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              {template.demoUrl && (
                                <button
                                  onClick={() => window.open(template.demoUrl, '_blank')}
                                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                                  title="Ver Demo"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              )}
                              {template.id.startsWith('custom-') && (
                                <button
                                  onClick={(e) => deleteCustomTemplate(template.id, e)}
                                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                  title="Excluir Template"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => handleUseTemplate(template)}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                              >
                                Usar Template
                              </button>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center space-x-1">
                              {getTypeIcon(template.type)}
                              <span className="capitalize">{template.type}</span>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(template.difficulty)}`}>
                              {getDifficultyLabel(template.difficulty)}
                            </span>
                            <span className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-yellow-500" />
                              <span>{template.rating}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Download className="w-3 h-3" />
                              <span>{template.downloads.toLocaleString()}</span>
                            </span>
                            <span>por {template.author}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-12">
                <Layers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300 font-medium">
                  Nenhum template encontrado
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Tente ajustar os filtros ou termos de busca
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatesModal;