# Guia de Onboarding — VendorSmart Professional Enterprise v3.0

## Visão Geral

O VendorSmart Professional Enterprise agora oferece um fluxo de onboarding completo e intuitivo para empresas em Portugal e Cabo Verde. Este guia descreve o processo de registo, gestão de funcionários e permissões.

---

## 1. Fluxo de Registo de Empresa

### Passo 1: Aceder à Página de Registo

Navegue até `https://vendorsmart.local/register` e clique em **"Criar Conta"**.

### Passo 2: Registar a Empresa

Preencha os seguintes campos:

| Campo | Descrição | Exemplo |
|-------|-----------|---------|
| **Nome da Empresa** | Nome comercial da empresa | Tech Solutions, Lda |
| **Designação Legal** | Nome legal completo | Tech Solutions, Sociedade Unipessoal, Lda |
| **NIF** | Número de Identificação Fiscal | 123456789 |
| **País** | Portugal (PT) ou Cabo Verde (CV) | PT |
| **Moeda** | EUR (Portugal) ou CVE (Cabo Verde) | EUR |

### Passo 3: Criar Conta de Administrador

Após registar a empresa, preencha os dados do administrador:

| Campo | Descrição | Exemplo |
|-------|-----------|---------|
| **Nome Completo** | Nome do administrador | João Silva |
| **Email** | Email de acesso | admin@empresa.com |
| **Senha** | Mínimo 8 caracteres | SecurePass123! |
| **Confirmar Senha** | Repetir a senha | SecurePass123! |

### Passo 4: Confirmação

Após submeter o formulário, receberá um token JWT que o autenticará automaticamente no sistema.

---

## 2. Gestão de Funcionários

### Aceder ao Painel de Funcionários

1. Faça login como administrador
2. Navegue até **Sidebar > Gestão de Funcionários** (ou `/app/employees`)

### Criar um Novo Funcionário

Clique em **"Adicionar Funcionário"** e preencha:

| Campo | Descrição | Exemplo |
|-------|-----------|---------|
| **Nome Completo** | Nome do funcionário | Maria Santos |
| **Email** | Email de acesso | maria@empresa.com |
| **Cargo** | Posição na empresa | Analista de Inventário |
| **Departamento** | Departamento | Operações |
| **Nível de Acesso** | Função no sistema | Funcionário / Vendedor / Gerente / Admin |

### Níveis de Acesso (Roles)

O VendorSmart oferece 4 níveis de acesso granulares:

| Role | Permissões | Casos de Uso |
|------|-----------|-------------|
| **Funcionário** | Visualizar dados, registar movimentos | Operários, Recepcionistas |
| **Vendedor** | Criar vendas, visualizar clientes | Vendedores, Representantes |
| **Gerente** | Acesso completo a módulos | Chefes de Departamento |
| **Administrador** | Acesso total ao sistema | Proprietários, Diretores |

### Acesso de Funcionários

Os funcionários criados podem aceder ao sistema com:
- **Email**: O email registado no painel
- **Senha**: Será enviada por email (ou definida pelo admin)

---

## 3. Exportação de Dados

### Exportar Funcionários em CSV

1. Aceda ao painel de **Gestão de Funcionários**
2. Clique em **"Exportar CSV"**
3. O ficheiro será descarregado com o formato: `funcionarios_YYYY-MM-DD.csv`

### Formato do CSV

O ficheiro CSV inclui:
- Metadados (data de exportação, total de registos)
- Cabeçalhos: Nome, Email, Cargo, Departamento, Nível de Acesso, Data de Contratação
- Dados formatados conforme RFC 4180 (compatível com Excel)

### Exemplo de Exportação

```csv
# Exportado em: 2026-01-15T10:30:00.000Z
# Total de Registos: 2
# Versão: 1.0

name,email,position,department,role,hireDate
João Silva,joao@empresa.com,Gerente de Inventário,Operações,manager,2024-01-15
Maria Santos,maria@empresa.com,Analista de Inventário,Operações,employee,2024-02-20
```

---

## 4. Segurança e Autenticação

### Autenticação JWT

O VendorSmart utiliza **JSON Web Tokens (JWT)** para autenticação segura:

1. **Login**: Utilizador fornece email e senha
2. **Validação**: Servidor verifica credenciais
3. **Token**: Servidor emite JWT com validade de 7 dias
4. **Acesso**: Utilizador inclui token em cada requisição

### Controlo de Acesso Baseado em Funções (RBAC)

Cada utilizador tem um `role` que determina:
- Quais módulos pode aceder
- Quais ações pode executar
- Quais dados pode visualizar

### Exemplo de Verificação de Permissões

```typescript
// Apenas administradores podem criar empresas
if (user.role !== "admin") {
  return res.status(403).json({ error: "Permissão insuficiente" });
}
```

---

## 5. Endpoints de API

### Registo de Empresa

```bash
POST /api/auth/register-company
Content-Type: application/json

{
  "companyName": "Tech Solutions, Lda",
  "companyLegalName": "Tech Solutions, Sociedade Unipessoal, Lda",
  "nif": "123456789",
  "country": "PT",
  "currency": "EUR",
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

### Login

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
