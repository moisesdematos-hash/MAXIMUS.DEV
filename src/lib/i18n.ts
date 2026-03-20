type Language = 'pt' | 'en';

type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  pt: {
    'welcome.title': 'Bem-vindo ao MAXIMUS.DEV',
    'welcome.subtitle': 'Sua plataforma de desenvolvimento AI-First',
    'nav.workspace': 'Workspace',
    'nav.dashboard': 'Dashboard',
    'nav.deployments': 'Deployments',
    'nav.settings': 'Configurações',
    'nav.templates': 'Marketplace',
    'nav.monitoring': 'Monitoramento',
    'nav.integrations': 'Integrações',
    'nav.docs': 'Documentação',
    'nav.help': 'Central de Ajuda',
    'nav.theme': 'Tema',
    'nav.logout': 'Sair',
    'nav.plan_pro': 'Plano Pro',
    'chat.placeholder': 'O que vamos construir hoje?',
    'chat.send': 'Enviar',
    'chat.new': 'Novo Chat',
    'chat.ai_chat': 'Chat IA',
    'projects.recent': 'Projetos Recentes',
    'projects.search': 'Buscar projetos...',
    'chat.attach': 'Anexar Arquivos',
    'chat.folder': 'Anexar Pasta',
    'editor.run': 'Executar',
    'editor.analyze': 'Analisar',
    'common.save': 'Salvar',
    'common.cancel': 'Cancelar',
    'common.syncing': 'Sincronizando...',
    'common.synced': 'Sincronizado',
    'common.search': 'Buscar...',
    'common.notifications': 'Notificações',
    'common.share': 'Compartilhar',
    'common.export': 'Exportação Universal',
    'security.pulse': 'Pulso de Segurança',
    'credits.saved': 'Créditos Economizados',
    'agents.active': 'Agentes Ativos',
    'activity.recent': 'Atividade Recente',
    'activity.history': 'Ver histórico completo',
  },
  en: {
    'welcome.title': 'Welcome to MAXIMUS.DEV',
    'welcome.subtitle': 'Your AI-First Development Platform',
    'nav.workspace': 'Workspace',
    'nav.dashboard': 'Dashboard',
    'nav.deployments': 'Deployments',
    'nav.settings': 'Settings',
    'nav.templates': 'Marketplace',
    'nav.monitoring': 'Monitoring',
    'nav.integrations': 'Integrations',
    'nav.docs': 'Documentation',
    'nav.help': 'Help Center',
    'nav.theme': 'Theme',
    'nav.logout': 'Logout',
    'nav.plan_pro': 'Pro Plan',
    'chat.placeholder': 'What are we building today?',
    'chat.send': 'Send',
    'chat.new': 'New Chat',
    'chat.ai_chat': 'AI Chat',
    'projects.recent': 'Recent Projects',
    'projects.search': 'Search projects...',
    'chat.attach': 'Attach Files',
    'chat.folder': 'Attach Folder',
    'editor.run': 'Run',
    'editor.analyze': 'Analyze',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.syncing': 'Syncing...',
    'common.synced': 'Synced',
    'common.search': 'Search...',
    'common.notifications': 'Notifications',
    'common.share': 'Share',
    'common.export': 'Universal Export',
    'security.pulse': 'Security Pulse',
    'credits.saved': 'Credits Saved',
    'agents.active': 'AI Agents Active',
    'activity.recent': 'Recent Activity',
    'activity.history': 'View full history',
  }
};

export const getTranslation = (lang: Language, key: string): string => {
  return translations[lang][key] || key;
};

export type { Language };
