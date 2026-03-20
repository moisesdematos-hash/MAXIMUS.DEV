import { CreditManager } from './creditManager';

export class FrontendAgent {
  private creditManager = CreditManager.getInstance();

  public async generateUI(prompt: string): Promise<{ success: boolean; code?: string; reasoning?: string; error?: string }> {
    console.log(`🎨 FrontendAgent: Gerando UI para: "${prompt}"...`);
    
    // Simulating credit consumption
    this.creditManager.consumeCredits(10);
    
    const code = `<div className="p-4 bg-blue-500 text-white rounded shadow-lg animate-fade-in">\n  <h1>Generated UI for: ${prompt}</h1>\n</div>`;
    const reasoning = `Decidi usar um container com azul de destaque e animação de fade-in para garantir uma primeira impressão moderna, seguindo o prompt do usuário.`;
    
    return { success: true, code, reasoning };
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
