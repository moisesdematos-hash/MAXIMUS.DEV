import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Trash2, 
  Search, 
  Download, 
  AlertCircle, 
  CheckCircle,
  Clock,
  X,
  ExternalLink,
  Star,
  Users,
  Calendar
} from 'lucide-react';

interface Dependency {
  name: string;
  version: string;
  description: string;
  type: 'dependency' | 'devDependency';
  status: 'installed' | 'installing' | 'error';
  size?: string;
  downloads?: string;
  stars?: number;
  lastUpdate?: string;
}

interface DependencyManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const DependencyManager: React.FC<DependencyManagerProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState<'installed' | 'search'>('installed');
  const [isInstalling, setIsInstalling] = useState(false);
  const [newPackage, setNewPackage] = useState('');
  const [packageType, setPackageType] = useState<'dependency' | 'devDependency'>('dependency');

  const [dependencies, setDependencies] = useState<Dependency[]>([
    {
      name: 'react',
      version: '^18.3.1',
      description: 'A JavaScript library for building user interfaces',
      type: 'dependency',
      status: 'installed',
      size: '42.2 kB',
      downloads: '20M/week',
      stars: 220000,
      lastUpdate: '2 months ago'
    },
    {
      name: 'react-dom',
      version: '^18.3.1',
      description: 'React package for working with the DOM',
      type: 'dependency',
      status: 'installed',
      size: '130 kB',
      downloads: '20M/week',
      stars: 220000,
      lastUpdate: '2 months ago'
    },
    {
      name: 'lucide-react',
      version: '^0.344.0',
      description: 'Beautiful & consistent icon toolkit made by the community',
      type: 'dependency',
      status: 'installed',
      size: '1.2 MB',
      downloads: '500k/week',
      stars: 8500,
      lastUpdate: '1 week ago'
    },
    {
      name: 'tailwindcss',
      version: '^3.4.1',
      description: 'A utility-first CSS framework',
      type: 'devDependency',
      status: 'installed',
      size: '3.5 MB',
      downloads: '5M/week',
      stars: 78000,
      lastUpdate: '3 weeks ago'
    },
    {
      name: 'vite',
      version: '^5.4.2',
      description: 'Next generation frontend tooling',
      type: 'devDependency',
      status: 'installed',
      size: '15 MB',
      downloads: '8M/week',
      stars: 65000,
      lastUpdate: '1 week ago'
    }
  ]);

  const [searchResults] = useState<Dependency[]>([
    {
      name: 'axios',
      version: '^1.6.0',
      description: 'Promise based HTTP client for the browser and node.js',
      type: 'dependency',
      status: 'installed',
      size: '15 kB',
      downloads: '45M/week',
      stars: 104000,
      lastUpdate: '2 months ago'
    },
    {
      name: 'lodash',
      version: '^4.17.21',
      description: 'A modern JavaScript utility library',
      type: 'dependency',
      status: 'installed',
      size: '71 kB',
      downloads: '55M/week',
      stars: 59000,
      lastUpdate: '2 years ago'
    },
    {
      name: 'framer-motion',
      version: '^10.16.0',
      description: 'A production-ready motion library for React',
      type: 'dependency',
      status: 'installed',
      size: '250 kB',
      downloads: '2M/week',
      stars: 22000,
      lastUpdate: '1 month ago'
    },
    {
      name: 'zustand',
      version: '^4.4.0',
      description: 'A small, fast and scalable bearbones state-management solution',
      type: 'dependency',
      status: 'installed',
      size: '8.5 kB',
      downloads: '2.5M/week',
      stars: 42000,
      lastUpdate: '2 weeks ago'
    }
  ]);

  const handleInstallPackage = async (packageName: string, version: string, type: 'dependency' | 'devDependency') => {
    setIsInstalling(true);
    
    // Simulate installation
    const newDep: Dependency = {
      name: packageName,
      version: version,
      description: `Package ${packageName}`,
      type: type,
      status: 'installing'
    };

    setDependencies(prev => [...prev, newDep]);

    // Simulate installation time
    setTimeout(() => {
      setDependencies(prev => 
        prev.map(dep => 
          dep.name === packageName 
            ? { ...dep, status: 'installed' as const }
            : dep
        )
      );
      setIsInstalling(false);
    }, 2000);
  };

  const handleRemovePackage = (packageName: string) => {
    setDependencies(prev => prev.filter(dep => dep.name !== packageName));
  };

  const handleAddCustomPackage = () => {
    if (!newPackage.trim()) return;
    
    handleInstallPackage(newPackage, 'latest', packageType);
    setNewPackage('');
  };

  const filteredDependencies = dependencies.filter(dep =>
    dep.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dep.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSearchResults = searchResults.filter(dep =>
    dep.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dep.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-[900px] h-[700px] shadow-xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Package className="w-6 h-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Gerenciador de Dependências
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Gerencie pacotes npm do seu projeto
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Fechar gerenciador"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center space-x-2"
              title="Sair do gerenciador"
            >
              <X className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center space-x-1 mt-4 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
            <button
              onClick={() => setSelectedTab('installed')}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                selectedTab === 'installed'
                  ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
              }`}
            >
              Instalados ({dependencies.length})
            </button>
            <button
              onClick={() => setSelectedTab('search')}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                selectedTab === 'search'
                  ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
              }`}
            >
              Buscar Pacotes
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={selectedTab === 'installed' ? 'Buscar dependências instaladas...' : 'Buscar pacotes npm...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Add Custom Package */}
          {selectedTab === 'search' && (
            <div className="flex items-center space-x-2 mt-3">
              <input
                type="text"
                placeholder="Nome do pacote (ex: axios)"
                value={newPackage}
                onChange={(e) => setNewPackage(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyDown={(e) => e.key === 'Enter' && handleAddCustomPackage()}
              />
              <select
                value={packageType}
                onChange={(e) => setPackageType(e.target.value as 'dependency' | 'devDependency')}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="dependency">Dependency</option>
                <option value="devDependency">Dev Dependency</option>
              </select>
              <button
                onClick={handleAddCustomPackage}
                disabled={!newPackage.trim() || isInstalling}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Instalar</span>
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {selectedTab === 'installed' ? (
              filteredDependencies.length > 0 ? (
                filteredDependencies.map((dep) => (
                  <div
                    key={dep.name}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium text-gray-800 dark:text-white">
                          {dep.name}
                        </h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {dep.version}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          dep.type === 'dependency'
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                            : 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                        }`}>
                          {dep.type === 'dependency' ? 'Prod' : 'Dev'}
                        </span>
                        <div className="flex items-center space-x-1">
                          {dep.status === 'installed' && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                          {dep.status === 'installing' && (
                            <Clock className="w-4 h-4 text-yellow-500 animate-spin" />
                          )}
                          {dep.status === 'error' && (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {dep.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                        {dep.size && (
                          <span className="flex items-center space-x-1">
                            <Download className="w-3 h-3" />
                            <span>{dep.size}</span>
                          </span>
                        )}
                        {dep.downloads && (
                          <span className="flex items-center space-x-1">
                            <Users className="w-3 h-3" />
                            <span>{dep.downloads}</span>
                          </span>
                        )}
                        {dep.stars && (
                          <span className="flex items-center space-x-1">
                            <Star className="w-3 h-3" />
                            <span>{dep.stars.toLocaleString()}</span>
                          </span>
                        )}
                        {dep.lastUpdate && (
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{dep.lastUpdate}</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => window.open(`https://npmjs.com/package/${dep.name}`, '_blank')}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                        title="Ver no npm"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRemovePackage(dep.name)}
                        disabled={dep.status === 'installing'}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors disabled:opacity-50"
                        title="Remover pacote"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300 font-medium">
                    Nenhuma dependência encontrada
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Tente ajustar os termos de busca
                  </p>
                </div>
              )
            ) : (
              filteredSearchResults.length > 0 ? (
                filteredSearchResults.map((pkg) => (
                  <div
                    key={pkg.name}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium text-gray-800 dark:text-white">
                          {pkg.name}
                        </h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {pkg.version}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {pkg.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                        {pkg.size && (
                          <span className="flex items-center space-x-1">
                            <Download className="w-3 h-3" />
                            <span>{pkg.size}</span>
                          </span>
                        )}
                        {pkg.downloads && (
                          <span className="flex items-center space-x-1">
                            <Users className="w-3 h-3" />
                            <span>{pkg.downloads}</span>
                          </span>
                        )}
                        {pkg.stars && (
                          <span className="flex items-center space-x-1">
                            <Star className="w-3 h-3" />
                            <span>{pkg.stars.toLocaleString()}</span>
                          </span>
                        )}
                        {pkg.lastUpdate && (
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{pkg.lastUpdate}</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => window.open(`https://npmjs.com/package/${pkg.name}`, '_blank')}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                        title="Ver no npm"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleInstallPackage(pkg.name, pkg.version, 'dependency')}
                        disabled={isInstalling || dependencies.some(d => d.name === pkg.name)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded text-sm transition-colors"
                      >
                        {dependencies.some(d => d.name === pkg.name) ? 'Instalado' : 'Instalar'}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300 font-medium">
                    Nenhum pacote encontrado
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Tente buscar por outros termos ou adicione um pacote personalizado
                  </p>
                </div>
              )
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center space-x-4">
              <span>
                {dependencies.filter(d => d.type === 'dependency').length} dependências
              </span>
              <span>
                {dependencies.filter(d => d.type === 'devDependency').length} dev dependências
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs">Powered by npm registry</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DependencyManager;