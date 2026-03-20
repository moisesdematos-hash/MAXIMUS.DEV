import { SecurityAuditEngine, Vulnerability } from './securityAudit';

export interface SecurityStatus {
  score: number; // 0-100
  level: 'clean' | 'warning' | 'critical';
  highlights: string[];
  totalVulnerabilities: number;
}

export class SecurityAgent {
  public async conductDeepScan(code: string): Promise<{
    status: SecurityStatus;
    vulnerabilities: Vulnerability[];
    reasoning: string;
  }> {
    console.log('🛡️ Security Agent: Iniciando Varredura Neural...');

    // 1. Auditoria Base (Regex/Padrões)
    const vulnerabilities = SecurityAuditEngine.audit(code);
    
    // 2. Cálculo de Score (Simplificado por enquanto)
    const criticals = vulnerabilities.filter(v => v.severity === 'critical').length;
    const highs = vulnerabilities.filter(v => v.severity === 'high').length;
    const mediums = vulnerabilities.filter(v => v.severity === 'medium').length;

    let score = 100;
    score -= (criticals * 40);
    score -= (highs * 20);
    score -= (mediums * 5);
    score = Math.max(0, score);

    let level: 'clean' | 'warning' | 'critical' = 'clean';
    if (criticals > 0) level = 'critical';
    else if (highs > 0 || mediums > 3) level = 'warning';

    const highlights = vulnerabilities.map(v => v.name).slice(0, 3);

    // 3. Raciocínio da IA
    let reasoning = 'O código foi analisado contra 50+ padrões de segurança conhecidos. ';
    if (level === 'clean') {
      reasoning += 'Nenhuma ameaça significativa detectada. Boas práticas de higienização de dados parecem estar em vigor.';
    } else if (level === 'warning') {
      reasoning += `Atenção necessária em ${vulnerabilities.length} pontos. Existem padrões que sugerem riscos de XSS ou vazamento de segredos menores.`;
    } else {
      reasoning += `ALERTA CRÍTICO: ${criticals} falhas graves detectadas. O sistema pode estar vulnerável a Injeção de SQL ou execução de código arbitrário.`;
    }

    return {
      status: {
        score,
        level,
        highlights,
        totalVulnerabilities: vulnerabilities.length
      },
      vulnerabilities,
      reasoning
    };
  }

  public getRemediationStrategy(vulnerability: Vulnerability): string {
    return `Para corrigir ${vulnerability.name}: ${vulnerability.recommendation}`;
  }
}
