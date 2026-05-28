# VendorSmart - Backend Real (substituir modo demo)

## Backend - Estrutura
- [ ] Adicionar pasta `server/` com Express + Drizzle ORM + LibSQL (SQLite)
- [ ] Configurar drizzle.config.ts e ficheiro de schema
- [ ] Configurar scripts npm (server:dev, server:start, db:migrate, db:seed)
- [ ] Configurar Vite proxy para `/api` apontar ao Express

## Base de Dados (11 tabelas)
- [ ] users (RBAC: admin, manager, vendor, customer + 2FA secret)
- [ ] categories
- [ ] suppliers
- [ ] products
- [ ] stockMovements
- [ ] shoppingLists
- [ ] shoppingListItems
- [ ] sales
- [ ] purchaseOrders
- [ ] purchaseOrderItems
- [ ] reports
- [ ] Migration SQL gerada e aplicada
- [ ] Seed inicial (admin, categorias, fornecedores, produtos demonstrativos)

## Autenticacao & RBAC
- [ ] Registo / login com password hash (bcrypt)
- [ ] Geracao e verificacao de OTP (2FA) com expiracao
- [ ] JWT de sessao em cookie httpOnly
- [ ] Middleware de autorizacao por role (admin/manager/vendor/customer)
- [ ] Endpoints `/api/auth/register`, `/login`, `/verify-2fa`, `/me`, `/logout`

## API REST
- [ ] /api/products (GET, POST, PUT, DELETE) com filtros
- [ ] /api/categories (CRUD)
- [ ] /api/suppliers (CRUD)
- [ ] /api/stock-movements (CRUD + tipos entrada/saida/ajuste/transferencia)
- [ ] /api/sales (criar venda + historico)
- [ ] /api/shopping-lists (publica via token, CRUD itens)
- [ ] /api/purchase-orders (CRUD + estado + recepcao)
- [ ] /api/reports (gerar + listar + exportar CSV)
- [ ] /api/dashboard (KPIs em tempo real)
- [ ] /api/notifications (alertas de stock minimo)

## Frontend - substituir modo demo
- [ ] Remover dependencia de `DemoContext`/`demo-store` nas paginas reais
- [ ] Criar `lib/api-client.ts` (fetch com cookies de sessao)
- [ ] Criar `contexts/AuthContext.tsx` real (login, logout, user, role)
- [ ] Adicionar pagina /login com 2FA em duas etapas
- [ ] Atualizar guards RBAC para usar role real
- [ ] Ligar todas as paginas existentes a hooks reais (products, suppliers, stock, etc)

## QR Code & Vendor Panel
- [ ] Pagina publica `/shop` (sem auth) - cria lista, gera QR Code
- [ ] Pagina publica `/shop/list/:token` - cliente edita lista
- [ ] Pagina `/vendor-panel` - scanner QR + processamento de venda
- [ ] Componente CustomerQRScanner (camera ou input manual)

## Relatorios e Backup
- [ ] Exportador de relatorios CSV/Excel
- [ ] Pasta `data/backups/` com backup automatico (script + cron-like)
- [ ] Historico de relatorios gerados na tabela `reports`

## Notificacoes
- [ ] Trigger automatico ao baixar stock minimo
- [ ] Notificacoes in-app (tabela ou eventos)
- [ ] Envio de email opcional (com fallback log)

## Documentacao e build
- [ ] README com instrucoes de setup local (npm install, db:seed, dev)
- [ ] Validar `npm run build`
- [ ] Validar startup do servidor

## Entrega
- [ ] Commit organizado por areas
- [ ] Push para `cody007cyberdev-blip/vendorsmart`
