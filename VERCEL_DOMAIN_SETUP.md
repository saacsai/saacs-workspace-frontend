# Configurar Domínio no Vercel - Passo a Passo

## Depois de fazer Deploy no Vercel

Após o projeto estar deployado no Vercel, você vai ver uma tela assim:

### 1. No Dashboard do Vercel

1. Ir para seu projeto `saacs-workspace-frontend`
2. Clicar em **"Settings"** (engrenagem no topo)
3. Clicar em **"Domains"** no menu esquerdo
4. Você verá uma URL como: `saacs-workspace-frontend.vercel.app`

### 2. Adicionar seu Domínio

1. No campo "Domain", digitar: `workspace.saacs.com.br`
2. Clicar "Add"
3. Vercel vai mostrar **DUAS OPÇÕES**:

**Opção A: Usando Nameservers (mais fácil)**
```
Vercel vai mostrar 4 nameservers assim:
- ns1.vercel.com
- ns2.vercel.com
- ns3.vercel.com
- ns4.vercel.com
```

**Opção B: Usando CNAME (se não quiser trocar nameservers)**
```
Vercel vai mostrar algo assim:
Apontador: cname.vercel.com.
```

## Recomendação: Use CNAME (Opção B)

### No seu DNS Provider (Cloudflare, GoDaddy, etc)

1. Acessar painel de DNS do seu domínio
2. Adicionar um novo registro:
   - **Tipo**: CNAME
   - **Host/Name**: `workspace` (ou `workspace.saacs.com.br`)
   - **Value/Points to**: `cname.vercel.com.` (o Vercel te mostra o exato)
3. Salvar

### Exemplo Cloudflare:
```
Type: CNAME
Name: workspace.saacs.com.br
Target: cname.vercel.com.
TTL: Auto
```

### Exemplo GoDaddy:
```
Record Type: CNAME
Name: workspace
Value: cname.vercel.com.
TTL: 1 hour
```

## Verificar se funcionou

Depois de adicionar o CNAME, aguarde 5-15 min e:

```bash
# Verificar DNS
nslookup workspace.saacs.com.br

# Deve retornar algo como:
# Non-authoritative answer:
# workspace.saacs.com.br canonical name = cname.vercel.com.
# cname.vercel.com canonical name = foobarbaz.cname.vercel.com.
```

## Erro: "This domain could not be verified"

Se aparecer isso no Vercel após adicionar:

1. Aguarde 10 minutos a mais
2. Clique "Verify" novamente
3. Se persistir, verifique o CNAME está **exatamente** como Vercel mostrou

## SSL Certificate

Após o domínio estar verificado:

1. Vercel automatically gera SSL
2. Aparece "Provisioning certificate..." por ~5 min
3. Depois muda para "Valid Certificate"

## Testar Final

```bash
# HTTP vai redirecionar para HTTPS
curl https://workspace.saacs.com.br

# Deve retornar o HTML do React app
# Se retornar 404, pode ser que o deployment ainda está processando
# Aguarde 2 min mais e tente novamente
```

## Checklist

- [ ] Projeto deployado no Vercel (URL `*.vercel.app` funcionando)
- [ ] Domínio `workspace.saacs.com.br` adicionado no Vercel
- [ ] CNAME adicionado no seu DNS provider
- [ ] Aguardado 15 min para DNS propagar
- [ ] Domain verificado no Vercel (verde)
- [ ] SSL certificate ativo (verde)
- [ ] `curl https://workspace.saacs.com.br` retorna HTML
- [ ] App carrega no navegador: https://workspace.saacs.com.br

## Se Estiver com Dúvida

Envie uma screenshot do:
1. Dashboard do Vercel mostrando o domain que quer adicionar
2. Painel DNS do seu provider mostrando os nameservers atuais

Posso ajudar de lá!
