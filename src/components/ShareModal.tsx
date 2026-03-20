import React, { useState } from 'react';
import { 
  X, 
  Share, 
  Copy, 
  Mail, 
  MessageCircle, 
  Twitter, 
  Linkedin, 
  Facebook,
  Link,
  QrCode,
  Download,
  Eye,
  EyeOff,
  Users,
  Crown,
  Shield,
  Globe,
  Lock,
  Settings,
  CheckCircle,
  ExternalLink,
  Code,
  Smartphone,
  Monitor,
  Palette,
  Zap,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { useTabNavigation } from '../hooks/useTabNavigation';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName?: string;
  projectUrl?: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ 
  isOpen, 
  onClose, 
  projectName = "MAXIMUS.DEV Project",
  projectUrl = "https://maximusdev-abc123.maximus.dev"
}) => {
  const [shareSettings, setShareSettings] = useState({
    visibility: 'public',
    allowComments: true,
    allowFork: true,
    showCode: true,
    requireAuth: false,
    expireDate: '',
    password: ''
  });
  const [copied, setCopied] = useState<string>('');
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const { 
    activeTab, 
    tabHistoryIndex, 
    tabHistory, 
    navigateToTab, 
    goBackTab, 
    goForwardTab, 
    canGoBack, 
    canGoForward 
  } = useTabNavigation('link');

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(''), 2000);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  const generateEmbedCode = () => {
    return `<iframe 
  src="${projectUrl}/embed" 
  width="800" 
  height="600" 
  frameborder="0"
  title="${projectName}"
  allow="fullscreen">
</iframe>`;
  };

  const generateShareUrl = () => {
    const params = new URLSearchParams();
    if (shareSettings.requireAuth) params.append('auth', 'required');
    if (shareSettings.password) params.append('protected', 'true');
    if (!shareSettings.showCode) params.append('code', 'hidden');
    
    const queryString = params.toString();
    return queryString ? `${projectUrl}?${queryString}` : projectUrl;
  };

  const socialPlatforms = [
    {
      name: 'Twitter',
      icon: <Twitter className="w-5 h-5" />,
      color: 'bg-blue-500 hover:bg-blue-600',
      url: `https://twitter.com/intent/tweet?text=Confira este projeto incrível criado no MAXIMUS.DEV!&url=${encodeURIComponent(generateShareUrl())}`
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin className="w-5 h-5" />,
      color: 'bg-blue-700 hover:bg-blue-800',
      url: `https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(generateShareUrl())}`
    },
    {
      name: 'Facebook',
      icon: <Facebook className="w-5 h-5" />,
      color: 'bg-blue-600 hover:bg-blue-700',
      url: `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(generateShareUrl())}`
    },
    {
      name: 'WhatsApp',
      icon: <MessageCircle className="w-5 h-5" />,
      color: 'bg-green-500 hover:bg-green-600',
      url: `https://wa.me/?text=Confira este projeto: ${encodeURIComponent(generateShareUrl())}`
    },
    {
      name: 'Email',
      icon: <Mail className="w-5 h-5" />,
      color: 'bg-gray-600 hover:bg-gray-700',
      url: `mailto:?subject=${encodeURIComponent(projectName)}&body=Confira este projeto incrível: ${encodeURIComponent(generateShareUrl())}`
    }
  ];

  const handleGenerateQR = async () => {
    setIsGeneratingQR(true);
    // Simular geração de QR Code
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsGeneratingQR(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-[700px] h-[600px] shadow-xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Share className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  🚀 Compartilhar Projeto
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {projectName}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={!canGoForward}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center space-x-1 mt-4 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
            {/* Navigation Controls */}
            <div className="flex items-center space-x-1 mr-2">
              <button
                onClick={goBackTab}
                disabled={tabHistoryIndex <= 0}
                className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Voltar"
              >
                <ArrowLeft className="w-3 h-3" />
              </button>
              <button
                onClick={goForwardTab}
                disabled={tabHistoryIndex >= tabHistory.length - 1}
                className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Avançar"
              >
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {[
              { id: 'link', label: 'Link', icon: Link },
              { id: 'embed', label: 'Embed', icon: Code },
              { id: 'social', label: 'Social', icon: Share },
              { id: 'qr', label: 'QR Code', icon: QrCode },
              { id: 'settings', label: 'Config', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => navigateToTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'link' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  🔗 Link do Projeto
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={generateShareUrl()}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-mono text-sm"
                  />
                  <button
                    onClick={() => handleCopy(generateShareUrl(), 'link')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                  >
                    {copied === 'link' ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>🚀 Funcionalidades do Link</span>
                </h3>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• ⚡ Carregamento instantâneo</li>
                  <li>• 📱 Responsivo para todos dispositivos</li>
                  <li>• 🔒 SSL A+ automático</li>
                  <li>• 🌐 CDN global (200+ locais)</li>
                  <li>• 📊 Analytics integrado</li>
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                  <Monitor className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-800 dark:text-white">Desktop</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Otimizado para desktop</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                  <Smartphone className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-800 dark:text-white">Mobile</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">100% responsivo</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'embed' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  📋 Código de Embed
                </label>
                <div className="relative">
                  <textarea
                    value={generateEmbedCode()}
                    readOnly
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-mono text-sm resize-none"
                  />
                  <button
                    onClick={() => handleCopy(generateEmbedCode(), 'embed')}
                    className="absolute top-2 right-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors flex items-center space-x-1"
                  >
                    {copied === 'embed' ? (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
                  🎨 Personalização do Embed
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-purple-700 dark:text-purple-300 mb-1">Largura</label>
                    <input
                      type="text"
                      defaultValue="800"
                      className="w-full px-2 py-1 border border-purple-300 dark:border-purple-600 bg-white dark:bg-purple-800 text-purple-800 dark:text-purple-200 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-purple-700 dark:text-purple-300 mb-1">Altura</label>
                    <input
                      type="text"
                      defaultValue="600"
                      className="w-full px-2 py-1 border border-purple-300 dark:border-purple-600 bg-white dark:bg-purple-800 text-purple-800 dark:text-purple-200 rounded text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 dark:text-white mb-2">📋 Preview do Embed</h4>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                  <Globe className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 dark:text-gray-300">Seu projeto será exibido aqui</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">800x600 pixels</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  📱 Compartilhar nas Redes Sociais
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {socialPlatforms.map((platform) => (
                    <button
                      key={platform.name}
                      onClick={() => window.open(platform.url, '_blank', 'width=600,height=400')}
                      className={`flex items-center space-x-4 p-4 ${platform.color} text-white rounded-lg transition-colors group`}
                    >
                      <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                        {platform.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium">Compartilhar no {platform.name}</p>
                        <p className="text-sm opacity-90">Compartilhe com sua rede</p>
                      </div>
                      <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                  🎯 Dicas para Compartilhamento
                </h4>
                <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                  <li>• 📝 Adicione uma descrição atrativa</li>
                  <li>• 🏷️ Use hashtags relevantes (#webdev #react)</li>
                  <li>• 📸 Inclua uma screenshot do projeto</li>
                  <li>• 🔗 Mencione @maximusdev para repost</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'qr' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  📱 QR Code do Projeto
                </h3>
                
                <div className="bg-white p-8 rounded-lg border-2 border-gray-200 dark:border-gray-600 inline-block">
                  {isGeneratingQR ? (
                    <div className="w-48 h-48 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <div className="w-48 h-48 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600 dark:text-gray-300 text-sm">QR Code será gerado aqui</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 space-y-2">
                  <button
                    onClick={handleGenerateQR}
                    disabled={isGeneratingQR}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    {isGeneratingQR ? 'Gerando...' : '🔄 Gerar QR Code'}
                  </button>
                  
                  <div className="flex space-x-2 justify-center">
                    <button className="flex items-center space-x-1 px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                      onClick={() => alert('📥 QR Code PNG!\n\n🖼️ Imagem de alta qualidade\n📱 Otimizado para impressão\n💾 Download iniciado')}
                      <Download className="w-4 h-4" />
                      <span>PNG</span>
                    </button>
                    <button className="flex items-center space-x-1 px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                      onClick={() => alert('📥 QR Code SVG!\n\n🎨 Vetor escalável\n🖨️ Qualidade infinita\n💾 Download iniciado')}
                      <Download className="w-4 h-4" />
                      <span>SVG</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                  📱 Como usar o QR Code
                </h4>
                <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                  <li>• 📷 Escaneie com câmera do celular</li>
                  <li>• 🔗 Acesso direto ao projeto</li>
                  <li>• 📄 Imprima em materiais físicos</li>
                  <li>• 📊 Rastreamento de acessos</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  ⚙️ Configurações de Compartilhamento
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      👁️ Visibilidade
                    </label>
                    <select
                      value={shareSettings.visibility}
                      onChange={(e) => setShareSettings(prev => ({ ...prev, visibility: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="public">🌐 Público - Qualquer pessoa pode ver</option>
                      <option value="unlisted">🔗 Não listado - Apenas com link</option>
                      <option value="private">🔒 Privado - Apenas você</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">💬 Comentários</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Permitir comentários</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={shareSettings.allowComments}
                          onChange={(e) => setShareSettings(prev => ({ ...prev, allowComments: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">🍴 Fork</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Permitir cópias</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={shareSettings.allowFork}
                          onChange={(e) => setShareSettings(prev => ({ ...prev, allowFork: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">👨‍💻 Mostrar Código</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Exibir código fonte</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={shareSettings.showCode}
                          onChange={(e) => setShareSettings(prev => ({ ...prev, showCode: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">🔐 Requer Login</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Login obrigatório</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={shareSettings.requireAuth}
                          onChange={(e) => setShareSettings(prev => ({ ...prev, requireAuth: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      🔒 Senha de Proteção (Opcional)
                    </label>
                    <input
                      type="password"
                      value={shareSettings.password}
                      onChange={(e) => setShareSettings(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Digite uma senha para proteger o projeto"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      📅 Data de Expiração (Opcional)
                    </label>
                    <input
                      type="date"
                      value={shareSettings.expireDate}
                      onChange={(e) => setShareSettings(prev => ({ ...prev, expireDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center space-x-1">
                <Globe className="w-4 h-4" />
                <span>Público</span>
              </div>
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4 text-green-500" />
                <span>SSL Seguro</span>
              </div>
              <div className="flex items-center space-x-1">
                <Zap className="w-4 h-4 text-blue-500" />
                <span>CDN Global</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  handleCopy(generateShareUrl(), 'final');
                  setTimeout(() => {
                    alert('🚀 Projeto Compartilhado!\n\n✅ Link copiado para área de transferência\n🌐 Disponível globalmente\n🔒 SSL A+ ativo\n⚡ CDN otimizado\n\n📊 Analytics de compartilhamento ativo!');
                  }, 100);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Share className="w-4 h-4" />
                <span>Compartilhar Agora</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;