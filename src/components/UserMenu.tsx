import React, { useState, useRef, useEffect } from 'react';
import { 
  User, 
  Settings, 
  Crown, 
  LogOut, 
  Bell, 
  Shield, 
  CreditCard,
  HelpCircle,
  Moon,
  Sun,
  Globe,
  Key,
  Download,
  Upload,
  Star,
  Heart,
  Gift,
  Zap,
  Activity,
  BarChart3,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Building,
  Edit,
  Camera,
  Trash2,
  Copy,
  ExternalLink,
  ChevronRight,
  Check,
  X,
  Plus,
  Minus,
  RefreshCw,
  Archive,
  Bookmark,
  Flag,
  Award,
  Target,
  TrendingUp,
  DollarSign,
  Clock,
  FileText,
  Code,
  Database,
  Palette,
  Layers,
  Monitor,
  Smartphone,
  Eye,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useTabNavigation } from '../hooks/useTabNavigation';
import { useAuth } from '../contexts/AuthContext';

interface UserMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
}

interface UserStats {
  projectsCreated: number;
  templatesUsed: number;
  deploysCompleted: number;
  collaborations: number;
  totalViews: number;
  codeLines: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const UserMenu: React.FC<UserMenuProps> = ({ isOpen, onClose, onOpenSettings }) => {
  const { isDark, toggleTheme } = useTheme();
  const { user, profile, signOut, updateProfile } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isUpgradingPlan, setIsUpgradingPlan] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
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

  const [editFormData, setEditFormData] = useState({
    full_name: '',
    avatar_url: ''
  });

  React.useEffect(() => {
    if (profile) {
      setEditFormData({
        full_name: profile.full_name || '',
        avatar_url: profile.avatar_url || ''
      });
    }
  }, [profile]);

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const displayEmail = user?.email || '';
  const joinDate = profile?.created_at ? new Date(profile.created_at).toLocaleDateString('pt-BR') : 'Recente';

  const [userStats] = useState<UserStats>({
    projectsCreated: 47,
    templatesUsed: 23,
    deploysCompleted: 156,
    collaborations: 12,
    totalViews: 8420,
    codeLines: 125000
  });

