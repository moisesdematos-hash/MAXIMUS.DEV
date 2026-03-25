import { AIService } from './aiService';

export class ContextAgent {
  public async summarizeContext(history: any[], modelId: string = 'maximus-neural'): Promise<{ summary: string; reasoning: string }> {
    console.log(`🧠 ContextAgent: Resumindo contexto histórico com ${modelId}...`);
    
    try {
      if (!history || history.length === 0) {
        return { 
          summary: "Novo contexto de projeto iniciado.", 
          reasoning: "Sem histórico para resumir." 
        };
      }

      const historyText = history.map(m => `${m.type || m.role}: ${m.content}`).join('\n');
      const systemContext = "Você é o Agente de Contexto. Resuma o histórico de mensagens abaixo de forma concisa para que outro agente possa entender o estado atual do projeto.";
      const response = await AIService.generateResponse(modelId, `${systemContext}\n\nHistórico:\n${historyText}`);
      
      return {
        summary: response,
        reasoning: `Contexto extraído e resumido com precisão usando ${modelId}.`
      };
    } catch (error: any) {
      console.error('Erro no ContextAgent:', error);
      return { 
        summary: 'Contexto não disponível.', 
        reasoning: `Erro ao processar histórico: ${error.message}` 
      };
    }
  }
}
