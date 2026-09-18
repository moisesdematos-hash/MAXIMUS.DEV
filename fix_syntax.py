import sys
import re

file_path = "src/lib/ghostPortability.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Define exactly what the new orchestrateDeploy should look like
clean_deploy = """  public async orchestrateDeploy(env: string, code: string): Promise<{ success: boolean; url: string; error?: string }> {
    console.log(`🚀 Orquestrando Deploy Multi-Cloud (${env}) via API Real da Vercel...`);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado.');

      const { data: integration } = await supabase
        .from('user_integrations')
        .select('config')
        .eq('user_id', user.id)
        .eq('service_id', 'vercel')
        .eq('status', 'connected')
        .single();

      if (!integration || !integration.config || !(integration.config as any).accessToken) {
        throw new Error('Token da Vercel não encontrado. Vá em "Conectar Serviços" e adicione seu token.');
      }

      const vercelToken = (integration.config as any).accessToken;

      const payload = {
        name: `maximus-deploy-${Math.random().toString(36).substring(7)}`,
        projectSettings: {
          framework: 'vite'
        },
        files: [
          {
            file: 'package.json',
            data: JSON.stringify({
              name: 'maximus-app',
              private: true,
              version: '0.0.0',
              type: 'module',
              scripts: { dev: 'vite', build: 'tsc && vite build', preview: 'vite preview' },
              dependencies: {
                react: '^18.2.0',
                'react-dom': '^18.2.0',
                'lucide-react': 'latest'
              },
              devDependencies: {
                '@types/react': '^18.2.66',
                '@types/react-dom': '^18.2.22',
                '@vitejs/plugin-react': '^4.2.1',
                typescript: '^5.2.2',
                vite: '^5.2.0',
                tailwindcss: '^3.4.1'
              }
            }, null, 2)
          },
          {
            file: 'index.html',
            data: `<!doctype html>\\n<html lang="en">\\n  <head>\\n    <meta charset="UTF-8" />\\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\\n    <title>Maximus App</title>\\n    <script src="https://cdn.tailwindcss.com"></script>\\n  </head>\\n  <body>\\n    <div id="root"></div>\\n    <script type="module" src="/src/main.tsx"></script>\\n  </body>\\n</html>`
          },
          {
            file: 'vite.config.ts',
            data: `import { defineConfig } from 'vite'\\nimport react from '@vitejs/plugin-react'\\n\\nexport default defineConfig({\\n  plugins: [react()]\\n})`
          },
          {
            file: 'src/main.tsx',
            data: `import React from 'react'\\nimport ReactDOM from 'react-dom/client'\\nimport App from './App.tsx'\\n\\nReactDOM.createRoot(document.getElementById('root')!).render(\\n  <React.StrictMode>\\n    <App />\\n  </React.StrictMode>,\\n)`
          },
          {
            file: 'src/App.tsx',
            data: code
          }
        ]
      };

      const response = await fetch('https://api.vercel.com/v13/deployments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${vercelToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(`Erro na API Vercel: ${errData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      return { success: true, url: `https://${data.url}` };

    } catch (error: any) {
      console.error('Falha no deploy da Vercel:', error);
      return { success: false, url: '', error: error.message };
    }
  }

  public async exportProject("""

# We use regex to match from "public async orchestrateDeploy" up to "public async exportProject("
content = re.sub(
    r'public async orchestrateDeploy[\s\S]*?public async exportProject\(',
    clean_deploy,
    content
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

import os
os.system("git add src/lib/ghostPortability.ts")
os.system('git commit -m "fix: remove dangling syntax error in ghostPortability"')
os.system("git push origin master")
print("Syntax error fixed and pushed")
