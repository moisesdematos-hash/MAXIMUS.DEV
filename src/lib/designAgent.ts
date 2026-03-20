export interface DesignSuggestion {
  id: string;
  category: 'color' | 'typography' | 'layout' | 'accessibility';
  title: string;
  recommendation: string;
  beforeValue?: string;
  afterValue: string;
  reasoning: string;
}

export class DesignAgent {
  private static instance: DesignAgent;

  private constructor() {}

  public static getInstance(): DesignAgent {
    if (!DesignAgent.instance) {
      DesignAgent.instance = new DesignAgent();
    }
    return DesignAgent.instance;
  }

  public async auditDesign(componentCode: string): Promise<DesignSuggestion[]> {
    console.log("🎨 DesignAgent: Pilotando decisões estéticas...");
    await new Promise(resolve => setTimeout(resolve, 2500));

    return [
      {
        id: 'd1',
        category: 'color',
        title: 'Contraste de Botão Primário',
        recommendation: 'Aumentar contraste do texto sobre o fundo azul.',
        beforeValue: '#3B82F6',
        afterValue: '#2563EB',
        reasoning: 'Melhora a legibilidade em conformidade com WCAG 2.1.'
      },
      {
        id: 'd2',
        category: 'layout',
        title: 'Espaçamento de Cards',
        recommendation: 'Aumentar gap entre itens do marketplace.',
        afterValue: 'gap-8',
        reasoning: 'Cria uma hierarquia visual mais limpa e moderna (Glassmorphism style).'
      },
      {
        id: 'd3',
        category: 'typography',
        title: 'Legibilidade de Títulos',
        recommendation: 'Usar "Inter" com peso semi-bold para títulos H2.',
        afterValue: 'font-semibold tracking-tight',
        reasoning: 'Transmite uma sensação mais premium e técnica.'
      }
    ];
  }
}
