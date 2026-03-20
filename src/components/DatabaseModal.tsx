import React, { useState } from 'react';
import { 
  X, 
  Database, 
  Plus, 
  Search, 
  Play, 
  Pause, 
  Settings, 
  BarChart3,
  Users,
  Table,
  Key,
  Shield,
  Zap,
  Globe,
  CheckCircle,
  AlertCircle,
  Clock,
  Activity,
  Server,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Copy,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  Edit,
  Save,
  Filter,
  SortAsc,
  SortDesc,
  ExternalLink,
  Code,
  Terminal,
  FileText,
  Layers,
  GitBranch,
  Cloud,
  Smartphone,
  Monitor,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { useTabNavigation } from '../hooks/useTabNavigation';

interface DatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DatabaseConnection {
  id: string;
  name: string;
  type: 'postgresql' | 'mysql' | 'mongodb' | 'redis' | 'supabase' | 'firebase';
  status: 'connected' | 'connecting' | 'disconnected' | 'error';
  host: string;
  port: number;
  database: string;
  tables: number;
  size: string;
  lastBackup: string;
  performance: number;
  connections: number;
  maxConnections: number;
}

interface Table {
  name: string;
  rows: number;
  size: string;
  lastModified: string;
  type: 'table' | 'view' | 'function';
}

const DatabaseModal: React.FC<DatabaseModalProps> = ({ isOpen, onClose }) => {
  const [selectedConnection, setSelectedConnection] = useState<string>('supabase-main');
  const [isConnecting, setIsConnecting] = useState(false);
  const [showNewConnectionModal, setShowNewConnectionModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showQueryBuilder, setShowQueryBuilder] = useState(false);
  const [customQuery, setCustomQuery] = useState('');
  const [queryResults, setQueryResults] = useState<any[]>([]);
  const [isExecutingQuery, setIsExecutingQuery] = useState(false);
  const { 
    activeTab, 
    tabHistoryIndex, 
    tabHistory, 
    navigateToTab, 
    goBackTab, 
    goForwardTab, 
    canGoBack, 
    canGoForward 
  } = useTabNavigation('overview');

  const [connections] = useState<DatabaseConnection[]>([
    {
      id: 'supabase-main',
      name: 'Supabase Production',
      type: 'supabase',
      status: 'connected',
      host: 'db.supabase.co',
      port: 5432,
      database: 'postgres',
      tables: 12,
      size: '2.4 GB',
      lastBackup: '2 horas atrás',
      performance: 94,
      connections: 8,
      maxConnections: 100
    },
    {
      id: 'mongodb-dev',
      name: 'MongoDB Development',
      type: 'mongodb',
      status: 'connected',
      host: 'cluster0.mongodb.net',
      port: 27017,
      database: 'dev_db',
      tables: 8,
      size: '1.2 GB',
      lastBackup: '1 dia atrás',
      performance: 87,
      connections: 3,
      maxConnections: 50
    },
    {
      id: 'redis-cache',
      name: 'Redis Cache',
      type: 'redis',
      status: 'connected',
      host: 'redis.maximus.dev',
      port: 6379,
      database: 'cache',
      tables: 0,
      size: '256 MB',
      lastBackup: 'N/A',
      performance: 98,
      connections: 15,
      maxConnections: 1000
    },
    {
      id: 'mysql-legacy',
      name: 'MySQL Legacy',
      type: 'mysql',
      status: 'disconnected',
      host: 'mysql.legacy.com',
      port: 3306,
      database: 'legacy_db',
      tables: 45,
      size: '8.7 GB',
      lastBackup: '1 semana atrás',
      performance: 72,
      connections: 0,
      maxConnections: 200
    }
  ]);

  const [tables] = useState<Table[]>([
    { name: 'users', rows: 15420, size: '2.1 MB', lastModified: '2 horas atrás', type: 'table' },
    { name: 'projects', rows: 8930, size: '5.4 MB', lastModified: '1 hora atrás', type: 'table' },
    { name: 'templates', rows: 156, size: '890 KB', lastModified: '3 dias atrás', type: 'table' },
    { name: 'deployments', rows: 45230, size: '12.3 MB', lastModified: '30 min atrás', type: 'table' },
    { name: 'analytics', rows: 892340, size: '156 MB', lastModified: '5 min atrás', type: 'table' },
    { name: 'user_sessions', rows: 23450, size: '3.2 MB', lastModified: '1 hora atrás', type: 'table' },
    { name: 'api_keys', rows: 1240, size: '145 KB', lastModified: '1 dia atrás', type: 'table' },
    { name: 'notifications', rows: 67890, size: '8.9 MB', lastModified: '15 min atrás', type: 'table' },
    { name: 'user_stats_view', rows: 15420, size: 'N/A', lastModified: '2 horas atrás', type: 'view' },
    { name: 'calculate_metrics', rows: 0, size: 'N/A', lastModified: '1 semana atrás', type: 'function' }
  ]);

  const currentConnection = connections.find(c => c.id === selectedConnection);

  const getConnectionIcon = (type: string) => {
    switch (type) {
      case 'supabase': return <Database className="w-4 h-4 text-green-500" />;
      case 'postgresql': return <Database className="w-4 h-4 text-blue-500" />;
      case 'mysql': return <Database className="w-4 h-4 text-orange-500" />;
      case 'mongodb': return <Database className="w-4 h-4 text-green-600" />;
      case 'redis': return <Database className="w-4 h-4 text-red-500" />;
      case 'firebase': return <Database className="w-4 h-4 text-yellow-500" />;
      default: return <Database className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-50 dark:bg-green-900 dark:text-green-300';
      case 'connecting': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900 dark:text-yellow-300';
      case 'disconnected': return 'text-gray-600 bg-gray-50 dark:bg-gray-900 dark:text-gray-300';
      case 'error': return 'text-red-600 bg-red-50 dark:bg-red-900 dark:text-red-300';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'connected': return 'Conectado';
      case 'connecting': return 'Conectando';
      case 'disconnected': return 'Desconectado';
      case 'error': return 'Erro';
      default: return status;
    }
  };

  const getTableIcon = (type: string) => {
    switch (type) {
      case 'table': return <Table className="w-4 h-4 text-blue-500" />;
      case 'view': return <Eye className="w-4 h-4 text-purple-500" />;
      case 'function': return <Code className="w-4 h-4 text-green-500" />;
      default: return <Table className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleConnect = async (connectionId: string) => {
    setIsConnecting(true);
    // Simulate connection
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsConnecting(false);
    console.log(`Conectado ao banco: ${connectionId}`);
  };

  const handleExecuteQuery = async () => {
    if (!customQuery.trim()) return;
    
    setIsExecutingQuery(true);
    
    // Simulate query execution
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock results
    const mockResults = [
      { id: 1, name: 'João Silva', email: 'joao@example.com', created_at: '2024-01-15' },
      { id: 2, name: 'Maria Santos', email: 'maria@example.com', created_at: '2024-01-16' },
      { id: 3, name: 'Pedro Costa', email: 'pedro@example.com', created_at: '2024-01-17' }
    ];
    
    setQueryResults(mockResults);
    setIsExecutingQuery(false);
  };

  const handleAutoOptimize = async () => {
    console.log('🤖 Iniciando otimização automática do banco...');
    
    const optimizationSteps = [
      '🔍 Analisando performance das queries...',
      '📊 Identificando índices faltantes...',
      '⚡ Otimizando consultas lentas...',
      '🗂️ Reorganizando estrutura de dados...',
      '🚀 Aplicando otimizações automáticas...',
      '✅ Otimização concluída!'
    ];
    
    for (let i = 0; i < optimizationSteps.length; i++) {
      console.log(optimizationSteps[i]);
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    alert('🤖 Otimização Automática Concluída!\n\n📊 Performance: +35% melhoria\n⚡ Queries: 60% mais rápidas\n🗂️ Índices: 8 criados automaticamente\n💾 Espaço: 20% redução no uso\n\n🎯 Banco otimizado pela IA!');
  };

  const filteredTables = tables.filter(table =>
    table.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-[1200px] h-[800px] shadow-xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  🗄️ Database Manager IA
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Gerencie bancos de dados com inteligência artificial
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleAutoOptimize}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-200"
                title="🤖 Otimização Automática com IA"
              >
                <div className="w-4 h-4 relative">
                  <div className="absolute inset-0 bg-white rounded-full animate-pulse opacity-75"></div>
                  <Zap className="w-4 h-4 relative z-10" />
                </div>
                <span>🤖 Auto-Otimizar</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Connection Selector */}
          <div className="mt-4 flex items-center space-x-4">
            <select
              value={selectedConnection}
              onChange={(e) => setSelectedConnection(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {connections.map((conn) => (
                <option key={conn.id} value={conn.id}>
                  {conn.name} ({conn.type})
                </option>
              ))}
            </select>
            
            {currentConnection && (
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(currentConnection.status)}`}>
                  {getStatusLabel(currentConnection.status)}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {currentConnection.connections}/{currentConnection.maxConnections} conexões
                </span>
              </div>
            )}
            
            <button
              onClick={() => setShowNewConnectionModal(true)}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Conexão</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center space-x-1 mt-4 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
            {/* Navigation Controls */}
            <div className="flex items-center space-x-1 mr-2">
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
              { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
              { id: 'tables', label: 'Tabelas', icon: Table },
              { id: 'queries', label: 'Queries', icon: Terminal },
              { id: 'settings', label: 'Configurações', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => navigateToTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded text-sm font-medium transition-colors ${
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
        <div className="flex-1 overflow-hidden">
          {activeTab === 'overview' && currentConnection && (
            <div className="p-6 h-full overflow-y-auto">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Table className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                        {currentConnection.tables}
                      </p>
                      <p className="text-sm text-blue-600 dark:text-blue-300">Tabelas</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <HardDrive className="w-8 h-8 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                        {currentConnection.size}
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-300">Tamanho</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Activity className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    <div>
                      <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                        {currentConnection.performance}%
                      </p>
                      <p className="text-sm text-purple-600 dark:text-purple-300">Performance</p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Users className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                    <div>
                      <p className="text-2xl font-bold text-orange-800 dark:text-orange-200">
                        {currentConnection.connections}
                      </p>
                      <p className="text-sm text-orange-600 dark:text-orange-300">Conexões Ativas</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connection Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center space-x-2">
                    <Server className="w-5 h-5" />
                    <span>Detalhes da Conexão</span>
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Host:</span>
                      <span className="font-mono text-gray-800 dark:text-white">{currentConnection.host}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Porta:</span>
                      <span className="font-mono text-gray-800 dark:text-white">{currentConnection.port}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Database:</span>
                      <span className="font-mono text-gray-800 dark:text-white">{currentConnection.database}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Tipo:</span>
                      <span className="capitalize text-gray-800 dark:text-white">{currentConnection.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Último Backup:</span>
                      <span className="text-gray-800 dark:text-white">{currentConnection.lastBackup}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5" />
                    <span>Métricas de Performance</span>
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600 dark:text-gray-300">CPU Usage</span>
                        <span className="text-gray-800 dark:text-white">45%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600 dark:text-gray-300">Memory</span>
                        <span className="text-gray-800 dark:text-white">62%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '62%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600 dark:text-gray-300">Disk I/O</span>
                        <span className="text-gray-800 dark:text-white">28%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '28%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tables' && (
            <div className="p-6 h-full overflow-y-auto">
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar tabelas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Tables List */}
              <div className="space-y-2">
                {filteredTables.map((table, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      {getTableIcon(table.type)}
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-white">
                          {table.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {table.type === 'table' ? `${table.rows.toLocaleString()} linhas` : table.type}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-300">
                      <span>{table.size}</span>
                      <span>{table.lastModified}</span>
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-500 hover:text-blue-600 rounded transition-colors">
                          onClick={() => alert('👁️ Visualizando Tabela!\n\n📊 Dados carregados\n🔍 Filtros disponíveis\n📋 Exportação ativa')}
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-500 hover:text-green-600 rounded transition-colors">
                          onClick={() => alert('✏️ Editando Tabela!\n\n📝 Modo edição ativo\n🔧 Estrutura modificável\n💾 Auto-save habilitado')}
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-500 hover:text-red-600 rounded transition-colors">
                          onClick={() => alert('🗑️ Excluindo Tabela!\n\n⚠️ Ação irreversível\n📋 Backup recomendado\n🔒 Confirmação necessária')}
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'queries' && (
            <div className="p-6 h-full flex flex-col">
              {/* Query Builder */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Query Builder
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowQueryBuilder(!showQueryBuilder)}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      {showQueryBuilder ? 'Ocultar Builder' : 'Mostrar Builder'}
                    </button>
                    <button
                      onClick={handleExecuteQuery}
                      disabled={!customQuery.trim() || isExecutingQuery}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                    >
                      {isExecutingQuery ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Executando...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          <span>Executar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <textarea
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                  placeholder="SELECT * FROM users WHERE created_at > '2024-01-01';"
                  className="w-full h-32 p-4 font-mono text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Query Results */}
              {queryResults.length > 0 && (
                <div className="flex-1 overflow-hidden">
                  <h4 className="text-md font-semibold text-gray-800 dark:text-white mb-4">
                    Resultados ({queryResults.length} linhas)
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 dark:border-gray-600 rounded-lg">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          {Object.keys(queryResults[0] || {}).map((key) => (
                            <th key={key} className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600">
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {queryResults.map((row, index) => (
                          <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            {Object.values(row).map((value, cellIndex) => (
                              <td key={cellIndex} className="px-4 py-2 text-sm text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-600">
                                {String(value)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-6 h-full overflow-y-auto">
              <div className="max-w-2xl">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
                  Configurações do Banco de Dados
                </h3>
                
                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                      Backup Automático
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">Backup Diário</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">Retenção (dias)</span>
                        <input
                          type="number"
                          defaultValue={30}
                          className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                      Performance
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">Query Cache</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">Auto-Otimização IA</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                      Segurança
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">SSL Obrigatório</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">Auditoria de Queries</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center space-x-4">
              <span>Conexões ativas: {connections.filter(c => c.status === 'connected').length}</span>
              <span>Performance média: 89%</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>Powered by MAXIMUS.DEV IA</span>
            </div>
          </div>
        </div>
      </div>

      {/* New Connection Modal */}
      {showNewConnectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Nova Conexão
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tipo de Banco
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="supabase">Supabase</option>
                  <option value="postgresql">PostgreSQL</option>
                  <option value="mysql">MySQL</option>
                  <option value="mongodb">MongoDB</option>
                  <option value="redis">Redis</option>
                  <option value="firebase">Firebase</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome da Conexão
                </label>
                <input
                  type="text"
                  placeholder="Minha Database"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Host
                </label>
                <input
                  type="text"
                  placeholder="localhost"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Porta
                  </label>
                  <input
                    type="number"
                    placeholder="5432"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Database
                  </label>
                  <input
                    type="text"
                    placeholder="postgres"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowNewConnectionModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setShowNewConnectionModal(false);
                  console.log('Nova conexão criada');
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Conectar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatabaseModal;