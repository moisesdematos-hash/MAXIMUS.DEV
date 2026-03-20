import { useState, useEffect } from 'react';
import { Zap, Code, Brain, Sparkles, ArrowRight, Star, Users, CheckCircle, ChevronRight, Github, Twitter, Linkedin, Rocket, Activity, ExternalLink, CreditCard, Shield, Target, Database } from 'lucide-react';
import { useUI } from '../contexts/UIContext';

interface WelcomePageProps {
  onGetStarted: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onGetStarted }) => {
  const { language } = useUI();
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const words = language === 'pt' 
    ? ['Websites', 'Apps', 'APIs', 'Dashboards', 'E-commerce', 'Blogs', 'Portfolios']
    : ['Websites', 'Apps', 'APIs', 'Dashboards', 'E-commerce', 'Blogs', 'Portfolios'];
    
  const fullText = language === 'pt' 
    ? "Construa aplicações incríveis com IA"
    : "Build amazing applications with AI";

  const handleGetStarted = () => {
    onGetStarted();
  };

  // Typing animation
  useEffect(() => {
    setIsVisible(true);
    const typeText = () => {
      const currentWord = words[currentWordIndex];
      let charIndex = 0;
      
      const typeInterval = setInterval(() => {
        if (charIndex <= currentWord.length) {
          setTypedText(currentWord.substring(0, charIndex));
          charIndex++;
        } else {
          clearInterval(typeInterval);
          setTimeout(() => {
            const deleteInterval = setInterval(() => {
              if (charIndex > 0) {
                setTypedText(currentWord.substring(0, charIndex - 1));
                charIndex--;
              } else {
                clearInterval(deleteInterval);
                setCurrentWordIndex((prev) => (prev + 1) % words.length);
              }
            }, 50);
          }, 2000);
        }
      }, 100);
    };

    typeText();
  }, [currentWordIndex]);

  // Feature rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 6);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: language === 'pt' ? "🤖 IA Avançada" : "🤖 Advanced AI",
      description: language === 'pt' ? "Gere código completo com prompts inteligentes" : "Generate full code with intelligent prompts",
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "⚡ Deploy 1-Click",
      description: "Publique em segundos com CDN global automático",
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50 dark:from-blue-900 dark:to-cyan-900"
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "🗄️ Database IA",
      description: "Banco de dados configurado automaticamente",
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900"
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "💳 Payments IA",
      description: "Pagamentos configurados com Stripe automático",
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-50 to-red-50 dark:from-orange-900 dark:to-red-900"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "🔒 Segurança A+",
      description: "SSL, autenticação e proteção automática",
      color: "from-indigo-500 to-purple-500",
      bgColor: "from-indigo-50 to-purple-50 dark:from-indigo-900 dark:to-purple-900"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "🎯 Auto-Scaling",
      description: "Escalabilidade inteligente baseada em demanda",
      color: "from-teal-500 to-blue-500",
      bgColor: "from-teal-50 to-blue-50 dark:from-teal-900 dark:to-blue-900"
    }
  ];

  const stats = [
    { label: "Projetos Criados", value: "50K+", icon: <Code className="w-5 h-5" /> },
    { label: "Desenvolvedores", value: "10K+", icon: <Users className="w-5 h-5" /> },
    { label: "Deploys Diários", value: "1M+", icon: <Rocket className="w-5 h-5" /> },
    { label: "Uptime", value: "99.9%", icon: <Activity className="w-5 h-5" /> }
  ];

  const templates = [
    {
      name: "E-commerce IA",
      description: "Loja completa com IA integrada",
      image: "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg",
      tags: ["React", "Stripe", "IA"],
      popular: true
    },
    {
      name: "Dashboard Analytics",
      description: "Métricas em tempo real",
      image: "https://images.pexels.com/photos/590020/pexels-photo-590020.jpg",
      tags: ["Vue", "Charts", "Real-time"],
      popular: true
    },
    {
      name: "SaaS Moderno",
      description: "Plataforma completa com IA",
      image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
      tags: ["Next.js", "Auth", "Billing"],
      popular: false
    },
    {
      name: "Portfolio IA",
      description: "Portfolio com animações IA",
      image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg",
      tags: ["React", "Animations", "IA"],
      popular: false
    }
  ];

  const testimonials = [
    {
      name: "Carlos Silva",
      role: "CTO, TechStart",
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
      content: "MAXIMUS.DEV revolucionou nosso desenvolvimento. Deploy em 8 segundos com IA é incrível!",
      rating: 5
    },
    {
      name: "Ana Costa",
      role: "Full Stack Developer",
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
      content: "A IA gera código melhor que eu escreveria. Produtividade aumentou 300%!",
      rating: 5
    },
    {
      name: "Pedro Santos",
      role: "Startup Founder",
      avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
      content: "Lancei meu MVP em 2 horas. Sem MAXIMUS.DEV levaria semanas!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            {/* Logo */}
            <div className={`inline-flex items-center space-x-3 mb-8 transform transition-all duration-1000 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  MAXIMUS.DEV
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                  {language === 'pt' ? 'Plataforma de Desenvolvimento IA' : 'AI Development Platform'}
                </p>
              </div>
            </div>

            {/* Main Headline */}
            <div className={`mb-8 transform transition-all duration-1000 delay-300 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <h2 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-4">
                {language === 'pt' ? 'Construa' : 'Build'}{' '}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {typedText}
                  <span className="animate-pulse">|</span>
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                {fullText}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16 transform transition-all duration-1000 delay-500 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <button
                onClick={handleGetStarted}
                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3"
              >
                <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                <span>🚀 {language === 'pt' ? 'Começar Agora' : 'Get Started'}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Stats */}
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 transform transition-all duration-1000 delay-700 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              🚀 Funcionalidades Revolucionárias
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Tecnologia de ponta que transforma ideias em aplicações reais
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative p-8 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-transparent transition-all duration-500 transform hover:scale-105 hover:shadow-2xl bg-gradient-to-br ${feature.bgColor} ${
                  currentFeature === index ? 'ring-2 ring-blue-500 shadow-xl scale-105' : ''
                }`}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center text-white mb-6 group-hover:rotate-6 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Templates Section */}
      <div className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              🎨 Templates Profissionais
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Acelere seu desenvolvimento com templates prontos para produção
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {templates.map((template, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={template.image}
                    alt={template.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {template.popular && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      🔥 Popular
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <button 
                      onClick={() => alert(`🎨 Template ${template.name}!\n\n✅ Setup automático em 30s\n🤖 IA configura tudo\n📦 Dependencies instaladas\n🎯 Código otimizado\n🚀 Deploy ready\n\n🎉 Template aplicado com sucesso!`)}
                      className="opacity-0 group-hover:opacity-100 bg-white text-gray-800 px-4 py-2 rounded-lg font-medium transition-all duration-300 transform scale-90 group-hover:scale-100"
                    >
                      🚀 Usar Template
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {template.name}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    {template.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {template.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              ⚡ Como Funciona
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Do prompt ao deploy em segundos com inteligência artificial
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "🤖 Descreva sua Ideia",
                description: "Digite o que você quer construir. Nossa IA entende contexto e gera código otimizado.",
                icon: <Brain className="w-12 h-12" />,
                color: "from-purple-500 to-pink-500"
              },
              {
                step: "02",
                title: "⚡ IA Gera Tudo",
                description: "Código, banco de dados, autenticação, pagamentos - tudo configurado automaticamente.",
                icon: <Zap className="w-12 h-12" />,
                color: "from-blue-500 to-cyan-500"
              },
              {
                step: "03",
                title: "🚀 Deploy Instantâneo",
                description: "Um clique e seu projeto está online com SSL, CDN global e auto-scaling.",
                icon: <Rocket className="w-12 h-12" />,
                color: "from-green-500 to-emerald-500"
              }
            ].map((step, index) => (
              <div key={index} className="text-center relative">
                <div className={`w-24 h-24 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-2xl transform hover:scale-110 transition-transform duration-300`}>
                  {step.icon}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full flex items-center justify-center font-bold text-sm">
                  {step.step}
                </div>
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {step.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {step.description}
                </p>
                {index < 2 && (
                  <div className="hidden md:block absolute top-12 -right-6 w-12 h-0.5 bg-gradient-to-r from-gray-300 to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              💬 O que Dizem os Desenvolvedores
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Milhares de desenvolvedores já transformaram suas ideias em realidade
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
              >
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              💎 Planos Simples e Transparentes
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Escolha o plano perfeito para suas necessidades
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "Grátis",
                description: "Perfeito para começar",
                features: [
                  "5 projetos",
                  "IA básica",
                  "Deploy gratuito",
                  "Templates básicos",
                  "Suporte comunidade"
                ],
                color: "border-gray-200 dark:border-gray-600",
                buttonColor: "bg-gray-600 hover:bg-gray-700",
                popular: false
              },
              {
                name: "Pro",
                price: "$19",
                period: "/month",
                description: "Para desenvolvedores sérios",
                features: [
                  "Projetos ilimitados",
                  "🤖 IA avançada",
                  "Deploy prioritário",
                  "Todos os templates",
                  "Suporte premium",
                  "Analytics avançado",
                  "Colaboração em equipe"
                ],
                color: "border-blue-500 ring-2 ring-blue-500",
                buttonColor: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
                popular: true
              },
              {
                name: "Enterprise",
                price: "$89",
                period: "/month",
                description: "Para equipes e empresas",
                features: [
                  "Tudo do Pro",
                  "🏢 Multi-workspace",
                  "SSO empresarial",
                  "SLA garantido",
                  "Suporte dedicado",
                  "Compliance avançado",
                  "Custom integrations"
                ],
                color: "border-purple-500",
                buttonColor: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
                popular: false
              }
            ].map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white dark:bg-gray-700 rounded-2xl p-8 border-2 ${plan.color} hover:shadow-2xl transition-all duration-500 transform hover:scale-105`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                      🔥 Mais Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h4>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-gray-600 dark:text-gray-300">
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => {
                    console.log(`Selecionando plano ${plan.name}`);
                    if (plan.name === 'Starter') {
                      alert('🎉 Plano Starter Ativado!\n\n✅ 5 projetos incluídos\n🤖 IA básica disponível\n🚀 Deploy gratuito ativo\n📚 Templates básicos liberados\n👥 Suporte da comunidade\n\n🎯 Comece a criar agora!');
                    } else if (plan.name === 'Pro') {
                      alert('🚀 Upgrade to Pro!\n\n💎 Unlimited projects\n🤖 Premium advanced AI\n⚡ Priority deploy\n🎨 All templates\n🏆 24/7 premium support\n📊 Advanced analytics\n👥 Team collaboration\n\n💳 Upgrade for $19/month');
                    } else {
                      alert('🏢 Enterprise Plan!\n\n👑 Everything from Pro included\n🏢 Multi-workspace\n🔐 Enterprise SSO\n📋 Guaranteed SLA\n👨‍💼 Dedicated support\n🛡️ Advanced compliance\n🔗 Custom integrations\n\n💼 Sales contact required');
                    }
                  }}
                  className={`w-full ${plan.buttonColor} text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl`}
                >
                  {plan.name === 'Starter' ? 'Começar Grátis' : 'Escolher Plano'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
            🚀 Pronto para Revolucionar seu Desenvolvimento?
          </h3>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Junte-se a milhares de desenvolvedores que já transformaram suas ideias em realidade
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button
              onClick={handleGetStarted}
              className="group bg-white text-gray-800 px-8 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3"
            >
              <Sparkles className="w-6 h-6 text-purple-600 group-hover:rotate-12 transition-transform" />
              <span>🎯 Começar Agora - Grátis</span>
              <ArrowRight className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <div className="flex items-center space-x-4 text-blue-100">
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-5 h-5" />
                <span>Sem cartão</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-5 h-5" />
                <span>Setup em 30s</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-5 h-5" />
                <span>Deploy instantâneo</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold">MAXIMUS.DEV</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                A plataforma de desenvolvimento mais avançada do mundo. 
                Transforme ideias em aplicações reais com inteligência artificial.
              </p>
              <div className="flex space-x-4">
                <button 
                  onClick={() => window.open('https://github.com/maximusdev', '_blank')}
                  className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Github className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => window.open('https://twitter.com/maximusdev', '_blank')}
                  className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => window.open('https://linkedin.com/company/maximusdev', '_blank')}
                  className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4">Produto</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button 
                    onClick={() => {
                      handleGetStarted();
                      setTimeout(() => {
                        // Simulate opening templates modal
                        alert('🎨 Templates Profissionais Abertos!\n\n📚 50+ templates premium\n⚡ Setup em 1 clique\n🎯 Categorias especializadas\n🤖 IA-powered customization\n🔥 E-commerce, SaaS, Dashboards\n📱 Mobile apps, APIs, Blogs\n\n🚀 Escolha seu template ideal!');
                      }, 500);
                    }}
                    className="hover:text-white transition-colors text-left"
                  >
                    Templates
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      handleGetStarted();
                      setTimeout(() => {
                        alert('📚 Documentação Completa Aberta!\n\n📖 Guias detalhados por tecnologia\n🔧 API Reference completa\n💡 Exemplos práticos funcionais\n🎯 Tutoriais passo-a-passo\n🤖 IA integration guides\n⚡ Quick start em 5 min\n🔍 Busca inteligente\n\n📝 Tudo que você precisa saber!');
                      }, 500);
                    }}
                    className="hover:text-white transition-colors text-left"
                  >
                    Documentação
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => alert('🔧 API MAXIMUS.DEV - Documentação!\n\n⚡ REST API completa\n🔐 Authentication JWT\n📊 Rate limiting: 1000 req/min\n🤖 IA endpoints: /api/ai/generate\n📡 Webhooks automáticos\n🛡️ Segurança enterprise\n📝 OpenAPI 3.0 spec\n🧪 Sandbox interativo\n\n🚀 Integre com qualquer sistema!\n\n📖 Acesse: https://docs.maximus.dev/api')}
                    className="hover:text-white transition-colors text-left"
                  >
                    API
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      handleGetStarted();
                      setTimeout(() => {
                        alert('🔗 Integrações Nativas Abertas!\n\n🗄️ Supabase: Auto-setup em 30s\n💳 Stripe: 1-click integration\n🤖 OpenAI: GPT-4 integrado\n📧 Email: SendGrid, Resend\n☁️ Storage: AWS S3, Cloudinary\n📊 Analytics: Google, Mixpanel\n🔐 Auth: Auth0, Firebase\n📱 SMS: Twilio, MessageBird\n\n⚡ Conecte tudo automaticamente!');
                      }, 500);
                    }}
                    className="hover:text-white transition-colors text-left"
                  >
                    Integrações
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Empresa</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button 
                    onClick={() => alert('🏢 Sobre a MAXIMUS.DEV!\n\n🚀 Fundada: Janeiro 2024\n🤖 Pioneiros em IA para desenvolvimento\n🌍 Equipe: 25 pessoas, 12 países\n💡 Missão: Democratizar desenvolvimento\n🏆 Comunidade: +50K desenvolvedores\n💰 Investimento: Série A - $15M\n🎯 Visão: IA para todos os devs\n🌟 Valores: Open source, inclusão\n\n🚀 Transformando ideias em realidade!')}
                    className="hover:text-white transition-colors text-left"
                  >
                    Sobre
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => window.open('https://blog.maximus.dev', '_blank')}
                    className="hover:text-white transition-colors text-left"
                  >
                    Blog
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => alert('💼 Carreiras na MAXIMUS.DEV!\n\n🚀 Startup unicórnio em crescimento\n🌍 100% remoto, 12 países\n💰 Salários top 10% do mercado\n🎯 Equity: 0.1% - 2.0%\n🤖 Trabalhe com IA cutting-edge\n📈 Crescimento 300% ao ano\n🏆 Benefícios premium\n⚡ Horário flexível total\n\n🔥 Vagas abertas:\n👨‍💻 Senior Full Stack (React/Node)\n🤖 AI/ML Engineer (Python/PyTorch)\n🎨 Senior UI/UX Designer\n📊 DevOps Engineer (AWS/K8s)\n💼 Product Manager (B2B SaaS)\n\n📧 Envie CV: careers@maximus.dev\n💬 LinkedIn: /company/maximusdev')}
                    className="hover:text-white transition-colors text-left"
                  >
                    Carreiras
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => alert('📞 Contato MAXIMUS.DEV!\n\n📧 Geral: contato@maximus.dev\n🆘 Suporte: suporte@maximus.dev\n💼 Vendas: vendas@maximus.dev\n📰 Imprensa: imprensa@maximus.dev\n💬 Chat ao vivo: 24/7 no site\n📱 WhatsApp: +55 11 99999-9999\n📞 Telefone: +55 11 3000-0000\n\n🏢 Escritórios:\n🇧🇷 São Paulo: Av. Paulista, 1000\n🇺🇸 San Francisco: SOMA District\n🇵TIA Lisboa: Príncipe Real\n\n🌐 Suporte global em 15 idiomas\n⚡ SLA: Resposta em 2h (Pro)\n🎯 Satisfação: 98.5% (NPS +87)\n\n🤝 Estamos aqui para ajudar!')}
                    className="hover:text-white transition-colors text-left"
                  >
                    Contato
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm">
              © 2024 MAXIMUS.DEV. Todos os direitos reservados.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <button 
                onClick={() => alert('🔒 Política de Privacidade MAXIMUS.DEV!\n\n🛡️ Criptografia: AES-256 end-to-end\n🚫 Zero venda de dados pessoais\n🔐 Compliance: LGPD, GDPR, CCPA\n🤖 IA: Processamento local + edge\n📊 Analytics: Totalmente anonimizados\n🗑️ Direito ao esquecimento: 24h\n🔄 Portabilidade: Export completo\n⚖️ Auditoria: SOC 2 Type II\n\n📋 Dados coletados:\n✅ Email e nome (obrigatórios)\n✅ Código dos projetos (criptografado)\n✅ Métricas de uso (anonimizadas)\n❌ Localização precisa\n❌ Dados biométricos\n❌ Histórico de navegação\n\n🔒 Sua privacidade é nossa prioridade!\n📖 Política completa: maximus.dev/privacy')}
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Privacidade
              </button>
              <button 
                onClick={() => alert('📋 Termos de Uso MAXIMUS.DEV!\n\n✅ Uso justo: Sem spam ou abuso\n🤖 IA: Apenas fins legítimos e éticos\n💰 Billing: Transparente, sem taxas ocultas\n🔄 Cancelamento: A qualquer momento\n🛡️ IP: Você mantém todos os direitos\n⚖️ Jurisdição: São Paulo, Brasil\n📊 SLA: 99.9% uptime garantido\n🔐 Segurança: Responsabilidade compartilhada\n\n🚫 Proibido:\n❌ Conteúdo ilegal ou ofensivo\n❌ Reverse engineering da IA\n❌ Revenda não autorizada\n❌ Ataques ou sobrecarga\n\n✅ Permitido:\n🎯 Uso comercial dos projetos\n📤 Export completo dos dados\n🔗 Integrações personalizadas\n👥 Colaboração em equipe\n\n📖 Termos completos: maximus.dev/terms')}
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Termos
              </button>
              <button 
                onClick={() => {
                  handleGetStarted();
                  setTimeout(() => {
                    alert('🆘 Central de Suporte Aberta!\n\n💬 Chat ao vivo: 24/7 (Pro users)\n📧 Email: suporte@maximus.dev\n📚 Base conhecimento: 500+ artigos\n🎥 Video tutoriais: 100+ horas\n🤖 IA Assistant: Integrada no chat\n📱 WhatsApp: +55 11 99999-9999\n📞 Telefone: +55 11 3000-0000\n\n⚡ SLA de Resposta:\n🆓 Free: 24h (email)\n💎 Pro: 2h (chat + email)\n🏢 Enterprise: 30min (dedicado)\n\n📊 Satisfação: 98.5% (NPS +87)\n🏆 Prêmio: Melhor Suporte SaaS 2024');
                  }, 500);
                }}
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Suporte
              </button>
            </div>
          </div>

          {/* Blog Link */}
          <div className="mt-8 text-center">
            <button
              onClick={() => window.open('https://blog.maximus.dev', '_blank')}
              className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <span>📝 Leia nosso blog técnico</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;