## 🚀 Guia de Onboarding do VendorSmart Professional Enterprise

Bem-vindo ao VendorSmart! Este guia detalha o processo de registo da sua empresa e a gestão inicial de utilizadores e licenças.

### 1. Registo da Sua Empresa

O VendorSmart oferece um processo de registo simplificado em duas etapas, permitindo que configure a sua empresa e a conta de administrador rapidamente.

#### Passo 1: Informações da Empresa

Ao aceder à página de registo, irá preencher os dados essenciais da sua empresa:

-   **Nome da Empresa**: Nome comercial da sua empresa.
-   **Designação Legal**: Nome completo da empresa, conforme registado legalmente.
-   **NIF**: Número de Identificação Fiscal (NIF) da empresa.
-   **País**: Selecione `Portugal (PT)` ou `Cabo Verde (CV)` para garantir a conformidade fiscal e monetária.
-   **Moeda**: Escolha `EUR (€)` para Portugal ou `CVE ($)` para Cabo Verde.
-   **Plano de Licença**: Selecione o plano que melhor se adapta ao seu negócio:
    -   **Vendedor (500 CVE)**: Ideal para vendedores individuais ou pequenos negócios.
    -   **Loja (1000 CVE)**: Perfeito para lojas de retalho com operações de médio porte.
    -   **Minimercado/Supermercado (1500 CVE)**: Solução robusta para grandes superfícies comerciais.

#### Passo 2: Dados do Administrador

Após configurar a sua empresa, irá criar a conta de administrador principal:

-   **Nome Completo (Admin)**: O seu nome como administrador do sistema.
-   **Email**: O seu endereço de email, que será o login da conta de administrador.
-   **Senha**: Defina uma senha segura (mínimo 8 caracteres).
-   **Confirmar Senha**: Repita a senha para confirmação.

Após o registo, a sua empresa será criada com um período de **teste de 30 dias** para o plano selecionado, e a sua conta de administrador será automaticamente autenticada.

### 2. Gestão de Funcionários e Permissões (RBAC)

Como administrador, pode gerir os funcionários da sua empresa e atribuir-lhes diferentes níveis de acesso (Role-Based Access Control - RBAC).

#### Níveis de Acesso (Roles):

-   **Admin**: Acesso total ao sistema, incluindo configurações, gestão de utilizadores, empresas e licenças.
-   **Manager**: Acesso a módulos de gestão (inventário, produção, vendas, financeiro), mas sem acesso a configurações críticas do sistema.
-   **Vendor**: Acesso limitado a módulos de vendas e gestão de clientes.
-   **Employee**: Acesso básico para registar movimentos de stock, vendas simples e outras operações diárias.
-   **Customer**: Acesso limitado para visualizar o seu histórico de compras e informações de conta.

#### Como Criar um Funcionário:

1.  Aceda ao módulo de **Gestão de Utilizadores** no painel de administração.
2.  Clique em "Adicionar Novo Funcionário".
3.  Preencha os dados do funcionário (Nome, Email, Senha, Cargo).
4.  O funcionário poderá aceder ao sistema com o email e senha definidos.

### 3. Exportação CSV de Alta Fidelidade

O VendorSmart permite exportar dados em formato CSV de forma flexível e personalizável. Pode gerar relatórios de inventário, vendas, clientes e funcionários para análise externa ou integração com outros sistemas.

#### Funcionalidades de Exportação:

-   **Seleção de Campos**: Escolha quais campos deseja incluir na exportação.
-   **Filtros Avançados**: Aplique filtros por data, categoria, status, etc.
-   **Modelos Pré-definidos**: Utilize modelos de exportação para diferentes tipos de relatórios.
-   **Formato Consistente**: Garante que os dados são exportados de forma limpa e estruturada, prontos para serem utilizados em planilhas ou outras ferramentas.

### 4. Segurança e Autenticação

O VendorSmart utiliza autenticação baseada em JWT (JSON Web Tokens) para garantir a segurança das suas sessões. Além disso, oferece:

-   **Autenticação de Dois Fatores (2FA)**: Uma camada extra de segurança para proteger as contas de utilizador.
-   **Controlo de Acesso Baseado em Funções (RBAC)**: Garante que cada utilizador tem acesso apenas às funcionalidades e dados relevantes para o seu cargo.

### 5. Endpoints de API

#### Registo de Empresa

```bash
POST /api/auth/register-company
Content-Type: application/json

{
  "companyName": "Tech Solutions, Lda",
  "companyLegalName": "Tech Solutions, Sociedade Unipessoal, Lda",
  "nif": "123456789",
  "country": "PT",
  "currency": "EUR",
  "plan": "loja", // Novo campo para seleção de plano
  "adminName": "João Silva",
  "adminEmail": "admin@empresa.com",
  "adminPassword": "SecurePass123!",
  "adminPasswordConfirm": "SecurePass123!"
}
```

**Resposta (201 Created)**:
```json
{
  "success": true,
  "message": "Empresa e administrador criados com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "name": "João Silva",
    "email": "admin@empresa.com",
    "role": "admin",
    "companyId": "uuid-here"
  }
}
```

#### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@empresa.com",
  "password": "SecurePass123!"
}
```

---

## 6. Boas Práticas

### Para Administradores

1. **Crie uma senha forte** para a conta de administrador
2. **Ative 2FA** (autenticação de dois fatores) para segurança adicional
3. **Revise regularmente** as permissões dos funcionários
4. **Faça backup** dos dados exportados em CSV

### Para Funcionários

1. **Guarde a sua senha** de forma segura
2. **Não partilhe** credenciais com outros utilizadores
3. **Faça logout** ao terminar a sessão
4. **Reporte problemas** ao administrador

---

## 7. Suporte e Documentação

Para mais informações, consulte:
- **Documentação Técnica**: `/DOCS.md`
- **README do Projeto**: `/README.md`
- **API Reference**: `/API.md`

---

*© 2026 VendorSmart, Lda. Todos os direitos reservados.*
