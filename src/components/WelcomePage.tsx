import React, { useState, useEffect } from 'react';
import { 
  Zap, Brain, Layout, Code, Shield, 
  ChevronDown, Paperclip, Github, 
  Mic, ArrowUp, Sparkles, Globe, 
  Lock, Database, ArrowRight, Code2, Users, Layers, CheckCircle, Quote
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

  const features = [
    {
      icon: <Brain className="w-6 h-6 text-blue-500" />,
      title: language === 'pt' ? 'IA Generativa Avançada' : 'Advanced Generative AI',
      description: language === 'pt' ? 'Transforme linguagem natural em código de produção em segundos.' : 'Turn natural language into production code in seconds.'
    },
    {
      icon: <Layout className="w-6 h-6 text-purple-500" />,
      title: language === 'pt' ? 'Interface Visual Dinâmica' : 'Dynamic Visual Interface',
      description: language === 'pt' ? 'Preview em tempo real dos seus componentes React com Tailwind CSS.' : 'Real-time preview of your React components with Tailwind CSS.'
    },
    {
      icon: <Layers className="w-6 h-6 text-green-500" />,
      title: language === 'pt' ? 'Integração Completa' : 'Full Integration',
      description: language === 'pt' ? 'Conectado nativamente com Supabase para banco de dados e autenticação.' : 'Natively connected with Supabase for database and authentication.'
    }
  ];

  const steps = [
    {
      step: '01',
      title: language === 'pt' ? 'Descreva sua Ideia' : 'Describe your Idea',
      description: language === 'pt' ? 'Use o chat integrado para detalhar o que você quer construir.' : 'Use the integrated chat to detail what you want to build.'
    },
    {
      step: '02',
      title: language === 'pt' ? 'Geração Neural' : 'Neural Generation',
      description: language === 'pt' ? 'Nossos agentes IA escrevem o código, configuram o banco e montam a UI.' : 'Our AI agents write the code, setup the DB and build the UI.'
    },
    {
      step: '03',
      title: language === 'pt' ? 'Ajuste e Publique' : 'Tweak and Publish',
      description: language === 'pt' ? 'Edite no editor de código integrado e faça o deploy com um clique.' : 'Edit in the integrated code editor and deploy with one click.'
    }
  ];

  const testimonials = [
    {
      quote: language === 'pt' ? "O MAXIMUS.DEV reduziu meu tempo de desenvolvimento em 80%. A integração com o Supabase é mágica." : "MAXIMUS.DEV reduced my dev time by 80%. The Supabase integration is magic.",
      author: "Carlos Silva",
      role: "Tech Lead @ InnovateBR"
    },
    {
      quote: language === 'pt' ? "Nunca vi uma IA gerar componentes React tão precisos usando Tailwind. Mudou a forma como a nossa equipe trabalha." : "Never seen an AI generate such accurate React components using Tailwind. Changed how our team works.",
      author: "Ana Souza",
      role: "Frontend Engineer"
    },
    {
      quote: language === 'pt' ? "O Sovereign OS por trás dessa ferramenta entende a arquitetura completa de uma aplicação, não apenas snippets isolados." : "The Sovereign OS behind this tool understands full application architecture, not just isolated snippets.",
      author: "Ricardo Mendes",
      role: "CTO @ StartupX"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 overflow-x-hidden">
      
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-800' : 'py-6 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center space-x-10">
            <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter dark:text-white">MAXIMUS<span className="text-blue-600">.DEV</span></span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8 text-sm font-bold text-gray-600 dark:text-gray-300">
              <a href="#features" className="hover:text-blue-600 transition-colors uppercase tracking-wider">{language === 'pt' ? 'Recursos' : 'Features'}</a>
              <a href="#how-it-works" className="hover:text-blue-600 transition-colors uppercase tracking-wider">{language === 'pt' ? 'Como Funciona' : 'How it works'}</a>
              <a href="#testimonials" className="hover:text-blue-600 transition-colors uppercase tracking-wider">{language === 'pt' ? 'Depoimentos' : 'Testimonials'}</a>
            </nav>
          </div>

          <div className="flex items-center space-x-6">
            <div className="hidden lg:flex items-center space-x-2 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full border border-green-100 dark:border-green-800/30">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-widest">System: Online</span>
            </div>
            <button 
              onClick={onGetStarted}
              className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-2.5 rounded-xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center space-x-2"
            >
              {user ? <Sparkles className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              <span>{user ? (language === 'pt' ? 'ABRIR WORKSPACE' : 'OPEN WORKSPACE') : (language === 'pt' ? 'ENTRAR / CADASTRAR' : 'LOGIN / SIGNUP')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Dynamic Sky Background */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 scale-105 opacity-40 dark:opacity-20"
          style={{ backgroundImage: `url(${skyBackground})` }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-gray-50/80 to-gray-50 dark:via-gray-950/80 dark:to-gray-950" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center">
          <div className="text-center mb-12 animate-fade-in w-full max-w-4xl">
            <div className="flex items-center justify-center space-x-2 mb-6">
               <div className="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5 rounded-full border border-blue-200 dark:border-blue-700/50">
                  <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-black text-blue-700 dark:text-blue-300 uppercase tracking-widest">Sovereign Edition v23.4</span>
               </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-6 tracking-tight leading-tight">
              {language === 'pt' ? 'Construa softwares em' : 'Build software at'} <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
                {language === 'pt' ? 'velocidade de pensamento.' : 'the speed of thought.'}
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
              {language === 'pt' 
                ? 'O ambiente de desenvolvimento impulsionado por IA que escreve, testa e faz deploy de código React completo com backend Supabase integrado.' 
                : 'The AI-driven IDE that writes, tests, and deploys full React code with integrated Supabase backend.'}
            </p>
          </div>

          {/* The Omni-Brain Input Card */}
          <div className="w-full max-w-4xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-[2rem] p-4 md:p-6 shadow-2xl border border-white/20 dark:border-gray-800 mb-12">
            <div className="flex items-center justify-between mb-6 px-2">
              <div className="flex p-1 bg-gray-100/50 dark:bg-gray-800/50 rounded-2xl">
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
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-inner flex flex-col">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={language === 'pt' ? "Ex: Crie um dashboard para gestão de tarefas com login do Google..." : "Ex: Build a task management dashboard with Google login..."}
                className="w-full bg-transparent border-none focus:ring-0 text-xl text-gray-800 dark:text-white placeholder-gray-400 resize-none min-h-[120px]"
              />
              
              <div className="flex items-center justify-between pt-4 mt-2">
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all">
                    <Github className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center space-x-3">
                   <button className="hidden sm:flex items-center space-x-2 px-4 py-2 text-gray-500 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 dark:bg-gray-700 dark:hover:bg-blue-900/30 rounded-xl transition-all font-medium text-sm">
                    <Mic className="w-4 h-4" />
                    <span>{language === 'pt' ? 'Falar' : 'Speak'}</span>
                  </button>
                  <button 
                    onClick={onGetStarted}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${
                      prompt.trim() 
                      ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105' 
                      : 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 hover:scale-105'
                    }`}
                  >
                    <span>{language === 'pt' ? 'Gerar Código' : 'Generate Code'}</span>
                    <ArrowUp className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-8 text-sm font-bold text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>React & Vite</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Tailwind CSS</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Supabase</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">{language === 'pt' ? 'Poder Ilimitado para Desenvolvedores' : 'Unlimited Power for Developers'}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {language === 'pt' ? 'Tudo que você precisa para ir da ideia à produção em tempo recorde.' : 'Everything you need to go from idea to production in record time.'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-gray-50 dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-white dark:bg-gray-700 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-black text-blue-600 mb-2">1M+</div>
              <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">{language === 'pt' ? 'Linhas Geradas' : 'Lines Generated'}</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black text-purple-600 mb-2">50k</div>
              <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">{language === 'pt' ? 'Projetos Criados' : 'Projects Created'}</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black text-indigo-600 mb-2">99%</div>
              <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">{language === 'pt' ? 'Precisão de Código' : 'Code Accuracy'}</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black text-green-600 mb-2">24/7</div>
              <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">{language === 'pt' ? 'Suporte Neural' : 'Neural Support'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">{language === 'pt' ? 'Como Funciona' : 'How it Works'}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {language === 'pt' ? 'Um fluxo de trabalho desenhado para a máxima eficiência.' : 'A workflow designed for maximum efficiency.'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-[2px] bg-gradient-to-r from-blue-100 via-blue-500 to-blue-100 dark:from-blue-900 dark:via-blue-500 dark:to-blue-900 z-0" />
            
            {steps.map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-xl border-4 border-gray-50 dark:border-gray-900 mb-6 text-2xl font-black text-blue-600">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">{language === 'pt' ? 'O que dizem nossos usuários' : 'What our users say'}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                <Quote className="w-8 h-8 text-blue-100 dark:text-blue-900/50 mb-6" />
                <p className="text-gray-700 dark:text-gray-300 italic mb-6">"{t.quote}"</p>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">{t.author}</div>
                  <div className="text-sm text-gray-500">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-600 dark:bg-blue-700 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black mb-6">{language === 'pt' ? 'Pronto para criar o futuro?' : 'Ready to build the future?'}</h2>
          <p className="text-blue-100 text-xl mb-10">{language === 'pt' ? 'Junte-se a milhares de desenvolvedores construindo com MAXIMUS.DEV.' : 'Join thousands of developers building with MAXIMUS.DEV.'}</p>
          <button 
            onClick={onGetStarted}
            className="bg-white text-blue-600 px-8 py-4 rounded-xl font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center space-x-3 mx-auto"
          >
            <span>{language === 'pt' ? 'Começar Gratuitamente' : 'Start for Free'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 pt-16 pb-8 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-black tracking-tighter dark:text-white">MAXIMUS.DEV</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {language === 'pt' ? 'Empoderando desenvolvedores com IA avançada.' : 'Empowering developers with advanced AI.'}
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">{language === 'pt' ? 'Produto' : 'Product'}</h4>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li><a href="#" className="hover:text-blue-600">Features</a></li>
                <li><a href="#" className="hover:text-blue-600">Pricing</a></li>
                <li><a href="#" className="hover:text-blue-600">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">{language === 'pt' ? 'Recursos' : 'Resources'}</h4>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li><a href="#" className="hover:text-blue-600">Documentation</a></li>
                <li><a href="#" className="hover:text-blue-600">Community</a></li>
                <li><a href="#" className="hover:text-blue-600">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">{language === 'pt' ? 'Legal' : 'Legal'}</h4>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li><a href="#" className="hover:text-blue-600">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-600">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
            <p>© 2026 MAXIMUS.DEV. {language === 'pt' ? 'Todos os direitos reservados.' : 'All rights reserved.'}</p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
               <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4 text-blue-500" />
                  <span className="font-bold uppercase tracking-widest text-[10px]">System: Online</span>
               </div>
               <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="font-bold uppercase tracking-widest text-[10px]">Secure</span>
               </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;