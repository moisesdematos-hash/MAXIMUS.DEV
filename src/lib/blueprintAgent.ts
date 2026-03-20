export interface BlueprintResult {
  code: string;
  description: string;
  files: { path: string; content: string }[];
  suggestedPrompts: string[];
}

export class BlueprintAgent {
  public async getBlueprintInitData(blueprintId: string): Promise<BlueprintResult> {
    switch (blueprintId) {
      case 'ecommerce-pro':
        return {
          description: 'E-commerce de alta performance com integração nativa ao Stripe e Supabase.',
          code: this.getEcommerceCode(),
          files: [
            { path: 'src/components/ProductCard.tsx', content: 'export const ProductCard = () => { ... }' },
            { path: 'src/lib/stripe.ts', content: 'import Stripe from "stripe"; ...' }
          ],
          suggestedPrompts: [
            'Adicione um carrinho de compras persistente',
            'Configure a webhooks do Stripe para pagamentos pagos',
            'Crie uma página de detalhes do produto com galeria de imagens'
          ]
        };
      case 'saas-moderno':
        return {
          description: 'Plataforma SaaS com multi-tenancy, dashboards complexos e sistema de permissões.',
          code: this.getSaasCode(),
          files: [
            { path: 'src/components/Dashboard.tsx', content: 'export const Dashboard = () => { ... }' },
            { path: 'src/lib/auth.ts', content: 'export const checkPermissions = () => { ... }' }
          ],
          suggestedPrompts: [
            'Implemente assinatura de planos via Stripe',
            'Crie um gráfico de métricas de uso com Recharts',
            'Adicione convites para novos membros da equipe'
          ]
        };
      case 'fintech-ai':
        return {
          description: 'Gestor financeiro inteligente com análise preditiva e gráficos em tempo real.',
          code: this.getFintechCode(),
          files: [
            { path: 'src/components/TransactionList.tsx', content: 'export const TransactionList = () => { ... }' },
            { path: 'src/lib/aiInsights.ts', content: 'export const getFinancialAdvice = () => { ... }' }
          ],
          suggestedPrompts: [
            'Conecte com a API do Plaid para ver transações reais',
            'Crie um modelo de previsão de gastos para o próximo mês',
            'Adicione uma visualização de patrimônio líquido'
          ]
        };
      default:
        return {
          description: 'Projeto React padrão otimizado pelo MAXIMUS.DEV',
          code: '// Iniciando projeto padrão...',
          files: [],
          suggestedPrompts: ['O que vamos construir hoje?']
        };
    }
  }

  private getEcommerceCode(): string {
    return `import React from 'react';
import { ShoppingBag, Star, ShieldCheck } from 'lucide-react';

const EcommerceBlueprint = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-bold">MaxCommerce Pro</h1>
        <div className="flex space-x-4">
          <button className="p-2 bg-white rounded-full shadow"><ShoppingBag /></button>
        </div>
      </header>
      
      <main className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Boilerplate de Produtos */}
        {[1,2,3].map(i => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="aspect-video bg-gray-200 rounded-xl mb-4"></div>
            <h3 className="font-bold text-lg mb-2">Produto Premium #{i}</h3>
            <div className="flex justify-between items-center">
              <span className="text-blue-600 font-bold">R$ 299,00</span>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">Comprar</button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default EcommerceBlueprint;`;
  }

  private getSaasCode(): string {
    return `import React from 'react';
import { LayoutDashboard, Users, Settings, BarChart3 } from 'lucide-react';

const SaasBlueprint = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-slate-900 text-white p-6">
        <div className="mb-10 text-xl font-bold">SaaS OS</div>
        <nav className="space-y-4">
          <div className="flex items-center space-x-3 text-blue-400"><LayoutDashboard size={20}/> <span>Dashboard</span></div>
          <div className="flex items-center space-x-3 text-slate-400"><Users size={20}/> <span>Clientes</span></div>
          <div className="flex items-center space-x-3 text-slate-400"><BarChart3 size={20}/> <span>Relatórios</span></div>
        </nav>
      </aside>
      
      <main className="flex-1 p-10 overflow-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Bem-vindo ao Dashboard</h2>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-xl shadow-lg">Novo Projeto</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm">
              <p className="text-slate-500 text-sm">Métrica #{i}</p>
              <p className="text-2xl font-bold">1,234</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default SaasBlueprint;`;
  }

  private getFintechCode(): string {
    return `import React from 'react';
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const FintechBlueprint = () => {
  return (
    <div className="p-8 bg-zinc-950 min-h-screen text-white">
      <div className="max-w-4xl mx-auto">
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl mb-8">
          <p className="text-zinc-400 text-sm mb-2">Saldo Total</p>
          <h1 className="text-5xl font-bold mb-6">R$ 45.230,80</h1>
          <div className="flex space-x-4">
            <button className="flex-1 bg-white text-black py-4 rounded-2xl font-bold flex items-center justify-center">
              <ArrowUpRight className="mr-2" size={20}/> Enviar
            </button>
            <button className="flex-1 bg-zinc-800 text-white py-4 rounded-2xl font-bold flex items-center justify-center">
              <ArrowDownRight className="mr-2" size={20}/> Receber
            </button>
          </div>
        </div>
        
        <h2 className="text-xl font-bold mb-4">Atividade Recente</h2>
        <div className="space-y-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="flex justify-between items-center p-4 bg-zinc-900 rounded-2xl border border-zinc-800">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center mr-4">
                  <Wallet className="text-zinc-400" size={18}/>
                </div>
                <div>
                  <p className="font-bold">Pagamento Recebido #{i}</p>
                  <p className="text-xs text-zinc-500">Hoje, 14:30</p>
                </div>
              </div>
              <span className="text-emerald-500 font-bold">+R$ 1.500,00</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FintechBlueprint;`;
  }
}
