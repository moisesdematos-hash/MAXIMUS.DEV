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
  Activity
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
    credits
  } = useUI();

  const [showUserMenu, setShowUserMenu] = React.useState(false);
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
      <div className="fixed top-0 left-0 right-0 h-12 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 z-50 flex items-center justify-between px-4 transition-all duration-300">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={onBackToWelcome}>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              MAXIMUS.DEV
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setShowTemplates(true)}
              className="px-2.5 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-blue-900/20 rounded-md transition-colors"
            >
              {language === 'pt' ? 'Templates' : 'Templates'}
            </button>
            <button
              onClick={() => setShowDocs(true)}
              className="px-2.5 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-blue-900/20 rounded-md transition-colors"
            >
              {language === 'pt' ? 'Docs' : 'Docs'}
            </button>
            <button
              onClick={() => setShowIntegrations(true)}
              className="px-2.5 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-blue-900/20 rounded-md transition-colors"
            >
              {language === 'pt' ? 'Integrações' : 'Integrations'}
            </button>
          </nav>
        </div>

        {/* Center Section - Search & Project Management */}
        <div className="flex-1 flex items-center justify-center space-x-6 mx-4">
          {/* Resized Search */}
          <div 
            className="w-full max-w-[180px] relative cursor-pointer group"
            onClick={() => setShowSearchModal(true)}
          >
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Buscar..."
              value=""
              readOnly
              className="w-full pl-8 pr-10 py-1.5 text-xs bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none text-gray-800 dark:text-white placeholder-gray-500 cursor-pointer hover:border-gray-300 dark:hover:border-gray-600 transition-all"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center">
              <kbd className="px-1 py-0.5 text-[10px] bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded border border-gray-300 dark:border-gray-600">
                K
              </kbd>
            </div>
          </div>

          {/* Project Details & Management */}
          <div className="flex items-center space-x-3 px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:shadow-lg hover:shadow-blue-500/5 transition-all group/project">
            <div className="flex flex-col items-start leading-none min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black text-gray-800 dark:text-white truncate max-w-[200px]">
                  {currentProject?.name || 'Nenhum Projeto Ativo'}
                </span>
                <div className={`w-1 h-1 rounded-full ${currentProject ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
              </div>
              <span className="text-[9px] text-gray-500 dark:text-gray-500 font-medium uppercase tracking-tighter">
                {currentProject ? `${currentProject.type} • ${currentProject.is_public ? 'Público' : 'Privado'}` : 'Selecione ou crie um novo'}
              </span>
            </div>

            <div className="h-6 w-px bg-gray-200 dark:bg-gray-800" />

            <div className="relative group/menu">
              <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-blue-500">
                <MoreVertical className="w-4 h-4" />
              </button>
              
              {/* Project Actions Dropdown */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-[60] backdrop-blur-xl">
                 {/* ... (keep actions rest same) ... */}
                   {/* Primary Actions */}
                   <div className="px-2 pb-1 mb-1 border-b border-gray-100 dark:border-gray-800">
                     <button 
                       onClick={() => {
                         if (!currentProject) return;
                         const newName = prompt('Novo nome do projeto:', currentProject.name);
                         if (newName) updateProject(currentProject.id, { name: newName });
                       }}
                       className="flex items-center space-x-3 w-full px-3 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors group/item"
                     >
                       <Edit2 className="w-4 h-4 text-blue-500 group-hover/item:scale-110 transition-transform" />
                       <div className="flex flex-col items-start">
                         <span>Renomear Projeto</span>
                         <span className="text-[9px] font-medium text-gray-500 dark:text-gray-500">Alterar o nome identificador</span>
                       </div>
                     </button>

                     <button 
                       onClick={() => {
                         if (!currentProject) return;
                         const newId = addProject({ 
                           ...currentProject, 
                           name: `${currentProject.name} (Cópia)`,
                           createdAt: new Date().toISOString(),
                           lastModified: new Date().toISOString()
                         } as any);
                         alert(`🚀 Projeto duplicado com sucesso!\nID: ${newId}`);
                       }}
                       className="flex items-center space-x-3 w-full px-3 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors group/item"
                     >
                       <Copy className="w-4 h-4 text-purple-500 group-item:scale-110 transition-transform" />
                       <div className="flex flex-col items-start">
                         <span>Duplicar Projeto</span>
                         <span className="text-[9px] font-medium text-gray-500 dark:text-gray-500">Criar uma cópia idêntica</span>
                       </div>
                     </button>
                   </div>

                   {/* Visibility & Export */}
                   <div className="px-2 py-1 border-b border-gray-100 dark:border-gray-800">
                     <div className="px-3 py-1 text-[9px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest">Configurações</div>
                     <button 
                       onClick={() => {
                         if (!currentProject) return;
                         const nextVis = currentProject.is_public ? 'Privado' : 'Público';
                         updateProject(currentProject.id, { is_public: !currentProject.is_public } as any);
                         alert(`👁️ Visibilidade alterada para: ${nextVis}`);
                       }}
                       className="flex items-center space-x-3 w-full px-3 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
                     >
                       {currentProject?.is_public ? <Eye className="w-4 h-4 text-emerald-500" /> : <Lock className="w-4 h-4 text-amber-500" />}
                       <div className="flex flex-col items-start">
                         <span>Alterar Visibilidade</span>
                         <span className="text-[9px] font-medium text-gray-500 dark:text-gray-500">
                           Atual: {currentProject?.is_public ? 'Público' : 'Privado'}
                         </span>
                       </div>
                     </button>

                     <button 
                       onClick={() => {
                         if (!currentProject) return;
                         const data = exportProjects();
                         const blob = new Blob([data], { type: 'application/json' });
                         const url = URL.createObjectURL(blob);
                         const a = document.createElement('a');
                         a.href = url;
                         a.download = `${currentProject.name.replace(/\s+/g, '_')}_backup.json`;
                         a.click();
                       }}
                       className="flex items-center space-x-3 w-full px-3 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors group/item"
                     >
                       <Download className="w-4 h-4 text-emerald-500" />
                       <div className="flex flex-col items-start">
                         <span>Baixar Projeto</span>
                         <span className="text-[9px] font-medium text-gray-500 dark:text-gray-500">Exportar código e metadados</span>
                       </div>
                     </button>
                   </div>

                   {/* History & Recents */}
                   <div className="px-2 py-1 border-b border-gray-100 dark:border-gray-800">
                     <button 
                       onClick={() => setShowTimeTravel(true)}
                       className="flex items-center space-x-3 w-full px-3 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors group/item"
                     >
                       <LucideHistory className="w-4 h-4 text-indigo-500" />
                       <div className="flex flex-col items-start">
                         <span>Histórico de Versões</span>
                         <span className="text-[9px] font-medium text-gray-500 dark:text-gray-500">Ver snapshots temporais</span>
                       </div>
                     </button>

                     <button 
                       onClick={() => setShowSearchModal(true)}
                       className="flex items-center space-x-3 w-full px-3 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors group/item"
                     >
                       <FolderOpen className="w-4 h-4 text-gray-500" />
                       <div className="flex flex-col items-start">
                         <span>Projetos Recentes</span>
                         <span className="text-[9px] font-medium text-gray-500 dark:text-gray-500">Abrir outros espaços de trabalho</span>
                       </div>
                     </button>
                   </div>

                   {/* Danger Zone */}
                   <div className="px-2 pt-1">
                     <button 
                       onClick={() => {
                         if (!currentProject) return;
                         if (confirm(`⚠️ Tem certeza que deseja EXCLUIR o projeto "${currentProject.name}"? Esta ação não pode ser desfeita.`)) {
                           deleteProject(currentProject.id);
                           alert('🗑️ Projeto removido permanentemente.');
                         }
                       }}
                       className="flex items-center space-x-3 w-full px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                     >
                       <Trash2 className="w-4 h-4" />
                       <div className="flex flex-col items-start">
                         <span>Excluir Permanentemente</span>
                         <span className="text-[9px] font-medium text-red-400 dark:text-red-400 opacity-70">Apagar todos os arquivos</span>
                       </div>
                     </button>
                   </div>
                </div>
              </div>
            </div>
          </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          <PresenceAvatars />
          
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 mx-2" />


          {/* Credits Display */}
          <button 
            onClick={() => setShowPaymentsModal(true)}
            className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200/50 dark:border-emerald-800/30 rounded-lg hover:scale-105 transition-all duration-300 group"
            title="Seu Saldo de Créditos"
          >
            <div className="w-5 h-5 bg-emerald-100 dark:bg-emerald-800 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
              <Wallet className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex flex-col items-start leading-none">
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tighter">Créditos</span>
              <span className="text-sm font-black text-gray-800 dark:text-white">{credits.toLocaleString()}</span>
            </div>
            <Plus className="w-2.5 h-2.5 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
          </button>

          <button
            onClick={() => {
              setShowPaymentsModal(true);
              // Trigger sync after modal opens is handled by the modal's internal logic or can be a custom event
            }}
            className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all group"
            title="Sincronizar Créditos"
          >
            <RefreshCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-700" />
          </button>
          
          <div className="h-4 w-px bg-gray-200 dark:bg-gray-800 mx-1" />
          
          <div className="flex items-center -space-x-1">
            <button 
              onClick={() => setShowVentureDashboard(true)}
              className="p-1.5 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-all"
              title="Sovereign Launchpad"
            >
              <Rocket className="w-4 h-4" />
            </button>

            <button 
              onClick={() => setShowShareModal(true)}
              className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
              title="Compartilhar Projeto"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button 
              onClick={() => setShowTimeTravel(!showTimeTravel)}
              className={`p-1.5 ${showTimeTravel ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'} rounded-lg transition-all`}
              title="Neural Time Travel"
            >
              <LucideHistory className="w-4 h-4" />
            </button>

            <button 
              onClick={() => {
                if (currentProject) {
                  calculatePulse(currentProject.code);
                }
                setShowPulse(true);
              }}
              className={`p-1.5 ${showPulse ? 'text-emerald-500 bg-emerald-50' : 'text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'} rounded-lg transition-all relative`}
              title="Maximus Pulse Analytics"
            >
              <Activity className="w-4 h-4" />
              <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
            </button>
          </div>

          <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 mx-2" />

          {/* Language / Notifications / Settings */}
          <div className="flex items-center space-x-1 bg-gray-50 dark:bg-gray-900/50 p-1 rounded-xl border border-gray-200 dark:border-gray-800/50">
            <button
              onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
              className="px-2 py-1 text-[10px] font-black text-gray-500 hover:text-blue-500 transition-colors uppercase"
            >
              {language}
            </button>
            
            <div className="h-4 w-px bg-gray-200 dark:bg-gray-800 mx-1" />
            <ThemeToggle />
            <div className="h-4 w-px bg-gray-200 dark:bg-gray-800 mx-1" />

            <button 
              onClick={() => setShowNotifications(true)}
              className="relative p-1.5 text-gray-400 hover:text-blue-500 transition-colors" 
              title="Notificações"
            >
              <Bell className="w-4 h-4" />
              <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-900" />
            </button>

            <button 
              onClick={() => setShowSettings(true)}
              className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors" 
              title="Configurações"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

          <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 mx-2" />

          {/* Profile */}
          <div className="flex items-center space-x-3 ml-2">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="hidden sm:flex flex-col items-end leading-tight mr-1 hover:opacity-80 transition-opacity"
            >
              <span className="text-[10px] font-bold text-gray-800 dark:text-gray-200">
                {profile?.full_name || user?.email?.split('@')[0] || 'Dev Maximus'}
              </span>
              <span className="text-[8px] font-medium text-blue-500 uppercase tracking-widest">
                Professional
              </span>
            </button>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-8 h-8 rounded-full overflow-hidden border-2 border-blue-500/20 hover:border-blue-500/50 transition-all shadow-lg shadow-blue-500/10"
            >
              {profile?.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
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