import sys

file_path = "src/components/ErrorBoundary.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace the render method
render_old = """  public render() {
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
                <span>Reset de EmergǦncia</span>
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
  }"""

render_new = """  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-6">
          <div className="max-w-2xl w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 border border-red-200 dark:border-red-900/50">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center">
                <ShieldAlert className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">
                  Pequeno tropeço no componente!
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">O Maximus interceptou um erro, mas você não precisa perder seu trabalho.</p>
              </div>
            </div>
            
            <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-4 mb-8 overflow-auto max-h-40 border border-red-100 dark:border-red-900/20">
              <p className="text-sm font-mono text-red-600 dark:text-red-400 whitespace-pre-wrap">
                {this.state.error?.message || 'Erro desconhecido'}
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="flex-1 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95"
              >
                Ignorar e Continuar
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-bold transition-all active:scale-95"
              >
                <RefreshCcw className="w-4 h-4" />
                <span>Atualizar Página</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }"""

# A generic replace regex just in case formatting differs slightly
import re
content = re.sub(
    r'public render\(\) \{[\s\S]*return this\.props\.children;\s*\}',
    render_new,
    content
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated ErrorBoundary.tsx to be less intrusive")
