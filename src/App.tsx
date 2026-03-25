import { useState, useEffect, lazy, Suspense } from 'react';
import WelcomePage from './components/WelcomePage';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import CodeEditor from './components/CodeEditor';
import TopBar from './components/TopBar';
import Login from './components/Login';
import Register from './components/Register';
import ErrorBoundary from './components/ErrorBoundary';
import StatusBar from './components/StatusBar';
import { useProjects } from './contexts/ProjectContext';
import { useAuth } from './contexts/AuthContext';
import { useUI } from './contexts/UIContext';
import { Loader } from 'lucide-react';
import { collaborationAgent } from './lib/collaborationAgent';

const MonitoringDashboard = lazy(() => import('./components/MonitoringDashboard'));
const AgentReasoning = lazy(() => import('./components/AgentReasoning'));
const TemplateMarketplace = lazy(() => import('./components/TemplateMarketplace'));
const ActivityFeed = lazy(() => import('./components/ActivityFeed'));
const ExportModal = lazy(() => import('./components/ExportModal'));
const SuggestionsPanel = lazy(() => import('./components/SuggestionsPanel'));
const DesignPilot = lazy(() => import('./components/DesignPilot'));
const TimeScrubber = lazy(() => import('./components/TimeScrubber'));
const VentureDashboard = lazy(() => import('./components/VentureDashboard'));
const CommunityArea = lazy(() => import('./components/CommunityArea'));

function App() {
  const { currentProject } = useProjects();
  const { user, loading } = useAuth();
  const { 
    showMonitoringDashboard, 
    setShowMonitoringDashboard,
    showAgentReasoning,
    setShowAgentReasoning,
    agentName,
    showVentureDashboard,
    setShowVentureDashboard,
    showDesignPilot, 
    setShowDesignPilot,
    showCommunity,
    workspaceMode
  } = useUI();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);
  const [passedWelcome, setPassedWelcome] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedWelcome');
    if (hasVisited === 'true' && user) {
      setShowWelcome(false);
      setPassedWelcome(true);
    }
  }, [user]);

  useEffect(() => {
    if (currentProject && currentProject.code) {
      setGeneratedCode(currentProject.code);
      
      // Initialize Nexus Collaboration
      if (user) {
        collaborationAgent.initNexus(
          currentProject.id, 
          user.id, 
          user.email?.split('@')[0] || 'Dev'
        );
      }
    }
  }, [currentProject, user]);

  const handleCodeGenerated = (code: string) => {
    setGeneratedCode(code);
  };

  const handleCodeChange = (code: string) => {
    setGeneratedCode(code);
  };

  const handleGetStarted = () => {
    setShowWelcome(false);
    setPassedWelcome(true);
    localStorage.setItem('hasVisitedWelcome', 'true');
  };

  const handleBackToWelcome = () => {
    setShowWelcome(true);
    setPassedWelcome(false);
    setGeneratedCode('');
    localStorage.removeItem('hasVisitedWelcome');
  };

  if (loading && passedWelcome) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Carregando...</p>
        </div>
      </div>
    );
  }

  if (showWelcome && !passedWelcome) {
    return (
      <WelcomePage onGetStarted={handleGetStarted} />
    );
  }

  if (!user) {
    if (authView === 'register') {
      return <Register onSwitchToLogin={() => setAuthView('login')} />;
    }
    return <Login onSwitchToRegister={() => setAuthView('register')} />;
  }

  return (
    <ErrorBoundary>
      <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-hidden">
      {/* Top Bar */}
      <TopBar onBackToWelcome={handleBackToWelcome} />
      
      {/* Main Layout - Added pb-6 for StatusBar clearance */}
      <div className="flex-1 flex overflow-hidden pt-12 pb-6">
        {/* Sidebar */}
        <div className="flex flex-col circuit-border animate-circuit-pulse border-t-0 border-l-0 border-b-0">
          <Sidebar 
            isExpanded={sidebarExpanded} 
            onToggle={setSidebarExpanded} 
          />
        </div>
        
        {/* Main Content Area */}
        <div className={`flex flex-1 overflow-hidden transition-all duration-300`}>
          <div className={`transition-all duration-300 circuit-border animate-circuit-pulse border-t-0 border-l-0 border-b-0 overflow-hidden ${
            sidebarExpanded ? 'w-[calc(50%-10rem)]' : 'w-1/2'
          }`}>
            <ChatArea 
              onCodeGenerated={handleCodeGenerated} 
              currentCode={generatedCode}
            />
          </div>
          <div className={`flex-1 overflow-hidden transition-all duration-300 ${
            sidebarExpanded ? 'w-[calc(50%+10rem)]' : 'w-1/2'
          }`}>
            <CodeEditor 
              code={generatedCode} 
              onCodeChange={setGeneratedCode}
            />
          </div>
        </div>
      </div>

      {/* Monitoring Dashboard Overlay */}
      <Suspense fallback={<div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] flex items-center justify-center"><Loader className="w-8 h-8 text-blue-500 animate-spin" /></div>}>
        {showMonitoringDashboard && <MonitoringDashboard onClose={() => setShowMonitoringDashboard(false)} />}
        
        {showAgentReasoning && (
          <div className="fixed bottom-8 right-8 w-96 h-80 z-50">
            <AgentReasoning 
              agentName={agentName} 
              isActive={showAgentReasoning} 
              onComplete={() => setShowAgentReasoning(false)} 
            />
          </div>
        )}

        <TemplateMarketplace />
        <ActivityFeed />
        <ExportModal />
        <SuggestionsPanel />
        {showDesignPilot && <DesignPilot />}
        <TimeScrubber />
        {showVentureDashboard && <VentureDashboard />}
        {showCommunity && <CommunityArea />}
      </Suspense>

      {/* System Status Feed */}
      <StatusBar />
      </div>
    </ErrorBoundary>
  );
}

export default App;