/// <reference types="react" />
import React, { useState, useRef, useEffect } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import mermaid from 'mermaid';


import { 
  Send, 
  Paperclip, 
  Bot,
  Trash2,
  Settings,
  MessageSquare,
  Crown,
  ClipboardList,
  Zap,
  Terminal,
  Clock,
  LayoutGrid,
  Layout,
  Cpu,
  Github,
  Mic,
  Folder
} from 'lucide-react';
import DependencyManager from './DependencyManager';
import OpenClawPanel from './OpenClawPanel';
import ActivityFeed from './ActivityFeed';
import SubscriptionView from './SubscriptionView';
import AIAssistant from './AIAssistant';
import TemplatesModal from './TemplatesModal';
import { useProjects } from '../contexts/ProjectContext';
import { useAuth } from '../contexts/AuthContext';
import { useMultiAgent } from '../hooks/useMultiAgent';
import { useUI } from '../contexts/UIContext';
import { MessageService } from '../lib/messageService';
import { getTranslation } from '../lib/i18n';
import { FileProcessor } from '../utils/fileProcessor';

const ProcessingTimer = () => {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);
  return <span className="text-xs font-bold font-mono tracking-widest">{seconds}s</span>;
};

// Configurar Marked para renderizar blocos mermaid como divs compatíveis
const renderer = new marked.Renderer();
const originalCode = renderer.code.bind(renderer);
renderer.code = (code, language, isEscaped) => {
  if (language === 'mermaid') {
    return `<div class="mermaid">${code}</div>`;
  }
  if (typeof code === 'object' && code.lang === 'mermaid') {
      return `<div class="mermaid">${code.text}</div>`;
  }
  if (typeof originalCode === 'function' && typeof code !== 'object') {
     return originalCode(code, language, isEscaped);
  }
  return `<pre><code class="language-${language || code.lang}">${typeof code === 'object' ? code.text : code}</code></pre>`;
};
marked.use({ renderer });

mermaid.initialize({ startOnLoad: false, theme: 'dark' });

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  type: 'react' | 'vue' | 'next' | 'html' | 'node' | 'python' | 'angular';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  preview: string;
  downloads: number;
  rating: number;
  author: string;
  lastUpdated: string;
  isPopular: boolean;
  isFree: boolean;
  features: string[];
  demoUrl?: string;
  sourceUrl?: string;
}

interface ChatAreaProps {
  onCodeGenerated: (code: string) => void;
  currentCode: string;
}

