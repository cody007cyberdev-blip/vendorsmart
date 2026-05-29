# VendorSmart — Sistema de Gestão de Inventário e Vendas

Sistema completo de gestão de inventário e vendas em tempo real com controlo de acessos por perfis, operações de stock, painel do vendedor e ferramentas de apoio à decisão.

## Funcionalidades Implementadas

✅ **Base de Dados Completa** — 11 tabelas (users, products, categories, suppliers, stockMovements, shoppingLists, shoppingListItems, sales, purchaseOrders, purchaseOrderItems, reports)

✅ **Autenticação RBAC** — 4 perfis (admin, manager, vendor, customer) com suporte a 2FA via OTP

✅ **Dashboard em Tempo Real** — Métricas de vendas, stock crítico, movimentos recentes, KPIs adaptados ao perfil

✅ **Catálogo de Produtos** — CRUD completo, filtros por categoria/fornecedor/estado de stock

✅ **Sistema de QR Code** — Página pública `/shop` para clientes criarem listas de compras sem app

✅ **Painel do Vendedor** — `/vendor-panel` com processamento de vendas e histórico de transações

✅ **Gestão de Stock** — Movimentos (entrada, saída, ajuste, transferência) com registo completo

✅ **Ordens de Compra** — Criação, acompanhamento de estado e receção de encomendas

✅ **Exportação de Relatórios** — CSV/Excel com histórico e sistema de backup automático

✅ **Notificações de Stock** — Alertas automáticos quando stock atinge nível mínimo

## Setup e Execução

### 1. Instalar Dependências

```bash
npm install
```

### 2. Preparar Base de Dados

```bash
# Aplicar migrações e popular dados iniciais
npm run db:reset
npm run db:migrate
npm run db:seed
```

### 3. Executar em Desenvolvimento

Abra dois terminais:

**Terminal 1 — Backend (porta 3001):**
```bash
PORT=3001 npm run dev:api
```

**Terminal 2 — Frontend (porta 8080):**
```bash
npm run dev
```

Acesse: http://localhost:8080

### 4. Build para Produção

```bash
npm run build
npm start
```

## Contas de Teste

| Email | Senha | Perfil | Acesso |
|-------|-------|--------|--------|
| admin@vendorsmart.local | admin123 | Admin | Todas as funcionalidades |
| manager@vendorsmart.local | manager123 | Manager | Gestão de stock, vendas, relatórios |
| vendor@vendorsmart.local | vendor123 | Vendor | Processamento de vendas |
| cliente@vendorsmart.local | customer123 | Customer | Criação de listas de compras |

## Rotas Principais

### Públicas
- `GET /` — Landing page
- `GET /login` — Página de login
- `GET /shop` — Loja pública (QR Code)
- `GET /vendor-panel` — Painel do vendedor

### Autenticadas (requerem login)
- `GET /app/dashboard` — Dashboard com métricas
- `GET /app/catalog` — Catálogo de produtos
- `GET /app/movements` — Movimentos de stock
- `GET /app/suppliers` — Gestão de fornecedores
- `GET /app/purchase-orders` — Ordens de compra
- `GET /app/analytics` — Análises e relatórios

## API REST

### Autenticação
```bash
# Login
POST /api/auth/login
{ "email": "admin@vendorsmart.local", "password": "admin123" }

# Verificar 2FA
POST /api/auth/verify-2fa
{ "userId": "...", "code": "000000" }

# Utilizador atual
GET /api/auth/me

# Logout
POST /api/auth/logout
```

### Produtos
```bash
# Listar produtos
GET /api/products?category=...&supplier=...&status=...

# Criar produto
POST /api/products
{ "sku": "...", "name": "...", "sellingPrice": 9.99, ... }

# Atualizar produto
PUT /api/products/:id
{ "currentStock": 100, ... }

# Eliminar produto
DELETE /api/products/:id
```

### Listas de Compras (Públicas)
```bash
# Criar lista (sem autenticação)
POST /api/shopping/lists
{ "customerName": "Joao", "customerPhone": "912345678" }

# Obter lista por token público
GET /api/shopping/lists/by-token/:token

# Adicionar item
POST /api/shopping/lists/by-token/:token/items
{ "productId": "...", "quantity": 3 }

# Gerar QR Code
GET /api/shopping/lists/by-token/:token/qrcode
```

### Vendas
```bash
# Processar venda
POST /api/sales
{ "shoppingListId": "...", "itemsJson": "...", "total": 29.97, ... }

# Listar vendas
GET /api/sales?limit=10
```

### Dashboard
```bash
# Métricas em tempo real
GET /api/dashboard
```

### Relatórios
```bash
# Gerar relatório
POST /api/reports
{ "type": "sales", "format": "csv", "filtersJson": "{...}" }

# Listar relatórios
GET /api/reports
```

