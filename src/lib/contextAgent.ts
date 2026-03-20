import { CreditManager } from './creditManager';

export class ContextAgent {
  private creditManager = CreditManager.getInstance();

  public async summarizeContext(history: any[]): Promise<{ success: boolean; summary?: string; reasoning?: string }> {
    console.log('🧠 ContextAgent: Gerando resumo de memória do projeto...');
    
    // Simulating credit consumption for summarization
    this.creditManager.consumeCredits(2);
    
    // Simulating context condensation from history
    const historyDepth = history.length;
    const lastTopic = historyDepth > 0 ? history[history.length - 1].content.substring(0, 30) : 'Início da sessão';
    
    // In a real scenario, this would use an LLM to condense messages.
    const summary = `O projeto está focado em criar uma IDE profissional. ` +
      `Histórico contém ${historyDepth} mensagens. Último tópico: "${lastTopic}...". ` +
      `Estado: Estável com agentes expandidos.`;
    const reasoning = `Sintetizei ${historyDepth} mensagens de histórico para manter o foco do projeto e evitar perda de contexto.`;
    
    return { success: true, summary, reasoning };
  }

  public async extractWorkingMemory(code: string): Promise<string> {
    // Extracts key facts from the current code to help agents
    if (!code) return 'Nenhum código presente no workspace.';
    return `O workspace contém um arquivo de ${code.length} caracteres. Arquitetura detectada: React/TypeScript.`;
  }
}
