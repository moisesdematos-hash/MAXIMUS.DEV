import React, { useState, useRef, useEffect } from 'react';
import { 
  Code, 
  Play, 
  Download, 
  Share, 
  Settings, 
  Maximize, 
  Minimize,
  Monitor,
  Smartphone,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  Zap,
  Bug,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  MoreVertical,
  Save,
  Upload,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Folder,
  File,
  Edit,
  Trash2,
  Plus,
  X,
  ChevronDown,
  ChevronRight,
  Terminal,
  Palette,
  Layers,
  Grid3X3,
  List,
  Target,
  Activity,
  BarChart3,
  TrendingUp,
  Clock,
  User,
  Star,
  Heart,
  Bookmark,
  Tag,
  Link,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Globe,
  Shield,
  Lock,
  Unlock,
  Key,
  Database,
  Server,
  Cloud,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
  Wifi,
  Bluetooth,
  Battery,
  Signal,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Bell,
  BellOff
} from 'lucide-react';
import CodeAnalyzer from './CodeAnalyzer';

interface CodeEditorProps {
  code: string;
  onCodeChange: (code: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, onCodeChange }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [viewportMode, setViewportMode] = useState<'desktop' | 'mobile'>('desktop');
  const [showCodeAnalyzer, setShowCodeAnalyzer] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'code' | 'preview' | 'console'>('preview');
  const [consoleOutput, setConsoleOutput] = useState<string[]>([
    '🚀 MAXIMUS.DEV Console iniciado',
    '✅ Ambiente de desenvolvimento ativo',
    '📦 Dependências carregadas',
    '⚡ Hot reload habilitado'
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [showFileTree, setShowFileTree] = useState(false);
  const [selectedFile, setSelectedFile] = useState('App.tsx');
  const [editorSettings, setEditorSettings] = useState({
    fontSize: 14,
    tabSize: 2,
    wordWrap: true,
    lineNumbers: true,
    minimap: true,
    theme: 'vs-dark'
  });
  const [scrollTop, setScrollTop] = useState(0);
  const [cursorLine, setCursorLine] = useState(1);
  const [cursorColumn, setCursorColumn] = useState(1);

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLIFrameElement>(null);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    onCodeChange(newCode);

    // Sync scroll position with line numbers
    if (editorRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = editorRef.current.scrollTop;
    }
  };

  const handleEditorScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    setScrollTop(target.scrollTop);
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = target.scrollTop;
    }
  };

  const handleCursorMove = (e: React.KeyboardEvent<HTMLTextAreaElement> | React.MouseEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    const text = target.value;
    const cursorPos = target.selectionStart;

    const beforeCursor = text.substring(0, cursorPos);
    const line = beforeCursor.split('\n').length;
    const column = beforeCursor.split('\n')[beforeCursor.split('\n').length - 1].length + 1;

    setCursorLine(line);
    setCursorColumn(column);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setConsoleOutput(prev => [...prev, '🔄 Executando código...']);
    
    // Simulate code execution
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setConsoleOutput(prev => [
      ...prev, 
      '✅ Código executado com sucesso',
      '📊 Performance: 98/100',
      '🎯 Sem erros detectados'
    ]);
    setIsRunning(false);
  };

  const handleAnalyzeCode = async () => {
    setIsAnalyzing(true);
    setConsoleOutput(prev => [...prev, '🔍 Analisando código com IA...']);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const results = {
      quality: 92,
      performance: 88,
      security: 95,
      suggestions: [
        'Adicionar PropTypes para melhor type checking',
        'Implementar lazy loading para componentes',
        'Otimizar re-renders com React.memo'
      ]
    };
    
    setAnalysisResults(results);
    setConsoleOutput(prev => [
      ...prev,
      '🤖 Análise IA concluída',
      `📊 Qualidade: ${results.quality}/100`,
      `⚡ Performance: ${results.performance}/100`,
      `🔒 Segurança: ${results.security}/100`
    ]);
    setIsAnalyzing(false);
  };

  const toggleViewport = () => {
    setViewportMode(prev => prev === 'desktop' ? 'mobile' : 'desktop');
    setConsoleOutput(prev => [
      ...prev, 
      `📱 Viewport alterado para ${viewportMode === 'desktop' ? 'mobile' : 'desktop'}`
    ]);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedFile}`;
    a.click();
    URL.revokeObjectURL(url);
    
    setConsoleOutput(prev => [...prev, `📥 Arquivo ${selectedFile} baixado`]);
  };

  const handleShare = () => {
    const shareUrl = `https://maximusdev-${Math.random().toString(36).substring(2, 8)}.maximus.dev`;
    navigator.clipboard.writeText(shareUrl);
    setConsoleOutput(prev => [
      ...prev, 
      '🔗 Link de compartilhamento copiado',
      `🌐 URL: ${shareUrl}`
    ]);
    alert(`🔗 Link Copiado!\n\n🌐 ${shareUrl}\n📋 Colado na área de transferência`);
  };

  const files = [
    { name: 'App.tsx', type: 'file', icon: <Code className="w-4 h-4 text-blue-500" /> },
    { name: 'components/', type: 'folder', icon: <Folder className="w-4 h-4 text-yellow-500" /> },
    { name: 'styles/', type: 'folder', icon: <Folder className="w-4 h-4 text-yellow-500" /> },
    { name: 'utils/', type: 'folder', icon: <Folder className="w-4 h-4 text-yellow-500" /> },
    { name: 'package.json', type: 'file', icon: <FileText className="w-4 h-4 text-green-500" /> }
  ];

  return (
    <div className={`h-full flex flex-col bg-gray-50 dark:bg-gray-900 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
        </div>

        <div className="flex items-center space-x-2">
          {/* Viewport Toggle */}
          <button
            onClick={toggleViewport}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
              viewportMode === 'mobile' 
                ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' 
                : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
            }`}
            title={`Alternar para ${viewportMode === 'desktop' ? 'Mobile' : 'Desktop'}`}
          >
            {viewportMode === 'desktop' ? (
              <>
                <Monitor className="w-4 h-4" />
                <span className="text-sm font-medium">🖥️ Desktop</span>
              </>
            ) : (
              <>
                <Smartphone className="w-4 h-4" />
                <span className="text-sm font-medium">📱 Mobile</span>
              </>
            )}
          </button>

          {/* Action Buttons */}
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
            title="Executar código"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-sm">Executando...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span className="text-sm">Executar</span>
              </>
            )}
          </button>

          <button
            onClick={handleAnalyzeCode}
            disabled={isAnalyzing}
            className="flex items-center space-x-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
            title="Analisar com IA"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-sm">Analisando...</span>
              </>
            ) : (
              <>
                <Bug className="w-4 h-4" />
                <span className="text-sm">🤖 Analisar</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Baixar código"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={handleShare}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Compartilhar projeto"
          >
            <Share className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title={isFullscreen ? 'Sair do modo tela cheia' : 'Modo tela cheia'}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* File Tree Dropdown */}
      {showFileTree && (
        <div className="absolute top-16 left-4 z-10 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-800 dark:text-white">Arquivos do Projeto</h3>
          </div>
          <div className="p-2 max-h-64 overflow-y-auto">
            {files.map((file, index) => (
              <button
                key={index}
                onClick={() => {
                  if (file.type === 'file') {
                    setSelectedFile(file.name);
                    setShowFileTree(false);
                  }
                }}
                className={`w-full flex items-center space-x-2 px-2 py-1.5 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors ${
                  selectedFile === file.name ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {file.icon}
                <span className="text-sm">{file.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        {[
          { id: 'code', label: 'Código', icon: Code },
          { id: 'preview', label: 'Preview', icon: Eye },
          { id: 'console', label: 'Console', icon: Terminal }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900 border-b-2 border-blue-600'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'code' ? (
          <div className="h-full flex">
            {/* File Tree Sidebar */}
            <div className="w-64 bg-gray-50 dark:bg-gray-700 border-r border-gray-200 dark:border-gray-600 flex flex-col">
              <div className="p-3 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-800 dark:text-white">Arquivos</h3>
                  <button
                    onClick={() => alert('📁 Novo Arquivo!\n\n✨ Criação rápida\n📝 Templates disponíveis\n🚀 Auto-save ativo')}
                    className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                    title="Novo arquivo"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-2">
                <div className="space-y-1">
                  {files.map((file, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (file.type === 'file') {
                          setSelectedFile(file.name);
                          alert(`📄 Arquivo Selecionado!\n\n📁 ${file.name}\n✅ Carregado no editor\n🔄 Pronto para edição`);
                        } else {
                          alert(`📂 Pasta ${file.name}!\n\n📁 Expandindo pasta\n📄 Arquivos internos\n🔍 Navegação ativa`);
                        }
                      }}
                      className={`w-full flex items-center space-x-2 px-2 py-1.5 text-left hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors ${
                        selectedFile === file.name ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {file.icon}
                      <span className="text-sm truncate">{file.name}</span>
                      {file.type === 'folder' && (
                        <ChevronRight className="w-3 h-3 text-gray-400 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* File Actions */}
              <div className="p-2 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{files.filter(f => f.type === 'file').length} arquivos</span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => alert('📤 Upload de Arquivos!\n\n📁 Seletor aberto\n⚡ Upload automático\n✅ Sincronização ativa')}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                      title="Upload arquivos"
                    >
                      <Upload className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => alert('📥 Download do Projeto!\n\n📦 Compactando arquivos\n⬇️ Download automático\n✅ Projeto exportado')}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                      title="Download projeto"
                    >
                      <Download className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Code Editor Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Status Bar */}
              <div className="bg-gray-900 border-b border-blue-600 px-4 py-2 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center space-x-6 text-gray-400">
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-400 font-semibold">Ln</span>
                    <span className="text-emerald-400 font-bold">{cursorLine}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-400 font-semibold">Col</span>
                    <span className="text-emerald-400 font-bold">{cursorColumn}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-400 font-semibold">Total</span>
                    <span className="text-cyan-400 font-bold">{code.split('\n').length}</span>
                  </div>
                </div>
                <div className="text-gray-500">
                  UTF-8 • CRLF
                </div>
              </div>

              <div className="code-editor-wrapper">
                {/* Line Numbers */}
                <div ref={lineNumbersRef} className="line-numbers">
                  {code.split('\n').map((_, index) => (
                    <div key={index} className="line-number">
                      {index + 1}
                    </div>
                  ))}
                </div>

                {/* Code Input Container */}
                <div className="code-input-container">
                  <div className="code-grid-background" />
                  <div className="scan-line-overlay">
                    <div className="scan-line-element" />
                  </div>
                  <textarea
                    ref={editorRef}
                    value={code}
                    onChange={handleCodeChange}
                    onScroll={handleEditorScroll}
                    onClick={handleCursorMove}
                    onKeyDown={handleCursorMove}
                    onKeyUp={handleCursorMove}
                    placeholder="// Seu código aparecerá aqui
import React from 'react';

function App() {
  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
      <h1 className='text-4xl font-bold text-gray-800'>
        Olá, MAXIMUS.DEV! 🚀
      </h1>
    </div>
  );
}

export default App;"
                    className="code-editor-input"
                    style={{
                      fontSize: `${editorSettings.fontSize}px`,
                      tabSize: editorSettings.tabSize,
                      whiteSpace: editorSettings.wordWrap ? 'pre-wrap' : 'pre'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'preview' ? (
          <div className="h-full flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-900">
            <div 
              className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${
                viewportMode === 'mobile' 
                  ? 'w-[375px] h-[667px]' 
                  : 'w-full h-full max-w-none'
              }`}
            >
              <div className="h-full">
                {code ? (
                  <iframe
                    ref={previewRef}
                    srcDoc={`
                      <!DOCTYPE html>
                      <html lang="pt-BR">
                      <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Preview - MAXIMUS.DEV</title>
                        <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
                        <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
                        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
                        <script src="https://cdn.tailwindcss.com"></script>
                        <style>
                          body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }
                          * { box-sizing: border-box; }
                        </style>
                      </head>
                      <body>
                        <div id="root"></div>
                        <script type="text/babel">
                          ${code}
                          
                          const root = ReactDOM.createRoot(document.getElementById('root'));
                          root.render(React.createElement(App));
                        </script>
                      </body>
                      </html>
                    `}
                    className="w-full h-full border-none"
                    title="Preview do projeto"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                    <div className="text-center">
                      <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-300 font-medium">
                        Preview do Projeto
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        O código gerado aparecerá aqui
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full bg-gray-900 text-green-400 p-4 font-mono text-sm overflow-y-auto">
            <div className="space-y-1">
              {consoleOutput.map((line, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="text-gray-500 text-xs mt-0.5">
                    {new Date().toLocaleTimeString()}
                  </span>
                  <span>{line}</span>
                </div>
              ))}
            </div>
            
            {/* Console Input */}
            <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-700">
              <span className="text-blue-400">$</span>
              <input
                type="text"
                placeholder="Digite um comando..."
                className="flex-1 bg-transparent text-green-400 focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const command = e.currentTarget.value;
                    if (command.trim()) {
                      setConsoleOutput(prev => [
                        ...prev,
                        `$ ${command}`,
                        `✅ Comando executado: ${command}`
                      ]);
                      e.currentTarget.value = '';
                    }
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Analysis Results */}
      {analysisResults && (
        <div className="p-4 bg-purple-50 dark:bg-purple-900 border-t border-purple-200 dark:border-purple-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
                  Análise IA Concluída
                </span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-purple-700 dark:text-purple-300">
                <span>Qualidade: {analysisResults.quality}%</span>
                <span>Performance: {analysisResults.performance}%</span>
                <span>Segurança: {analysisResults.security}%</span>
              </div>
            </div>
            <button
              onClick={() => setShowCodeAnalyzer(true)}
              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-colors"
            >
              Ver Detalhes
            </button>
          </div>
        </div>
      )}

      {/* Code Analyzer Modal */}
      <CodeAnalyzer 
        isOpen={showCodeAnalyzer}
        onClose={() => setShowCodeAnalyzer(false)}
        code={code}
        onCodeFixed={(fixedCode) => {
          onCodeChange(fixedCode);
          setConsoleOutput(prev => [...prev, '🔧 Código corrigido automaticamente pela IA']);
        }}
      />
    </div>
  );
};

export default CodeEditor;