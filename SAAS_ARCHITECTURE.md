# Arquitetura SaaS — VendorSmart Professional Enterprise

Este documento descreve a arquitetura técnica implementada para transformar o VendorSmart num produto SaaS (Software as a Service) multi-tenant profissional.

## 1. Multi-Tenancy (Isolamento de Dados)

O sistema utiliza uma estratégia de **Shared Database, Shared Schema** com isolamento lógico via `companyId` (Tenant ID).

### Implementação:
- **Base de Dados**: Adição da coluna `companyId` em todas as tabelas operacionais.
- **Isolamento no Backend**: 
    - `tenantMiddleware`: Extrai o `companyId` do JWT e injeta no contexto da requisição (`req.tenantId`).
    - Todas as queries ao banco de dados são obrigatoriamente filtradas por `req.tenantId`.
- **Isolamento no Frontend**:
    - `useTenant()`: Hook que fornece o contexto da empresa logada.
    - `useTenantQuery()`: Wrapper sobre o React Query que garante que todas as requisições incluem o contexto do tenant.

## 2. Autenticação e Autorização (RBAC)

O sistema utiliza **Role-Based Access Control** para definir permissões granulares.

### Cargos Disponíveis:
- `admin`: Controlo total sobre a empresa, utilizadores, billing e configurações.
- `manager`: Gestão de inventário, produção e relatórios financeiros.
- `vendor`: Operações de venda, consulta de stock e clientes.
- `employee`: Acesso básico operacional.

### Sistema de Convites:
- Os administradores podem convidar novos utilizadores via email.
- É gerado um token seguro e temporário (7 dias).
- O utilizador convidado define a sua própria senha ao aceitar o convite.

## 3. Billing e Licenciamento

O licenciamento é gerido de forma centralizada com suporte para diferentes tipos de negócio.

### Planos e Preços:
- **Vendedor**: 500 CVE/mês (Pequenos negócios)
- **Loja**: 1000 CVE/mês (Retalho médio)
- **Minimercado/Supermercado**: 1500 CVE/mês (Grandes superfícies)

### Fluxo de Faturação:
- Período de teste gratuito de 30 dias para todas as novas empresas.
- Gestão de status de licença (`active`, `expired`, `suspended`).
- Próxima data de faturação calculada automaticamente.

## 4. Performance e UX

- **Paginação**: Implementada no servidor para lidar com grandes volumes de dados de inventário e vendas.
- **Dashboards por Role**: Interfaces personalizadas para Admin e Vendedor, otimizando o fluxo de trabalho de cada perfil.
- **Tailwind CSS v4**: Utilização das últimas tecnologias de estilo para performance de renderização superior.

## 5. Segurança

- **JWT (JSON Web Tokens)**: Para autenticação sem estado.
- **Hashing de Senhas**: Utilização de `bcryptjs` para armazenamento seguro.
- **Sessões**: Rastreamento de sessões ativas com IP e User-Agent.
- **Middleware de Proteção**: Camadas de verificação em todas as rotas sensíveis.

---

*Documentação atualizada em 13 de Junho de 2026.*