## Variáveis de Ambiente

```env
# Backend
PORT=3001
DATABASE_URL=file:./data/vendorsmart.db  # SQLite local
JWT_SECRET=seu-secret-jwt-aleatorio
OTP_SECRET=seu-secret-otp-aleatorio

# Frontend
VITE_API_URL=http://localhost:3001  # URL do backend
```

## Arquitetura

```
vendorsmart/
├── server/                          # Backend Express + Drizzle ORM
│   ├── index.ts                     # Entry point (porta 3001)
│   ├── db/
│   │   ├── schema.ts                # Schema Drizzle (11 tabelas)
│   │   ├── client.ts                # Cliente LibSQL (SQLite)
│   │   └── migrations/
│   │       └── 0000_init.sql        # Migrações SQL
│   ├── services/
│   │   ├── auth.service.ts          # JWT, password hashing, OTP
│   │   ├── notifications.service.ts # Alertas de stock
│   │   └── backup.service.ts        # Backup automático
│   ├── middleware/
│   │   └── auth.middleware.ts       # Autenticação e RBAC
│   ├── routes/
│   │   ├── auth.routes.ts           # Login, 2FA, logout
│   │   ├── products.routes.ts       # CRUD produtos
│   │   ├── catalog.routes.ts        # Categorias e fornecedores
│   │   ├── movements.routes.ts      # Movimentos de stock
│   │   ├── shopping.routes.ts       # Listas de compras públicas
│   │   ├── purchaseOrders.routes.ts # Ordens de compra
│   │   ├── reports.routes.ts        # Exportação de relatórios
│   │   ├── dashboard.routes.ts      # KPIs
│   │   └── notifications.routes.ts  # Alertas
│   └── scripts/
│       ├── migrate.ts               # Aplicar migrações
│       ├── seed.ts                  # Popular dados iniciais
│       └── reset.ts                 # Limpar base de dados
├── src/                             # Frontend React 19 + TanStack Router
│   ├── routes/
│   │   ├── __root.tsx               # Root layout com AuthProvider
│   │   ├── index.tsx                # Landing page
│   │   ├── login.tsx                # Página de login com 2FA
│   │   ├── shop.tsx                 # Loja pública (QR Code)
│   │   ├── vendor-panel.tsx         # Painel do vendedor
│   │   ├── app.tsx                  # Layout autenticado
│   │   ├── app.dashboard.tsx        # Dashboard
│   │   ├── app.catalog.tsx          # Catálogo de produtos
│   │   ├── app.movements.tsx        # Movimentos de stock
│   │   ├── app.suppliers.tsx        # Gestão de fornecedores
│   │   ├── app.purchase-orders.tsx  # Ordens de compra
│   │   └── ... (outras rotas)
│   ├── contexts/
│   │   ├── AuthContext.tsx          # Autenticação real
│   │   └── RoleContext.tsx          # Adaptador de roles
│   ├── lib/
│   │   ├── api-client.ts            # Cliente API
│   │   └── route-guard.ts           # Guards RBAC
│   └── hooks/
│       ├── useDemo.ts               # Adaptador (compatibilidade)
│       └── useRole.ts               # Adaptador (compatibilidade)
├── data/
│   ├── vendorsmart.db               # Base de dados SQLite
│   └── backups/                     # Backups automáticos
├── vite.config.ts                   # Proxy para /api -> backend
├── package.json                     # Dependências
└── drizzle.config.ts                # Configuração Drizzle
```

## Segurança

- **Autenticação**: JWT com cookies httpOnly
- **Autorização**: RBAC com 4 perfis distintos
- **2FA**: OTP via email (gerador de códigos)
- **Senhas**: Hashing com bcrypt
- **CORS**: Configurado para localhost em dev
- **Backup Automático**: Snapshot da DB ao iniciar servidor

## Performance

- **Caching**: React Query com staleTime de 30s
- **Paginação**: Suportada em todos os endpoints
- **Índices**: Criados em colunas frequentemente consultadas (role, email, status)
- **Lazy Loading**: Componentes carregados sob demanda

## Próximos Passos (Opcional)

1. **Integração de Pagamentos**: Stripe para processamento de vendas online
2. **Notificações por Email**: SendGrid para alertas de stock
3. **Gráficos Avançados**: Recharts para análises detalhadas
4. **Sincronização em Tempo Real**: WebSockets para atualizações live
5. **Mobile App**: React Native para iOS/Android
6. **Integração de Código de Barras**: Leitura de códigos para entrada rápida
7. **Previsão de Demanda**: IA para sugerir reordens automáticas

## Suporte

Para dúvidas ou problemas:
1. Verifique os logs em `.manus-logs/` (se em ambiente Manus)
2. Consulte a documentação da API em `/api/docs` (Swagger)
3. Abra uma issue no GitHub

## Licença

MIT
