# Acelera Clube — CRM Comercial

Sistema CRM integrado ao ECS Plus com programa de fidelidade e cashback.

## Como executar

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173` — a **home** (`/`) com opções de entrar ou cadastrar.

## Autenticação

| Rota | Descrição |
|------|-----------|
| `/` | Página inicial |
| `/login` | Entrar no sistema |
| `/cadastro` | Criar conta de cliente |
| `/dashboard` | Área do cliente |
| `/admin` | Painel administrativo |

### Conta admin (desenvolvimento)

| E-mail | Senha |
|--------|-------|
| `admin@aceleraclube.com.br` | `AceleraAdmin2026!` |

Contas admin são criadas apenas via script (`npm run firebase:seed`). Cadastro público cria perfil com papel `client`.

## Firebase

```bash
npm run firebase:deploy    # rules + indexes
npm run firebase:seed      # contas admin (requer service account)
npm run firebase:seed:clients  # clientes de exemplo
```
