import React from 'react';
import { 
  Zap, 
  Settings, 
  Search,
  Command,
  Plus,
  Share2,
  Rocket,
  History as LucideHistory,
  Bell,
  Link,
  RefreshCw,
  Wallet,
  MoreVertical,
  Edit2,
  Copy,
  Download,
  Lock,
  Eye,
  FolderOpen,
  Trash2,
  User,
  Activity,
  Brain
} from 'lucide-react';
import { useUI } from '../contexts/UIContext';
import SettingsModal from './SettingsModal';
import TemplatesModal from './TemplatesModal';
import DocsModal from './DocsModal';
import AIAssistant from './AIAssistant';
import DatabaseModal from './DatabaseModal';
import PaymentsModal from './PaymentsModal';
import IntegrationsModal from './IntegrationsModal';
import ShareModal from './ShareModal';
import ThemeToggle from './ThemeToggle';
import UserMenu from './UserMenu';
import NotificationsModal from './NotificationsModal';
import MonitoringDashboard from './MonitoringDashboard';
import PresenceAvatars from './PresenceAvatars';
import VentureDashboard from './VentureDashboard';
import { useProjects } from '../contexts/ProjectContext';
import { useAuth } from '../contexts/AuthContext';
import PulseMonitor from './PulseMonitor';
import OllamaSettings from './OllamaSettings';

interface TopBarProps {
  onBackToWelcome?: () => void;
}

