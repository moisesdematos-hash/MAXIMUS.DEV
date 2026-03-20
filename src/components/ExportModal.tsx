import React, { useState } from 'react';
import { X, Cloud, Download, Server, Github, Zap, CheckCircle2, ChevronRight, Share2 } from 'lucide-react';
import { useUI } from '../contexts/UIContext';
import { useMultiAgent } from '../hooks/useMultiAgent';

const ExportModal: React.FC = () => {
  const { showExportModal, setShowExportModal, language } = useUI();
  const { orchestrateDeploy, logAction } = useMultiAgent(); // Reusing deploy logic for simulation
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<'vercel' | 'docker' | 'zip' | null>(null);

  if (!showExportModal) return null;

  const handleExport = async (target: 'vercel' | 'docker' | 'zip') => {
    setSelectedTarget(target);
    setIsExporting(true);
    logAction('agent-devops', `Iniciando exportação universal para ${target.toUpperCase()}...`);
    
    // Simulação de empacotamento
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    setIsExporting(false);
    setExportComplete(true);
    logAction('agent-devops', `Projeto exportado com sucesso para ${target.toUpperCase()}.`);
  };

  const exportTargets = [
    {
      id: 'vercel',
      name: 'Vercel / Netlify',
      icon: <Cloud className="w-6 h-6" />,
      description: language === 'pt' ? 'Deploy instantâneo para a borda (edge)' : 'Instant deployment to the edge',
      color: 'blue'
    },
    {
      id: 'docker',
      name: 'Docker Container',
      icon: <Server className="w-6 h-6" />,
      description: language === 'pt' ? 'Contêiner pronto para qualquer infraestrutura' : 'Container ready for any infrastructure',
      color: 'purple'
    },
    {
      id: 'zip',
      name: 'Local Bundle (ZIP)',
      icon: <Download className="w-6 h-6" />,
      description: language === 'pt' ? 'Código-fonte completo e otimizado' : 'Complete and optimized source code',
      color: 'emerald'
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
        
        {/* Header */}
        <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-blue-500/5 to-purple-500/5">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Share2 className="text-white w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {language === 'pt' ? 'Ghost Portability' : 'Universal Export'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {language === 'pt' ? 'Leve seu projeto para qualquer lugar do mundo' : 'Take your project anywhere in the world'}
              </p>
            </div>
          </div>
          <button 
            onClick={() => {
              setShowExportModal(false);
              setExportComplete(false);
              setSelectedTarget(null);
            }}
            className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="p-8">
          {!exportComplete ? (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                {language === 'pt' ? 'Escolha seu destino:' : 'Select your destination:'}
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                {exportTargets.map((target) => (
                  <button
                    key={target.id}
                    disabled={isExporting}
                    onClick={() => handleExport(target.id as any)}
                    className={`group flex items-center p-6 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border-2 border-transparent hover:border-blue-500/50 hover:bg-white dark:hover:bg-gray-800 transition-all text-left ${
                      isExporting && selectedTarget !== target.id ? 'opacity-50 grayscale' : ''
                    } ${isExporting && selectedTarget === target.id ? 'border-blue-500 ring-4 ring-blue-500/10' : ''}`}
                  >
                    <div className={`w-12 h-12 rounded-2xl bg-${target.color}-100 dark:bg-${target.color}-900/30 flex items-center justify-center mr-6 text-${target.color}-600 dark:text-${target.color}-400 group-hover:scale-110 transition-transform`}>
                      {target.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1">{target.name}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">{target.description}</p>
                    </div>
                    {isExporting && selectedTarget === target.id ? (
                      <Zap className="w-5 h-5 text-blue-500 animate-pulse" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-700" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 animate-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {language === 'pt' ? 'Pronto para Decolar!' : 'Ready for Liftoff!'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                {language === 'pt' 
                  ? `Seu projeto foi empacotado e otimizado para ${selectedTarget?.toUpperCase()}. Você já pode realizar o download ou acessar o link de deploy.`
                  : `Your project has been bundled and optimized for ${selectedTarget?.toUpperCase()}. You can now download or access the deployment link.`}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <button className="w-full sm:w-auto px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-black font-bold rounded-2xl hover:scale-105 transition-transform flex items-center justify-center space-x-2">
                  <Download className="w-5 h-5" />
                  <span>{language === 'pt' ? 'Baixar Agora' : 'Download Now'}</span>
                </button>
                <button className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:scale-105 transition-transform flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/30">
                  <ExternalLink className="w-5 h-5" />
                  <span>{language === 'pt' ? 'Ver Deploy' : 'View Deploy'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800 text-center">
          <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
            Powered by Ghost Portability Protocol v2.4
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
