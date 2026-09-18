export class GrepAgent {
  /**
   * Realiza uma busca profunda no código-fonte (simulando grep/fd)
   * e retorna as linhas com o contexto (-2 e +2 linhas) para a IA.
   */
  public searchCodebase(query: string, codebase: string): string {
    try {
      console.log(`🔍 GrepAgent: Escaneando codebase por "${query}"...`);
      const lines = codebase.split('\n');
      const results: string[] = [];
      const regex = new RegExp(query, 'i');
      
      let matchCount = 0;

      for (let i = 0; i < lines.length; i++) {
        if (regex.test(lines[i])) {
          matchCount++;
          // Limite de matches para não sobrecarregar o token limit
          if (matchCount > 10) {
            results.push(`\n... Mais resultados ocultados (muitas correspondências para "${query}").`);
            break;
          }

          const start = Math.max(0, i - 2);
          const end = Math.min(lines.length - 1, i + 2);
          
          results.push(`\n📍 Match na linha ${i + 1}:`);
          for (let j = start; j <= end; j++) {
            const prefix = j === i ? '>> ' : '   ';
            results.push(`${prefix}${j + 1}: ${lines[j]}`);
          }
        }
      }
      
      if (results.length === 0) {
        return `Nenhum resultado encontrado para "${query}" no código atual.`;
      }
      
      const formatted = `### 🔍 RESULTADOS DA BUSCA PROFUNDA (Grep: "${query}")\n${results.join('\n')}`;
      console.log(`✅ GrepAgent: Encontrados ${matchCount} matches.`);
      return formatted;
      
    } catch (error) {
      console.warn('Falha na busca Grep:', error);
      return '';
    }
  }

  /**
   * Identifica se a requisição do usuário exige uma varredura no código.
   */
  public extractSearchQuery(userRequest: string): string | null {
    // Procura por padrões como: grep "termo", procure por "termo", onde está "termo"
    const match = userRequest.match(/(?:grep|busque por|buscar por|encontre|encontrar|onde est[aá]|pesquise por)\s+["']?([^"'\.\?]+)["']?/i);
    if (match && match[1]) {
      return match[1].trim();
    }
    return null;
  }
}
