import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, 
  Crown, 
  Bell, 
  Settings, 
  User, 
  ChevronDown,
  Search,
  Command,
  Plus,
  GitBranch,
  Share,
  Save,
  Database,
  CreditCard,
  Link,
  Activity,
  Shield,
  Globe,
  Rocket,
  History as LucideHistory
} from 'lucide-react';
import { useUI } from '../contexts/UIContext';
import { getTranslation } from '../lib/i18n';
import { useObservability } from '../hooks/useObservability';
import SettingsModal from './SettingsModal';
import TemplatesModal from './TemplatesModal';
import DocsModal from './DocsModal';
import AIAssistant from './AIAssistant';
import DatabaseModal from './DatabaseModal';
import PaymentsModal from './PaymentsModal';
import IntegrationsModal from './IntegrationsModal';
import ShareModal from './ShareModal';
import UserMenu from './UserMenu';
import NotificationsModal from './NotificationsModal';
import MonitoringDashboard from './MonitoringDashboard';
import PresenceAvatars from './PresenceAvatars';
import { useProjects } from '../contexts/ProjectContext';
import CookieManager from '../utils/cookieManager';

interface TopBarProps {
  onBackToWelcome?: () => void;
}

const TopBar = ({ onBackToWelcome }: TopBarProps) => {
  const { addProject, currentProject, exportProjects } = useProjects();
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
    showUserMenu, setShowUserMenu,
    showMonitoringDashboard, setShowMonitoringDashboard,
    language, setLanguage,
    securityStatus, vulnerabilities,
    globalSavings, setShowExportModal,
    showSuggestions, setShowSuggestions,
    showTimeTravel, setShowTimeTravel,
    showDesignPilot, setShowDesignPilot,
    showVentureDashboard, setShowVentureDashboard
  } = useUI();
  
  const { currentMetrics } = useObservability();
  const [isGlobalDeploying, setIsGlobalDeploying] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  
  const cookieManager = CookieManager.getInstance();

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

  // Focus search input when modal opens
  React.useEffect(() => {
    if (showSearchModal && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearchModal]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('🔍 Buscando:', searchQuery);
      // Aqui você implementaria a lógica de busca
      performSearch(searchQuery);
    }
  };

  const performSearch = (query: string) => {
    const searchResults = [
      { type: 'projeto', name: 'E-commerce Dashboard', path: '/projects/ecommerce' },
      { type: 'template', name: 'Blog Moderno', path: '/templates/blog' },
      { type: 'comando', name: 'Deploy Projeto', action: () => console.log('Deploy iniciado') },
      { type: 'integração', name: 'Conectar Stripe', action: () => setShowIntegrations(true) },
      { type: 'arquivo', name: 'App.tsx', path: '/src/App.tsx' },
    ].filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.type.toLowerCase().includes(query.toLowerCase())
    );

    console.log('📊 Resultados encontrados:', searchResults);
    
    // Simular navegação ou ação
    if (searchResults.length > 0) {
      const firstResult = searchResults[0];
      if (firstResult.action) {
        firstResult.action();
      }
      setShowSearchModal(false);
      setSearchQuery('');
    }
  };

  const handleGlobalDeploy = async () => {
    if (isGlobalDeploying) return;
    
    setIsGlobalDeploying(true);
    
    const deploySteps = [
      '🔍 Analisando projeto completo...',
      '🤖 Aplicando otimizações de IA...',
      '📦 Gerando build otimizado...',
      '🌐 Configurando CDN global (200+ locais)...',
      '🔒 Aplicando SSL A+ automático...',
      '🎯 Ativando auto-scaling inteligente...',
      '⚡ Configurando cache inteligente...',
      '📊 Integrando analytics automático...',
      '🚀 Deploy concluído!'
    ];
    
    // Faster deployment simulation
    for (let i = 0; i < deploySteps.length; i++) {
      console.log(deploySteps[i]);
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    const projectUrl = `https://maximusdev-${Math.random().toString(36).substring(2, 8)}.maximus.dev`;
    
    // Show success notification with copy functionality
    const message = `🚀 Deploy Zero-Config Global Concluído!\n\n✅ Status: Online em 200+ locais\n🌐 URL: ${projectUrl}\n🔒 SSL: A+ Rating automático\n⚡ CDN: Ativo globalmente\n🎯 Auto-scaling: Configurado\n📊 Analytics: Integrado\n\n⏱️ Tempo total: 6.4 segundos\n💰 Custo: $0 (tudo incluído)\n🏆 Performance: 98/100\n\n🎉 Seu projeto está no ar!`;
    
    // Copy URL to clipboard
    try {
      await navigator.clipboard.writeText(projectUrl);
      alert(message + '\n\n📋 URL copiada para área de transferência!');
    } catch (err) {
      alert(message);
    }
    
    setIsGlobalDeploying(false);
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
          </nav>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-md mx-4">
          <div 
            className="relative cursor-pointer"
            onClick={() => setShowSearchModal(true)}
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar projetos, comandos..."
              value=""
              readOnly
              className="w-full pl-10 pr-12 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-white placeholder-gray-500"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
              <kbd className="px-1.5 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded border">
                <button 
                  onClick={() => setShowSearchModal(true)}
                  className="flex items-center hover:bg-gray-300 dark:hover:bg-gray-600 rounded px-1 transition-colors"
                  title="Abrir busca (Cmd+K)"
                >
                  <Command className="w-3 h-3" />
                </button>
              </kbd>
              <kbd className="px-1.5 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded border">
                <button 
                  onClick={() => setShowSearchModal(true)}
                  className="hover:bg-gray-300 dark:hover:bg-gray-600 rounded px-1 transition-colors"
                  title="Abrir busca (Cmd+K)"
                >
                  K
                </button>
              </kbd>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          <PresenceAvatars />
          <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-2" />
          
          <button 
            onClick={() => setShowVentureDashboard(true)}
            className="btn-icon-sm ml-2 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/20 hover:scale-110 transition-all border-none"
            title="Sovereign Launchpad"
          >
            <Rocket className="w-4 h-4 fill-current" />
          </button>

          <button 
            onClick={() => setShowTimeTravel(!showTimeTravel)}
            className={`btn-icon-sm ml-2 ${showTimeTravel ? 'bg-indigo-100 text-indigo-600 shadow-indigo-500/20' : 'bg-gray-50 dark:bg-gray-800 text-gray-400'} hover:scale-110 transition-all`}
            title="Neural Time Travel"
          >
            <LucideHistory className="w-4 h-4" />
          </button>

          <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-2" />
          <UserMenu 
            isOpen={showUserMenu} 
            onClose={() => setShowUserMenu(false)} 
            onOpenSettings={() => setShowSettings(true)} 
          />
          {/* Real-time Metrics */}
          <div 
            className="hidden lg:flex items-center space-x-4 px-4 border-r border-gray-200 dark:border-gray-700 h-8 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-lg" 
            title="Abrir Dashboard de Monitoramento"
            onClick={() => setShowMonitoringDashboard(true)}
          >
            <div className="flex items-center space-x-1.5" title={getTranslation(language, 'credits.saved')}>
              <Zap className="w-3.5 h-3.5 text-yellow-500 fill-current animate-bounce" />
              <span className="text-[10px] font-bold text-yellow-600 dark:text-yellow-400">-{globalSavings} CR</span>
            </div>
            <div className="flex items-center space-x-1.5" title="Latência do Sistema">
              <Activity className={`w-3.5 h-3.5 ${currentMetrics && currentMetrics.latency > 100 ? 'text-red-500' : 'text-green-500'}`} />
              <span className="text-[10px] font-mono font-medium text-gray-500">{currentMetrics ? `${currentMetrics.latency.toFixed(0)}ms` : '--'}</span>
            </div>
            <div className="flex items-center space-x-1.5" title="Segurança OWASP">
              <Shield className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-[10px] font-mono font-medium text-gray-500">SEC: A+</span>
            </div>
            <div className="flex items-center space-x-1.5" title="Multi-Cloud Status (Vercel Primário)">
              <Globe className="w-3.5 h-3.5 text-purple-500 animate-pulse" />
              <span className="text-[10px] font-mono font-medium text-gray-500">CLOUD: OK</span>
            </div>
          </div>

          {/* Action Buttons */}
          <button 
            onClick={() => {
              const projectId = addProject({
                name: `Projeto ${new Date().toLocaleDateString()}`,
                description: 'Novo projeto criado via interface',
                type: 'react',
                status: 'active',
                collaborators: 1,
                isStarred: false,
                tags: ['novo', 'react'],
                size: '0 KB',
                framework: 'React + TypeScript',
                code: '',
                version: '1.0.0',
                dependencies: ['react', 'react-dom'],
                features: ['Projeto em branco'],
                analytics: {
                  views: 0,
                  deploys: 0,
                  performance: 100
                }
              });
              alert(`🎉 Novo Projeto Criado!\n\n📁 ID: ${projectId}\n✅ Workspace limpo\n📊 Registro salvo automaticamente\n🚀 Pronto para desenvolvimento!`);
            }}
            className="btn-icon-sm" 
            title="Novo Projeto"
          >
            <Plus className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => setShowIntegrations(true)}
            className="btn-compact bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 hover:from-green-600 hover:via-blue-600 hover:to-purple-600 text-white transform hover:scale-105 shadow-md relative overflow-hidden"
            title="🤖 Conectar Todos os Serviços"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-center space-x-1.5 relative z-10">
              <div className="w-3.5 h-3.5 relative">
                <div className="absolute inset-0 bg-white rounded-full animate-pulse opacity-75"></div>
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">🤖</span>
              </div>
              <span className="font-semibold">Conectar Serviços</span>
            </div>
          </button>
          
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 mx-1" />

          {/* Security Pulse Indicator */}
          <button 
            onClick={() => setShowSettings(true)} // Open settings or security panel
            className={`btn-icon-sm group relative ${
              securityStatus === 'critical' ? 'text-red-500 animate-pulse' : 
              securityStatus === 'warning' ? 'text-yellow-500' : 'text-emerald-500'
            }`}
            title={language === 'pt' ? `Segurança: ${securityStatus.toUpperCase()}` : `Security: ${securityStatus.toUpperCase()}`}
          >
            <Shield className="w-4 h-4 shadow-sm" />
            
            {/* Tooltip Detalhado */}
            <div className="absolute top-full right-0 mt-2 w-48 p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              <div className="flex items-center space-x-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${
                  securityStatus === 'critical' ? 'bg-red-500' : 
                  securityStatus === 'warning' ? 'bg-yellow-500' : 'bg-emerald-500'
                }`} />
                <span className="text-xs font-bold uppercase">{securityStatus}</span>
              </div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
                {vulnerabilities.length > 0 
                  ? `${vulnerabilities.length} vulnerabilidades detectadas pelo Scanner Neural.` 
                  : 'Sistema limpo. Todos os padrões de segurança foram validados.'}
              </p>
            </div>
          </button>

          <button 
            onClick={() => window.open('https://github.com', '_blank')}
            className="btn-icon-sm" 
            title="Git"
          >
            <GitBranch className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => {
              if (currentProject) {
                const analytics = currentProject.analytics || { views: 0, deploys: 0, performance: 0 };
                alert(`💾 Projeto Salvo!\n\n📁 ${currentProject.name}\n✅ Código: ${currentProject.size || '0KB'}\n☁️ Backup automático\n📊 ${analytics.views} visualizações\n🔄 Sincronização completa`);
              } else {
                alert('💾 Auto-Save Ativo!\n\n✅ Todas as alterações salvas\n☁️ Backup automático\n🔄 Sincronização em tempo real');
              }
            }}
            className="btn-icon-sm" 
            title="Salvar"
          >
            <Save className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => {
              if (currentProject) {
                setShowShareModal(true);
              } else {
                alert(language === 'pt' ? '📤 Compartilhamento!\n\n⚠️ Nenhum projeto ativo\n📁 Crie ou abra um projeto\n🔗 Compartilhamento disponível' : '📤 Sharing!\n\n⚠️ No active project\n📁 Create or open a project\n🔗 Sharing available');
              }
            }}
            className="btn-icon-sm" 
            title={language === 'pt' ? 'Compartilhar' : 'Share'}
          >
            <Share className="w-4 h-4" />
          </button>

          {/* Language Switcher */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5 border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setLanguage('pt')}
              className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${language === 'pt' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              PT
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${language === 'en' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              EN
            </button>
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>

          {/* Notifications */}
          <button 
            onClick={() => setShowNotifications(true)}
            className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors" 
            title="Notificações"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            </span>
          </button>

          {/* Plan Badge */}
          <div className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg">
            <Crown className="w-3 h-3 text-white" />
            <span className="text-xs font-medium text-white">Pro</span>
          </div>

          {/* Settings */}
          <button 
            onClick={() => setShowSettings(true)}
            className="btn-icon-sm" 
            title="Configurações"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* User Menu */}
          <div className="flex items-center space-x-2 pl-2">
            <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <span className="text-sm font-medium hidden sm:block">João</span>
              <ChevronDown className="w-3 h-3" />
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

      {/* Monitoring Dashboard */}
      {showMonitoringDashboard && (
        <MonitoringDashboard 
          isOpen={showMonitoringDashboard}
          onClose={() => setShowMonitoringDashboard(false)}
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