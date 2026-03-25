import { seoService } from './seoService';

export interface VentureStrategy {
  targetMarket: string;
  revenueModel: string;
  competitors: string[];
  pitch: string;
  marketingPlan: string[];
}

export class VentureAgent {
  private static instance: VentureAgent;

  private constructor() {}

  public static getInstance(): VentureAgent {
    if (!VentureAgent.instance) {
      VentureAgent.instance = new VentureAgent();
    }
    return VentureAgent.instance;
  }

  /**
   * Analisa o projeto e cria um plano de negócios automático
   */
  public async analyzeVenture(codebase: string): Promise<VentureStrategy> {
    console.log("💼 VentureAgent: Gerando estratégia de mercado...");
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Determinar modelo baseado na complexidade detectada
    const hasAgents = codebase.includes('Agent');
    const hasAuth = codebase.includes('AuthContext');

    const strategy = {
      targetMarket: hasAgents ? 'B2B Enterprise AI' : 'SaaS Developers',
      revenueModel: hasAuth ? 'SaaS Subscription (Tiered)' : 'Open Core / License',
      competitors: ['Vercel', 'Abacus.AI', 'Cursor'],
      pitch: "A plataforma definitiva para engenharia autônoma de software com IA multi-agente e viagem no tempo neural.",
      marketingPlan: [
        "Lançamento no Product Hunt (Golden Hour)",
        "Campanha de marketing viral via Neural SEO",
        "Parcerias estratégicas com empresas de Cloud"
      ]
    };

    // Update SEO dynamically
    seoService.updateMetadata({
      title: strategy.targetMarket,
      description: strategy.pitch,
      keywords: this.generateSEOTags(strategy.pitch).join(', '),
      ogTitle: `Maximus DEV: ${strategy.targetMarket}`,
      ogDescription: strategy.pitch
    });

    return strategy;
  }

  public generateSEOTags(_description: string): string[] {
    return [
      'autonomous-dev',
      'next-gen-ide',
      'ai-multi-agent',
      'software-evolution',
      'neural-engineering'
    ];
  }
}
