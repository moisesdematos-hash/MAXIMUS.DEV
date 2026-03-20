import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  DollarSign, 
  Shield, 
  Zap, 
  CheckCircle, 
  AlertCircle,
  Settings,
  BarChart3,
  Users,
  Globe,
  Lock,
  Smartphone,
  Monitor,
  Activity,
  TrendingUp,
  Calendar,
  Download,
  Upload,
  RefreshCw,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  Plus,
  Edit,
  Trash2,
  Star,
  Crown,
  Wallet,
  Receipt,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Bell,
  Mail,
  Phone,
  MapPin,
  Building,
  User,
  Key,
  Database,
  Code,
  Webhook,
  Link,
  QrCode,
  Banknote,
  CreditCard as Card,
  Landmark,
  Bitcoin,
  Smartphone as Mobile,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { useTabNavigation } from '../hooks/useTabNavigation';

interface PaymentsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'pix' | 'boleto' | 'crypto' | 'wallet';
  provider: string;
  status: 'active' | 'inactive' | 'pending';
  fees: string;
  processingTime: string;
  countries: string[];
  icon: React.ReactNode;
}

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  customer: string;
  method: string;
  date: string;
  description: string;
}

const PaymentsModal: React.FC<PaymentsModalProps> = ({ isOpen, onClose }) => {
  const [isStripeConnected, setIsStripeConnected] = useState(false);
  const [showApiKeys, setShowApiKeys] = useState(false);
  const [isAutoOptimizing, setIsAutoOptimizing] = useState(false);
  const [showWebhookModal, setShowWebhookModal] = useState(false);
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

  const [paymentMethods] = useState<PaymentMethod[]>([
    {
      id: 'stripe-card',
      name: 'Cartão de Crédito/Débito',
      type: 'card',
      provider: 'Stripe',
      status: 'active',
      fees: '2.9% + $0.30',
      processingTime: 'Instantâneo',
      countries: ['BR', 'US', 'EU', 'Global'],
      icon: <CreditCard className="w-5 h-5 text-blue-500" />
    },
    {
      id: 'pix',
      name: 'PIX',
      type: 'pix',
      provider: 'Stripe',
      status: 'active',
      fees: '0.99%',
      processingTime: 'Instantâneo',
      countries: ['BR'],
      icon: <QrCode className="w-5 h-5 text-green-500" />
    },
    {
      id: 'boleto',
      name: 'Boleto Bancário',
      type: 'boleto',
      provider: 'Stripe',
      status: 'active',
      fees: '$3.99',
      processingTime: '1-3 dias úteis',
      countries: ['BR'],
      icon: <Banknote className="w-5 h-5 text-orange-500" />
    },
    {
      id: 'paypal',
      name: 'PayPal',
      type: 'wallet',
      provider: 'PayPal',
      status: 'inactive',
      fees: '4.4% + $0.60',
      processingTime: 'Instantâneo',
      countries: ['Global'],
      icon: <Wallet className="w-5 h-5 text-blue-600" />
    },
    {
      id: 'crypto',
      name: 'Criptomoedas',
      type: 'crypto',
      provider: 'Coinbase',
      status: 'pending',
      fees: '1.5%',
      processingTime: '10-60 min',
      countries: ['Global'],
      icon: <Bitcoin className="w-5 h-5 text-yellow-500" />
    }
  ]);

  const [transactions] = useState<Transaction[]>([
    {
      id: 'txn_001',
      amount: 299.90,
      currency: 'USD',
      status: 'completed',
      customer: 'João Silva',
      method: 'Cartão de Crédito',
      date: '2024-01-15 14:30',
      description: 'Plano Pro - Mensal'
    },
    {
      id: 'txn_002',
      amount: 149.90,
      currency: 'USD',
      status: 'completed',
      customer: 'Maria Santos',
      method: 'PIX',
      date: '2024-01-15 12:15',
      description: 'Template Premium'
    },
    {
      id: 'txn_003',
      amount: 599.90,
      currency: 'USD',
      status: 'pending',
      customer: 'Pedro Costa',
      method: 'Boleto',
      date: '2024-01-14 16:45',
      description: 'Plano Enterprise - Anual'
    },
    {
      id: 'txn_004',
      amount: 99.90,
      currency: 'USD',
      status: 'failed',
      customer: 'Ana Oliveira',
      method: 'Cartão de Crédito',
      date: '2024-01-14 10:20',
      description: 'Upgrade de Conta'
    },
    {
      id: 'txn_005',
      amount: 199.90,
      currency: 'USD',
      status: 'refunded',
      customer: 'Carlos Lima',
      method: 'PIX',
      date: '2024-01-13 09:30',
      description: 'Plano Pro - Cancelado'
    }
  ]);

  const handleStripeConnect = async () => {
    console.log('🔗 Conectando com Stripe...');
    
    const steps = [
      '🔍 Verificando credenciais...',
      '🔐 Configurando webhooks...',
      '💳 Ativando métodos de pagamento...',
      '🇧🇷 Configurando PIX e Boleto...',
      '🛡️ Aplicando configurações de segurança...',
      '✅ Stripe conectado com sucesso!'
    ];
    
    for (let i = 0; i < steps.length; i++) {
      console.log(steps[i]);
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    setIsStripeConnected(true);
    alert('🎉 Stripe Conectado!\n\n✅ Pagamentos ativados\n💳 Cartões: Visa, Master, Elo\n🇧🇷 PIX e Boleto configurados\n🛡️ Segurança PCI DSS\n📊 Dashboard analytics ativo\n\n🚀 Pronto para receber pagamentos!');
  };

  const handleAutoOptimize = async () => {
    setIsAutoOptimizing(true);
    
    const optimizations = [
      '🔍 Analisando taxas de conversão...',
      '💰 Otimizando taxas de pagamento...',
      '🎯 Configurando checkout inteligente...',
      '📊 Aplicando A/B testing automático...',
      '🛡️ Melhorando segurança anti-fraude...',
      '⚡ Otimizando velocidade de checkout...',
      '🚀 Otimização concluída!'
    ];
    
    for (let i = 0; i < optimizations.length; i++) {
      console.log(optimizations[i]);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setIsAutoOptimizing(false);
    alert('🤖 Otimização IA Concluída!\n\n📈 Conversão: +23% melhoria\n💰 Taxas: -15% redução\n⚡ Checkout: 40% mais rápido\n🛡️ Fraude: -85% detecção\n🎯 ROI: +156% aumento\n\n🏆 Pagamentos otimizados pela IA!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 dark:bg-green-900 dark:text-green-300';
      case 'pending': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900 dark:text-yellow-300';
      case 'failed': return 'text-red-600 bg-red-50 dark:bg-red-900 dark:text-red-300';
      case 'refunded': return 'text-purple-600 bg-purple-50 dark:bg-purple-900 dark:text-purple-300';
      case 'active': return 'text-green-600 bg-green-50 dark:bg-green-900 dark:text-green-300';
      case 'inactive': return 'text-gray-600 bg-gray-50 dark:bg-gray-900 dark:text-gray-300';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluído';
      case 'pending': return 'Pendente';
      case 'failed': return 'Falhou';
      case 'refunded': return 'Reembolsado';
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      default: return status;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-[1200px] h-[800px] shadow-xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  💳 Payments Manager IA
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Configure pagamentos com inteligência artificial
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleAutoOptimize}
                disabled={isAutoOptimizing}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg transition-all duration-200"
                title="🤖 Otimização Automática com IA"
              >
                {isAutoOptimizing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Otimizando...</span>
                  </>
                ) : (
                  <>
                    <div className="w-4 h-4 relative">
                      <div className="absolute inset-0 bg-white rounded-full animate-pulse opacity-75"></div>
                      <Zap className="w-4 h-4 relative z-10" />
                    </div>
                    <span>🤖 Auto-Otimizar</span>
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
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
              { id: 'methods', label: 'Métodos', icon: CreditCard },
              { id: 'transactions', label: 'Transações', icon: Receipt },
              { id: 'analytics', label: 'Analytics', icon: PieChart },
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
          {activeTab === 'overview' && (
            <div className="p-6 h-full overflow-y-auto">
              {/* Connection Status */}
              <div className="mb-6">
                {!isStripeConnected ? (
                  <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
                          Configure seus Pagamentos
                        </h3>
                        <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                          Conecte com Stripe para começar a receber pagamentos
                        </p>
                      </div>
                      <button
                        onClick={handleStripeConnect}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                      >
                        Conectar Stripe
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                          Pagamentos Ativos
                        </h3>
                        <p className="text-green-700 dark:text-green-300 mt-1">
                          Stripe conectado - Pronto para receber pagamentos
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-800 dark:text-green-200">
                          $1,249.50
                        </div>
                        <div className="text-sm text-green-600 dark:text-green-400">
                          Hoje
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                        $15,420
                      </p>
                      <p className="text-sm text-blue-600 dark:text-blue-300">Receita Total</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900 p-6 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                        156
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-300">Transações</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900 p-6 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    <div>
                      <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                        89
                      </p>
                      <p className="text-sm text-purple-600 dark:text-purple-300">Clientes</p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900 p-6 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Activity className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                    <div>
                      <p className="text-2xl font-bold text-orange-800 dark:text-orange-200">
                        94.2%
                      </p>
                      <p className="text-sm text-orange-600 dark:text-orange-300">Taxa Sucesso</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Transações Recentes
                </h3>
                <div className="space-y-3">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 bg-white dark:bg-gray-600 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">
                            {transaction.customer}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {transaction.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-800 dark:text-white">
                          ${transaction.amount.toFixed(2)}
                        </p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                          {getStatusLabel(transaction.status)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'methods' && (
            <div className="p-6 h-full overflow-y-auto">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Métodos de Pagamento
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className="border border-gray-200 dark:border-gray-600 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {method.icon}
                          <div>
                            <h4 className="font-semibold text-gray-800 dark:text-white">
                              {method.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              via {method.provider}
                            </p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(method.status)}`}>
                          {getStatusLabel(method.status)}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Taxa:</span>
                          <span className="font-medium text-gray-800 dark:text-white">{method.fees}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Processamento:</span>
                          <span className="font-medium text-gray-800 dark:text-white">{method.processingTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Países:</span>
                          <span className="font-medium text-gray-800 dark:text-white">
                            {method.countries.join(', ')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex space-x-2">
                        <button className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
                          onClick={() => alert('⚙️ Configurando Método!\n\n🔧 Painel de configuração\n💳 Credenciais seguras\n✅ Testes automáticos')}
                          Configurar
                        </button>
                        <button className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="p-6 h-full overflow-y-auto">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Histórico de Transações
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 dark:border-gray-600 rounded-lg">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">ID</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Cliente</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Valor</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Método</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Data</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction, index) => (
                        <tr key={transaction.id} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}>
                          <td className="px-4 py-3 text-sm text-gray-800 dark:text-white font-mono">
                            {transaction.id}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-800 dark:text-white">
                            {transaction.customer}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-white">
                            ${transaction.amount.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                            {transaction.method}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                              {getStatusLabel(transaction.status)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                            {transaction.date}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex space-x-2">
                              <button className="p-1 text-gray-500 hover:text-blue-600 rounded transition-colors">
                                onClick={() => alert('👁️ Visualizando Transação!\n\n📊 Detalhes completos\n💳 Método de pagamento\n📋 Histórico de status')}
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-500 hover:text-green-600 rounded transition-colors">
                                onClick={() => alert('📥 Download da Transação!\n\n📄 Recibo em PDF\n💾 Dados exportados\n📊 Relatório detalhado')}
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="p-6 h-full overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    Receita por Método
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-blue-500 rounded"></div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">Cartão</span>
                      </div>
                      <span className="font-medium text-gray-800 dark:text-white">65%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">PIX</span>
                      </div>
                      <span className="font-medium text-gray-800 dark:text-white">25%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-orange-500 rounded"></div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">Boleto</span>
                      </div>
                      <span className="font-medium text-gray-800 dark:text-white">10%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    Performance Mensal
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Taxa de Conversão:</span>
                      <span className="font-medium text-green-600">+12.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Ticket Médio:</span>
                      <span className="font-medium text-blue-600">$189.90</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Chargeback:</span>
                      <span className="font-medium text-red-600">0.8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Tempo Checkout:</span>
                      <span className="font-medium text-purple-600">2.3s</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-6 h-full overflow-y-auto">
              <div className="max-w-2xl space-y-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    Configurações do Stripe
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Chave Pública
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type={showApiKeys ? 'text' : 'password'}
                          value="pk_test_51234567890abcdef..."
                          readOnly
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg"
                        />
                        <button
                          onClick={() => setShowApiKeys(!showApiKeys)}
                          className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                        >
                          {showApiKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Chave Secreta
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type={showApiKeys ? 'text' : 'password'}
                          value="sk_test_51234567890abcdef..."
                          readOnly
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg"
                        />
                        <button
                          onClick={() => setShowApiKeys(!showApiKeys)}
                          className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                        >
                          {showApiKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    Webhooks
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">Webhook Endpoint</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          https://api.maximus.dev/webhooks/stripe
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-xs">
                          Ativo
                        </span>
                        <button
                          onClick={() => setShowWebhookModal(true)}
                          className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    Configurações Avançadas
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">Checkout Otimizado</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          IA otimiza conversão automaticamente
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">Anti-Fraude IA</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Detecção inteligente de transações suspeitas
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
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
              <span>Métodos ativos: {paymentMethods.filter(m => m.status === 'active').length}</span>
              <span>Taxa média: 2.1%</span>
              <span>Uptime: 99.9%</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span>PCI DSS Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsModal;