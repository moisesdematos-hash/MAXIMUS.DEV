import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  HelpCircle, 
  Search, 
  Crown,
  LogOut,
  ChevronRight,
  Zap,
  FolderOpen,
  Users
} from 'lucide-react';
import SettingsModal from './SettingsModal';
import HelpCenter from './HelpCenter';
import SubscriptionView from './SubscriptionView';
import { useProjects } from '../contexts/ProjectContext';
import { formatRelativeTime } from '../utils/timeFormatter';
import { useUI } from '../contexts/UIContext';
import { useAuth } from '../contexts/AuthContext';
import { getTranslation } from '../lib/i18n';

interface SidebarProps {
  isExpanded: boolean;
  onToggle: (expanded: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isExpanded, onToggle }) => {
  const { getRecentProjects, setCurrentProject } = useProjects();
  const { user, profile } = useAuth();
  const { language, showCommunity, setShowCommunity } = useUI();
  const [searchTerm, setSearchTerm] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showHelpCenter, setShowHelpCenter] = useState(false);
  const [activeTab, setActiveTab] = useState<'projects' | 'subscription'>('projects');

  const recentProjects = getRecentProjects(10).map(project => ({
    id: project.id,
    name: project.name,
    date: formatRelativeTime(project.lastModified),
    type: project.type
  }));

  const filteredProjects = recentProjects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div 
      className={`relative h-full transition-all duration-300 backdrop-blur-xl ${
        isExpanded ? 'w-72' : 'w-20'
      } ${
        'dark:bg-gray-950/40 bg-white/70 border-r border-gray-200 dark:border-white/10 shadow-2xl z-40'
      }`}
      onMouseEnter={() => onToggle(true)}
      onMouseLeave={() => onToggle(false)}
    >
      {/* Collapsed State */}
      <div className={`${isExpanded ? 'hidden' : 'flex'} flex-col items-center py-8 space-y-8 animate-in fade-in duration-300`}>
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 active:scale-95 transition-transform cursor-pointer">
          <span className="text-white font-black text-lg">M</span>
        </div>
        <div className="flex flex-col items-center space-y-6">
          <button 
            onClick={() => { setActiveTab('projects'); onToggle(true); }}
            className={`p-2 rounded-xl transition-all ${activeTab === 'projects' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'}`}
          >
            <FolderOpen className="w-5 h-5" />
          </button>
          <button 
            onClick={() => { setActiveTab('subscription'); onToggle(true); }}
            className={`p-2 rounded-xl transition-all ${activeTab === 'subscription' ? 'bg-amber-500 text-white' : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20'}`}
          >
            <Zap className="w-5 h-5" />
          </button>
          <button 
            onClick={() => { setShowCommunity(true); }}
            className={`p-2 rounded-xl transition-all ${showCommunity ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'}`}
            title="Comunidade"
          >
            <Users className="w-5 h-5" />
          </button>
          <div className="h-px w-8 bg-gray-200 dark:bg-gray-800" />
          <Settings className="w-5 h-5 text-gray-400 hover:text-blue-500 cursor-pointer transition-all hover:rotate-45" onClick={() => setShowSettings(true)} />
          <User className="w-5 h-5 text-gray-400 hover:text-blue-500 cursor-pointer transition-all" />
        </div>
      </div>

      {/* Expanded State */}
      <div className={`${isExpanded ? 'flex' : 'hidden'} h-full flex-col animate-in slide-in-from-left duration-300`}>
        <div className="p-6 border-b border-gray-200 dark:border-white/5 bg-white/50 dark:bg-transparent">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30 ring-2 ring-white/20">
              <span className="text-white font-black text-xl">M</span>
            </div>
            <div>
              <h2 className="text-gray-900 dark:text-white text-lg font-black tracking-tight leading-none italic">MAXIMUS.DEV</h2>
              <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">{getTranslation(language, 'nav.plan_pro')}</span>
              </div>
            </div>
          </div>
          
          {/* User Info Card */}
          <div className="relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center space-x-3 p-4 bg-gray-50/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl transition-all shadow-sm hover:shadow-md cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-tr from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform">
                <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 dark:text-white text-sm font-bold truncate">
                  {profile?.full_name || user?.email?.split('@')[0] || 'Usuário'}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-[10px] font-medium truncate">
                  {user?.email || 'convidado@maximus.dev'}
                </p>
              </div>
              <Crown className="w-4 h-4 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-pulse" />
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="p-4 bg-gray-50/50 dark:bg-black/10 border-b border-gray-200 dark:border-white/5">
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex-1 flex items-center justify-center space-x-2 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'projects'
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-white'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <FolderOpen className="w-3 h-3" />
              <span>Projetos</span>
            </button>
            <button
              onClick={() => setActiveTab('subscription')}
              className={`flex-1 flex items-center justify-center space-x-2 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'subscription'
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-amber-500 dark:text-white'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Zap className="w-3 h-3" />
              <span>Assinatura</span>
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
          {activeTab === 'projects' ? (
            <div className="flex-1 flex flex-col min-h-0 animate-in fade-in slide-in-from-right duration-300">
              <div className="p-4 bg-white/30 dark:bg-transparent">
                <div className="relative group">
                  <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 transition-colors group-focus-within:text-blue-500" />
                  <input
                    type="text"
                    placeholder={getTranslation(language, 'projects.search')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm dark:text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-4 pb-4">
                <div className="space-y-2">
                  {filteredProjects.length > 0 ? filteredProjects.map((project, index) => (
                    <div
                      key={index}
                      onClick={() => setCurrentProject(project.id)}
                      className="flex items-center space-x-4 p-3 bg-white/50 dark:bg-white/5 border border-transparent hover:border-blue-500/30 hover:bg-white dark:hover:bg-white/10 rounded-2xl cursor-pointer group transition-all"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${
                        project.type === 'react' ? 'bg-gradient-to-br from-blue-500 to-blue-400 shadow-blue-500/20' :
                        project.type === 'vue' ? 'bg-gradient-to-br from-green-500 to-emerald-400 shadow-green-500/20' :
                        project.type === 'next' ? 'bg-gradient-to-br from-gray-800 to-gray-700 shadow-gray-800/20' : 
                        'bg-gradient-to-br from-orange-500 to-amber-400 shadow-orange-500/20'
                      }`}>
                        <span className="text-white text-[10px] font-black uppercase tracking-tighter">
                          {project.type === 'react' ? 'RE' :
                           project.type === 'vue' ? 'VU' :
                           project.type === 'next' ? 'NX' : 'HT'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 dark:text-white text-sm font-bold truncate group-hover:text-blue-500 transition-colors">
                          {project.name}
                        </p>
                        <p className="text-gray-500 dark:text-gray-500 text-[10px] font-medium tracking-tight uppercase">
                          {project.date}
                        </p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  )) : (
                    <div className="text-center py-10">
                      <FolderOpen className="w-10 h-10 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                      <p className="text-xs text-gray-500">Nenhum projeto encontrado</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 min-h-0 animate-in fade-in slide-in-from-left duration-300 bg-white/50 dark:bg-transparent">
              <SubscriptionView />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 mt-auto border-t border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-black/20">
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={() => setShowSettings(true)}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/10 hover:border-blue-500/30 transition-all group"
            >
              <Settings className="w-4 h-4 mb-1 text-gray-500 group-hover:text-blue-500 transition-all group-hover:rotate-45" />
              <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white uppercase tracking-tighter">Setup</span>
            </button>
            <button
              onClick={() => setShowHelpCenter(true)}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/10 hover:border-blue-500/30 transition-all group"
            >
              <HelpCircle className="w-4 h-4 mb-1 text-gray-500 group-hover:text-blue-500 transition-all" />
              <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white uppercase tracking-tighter">Ajuda</span>
            </button>
          </div>

          <button
            onClick={() => setShowCommunity(true)}
            className="w-full mb-4 flex items-center justify-center space-x-3 p-4 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-blue-500/20 rounded-2xl hover:from-blue-600 hover:to-indigo-600 hover:text-white transition-all group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Users className={`w-5 h-5 ${showCommunity ? 'text-white' : 'text-blue-500 group-hover:text-white'} transition-colors`} />
            <span className="text-xs font-black uppercase tracking-widest">Acessar Comunidade</span>
          </button>

          <button
            onClick={() => {
              if (confirm(language === 'pt' ? 'Tem certeza que deseja sair?' : 'Are you sure you want to log out?')) {
                alert(language === 'pt' ? '👋 Logout Realizado!' : '👋 Logged Out!');
              }
            }}
            className="w-full flex items-center justify-center space-x-2 py-2 text-gray-400 hover:text-red-500 transition-colors group"
          >
            <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">{getTranslation(language, 'nav.logout')}</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      <SettingsModal 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
      <HelpCenter 
        isOpen={showHelpCenter}
        onClose={() => setShowHelpCenter(false)}
      />
    </div>
  );
};

export default Sidebar;