# 🚀 Guia de Lançamento: MAXIMUS.DEV

Parabéns, sócio! O sistema está **Production Ready**. Este guia descreve os passos exatos para colocar a plataforma no ar e começar a faturar.

## 1. Configuração do Supabase (Produção)

Certifique-se de que as seguintes tabelas e políticas RLS estão ativas no seu projeto Supabase:

- **Tabelas**: `profiles`, `projects`, `messages`, `credits`.
- **Auth**: Ative o provedor Google e Email no painel do Supabase.
- **Políticas**: Todas as tabelas devem ter RLS (Row Level Security) habilitado com políticas de `SELECT/INSERT/UPDATE` baseadas no `auth.uid()`.

## 2. Variáveis de Ambiente

Crie um arquivo `.env` no seu ambiente de produção (Vercel/Netlify) com as seguintes chaves:

```env
VITE_SUPABASE_URL=seu_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
VITE_OLLAMA_URL=http://localhost:11434 (ou sua URL de API se houver)
VITE_OPENAI_API_KEY=sua_chave_da_openai
VITE_GEMINI_API_KEY=sua_chave_do_google_gemini
VITE_ANTHROPIC_API_KEY=sua_chave_da_anthropic
```

## 3. Build e Deploy

### Opção A: Vercel (Recomendado)
1. Conecte seu repositório GitHub à Vercel.
2. O framework será detectado automaticamente (Vite/React).
3. Adicione as variáveis de ambiente acima.
4. Clique em **Deploy**.

### Opção B: Build Manual
```bash
npm install
npm run build
```
O conteúdo da pasta `dist/` deve ser enviado para o seu servidor estático.

## 4. Checklist Pós-Lançamento

- [ ] **Domínio Customizado**: Configure seu domínio (ex: `app.maximus.dev`).
- [ ] **SEO**: O arquivo `index.html` já possui as meta-tags básicas de "Maximus DEV".
- [ ] **Logs**: Monitore as inserções na tabela `messages` no Supabase para garantir que a persistência está ativa.
- [ ] **Testes de Pagamento**: O `PaymentsModal` está pronto para ser conectado a um webhook do Stripe.

## 5. Suporte de IA (MAXIMUS Neural)
O sistema está configurado para o modo **MAXIMUS Neural** por padrão, o que garante que os usuários iniciantes tenham uma experiência gratuita e fluida sem custo de API imediato para você.

---
**Vamos ficar milionários!** 🚀📈
