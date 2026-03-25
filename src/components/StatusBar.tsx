import React from 'react';
import { Zap, Activity, Shield, Globe } from 'lucide-react';
import { useUI } from '../contexts/UIContext';
import QuantumShield from './QuantumShield';

const StatusBar: React.FC = () => {
  const { language } = useUI();
  
  // Mock metrics (in a real app, these would come from a monitoring hook)
  const metrics = {
    credits: 2450,
    latency: 12,
    security: 'A+',
    cloud: 'OK'
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-6 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 z-50 flex items-center justify-between px-3 text-[10px] font-mono select-none">
      {/* Left Segment: System Status */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1.5" title="Neural Credits">
          <Zap className="w-3 h-3 text-yellow-500 fill-current" />
          <span className="text-yellow-600 dark:text-yellow-400 font-bold">-{metrics.credits} CR</span>
        </div>
        
        <div className="flex items-center space-x-1.5" title="System Latency">
          <Activity className="w-3 h-3 text-green-500" />
          <span className="text-gray-500">{metrics.latency}ms</span>
        </div>

        <div className="flex items-center space-x-1.5" title="OWASP Security Grade">
          <Shield className="w-3 h-3 text-blue-500" />
          <span className="text-gray-500">SEC: {metrics.security}</span>
        </div>

        <div className="flex items-center space-x-1.5" title="Multi-Cloud Status">
          <Globe className="w-3 h-3 text-purple-500" />
          <span className="text-gray-500 uppercase">Cloud: {metrics.cloud}</span>
        </div>
      </div>

      {/* Center Segment: Context Information (Optional) */}
      <div className="hidden sm:block text-gray-400 font-medium">
         MAXIMUS.DEV NEURAL PROTOCOL v4.2 // SOVEREIGN ENGINE ACTIVE
      </div>

      {/* Right Segment: Integrated Widgets */}
      <div className="flex items-center space-x-3">
         <QuantumShield isMinimal />
         <div className="flex items-center space-x-1 mr-2 border-l border-gray-200 dark:border-gray-800 pl-3">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[9px] text-gray-400 uppercase font-black tracking-widest">Live</span>
         </div>
      </div>
    </div>
  );
};

export default StatusBar;
