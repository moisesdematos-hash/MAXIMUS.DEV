export class ResearchAgent {
  public async searchWeb(query: string): Promise<string> {
    try {
      console.log(`[ResearchAgent] Iniciando busca web para: "${query}"`);
      // Usa um proxy CORS (allorigins) para fazer a requisição ao DuckDuckGo Lite
      const searchParams = new URLSearchParams({ q: query });
      const url = `https://html.duckduckgo.com/html/?${searchParams.toString()}`;
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error('Falha no proxy CORS');
      
      const data = await response.json();
      if (!data.contents) return '';
      
      // Converte o HTML para texto usando DOMParser nativo do navegador
      const parser = new DOMParser();
      const doc = parser.parseFromString(data.contents, 'text/html');
      
      // Pega os snippets de resultados (a classe do DDG Lite é .result__snippet)
      const results = Array.from(doc.querySelectorAll('.result__snippet'))
        .map(el => el.textContent?.trim() || '')
        .filter(text => text.length > 0)
        .slice(0, 4); // Pega os top 4 resultados
        
      if (results.length === 0) {
        return '';
      }
      
      const formattedContext = `### DADOS RECENTES OBTIDOS DA WEB (TEMPO REAL):\n${results.map((r, i) => `${i+1}. ${r}`).join('\n')}`;
      console.log('[ResearchAgent] Resultados obtidos com sucesso');
      return formattedContext;
      
    } catch (error) {
      console.warn('[ResearchAgent] Falha na pesquisa web:', error);
      return ''; // Retorna string vazia caso a pesquisa falhe para não quebrar a orquestração
    }
  }
}
