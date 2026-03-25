import { createContext, useContext, useState, ReactNode } from 'react';
import { Language } from '../lib/i18n';

interface UIContextType {
  showAIAssistant: boolean;
  setShowAIAssistant: (show: boolean) => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  showTemplates: boolean;
  setShowTemplates: (show: boolean) => void;
  showDocs: boolean;
  setShowDocs: (show: boolean) => void;
  showDatabaseModal: boolean;
  setShowDatabaseModal: (show: boolean) => void;
  showPaymentsModal: boolean;
  setShowPaymentsModal: (show: boolean) => void;
  showIntegrations: boolean;
  setShowIntegrations: (show: boolean) => void;
  showSearchModal: boolean;
  setShowSearchModal: (show: boolean) => void;
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  showHelpCenter: boolean;
  setShowHelpCenter: (show: boolean) => void;
  showShareModal: boolean;
  setShowShareModal: (show: boolean) => void;
  showCommunity: boolean;
  setShowCommunity: (show: boolean) => void;
  showMonitoringDashboard: boolean;
  setShowMonitoringDashboard: (show: boolean) => void;
  showAgentReasoning: boolean;
  setShowAgentReasoning: (show: boolean) => void;
  agentName: string;
  setAgentName: (name: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  securityStatus: 'clean' | 'warning' | 'critical';
  setSecurityStatus: (status: 'clean' | 'warning' | 'critical') => void;
  vulnerabilities: any[];
  setVulnerabilities: (vulns: any[]) => void;
  collaborators: any[];
  setCollaborators: (collabs: any[]) => void;
  activities: any[];
  setActivities: (activities: any[]) => void;
  showExportModal: boolean;
  setShowExportModal: (show: boolean) => void;
  globalSavings: number;
  setGlobalSavings: (savings: number) => void;
  showSuggestions: boolean;
  setShowSuggestions: (show: boolean) => void;
  suggestions: any[];
  setSuggestions: (suggestions: any[]) => void;
  showDesignPilot: boolean;
  setShowDesignPilot: (show: boolean) => void;
  showTimeTravel: boolean;
  setShowTimeTravel: (show: boolean) => void;
  showVentureDashboard: boolean;
  setShowVentureDashboard: (show: boolean) => void;
  workspaceMode: 'standard' | 'agent';
  setWorkspaceMode: (mode: 'standard' | 'agent') => void;
  showPulse: boolean;
  setShowPulse: (show: boolean) => void;
  credits: number;
  setCredits: React.Dispatch<React.SetStateAction<number>>;
  isPlanningActive: boolean;
  setIsPlanningActive: React.Dispatch<React.SetStateAction<boolean>>;
  chatInteractionType: 'chat' | 'create' | 'claw' | 'subscription' | 'history';
  setChatInteractionType: (type: 'chat' | 'create' | 'claw' | 'subscription' | 'history') => void;
  openClawStatus: 'offline' | 'online' | 'busy';
  setOpenClawStatus: (status: 'offline' | 'online' | 'busy') => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const [showDatabaseModal, setShowDatabaseModal] = useState(false);
  const [showPaymentsModal, setShowPaymentsModal] = useState(false);
  const [showIntegrations, setShowIntegrations] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelpCenter, setShowHelpCenter] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCommunity, setShowCommunity] = useState(false);
  const [showMonitoringDashboard, setShowMonitoringDashboard] = useState(false);
  const [showAgentReasoning, setShowAgentReasoning] = useState(false);
  const [agentName, setAgentName] = useState('Orchestrator');
  const [language, setLanguage] = useState<Language>('pt');
  const [securityStatus, setSecurityStatus] = useState<'clean' | 'warning' | 'critical'>('clean');
  const [vulnerabilities, setVulnerabilities] = useState<any[]>([]);
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [globalSavings, setGlobalSavings] = useState(2450);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showDesignPilot, setShowDesignPilot] = useState(false);
  const [showTimeTravel, setShowTimeTravel] = useState(false);
  const [showVentureDashboard, setShowVentureDashboard] = useState(false);
  const [workspaceMode, setWorkspaceMode] = useState<'standard' | 'agent'>('standard');
  const [showPulse, setShowPulse] = useState(false);
  const [chatInteractionType, setChatInteractionType] = useState<'chat' | 'create' | 'claw' | 'subscription' | 'history'>('chat');
  const [credits, setCredits] = useState(1500);
  const [isPlanningActive, setIsPlanningActive] = useState(true);
  const [openClawStatus, setOpenClawStatus] = useState<'offline' | 'online' | 'busy'>('offline');

  const value = {
    showAIAssistant,
    setShowAIAssistant,
    showSettings,
    setShowSettings,
    showTemplates,
    setShowTemplates,
    showDocs,
    setShowDocs,
    showDatabaseModal,
    setShowDatabaseModal,
    showPaymentsModal,
    setShowPaymentsModal,
    showIntegrations,
    setShowIntegrations,
    showSearchModal,
    setShowSearchModal,
    showNotifications,
    setShowNotifications,
    showHelpCenter,
    setShowHelpCenter,
    showShareModal,
    setShowShareModal,
    showCommunity,
    setShowCommunity,
    showMonitoringDashboard,
    setShowMonitoringDashboard,
    showAgentReasoning,
    setShowAgentReasoning,
    agentName,
    setAgentName,
    language,
    setLanguage,
    securityStatus,
    setSecurityStatus,
    vulnerabilities,
    setVulnerabilities,
    collaborators,
    setCollaborators,
    activities,
    setActivities,
    showExportModal,
    setShowExportModal,
    globalSavings,
    setGlobalSavings,
    showSuggestions,
    setShowSuggestions,
    suggestions,
    setSuggestions,
    showDesignPilot,
    setShowDesignPilot,
    showTimeTravel,
    setShowTimeTravel,
    showVentureDashboard,
    setShowVentureDashboard,
    showPulse,
    setShowPulse,
    workspaceMode,
    setWorkspaceMode,
    credits,
    setCredits,
    isPlanningActive,
    setIsPlanningActive,
    chatInteractionType,
    setChatInteractionType,
    openClawStatus,
    setOpenClawStatus,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};
