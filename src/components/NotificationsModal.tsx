import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  Check, 
  Trash2, 
  Settings, 
  Filter,
  Search,
  Clock,
  User,
  Code,
  Zap,
  CreditCard,
  Shield,
  Globe,
  Heart,
  Star,
  AlertCircle,
  CheckCircle,
  Info,
  MessageSquare,
  GitBranch,
  Database,
  Package,
  Crown,
  Activity,
  TrendingUp,
  Calendar,
  Mail,
  Phone,
  Link,
  ExternalLink,
  Eye,
  EyeOff,
  Archive,
  Bookmark,
  Flag,
  MoreVertical,
  RefreshCw,
  Volume2,
  VolumeX,
  Smartphone,
  Monitor,
  Download,
  Share,
  Copy,
  Edit,
  Plus,
  Minus,
  Target,
  Award,
  Gift,
  Sparkles,
  Brain,
  Palette,
  Layers
} from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info' | 'update' | 'achievement' | 'collaboration' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  category: 'project' | 'system' | 'billing' | 'security' | 'social' | 'achievement';
  actionUrl?: string;
  actionLabel?: string;
  avatar?: string;
  metadata?: {
    projectName?: string;
    userName?: string;
    amount?: string;
    version?: string;
  };
}

const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'starred' | 'project' | 'system'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    soundEnabled: true,
    projectUpdates: true,
    systemAlerts: true,
    billingAlerts: true,
    securityAlerts: true,
    socialNotifications: true,
    achievementNotifications: true,
    collaborationNotifications: true
  });

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: '🚀 Deploy Concluído',
      message: 'Seu projeto "E-commerce Dashboard" foi publicado com sucesso em https://ecommerce-abc123.maximus.dev',
      timestamp: '2 minutos atrás',
      isRead: false,
      isStarred: false,
      category: 'project',
      actionUrl: 'https://ecommerce-abc123.maximus.dev',
      actionLabel: 'Ver Projeto',
      metadata: {
        projectName: 'E-commerce Dashboard'
      }
    },
    {
      id: '2',
      type: 'achievement',
      title: '🏆 Nova Conquista Desbloqueada!',
      message: 'Parabéns! Você desbloqueou a conquista "Speed Demon" por fazer deploy em menos de 10 segundos.',
      timestamp: '15 minutos atrás',
      isRead: false,
      isStarred: true,
      category: 'achievement',
      actionUrl: '/achievements',
      actionLabel: 'Ver Conquistas'
    },
    {
      id: '3',
      type: 'collaboration',
      title: '🤝 Novo Colaborador',
      message: 'Maria Santos foi adicionada como colaboradora no projeto "Task Manager App".',
      timestamp: '1 hora atrás',
      isRead: true,
      isStarred: false,
      category: 'social',
      metadata: {
        userName: 'Maria Santos',
        projectName: 'Task Manager App'
      }
    },
    {
      id: '4',
      type: 'warning',
      title: '⚠️ Limite de API Próximo',
      message: 'Você usou 85% do limite mensal da API OpenAI. Considere fazer upgrade para Pro+.',
      timestamp: '2 horas atrás',
      isRead: true,
      isStarred: false,
      category: 'billing',
      actionUrl: '/billing',
      actionLabel: 'Fazer Upgrade'
    },
    {
      id: '5',
      type: 'info',
      title: '🔄 Atualização Disponível',
      message: 'Nova versão do MAXIMUS.DEV disponível com melhorias de IA e performance.',
      timestamp: '3 horas atrás',
      isRead: true,
      isStarred: false,
      category: 'system',
      actionUrl: '/updates',
      actionLabel: 'Ver Novidades',
      metadata: {
        version: 'v2.1.0'
      }
    },
    {
      id: '6',
      type: 'success',
      title: '💳 Pagamento Processado',
      message: 'Pagamento de R$ 299,90 do Plano Pro foi processado com sucesso.',
      timestamp: '1 dia atrás',
      isRead: true,
      isStarred: false,
      category: 'billing',
      metadata: {
        amount: 'R$ 299,90'
      }
    },
    {
      id: '7',
      type: 'error',
      title: '🔒 Tentativa de Login Suspeita',
      message: 'Detectamos uma tentativa de login de localização não reconhecida (IP: 192.168.1.100).',
      timestamp: '2 dias atrás',
      isRead: true,
      isStarred: true,
      category: 'security',
      actionUrl: '/security',
      actionLabel: 'Verificar Segurança'
    },
    {
      id: '8',
      type: 'info',
      title: '📊 Relatório Semanal',
      message: 'Seu relatório semanal está pronto: 12 projetos criados, 45 deploys realizados.',
      timestamp: '3 dias atrás',
      isRead: true,
      isStarred: false,
      category: 'project'
    },
    {
      id: '9',
      type: 'collaboration',
      title: '💬 Novo Comentário',
      message: 'Pedro Costa comentou no seu projeto "Portfolio Website": "Design incrível! Parabéns!"',
      timestamp: '4 dias atrás',
      isRead: true,
      isStarred: false,
      category: 'social',
      metadata: {
        userName: 'Pedro Costa',
        projectName: 'Portfolio Website'
      }
    },
    {
      id: '10',
      type: 'system',
      title: '🛠️ Manutenção Programada',
      message: 'Manutenção programada para domingo, 21/01 às 02:00. Duração estimada: 30 minutos.',
      timestamp: '1 semana atrás',
      isRead: true,
      isStarred: false,
      category: 'system'
    }
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'info': return <Info className="w-5 h-5 text-blue-500" />;
      case 'update': return <RefreshCw className="w-5 h-5 text-purple-500" />;
      case 'achievement': return <Award className="w-5 h-5 text-yellow-500" />;
      case 'collaboration': return <User className="w-5 h-5 text-blue-500" />;
      case 'system': return <Settings className="w-5 h-5 text-gray-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'project': return <Code className="w-4 h-4 text-blue-500" />;
      case 'system': return <Settings className="w-4 h-4 text-gray-500" />;
      case 'billing': return <CreditCard className="w-4 h-4 text-green-500" />;
      case 'security': return <Shield className="w-4 h-4 text-red-500" />;
      case 'social': return <Heart className="w-4 h-4 text-pink-500" />;
      case 'achievement': return <Award className="w-4 h-4 text-yellow-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = activeFilter === 'all' || 
                         (activeFilter === 'unread' && !notification.isRead) ||
                         (activeFilter === 'starred' && notification.isStarred) ||
                         notification.category === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const starredCount = notifications.filter(n => n.isStarred).length;

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId 
        ? { ...notification, isRead: true }
        : notification
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })));
  };

  const handleToggleStar = (notificationId: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId 
        ? { ...notification, isStarred: !notification.isStarred }
        : notification
    ));
  };

  const handleDeleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
  };

  const handleDeleteSelected = () => {
    if (selectedNotifications.length > 0) {
      setNotifications(prev => prev.filter(notification => !selectedNotifications.includes(notification.id)));
      setSelectedNotifications([]);
    }
  };

  const handleSelectNotification = (notificationId: string) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const handleSelectAll = () => {
    const allIds = filteredNotifications.map(n => n.id);
    setSelectedNotifications(prev => 
      prev.length === allIds.length ? [] : allIds
    );
  };

  const handleTestNotification = () => {
    const testNotification: Notification = {
      id: Date.now().toString(),
      type: 'info',
      title: '🧪 Notificação de Teste',
      message: 'Esta é uma notificação de teste para verificar o sistema.',
      timestamp: 'agora',
      isRead: false,
      isStarred: false,
      category: 'system'
    };
    
    setNotifications(prev => [testNotification, ...prev]);
    console.log('🔔 Notificação de teste criada!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-[800px] h-[700px] shadow-xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center relative">
                <Bell className="w-5 h-5 text-white" />
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{unreadCount}</span>
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  🔔 Central de Notificações
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {unreadCount} não lidas • {starredCount} importantes
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleTestNotification}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                title="Criar notificação de teste"
              >
                🧪 Teste
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Configurações de notificação"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="mt-4 space-y-4">
            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
              {[
                { id: 'all', label: 'Todas', count: notifications.length },
                { id: 'unread', label: 'Não Lidas', count: unreadCount },
                { id: 'starred', label: 'Importantes', count: starredCount },
                { id: 'project', label: 'Projetos', count: notifications.filter(n => n.category === 'project').length },
                { id: 'system', label: 'Sistema', count: notifications.filter(n => n.category === 'system').length }
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id as any)}
                  className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                    activeFilter === filter.id
                      ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
                  }`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar notificações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
                >
                  ✅ Marcar Todas Lidas
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
              ⚙️ Configurações de Notificação
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: 'emailNotifications', label: '📧 Email', icon: Mail },
                { key: 'pushNotifications', label: '🔔 Push', icon: Bell },
                { key: 'soundEnabled', label: '🔊 Som', icon: Volume2 },
                { key: 'projectUpdates', label: '📁 Projetos', icon: Code },
                { key: 'systemAlerts', label: '⚙️ Sistema', icon: Settings },
                { key: 'billingAlerts', label: '💳 Billing', icon: CreditCard },
                { key: 'securityAlerts', label: '🔒 Segurança', icon: Shield },
                { key: 'socialNotifications', label: '👥 Social', icon: Heart },
                { key: 'achievementNotifications', label: '🏆 Conquistas', icon: Award },
                { key: 'collaborationNotifications', label: '🤝 Colaboração', icon: User }
              ].map((setting) => {
                const Icon = setting.icon;
                return (
                  <div key={setting.key} className="flex items-center justify-between p-2 bg-white dark:bg-gray-600 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Icon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{setting.label}</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings[setting.key as keyof typeof notificationSettings]}
                        onChange={(e) => setNotificationSettings(prev => ({ 
                          ...prev, 
                          [setting.key]: e.target.checked 
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bulk Actions */}
        {selectedNotifications.length > 0 && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                {selectedNotifications.length} notificações selecionadas
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    selectedNotifications.forEach(id => handleMarkAsRead(id));
                    setSelectedNotifications([]);
                  }}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
                >
                  ✅ Marcar Lidas
                </button>
                <button
                  onClick={handleDeleteSelected}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                >
                  🗑️ Excluir
                </button>
                <button
                  onClick={() => setSelectedNotifications([])}
                  className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotifications.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    !notification.isRead ? 'bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(notification.id)}
                      onChange={() => handleSelectNotification(notification.id)}
                      className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className={`font-medium ${
                            !notification.isRead 
                              ? 'text-gray-900 dark:text-white' 
                              : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {notification.title}
                          </h4>
                          <p className={`text-sm mt-1 ${
                            !notification.isRead 
                              ? 'text-gray-700 dark:text-gray-300' 
                              : 'text-gray-600 dark:text-gray-400'
                          }`}>
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                              <Clock className="w-3 h-3" />
                              <span>{notification.timestamp}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              {getCategoryIcon(notification.category)}
                              <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                {notification.category}
                              </span>
                            </div>
                          </div>
                          
                          {notification.actionUrl && (
                            <button
                              onClick={() => {
                                console.log('Navegando para:', notification.actionUrl);
                                handleMarkAsRead(notification.id);
                              }}
                              className="mt-3 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                            >
                              {notification.actionLabel || 'Ver Mais'}
                            </button>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-1 ml-4">
                          <button
                            onClick={() => handleToggleStar(notification.id)}
                            className={`p-1 rounded transition-colors ${
                              notification.isStarred 
                                ? 'text-yellow-500 hover:text-yellow-600' 
                                : 'text-gray-400 hover:text-yellow-500'
                            }`}
                            title={notification.isStarred ? 'Remover dos importantes' : 'Marcar como importante'}
                          >
                            <Star className="w-4 h-4" fill={notification.isStarred ? 'currentColor' : 'none'} />
                          </button>
                          
                          {!notification.isRead && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="p-1 text-gray-400 hover:text-green-500 rounded transition-colors"
                              title="Marcar como lida"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleDeleteNotification(notification.id)}
                            className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
                            title="Excluir notificação"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <Bell className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                {searchTerm ? 'Nenhuma notificação encontrada' : 'Todas as notificações lidas!'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                {searchTerm 
                  ? 'Tente ajustar os termos de busca ou filtros' 
                  : 'Você está em dia com todas as suas notificações'}
              </p>
              {!searchTerm && (
                <button
                  onClick={handleTestNotification}
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  🧪 Criar Notificação de Teste
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
              <button
                onClick={handleSelectAll}
                className="flex items-center space-x-1 hover:text-gray-800 dark:hover:text-white transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Selecionar todas</span>
              </button>
              <span>{filteredNotifications.length} notificações</span>
              {unreadCount > 0 && (
                <span className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>{unreadCount} não lidas</span>
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center space-x-1">
                {notificationSettings.soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-green-500" />
                ) : (
                  <VolumeX className="w-4 h-4 text-gray-400" />
                )}
                <span>Som {notificationSettings.soundEnabled ? 'ativo' : 'inativo'}</span>
              </div>
              <span>•</span>
              <span>Atualização automática</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsModal;