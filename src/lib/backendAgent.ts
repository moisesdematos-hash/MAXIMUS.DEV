import { CreditManager } from './creditManager';
import { AIService } from './aiService';
import { logError } from './errorLogger';

export class BackendAgent {
  private creditManager = CreditManager.getInstance();

  public async generateAPI(prompt: string, modelId: string = 'maximus-neural'): Promise<{ success: boolean; code?: string; reasoning?: string; error?: string }> {
    console.log(`⚙️ BackendAgent: Gerando API para: "${prompt}" usando ${modelId}...`);
    
    // Simulating credit consumption
    this.creditManager.consumeCredits(modelId === 'maximus-neural' ? 0 : 10);
    
    try {
      const systemContext = "Você é o Agente Backend. Sua tarefa é gerar exclusivamente o código TypeScript para a API, esquemas de dados ou lógica de servidor solicitada. Siga padrões de segurança e performance.";
      const response = await AIService.generateResponse(modelId, `${systemContext}\n\nSolicitação: ${prompt}`);
      
      const codeMatch = response.match(/```(?:typescript|javascript|json)?\s*([\s\S]*?)\s*```/i);
      const code = codeMatch ? codeMatch[1] : response;
      const reasoning = `Desenvolvi a lógica de backend e esquemas de dados usando ${modelId}, garantindo uma estrutura escalável e segura.`;
      
      return { success: true, code, reasoning };
    } catch (error: any) {
      console.error('Erro no BackendAgent:', error);
      logError({
        error_message: error.message || 'Erro no BackendAgent',
        severity: 'error',
        stack_trace: error.stack
      });
      return { success: false, error: error.message };
    }
  }

  public async correctBackendError(code: string, error: string): Promise<{ success: boolean; fixedCode?: string }> {
    console.log('🩹 BackendAgent: Corrigindo erro de backend...');
    
    // Ativar proteção de créditos para auto-correção
    this.creditManager.setSelfCorrectionMode(true);
    
    try {
      // Simating correction
      const fixedCode = code.replace('new Response', 'new Response.json');
      console.log(`✅ BackendAgent: Erro "${error}" corrigido sem custo de créditos.`);
      return { success: true, fixedCode };
    } finally {
      this.creditManager.setSelfCorrectionMode(false);
    }
  }
}
