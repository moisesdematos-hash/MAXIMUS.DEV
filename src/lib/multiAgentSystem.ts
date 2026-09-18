import { ResearchAgent } from './agents/researchAgent';
import { DatabaseAgent } from './agents/databaseAgent';
import { GrepAgent } from './agents/grepAgent';
import { CronAgent } from './agents/cronAgent';
import { IngestionAgent } from './agents/ingestionAgent';
import { supabase } from './supabase';
import { logError } from './errorLogger';
import { SecurityAuditEngine } from './securityAudit';
import { GhostPortability } from './ghostPortability';
import { ChaosSandbox } from './chaosSandbox';
import { RollbackManager } from './rollbackManager';
import { FrontendAgent } from './frontendAgent';
import { BackendAgent } from './backendAgent';
import { TestingAgent } from './testingAgent';
import { PerformanceAgent } from './performanceAgent';
import { DocAgent } from './docAgent';
import { ContextAgent } from './contextAgent';
import { UserDna } from './userDna';
import { CreditManager } from './creditManager';
import { BlueprintAgent } from './blueprintAgent';
import { SecurityAgent } from './securityAgent';
import { collaborationAgent, CollaborationAgent } from './collaborationAgent';

export class MultiAgentOrchestrator {
  private static instance: MultiAgentOrchestrator;
  private portabilityAgent: GhostPortability;
  private chaosAgent: ChaosSandbox;
  private rollbackAgent: RollbackManager;
  private frontendAgent: FrontendAgent;
  private backendAgent: BackendAgent;
  private testingAgent: TestingAgent;
  private performanceAgent: PerformanceAgent;
  private docAgent: DocAgent;
  private contextAgent: ContextAgent;
  private userDna: UserDna;
  private creditManager: CreditManager;
  private blueprintAgent: BlueprintAgent;
  private securityAgent: SecurityAgent;
  private collaborationAgent: CollaborationAgent;

  private constructor() {
    this.portabilityAgent = new GhostPortability();
    this.chaosAgent = new ChaosSandbox();
    this.rollbackAgent = new RollbackManager();
    this.frontendAgent = new FrontendAgent();
    this.backendAgent = new BackendAgent();
    this.testingAgent = new TestingAgent();
    this.performanceAgent = new PerformanceAgent();
    this.docAgent = new DocAgent();
    this.contextAgent = new ContextAgent();
    this.userDna = UserDna.getInstance();
    this.creditManager = CreditManager.getInstance();
    this.blueprintAgent = new BlueprintAgent();
    this.securityAgent = new SecurityAgent();
    this.collaborationAgent = collaborationAgent;
  }

  public static getInstance(): MultiAgentOrchestrator {
    if (!MultiAgentOrchestrator.instance) {
      MultiAgentOrchestrator.instance = new MultiAgentOrchestrator();
    }
    return MultiAgentOrchestrator.instance;
  }

