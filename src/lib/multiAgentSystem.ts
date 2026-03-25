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
import { CollaborationAgent } from './collaborationAgent';

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
    this.collaborationAgent = new CollaborationAgent();
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
    
    const augmentedPrompt = `
      CONTEXTO DO PROJETO: ${contextSummary.summary}
      ${integrationsContext}
      ${dnaPrompt}
      USUÁRIO SOLICITA: ${prompt}
    `;

    // 1. Backend Generation
    this.logAgentAction('agent-backend', 'Estruturando API e esquemas de dados...');
    const backendResult = await this.backendAgent.generateAPI(augmentedPrompt, modelId);
    discussion.push({ agent: 'Backend', thought: backendResult.reasoning || 'API estruturada.' });
    
    // 2. Frontend Generation
    this.logAgentAction('agent-frontend', 'Gerando interface React e componentes UI...');
    const frontendResult = await this.frontendAgent.generateUI(prompt, modelId);
    discussion.push({ agent: 'Frontend', thought: frontendResult.reasoning || 'Componente UI gerado.' });
    
    // 3. Security Audit (Deep Scan)
    this.logAgentAction('agent-security', 'Realizando Varredura Neural de vulnerabilidades...');
    const securityResult = await this.securityAgent.conductDeepScan(frontendResult.code || '');
    discussion.push({ agent: 'Security', thought: securityResult.reasoning });
    
    // 4. Testing
    const testResult = await this.testingAgent.generateTests(frontendResult.code || '');
    discussion.push({ agent: 'Testing', thought: testResult.reasoning || 'Suíte de testes criada.' });

    // 5. Performance
    const perfResult = await this.performanceAgent.analyzePerformance(frontendResult.code || '');
    discussion.push({ agent: 'Performance', thought: perfResult.reasoning || 'Otimizações sugeridas.' });

    // 6. Documentation
    const docResult = await this.docAgent.generateDocumentation(frontendResult.code || '');
    discussion.push({ agent: 'Doc', thought: docResult.reasoning || 'README e JSDoc gerados.' });

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
