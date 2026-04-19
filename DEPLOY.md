# Deploy no Vercel - Workspace Frontend SAACS

## Pré-requisitos

1. **GitHub**: Criar repositório `saacs-workspace-frontend`
2. **Vercel**: Conta criada (pode usar conta GitHub)
3. **Domínio**: `workspace.saacs.com.br` apontando para Vercel (feito no DNS)

## Passo 1: Push para GitHub

```bash
cd /Users/lucianomaeda/workspace-frontend

# Adicionar remote (substituir URL_DO_REPO pela URL do seu repositório)
git remote add origin https://github.com/seu-usuario/saacs-workspace-frontend.git

# Push
git branch -M main
git push -u origin main
```

## Passo 2: Deploy no Vercel

### Opção A: Via CLI Vercel

```bash
npm install -g vercel
vercel
# Seguir as instruções na tela
```

### Opção B: Via Dashboard Vercel

1. Ir para https://vercel.com
2. Clicar "New Project"
3. Selecionar repositório `saacs-workspace-frontend`
4. Verificar settings:
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Adicionar variáveis de ambiente:
   - `VITE_API_URL`: `https://mcp.saacs.com.br`
   - `VITE_NOTION_CLIENT_ID`: (deixar em branco por enquanto)
6. Clicar "Deploy"

## Passo 3: Apontar Domínio

No seu DNS provider (Cloudflare, GoDaddy, etc):

```
Domínio: workspace.saacs.com.br
Tipo: CNAME
Valor: cname.vercel.com.
```

Vercel vai gerar um CNAME específico, use o que aparecer no dashboard.

## Passo 4: Configurar SSL (Vercel faz automaticamente)

Vercel gera certificado SSL automaticamente. Pode demorar 5-10 min.

## Passo 5: Testar

Após ~5 min do deploy:

```bash
# Testar acesso
curl https://workspace.saacs.com.br

# Dever retornar HTML da app
```

## Variáveis de Ambiente (Atualizar depois)

Quando tiver OAuth Notion:

```
VITE_NOTION_CLIENT_ID=seu_id_aqui
VITE_NOTION_REDIRECT_URI=https://workspace.saacs.com.br/setup
```

## Troubleshooting

**"404 Not Found"**
- Aguardar 10 min para DNS propagar
- Verificar CNAME está correto

**"Build failed"**
- Verificar logs do Vercel
- Comum: falta Node.js version, ver em `package.json`

**"API calls returning 401"**
- Verificar `VITE_API_URL` está correto
- MCP server deve estar online: `curl https://mcp.saacs.com.br/health`

## Checklist Final

- [ ] Repositório criado no GitHub
- [ ] Code pushed
- [ ] Projeto importado no Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Domínio apontando para Vercel
- [ ] SSL ativo (verde no navegador)
- [ ] Acesso a `https://workspace.saacs.com.br` funciona
- [ ] Access token gerado e link aberto
- [ ] Fluxo completo testado

## Rollback

Se der problema, simples:
- No Vercel dashboard, clicar "Deployments"
- Selecionar deployment anterior
- Clicar "Promote to Production"

Leva 1 min.
