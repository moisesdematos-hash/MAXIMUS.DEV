import { AIService } from './aiService';

export class DocAgent {
  public async generateDocumentation(code: string, modelId: string = 'maximus-neural'): Promise<{ success: boolean; documentation?: string; reasoning?: string }> {
    console.log(`📝 DocAgent: Gerando documentação com ${modelId}...`);
    
    try {
      const systemContext = "Você é o Agente de Documentação. Sua tarefa é gerar exclusivamente documentação técnica (JSDoc, README ou Comentários) para o código fornecido.";
      const response = await AIService.generateResponse(modelId, `${systemContext}\n\nCódigo:\n${code}`);
      
      const reasoning = `Documentação técnica gerada automaticamente usando ${modelId}, garantindo clareza para futuros desenvolvedores.`;
      return { success: true, documentation: response, reasoning };
    } catch (error) {
      console.error('Erro no DocAgent:', error);
      return { success: false };
    }
  }
}
