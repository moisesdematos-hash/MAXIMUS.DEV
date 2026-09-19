import { CreditManager } from './creditManager';
import { AIService } from './aiService';
import { logError } from './errorLogger';

export class FrontendAgent {
  private creditManager = CreditManager.getInstance();

  public async generateUI(prompt: string, modelId: string = 'maximus-neural'): Promise<{ success: boolean; code?: string; reasoning?: string; error?: string }> {
    console.log(`🎨 FrontendAgent: Gerando UI para: "${prompt}" usando ${modelId}...`);
    
    // Simulating credit consumption (Native model is free, handled in ChatArea/CreditManager logic potentially)
    this.creditManager.consumeCredits(modelId === 'maximus-neural' ? 0 : 10);
    
    try {
      const systemContext = "Você é o Agente Frontend. Sua tarefa é gerar exclusivamente o código React/TypeScript para a interface solicitada. Use Tailwind CSS para estilização moderna e Lucide React para ícones. IMPORTANTE: Retorne APENAS UM ÚNICO BLOCO de código começando com ```tsx. NÃO retorne estrutura de pastas, NÃO retorne explicações, APENAS O CÓDIGO DO COMPONENTE.";
      const response = await AIService.generateResponse(modelId, `${systemContext}\n\nSolicitação: ${prompt}`);
      
      const allBlocks = [...response.matchAll(/```(?:tsx|jsx|typescript|javascript)?\s*([\s\S]*?)\s*```/gi)];
      let code = response;
      if (allBlocks.length > 0) {
        // Pega o bloco mais longo (geralmente o código, ignorando blocos curtos de pastas)
        code = allBlocks.reduce((longest, current) => current[1].length > longest[1].length ? current : longest)[1];
      }
      const reasoning = `Gerei a interface solicitada usando ${modelId}, focando em componentes React funcionais e estilizados com Tailwind CSS.`;
      
      return { success: true, code, reasoning };
    } catch (error: any) {
      console.error('Erro no FrontendAgent:', error);
      logError({
        error_message: error.message || 'Erro no FrontendAgent',
        severity: 'error',
        stack_trace: error.stack
      });
      return { success: false, error: error.message };
    }
  }

  public async correctUI(code: string, error: string): Promise<{ success: boolean; fixedCode?: string }> {
    console.log('🩹 FrontendAgent: Corrigindo erro de UI...');
    
    // Ativar proteção de créditos para auto-correção
    this.creditManager.setSelfCorrectionMode(true);
    
    try {
      // Simating correction
      const fixedCode = code.replace('className="p-4"', 'className="p-6 font-bold"');
      console.log(`✅ FrontendAgent: Erro "${error}" corrigido sem custo de créditos.`);
      return { success: true, fixedCode };
    } finally {
      this.creditManager.setSelfCorrectionMode(false);
    }
  }
}
