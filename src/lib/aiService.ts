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
      return `Você é Maximus Neural, o Agente de Codificação de elite do projeto MAXIMUS.DEV, alimentado por um modelo avançado e inspirado na arquitetura Antigravity da Google DeepMind.
Sua missão é atuar como um engenheiro de software parceiro (pair programming) de alto nível.

DIRETRIZES FUNDAMENTAIS:
1. Sempre analise o contexto completo antes de sugerir soluções.
2. Forneça códigos limpos, seguros e altamente escaláveis (Clean Code, SOLID).
3. Seja proativo e sugira melhorias na arquitetura.
4. NUNCA dê respostas vagas. Suas respostas devem ser precisas e ir direto ao ponto.
5. Sempre que sugerir ou modificar código, envolva-o em blocos de Markdown bem formatados para que a interface possa renderizá-los corretamente.
6. Assuma o controle do desenvolvimento e forneça soluções completas "prontas para aplicar", como a arquitetura Antigravity faria.
7. Responda SEMPRE em Português do Brasil.
8. [GENERATIVE UI] Utilize blocos de código \`\`\`mermaid
...
\`\`\` para desenhar wireframes visuais, arquiteturas de sistema, mockups ou fluxogramas ANTES de programar, sempre que o usuário pedir algo como "desenhe", "arquitetura", "fluxo" ou "mockup". O chat renderizará isso interativamente na tela!`;
    }
    return "Você é um assistente de desenvolvimento sênior especializado em criar aplicações full-stack modernas.";
  }

  static async generateResponse(modelId: string, prompt: string, history: ChatMessage[] = []) {
    // Mapping models to providers
    const isAnthropic = modelId.startsWith('claude');
    const isGoogle = modelId.startsWith('gemini');
    const isOpenAI = modelId.startsWith('gpt');
    const isGroq = modelId === 'maximus-neural' || modelId.startsWith('groq') || modelId.startsWith('llama');
    const isOllama = modelId === 'mistral-large';

    const systemPrompt = this.getSystemPrompt(modelId);
    
    try {
      if (isGroq) {
        const groqModel = modelId === 'maximus-neural' ? 'llama-3.1-70b-versatile' : (modelId === 'llama-3' ? 'llama3-8b-8192' : modelId);
        return await this.callGroq(groqModel, prompt, history, systemPrompt);
      } else if (isOpenAI) {
        return await this.callOpenAI(modelId, prompt, history, systemPrompt);
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

    private static async callGroq(model: string, prompt: string, history: ChatMessage[], systemPrompt: string) {
    // Attempt to use Vercel Serverless Function first for secure API key injection
    try {
      // Build messages array exactly as api/chat.js expects
      const formattedMessages = [
        ...history,
        { role: 'user', content: prompt }
      ];

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'groq',
          model: model,
          messages: formattedMessages,
          systemPrompt: systemPrompt
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.result) {
          return data.result;
        }
      } else {
        const errData = await response.json();
        console.warn("Vercel API error:", errData);
      }
    } catch (err) {
      console.warn("Serverless backend failed, falling back to local...", err);
    }

    // Fallback: Use client-side key if available (dev only or custom user key)
    const apiKey = import.meta.env.VITE_GROQ_API_KEY || localStorage.getItem('user_groq_key');
    if (!apiKey) throw new Error("Chave da Groq não configurada no backend nem localmente.");

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: prompt }
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
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
      throw new Error(error.error?.message || 'Erro na API da Groq');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  },
      ...history,
      { role: 'user', content: prompt }
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
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
      throw new Error(error.error?.message || 'Erro na API da Groq');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  private static async callOllama(model: string, prompt: string, history: ChatMessage[]) {
    // Redireciona o nome fictício de nossa arquitetura para um modelo robusto local
    const ollamaModel = model === 'maximus-neural' ? 'llama3.1:8b' : model;
    
    const contextHistory = history.map(m => `${m.role === 'user' ? 'Usuário' : 'Assistente'}: ${m.content}`).join('\n');
    const fullPrompt = `${contextHistory}\nUsuário: ${prompt}\nAssistente:`;

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      body: JSON.stringify({
        model: ollamaModel,
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
