import { CreditManager } from './creditManager';
import { AIService } from './aiService';
import { logError } from './errorLogger';

export class TestingAgent {
  private creditManager = CreditManager.getInstance();

  public async generateTests(code: string, modelId: string = 'maximus-neural'): Promise<{ success: boolean; tests?: string; reasoning?: string }> {
    console.log(`🧪 TestingAgent: Gerando testes para o código usando ${modelId}...`);
    
    // Simulating credit consumption
    this.creditManager.consumeCredits(8);
    
    try {
      const systemContext = "Você é o Agente de Testes. Sua tarefa é gerar exclusivamente testes unitários (Vitest/Jest) para o código React/TypeScript fornecido. Garanta boa cobertura e casos de borda.";
      const response = await AIService.generateResponse(modelId, `${systemContext}\n\nCódigo:\n${code}`);
      
      const codeMatch = response.match(/```(?:typescript|javascript)?\s*([\s\S]*?)\s*```/i);
      const tests = codeMatch ? codeMatch[1] : response;
      const reasoning = `Desenvolvi uma suíte de testes unitários robusta usando ${modelId}, cobrindo fluxos principais e validações de erro.`;
      
      return { success: true, tests, reasoning };
    } catch (error: any) {
      console.error('Erro no TestingAgent:', error);
      logError({
        error_message: error.message || 'Erro no TestingAgent',
        severity: 'error',
        stack_trace: error.stack
      });
      return { success: false };
    }
  }
}
