# SAACS Workspace Frontend

Frontend Phase 1 para o sistema SAACS de gestão de projetos TILAPIA.

## Stack

- React 18 + Vite + TypeScript
- Tailwind CSS
- React Router DOM
- Anthropic Claude + OpenAI + Google Gemini

## Setup

1. Clone o repositório:
```bash
git clone https://github.com/seu-repo/workspace-frontend.git
cd workspace-frontend
```

2. Instale dependências:
```bash
npm install
```

3. Configure variáveis de ambiente:
```bash
cp .env.example .env.local
# Edite .env.local com suas configurações
```

## Desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:3000`

## Build para produção

```bash
npm run build
npm run preview
```

## Fluxo de Autenticação

1. Usuário clica link do email: `workspace.saacs.com.br/?access_token=xxx`
2. `/` valida o token com backend
3. Redireciona para `/setup`
4. Usuário configura API key + conecta Notion
5. Redireciona para `/chat`
6. Chat persiste histórico no Supabase

## Estrutura

```
src/
├── pages/          # Páginas (TokenValidation, Setup, Chat)
├── components/     # Componentes reutilizáveis
├── hooks/          # Custom hooks (useSession, useChat)
├── api/            # Cliente HTTP
└── styles/         # CSS global
```

## Endpoints da API

- `POST /api/workspace/validate-access-token` — valida token
- `POST /api/workspace/save-api-key` — salva API key do usuário
- `POST /api/chat/message` — envia mensagem
- `GET /api/chat/history` — busca histórico
- `POST /api/notion/connect` — OAuth Notion

## Deploy

Conecte o repositório ao Vercel para deploy automático em cada push.

### Variáveis de Ambiente no Vercel

```
VITE_API_URL=https://mcp.saacs.com.br
VITE_NOTION_CLIENT_ID=seu_id_aqui
```
