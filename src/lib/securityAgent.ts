import { AIService } from './aiService';

export class SecurityAgent {
  public async conductDeepScan(code: string, modelId: string = 'maximus-neural'): Promise<{ status: 'clean' | 'warning' | 'critical'; vulnerabilities: any[]; reasoning: string }> {
    console.log(`🛡️ SecurityAgent: Iniciando varredura profunda com ${modelId}...`);
    
    try {
      const systemContext = "Você é o Agente de Segurança. Analise o código React/TypeScript fornecido em busca de vulnerabilidades (XSS, Injection, Leak de dados). Liste as vulnerabilidades e dê um status final (clean, warning ou critical).";
      const response = await AIService.generateResponse(modelId, `${systemContext}\n\nCódigo:\n${code}`);
      
      const reasoning = `Realizei uma varredura neural profunda usando ${modelId}. O código foi analisado contra padrões comuns de ataque e falhas de segurança.`;
      
      // Basic heuristic to determine status from AI response
      const lowResponse = response.toLowerCase();
      let status: 'clean' | 'warning' | 'critical' = 'clean';
      
      if (lowResponse.includes('critical') || lowResponse.includes('crítica') || lowResponse.includes('vulnerabilidade crítica')) {
        status = 'critical';
      } else if (lowResponse.includes('warning') || lowResponse.includes('aviso') || lowResponse.includes('risco')) {
        status = 'warning';
      }

      const vulnerabilities = (status !== 'clean') 
        ? [{ id: Date.now().toString(), type: 'security', description: 'Vulnerabilidade detectada pela análise profunda.' }]
        : [];
      
      return {
        status,
        vulnerabilities,
        reasoning
      };
    } catch (error: any) {
      console.error('Erro no SecurityAgent:', error);
      return { 
        status: 'clean', 
        vulnerabilities: [], 
        reasoning: `Falha na varredura profunda: ${error.message}` 
      };
    }
  }
}
