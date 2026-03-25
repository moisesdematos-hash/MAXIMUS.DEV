import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Users, 
  Zap, 
  Heart, 
  Trophy, 
  Flame, 
  Plus, 
  TrendingUp,
  Award,
  Filter,
  ArrowUpRight,
  GitFork,
  Clock
} from 'lucide-react';
import { useUI } from '../contexts/UIContext';

interface NeuralProject {
  id: string;
  name: string;
  description: string;
  author: {
    name: string;
    avatar: string;
    rank: string;
  };
  stats: {
    claps: number;
    forks: number;
    views: number;
  };
  tags: string[];
  preview: string;
  category: string;
  timestamp: string;
}

const communityProjects: NeuralProject[] = [
  {
    id: 'comm-1',
    name: 'Neural Task Orchestrator',
    description: 'Um sistema avançado de gestão de tarefas que utiliza LLMs para priorizar e delegar subtarefas automaticamente.',
    author: {
      name: 'AlphaDev',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
      rank: 'Elite Architect'
    },
    stats: {
      claps: 1250,
      forks: 340,
      views: 8900
    },
    tags: ['AI', 'Productivity', 'Next.js'],
    preview: 'https://images.pexels.com/photos/3183158/pexels-photo-3183158.jpeg',
    category: 'SaaS',
    timestamp: '2h atrás'
  },
  {
    id: 'comm-2',
    name: 'EcoTrack Smart Grid',
    description: 'Monitoramento em tempo real de redes elétricas sustentáveis com previsão de consumo baseada em clima.',
    author: {
      name: 'SolarPower',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
      rank: 'Rising Star'
    },
    stats: {
      claps: 850,
      forks: 120,
      views: 4200
    },
    tags: ['IoT', 'Sustainability', 'Charts'],
    preview: 'https://images.pexels.com/photos/906494/pexels-photo-906494.jpeg',
    category: 'Infraestrutura',
    timestamp: '5h atrás'
  },
  {
    id: 'comm-3',
    name: 'Metaverse UI Kit',
    description: 'Conjunto de componentes 3D para interfaces imersivas e mundos virtuais descentralizados.',
    author: {
      name: 'CyberDesigner',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
      rank: 'Visual Master'
    },
    stats: {
      claps: 2100,
      forks: 890,
      views: 15400
    },
    tags: ['3D', 'UI/UX', 'Tailwind'],
    preview: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg',
    category: 'Design',
    timestamp: '1d atrás'
  }
];

