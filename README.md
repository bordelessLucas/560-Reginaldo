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
| `/admin` | Painel administrativo (clientes, compras, cashback) |

### Conta admin (desenvolvimento)

| E-mail | Senha |
|--------|-------|
| `admin@aceleraclube.com.br` | `AceleraAdmin2026!` |

Contas admin são criadas apenas via script (`npm run firebase:seed`). Cadastro público cria perfil com papel `client`.

## Fluxo Acelera Clube (Sprints 3–5)

1. Configurar participação e cashback do cliente
2. Registrar compra + nota fiscal
3. Sistema calcula cashback pela tabela progressiva (centavos)
4. Histórico visível na edição do cliente

### Tabela demonstrativa de cashback

| Valor da compra | Percentual |
|-----------------|------------|
| Até R$ 100,00 | 0,5% |
| Até R$ 500,00 | 5% |
| Até R$ 1.000,00 | 10% |
| Acima de R$ 1.000,00 | 10% |

## Firebase

```bash
npm run firebase:deploy    # rules + indexes
npm run firebase:seed      # contas admin (requer service account)
npm run firebase:seed:clients  # clientes de exemplo
```
