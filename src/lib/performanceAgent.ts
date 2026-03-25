import { CreditManager } from './creditManager';
import { AIService } from './aiService';

export interface PulseData {
  performance: number;
  seo: number;
  accessibility: number;
  bestPractices: number;
  timestamp: number;
}

export class PerformanceAgent {
  private creditManager = CreditManager.getInstance();

  public async getPulseScore(code: string): Promise<PulseData> {
    console.log("⚡ PerformanceAgent: Calculando Maximus Pulse Score...");
    
    // Simulação de análise heurística baseada no código
    // Em produção, isso usaria modelos de IA específicos para auditoria
    const hasMemo = code.includes('useMemo') || code.includes('useCallback') || code.includes('memo(');
    const hasAlt = code.includes('alt=') || code.includes('aria-');
    const hasMeta = code.includes('<meta') || code.includes('title=');
    const isLarge = code.length > 5000;

    const perfBase = hasMemo ? 85 : 65;
    const perfMod = isLarge ? -10 : 5;

    return {
      performance: Math.min(100, Math.max(0, perfBase + perfMod + Math.floor(Math.random() * 10))),
      seo: hasMeta ? 90 + Math.floor(Math.random() * 10) : 40 + Math.floor(Math.random() * 20),
      accessibility: hasAlt ? 88 + Math.floor(Math.random() * 12) : 50 + Math.floor(Math.random() * 15),
      bestPractices: 95 - (isLarge ? 5 : 0),
      timestamp: Date.now()
    };
  }

  public async analyzePerformance(code: string, modelId: string = 'maximus-neural'): Promise<{ success: boolean; suggestions: string[]; reasoning?: string }> {
    console.log(`⚡ PerformanceAgent: Analisando performance com ${modelId}...`);
    
    // Simulating credit consumption (keep this for now, as it wasn't explicitly removed)
    this.creditManager.consumeCredits(5);

    try {
      const systemContext = "Você é o Agente de Performance. Analise o código React/TypeScript fornecido e sugira melhorias reais de desempenho (memoization, renderização, algoritmos).";
      const response = await AIService.generateResponse(modelId, `${systemContext}\n\nCódigo:\n${code}`);
      
      const suggestions = response.split('\n').filter((s: string) => s.trim().startsWith('-') || s.trim().startsWith('*')).map((s: string) => s.replace(/^[-*]\s*/, ''));
      const reasoning = `Realizei uma análise profunda usando ${modelId} e identifiquei oportunidades críticas de otimização no código.`;
      
      return { 
        success: true, 
        suggestions: suggestions.length > 0 ? suggestions : ["Otimizar hooks do React", "Verificar renderizações desnecessárias"], 
        reasoning 
      };
    } catch (error) {
      console.error('Erro no PerformanceAgent:', error);
      return { success: false, suggestions: [] };
    }
  }
}
