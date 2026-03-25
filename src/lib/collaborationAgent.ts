import { supabase } from './supabase';

export interface Collaborator {
  id: string;
  name: string;
  role: 'Frontend' | 'Backend' | 'Security' | 'DevOps' | 'QA';
  avatar: string;
  status: 'online' | 'busy' | 'idle';
  lastAction?: string;
  cursor?: { x: number; y: number };
}

export const AI_COLLABORATORS: Collaborator[] = [
  {
    id: 'agent-frontend',
    name: 'Luna',
    role: 'Frontend',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Luna',
    status: 'online',
    lastAction: 'Visualizando Nexus Engine'
  },
  {
    id: 'agent-backend',
    name: 'Cipher',
    role: 'Backend',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Cipher',
    status: 'online',
    lastAction: 'Sincronizando canais neurais'
  }
];

export interface ActivityLog {
  id: string;
  collaboratorId: string;
  action: string;
  timestamp: Date;
}

export class CollaborationAgent {
  private static instance: CollaborationAgent;
  private channel: any;
  private presence: any[] = [];
  private activities: any[] = [];

  private constructor() {}

  public static getInstance(): CollaborationAgent {
    if (!CollaborationAgent.instance) {
      CollaborationAgent.instance = new CollaborationAgent();
    }
    return CollaborationAgent.instance;
  }

  public initNexus(projectId: string, userId: string, userName: string) {
    console.log(`📡 Nexus: Inicializando canal para o projeto ${projectId}...`);
    
    this.channel = supabase.channel(`project_nexus_${projectId}`, {
      config: {
        presence: {
          key: userId,
        },
      },
    });

    this.channel
      .on('presence', { event: 'sync' }, () => {
        this.presence = Object.values(this.channel.presenceState()).flat();
        console.log('👥 Nexus: Presença sincronizada', this.presence);
      })
      .on('broadcast', { event: 'agent_activity' }, (payload: any) => {
        console.log('🤖 Nexus: Atividade recebida via broadcast', payload);
        this.activities.unshift(payload.payload);
        if (this.activities.length > 20) this.activities.pop();
      })
      .on('broadcast', { event: 'activity' }, (payload: any) => {
        console.log('👥 Nexus: Atividade humana recebida', payload);
        this.activities.unshift({
          id: Math.random().toString(36).substr(2, 9),
          collaboratorId: 'human-user',
          action: payload.payload.action,
          timestamp: payload.payload.timestamp
        });
        if (this.activities.length > 20) this.activities.pop();
      })
      .subscribe(async (status: string) => {
        if (status === 'SUBSCRIBED') {
          await this.channel.track({
            id: userId,
            name: userName,
            online_at: new Date().toISOString(),
          });
        }
      });
  }

  public broadcastActivity(_projectId: string, action: string) {
    if (this.channel) {
      this.channel.send({
        type: 'broadcast',
        event: 'activity',
        payload: { action, timestamp: new Date() }
      });
    }
  }

  public logActivity(collaboratorId: string, action: string) {
    const activity = { 
      id: Math.random().toString(36).substr(2, 9),
      collaboratorId, 
      action, 
      timestamp: new Date() 
    };

    this.activities.unshift(activity);
    if (this.activities.length > 20) this.activities.pop();

    console.log(`📝 Nexus: Log de Atividade - ${collaboratorId}: ${action}`);
    if (this.channel) {
      this.channel.send({
        type: 'broadcast',
        event: 'agent_activity',
        payload: activity
      });
    }
    return activity;
  }

  public getActivities() {
    return this.activities;
  }

  public getPresence() {
    return this.presence;
  }

  public getOnlineCollaborators(): Collaborator[] {
    // Mesclar presença real com agentes simulados para a demo
    return [...AI_COLLABORATORS];
  }
}

export const collaborationAgent = CollaborationAgent.getInstance();
