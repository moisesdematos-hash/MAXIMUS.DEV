import { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCcw, Home } from 'lucide-react';
import { logError } from '../lib/errorLogger';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🛡️ Sovereign Error Boundary caught an error:', error, errorInfo);
    
    // Log error to Supabase for active monitoring
    logError({
      error_message: error.message,
      stack_trace: error.stack,
      component_stack: errorInfo.componentStack || undefined,
      severity: 'error'
    });
  }

  private handleReset = () => {
    localStorage.removeItem('maximusdev-current-project');
    localStorage.removeItem('hasVisitedWelcome');
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl p-10 border border-red-100 dark:border-red-900/30 text-center">
            <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <ShieldAlert className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
            
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
              Sovereign Restoration
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 mb-10 leading-relaxed font-medium">
              Um componente neural encontrou uma instabilidade. O sistema Maximus pode ser restaurado sem perda de dados permanentes.
            </p>

            <div className="space-y-4">
              <button
                onClick={() => window.location.reload()}
                className="w-full flex items-center justify-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-95"
              >
                <RefreshCcw className="w-5 h-5" />
                <span>Tentar Novamente</span>
              </button>
              
              <button
                onClick={this.handleReset}
                className="w-full flex items-center justify-center space-x-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-4 rounded-2xl font-bold transition-all active:scale-95"
              >
                <Home className="w-5 h-5" />
                <span>Reset de Emergência</span>
              </button>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
               <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">
                 Maximus Security Protocol: Active
               </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
