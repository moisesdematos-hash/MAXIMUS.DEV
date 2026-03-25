import React from 'react';
import { useUI } from '../contexts/UIContext';
import { collaborationAgent, Collaborator } from '../lib/collaborationAgent';

const PresenceAvatars: React.FC = () => {
  const { collaborators = [], setCollaborators, setActivities, language } = useUI();

  // Sincronização periódica de presença do Nexus
  React.useEffect(() => {
    const updateLoop = () => {
      try {
        const presence = collaborationAgent.getPresence();
        const aiCollabs = collaborationAgent.getOnlineCollaborators();
        
        // Converter presença do Supabase em formato Collaborator
        const humanCollabs: Collaborator[] = presence.map((p: any) => ({
          id: p.id,
          name: p.name,
          role: 'Frontend',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.name}`,
          status: 'online',
          lastAction: 'Visualizando Projeto'
        }));

        const allCollabs = [...humanCollabs, ...aiCollabs];
        setCollaborators(allCollabs);
        setActivities(collaborationAgent.getActivities());
        
        // Broadcast de pulsação para manter a conexão ativa
        collaborationAgent.broadcastActivity('', 'Nexus Active');
      } catch (err) {
        console.error('⚠️ PresenceAvatars Sync Error:', err);
      }
    };
    
    updateLoop();
    const interval = setInterval(updateLoop, 3000);
    return () => clearInterval(interval);
  }, [setCollaborators, setActivities]);

  return (
    <div className="flex -space-x-2 overflow-hidden items-center group cursor-help">
      {collaborators.map((collab) => (
        <div 
          key={collab.id}
          className="relative inline-block"
          title={`${collab.name} (${collab.role}) - ${collab.lastAction || 'Online'}`}
        >
          <img
            className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-900 grayscale-[0.3] hover:grayscale-0 transition-all hover:scale-110"
            src={collab.avatar}
            alt={collab.name}
          />
          <span className={`absolute bottom-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white dark:ring-gray-900 ${
            collab.status === 'online' ? 'bg-emerald-500' : 
            collab.status === 'busy' ? 'bg-red-500 animate-pulse' : 'bg-gray-400'
          }`} />
        </div>
      ))}
      
      {/* Contador de Agentes em Espera */}
      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 ring-2 ring-white dark:ring-gray-900 ml-1">
        <span className="text-[10px] font-bold text-gray-500">+2</span>
      </div>
      
      {/* Label Discreto */}
      <span className="ml-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity">
        {language === 'pt' ? 'Agentes Ativos' : 'AI Agents Active'}
      </span>
    </div>
  );
};

export default PresenceAvatars;