const ChatArea: React.FC<ChatAreaProps> = ({ onCodeGenerated, currentCode }) => {
  const { currentProject } = useProjects();
  const { user } = useAuth();
  const { orchestrateFeature } = useMultiAgent();
  const { 
    setShowAgentReasoning, 
    setAgentName,
    setSecurityStatus,
    setVulnerabilities,
    language,
    chatInteractionType,
    setChatInteractionType,
    isPlanningActive,
    setIsPlanningActive,
    workspaceMode,
    setWorkspaceMode,
    setShowIntegrations,
    aiProvider,
    setAiProvider,
    ollamaConfig
  } = useUI();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Olá! Sou sua IA de desenvolvimento. O que você gostaria de construir hoje?',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("API de reconhecimento de voz não suportada neste navegador (use Chrome ou Edge).");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'pt-BR';
    recognition.continuous = true;
    recognition.interimResults = true;

    const originalInput = inputValue;

    recognition.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      setInputValue(originalInput + (originalInput ? ' ' : '') + currentTranscript);
    };

    recognition.onerror = (e: any) => {
      console.warn("Erro no microfone:", e);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    setIsListening(true);
  };
  const [isProcessing, setIsProcessing] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [showDependencyManager, setShowDependencyManager] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  
  const models = [
    { id: 'maximus-neural', name: 'MAXIMUS Neural', provider: 'Native', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', isNative: true },
    { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
    { id: 'claude-3-5', name: 'Claude 3.5', provider: 'Anthropic', color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
    { id: 'claude-4-6', name: 'Claude 4.6 Opus', provider: 'Anthropic', color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
    { id: 'gemini-1-5', name: 'Gemini 1.5', provider: 'Google', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google', color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
    { id: 'llama-3', name: 'Llama 3', provider: 'Meta', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { id: 'mistral-large', name: 'Mistral', provider: 'Mistral', color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/20' }
  ];
  const [selectedModel, setSelectedModel] = useState(models[0].id);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const loadMessages = async () => {
      if (currentProject?.id) {
        setIsProcessing(true);
        const { data, error } = await MessageService.getProjectMessages(currentProject.id);
        if (!error && data) {
          const formattedMessages: Message[] = data.map(m => ({
            id: m.id,
            type: m.role === 'assistant' ? 'ai' : m.role as any,
            content: m.content,
            timestamp: new Date(m.created_at)
          }));
          setMessages(formattedMessages);
        } else {
          setMessages([
            {
              id: '1',
              type: 'ai',
              content: `Bem-vindo ao projeto **${currentProject.name}**! Como posso ajudar hoje?`,
              timestamp: new Date(),
            }
          ]);
        }
        setIsProcessing(false);
      }
    };

    loadMessages();
  }, [currentProject?.id]);

  useEffect(scrollToBottom, [messages]);

  // Renderizar os diagramas Mermaid na tela
  useEffect(() => {
    try {
      mermaid.run({ querySelector: '.mermaid' }).catch(e => console.warn('Mermaid render error:', e));
    } catch (e) {
      console.warn('Mermaid sync render error:', e);
    }
  }, [messages]);

  const handleSendMessage = async (userMessage: string) => {
    setIsProcessing(true);
    
    if (user && currentProject?.id) {
      await MessageService.saveMessage({
        projectId: currentProject.id,
        userId: user.id,
        role: 'user',
        content: userMessage,
        modelId: selectedModel
      });
    }

    if (aiProvider === 'ollama') {
      await handleOllamaResponse(userMessage);
    } else {
      await handleOpenAIResponse(userMessage);
    }
    
    setIsProcessing(false);
  };

  const handleOllamaResponse = async (userMessage: string) => {
    const aiMessageId = Date.now().toString();
    const aiMessage: Message = {
      id: aiMessageId,
      type: 'ai',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    };
    
    setMessages(prev => [...prev, aiMessage]);

    try {
      const response = await fetch(`${ollamaConfig.endpoint}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: ollamaConfig.model,
          prompt: `Atue como um desenvolvedor Sênior Frontend React/TypeScript.\nCrie exatamente o que o usuário pediu seguindo estas regras CRÍTICAS:\n1. Retorne TODO o código em um ÚNICO bloco \`\`\`tsx.\n2. O código deve ter o \`export default function App()\`.\n3. Use APENAS Tailwind CSS na prop className (Proibido CSS separado).\n4. PROIBIDO usar bibliotecas de ícones externas (lucide-react, heroicons, etc). Se precisar de ícones, use Emojis ou SVG inline puro.\n5. Seja direto, sem longas explicações antes do código.\n\nUsuário: ${userMessage}\n\nCódigo:`,
          stream: true,
          options: {
            temperature: ollamaConfig.temperature,
            num_predict: ollamaConfig.maxTokens
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n').filter(Boolean);
          
          for (const line of lines) {
            try {
              const data = JSON.parse(line);
              if (data.response) {
                fullResponse += data.response;
                setMessages((prev: Message[]) => prev.map((msg: Message) =>
                  msg.id === aiMessageId
                    ? { ...msg, content: fullResponse }
                    : msg
                ));
              }
            } catch (e) {
              // ignore incomplete json chunk parsing error
            }
          }
        }
      }

      // Extrair o código gerado da resposta do Ollama de forma robusta
      let extractedCode = '';
      const codeMatch = fullResponse.match(/```(?:\w+)?\n([\s\S]*?)(?:```|$)/i);
      
      if (codeMatch && codeMatch[1]) {
        extractedCode = codeMatch[1].trim();
      } else if (fullResponse.includes('export default function')) {
        // Fallback extremo
        extractedCode = fullResponse;
      }

      if (extractedCode && onCodeGenerated) {
        // Limpar imports que quebram o Babel no navegador (opcional, focado apenas no lucide e iconify)
        extractedCode = extractedCode.replace(/import\s+.*?from\s+['"](?:@iconify\/react|lucide-react|@lucide\/react)['"];?\n?/gi, '');
        onCodeGenerated(extractedCode);
      }

      // Limpar o bloco de código gigante do chat para não duplicar visualmente
      let displayResponse = fullResponse;
      // Removida a substituição do bloco de código para que o chat exiba o markdown como o Antigravity

      if (user && currentProject?.id) {
        await MessageService.saveMessage({
          projectId: currentProject.id,
          userId: user.id,
          role: 'assistant',
          content: displayResponse || 'Sem resposta...',
          modelId: selectedModel
        });
      }

      setMessages((prev: Message[]) => prev.map((msg: Message) =>
        msg.id === aiMessageId
          ? { ...msg, content: displayResponse, isStreaming: false }
          : msg
      ));

    } catch (error) {
      console.error('Erro ao conectar com Ollama:', error);
      const fallbackResponse = `❌ Erro ao conectar com Ollama (${ollamaConfig.endpoint})\n\nVerifique se:\n• Ollama está rodando\n• Modelo ${ollamaConfig.model} está instalado\n• Endpoint está correto\n\n🔄 Alternando para modo simulado...`;

      setMessages((prev: Message[]) => prev.map((msg: Message) =>
        msg.id === aiMessageId
          ? { ...msg, content: fallbackResponse, isStreaming: false }
          : msg
      ));

      setTimeout(() => {
        setAiProvider('openai');
        alert('⚠️ Ollama Indisponível!\n\n❌ Não foi possível conectar\n🔄 Alternado para OpenAI\n⚙️ Configure Ollama nas configurações');
      }, 2000);
    }
  };

  const handleOpenAIResponse = async (userMessage: string) => {
    let contextFromFiles = "";
    if (attachedFiles.length > 0) {
      setAgentName('Cipher');
      setShowAgentReasoning(true);
      const processed = await FileProcessor.processFiles(attachedFiles);
      contextFromFiles = FileProcessor.formatForAI(processed);
    }

    const aiMessageId = Date.now().toString();
    const aiMessage: Message = {
      id: aiMessageId,
      type: 'ai',
      content: '🤖 Enviando para o Sistema Multi-Agente...',
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages((prev: Message[]) => [...prev, aiMessage]);

    try {
      setAgentName('Architect');
      setShowAgentReasoning(true);

      const result = await orchestrateFeature(
        `Contexto atual do código:\n${currentCode}\n${contextFromFiles}\n\nSolicitação do usuário: ${userMessage}`,
        messages,
        selectedModel,
        currentProject?.id
      );

      if (result.securityStatus) {
        setSecurityStatus(result.securityStatus);
        setVulnerabilities(result.security || []);
      }

      let finalContent = `🚀 **Feature processada com sucesso!**\n\n` +
        `🛡️ **Segurança**: ${result.security.length} vulnerabilidades encontradas.\n` +
        `🎨 **UI/Frontend**: Gerado.\n` +
        `⚙️ **API/Backend**: Gerado.\n` +
        `🧪 **Testes**: ${result.tests.success ? 'Gerados com sucesso' : 'Falha na geração'}.\n` +
        `⚡ **Performance**: ${result.performance.suggestions.length} sugestões de otimização.\n` +
        `📄 **Doc**: README e JSDoc gerados.\n\n` +
        `💰 **Créditos Economizados**: ${result.credits.savings}`;

      if (result.performance?.suggestions && result.performance.suggestions.length > 0) {
        finalContent += `\n\n✨ **Ações de Performance Realizadas**:\n${result.performance.suggestions.map((s: string) => `- ${s}`).join('\n')}`;
      }

      if (result.discussion && result.discussion.length > 0) {
        finalContent += `\n\n💭 **Discussão entre Agentes (Backstage)**:\n` +
          result.discussion.map((d: { agent: string; thought: string }) => `> **${d.agent}**: ${d.thought}`).join('\n');
      }

      if (result.frontend && result.frontend.code) {
        finalContent += `\n\n### Código Gerado\n\n\`\`\`tsx\n${result.frontend.code}\n\`\`\`\n`;
      }

      setMessages((prev: Message[]) => prev.map((msg: Message) =>
        msg.id === aiMessageId
          ? { ...msg, content: finalContent, isStreaming: false }
          : msg
      ));

      if (user && currentProject?.id) {
        await MessageService.saveMessage({
          projectId: currentProject.id,
          userId: user.id,
          role: 'assistant',
          content: finalContent,
          modelId: selectedModel
        });
      }

      onCodeGenerated(result.frontend.code || '');
      setShowAgentReasoning(false);

    } catch (error) {
      console.error('Erro na orquestração:', error);
      setMessages((prev: Message[]) => prev.map((msg: Message) =>
        msg.id === aiMessageId
          ? { ...msg, content: '❌ Erro ao processar com Multi-Agente.', isStreaming: false }
          : msg
      ));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputValue.trim() && attachedFiles.length === 0) || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue + (attachedFiles.length > 0 ? `\n\n📎 ${attachedFiles.length} arquivo(s) anexado(s)` : ''),
      timestamp: new Date(),
    };

    setMessages((prev: Message[]) => [...prev, userMessage]);
    setInputValue('');
    setAttachedFiles([]);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    await handleSendMessage(inputValue);
  };

  const handleTemplateSelect = (template: Template) => {
    const templatePrompt = `Use o template "${template.name}" como base: ${template.description}. 
    Tecnologia recomendada: ${template.type}. 
    Principais características: ${template.features.join(', ')}.`;
    
    setInputValue(templatePrompt);
    setShowTemplatesModal(false);
    
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
      }
    }, 100);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 240) + 'px';
  };

  // Generator functions removed for brevity (orchestrated by AI system)

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-950 overflow-hidden">
      {/* Header */}
      <div className="h-10 flex items-center justify-between px-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center justify-center">
            <Bot className="w-3 h-3 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Assistant</span>
        </div>

        {/* Interaction Mode Switcher */}
        <div className="flex items-center bg-gray-200/50 dark:bg-gray-800/50 rounded-md p-0.5 border border-gray-300/30 dark:border-gray-700/30">
          <button 
            onClick={() => setChatInteractionType('chat')}
            className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[9px] font-bold transition-all duration-300 ${
              chatInteractionType === 'chat' 
                ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <MessageSquare className="w-2.5 h-2.5" />
            <span>Chat</span>
          </button>
          <button 
            onClick={() => setChatInteractionType('subscription')}
            className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[9px] font-bold transition-all duration-300 ${
              chatInteractionType === 'subscription' 
                ? 'bg-white dark:bg-gray-700 shadow-sm text-purple-600 dark:text-purple-400' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Crown className="w-2.5 h-2.5" />
            <span>Subscrição</span>
          </button>
          <button 
            onClick={() => setChatInteractionType('claw')}
            className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[9px] font-bold transition-all duration-300 ${
              chatInteractionType === 'claw' 
                ? 'bg-white dark:bg-gray-700 shadow-sm text-orange-600 dark:text-orange-400' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Terminal className="w-2.5 h-2.5" />
            <span>OpenClaw</span>
          </button>
          <button 
            onClick={() => setChatInteractionType('history')}
            className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[9px] font-bold transition-all duration-300 ${
              chatInteractionType === 'history' 
                ? 'bg-white dark:bg-gray-700 shadow-sm text-emerald-600 dark:text-emerald-400' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Clock className="w-2.5 h-2.5" />
            <span>Histórico</span>
          </button>
        </div>

        <div className="flex items-center space-x-1">
          <button 
            onClick={() => setMessages([])}
            className="btn-icon-sm text-gray-500 hover:text-red-500"
            title="Clear Chat"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button 
            className="btn-icon-sm"
            title="Settings"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages / OpenClaw Panel */}
      <div className="flex-1 overflow-y-auto p-0 space-y-6 overflow-x-hidden relative">
        {chatInteractionType === 'claw' ? (
          <div className="absolute inset-0 overflow-hidden">
            <OpenClawPanel />
          </div>
        ) : chatInteractionType === 'subscription' ? (
          <div className="h-full">
            <SubscriptionView />
          </div>
        ) : chatInteractionType === 'history' ? (
          <div className="h-full overflow-y-auto">
            <ActivityFeed isEmbedded />
          </div>
        ) : (
          <div className="p-4 space-y-6">
            {messages.map((message: Message) => (
              <div
                key={message.id}
                className={`flex w-full mb-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] sm:max-w-[80%] flex ${message.type === 'user' ? 'flex-row' : 'flex-row-reverse'} items-end overflow-hidden`}>
                  <div className={`flex-1 min-w-0 ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white ml-4'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white mr-4'
                      }`}
                    >
                      <div className={`prose prose-sm max-w-none ${message.type === 'ai' ? 'dark:prose-invert' : 'text-white'}`}>
                          {message.type === 'user' ? (
                             <p className="whitespace-pre-wrap">{message.content}</p>
                          ) : (
                             <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked.parse(message.content || '') as string) }} />
                          )}
                          {message.isStreaming && (
                            <span className="inline-block w-2 h-5 bg-current ml-1 animate-pulse" />
                          )}
                      </div>
                    </div>
                    <p className={`text-xs text-gray-500 mt-1 ${
                      message.type === 'user' ? 'text-right mr-4' : 'text-left ml-4'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-blue-600 order-1' 
                      : 'bg-gray-600 dark:bg-gray-600 order-2'
                  }`}>
                    {message.type === 'user' ? (
                      <span className="text-white font-medium text-sm">U</span>
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      {chatInteractionType === 'chat' && (
        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-3">
              {/* Mode Switcher */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5 border border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => setWorkspaceMode('standard')}
                    className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-[10px] font-bold transition-all duration-300 ${
                      workspaceMode === 'standard'
                        ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <Layout className="w-3 h-3" />
                    <span>Standard</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setWorkspaceMode('agent')}
                    className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-[10px] font-bold transition-all duration-300 ${
                      workspaceMode === 'agent'
                        ? 'bg-white dark:bg-gray-700 shadow-sm text-purple-600 dark:text-purple-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <Cpu className="w-3 h-3" />
                    <span>Agent</span>
                  </button>
                </div>
                <div className="text-[10px] font-medium text-gray-400 uppercase tracking-widest px-2 border-l border-gray-200 dark:border-gray-800">
                  {workspaceMode === 'agent' ? 'Modo Autônomo Ativo' : 'Modo Assistente Ativo'}
                </div>
              </div>

              {/* Unified Input Box */}
              <div className="relative border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 shadow-sm group focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                {/* Attachments Display */}
                {attachedFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 px-4 pt-3">
                    {attachedFiles.map((file, i) => (
                      <div key={i} className="flex items-center space-x-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-md text-xs border border-blue-200 dark:border-blue-800">
                        <span className="truncate max-w-[120px]">{file.name}</span>
                        <button 
                          type="button" 
                          onClick={() => setAttachedFiles(prev => prev.filter((_, index) => index !== i))}
                          className="hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={handleTextareaChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  placeholder={getTranslation(language, 'chat.placeholder')}
                  className="w-full bg-transparent px-4 pt-3 pb-12 text-sm focus:outline-none transition-all resize-none min-h-[100px] max-h-64 text-gray-800 dark:text-white"
                  rows={3}
                  disabled={isProcessing}
                />
                
                {/* Bottom Action Bar (Integrated) */}
                <div className="absolute bottom-0 left-0 right-0 px-3 py-2 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700/50">
                  <div className="flex items-center space-x-1">
                    {/* AI Model Selector Toggle */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowModelSelector(!showModelSelector)}
                        className={`flex items-center space-x-2 px-2 py-1 rounded-lg transition-all text-xs font-bold ${
                          models.find(m => m.id === selectedModel)?.bg + ' ' + models.find(m => m.id === selectedModel)?.color
                        }`}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                        <span className="uppercase tracking-wider mr-1">{models.find(m => m.id === selectedModel)?.name}</span>
                      </button>

                      {showModelSelector && (
                        <div className="absolute bottom-full left-0 mb-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-1 z-50">
                          {models.map((model) => (
                            <button
                              key={model.id}
                              type="button"
                              onClick={() => {
                                setSelectedModel(model.id);
                                setShowModelSelector(false);
                              }}
                              className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs transition-colors ${
                                selectedModel === model.id
                                  ? `${model.bg} ${model.color} font-bold`
                                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                              }`}
                            >
                              <div className="flex flex-col items-start text-left">
                                <div className="flex items-center space-x-2">
                                  <span>{model.name}</span>
                                  {model.isNative && (
                                    <span className="text-[7px] font-black bg-amber-500 text-white px-1 rounded uppercase tracking-tighter shadow-sm">GRÁTIS</span>
                                  )}
                                </div>
                                <span className="text-[9px] opacity-60 uppercase">{model.provider}</span>
                              </div>
                              {model.isNative && (
                                <span className="text-[8px] font-bold text-amber-500/80 italic">Nativo</span>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="h-4 w-[1px] bg-gray-200 dark:bg-gray-700 mx-1" />

                    <input 
                      type="file" 
                      id="file-upload" 
                      multiple 
                      accept="image/*,application/pdf,.txt,.js,.ts,.jsx,.tsx,.json,.md,.csv"
                      className="hidden" 
                      onChange={(e) => {
                        if (e.target.files) setAttachedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
                      }}
                    />
                    
                    <label 
                      htmlFor="file-upload"
                      className="btn-icon-sm text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer"
                      title="Anexar arquivos (Imagens, PDFs, Docs)"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                    </label>

                    <input 
                      type="file" 
                      id="folder-upload" 
                      webkitdirectory="" 
                      directory="" 
                      multiple 
                      className="hidden" 
                      onChange={(e) => {
                        if (e.target.files) setAttachedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
                      }}
                    />
                    
                    <label 
                      htmlFor="folder-upload"
                      className="btn-icon-sm text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer"
                      title="Anexar Pasta Inteira"
                    >
                      <Folder className="w-3.5 h-3.5" />
                    </label>

                    <button
                      type="button"
                      onClick={() => setShowIntegrations(true)}
                      className="btn-icon-sm text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                      title="Integração GitHub"
                    >
                      <Github className="w-3.5 h-3.5" />
                    </button>

                                          <button
                        type="button"
                        onClick={toggleListening}
                        className={`btn-icon-sm transition-all duration-300 ${
                          isListening 
                            ? 'text-red-500 bg-red-50 dark:bg-red-900/30 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]' 
                            : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30'
                        }`}
                        title="Entrada por Voz (Speech-to-Text)"
                      >
                        <Mic className="w-3.5 h-3.5" />
                      </button>

                    <button
                      type="button"
                      onClick={() => setShowTemplatesModal(true)}
                      className="btn-icon-sm text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                      title="Templates de Prompt"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                    </button>

                    <div className="h-4 w-[1px] bg-gray-200 dark:bg-gray-700 mx-1" />

                    <button
                      type="button"
                      onClick={() => setIsPlanningActive(!isPlanningActive)}
                      className={`flex items-center space-x-1 px-2 h-6 rounded-md transition-all duration-300 border ${
                        isPlanningActive 
                          ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/30' 
                          : 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/30'
                      }`}
                    >
                      {isPlanningActive ? <ClipboardList className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
                      <span className="text-[8px] font-black uppercase tracking-wider">{isPlanningActive ? 'Plano' : 'Auto'}</span>
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={(!inputValue.trim() && attachedFiles.length === 0) || isProcessing}
                    className="w-10 h-8 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center shadow-md hover:scale-105 active:scale-95"
                  >
                    {isProcessing ? <ProcessingTimer /> : <Send className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* AI Assistant Modal */}
      <AIAssistant 
        isOpen={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
        prompt={inputValue}
        onOptimizedPrompt={(optimized: string) => {
          setInputValue(optimized);
          if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 240) + 'px';
          }
        }}
      />

      {/* Dependency Manager Modal */}
      <DependencyManager 
        isOpen={showDependencyManager}
        onClose={() => setShowDependencyManager(false)}
      />

      {/* Templates Modal */}
      <TemplatesModal 
        isOpen={showTemplatesModal}
        onClose={() => setShowTemplatesModal(false)}
        onTemplateSelect={handleTemplateSelect}
      />
    </div>
  );
};

export default React.memo(ChatArea);