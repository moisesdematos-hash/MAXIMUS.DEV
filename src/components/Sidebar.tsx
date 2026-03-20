import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  HelpCircle, 
  Search, 
  MessageSquare, 
  Crown,
  LogOut,
  ChevronRight,
  Sun
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import SettingsModal from './SettingsModal';
import HelpCenter from './HelpCenter';
import { useProjects } from '../contexts/ProjectContext';
import { formatRelativeTime } from '../utils/timeFormatter';
import { useUI } from '../contexts/UIContext';
import { getTranslation } from '../lib/i18n';

interface SidebarProps {
  isExpanded: boolean;
  onToggle: (expanded: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isExpanded, onToggle }) => {
  const { getRecentProjects, setCurrentProject } = useProjects();
  const { language } = useUI();
  const [searchTerm, setSearchTerm] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showHelpCenter, setShowHelpCenter] = useState(false);

  const recentProjects = getRecentProjects(5).map(project => ({
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
      className={`relative h-full transition-all duration-300 ${
        'dark:bg-gray-950 dark:border-gray-800 bg-white border-gray-200'
      } ${
        isExpanded ? 'w-72' : 'w-16'
      }`}
      onMouseEnter={() => onToggle(true)}
      onMouseLeave={() => onToggle(false)}
    >
      {/* Collapsed State */}
      <div className={`${isExpanded ? 'hidden' : 'flex'} flex-col items-center py-6 space-y-6`}>
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">M</span>
        </div>
        <MessageSquare className="w-6 h-6 text-gray-400 hover:text-gray-800 dark:hover:text-white cursor-pointer transition-colors" />
        <Settings className="w-6 h-6 text-gray-400 hover:text-gray-800 dark:hover:text-white cursor-pointer transition-colors" />
      </div>

      {/* Expanded State */}
      <div className={`${isExpanded ? 'block' : 'hidden'} h-full flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
            <div>
              <h2 className="text-white dark:text-white text-gray-800 font-semibold">MAXIMUS.DEV</h2>
              <span className="text-gray-400 text-sm">{getTranslation(language, 'nav.plan_pro')}</span>
            </div>
          </div>
          
          {/* User Info */}
          <div className="flex items-center space-x-3 p-3 bg-gray-800 dark:bg-gray-800 bg-gray-100 rounded-lg">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white dark:text-white text-gray-800 text-sm font-medium">João Silva</p>
              <p className="text-gray-400 text-xs">joao@example.com</p>
            </div>
            <Crown className="w-4 h-4 text-yellow-500" />
          </div>
        </div>

        <div className="p-3 border-b border-gray-200 dark:border-gray-800 max-h-48 overflow-y-auto">
          <div className="space-y-1">
            <button
              onClick={() => setShowSettings(true)}
              className="w-full flex items-center space-x-2.5 px-2.5 py-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
              <Settings className="w-4 h-4" />
              <span className="text-sm">{getTranslation(language, 'nav.settings')}</span>
            </button>
            <button
              onClick={() => setShowHelpCenter(true)}
              className="w-full flex items-center space-x-2.5 px-2.5 py-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
              <HelpCircle className="w-4 h-4" />
              <span className="text-sm">{getTranslation(language, 'nav.help')}</span>
            </button>
            <div className="w-full flex items-center justify-between px-3 py-2">
              <div className="flex items-center space-x-3">
                <Sun className="w-4 h-4 text-gray-300 dark:text-gray-300 text-gray-600" />
                <span className="text-sm text-gray-300 dark:text-gray-300 text-gray-600">{getTranslation(language, 'nav.theme')}</span>
              </div>
              <ThemeToggle />
            </div>
              <button
                onClick={() => alert(language === 'pt' ? '🤖 Chat IA Ativado!' : '🤖 AI Chat Activated!')}
                className="w-full btn-compact bg-gradient-to-r from-purple-600 via-blue-600 to-green-500 hover:from-purple-700 hover:via-blue-700 hover:to-green-600 text-white shadow-md hover:shadow-lg transform hover:scale-105 relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span>🤖 {getTranslation(language, 'chat.ai_chat')}</span>
              </button>
            <button
              onClick={() => {
                if (confirm(language === 'pt' ? 'Tem certeza que deseja sair?' : 'Are you sure you want to log out?')) {
                  alert(language === 'pt' ? '👋 Logout Realizado!' : '👋 Logged Out!');
                }
              }}
              className="w-full flex items-center space-x-2.5 px-2.5 py-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
              <LogOut className="w-4 h-4" />
              <span className="text-sm">{getTranslation(language, 'nav.logout')}</span>
            </button>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-4 border-b border-gray-700 dark:border-gray-700 border-gray-200">
            <button
              onClick={() => alert(language === 'pt' ? '💬 Novo Chat Iniciado!' : '💬 New Chat Started!')}
              className="w-full btn-compact bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transform hover:scale-105">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{getTranslation(language, 'chat.new')}</span>
            <div className="ml-1.5 px-1.5 py-0.5 bg-white bg-opacity-20 rounded text-[10px]">
              Ctrl+N
            </div>
          </button>
        </div>

        {/* Projects Section */}
        <div className="flex-1 p-4 flex flex-col min-h-0">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={getTranslation(language, 'projects.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800 dark:bg-gray-800 bg-gray-100 border border-gray-700 dark:border-gray-700 border-gray-300 rounded-lg pl-10 pr-4 py-2 text-white dark:text-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            <h3 className="text-gray-400 dark:text-gray-400 text-gray-500 text-xs uppercase tracking-wider font-medium mb-3">
              {getTranslation(language, 'projects.recent')}
            </h3>
            <div className="bg-gray-800 dark:bg-gray-800 bg-gray-50 border border-gray-700 dark:border-gray-700 border-gray-200 rounded-lg flex-1 min-h-0">
              <div className="h-full overflow-y-auto">
                <div className="p-2 space-y-2">
                  {filteredProjects.map((project, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setCurrentProject(project.id);
                        alert(`📁 Projeto Carregado!\n\n🎯 ${project.name}\n⚡ Workspace ativo\n🚀 Código disponível no editor\n📊 Analytics atualizados`);
                      }}
                      className="flex items-center space-x-3 p-3 hover:bg-gray-700 dark:hover:bg-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer group transition-colors"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        project.type === 'react' ? 'bg-blue-500' :
                        project.type === 'vue' ? 'bg-green-500' :
                        project.type === 'next' ? 'bg-gray-700' : 'bg-orange-500'
                      }`}>
                        <span className="text-white text-xs font-medium">
                          {project.type === 'react' ? 'R' :
                           project.type === 'vue' ? 'V' :
                           project.type === 'next' ? 'N' : 'H'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white dark:text-white text-gray-800 text-sm font-medium truncate group-hover:text-blue-400">
                          {project.name}
                        </p>
                        <p className="text-gray-400 text-xs">{project.date}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      {/* Help Center Modal */}
      <HelpCenter 
        isOpen={showHelpCenter}
        onClose={() => setShowHelpCenter(false)}
      />
    </div>
  );
};

export default Sidebar;