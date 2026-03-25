import React, { useState, useEffect } from 'react';
import { 
  Zap, Brain, Layout, Code, Shield, Activity, 
  ChevronDown, Paperclip, Github, MessageSquare, 
  Mic, ArrowUp, Sparkles, Star, Globe, 
  Lock, CheckCircle, Database, Terminal, Cpu
} from 'lucide-react';
import { useUI } from '../contexts/UIContext';
import { useAuth } from '../contexts/AuthContext';
import skyBackground from '../assets/sovereign_sky.png';

interface WelcomePageProps {
  onGetStarted: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onGetStarted }) => {
  const { language } = useUI();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Architect');
  const [prompt, setPrompt] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tabs = [
    { id: 'Architect', label: language === 'pt' ? 'Arquiteto de Agente' : 'Agent Architect', icon: <Brain className="w-4 h-4" /> },
    { id: 'Designer', label: language === 'pt' ? 'Designer Visual' : 'Visual Designer', icon: <Layout className="w-4 h-4" /> },
    { id: 'Logic', label: language === 'pt' ? 'Lógica Neural' : 'Neural Logic', icon: <Code className="w-4 h-4" /> }
  ];

  const badges = [
    { label: "OpenClaw v2.0", isNew: true },
    { label: "Project Blueprint", isNew: false },
    { label: "Neural Schema", isNew: false },
    { label: "Sovereign SSO", isNew: false }
  ];

  return (
    <div className="min-h-screen relative font-sans text-gray-900 overflow-x-hidden">
      {/* Dynamic Sky Background */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center transition-transform duration-1000 scale-105"
        style={{ backgroundImage: `url(${skyBackground})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-400/20 via-transparent to-white/60 dark:to-gray-900/80" />
      </div>

      {/* Professional Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm' : 'py-6 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center space-x-10">
            <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter dark:text-white">MAXIMUS.DEV</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8 text-sm font-bold text-gray-600 dark:text-gray-300">
              <button className="hover:text-blue-600 transition-colors uppercase tracking-wider">Explorer</button>
              <button className="hover:text-blue-600 transition-colors uppercase tracking-wider">Documentation</button>
              <button className="hover:text-blue-600 transition-colors uppercase tracking-wider">Sovereign OS</button>
            </nav>
          </div>

          <div className="flex items-center space-x-6">
            <div className="hidden lg:flex items-center space-x-2 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full border border-green-100 dark:border-green-800/30">
              <div className="w-2 h-2 bg-green-500 rounded-full sovereign-pulse" />
              <span className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-widest">Neural Link: Active</span>
            </div>
            <button 
              onClick={onGetStarted}
              className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-2.5 rounded-xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-2xl border border-white/10 dark:border-black/10 flex items-center space-x-2"
            >
              {user ? <Sparkles className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              <span>{user ? (language === 'pt' ? 'ABRIR WORKSPACE' : 'OPEN WORKSPACE') : (language === 'pt' ? 'ENTRAR NO PORTAL' : 'PORTAL LOGIN')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area - Better Centralization */}
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-32">
        <div className="text-center mb-12 animate-fade-in w-full max-w-5xl">
          <div className="flex items-center justify-center space-x-2 mb-4">
             <div className="flex items-center space-x-2 bg-blue-600/10 dark:bg-blue-400/10 px-4 py-1.5 rounded-full border border-blue-200/50 dark:border-blue-700/50 backdrop-blur-sm">
                <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-black text-blue-700 dark:text-blue-300 uppercase tracking-widest">Sovereign Edition v23.4</span>
             </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
            {language === 'pt' ? 'Onde ideias tornam-se' : 'Where ideas become'} <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
              {language === 'pt' ? 'soberania real.' : 'true sovereignty.'}
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
            Construa aplicações funcionais e ecossistemas inteiros através da colaboração neural avançada.
          </p>
        </div>

        {/* The Omni-Brain Input Card */}
        <div className="w-full max-w-4xl glass-card rounded-[2.5rem] p-4 md:p-6 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.15)] mb-12">
          {/* Project Selector Tab Row */}
          <div className="flex items-center justify-between mb-6 px-4">
            <div className="flex p-1 bg-gray-100/50 dark:bg-gray-800/50 rounded-2xl backdrop-blur-sm border border-white/20">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    activeTab === tab.id 
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            <button className="flex items-center space-x-2 px-4 py-2 bg-white/50 dark:bg-gray-800/50 rounded-xl text-xs font-black text-gray-600 dark:text-gray-400 border border-white/20 hover:bg-white dark:hover:bg-gray-700 transition-colors">
              <Globe className="w-4 h-4" />
              <span>{language === 'pt' ? 'Meu Projeto' : 'My Project'}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>

          {/* Prompt Area */}
          <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-inner min-h-[200px] flex flex-col">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={language === 'pt' ? "Descreva o seu projeto Maximus..." : "Build me a high-frequency trading bot..."}
              className="flex-grow bg-transparent border-none focus:ring-0 text-xl md:text-2xl text-gray-800 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 resize-none"
            />
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-700/50 mt-4">
              <div className="flex items-center space-x-1">
                <button className="flex items-center space-x-2 px-3 py-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all">
                  <Paperclip className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-wider">Anexar</span>
                </button>
                <button className="flex items-center space-x-2 px-3 py-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all">
                  <Github className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-wider">GitHub</span>
                </button>
                <div className="h-6 w-[1px] bg-gray-100 dark:bg-gray-700 mx-2" />
                <button className="flex items-center space-x-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-100 dark:border-blue-800/30">
                  <Sparkles className="w-3 h-3" />
                  <span>Sovereign v4.5</span>
                </button>
              </div>

              <div className="flex items-center space-x-3">
                 <button className="flex items-center space-x-2 px-3 py-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all">
                  <Mic className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-wider">Voz</span>
                </button>
                <button 
                  onClick={onGetStarted}
                  disabled={!prompt.trim()}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
                    prompt.trim() 
                    ? 'bg-blue-600 text-white hover:scale-110 active:scale-95' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-300 dark:text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ArrowUp className="w-6 h-6 stroke-[3px]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Badges Bar */}
        <div className="flex flex-wrap justify-center gap-3 animate-slide-up">
          {badges.map((badge, idx) => (
            <button
              key={idx}
              className="flex items-center space-x-2 px-6 py-2.5 bg-white/40 dark:bg-gray-800/40 rounded-2xl border border-white/30 dark:border-gray-700/50 backdrop-blur-md hover:bg-white dark:hover:bg-gray-800 transition-all font-bold text-sm text-gray-700 dark:text-gray-300 shadow-sm"
            >
              <span>{badge.label}</span>
              {badge.isNew && <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded-md font-black">NEW</span>}
            </button>
          ))}
        </div>
      </main>

      {/* Professional Footer Trust Bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-xl border-t border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-[10px] md:text-sm">
          <div className="flex items-center space-x-8 mb-4 md:mb-0">
             <div className="flex items-center space-x-2 group">
                <Database className="w-4 h-4 text-gray-500 group-hover:text-blue-500 transition-colors" />
                <span className="text-gray-500 uppercase tracking-widest font-black">Neural Capacity: <span className="text-blue-500">8.4 PFLOPS</span></span>
             </div>
             <div className="flex items-center space-x-2 group">
                <Lock className="w-4 h-4 text-gray-500 group-hover:text-green-500 transition-colors" />
                <span className="text-gray-500 uppercase tracking-widest font-black text-green-500/80">Zero-Trust Encrypted</span>
             </div>
             <div className="hidden lg:flex items-center space-x-2 group">
                <Shield className="w-4 h-4 text-gray-500 group-hover:text-purple-500 transition-colors" />
                <span className="text-gray-500 uppercase tracking-widest font-black">Sovereign Protected</span>
             </div>
          </div>

          <div className="flex items-center space-x-6 text-gray-600 font-bold uppercase tracking-widest">
            <button className="hover:text-white transition-colors">Privacy</button>
            <button className="hover:text-white transition-colors">Terms</button>
            <span className="text-gray-800">© 2024 MAXIMUS.DEV</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;