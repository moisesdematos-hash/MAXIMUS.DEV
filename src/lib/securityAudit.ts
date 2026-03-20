export interface Vulnerability {
  id: string;
  name: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  line?: number;
  recommendation: string;
}

export class SecurityAuditEngine {
  private static readonly PATTERNS = [
    {
      id: 'SA-001',
      name: 'Potencial Injeção de SQL',
      severity: 'critical',
      pattern: /query\s*\(\s*['"].*?\$\{.*?\}['"]\s*\)/gi,
      description: 'Uso de interpolação direta em strings de consulta SQL detectado.',
      recommendation: 'Use consultas preparadas (prepared statements) ou ORM com parametrização.'
    },
    {
      id: 'SA-002',
      name: 'XSS - Injetar HTML Perigoso',
      severity: 'high',
      pattern: /dangerouslySetInnerHTML/g,
      description: 'Uso de dangerouslySetInnerHTML pode permitir ataques de Cross-Site Scripting (XSS).',
      recommendation: 'Evite esta propriedade. Se necessário, sanitize o conteúdo usando bibliotecas como DOMPurify.'
    },
    {
      id: 'SA-003',
      name: 'Armazenamento Inseguro de Segredos',
      severity: 'high',
      pattern: /localStorage\.setItem\s*\(\s*['"](?:token|password|secret|key)['"]/gi,
      description: 'Armazenamento de dados sensíveis no localStorage detectado.',
      recommendation: 'Use Cookies com flag HttpOnly ou Secure Storage para tokens e segredos.'
    },
    {
      id: 'SA-004',
      name: 'Segredos Hardcoded',
      severity: 'critical',
      pattern: /(?:apiKey|secret|password|db_pass|token)\s*[:=]\s*['"][a-zA-Z0-9_\-\.]{10,}['"]/gi,
      description: 'Possível chave de API ou senha hardcoded detectada.',
      recommendation: 'Mova segredos para variáveis de ambiente (.env).'
    },
    {
      id: 'SA-005',
      name: 'Eval() Detectado',
      severity: 'critical',
      pattern: /eval\s*\(/g,
      description: 'Uso de eval() é extremamente perigoso e desnecessário.',
      recommendation: 'Refatore o código para evitar a execução de strings dinâmicas.'
    }
  ];

  static audit(code: string): Vulnerability[] {
    const vulnerabilities: Vulnerability[] = [];

    this.PATTERNS.forEach(rule => {
      let match;
      while ((match = rule.pattern.exec(code)) !== null) {
        // Encontrar o número da linha (simplificado)
        const lineCount = code.substring(0, match.index).split('\n').length;
        
        vulnerabilities.push({
          id: rule.id,
          name: rule.name,
          severity: rule.severity as any,
          description: rule.description,
          line: lineCount,
          recommendation: rule.recommendation
        });
      }
      // Reset regex state for next run
      rule.pattern.lastIndex = 0;
    });

    return vulnerabilities;
  }
}
