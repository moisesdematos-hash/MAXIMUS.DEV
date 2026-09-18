import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, AlertCircle } from 'lucide-react';

interface PublishedAppProps {
  projectId: string;
}

const PublishedApp: React.FC<PublishedAppProps> = ({ projectId }) => {
  const [code, setCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApp = async () => {
      try {
        const { data, error: err } = await supabase
          .from('projects')
          .select('code, is_public')
          .eq('id', projectId)
          .single();

        if (err || !data) {
          throw new Error('Aplicativo não encontrado ou ocorreu um erro no banco de dados.');
        }

        if (!data.is_public) {
          throw new Error('Este aplicativo é privado. O criador precisa publicá-lo primeiro.');
        }

        setCode(data.code);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApp();
  }, [projectId]);

  if (loading) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Carregando Maximus Cloud...</h2>
      </div>
    );
  }

  if (error || !code) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Erro 404</h2>
        <p className="text-gray-500 dark:text-gray-400">{error || 'Código não encontrado.'}</p>
      </div>
    );
  }

  // Gera o HTML do IFRAME com Babel idêntico ao do Preview
  const srcDoc = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>App via Maximus Cloud</title>
      <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
      <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
      <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
      <script src="https://cdn.tailwindcss.com"></script>
      <!-- ESM CDN Support for extra packages can be dynamically extracted, but we load lucide by default -->
      <script src="https://unpkg.com/lucide@latest"></script>
      <style>
        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; }
      </style>
    </head>
    <body>
      <div id="root"></div>
      <script type="text/babel">
        try {
          const { useState, useEffect, useRef, useMemo, useCallback } = React;
          
          // Inject code here
          ${code}
          
          if (typeof App !== 'undefined') {
            const root = ReactDOM.createRoot(document.getElementById('root'));
            root.render(<App />);
            // Initialize lucide icons if used natively
            setTimeout(() => { if (window.lucide) window.lucide.createIcons(); }, 100);
          } else {
            document.getElementById('root').innerHTML = '<div style="padding:20px;color:red;font-family:sans-serif;">O componente App n\u00E3o foi exportado no c\u00F3digo.</div>';
          }
        } catch (err) {
          document.getElementById('root').innerHTML = '<div style="padding:20px;color:red;font-family:sans-serif;"><h3>Erro de Runtime:</h3><pre>' + err.message + '</pre></div>';
        }
      </script>
    </body>
    </html>
  `;

  return (
    <div className="w-screen h-screen relative">
      <iframe
        title="Published App"
        srcDoc={srcDoc}
        className="w-full h-full border-none"
        sandbox="allow-scripts allow-forms allow-popups allow-modals"
      />
      
      {/* Selo do Maximus */}
      <a 
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur border border-gray-200 dark:border-gray-700 shadow-lg px-4 py-2 rounded-full flex items-center space-x-2 opacity-60 hover:opacity-100 transition-opacity z-50 text-decoration-none"
      >
        <div className="w-5 h-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
          <span className="text-white text-[10px] font-bold">M</span>
        </div>
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">Built with MAXIMUS</span>
      </a>
    </div>
  );
};

export default PublishedApp;
