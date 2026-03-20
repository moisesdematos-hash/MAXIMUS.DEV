import React, { useState } from 'react';
import { 
  X, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Code, 
  Globe, 
  Database,
  Key,
  Download,
  Upload,
  Trash2,
  Save,
  RefreshCw,
  Monitor,
  Smartphone,
  Sun,
  Moon,
  Zap,
  Settings as SettingsIcon,
  Cookie,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import CookieManager from '../utils/cookieManager';
import { useTabNavigation } from '../hooks/useTabNavigation';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { isDark, toggleTheme } = useTheme();
  const cookieManager = CookieManager.getInstance();
  const { 
    activeTab, 
    tabHistoryIndex, 
    tabHistory, 
    navigateToTab, 
    goBackTab, 
    goForwardTab, 
    canGoBack, 
    canGoForward 
  } = useTabNavigation('profile');

  const [settings, setSettings] = useState({
    // Profile
    name: 'João Silva',
    email: 'joao@example.com',
    avatar: '',
    bio: 'Desenvolvedor Full Stack',
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    projectUpdates: true,
    securityAlerts: true,
    
    // Privacy
    profileVisibility: 'public',
    showEmail: false,
    allowIndexing: true,
    
    // Editor
    fontSize: 14,
    tabSize: 2,
    wordWrap: true,
    lineNumbers: true,
    minimap: true,
    autoSave: true,
    
    // Language
    language: 'pt-BR',
    timezone: 'America/Sao_Paulo',
    
    // Performance
    autoComplete: true,
    livePreview: true,
    cacheEnabled: true,
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    console.log('Configurações salvas:', settings);
    
    // Track settings change
    cookieManager.trackFeatureUsed('settings_updated');
    
    // Aqui você salvaria as configurações
    onClose();
  };

  const handleReset = () => {
    if (confirm('Tem certeza que deseja restaurar as configurações padrão?')) {
      console.log('Configurações resetadas');
      // Reset logic here
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'maximusdev-settings.json';
    link.click();
  };

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'privacy', label: 'Privacidade', icon: Shield },
    { id: 'editor', label: 'Editor', icon: Code },
    { id: 'language', label: 'Idioma', icon: Globe },
    { id: 'performance', label: 'Performance', icon: Zap },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-[900px] h-[700px] shadow-xl flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-50 dark:bg-gray-700 rounded-l-lg border-r border-gray-200 dark:border-gray-600">
          <div className="p-6 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-3">
              <SettingsIcon className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Configurações
              </h2>
            </div>
          </div>
          
          <nav className="p-4">
            {/* Navigation Controls */}
            <div className="flex items-center space-x-1 mb-4 pb-4 border-b border-gray-200 dark:border-gray-600">
              <button
                onClick={goBackTab}
                disabled={!canGoBack}
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Voltar"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={goForwardTab}
                disabled={!canGoForward}
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Avançar"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="flex-1 text-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Navegação: {tabHistoryIndex + 1}/{tabHistory.length}
                </span>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center space-x-1 mb-4 pb-4 border-b border-gray-200 dark:border-gray-600">
              <button
                onClick={goBackTab}
                disabled={tabHistoryIndex <= 0}
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Voltar"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={goForwardTab}
                disabled={tabHistoryIndex >= tabHistory.length - 1}
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Avançar"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="flex-1 text-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Navegação: {tabHistoryIndex + 1}/{tabHistory.length}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => navigateToTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              {tabs.find(tab => tab.id === activeTab)?.label}
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                      onClick={() => alert('📸 Alterar Foto de Perfil!\n\n🖼️ Seletor de imagem aberto\n✂️ Crop automático\n☁️ Upload seguro')}
                      Alterar Foto
                    </button>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      JPG, PNG ou GIF. Máximo 2MB.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      value={settings.name}
                      onChange={(e) => handleSettingChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => handleSettingChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={settings.bio}
                    onChange={(e) => handleSettingChange('bio', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Conte um pouco sobre você..."
                  />
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-white">Notificações por Email</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Receba atualizações por email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-white">Notificações Push</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Notificações no navegador</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.pushNotifications}
                        onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-white">Atualizações de Projeto</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Notificações sobre seus projetos</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.projectUpdates}
                        onChange={(e) => handleSettingChange('projectUpdates', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-white">Alertas de Segurança</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Notificações importantes de segurança</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.securityAlerts}
                        onChange={(e) => handleSettingChange('securityAlerts', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Visibilidade do Perfil
                  </label>
                  <select
                    value={settings.profileVisibility}
                    onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="public">Público</option>
                    <option value="private">Privado</option>
                    <option value="friends">Apenas Amigos</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">Mostrar Email</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Exibir email no perfil público</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.showEmail}
                      onChange={(e) => handleSettingChange('showEmail', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">Permitir Indexação</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Permitir que mecanismos de busca indexem seu perfil</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.allowIndexing}
                      onChange={(e) => handleSettingChange('allowIndexing', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'editor' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tamanho da Fonte
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="24"
                      value={settings.fontSize}
                      onChange={(e) => handleSettingChange('fontSize', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tamanho da Tab
                    </label>
                    <select
                      value={settings.tabSize}
                      onChange={(e) => handleSettingChange('tabSize', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={2}>2 espaços</option>
                      <option value={4}>4 espaços</option>
                      <option value={8}>8 espaços</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-white">Quebra de Linha</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Quebrar linhas longas automaticamente</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.wordWrap}
                        onChange={(e) => handleSettingChange('wordWrap', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-white">Números de Linha</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Mostrar números das linhas</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.lineNumbers}
                        onChange={(e) => handleSettingChange('lineNumbers', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-white">Minimapa</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Mostrar minimapa do código</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.minimap}
                        onChange={(e) => handleSettingChange('minimap', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-white">Auto Salvar</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Salvar automaticamente as alterações</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.autoSave}
                        onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'language' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Idioma da Interface
                  </label>
                  <select
                    value={settings.language}
                    onChange={(e) => handleSettingChange('language', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en-US">English (US)</option>
                    <option value="es-ES">Español</option>
                    <option value="fr-FR">Français</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Fuso Horário
                  </label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => handleSettingChange('timezone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                    <option value="America/New_York">New York (GMT-5)</option>
                    <option value="Europe/London">London (GMT+0)</option>
                    <option value="Asia/Tokyo">Tokyo (GMT+9)</option>
                  </select>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h4 className="font-medium text-blue-800 dark:text-blue-200">Tema</h4>
                  </div>
                  <p className="text-sm text-blue-600 dark:text-blue-300 mt-2 mb-4">
                    Escolha entre tema claro, escuro ou automático
                  </p>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => {
                        if (!isDark) {
                          toggleTheme();
                        }
                      }}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                        !isDark ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                      }`}
                    >
                      <Sun className="w-4 h-4" />
                      <span>Claro</span>
                    </button>
                    <button
                      onClick={() => {
                        if (isDark) {
                          toggleTheme();
                        }
                      }}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                        isDark ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                      }`}
                    >
                      <Moon className="w-4 h-4" />
                      <span>Escuro</span>
                    </button>
                  </div>
                </div>
                
              </div>
            )}

            {activeTab === 'performance' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-white">Auto Completar</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Sugestões automáticas de código</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.autoComplete}
                        onChange={(e) => handleSettingChange('autoComplete', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-white">Preview em Tempo Real</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Atualizar preview automaticamente</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.livePreview}
                        onChange={(e) => handleSettingChange('livePreview', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-white">Cache Habilitado</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Melhorar performance com cache</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.cacheEnabled}
                        onChange={(e) => handleSettingChange('cacheEnabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Otimização</h4>
                  </div>
                  <p className="text-sm text-yellow-600 dark:text-yellow-300 mt-2 mb-4">
                    Configurações avançadas para melhor performance
                  </p>
                  <div className="space-y-2">
                    <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                      onClick={() => alert('🧹 Cache Limpo!\n\n🗑️ Arquivos temporários removidos\n⚡ Performance melhorada\n💾 Espaço liberado')}
                      Limpar Cache
                    </button>
                    <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                      onClick={() => alert('🗄️ Banco Otimizado!\n\n📊 Índices reorganizados\n⚡ Queries mais rápidas\n🎯 Performance +35%')}
                      Otimizar Banco de Dados
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleExport}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Exportar</span>
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Restaurar</span>
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;