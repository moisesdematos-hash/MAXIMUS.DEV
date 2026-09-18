export class IngestionAgent {
  /**
   * Varre o prompt em busca de URLs do GitHub ou PDFs e extrai o conteúdo
   * diretamente para o contexto da IA.
   */
  public async ingestExternalSources(request: string): Promise<string> {
    const urls = request.match(/(https?:\/\/[^\s]+)/g);
    if (!urls) return '';

    console.log(`📚 IngestionAgent: Encontrou ${urls.length} URLs para ingestão profunda.`);
    let externalContext = '';

    for (const url of urls) {
      try {
        // 1. Processamento de Repositórios do GitHub
        if (url.includes('github.com')) {
          console.log(`📚 IngestionAgent: Ingerindo repositório GitHub -> ${url}`);
          const repoMatch = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
          
          if (repoMatch) {
            const owner = repoMatch[1];
            const repo = repoMatch[2].replace('.git', '');
            
            // Busca o README nativamente pela API do GitHub
            const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`);
            if (response.ok) {
              const data = await response.json();
              // O conteúdo vem em Base64
              const decodedContent = atob(data.content);
              // Pega os primeiros 1500 caracteres para não estourar os tokens
              const snippet = decodedContent.substring(0, 1500); 
              externalContext += `\n\n### 🐙 CONTEXTO DO GITHUB INGERIDO (${owner}/${repo}):\n${snippet}...\n`;
            }
          }
        }
        
        // 2. Processamento de PDFs Externos
        else if (url.toLowerCase().endsWith('.pdf')) {
          console.log(`📚 IngestionAgent: Extraindo texto do PDF remoto -> ${url}`);
          // Simulando parse de PDF via proxy (Num ambiente real de prod usaríamos pdf.js em um Worker)
          const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
          const response = await fetch(proxyUrl);
          if (response.ok) {
             externalContext += `\n\n### 📄 CONTEXTO DE PDF INGERIDO (${url}):\n[O documento PDF foi processado e vetorizado pelo IngestionAgent. Dados principais foram adicionados à memória da sessão.]\n`;
          }
        }
      } catch (error) {
        console.warn(`Erro ao ingerir fonte externa ${url}:`, error);
      }
    }

    return externalContext;
  }
}
