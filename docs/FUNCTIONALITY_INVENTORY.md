# FUNCTIONALITY_INVENTORY (Gate 2)

**Data da Auditoria:** 18 de Setembro de 2026
**Sistema:** MAXIMUS.DEV Alpha

| ID | Funcionalidade | Localização | Dependências | Estado | Testada |
| -- | -------------- | ----------- | ------------ | ------ | ------- |
| F01 | Autenticação Google OAuth | `Login.tsx`, `AuthContext` | Supabase Auth, Google Cloud | OK | Parcial |
| F02 | Criação de Projetos | `ProjectContext.tsx` | Supabase DB (`projects`) | Falha (500) | Não |
| F03 | Orquestração Multi-Agente | `multiAgentSystem.ts` | Groq API, Supabase | OK | Sim |
| F04 | Ingestão de Contexto (GitHub/PDF) | `ingestionAgent.ts` | APIs Externas, CORS Proxy | OK | Sim |
| F05 | Tarefas Agendadas (Cron) | `cronAgent.ts` | Memory (`setInterval`) | OK | Sim |
| F06 | Deploy Vercel "Ghost Portability" | `ghostPortability.ts` | Vercel REST API, Vercel Token | OK | Sim |
| F07 | Native Hosting (Cloud Maximus) | `App.tsx`, `PublishedApp.tsx`| `window.location.pathname` | OK | Sim |
| F08 | Voice Commands (Mic) | `ChatArea.tsx` | Web Speech API | OK | Sim |
| F09 | Multiplayer (Code Collab) | `useMultiplayer.ts` | Supabase Realtime Channels | OK | Sim |
| F10 | Terminal Simulado | `Terminal.tsx` | Nenhuma | OK | Parcial |
| F11 | Dashboard de Performance | `MonitoringDashboard.tsx` | `PerformanceAgent` | OK | Não |
| F12 | Gestão de Dependências | `DependencyManager.tsx` | NPM Registry API (Mock/Real) | OK | Não |
| F13 | Mercado de Templates | `TemplateMarketplace.tsx` | Nenhuma | OK | Não |

### Funcionalidades Ocultas / Acessíveis via URL
- Rota de Deploy Nativo: Qualquer URL com o formato `https://maximus-dev.vercel.app/app/:projectId` renderiza a visualização isolada do código gerado usando o `@babel/standalone`.
