export interface FileContext {
  name: string;
  content: string;
  type: string;
  size: number;
}

export class FileProcessor {
  /**
   * Lê uma lista de arquivos e retorna um resumo textual para a IA.
   */
  public static async processFiles(files: File[] | FileList): Promise<FileContext[]> {
    const fileArray = Array.from(files);
    const results: FileContext[] = [];

    for (const file of fileArray) {
      try {
        // Ignorar binários pesados (imagens, executáveis) para não estourar o contexto
        if (this.isBinary(file)) {
          results.push({
            name: file.name,
            content: `[Arquivo Binário - ${file.size} bytes]`,
            type: 'binary',
            size: file.size
          });
          continue;
        }

        const text = await this.readFileAsText(file);
        results.push({
          name: file.name,
          content: text,
          type: 'text',
          size: file.size
        });
      } catch (error) {
        console.error(`Erro ao processar arquivo ${file.name}:`, error);
      }
    }

    return results;
  }

  private static readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }

  private static isBinary(file: File): boolean {
    const binaryExtensions = ['.zip', '.png', '.jpg', '.jpeg', '.gif', '.pdf', '.exe', '.dll', '.so', '.dylib'];
    return binaryExtensions.some(ext => file.name.toLowerCase().endsWith(ext)) || 
           file.type.startsWith('image/') || 
           file.type.startsWith('video/') || 
           file.type.indexOf('zip') !== -1;
  }

  public static formatForAI(contexts: FileContext[]): string {
    if (contexts.length === 0) return '';

    let formatted = "\n\n--- INÍCIO DOS ARQUIVOS ANEXADOS ---\n";
    contexts.forEach(ctx => {
      formatted += `\nARQUIVO: ${ctx.name}\nCONTEÚDO:\n${ctx.content}\n----------------------------\n`;
    });
    formatted += "--- FIM DOS ARQUIVOS ANEXADOS ---\n";

    return formatted;
  }

  /**
   * Simula a "extração" de um ZIP se necessário (exibe aviso no log)
   */
  public static needsUnzip(files: File[] | FileList): boolean {
    return Array.from(files).some(f => f.name.toLowerCase().endsWith('.zip'));
  }
}
