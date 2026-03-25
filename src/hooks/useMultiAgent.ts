import { useState, useEffect, useCallback } from 'react';
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

  const orchestrateFeature = useCallback(async (prompt: string, history: any[] = [], modelId: string = 'maximus-neural', projectId?: string) => {
    const result = await orchestrator.orchestrateFeatureCreation(prompt, history, modelId, projectId);
    setStatus(orchestrator.getFullSystemStatus());
    return result;
  }, [orchestrator]);

  const orchestrateDeploy = useCallback(async (code: string) => {
    const result = await orchestrator.orchestrateSafeDeploy(code);
    setStatus(orchestrator.getFullSystemStatus());
    return result;
  }, [orchestrator]);

  const getBlueprintInit = useCallback(async (blueprintId: string) => {
    return orchestrator.getBlueprintInitialization(blueprintId);
  }, [orchestrator]);

  const getCollabData = useCallback(() => {
    return orchestrator.getCollaborationData();
  }, [orchestrator]);

  const logAction = useCallback((agentId: string, action: string) => {
    orchestrator.logAgentAction(agentId, action);
    setStatus(orchestrator.getFullSystemStatus());
  }, [orchestrator]);

  return { 
    status, 
    orchestrateFeature, 
    orchestrateDeploy,
    getBlueprintInit,
    getCollabData,
    logAction
  };
};
