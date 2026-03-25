import React from 'react';
import { Check, Zap, Crown, Shield, Rocket } from 'lucide-react';

const SubscriptionView: React.FC = () => {
  const plans = [
    {
      name: 'Starter',
      price: '€0',
      period: '/mês',
      description: 'Ideal para desenvolvedores individuais e prototipagem rápida.',
      features: [
        'MAXIMUS Neural (Nativo) Ilimitado',
        '1.000 Créditos para IAs Externas',
        'Até 3 Projetos Ativos',
        'Exportação de Código Local',
        'Suporte via Comunidade'
      ],
      icon: <Rocket className="w-5 h-5 text-gray-400" />,
      buttonText: 'Plano Atual',
      buttonClass: 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-default',
      popular: false
    },
    {
      name: 'Pro',
      price: '€29',
      period: '/mês',
      description: 'Arquitetura neural completa para profissionais de elite.',
      features: [
        'Acesso aos 8 Modelos (GPT-4o, Claude 4.6)',
        '50.000 Créditos mensais',
        'Projetos Ilimitados',
        'Deploy 1-Click (GitHub & Vercel)',
        'Suporte Prioritário (AI Architect)',
        'Neural Time-Travel Master'
      ],
      icon: <Zap className="w-5 h-5 text-yellow-500" />,
      buttonText: 'Aderir ao Pro',
      buttonClass: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/20',
      popular: true
    },
    {
      name: 'Elite',
      price: '€149',
      period: '/mês',
      description: 'A solução definitiva para agências e scale-ups tecnológicas.',
      features: [
        'Fila Neural Ultra-Prioritária',
        '1.000.000 Créditos Mensais',
        'Colaboração Master (Até 5 Membros)',
        'Segurança QuantumShield & Auditoria',
        'SLA de Performance Garantido',
        'Gerente de Conta Dedicado (Humano)'
      ],
      icon: <Crown className="w-5 h-5 text-purple-500" />,
      buttonText: 'Falar com Especialista',
      buttonClass: 'bg-white dark:bg-gray-100 text-gray-900 border border-gray-200 dark:border-transparent hover:bg-gray-50',
      popular: false
    }
  ];

  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto animate-fade-in bg-white dark:bg-gray-900">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Escolha o seu <span className="text-blue-600">Plano Neural</span>
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Aceda às ferramentas de desenvolvimento mais avançadas do mundo.
        </p>
      </div>

      <div className="space-y-6">
        {plans.map((plan, index) => (
          <div 
            key={index}
            className={`relative p-5 rounded-2xl border transition-all duration-300 ${
              plan.popular 
                ? 'border-blue-500 bg-blue-50/30 dark:bg-blue-900/10 shadow-xl dark:shadow-blue-900/20' 
                : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm'
            } hover:scale-[1.02] hover:shadow-md`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg">
                Mais Popular
              </div>
            )}

            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800">
                  {plan.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">{plan.name}</h3>
                  <div className="flex items-baseline">
                    <span className="text-xl font-black text-gray-900 dark:text-white">{plan.price}</span>
                    <span className="text-xs text-gray-500 ml-1">{plan.period}</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 h-8 overflow-hidden">
              {plan.description}
            </p>

            <div className="space-y-2.5 mb-6">
              {plan.features.map((feature, fIndex) => (
                <div key={fIndex} className="flex items-center space-x-2">
                  <div className="flex-shrink-0 w-4 h-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-300 truncate">{feature}</span>
                </div>
              ))}
            </div>

            <button className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${plan.buttonClass}`}>
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>

      {/* Security Badge */}
      <div className="mt-8 p-4 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 flex items-center space-x-3">
        <Shield className="w-8 h-8 text-blue-500 bg-blue-50 dark:bg-blue-900/20 p-1.5 rounded-lg" />
        <div className="flex-1">
          <p className="text-[10px] font-bold text-gray-900 dark:text-white uppercase tracking-wider">Pagamento Seguro</p>
          <p className="text-[9px] text-gray-500">Processado via Stripe. Encriptação End-to-End.</p>
        </div>
        <div className="flex -space-x-1">
          <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 border border-white dark:border-gray-900" />
          <div className="w-5 h-5 rounded-full bg-gray-300 dark:bg-gray-600 border border-white dark:border-gray-900" />
        </div>
      </div>
    </div>
  );
};

export default SubscriptionView;
