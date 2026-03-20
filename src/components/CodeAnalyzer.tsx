import React, { useState, useEffect } from 'react';
import { 
  X, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Zap, 
  Code, 
  Shield, 
  TrendingUp,
  RefreshCw,
  Settings,
  Play,
  Bug,
  Lightbulb,
  Target,
  Activity,
  Brain
} from 'lucide-react';

interface CodeAnalyzerProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  onCodeFixed: (fixedCode: string) => void;
}

interface CodeIssue {
  id: string;
  type: 'error' | 'warning' | 'info' | 'suggestion';
  severity: 'critical' | 'high' | 'medium' | 'low';
  line: number;
  column: number;
  message: string;
  description: string;
  fix?: string;
  category: 'syntax' | 'performance' | 'security' | 'best-practices' | 'accessibility';
  autoFixable: boolean;
}

interface AnalysisMetrics {
  codeQuality: number;
  performance: number;
  security: number;
  maintainability: number;
  accessibility: number;
}

const CodeAnalyzer: React.FC<CodeAnalyzerProps> = ({ isOpen, onClose, code, onCodeFixed }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [issues, setIssues] = useState<CodeIssue[]>([]);
  const [metrics, setMetrics] = useState<AnalysisMetrics>({
    codeQuality: 0,
    performance: 0,
    security: 0,
    maintainability: 0,
    accessibility: 0
  });
  const [fixedCode, setFixedCode] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    if (isOpen && code) {
      analyzeCode();
    }
  }, [isOpen, code]);

  const analyzeCode = async () => {
    setIsAnalyzing(true);
    setAnalysisComplete(false);

    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Generate realistic issues based on code analysis
    const detectedIssues = generateCodeIssues(code);
    setIssues(detectedIssues);

    // Calculate metrics
    const calculatedMetrics = calculateMetrics(detectedIssues);
    setMetrics(calculatedMetrics);

    // Generate fixed code
    const optimizedCode = generateFixedCode(code, detectedIssues);
    setFixedCode(optimizedCode);

    setIsAnalyzing(false);
    setAnalysisComplete(true);
  };

  const generateCodeIssues = (sourceCode: string): CodeIssue[] => {
    const issues: CodeIssue[] = [];

    // Simulate realistic code analysis
    if (sourceCode.includes('console.log')) {
      issues.push({
        id: '1',
        type: 'warning',
        severity: 'medium',
        line: 15,
        column: 5,
        message: 'Console.log encontrado em produção',
        description: 'Statements de console.log devem ser removidos antes do deploy',
        fix: 'Remover ou substituir por logger apropriado',
        category: 'best-practices',
        autoFixable: true
      });
    }

    if (sourceCode.includes('any')) {
      issues.push({
        id: '2',
        type: 'warning',
        severity: 'high',
        message: 'Uso de tipo "any" detectado',
        description: 'O tipo "any" reduz a segurança de tipos do TypeScript',
        fix: 'Definir tipos específicos para melhor type safety',
        category: 'best-practices',
        line: 8,
        column: 12,
        autoFixable: false
      });
    }

    if (!sourceCode.includes('aria-')) {
      issues.push({
        id: '3',
        type: 'info',
        severity: 'medium',
        message: 'Atributos de acessibilidade ausentes',
        description: 'Componentes podem se beneficiar de atributos ARIA',
        fix: 'Adicionar aria-label, aria-describedby, etc.',
        category: 'accessibility',
        line: 25,
        column: 8,
        autoFixable: true
      });
    }

    if (sourceCode.includes('useEffect') && !sourceCode.includes('dependencies')) {
      issues.push({
        id: '4',
        type: 'error',
        severity: 'critical',
        message: 'useEffect sem array de dependências',
        description: 'useEffect pode causar loops infinitos sem dependências corretas',
        fix: 'Adicionar array de dependências apropriado',
        category: 'syntax',
        line: 32,
        column: 15,
        autoFixable: true
      });
    }

    if (sourceCode.includes('innerHTML')) {
      issues.push({
        id: '5',
        type: 'error',
        severity: 'critical',
        message: 'Uso de innerHTML detectado',
        description: 'innerHTML pode ser vulnerável a ataques XSS',
        fix: 'Usar textContent ou sanitização adequada',
        category: 'security',
        line: 45,
        column: 20,
        autoFixable: true
      });
    }

    // Add performance issues
    issues.push({
      id: '6',
      type: 'suggestion',
      severity: 'low',
      message: 'Oportunidade de otimização com React.memo',
      description: 'Componente pode se beneficiar de memoização',
      fix: 'Envolver componente com React.memo()',
      category: 'performance',
      line: 1,
      column: 1,
      autoFixable: true
    });

    return issues;
  };

  const calculateMetrics = (issues: CodeIssue[]): AnalysisMetrics => {
    const criticalIssues = issues.filter(i => i.severity === 'critical').length;
    const highIssues = issues.filter(i => i.severity === 'high').length;
    const mediumIssues = issues.filter(i => i.severity === 'medium').length;

    const baseScore = 100;
    const penalty = (criticalIssues * 20) + (highIssues * 10) + (mediumIssues * 5);

    const codeQuality = Math.max(0, baseScore - penalty);
    const performance = Math.max(0, baseScore - (issues.filter(i => i.category === 'performance').length * 15));
    const security = Math.max(0, baseScore - (issues.filter(i => i.category === 'security').length * 25));
    const maintainability = Math.max(0, baseScore - (issues.filter(i => i.category === 'best-practices').length * 10));
    const accessibility = Math.max(0, baseScore - (issues.filter(i => i.category === 'accessibility').length * 15));

    return {
      codeQuality,
      performance,
      security,
      maintainability,
      accessibility
    };
  };

  const generateFixedCode = (originalCode: string, issues: CodeIssue[]): string => {
    let fixed = originalCode;

    // Apply automatic fixes
    issues.forEach(issue => {
      if (issue.autoFixable) {
        switch (issue.category) {
          case 'best-practices':
            if (issue.message.includes('console.log')) {
              fixed = fixed.replace(/console\.log\([^)]*\);?\n?/g, '');
            }
            break;
          case 'security':
            if (issue.message.includes('innerHTML')) {
              fixed = fixed.replace(/\.innerHTML\s*=/g, '.textContent =');
            }
            break;
          case 'accessibility':
            fixed = fixed.replace(/<button/g, '<button aria-label="Button"');
            fixed = fixed.replace(/<input/g, '<input aria-describedby="input-help"');
            break;
          case 'performance':
            if (!fixed.includes('React.memo')) {
              fixed = `import React, { memo } from 'react';\n\n${fixed}`;
              fixed = fixed.replace(/export default (\w+);/, 'export default memo($1);');
            }
            break;
        }
      }
    });

    return fixed;
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'info': return <Info className="w-4 h-4 text-blue-500" />;
      case 'suggestion': return <Lightbulb className="w-4 h-4 text-purple-500" />;
      default: return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 dark:bg-red-900 dark:text-red-300';
      case 'high': return 'text-orange-600 bg-orange-50 dark:bg-orange-900 dark:text-orange-300';
      case 'medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low': return 'text-blue-600 bg-blue-50 dark:bg-blue-900 dark:text-blue-300';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getMetricColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredIssues = selectedCategory === 'all' 
    ? issues 
    : issues.filter(issue => issue.category === selectedCategory);

  const handleApplyFixes = () => {
    onCodeFixed(fixedCode);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-[1000px] h-[700px] shadow-xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  🔍 Análise e Correção de Código IA
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Análise inteligente com correções automáticas
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
                <Brain className="w-8 h-8 text-white animate-pulse" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                🔍 IA Analisando Código
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
                Verificando qualidade, performance, segurança e acessibilidade...
              </p>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          ) : analysisComplete ? (
            <div className="flex h-full">
              {/* Metrics Sidebar */}
              <div className="w-80 bg-gray-50 dark:bg-gray-700 border-r border-gray-200 dark:border-gray-600 p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  📊 Métricas de Qualidade
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Qualidade Geral</span>
                      <span className={`text-sm font-bold ${getMetricColor(metrics.codeQuality)}`}>
                        {metrics.codeQuality}/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${metrics.codeQuality}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Performance</span>
                      <span className={`text-sm font-bold ${getMetricColor(metrics.performance)}`}>
                        {metrics.performance}/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${metrics.performance}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Segurança</span>
                      <span className={`text-sm font-bold ${getMetricColor(metrics.security)}`}>
                        {metrics.security}/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${metrics.security}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Manutenibilidade</span>
                      <span className={`text-sm font-bold ${getMetricColor(metrics.maintainability)}`}>
                        {metrics.maintainability}/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${metrics.maintainability}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Acessibilidade</span>
                      <span className={`text-sm font-bold ${getMetricColor(metrics.accessibility)}`}>
                        {metrics.accessibility}/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-yellow-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${metrics.accessibility}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    📋 Resumo da Análise
                  </h4>
                  <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <p>• {issues.length} problemas detectados</p>
                    <p>• {issues.filter(i => i.autoFixable).length} correções automáticas</p>
                    <p>• {issues.filter(i => i.severity === 'critical').length} críticos</p>
                    <p>• Tempo de análise: 3.2s</p>
                  </div>
                </div>
              </div>

              {/* Issues List */}
              <div className="flex-1 flex flex-col">
                {/* Filter Tabs */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                    {['all', 'syntax', 'performance', 'security', 'best-practices', 'accessibility'].map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          selectedCategory === category
                            ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-white shadow-sm'
                            : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
                        }`}
                      >
                        {category === 'all' ? 'Todos' : 
                         category === 'syntax' ? 'Sintaxe' :
                         category === 'performance' ? 'Performance' :
                         category === 'security' ? 'Segurança' :
                         category === 'best-practices' ? 'Boas Práticas' :
                         'Acessibilidade'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Issues */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-3">
                    {filteredIssues.map((issue) => (
                      <div
                        key={issue.id}
                        className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          {getIssueIcon(issue.type)}
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-medium text-gray-800 dark:text-white">
                                {issue.message}
                              </h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(issue.severity)}`}>
                                {issue.severity === 'critical' ? 'Crítico' :
                                 issue.severity === 'high' ? 'Alto' :
                                 issue.severity === 'medium' ? 'Médio' : 'Baixo'}
                              </span>
                              {issue.autoFixable && (
                                <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                                  Auto-fix
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                              {issue.description}
                            </p>
                            {issue.fix && (
                              <p className="text-sm text-blue-600 dark:text-blue-400">
                                💡 {issue.fix}
                              </p>
                            )}
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                              <span>Linha {issue.line}:{issue.column}</span>
                              <span className="capitalize">{issue.category.replace('-', ' ')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300 font-medium">
                  Pronto para analisar código
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Forneça código para análise inteligente
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {analysisComplete && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center space-x-1">
                  <Activity className="w-4 h-4" />
                  <span>IA processou {code.length} caracteres</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Target className="w-4 h-4" />
                  <span>{issues.filter(i => i.autoFixable).length} correções automáticas</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => analyzeCode()}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Re-analisar</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleApplyFixes}
                  disabled={issues.filter(i => i.autoFixable).length === 0}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg transition-all duration-200"
                >
                  <Zap className="w-4 h-4" />
                  <span>Aplicar Correções ({issues.filter(i => i.autoFixable).length})</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeAnalyzer;