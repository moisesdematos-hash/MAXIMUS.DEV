import React, { useState, useEffect } from 'react';
import { Rocket, Target, DollarSign, Users, Megaphone, Globe, CheckCircle2, TrendingUp, X, Sparkles } from 'lucide-react';
import { useUI } from '../contexts/UIContext';
import { VentureAgent, VentureStrategy } from '../lib/ventureAgent';

const VentureDashboard: React.FC = () => {
  const { language, showVentureDashboard, setShowVentureDashboard } = useUI();
  // Language used for translation context (future expansion)
  console.log(`[Venture] Language context: ${language}`);
  const [strategy, setStrategy] = useState<VentureStrategy | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    const loadStrategy = async () => {
      const agent = VentureAgent.getInstance();
      const res = await agent.analyzeVenture('// Maximus.DEV Codebase Source');
      setStrategy(res);
      setIsAnalyzing(false);
    };
    if (showVentureDashboard) loadStrategy();
  }, [showVentureDashboard]);

  if (!showVentureDashboard) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={() => setShowVentureDashboard(false)}
      />
      
      {/* Content */}
      <div className="relative w-full max-w-5xl bg-white dark:bg-gray-950 rounded-3xl shadow-2xl overflow-hidden border border-blue-500/30 animate-in zoom-in-95 duration-500">
        <div className="flex h-[700px]">
          {/* Sidebar */}
          <div className="w-80 bg-blue-600 p-8 text-white flex flex-col">
            <div className="flex items-center space-x-3 mb-12">
              <div className="p-2 bg-white/20 rounded-xl">
                <Rocket className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">Launchpad</h2>
            </div>

            <nav className="flex-1 space-y-6">
              {[
                { icon: Target, label: 'Market Analysis', active: true },
                { icon: DollarSign, label: 'Revenue Model', active: false },
                { icon: Megaphone, label: 'Marketing Strategy', active: false },
                { icon: Globe, label: 'Neural SEO', active: false }
              ].map((item, i) => (
                <div key={i} className={`flex items-center space-x-4 p-3 rounded-2xl cursor-pointer transition-all ${item.active ? 'bg-white/10 shadow-lg' : 'hover:bg-white/5 opacity-60'}`}>
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
              ))}
            </nav>

            <div className="mt-auto bg-white/10 p-4 rounded-2xl border border-white/10">
              <p className="text-[10px] uppercase font-bold tracking-widest text-blue-200 mb-2">Readiness Score</p>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-bold">94%</span>
                <TrendingUp className="w-6 h-6 text-green-400 mb-1" />
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                <div className="w-[94%] h-full bg-green-400" />
              </div>
            </div>
          </div>

          {/* Main Panel */}
          <div className="flex-1 p-10 flex flex-col">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {isAnalyzing ? 'Analyzing Venture...' : 'Autonomous Strategy'}
                </h1>
                <p className="text-gray-500 dark:text-gray-400">Intelligence-driven market conquest plan</p>
              </div>
              <button 
                onClick={() => setShowVentureDashboard(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {isAnalyzing ? (
              <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-500 animate-pulse font-mono text-sm tracking-widest">DEEP VENTURE SCAN IN PROGRESS...</p>
              </div>
            ) : (
              <div className="flex-1 grid grid-cols-2 gap-8 overflow-y-auto pr-2">
                {/* Pitch Card */}
                <div className="col-span-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 p-8 rounded-3xl border border-blue-500/20">
                  <div className="flex items-center space-x-2 mb-4">
                    <Sparkles className="w-5 h-5 text-blue-500" />
                    <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">AI Generated Pitch</span>
                  </div>
                  <p className="text-xl font-medium leading-relaxed italic text-gray-800 dark:text-gray-100">
                    "{strategy?.pitch}"
                  </p>
                </div>

                {/* Market Segment */}
                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800">
                  <h3 className="flex items-center space-x-2 font-bold mb-4">
                    <Users className="w-4 h-4 text-indigo-500" />
                    <span>Target Segment</span>
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-bold text-indigo-600 mb-1">Primary Market</p>
                      <p className="text-lg font-bold">{strategy?.targetMarket}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Competitors</p>
                      <div className="flex flex-wrap gap-2">
                        {strategy?.competitors.map((c, i) => (
                          <span key={i} className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-xs font-medium">{c}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Revenue & Marketing */}
                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800">
                  <h3 className="flex items-center space-x-2 font-bold mb-4">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span>Business Model</span>
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-bold text-green-600 mb-1">Revenue Stream</p>
                      <p className="text-lg font-bold">{strategy?.revenueModel}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Marketing Checklist</p>
                      <div className="space-y-2">
                        {strategy?.marketingPlan.map((p, i) => (
                          <div key={i} className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                            <span>{p}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <div className="flex items-center space-x-3 text-xs text-gray-400 font-mono">
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-ping" />
                <span>VENTURE PROTOCOL: ACTIVE</span>
              </div>
              <button 
                className="px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all"
                onClick={() => alert('🚀 Neural Launch Initiated! System distributing assets to global nodes...')}
              >
                Launch Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VentureDashboard;
