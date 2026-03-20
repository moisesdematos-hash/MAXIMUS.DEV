import React, { useMemo, useState, useEffect } from 'react';
import { 
  X, 
  Activity, 
  Cpu, 
  Shield, 
  Zap,
  Clock
} from 'lucide-react';
import { useObservability } from '../hooks/useObservability';
import { useMultiAgent } from '../hooks/useMultiAgent';
import { useUI } from '../contexts/UIContext';
import { PredictiveAgent, PredictiveInsights } from '../lib/predictiveAgent';
import { TrendingUp, AlertCircle } from 'lucide-react';

interface MonitoringDashboardProps {
  onClose: () => void;
}

const MonitoringDashboard = ({ onClose }: MonitoringDashboardProps) => {
  const { metrics, currentMetrics } = useObservability();
  const { status } = useMultiAgent();
  const { language } = useUI();
  const [forecast, setForecast] = React.useState<PredictiveInsights | null>(null);

  React.useEffect(() => {
    const getForecast = async () => {
      const agent = PredictiveAgent.getInstance();
      const insights = await agent.forecast(currentMetrics);
      setForecast(insights);
    };
    getForecast();
  }, [currentMetrics]);

  const chartData = useMemo(() => {
    if (metrics.length === 0) return [];
    const maxLatency = Math.max(...metrics.map((m: { latency: number }) => m.latency), 10);
    return metrics.map((m: { latency: number; timestamp: number }) => ({
      height: (m.latency / maxLatency) * 100,
      timestamp: m.timestamp
    }));
  }, [metrics]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 w-full max-w-4xl rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {language === 'pt' ? 'Observabilidade & Saúde' : 'Observability & Health'}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {language === 'pt' ? 'Monitoramento em tempo real (AI Multi-Agent)' : 'Real-time Monitoring (AI Multi-Agent)'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/10 dark:to-gray-800 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Latência</span>
                <Clock className="w-4 h-4 text-blue-500" />
              </div>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{currentMetrics?.latency.toFixed(1) || '--'}</span>
                <span className="text-sm text-gray-500">ms</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/10 dark:to-gray-800 p-4 rounded-xl border border-purple-100 dark:border-purple-900/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Memória</span>
                <Cpu className="w-4 h-4 text-purple-500" />
              </div>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{currentMetrics?.memoryUsage.toFixed(1) || '--'}</span>
                <span className="text-sm text-gray-500">MB</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-900/10 dark:to-gray-800 p-4 rounded-xl border border-yellow-100 dark:border-yellow-900/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-yellow-600 dark:text-yellow-400 uppercase tracking-wider">Créditos</span>
                <Zap className="w-4 h-4 text-yellow-500" />
              </div>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{status.credits.balance}</span>
                <span className="text-sm text-gray-500">disp</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white dark:from-green-900/10 dark:to-gray-800 p-4 rounded-xl border border-green-100 dark:border-green-900/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider">Economia</span>
                <Shield className="w-4 h-4 text-green-500" />
              </div>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">+{status.credits.savings}</span>
                <span className="text-sm text-gray-500">créditos</span>
              </div>
            </div>
          </div>

          {/* Activity Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
              <h3 className="text-sm font-semibold mb-6 flex items-center text-gray-700 dark:text-gray-300">
                Histórico de Latência
              </h3>
              <div className="h-40 flex items-end justify-between space-x-1">
                {chartData.length > 0 ? chartData.map((d, i) => (
                  <div 
                    key={i} 
                    className="w-full bg-blue-500/20 dark:bg-blue-500/10 rounded-t-sm relative group"
                    style={{ height: `${Math.max(d.height, 5)}%` }}
                  >
                    <div className="absolute bottom-0 inset-x-0 h-1 bg-blue-500 rounded-t-sm"></div>
                  </div>
                )) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs italic">
                    Coletando dados...
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
              <h3 className="text-sm font-semibold mb-4 flex items-center text-gray-700 dark:text-gray-300">
                Saúde dos Agentes
              </h3>
              <div className="space-y-4">
                {Object.entries(status.agents).map(([agent, state]: [string, any]) => (
                  <div key={agent} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        state === 'Active' ? 'bg-green-500 animate-pulse' : 
                        state === 'Monitoring' ? 'bg-blue-500' : 'bg-yellow-500'
                      }`}></div>
                      <span className="text-sm capitalize text-gray-600 dark:text-gray-400">{agent} Agent</span>
                    </div>
                    <span className="text-xs font-mono text-gray-400">{state as string}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Credit Protection Banner */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Zap className="w-5 h-5 text-green-600 dark:text-green-500" />
              <div>
                <h4 className="text-sm font-bold text-green-800 dark:text-green-400">Proteção de Créditos Ativa</h4>
                <p className="text-xs text-green-700/80 dark:text-green-500/60 font-medium">
                  Você economizou {status.credits.savings} créditos hoje através de ciclos de auto-correção autônomos.
                </p>
              </div>
            </div>
            {status.credits.isProtected && (
              <div className="px-3 py-1 bg-green-500 text-white text-[10px] font-bold rounded-full uppercase tracking-tighter">
                Safe-Correction ON
              </div>
            )}
          </div>

          {/* Predictive Insights */}
          {forecast && (
            <div className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/10 dark:to-gray-800 p-6 rounded-xl border border-blue-100 dark:border-blue-900/30">
              <div className="flex items-center space-x-3 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Previsão de Saúde (IA)</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 font-medium">Alertas Preventivos:</p>
                  {forecast.potentialErrors.map((err, i) => (
                    <div key={i} className="flex items-center space-x-2 text-[10px] text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
                      <AlertCircle className="w-3 h-3" />
                      <span>{err}</span>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl">
                  <p className="text-xs text-gray-500 font-medium mb-1">Ação Recomendada:</p>
                  <p className="text-[10px] text-gray-700 dark:text-gray-300 italic">"{forecast.recommendedAction}"</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-end space-x-3 bg-gray-50/50 dark:bg-gray-800/50">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
            Limpar Histórico
          </button>
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow-lg shadow-blue-500/20 transition-all">
            Fechar Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default MonitoringDashboard;
