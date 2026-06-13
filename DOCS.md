# Documentação Técnica do VendorSmart Professional Enterprise v3.0

## 1. Visão Geral do Projeto

O VendorSmart Professional Enterprise v3.0 é uma solução ERP (Enterprise Resource Planning) de última geração, projetada para otimizar a gestão de inventário, produção, finanças e conformidade fiscal para empresas em Portugal e Cabo Verde. Este sistema foi desenvolvido com foco em escalabilidade, segurança e uma experiência de utilizador intuitiva.

## 2. Arquitetura do Sistema

### 2.1. Frontend
- **Tecnologias**: React 19, Vite, Tailwind CSS.
- **Componentes Principais**: 
    - **Dashboard**: Visão geral em tempo real com métricas de inventário, financeiras e cronogramas de produção.
    - **Sidebar**: Navegação recolhível com estrutura de menu organizada.
    - **Header**: Cabeçalho dual-layer com pesquisa global, notificações e gestão de perfil de utilizador.
    - **Playground Interativo**: Ferramenta para visualização e teste de transformação de dados em documentos.

### 2.2. Backend
- **Tecnologias**: Node.js, Express.js, Drizzle ORM.
- **Base de Dados**: SQLite (para desenvolvimento e pequenas implementações) / SQL Server (para produção).
- **Serviços Principais**: 
    - **Autenticação e Autorização**: JWT, bcrypt, middleware de autenticação e controlo de acesso baseado em funções (RBAC).
    - **Gestão de Inventário**: Controlo de stock, movimentos, reabastecimento e gestão de lotes.
    - **Produção (BOM)**: Gestão de Bill of Materials para artigos compostos.
    - **Fiscal**: Geração de SAF-T PT, gestão de impostos e regimes fiscais.
    - **Financeiro**: Contas-correntes de clientes, emissão de documentos financeiros (faturas, recibos).
    - **Admin**: Gestão de utilizadores, empresas, funcionários e clientes.

## 3. Estrutura da Base de Dados (Schema)

O `server/db/schema.ts` define as seguintes tabelas:

- **`companies`**: Cadastro de empresas com dados fiscais para PT e CV.
- **`users`**: Utilizadores do sistema com roles (admin, manager, vendor, customer, requestor, employee) e suporte a 2FA.
- **`employees`**: Gestão de funcionários com detalhes de departamento, cargo e salário.
- **`clients`**: Gestão de clientes com limites de crédito e saldos de conta-corrente.
- **`taxes`**: Definição de impostos e taxas por país.
- **`products`**: Catálogo de produtos com SKU, preço, stock e indicação de ser composto (BOM).
- **`financialDocuments`**: Registo de faturas, recibos e notas de crédito.
- **`currentAccounts`**: Contas-correntes de clientes.
- **`stockMovements`**: Movimentos de stock (entrada, saída, ajuste, produção).
- **`categories`**: Categorias de produtos.
- **`suppliers`**: Fornecedores com detalhes de contacto.

## 4. Funcionalidades Chave

### 4.1. Gestão de Inventário e Produção
- **Rastreabilidade por Lotes**: Controlo detalhado de produtos por lote e data de validade.
- **Bill of Materials (BOM)**: Definição e gestão de artigos compostos, facilitando o controlo de produção.
- **Reabastecimento Inteligente**: Alertas e sugestões para otimizar os níveis de stock.

### 4.2. Conformidade Fiscal e Financeira
- **SAF-T PT**: Geração automática do ficheiro SAF-T para Portugal, garantindo conformidade legal.
- **Localização PT/CV**: Suporte completo para NIF, moedas (EUR/CVE) e regimes fiscais de Portugal e Cabo Verde.
- **Contas-Correntes**: Gestão de saldos de clientes e limites de crédito.
- **Emissão de Documentos**: Faturas, recibos e notas de crédito com cálculo automático de impostos.

### 4.3. Gestão de Utilizadores e Acessos
- **RBAC (Role-Based Access Control)**: Controlo granular de permissões para diferentes cargos (Admin, Manager, Vendor, Customer, Requestor, Employee).
- **Autenticação Segura**: Utilização de JWT e bcrypt para segurança de passwords, com suporte a 2FA.

## 5. Parâmetros Avançados de Exportação

O sistema oferece um motor de exportação robusto para documentos profissionais:
- **Metadados Personalizados**: Definição de Título, Autor e Empresa para cada documento exportado.
- **Controlo de Margens**: Ajuste preciso das margens para impressão.
- **Qualidade de Impressão**: Exportação em alta resolução (300 DPI) para documentos com qualidade profissional.
- **Formatos Suportados**: PDF, XML (SAF-T), CSV, XLSX.

## 6. Instalação e Desenvolvimento

### Pré-requisitos
- Node.js v18+
- pnpm (gerenciador de pacotes)
- Git

### Instalação
```bash
# Clonar o repositório
git clone https://github.com/cody007cyberdev-blip/vendorsmart.git
cd vendorsmart

# Instalar dependências
pnpm install

# Configurar variáveis de ambiente (criar .env baseado em .env.example)
cp .env.example .env

# Executar migrações da base de dados e popular com dados de exemplo
pnpm run migrate
pnpm run seed

# Iniciar o servidor de desenvolvimento
pnpm run dev
```

### Acesso
- **Frontend**: `http://localhost:5173` (ou a porta indicada pelo Vite)
- **Backend API**: `http://localhost:3001/api`

## 7. Contribuição

Para contribuir com o projeto, por favor, consulte o ficheiro `CONTRIBUTING.md`.

## 8. Licença

Este projeto é proprietário. Todos os direitos reservados à VendorSmart, Lda.

---

*© 2026 VendorSmart, Lda. Todos os direitos reservados.*