const CommunityArea: React.FC = () => {
  const { showCommunity, setShowCommunity } = useUI();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'trending' | 'new' | 'creators'>('trending');
  const [projects, setProjects] = useState<NeuralProject[]>(communityProjects);

  if (!showCommunity) return null;

  const handleClap = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setProjects(prev => prev.map(p => 
      p.id === id ? { ...p, stats: { ...p.stats, claps: p.stats.claps + 1 } } : p
    ));
  };

  const handleFork = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    alert(`🚀 Projeto "${name}" remixado com sucesso para seu workspace!`);
  };

  const handleTeleport = (project: NeuralProject) => {
    alert(`⚡ Teletransportando para a arquitetura de "${project.name}"...`);
  };

  const handleShareProject = () => {
    const newProject: NeuralProject = {
      id: `comm-${Date.now()}`,
      name: 'Novo Projeto Neural',
      description: 'Uma inovação recém-descoberta compartilhada com a rede soberana.',
      author: {
        name: 'Você',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
        rank: 'Sovereign Lab'
      },
      stats: { claps: 1, forks: 0, views: 1 },
      tags: ['New', 'Neural'],
      preview: 'https://images.pexels.com/photos/3183158/pexels-photo-3183158.jpeg',
      category: 'Inovação',
      timestamp: 'Agora'
    };
    setProjects([newProject, ...projects]);
    alert('🎨 Projeto compartilhado com a comunidade com sucesso!');
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Simple mock logic for tabs
    if (activeTab === 'new') return matchesSearch; // In a real app we would sort by date
    if (activeTab === 'creators') return matchesSearch; // In a real app we'd show a different view
    return matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-black/70 backdrop-blur-md animate-in fade-in duration-500">
      <div className="relative w-full max-w-7xl h-full max-h-[90vh] bg-white dark:bg-gray-950 rounded-[2.5rem] shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)] overflow-hidden border border-gray-200/50 dark:border-gray-800/50 flex flex-col">
        
        {/* Particle Background Effect (CSS only) */}
        <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-40">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-blue-600/20 to-transparent mask-linear" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-600/20 blur-[100px] rounded-full" />
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-600/20 blur-[80px] rounded-full" />
        </div>

        {/* Header */}
        <div className="relative p-8 pb-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/40 rotate-3">
              <Users className="text-white w-7 h-7" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center">
                Hub da Comunidade
                <span className="ml-3 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full uppercase tracking-widest border border-blue-200 dark:border-blue-800">
                  Lançamento Beta
                </span>
              </h2>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                Sincronize sua genialidade com a rede global de desenvolvedores soberanos.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowCommunity(false)}
            className="p-3 bg-gray-100 hover:bg-red-100 dark:bg-gray-800 dark:hover:bg-red-900/30 rounded-2xl text-gray-500 hover:text-red-500 transition-all duration-300 transform hover:rotate-90 active:scale-95 border border-transparent hover:border-red-200 dark:hover:border-red-800"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Global Stats Bar */}
        <div className="px-8 py-3 bg-gray-50/50 dark:bg-gray-900/30 flex items-center space-x-12 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-tighter">
              12,4k Projetos Ativos
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-tighter">
              245 Arquitetos Elite
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-tighter">
              890TB Colaborados
            </span>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar Filters */}
          <div className="w-80 p-8 border-r border-gray-100 dark:border-gray-800 bg-gray-50/20 dark:bg-gray-900/10 space-y-8 overflow-y-auto">
            <div className="space-y-4">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] px-2 text-center">Navegação Neural</h3>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'trending', icon: Flame, label: 'Tendências', color: 'text-orange-500' },
                  { id: 'new', icon: Clock, label: 'Recentes', color: 'text-blue-500' },
                  { id: 'creators', icon: Trophy, label: 'Top Criadores', color: 'text-amber-500' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                      activeTab === tab.id 
                        ? 'bg-white dark:bg-gray-800 shadow-xl shadow-black/5 dark:shadow-blue-500/10 border border-gray-100 dark:border-gray-700' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? tab.color : 'text-gray-400 group-hover:text-gray-600'}`} />
                    <span className={`text-sm font-bold ${activeTab === tab.id ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                      {tab.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100 dark:border-gray-800">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] px-2 mb-6">Indústrias em Foco</h3>
              <div className="flex flex-wrap gap-2">
                {['FinTech', 'SaaS', 'Health', 'Crypto', 'DevOps', 'Design'].map(cat => (
                  <button key={cat} className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-[10px] font-black uppercase text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all border border-transparent hover:border-blue-200">
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-8">
              <button 
                onClick={handleShareProject}
                className="w-full p-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-[2rem] shadow-2xl shadow-blue-500/30 group relative overflow-hidden active:scale-95 transition-all"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Plus className="w-8 h-8 mx-auto mb-3" />
                <span className="block text-sm font-black uppercase tracking-widest">Compartilhar</span>
                <span className="block text-[10px] opacity-70 font-bold tracking-tight">Expandir a Rede Neural</span>
              </button>
            </div>
          </div>

          {/* Main Feed */}
          <div className="flex-1 flex flex-col bg-white dark:bg-gray-950">
            {/* Search Bar */}
            <div className="p-8 pb-4">
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="text"
                  placeholder="Pesquisar projetos, inventores ou tecnologias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-gray-100 dark:bg-gray-900/50 border-2 border-transparent focus:border-blue-500/30 rounded-[2rem] outline-none transition-all font-medium text-gray-700 dark:text-gray-200 placeholder:text-gray-400 shadow-inner"
                />
              </div>
            </div>

            {/* Scrollable Feed */}
            <div className="flex-1 overflow-y-auto p-8 pt-4 space-y-8 scroll-smooth">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xl font-black text-gray-900 dark:text-white capitalize">
                  {activeTab === 'trending' ? '🔥 Tendências de Hoje' : activeTab === 'new' ? '✨ Novas Invenções' : '🏆 Mestres da Arquitetura'}
                </h3>
                <button className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors">
                  <Filter className="w-4 h-4" />
                  <span>Filtrar</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
                {filteredProjects.map(project => (
                  <div 
                    key={project.id}
                    onClick={() => handleTeleport(project)}
                    className="group flex flex-col bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_50px_-12px_rgba(59,130,246,0.15)] transition-all duration-500 border-2 border-transparent hover:border-blue-500/20 cursor-pointer"
                  >
                    {/* Preview Image with Hover Effects */}
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={project.preview} 
                        alt={project.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent opacity-60" />
                      
                      <div className="absolute top-4 right-4 flex space-x-1">
                        {project.tags.map(tag => (
                          <span key={tag} className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/20">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={project.author.avatar} 
                            alt={project.author.name}
                            className="w-10 h-10 rounded-xl border-2 border-white shadow-xl"
                          />
                          <div>
                            <p className="text-sm font-black text-white tracking-wide">{project.author.name}</p>
                            <p className="text-[10px] font-bold text-blue-300 uppercase leading-none">{project.author.rank}</p>
                          </div>
                        </div>
                        <div className="text-[10px] font-black text-white/70 uppercase tracking-tighter">
                          {project.timestamp}
                        </div>
                      </div>
                    </div>

                    <div className="p-8 flex-1 flex flex-col">
                      <div className="mb-4">
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                          {project.name}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 font-medium leading-relaxed">
                          {project.description}
                        </p>
                      </div>

                      {/* Stats & Actions */}
                      <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                          <button 
                            onClick={(e) => handleClap(project.id, e)}
                            className="flex items-center space-x-2 group/stat"
                          >
                            <div className="p-2 bg-pink-50 dark:bg-pink-900/20 rounded-lg group-hover/stat:bg-pink-500 group-hover/stat:text-white transition-all">
                              <Heart className="w-4 h-4 text-pink-500 group-hover/stat:text-white" />
                            </div>
                            <span className="text-sm font-black text-gray-600 dark:text-gray-400">{project.stats.claps}</span>
                          </button>
                          <button 
                            onClick={(e) => handleFork(project.name, e)}
                            className="flex items-center space-x-2 group/stat"
                          >
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg group-hover/stat:bg-blue-500 group-hover/stat:text-white transition-all">
                              <GitFork className="w-4 h-4 text-blue-500 group-hover/stat:text-white" />
                            </div>
                            <span className="text-sm font-black text-gray-600 dark:text-gray-400">{project.stats.forks}</span>
                          </button>
                        </div>

                        <button 
                          onClick={() => handleTeleport(project)}
                          className="flex items-center space-x-2 px-6 py-3 bg-gray-950 dark:bg-white text-white dark:text-gray-950 rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10"
                        >
                          <span>Teletransporte</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityArea;
