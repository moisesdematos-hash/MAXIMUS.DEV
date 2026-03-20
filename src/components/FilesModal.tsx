import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Plus, 
  FolderOpen, 
  File, 
  Folder,
  MoreVertical,
  Download,
  Share,
  Trash2,
  Edit,
  Copy,
  Archive,
  Upload,
  Grid3X3,
  List,
  Filter,
  Star,
  Clock,
  FileText,
  Image,
  Code,
  Database,
  Music,
  Video,
  Package,
  Settings,
  Eye,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Home,
  HardDrive,
  Cloud,
  Bookmark,
  Crown,
  User,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

interface FilesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: string;
  modified: string;
  path: string;
  extension?: string;
  isStarred?: boolean;
  children?: FileItem[];
}

const FilesModal: React.FC<FilesModalProps> = ({ isOpen, onClose }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPath, setCurrentPath] = useState('/');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['/']);
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState<'file' | 'folder'>('file');
  const [navigationHistory, setNavigationHistory] = useState<string[]>(['/']);
  const [historyIndex, setHistoryIndex] = useState(0);

  const files: FileItem[] = [
    {
      id: '1',
      name: 'src',
      type: 'folder',
      modified: '2 horas atrás',
      path: '/src',
      children: [
        {
          id: '2',
          name: 'components',
          type: 'folder',
          modified: '1 hora atrás',
          path: '/src/components',
          children: [
            { id: '3', name: 'App.tsx', type: 'file', size: '2.4 KB', modified: '30 min atrás', path: '/src/components/App.tsx', extension: 'tsx' },
            { id: '4', name: 'Button.tsx', type: 'file', size: '1.8 KB', modified: '1 hora atrás', path: '/src/components/Button.tsx', extension: 'tsx' },
            { id: '5', name: 'Modal.tsx', type: 'file', size: '3.2 KB', modified: '2 horas atrás', path: '/src/components/Modal.tsx', extension: 'tsx', isStarred: true },
          ]
        },
        {
          id: '6',
          name: 'hooks',
          type: 'folder',
          modified: '3 horas atrás',
          path: '/src/hooks',
          children: [
            { id: '7', name: 'useAuth.ts', type: 'file', size: '1.2 KB', modified: '3 horas atrás', path: '/src/hooks/useAuth.ts', extension: 'ts' },
            { id: '8', name: 'useApi.ts', type: 'file', size: '2.1 KB', modified: '4 horas atrás', path: '/src/hooks/useApi.ts', extension: 'ts' },
          ]
        },
        { id: '9', name: 'main.tsx', type: 'file', size: '0.8 KB', modified: '1 dia atrás', path: '/src/main.tsx', extension: 'tsx' },
        { id: '10', name: 'index.css', type: 'file', size: '1.5 KB', modified: '2 dias atrás', path: '/src/index.css', extension: 'css' },
      ]
    },
    {
      id: '11',
      name: 'public',
      type: 'folder',
      modified: '1 semana atrás',
      path: '/public',
      children: [
        { id: '12', name: 'index.html', type: 'file', size: '1.1 KB', modified: '1 semana atrás', path: '/public/index.html', extension: 'html' },
        { id: '13', name: 'favicon.ico', type: 'file', size: '4.2 KB', modified: '1 semana atrás', path: '/public/favicon.ico', extension: 'ico' },
        { id: '14', name: 'logo.png', type: 'file', size: '15.3 KB', modified: '1 semana atrás', path: '/public/logo.png', extension: 'png', isStarred: true },
      ]
    },
    {
      id: '15',
      name: 'assets',
      type: 'folder',
      modified: '3 dias atrás',
      path: '/assets',
      children: [
        { id: '16', name: 'images', type: 'folder', modified: '3 dias atrás', path: '/assets/images', children: [
          { id: '17', name: 'hero.jpg', type: 'file', size: '245 KB', modified: '3 dias atrás', path: '/assets/images/hero.jpg', extension: 'jpg' },
          { id: '18', name: 'about.png', type: 'file', size: '89 KB', modified: '3 dias atrás', path: '/assets/images/about.png', extension: 'png' },
        ]},
        { id: '19', name: 'fonts', type: 'folder', modified: '1 semana atrás', path: '/assets/fonts', children: [
          { id: '20', name: 'Inter-Regular.woff2', type: 'file', size: '28 KB', modified: '1 semana atrás', path: '/assets/fonts/Inter-Regular.woff2', extension: 'woff2' },
        ]},
      ]
    },
    { id: '21', name: 'package.json', type: 'file', size: '1.8 KB', modified: '2 dias atrás', path: '/package.json', extension: 'json', isStarred: true },
    { id: '22', name: 'vite.config.ts', type: 'file', size: '0.5 KB', modified: '1 semana atrás', path: '/vite.config.ts', extension: 'ts' },
    { id: '23', name: 'tailwind.config.js', type: 'file', size: '0.3 KB', modified: '1 semana atrás', path: '/tailwind.config.js', extension: 'js' },
    { id: '24', name: 'README.md', type: 'file', size: '2.1 KB', modified: '1 semana atrás', path: '/README.md', extension: 'md' },
    { id: '25', name: '.gitignore', type: 'file', size: '0.4 KB', modified: '1 semana atrás', path: '/.gitignore', extension: 'gitignore' },
  ];

  const getFileIcon = (file: FileItem) => {
    if (file.type === 'folder') {
      return <Folder className="w-4 h-4 text-yellow-500" />;
    }

    switch (file.extension) {
      case 'tsx':
      case 'jsx':
        return <Code className="w-4 h-4 text-blue-500" />;
      case 'ts':
      case 'js':
        return <Code className="w-4 h-4 text-yellow-600" />;
      case 'css':
        return <Code className="w-4 h-4 text-purple-500" />;
      case 'html':
        return <Code className="w-4 h-4 text-orange-500" />;
      case 'json':
        return <Database className="w-4 h-4 text-green-600" />;
      case 'md':
        return <FileText className="w-4 h-4 text-gray-600" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'svg':
        return <Image className="w-4 h-4 text-pink-500" />;
      case 'mp3':
      case 'wav':
        return <Music className="w-4 h-4 text-purple-600" />;
      case 'mp4':
      case 'avi':
        return <Video className="w-4 h-4 text-red-500" />;
      case 'zip':
      case 'rar':
        return <Package className="w-4 h-4 text-brown-500" />;
      default:
        return <File className="w-4 h-4 text-gray-500" />;
    }
  };

  const getAllFiles = (items: FileItem[]): FileItem[] => {
    let allFiles: FileItem[] = [];
    items.forEach(item => {
      allFiles.push(item);
      if (item.children) {
        allFiles = allFiles.concat(getAllFiles(item.children));
      }
    });
    return allFiles;
  };

  const filteredFiles = getAllFiles(files).filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.path.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCurrentFiles = () => {
    if (searchTerm) return filteredFiles;
    
    if (currentPath === '/') return files;
    
    const findFolder = (items: FileItem[], path: string): FileItem[] => {
      for (const item of items) {
        if (item.path === path && item.children) {
          return item.children;
        }
        if (item.children) {
          const found = findFolder(item.children, path);
          if (found.length > 0) return found;
        }
      }
      return [];
    };
    
    return findFolder(files, currentPath);
  };

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => 
      prev.includes(folderId) 
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleCreateFile = () => {
    if (!newFileName.trim()) return;
    
    console.log('Criando:', newFileType, newFileName);
    setShowNewFileModal(false);
    setNewFileName('');
    setNewFileType('file');
  };

  const renderTreeView = (items: FileItem[], level = 0) => {
    return items.map((item) => (
      <div key={item.id}>
        <div 
          className={`flex items-center space-x-2 py-1 px-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
            currentPath === item.path ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => {
            if (item.type === 'folder') {
              navigateToPath(item.path);
              toggleFolder(item.id);
            }
          }}
        >
          {item.type === 'folder' && (
            expandedFolders.includes(item.id) ? (
              <ChevronDown className="w-3 h-3 text-gray-500" />
            ) : (
              <ChevronRight className="w-3 h-3 text-gray-500" />
            )
          )}
          {getFileIcon(item)}
          <span className="text-sm flex-1">{item.name}</span>
          {item.isStarred && <Star className="w-3 h-3 text-yellow-500" fill="currentColor" />}
        </div>
        {item.children && expandedFolders.includes(item.id) && 
          renderTreeView(item.children, level + 1)}
      </div>
    ));
  };

  const breadcrumbs = currentPath.split('/').filter(Boolean);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg w-[1200px] h-[800px] shadow-xl flex">
        {/* Sidebar - Tree View */}
        <div className="w-80 bg-gray-50 dark:bg-gray-700 border-r border-gray-200 dark:border-gray-600 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-3 mb-4">
              <FolderOpen className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Explorador de Arquivos
              </h2>
            </div>
            
            {/* Quick Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowNewFileModal(true)}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Novo</span>
                </button>
                <button 
                  onClick={() => alert('📤 Upload de Arquivos!\n\n📁 Selecione arquivos\n⚡ Upload automático\n✅ Sincronização ativa')}
                  className="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors">
                  <Upload className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => alert('⚙️ Configurações de Arquivos!\n\n🔧 Preferências de exibição\n📋 Filtros personalizados\n🎨 Temas de ícones')}
                  className="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
              
              {/* Subscription and Account Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => alert('👑 Minha Assinatura!\n\n💎 Plano Pro ativo\n📅 Renovação: 15 Jan 2025\n🎯 Benefícios premium')}
                  className="flex items-center space-x-1 px-2 py-1.5 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  title="Minha Assinatura"
                >
                  <Crown className="w-4 h-4 text-yellow-500" />
                  <span className="text-xs font-medium">Pro</span>
                </button>
                
                <button
                  onClick={() => alert('👤 Selecionar Conta!\n\n🔄 Trocar usuário\n🏢 Contas empresariais\n⚙️ Configurações de acesso')}
                  className="flex items-center space-x-1 px-2 py-1.5 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  title="Selecionar Conta"
                >
                  <User className="w-4 h-4 text-blue-500" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Tree Navigation */}
          <div className="p-2 overflow-y-auto flex-1">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 px-2 py-1 text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                <Home className="w-4 h-4" />
                <span>Projeto</span>
              </div>
              {renderTreeView(files)}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                {/* Breadcrumbs */}
                <nav className="flex items-center space-x-2 text-sm">
                  <button
                    onClick={() => setCurrentPath('/')}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Projeto
                  </button>
                  {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={index}>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                      <button
                        onClick={() => setCurrentPath('/' + breadcrumbs.slice(0, index + 1).join('/'))}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        {crumb}
                      </button>
                    </React.Fragment>
                  ))}
                </nav>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search and Controls */}
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar arquivos e pastas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* File List */}
          <div className="flex-1 overflow-y-auto p-6">
            {getCurrentFiles().length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {getCurrentFiles().map((file) => (
                    <div
                      key={file.id}
                      className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer group transition-colors"
                      onClick={() => {
                        if (file.type === 'folder') {
                          setCurrentPath(file.path);
                        }
                      }}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-3">
                          {getFileIcon(file)}
                        </div>
                        <h3 className="font-medium text-gray-800 dark:text-white text-sm mb-1 truncate w-full">
                          {file.name}
                        </h3>
                        {file.size && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {file.size}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {file.modified}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  {getCurrentFiles().map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center space-x-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer group transition-colors"
                      onClick={() => {
                        if (file.type === 'folder') {
                          setCurrentPath(file.path);
                        }
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedFiles.includes(file.id)}
                        onChange={() => toggleFileSelection(file.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        {getFileIcon(file)}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-800 dark:text-white truncate">
                            {file.name}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                        {file.size && <span>{file.size}</span>}
                        <span>{file.modified}</span>
                        
                        {file.isStarred && (
                          <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                        )}
                        
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('Menu para:', file.name);
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-12">
                <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300 font-medium">
                  {searchTerm ? 'Nenhum arquivo encontrado' : 'Pasta vazia'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {searchTerm ? 'Tente ajustar os termos de busca' : 'Adicione arquivos para começar'}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center space-x-4">
                <span>{getCurrentFiles().length} itens</span>
                {selectedFiles.length > 0 && (
                  <span>{selectedFiles.length} selecionados</span>
                )}
              </div>
              
              {selectedFiles.length > 0 && (
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => alert('📥 Download Iniciado!\n\n📦 Compactando arquivos\n⬇️ Download automático\n✅ Arquivos prontos')}
                    className="flex items-center space-x-1 px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors">
                    <Download className="w-4 h-4" />
                    <span>Baixar</span>
                  </button>
                  <button 
                    onClick={() => alert('🔗 Compartilhamento Ativo!\n\n📤 Links gerados\n👥 Permissões configuradas\n🌐 Acesso público')}
                    className="flex items-center space-x-1 px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors">
                    <Share className="w-4 h-4" />
                    <span>Compartilhar</span>
                  </button>
                  <button 
                    onClick={() => alert('🗑️ Exclusão Confirmada!\n\n⚠️ Arquivos removidos\n🔄 Lixeira disponível\n💾 Backup recomendado')}
                    className="flex items-center space-x-1 px-3 py-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors">
                    <Trash2 className="w-4 h-4" />
                    <span>Excluir</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* New File Modal */}
      {showNewFileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Criar Novo Item
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tipo
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="file"
                      checked={newFileType === 'file'}
                      onChange={(e) => setNewFileType(e.target.value as 'file' | 'folder')}
                      className="mr-2"
                    />
                    <File className="w-4 h-4 mr-1 text-blue-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Arquivo</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="folder"
                      checked={newFileType === 'folder'}
                      onChange={(e) => setNewFileType(e.target.value as 'file' | 'folder')}
                      className="mr-2"
                    />
                    <Folder className="w-4 h-4 mr-1 text-yellow-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Pasta</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder={newFileType === 'file' ? 'exemplo.tsx' : 'nova-pasta'}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowNewFileModal(false);
                  setNewFileName('');
                }}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateFile}
                disabled={!newFileName.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FilesModal;