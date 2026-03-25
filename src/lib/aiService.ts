import { logError } from './errorLogger';

// Removed unused import

export interface AIProviderConfig {
  apiKey?: string;
  baseUrl?: string;
  organizationId?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export class AIService {
  private static getSystemPrompt(modelId: string): string {
    if (modelId === 'maximus-neural') {
      return `Você é a MAXIMUS Neural, a inteligência central e orquestradora do MAXIMUS.DEV.
Sua especialidade é arquitetura de software de alta fidelidade, geração de código limpo e coordenação de múltiplos agentes.
Siga rigorosamente os melhores padrões de Clean Code, SOLID e UX moderna.
Sempre responda em português, a menos que solicitado o contrário.`;
    }
    return "Você é um assistente de desenvolvimento sênior especializado em criar aplicações full-stack modernas.";
  }

  static async generateResponse(modelId: string, prompt: string, history: ChatMessage[] = []) {
    // Mapping models to providers
    const isAnthropic = modelId.startsWith('claude');
    const isGoogle = modelId.startsWith('gemini');
    const isOpenAI = modelId.startsWith('gpt') || modelId === 'maximus-neural';
    const isOllama = modelId === 'llama-3' || modelId === 'mistral-large'; // Assuming local for these in this context

    const systemPrompt = this.getSystemPrompt(modelId);
    
    try {
      if (isOpenAI) {
        return await this.callOpenAI(modelId === 'maximus-neural' ? 'gpt-4o' : modelId, prompt, history, systemPrompt);
      } else if (isAnthropic) {
        return await this.callAnthropic(modelId, prompt, history, systemPrompt);
      } else if (isGoogle) {
        return await this.callGoogle(modelId, prompt, history, systemPrompt);
      } else if (isOllama) {
        return await this.callOllama(modelId, prompt, history);
      }
      
      throw new Error(`Modelo ${modelId} não suportado.`);
    } catch (error: any) {
      console.error(`Erro na AIService (${modelId}):`, error);
      logError({
        error_message: error.message || 'Erro na AIService',
        severity: 'error',
        stack_trace: error.stack
      });
      throw error;
    }
  }

  private static async callOpenAI(model: string, prompt: string, history: ChatMessage[], systemPrompt: string) {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) throw new Error("Chave da OpenAI não configurada.");

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: prompt }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: 0.7,
        stream: false
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Erro na API da OpenAI');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  private static async callAnthropic(model: string, prompt: string, history: ChatMessage[], systemPrompt: string) {
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("Chave da Anthropic não configurada.");

    // Mapping Maximus internal IDs to Anthropic IDs
    const anthropicModel = model === 'claude-3-5' ? 'claude-3-5-sonnet-20240620' : 'claude-3-opus-20240229';

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'dangerously-allow-browser': 'true'
      },
      body: JSON.stringify({
        model: anthropicModel,
        system: systemPrompt,
        messages: [
          ...history.filter(m => m.role !== 'system'),
          { role: 'user', content: prompt }
        ],
        max_tokens: 4096
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Erro na API da Anthropic');
    }

    const data = await response.json();
    return data.content[0].text;
  }

  private static async callGoogle(model: string, prompt: string, history: ChatMessage[], systemPrompt: string) {
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    if (!apiKey) throw new Error("Chave do Google (Gemini) não configurada.");

    const googleModel = model === 'gemini-1-5' ? 'gemini-1.5-pro' : 'gemini-pro';
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${googleModel}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          ...history.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
          })),
          {
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\nPergunta do Usuário: ${prompt}` }]
          }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Erro na API do Google Gemini');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  private static async callOllama(model: string, prompt: string, history: ChatMessage[]) {
    // Basic implementation for local Ollama
    const contextHistory = history.map(m => `${m.role === 'user' ? 'Usuário' : 'Assistente'}: ${m.content}`).join('\n');
    const fullPrompt = `${contextHistory}\nUsuário: ${prompt}\nAssistente:`;

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      body: JSON.stringify({
        model: model,
        prompt: fullPrompt,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error('Falha ao conectar com Ollama local.');
    }

    const data = await response.json();
    return data.response;
  }
}