const TopBar = ({ onBackToWelcome }: TopBarProps) => {
  const { user, profile } = useAuth();
  const { addProject, currentProject, updateProject, deleteProject, exportProjects, pulseData, calculatePulse } = useProjects();
  const { 
    showSettings, setShowSettings,
    showTemplates, setShowTemplates,
    showDocs, setShowDocs,
    showAIAssistant, setShowAIAssistant,
    showDatabaseModal, setShowDatabaseModal,
    showPaymentsModal, setShowPaymentsModal,
    showIntegrations, setShowIntegrations,
    showSearchModal, setShowSearchModal,
    showShareModal, setShowShareModal,
    showNotifications, setShowNotifications,
    showMonitoringDashboard, setShowMonitoringDashboard,
    language, setLanguage,
    showTimeTravel, setShowTimeTravel,
    showVentureDashboard, setShowVentureDashboard,
    showPulse, setShowPulse,
    credits,
    aiProvider
  } = useUI();

  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [showOllamaSettings, setShowOllamaSettings] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Keyboard shortcut handler
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchModal(true);
      }
      // Escape to close search
      if (e.key === 'Escape' && showSearchModal) {
        setShowSearchModal(false);
        setSearchQuery('');
      }
      // K key to close search when modal is open
      if (e.key === 'k' && showSearchModal && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setShowSearchModal(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSearchModal]);

  const performSearch = (query: string) => {
    console.log('🔍 Searching projects for:', query);
    // This function is intended to trigger the search modal and set the query
    // The actual filtering/display of results happens within the SearchModal's logic
    setShowSearchModal(true);
    setSearchQuery(query);
  };

  // Focus search input when modal opens
  React.useEffect(() => {
    if (showSearchModal && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearchModal]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch(searchQuery);
    }
  };

  return (
    <>
            <div className="fixed top-0 left-0 right-0 h-14 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-50 flex items-center justify-between px-4 transition-all duration-300">
        
        {/* Left Section - Logo & Project */}
        <div className="flex items-center space-x-3 min-w-fit">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer group" onClick={onBackToWelcome}>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-blue-500/20 transition-all">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-gray-800 dark:text-white hidden sm:block">
              MAXIMUS
            </span>
          </div>

          <div className="h-5 w-px bg-gray-200 dark:bg-gray-800 hidden sm:block mx-1" />

          {/* Project Details & Management */}
          <div className="relative group/menu flex-shrink-0">
            <button className="flex items-center space-x-2 px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800/80 rounded-lg transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
              <div className="flex flex-col items-start leading-none min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-gray-800 dark:text-white truncate max-w-[150px]">
                    {currentProject?.name || 'Nenhum Projeto Ativo'}
                  </span>
                  <div className={`w-1.5 h-1.5 rounded-full ${currentProject ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse' : 'bg-gray-400'}`} />
                </div>
                <span className="text-[9px] text-gray-500 font-medium uppercase tracking-wider mt-0.5">
                  {currentProject ? `${currentProject.type}` : 'Selecione ou crie'}
                </span>
              </div>
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>
            
            {/* Project Actions Dropdown */}
            <div className="absolute top-full left-0 mt-1 w-64 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-[60]">
               <div className="px-2 pb-1 mb-1 border-b border-gray-100 dark:border-gray-800">
                 <button onClick={() => { if (!currentProject) return; const newName = prompt('Novo nome do projeto:', currentProject.name); if (newName) updateProject(currentProject.id, { name: newName }); }} className="flex items-center space-x-3 w-full px-3 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors group/item">
                   <Edit2 className="w-4 h-4 text-blue-500 group-hover/item:scale-110 transition-transform" />
                   <div className="flex flex-col items-start">
                     <span>Renomear Projeto</span>
                     <span className="text-[9px] font-medium text-gray-500">Alterar o nome</span>
                   </div>
                 </button>
                 <button onClick={() => { if (!currentProject) return; const newId = addProject({ ...currentProject, name: `${currentProject.name} (Cópia)`, createdAt: new Date().toISOString(), lastModified: new Date().toISOString() } as any); alert(`🚀 Projeto duplicado com sucesso!\nID: ${newId}`); }} className="flex items-center space-x-3 w-full px-3 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors group/item">
                   <Copy className="w-4 h-4 text-purple-500 group-item:scale-110 transition-transform" />
                   <div className="flex flex-col items-start">
                     <span>Duplicar Projeto</span>
                     <span className="text-[9px] font-medium text-gray-500">Criar uma cópia</span>
                   </div>
                 </button>
               </div>
               <div className="px-2 py-1 border-b border-gray-100 dark:border-gray-800">
                 <button onClick={() => { if (!currentProject) return; const nextVis = currentProject.is_public ? 'Privado' : 'Público'; updateProject(currentProject.id, { is_public: !currentProject.is_public } as any); alert(`👁️ Visibilidade alterada para: ${nextVis}`); }} className="flex items-center space-x-3 w-full px-3 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
                   {currentProject?.is_public ? <Eye className="w-4 h-4 text-emerald-500" /> : <Lock className="w-4 h-4 text-amber-500" />}
                   <div className="flex flex-col items-start">
                     <span>Alterar Visibilidade</span>
                     <span className="text-[9px] font-medium text-gray-500">Atual: {currentProject?.is_public ? 'Público' : 'Privado'}</span>
                   </div>
                 </button>
                 <button onClick={() => { if (!currentProject) return; const data = exportProjects(); const blob = new Blob([data], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `${currentProject.name.replace(/\s+/g, '_')}_backup.json`; a.click(); }} className="flex items-center space-x-3 w-full px-3 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors group/item">
                   <Download className="w-4 h-4 text-emerald-500" />
                   <div className="flex flex-col items-start">
                     <span>Baixar Projeto</span>
                     <span className="text-[9px] font-medium text-gray-500">Exportar código</span>
                   </div>
                 </button>
               </div>
               <div className="px-2 py-1 border-b border-gray-100 dark:border-gray-800">
                 <button onClick={() => setShowTimeTravel(true)} className="flex items-center space-x-3 w-full px-3 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors group/item">
                   <LucideHistory className="w-4 h-4 text-indigo-500" />
                   <div className="flex flex-col items-start">
                     <span>Histórico de Versões</span>
                     <span className="text-[9px] font-medium text-gray-500">Ver snapshots</span>
                   </div>
                 </button>
                 <button onClick={() => setShowSearchModal(true)} className="flex items-center space-x-3 w-full px-3 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors group/item">
                   <FolderOpen className="w-4 h-4 text-gray-500" />
                   <div className="flex flex-col items-start">
                     <span>Projetos Recentes</span>
                     <span className="text-[9px] font-medium text-gray-500">Abrir outros projetos</span>
                   </div>
                 </button>
               </div>
               <div className="px-2 pt-1">
                 <button onClick={() => { if (!currentProject) return; if (confirm(`⚠️ Tem certeza que deseja EXCLUIR o projeto "${currentProject.name}"? Esta ação não pode ser desfeita.`)) { deleteProject(currentProject.id); alert('🗑️ Projeto removido permanentemente.'); } }} className="flex items-center space-x-3 w-full px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                   <Trash2 className="w-4 h-4" />
                   <div className="flex flex-col items-start">
                     <span>Excluir Permanentemente</span>
                     <span className="text-[9px] font-medium text-red-400 opacity-70">Apagar tudo</span>
                   </div>
                 </button>
               </div>
            </div>
          </div>
        </div>

        {/* Center Section - Search & Nav */}
        <div className="flex-1 flex items-center justify-center max-w-2xl px-4 hidden md:flex">
          {/* Navigation Links */}
          <nav className="flex items-center space-x-1 mr-4">
            <button onClick={() => setShowTemplates(true)} className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              {language === 'pt' ? 'Templates' : 'Templates'}
            </button>
            <button onClick={() => setShowDocs(true)} className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              {language === 'pt' ? 'Docs' : 'Docs'}
            </button>
            <button onClick={() => setShowIntegrations(true)} className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              {language === 'pt' ? 'Integrações' : 'Integrations'}
            </button>
          </nav>

          {/* Search */}
          <div className="flex-1 relative cursor-pointer group max-w-sm" onClick={() => setShowSearchModal(true)}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Buscar (Cmd+K)"
              value=""
              readOnly
              className="w-full pl-9 pr-10 py-1.5 text-xs bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none text-gray-800 dark:text-white placeholder-gray-500 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center">
              <kbd className="px-1.5 py-0.5 text-[10px] font-medium bg-white dark:bg-gray-900 text-gray-500 rounded border border-gray-200 dark:border-gray-700 shadow-sm">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right Section - Tools & Profile */}
        <div className="flex items-center space-x-3 shrink-0">
          
          {/* Action Tools (Icons) */}
          <div className="hidden lg:flex items-center space-x-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-1">
            <button onClick={() => setShowVentureDashboard(true)} className="p-1.5 text-orange-500 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-md transition-colors" title="Sovereign Launchpad">
              <Rocket className="w-4 h-4" />
            </button>
            <button onClick={() => setShowShareModal(true)} className="p-1.5 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-md transition-colors" title="Compartilhar Projeto">
              <Share2 className="w-4 h-4" />
            </button>
            <button onClick={() => setShowTimeTravel(!showTimeTravel)} className={`p-1.5 ${showTimeTravel ? 'text-indigo-600 bg-indigo-100' : 'text-gray-400 hover:text-indigo-500 hover:bg-indigo-100 dark:hover:bg-indigo-900/30'} rounded-md transition-colors`} title="Neural Time Travel">
              <LucideHistory className="w-4 h-4" />
            </button>
            <button onClick={() => { if (currentProject) { calculatePulse(currentProject.code); } setShowPulse(true); }} className={`p-1.5 ${showPulse ? 'text-emerald-500 bg-emerald-100' : 'text-gray-400 hover:text-emerald-500 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'} rounded-md transition-colors relative`} title="Maximus Pulse Analytics">
              <Activity className="w-4 h-4" />
              <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
            </button>
            <button onClick={() => setShowOllamaSettings(true)} className={`p-1.5 ${showOllamaSettings ? 'text-purple-500 bg-purple-100' : 'text-gray-400 hover:text-purple-500 hover:bg-purple-100 dark:hover:bg-purple-900/30'} rounded-md transition-colors relative`} title="Ollama Settings">
              <Brain className="w-4 h-4" />
            </button>
          </div>

          {/* Minimal Credits */}
          <button onClick={() => setShowPaymentsModal(true)} className="hidden sm:flex items-center space-x-2 px-2.5 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors group">
            <Wallet className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">{credits.toLocaleString()}</span>
          </button>

          {/* Avatars */}
          <div className="hidden xl:block px-2">
            <PresenceAvatars />
          </div>

          <div className="h-5 w-px bg-gray-200 dark:bg-gray-800 hidden sm:block mx-1" />

          {/* System & Profile */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <button onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')} className="p-1.5 text-[10px] font-black text-gray-400 hover:text-blue-500 transition-colors uppercase">
                {language}
              </button>
              <ThemeToggle />
              <button onClick={() => setShowNotifications(true)} className="relative p-1.5 text-gray-400 hover:text-blue-500 transition-colors">
                <Bell className="w-4 h-4" />
                <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
              </button>
              <button onClick={() => setShowSettings(true)} className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            </div>
            
            <button onClick={() => setShowUserMenu(!showUserMenu)} className="ml-1 w-8 h-8 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-all">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal 
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showTemplates && (
        <TemplatesModal 
          isOpen={showTemplates}
          onClose={() => setShowTemplates(false)}
        />
      )}

      {showDocs && (
        <DocsModal 
          isOpen={showDocs}
          onClose={() => setShowDocs(false)}
        />
      )}

      {showAIAssistant && (
        <AIAssistant 
          isOpen={showAIAssistant}
          onClose={() => setShowAIAssistant(false)}
        />
      )}

      {showOllamaSettings && (
        <OllamaSettings 
          isOpen={showOllamaSettings}
          onClose={() => setShowOllamaSettings(false)}
        />
      )}

      {showDatabaseModal && (
        <DatabaseModal 
          isOpen={showDatabaseModal}
          onClose={() => setShowDatabaseModal(false)}
        />
      )}

      {showPaymentsModal && (
        <PaymentsModal 
          isOpen={showPaymentsModal}
          onClose={() => setShowPaymentsModal(false)}
        />
      )}

      {showIntegrations && (
        <IntegrationsModal 
          isOpen={showIntegrations}
          onClose={() => setShowIntegrations(false)}
          projectId={currentProject?.id}
        />
      )}

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal 
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          projectName={currentProject?.name || "MAXIMUS.DEV Project"}
          projectUrl={currentProject?.deployUrl || "https://maximusdev-abc123.maximus.dev"}
        />
      )}

      {/* User Menu */}
      <UserMenu 
        isOpen={showUserMenu}
        onClose={() => setShowUserMenu(false)}
        onOpenSettings={() => setShowSettings(true)}
      />

      {/* Notifications Modal */}
      {showNotifications && (
        <NotificationsModal 
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
        />
      )}

      {showMonitoringDashboard && (
        <MonitoringDashboard 
          onClose={() => setShowMonitoringDashboard(false)} 
        />
      )}

      {showVentureDashboard && (
        <VentureDashboard />
      )}

      {showPulse && pulseData && (
        <PulseMonitor 
          isOpen={showPulse} 
          onClose={() => setShowPulse(false)} 
          data={pulseData} 
          code={currentProject?.code || ''} 
        />
      )}

      {/* Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-[600px] shadow-xl border border-gray-200 dark:border-gray-700">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar projetos, templates, comandos, arquivos..."
                  className="w-full pl-12 pr-4 py-3 text-lg bg-transparent border-none focus:outline-none text-gray-800 dark:text-white placeholder-gray-500"
                />
              </div>
            </form>

            {/* Search Results */}
            <div className="max-h-96 overflow-y-auto">
              {searchQuery.trim() ? (
                <div className="p-2">
                  {/* Projetos */}
                  <div className="mb-4">
                    <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Projetos
                    </h3>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">E</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 dark:text-white">E-commerce Dashboard</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Última modificação: 2 horas atrás</p>
                        </div>
                        <kbd className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">↵</kbd>
                      </div>
                    </div>
                  </div>

                  {/* Comandos */}
                  <div className="mb-4">
                    <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Comandos
                    </h3>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                          <Zap className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 dark:text-white">Deploy Projeto</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Publicar projeto em produção</p>
                        </div>
                      </div>
                      <div 
                        className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
                        onClick={() => {
                          setShowIntegrations(true);
                          setShowSearchModal(false);
                          setSearchQuery('');
                        }}
                      >
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                          <Link className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 dark:text-white">Conectar Serviços</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Gerenciar integrações</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Templates */}
                  <div className="mb-4">
                    <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Templates
                    </h3>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                        <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                          <span className="text-orange-600 dark:text-orange-400 text-sm font-medium">B</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 dark:text-white">Blog Moderno</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Template para blog com CMS</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Empty State */
                <div className="p-8 text-center">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                    Busca Inteligente
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Digite para buscar projetos, templates, comandos e arquivos
                  </p>
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">↵</kbd>
                      <span>para selecionar</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Esc</kbd>
                      <span>para fechar</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-4">
                  <span>Busca inteligente ativada</span>
                  <span>•</span>
                  <span>Resultados em tempo real</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Command className="w-3 h-3" />
                  <span>+</span>
                  <span>K</span>
                </div>
                <div className="flex items-center space-x-1">
                  <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">K</kbd>
                  <span>para sair</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TopBar;