  /**
   * Orquestra a criação completa de uma feature (Frontend + Backend)
   */
  public async orchestrateFeatureCreation(prompt: string, history: any[] = [], modelId: string = 'maximus-neural', projectId?: string) {
    console.log('🤖 Multi-Agent: Iniciando criação de feature com memória viva...');
    
    // Fetch project-specific integrations
    let integrationsContext = '';
    try {
      const { data: integrations } = await supabase
        .from('user_integrations')
        .select('service_id, status')
        .eq('project_id', projectId || null)
        .eq('status', 'connected');

      if (integrations && integrations.length > 0) {
        integrationsContext = `INTEGRAÇÕES ATIVAS NO PROJETO: ${integrations.map(i => i.service_id).join(', ')}`;
      }
    } catch (err) {
      console.warn('Falha ao buscar integrações para o contexto do agente.');
    }
    
    const discussion: { agent: string; thought: string }[] = [];

    // 0. Pre-Processing: Context & Memory
    this.logAgentAction('agent-context', 'Analisando histórico de contexto...');
    const contextSummary = await this.contextAgent.summarizeContext(history);
    discussion.push({ agent: 'Context', thought: contextSummary.reasoning || 'Contexto inicializado.' });
    const dnaPrompt = this.userDna.getDnaAsPrompt();
    
    // Extrair o código base e a solicitação limpa (pois o ChatArea injeta tudo no prompt)
    const codeMatch = prompt.match(/Contexto atual do código:\n([\s\S]*?)\n\nSolicitação do usuário:/i);
    const codebase = codeMatch ? codeMatch[1] : '';
    const userRequestMatch = prompt.match(/Solicitação do usuário:\s*([\s\S]*)/i);
    const userRequest = userRequestMatch ? userRequestMatch[1] : prompt;

    // 0.3. Agendamento em Background (Cron Jobs)
    const scheduleInfo = this.cronAgent.extractSchedule(userRequest);
    if (scheduleInfo) {
      this.logAgentAction('agent-context', `⏳ Detectei um agendamento: "${scheduleInfo.action}" a cada ${scheduleInfo.intervalMs}ms`);
      
      const taskId = this.cronAgent.scheduleTask(scheduleInfo.action, scheduleInfo.intervalMs, async (actionToRun) => {
        // Quando o cron disparar no background, ele faz uma pesquisa web automática sobre a ação
        const backgroundContext = await this.researchAgent.searchWeb(actionToRun);
        console.log(`[Cron Background Result]: Executou a pesquisa agendada e encontrou dados novos!`);
      });

      discussion.push({ 
        agent: 'System', 
        thought: `Agendei a tarefa [${taskId}] para rodar no background a cada ${scheduleInfo.intervalMs/1000}s. Você pode continuar trabalhando enquanto eu monitoro isso.` 
      });
      
      // Se a requisição for APENAS um agendamento, podemos pular a geração pesada.
      // Mas vamos continuar para gerar a resposta inicial.
    }

    // 0.3.5 Ingestão de Fontes Externas (GitHub & PDFs)
    const ingestedContext = await this.ingestionAgent.ingestExternalSources(userRequest);
    if (ingestedContext) {
      this.logAgentAction('agent-context', '📚 Ingeri dados de URLs externas (GitHub/PDF) com sucesso.');
      discussion.push({ agent: 'Context', thought: 'Analisei os links externos fornecidos e absorvi o conteúdo no meu contexto.' });
    }

    // 0.4. Deep Code Search (Grep)
    let grepContext = '';
    const searchQuery = this.grepAgent.extractSearchQuery(userRequest);
    if (searchQuery && codebase) {
      this.logAgentAction('agent-context', `Rodando Busca Profunda (Grep) por "${searchQuery}"...`);
      grepContext = this.grepAgent.searchCodebase(searchQuery, codebase);
      if (grepContext) {
        discussion.push({ agent: 'Grep', thought: `Fiz uma varredura profunda no código por "${searchQuery}".` });
      }
    }

    // 0.5. Web Research
    this.logAgentAction('agent-research', 'Varrendo a internet por informações atualizadas...');
    const webContext = await this.researchAgent.searchWeb(userRequest);
    if (webContext) {
      discussion.push({ agent: 'Research', thought: 'Encontrei dados recentes na web e os injetei no contexto.' });
    }
    
    const augmentedPrompt = `
      CONTEXTO DO PROJETO: ${contextSummary.summary}
      ${integrationsContext}
      ${dnaPrompt}
      ${grepContext}
      ${webContext}
      ${ingestedContext}
      CÓDIGO ATUAL:
      ${codebase}
      
      USUÁRIO SOLICITA: ${userRequest}
    `;

    // 1 & 2. Geração Paralela (Frontend e Backend)
    this.logAgentAction('agent-core', '🧠 ORQUESTRAÇÃO PARALELA: Disparando Frontend e Backend simultaneamente...');
    
    const [backendResult, frontendResult] = await Promise.all([
      this.backendAgent.generateAPI(augmentedPrompt, modelId),
      this.frontendAgent.generateUI(prompt, modelId)
    ]);

    let backendThought = backendResult.reasoning || 'API estruturada de forma autônoma.';
    
    // 1.5. Database Execution (Phase 3) - Ocorre logo após o backend terminar
    if (backendResult.code && backendResult.code.toLowerCase().includes('create table')) {
      this.logAgentAction('agent-database', 'Detectei DDL de banco de dados. Tentando aplicar migrações no Supabase...');
      const dbResult = await this.databaseAgent.executeSQL(backendResult.code);
      backendThought += ` \n\n[Database Agent]: ${dbResult.message}`;
    }
    
    discussion.push({ agent: 'Backend', thought: backendThought });
    discussion.push({ agent: 'Frontend', thought: frontendResult.reasoning || 'Interface e Componentes construídos com sucesso.' });
    
    // 3, 4, 5 & 6. Qualidade, Segurança e Testes (Delegação Paralela Maciça)
    this.logAgentAction('agent-qa', '🛡️ DELEGAÇÃO PARALELA: Invocando [Security, Testing, Performance, Docs] simultaneamente...');
    
    const codeToAnalyze = frontendResult.code || '';
    const [securityResult, testResult, perfResult, docResult] = await Promise.all([
      this.securityAgent.conductDeepScan(codeToAnalyze),
      this.testingAgent.generateTests(codeToAnalyze),
      this.performanceAgent.analyzePerformance(codeToAnalyze),
      this.docAgent.generateDocumentation(codeToAnalyze)
    ]);

    discussion.push({ agent: 'Security', thought: securityResult.reasoning });
    discussion.push({ agent: 'Testing', thought: testResult.reasoning || 'Testes unitários construídos em paralelo.' });
    discussion.push({ agent: 'Performance', thought: perfResult.reasoning || 'Métricas de otimização analisadas em paralelo.' });
    discussion.push({ agent: 'Doc', thought: docResult.reasoning || 'Documentação gerada paralelamente.' });

    const totalCredits = 25; // Base cost for full orchestration
    this.creditManager.consumeCredits(totalCredits);

    return {
      frontend: frontendResult,
      backend: backendResult,
      security: securityResult.vulnerabilities,
      securityStatus: securityResult.status,
      tests: testResult,
      performance: perfResult,
      docs: docResult,
      discussion,
      credits: {
        consumed: totalCredits,
        savings: 15 // Simulated savings from self-correction
      }
    };
  }

