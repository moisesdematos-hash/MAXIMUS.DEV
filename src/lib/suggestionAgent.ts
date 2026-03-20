export interface Suggestion {
  id: string;
  type: 'feature' | 'refactor' | 'security' | 'optimization';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  codeSnippet?: string;
  actionLabel: string;
}

export class SuggestionAgent {
  private static instance: SuggestionAgent;

  private constructor() {}

  public static getInstance(): SuggestionAgent {
    if (!SuggestionAgent.instance) {
      SuggestionAgent.instance = new SuggestionAgent();
    }
    return SuggestionAgent.instance;
  }

  /**
   * Analisa o contexto e gera sugestões proativas
   */
  public async generateSuggestions(projectContext: string): Promise<Suggestion[]> {
    console.log("🧠 SuggestionAgent: Analisando projeto por oportunidades...");
    
    // Simulação de IA analisando o contexto
    await new Promise(resolve => setTimeout(resolve, 2000));

    const suggestions: Suggestion[] = [
      {
        id: 's1',
        type: 'optimization',
        title: 'Memoização de Componentes Pesados',
        description: 'Detectamos que o TopBar está re-renderizando com frequência. Use React.memo para economizar processamento.',
        impact: 'medium',
        actionLabel: 'Otimizar Agora'
      },
      {
        id: 's2',
        type: 'security',
        title: 'Proteção de Rota Admin',
        description: 'Sua rota /admin não possui middleware de autenticação. Recomendamos adicionar um guard do Supabase.',
        impact: 'high',
        actionLabel: 'Corrigir Vulnerabilidade'
      },
      {
        id: 's3',
        type: 'feature',
        title: 'Modo Offline (PWA)',
        description: 'Seu projeto parece um dashboard. Adicionar suporte a PWA aumentaria o engajamento dos usuários.',
        impact: 'low',
        actionLabel: 'Adicionar Manifest'
      },
      {
        id: 's5',
        type: 'optimization',
        title: 'Lazy Loading de Rotas',
        description: 'Seu bundle principal está ficando grande. Use React.lazy para carregar páginas apenas quando necessário.',
        impact: 'high',
        actionLabel: 'Otimizar Bundle'
      },
      {
        id: 's6',
        type: 'security',
        title: 'Headers de Segurança (CSP)',
        description: 'Falta uma Content Security Policy. Previna ataques XSS adicionando os headers corretos.',
        impact: 'medium',
        actionLabel: 'Gerar CSP'
      }
    ];

    // Filtragem baseada no contexto (exemplo simples)
    if (projectContext.toLowerCase().includes('auth')) {
      suggestions.push({
        id: 's4',
        type: 'refactor',
        title: 'Centralizar Hooks de Auth',
        description: 'Encontramos lógica de login duplicada. Mova para um useAuth custom hook.',
        impact: 'medium',
        actionLabel: 'Refatorar'
      });
    }

    return suggestions;
  }
}
