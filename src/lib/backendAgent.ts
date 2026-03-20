import { CreditManager } from './creditManager';

export class BackendAgent {
  private creditManager = CreditManager.getInstance();

  public async generateAPI(schema: string): Promise<{ success: boolean; code?: string; reasoning?: string; error?: string }> {
    console.log(`⚙️ BackendAgent: Gerando API para o schema: "${schema}"...`);
    
    // Simulating credit consumption
    this.creditManager.consumeCredits(15);
    
    const code = `export const GET = async () => {\n  return new Response(JSON.stringify({ message: "API for ${schema} active" }));\n};`;
    const reasoning = `Desenvolvi uma API RESTful mínima e eficiente para o schema "${schema}", priorizando a rapidez de resposta e o padrão de Response.json.`;
    
    return { success: true, code, reasoning };
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