  public async orchestrateSafeDeploy(code: string): Promise<{ success: boolean; url?: string; error?: string }> {
    console.log('🤖 Multi-Agent: Iniciando orquestração de deploy...');
    this.logAgentAction('agent-devops', 'Preparando ambiente multi-cloud para deploy...');

    // 1. Auditoria de Segurança
    const auditResults = SecurityAuditEngine.audit(code);
    const criticalVulnerabilities = auditResults.filter(v => v.severity === 'critical');
    
    if (criticalVulnerabilities.length > 0) {
      console.error('🛡️ Auditor: Deploy bloqueado por vulnerabilidades críticas.');
      return { success: false, error: 'Vulnerabilidades críticas detectadas.' };
    }

    // 2. Deploy Multi-Cloud
    try {
      const deployResult = await this.portabilityAgent.orchestrateDeploy('production', code);
      
      // 3. Iniciar monitoramento de Rollback
      this.rollbackAgent.startMonitoring('v1.0.0');

      // 4. Ativar Chaos Sandbox
      this.chaosAgent.strengthenSystem();

      return { success: true, url: deployResult.url };
    } catch (error: any) {
      console.error('☁️ Orquestrador: Falha no deploy multi-cloud.');
      logError({
        error_message: 'Falha na orquestração multi-cloud',
        severity: 'error',
        stack_trace: error.stack
      });
      return { success: false, error: 'Falha na orquestração multi-cloud.' };
    }
  }

  public getFullSystemStatus() {
    return {
      agents: {
        security: 'Active',
        portability: 'Standby',
        chaos: 'Simulating',
        rollback: 'Monitoring',
        frontend: 'Idle',
        backend: 'Idle',
        testing: 'Active',
        performance: 'Optimization-Ready',
        documentation: 'Scanning',
        memory: 'Living-Project-Sync',
        dna: 'Loaded',
        blueprint: 'Template-Ready'
      },
      credits: this.creditManager.getStatus()
    };
  }

  public async getBlueprintInitialization(blueprintId: string) {
    return this.blueprintAgent.getBlueprintInitData(blueprintId);
  }

  public getCollaborationData() {
    return {
      collaborators: this.collaborationAgent.getOnlineCollaborators(),
      activities: this.collaborationAgent.getActivities()
    };
  }

  public logAgentAction(agentId: string, action: string) {
    this.collaborationAgent.logActivity(agentId, action);
  }
}
