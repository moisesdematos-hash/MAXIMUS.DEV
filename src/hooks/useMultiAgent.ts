import { useState, useEffect } from 'react';
import { MultiAgentOrchestrator } from '../lib/multiAgentSystem';

export const useMultiAgent = () => {
  const orchestrator = MultiAgentOrchestrator.getInstance();
  const [status, setStatus] = useState(orchestrator.getFullSystemStatus());

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(orchestrator.getFullSystemStatus());
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [orchestrator]);

  const orchestrateFeature = async (prompt: string, history: any[] = []) => {
    const result = await orchestrator.orchestrateFeatureCreation(prompt, history);
    setStatus(orchestrator.getFullSystemStatus());
    return result;
  };

  const orchestrateDeploy = async (code: string) => {
    const result = await orchestrator.orchestrateSafeDeploy(code);
    setStatus(orchestrator.getFullSystemStatus());
    return result;
  };

  const getBlueprintInit = async (blueprintId: string) => {
    return orchestrator.getBlueprintInitialization(blueprintId);
  };

  const getCollabData = () => {
    return orchestrator.getCollaborationData();
  };

  const logAction = (agentId: string, action: string) => {
    orchestrator.logAgentAction(agentId, action);
    setStatus(orchestrator.getFullSystemStatus());
  };

  return { 
    status, 
    orchestrateFeature, 
    orchestrateDeploy,
    getBlueprintInit,
    getCollabData,
    logAction
  };
};