  const [achievements] = useState<Achievement[]>([
    {
      id: '1',
      name: '🚀 Primeiro Deploy',
      description: 'Publicou seu primeiro projeto',
      icon: <Zap className="w-4 h-4" />,
      unlocked: true,
      rarity: 'common'
    },
    {
      id: '2',
      name: '💎 Criador Prolífico',
      description: 'Criou mais de 50 projetos',
      icon: <Star className="w-4 h-4" />,
      unlocked: false,
      progress: 47,
      maxProgress: 50,
      rarity: 'rare'
    },
    {
      id: '3',
      name: '🏆 Master Developer',
      description: 'Escreveu mais de 100k linhas de código',
      icon: <Award className="w-4 h-4" />,
      unlocked: true,
      rarity: 'epic'
    },
    {
      id: '4',
      name: '🌟 Influenciador',
      description: 'Projetos visualizados 10k+ vezes',
      icon: <TrendingUp className="w-4 h-4" />,
      unlocked: false,
      progress: 8420,
      maxProgress: 10000,
      rarity: 'legendary'
    },
    {
      id: '5',
      name: '🤝 Colaborador',
      description: 'Participou de 10+ colaborações',
      icon: <Heart className="w-4 h-4" />,
      unlocked: true,
      rarity: 'rare'
    },
    {
      id: '6',
      name: '⚡ Speed Demon',
      description: 'Deploy em menos de 10 segundos',
      icon: <Target className="w-4 h-4" />,
      unlocked: true,
      rarity: 'epic'
    }
  ]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('📦 Erro: Arquivo muito grande (máximo 2MB).');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setEditFormData(prev => ({ ...prev, avatar_url: reader.result as string }));
        console.log('📸 Nova foto de perfil selecionada no menu!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async () => {
    setIsSavingProfile(true);
    try {
      const { error } = await updateProfile({
        full_name: editFormData.full_name,
        avatar_url: editFormData.avatar_url
      });

      if (error) {
        alert('Erro ao atualizar perfil: ' + error.message);
      } else {
        setIsEditingProfile(false);
        alert('✅ Perfil atualizado com sucesso!');
      }
    } catch (err) {
      alert('Erro ao atualizar perfil');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePlanUpgrade = async () => {
    setIsUpgradingPlan(true);
    
    const upgradeSteps = [
      '💳 Processando upgrade...',
      '🔄 Ativando funcionalidades Pro+...',
      '⚡ Configurando recursos avançados...',
      '🎯 Aplicando benefícios premium...',
      '✅ Upgrade concluído!'
    ];
    
    for (let i = 0; i < upgradeSteps.length; i++) {
      console.log(upgradeSteps[i]);
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    setUserProfile(prev => ({ ...prev, plan: 'Pro+' }));
    setIsUpgradingPlan(false);
    
    alert('🎉 Upgrade para Pro+ Concluído!\n\n✅ Projetos ilimitados\n🤖 IA avançada\n⚡ Deploy prioritário\n🎯 Analytics premium\n💎 Suporte VIP\n\n🚀 Bem-vindo ao Pro+!');
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-orange-500';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getRarityLabel = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'Comum';
      case 'rare': return 'Raro';
      case 'epic': return 'Épico';
      case 'legendary': return 'Lendário';
      default: return rarity;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />
      
      {/* Menu */}
      <div 
        ref={menuRef}
        className="absolute top-14 right-4 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center overflow-hidden border-2 border-white dark:border-gray-800">
                {profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-white" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                <Crown className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {displayName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {displayEmail}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="px-2 py-1 bg-gradient-to-r from-blue-400 to-cyan-500 text-white text-xs font-medium rounded-full">
                  Plano Free
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          {/* Navigation Controls */}
          <div className="flex items-center space-x-1 px-2">
            <button
              onClick={goBackTab}
              disabled={!canGoBack}
              className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Voltar"
            >
              <ArrowLeft className="w-3 h-3" />
            </button>
            <button
              onClick={goForwardTab}
              disabled={!canGoForward}
              className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Avançar"
            >
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {[
            { id: 'profile', label: 'Perfil', icon: User },
            { id: 'stats', label: 'Stats', icon: BarChart3 },
            { id: 'achievements', label: 'Conquistas', icon: Award },
            { id: 'billing', label: 'Plano', icon: CreditCard }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => navigateToTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-1 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 border-b-2 border-blue-600'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:block">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="max-h-96 overflow-y-auto">
          {activeTab === 'profile' && (
            <div className="p-6 space-y-4">
              {!isEditingProfile ? (
                <>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{displayEmail}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Membro desde {joinDate}</span>
                    </div>
                    {profile?.full_name && (
                      <div className="flex items-center space-x-3">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{profile.full_name}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Editar Perfil</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-col items-center space-y-3 mb-4">
                    <div className="relative group">
                      <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center overflow-hidden border-2 border-blue-500/20">
                        {editFormData.avatar_url ? (
                          <img 
                            src={editFormData.avatar_url} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-10 h-10 text-gray-400" />
                        )}
                      </div>
                      <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity">
                        <Camera className="w-6 h-6 text-white" />
                        <input 
                          type="file" 
                          onChange={handleFileChange} 
                          accept="image/*" 
                          className="hidden" 
                        />
                      </label>
                    </div>
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Clique para alterar</span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nome completo
                    </label>
                    <input
                      type="text"
                      value={editFormData.full_name}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, full_name: e.target.value }))}
                      placeholder="Seu nome"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={handleProfileUpdate}
                      disabled={isSavingProfile}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                    >
                      {isSavingProfile ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Salvando...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Salvar</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setIsEditingProfile(false)}
                      disabled={isSavingProfile}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancelar</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="p-6">
              <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                📊 Suas Estatísticas
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Code className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Projetos</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                    {userStats.projectsCreated}
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-green-800 dark:text-green-200">Deploys</span>
                  </div>
                  <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                    {userStats.deploysCompleted}
                  </p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Eye className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Views</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                    {userStats.totalViews.toLocaleString()}
                  </p>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Activity className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    <span className="text-sm font-medium text-orange-800 dark:text-orange-200">Linhas</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-800 dark:text-orange-200">
                    {(userStats.codeLines / 1000).toFixed(0)}k
                  </p>
                </div>
              </div>

              <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h5 className="font-medium text-gray-800 dark:text-white mb-3">
                  🏆 Ranking Global
                </h5>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Posição:</span>
                    <span className="font-medium text-gray-800 dark:text-white">#1,247 de 50k+</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Top:</span>
                    <span className="font-medium text-green-600">2.5%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Nível:</span>
                    <span className="font-medium text-purple-600">Expert (Nível 8)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="p-6">
              <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                🏆 Conquistas
              </h4>
              
              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      achievement.unlocked
                        ? 'border-transparent bg-gradient-to-r ' + getRarityColor(achievement.rarity) + ' text-white'
                        : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        achievement.unlocked
                          ? 'bg-white bg-opacity-20'
                          : 'bg-gray-200 dark:bg-gray-600'
                      }`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h5 className={`font-medium ${
                          achievement.unlocked
                            ? 'text-white'
                            : 'text-gray-800 dark:text-white'
                        }`}>
                          {achievement.name}
                        </h5>
                        <p className={`text-sm ${
                          achievement.unlocked
                            ? 'text-white text-opacity-90'
                            : 'text-gray-600 dark:text-gray-300'
                        }`}>
                          {achievement.description}
                        </p>
                        {achievement.progress && achievement.maxProgress && (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Progresso</span>
                              <span>{achievement.progress}/{achievement.maxProgress}</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1">
                              <div 
                                className="bg-blue-600 h-1 rounded-full transition-all duration-500"
                                style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          achievement.unlocked
                            ? 'bg-white bg-opacity-20 text-white'
                            : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                        }`}>
                          {getRarityLabel(achievement.rarity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="p-6">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900 dark:to-orange-900 p-4 rounded-lg mb-4">
                <div className="flex items-center space-x-3">
                  <Crown className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">
                      Plano {userProfile.plan}
                    </h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Renovação automática em {userProfile.planExpiry}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h5 className="font-medium text-gray-800 dark:text-white mb-3">
                    💎 Benefícios Ativos
                  </h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Check className="w-3 h-3 text-green-500" />
                      <span className="text-gray-700 dark:text-gray-300">Projetos ilimitados</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-3 h-3 text-green-500" />
                      <span className="text-gray-700 dark:text-gray-300">IA avançada</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-3 h-3 text-green-500" />
                      <span className="text-gray-700 dark:text-gray-300">Deploy prioritário</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-3 h-3 text-green-500" />
                      <span className="text-gray-700 dark:text-gray-300">Suporte premium</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePlanUpgrade}
                  disabled={isUpgradingPlan}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg transition-all duration-200"
                >
                  {isUpgradingPlan ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Processando...</span>
                    </>
                  ) : (
                    <>
                      <Crown className="w-4 h-4" />
                      <span>Upgrade para Pro+</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                <span className="text-sm">Tema</span>
              </button>
              
              <button
                onClick={() => {
                  onOpenSettings();
                  onClose();
                }}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm">Config</span>
              </button>
            </div>
            
            <button
              onClick={async () => {
                if (confirm('Tem certeza que deseja sair?')) {
                  await signOut();
                  onClose();
                }
              }}
              className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;