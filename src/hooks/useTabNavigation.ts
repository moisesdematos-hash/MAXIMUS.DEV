export interface TabNavigationState {
  activeTab: string;
  tabHistory: string[];
  tabHistoryIndex: number;
  navigateToTab: (tabId: string) => void;
  goBackTab: () => void;
  goForwardTab: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
}

import { useState } from 'react';

export const useTabNavigation = (initialTab: string = 'profile'): TabNavigationState => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [tabHistory, setTabHistory] = useState<string[]>([initialTab]);
  const [tabHistoryIndex, setTabHistoryIndex] = useState(0);

  const navigateToTab = (tabId: string) => {
    setActiveTab(tabId);
    
    // Update history
    const newHistory = tabHistory.slice(0, tabHistoryIndex + 1);
    newHistory.push(tabId);
    setTabHistory(newHistory);
    setTabHistoryIndex(newHistory.length - 1);
  };

  const goBackTab = () => {
    if (tabHistoryIndex > 0) {
      const newIndex = tabHistoryIndex - 1;
      setTabHistoryIndex(newIndex);
      setActiveTab(tabHistory[newIndex]);
    }
  };

  const goForwardTab = () => {
    if (tabHistoryIndex < tabHistory.length - 1) {
      const newIndex = tabHistoryIndex + 1;
      setTabHistoryIndex(newIndex);
      setActiveTab(tabHistory[newIndex]);
    }
  };

  const canGoBack = tabHistoryIndex > 0;
  const canGoForward = tabHistoryIndex < tabHistory.length - 1;

  return {
    activeTab,
    tabHistory,
    tabHistoryIndex,
    navigateToTab,
    goBackTab,
    goForwardTab,
    canGoBack,
    canGoForward
  };
};