# SYSTEM_MAP (Gate 1)

**Data da Auditoria:** 18 de Setembro de 2026
**Sistema:** MAXIMUS.DEV Alpha

## 1. FRONTEND (Vite + React + Tailwind)
- **Framework & Roteamento:** Não utiliza React Router formal (SPA de página única baseada em estado condicional `App.tsx` e `window.location.pathname` para interceptar rotas de apps publicados).
- **Componentes Principais (UI):**
  - Layout: `Sidebar`, `TopBar`, `ResizableLayout`.
  - Core: `ChatArea` (Input e Histórico), `CodeEditor` (Edição ao vivo).
  - Orbitais: `MonitoringDashboard`, `DesignPilot`, `VentureDashboard`, `ActivityFeed`, `CommunityArea`.
  - Modais: `SettingsModal`, `IntegrationsModal`, `ExportModal`.
- **Estados & Contextos:**
  - `AuthContext` (Sessões Supabase).
  - `ProjectContext` (Gerenciamento de arquivos e projetos).
  - `ThemeContext` (Dark/Light).
  - `UIContext` (Visibilidade de modais e orbitais).
- **Serviços / Hooks Específicos:**
  - `useMultiplayer.ts` (Sincronização em tempo real via Supabase Channels).
  - `useMultiAgent.ts` (Ponte para o backend de I.A).

## 2. BACKEND (Node-Like Client-Side Agents)
- O backend tradicional (Node.js/Express) é substituído por uma arquitetura "Serverless Agentic" que roda diretamente no client comunicando-se com serviços externos:
- **Orquestrador:** `multiAgentSystem.ts` (MultiAgentOrchestrator).
- **Agentes Funcionais:** 
  - `frontendAgent`, `backendAgent`, `databaseAgent`, `securityAgent`, `testingAgent`.
  - Especiais: `cronAgent` (Tarefas de background usando setIntervals em memória), `researchAgent`, `ingestionAgent` (Scraping de GitHub e PDFs), `grepAgent`.
- **Serviços Base:**
  - `aiService.ts` (Groq/Ollama API Fetcher).
  - `ghostPortability.ts` (Deploy direto via Vercel REST API).

## 3. DATABASE (Supabase PostgreSQL)
- **Tabelas Identificadas (Implícitas no código):**
  - `projects` (id, title, content, user_id, updated_at).
  - `user_integrations` (id, user_id, service_id, config, status).
  - `messages` (id, project_id, role, content, timestamp).
  - Auth tables (Nativas do Supabase Auth).
- **Relacionamentos:**
  - Usuários (Auth) -> Projetos -> Mensagens.
  - Usuários (Auth) -> Integrações.

## 4. INFRAESTRUTURA
- **Hospedagem Frontend:** Vercel (Production / Preview Environments).
- **Domínio Principal:** maximus-dev.vercel.app.
- **Autenticação:** Supabase Auth (Google OAuth Configurado no GCP + Email/Senha).
- **Deployment Contínuo:** GitHub (branch `master`) integrado ao Vercel `vercel.json` configurado para SPA rewrites (`rewrites: [{ "source": "/(.*)", "destination": "/index.html" }]`).
- **Secret Management:** Supabase Anon Key e API URL em variáveis de ambiente da Vercel. Chaves Groq injetadas diretamente na I.A no frontend.
