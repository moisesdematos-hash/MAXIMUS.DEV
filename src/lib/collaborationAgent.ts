export interface Collaborator {
  id: string;
  name: string;
  role: 'Frontend' | 'Backend' | 'Security' | 'DevOps' | 'QA';
  avatar: string;
  status: 'online' | 'busy' | 'idle';
  lastAction?: string;
}

export const AI_COLLABORATORS: Collaborator[] = [
  {
    id: 'agent-frontend',
    name: 'Luna',
    role: 'Frontend',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Luna',
    status: 'online',
    lastAction: 'Refatorando CSS do cabeçalho'
  },
  {
    id: 'agent-backend',
    name: 'Cipher',
    role: 'Backend',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Cipher',
    status: 'busy',
    lastAction: 'Otimizando consultas ao banco'
  },
  {
    id: 'agent-security',
    name: 'Aegis',
    role: 'Security',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Aegis',
    status: 'online',
    lastAction: 'Escaneando vulnerabilidades XSS'
  }
];

export interface ActivityLog {
  id: string;
  collaboratorId: string;
  action: string;
  timestamp: Date;
}

export class CollaborationAgent {
  private activities: ActivityLog[] = [];

  public logActivity(collaboratorId: string, action: string) {
    const log: ActivityLog = {
      id: Math.random().toString(36).substr(2, 9),
      collaboratorId,
      action,
      timestamp: new Date()
    };
    this.activities.unshift(log);
    if (this.activities.length > 20) this.activities.pop();
    return log;
  }

  public getActivities() {
    return this.activities;
  }

  public getOnlineCollaborators() {
    // Simular flutuação de presença
    return AI_COLLABORATORS;
  }
}
