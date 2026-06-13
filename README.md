# 🚀 VendorSmart Professional Enterprise v3.0 — SaaS Edition

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version: 3.0.0](https://img.shields.io/badge/Version-3.0.0-orange.svg)](package.json)
[![Status: Production Ready](https://img.shields.io/badge/Status-Production%20Ready-green.svg)](#)
[![Localization: PT/CV](https://img.shields.io/badge/Localization-Portugal%20%7C%20Cabo%20Verde-blue.svg)](#)

> **A solução SaaS definitiva para gestão de inventário e operações comerciais no mercado lusófono**

O **VendorSmart Professional Enterprise** é uma plataforma ERP multi-tenant de próxima geração, desenhada para empresas que exigem alto desempenho, conformidade fiscal rigorosa e uma experiência de utilizador de elite. Transformamos a gestão de inventário básica numa plataforma robusta que cobre todo o ciclo operacional, da produção ao financeiro.

---

## 💎 Experiência de Utilizador de Elite

A nossa interface foi redesenhada do zero para oferecer clareza, velocidade e elegância. Com um tema **Enterprise Clean** (Preto, Laranja e Branco), o VendorSmart proporciona um ambiente de trabalho produtivo e moderno.

![Enterprise Dashboard](public/screenshots/enterprise-dashboard.png)
*Dashboard em tempo real com métricas de inventário, financeiras e cronogramas de produção.*

### ✨ Destaques da Interface:
- **Sidebar Inteligente**: Sistema de navegação recolhível para maximizar o espaço de trabalho
- **Header Dual-Layer**: Acesso rápido a perfis de utilizador, notificações e pesquisa global (⌘K)
- **Dashboards Personalizados**: Interfaces otimizadas para Admin, Manager e Vendedor
- **Playground Interativo**: Visualize transformações de dados em tempo real

---

## 🏗️ Arquitetura SaaS Multi-Tenant

O VendorSmart foi construído com uma arquitetura moderna e escalável para suportar múltiplas empresas de forma segura.

| Aspecto | Implementação |
|--------|--------------|
| **Isolamento de Dados** | Tenant-aware em todas as tabelas, com middleware de contexto |
| **Autenticação** | JWT com refresh tokens seguros e 2FA opcional |
| **Autorização** | RBAC com 5 cargos (Admin, Manager, Vendor, Employee, Customer) |
| **Billing** | Sistema nativo com 3 planos flexíveis e faturação automática |
| **Performance** | Paginação, cache e queries otimizadas com índices de tenant |
| **Segurança** | Criptografia, rate limiting, auditoria completa e conformidade GDPR |

---

## 💰 Planos e Preços

Escolha o plano que melhor se adapta ao seu negócio. Todos incluem **30 dias de teste gratuito**.

| Plano | Preço | Utilizadores | Produtos | Funcionalidades |
|------|-------|-------------|----------|-----------------|
| **Vendedor** | 500 CVE/mês | 1 | 100 | Gestão básica, Relatórios simples |
| **Loja** | 1000 CVE/mês | 5 | 1000 | Produção (BOM), SAF-T, Financeiro |
| **Minimercado/Supermercado** | 1500 CVE/mês | 20 | Ilimitado | Tudo + CRM, API, Suporte 24/7 |

---

## 🎯 Funcionalidades Core Enterprise

### 📦 Gestão de Inventário e Produção (BOM)
Controlo total sobre o seu catálogo. Defina fórmulas de produção, gira lotes e datas de validade, e automatize o planeamento de reabastecimento.

### 🏛️ Localização e Conformidade Fiscal
Totalmente adaptado para os mercados de **Portugal** e **Cabo Verde**:
- **SAF-T PT**: Gerador de ficheiro SAF-T integrado para conformidade total
- **NIF e Moedas**: Suporte nativo para NIF (PT/CV) e moedas (EUR/CVE)
- **Regimes de IVA**: Configuração flexível de taxas e regimes

### 👥 Gestão de Capital Humano
Tabelas avançadas para gestão de funcionários, departamentos, cargos e permissões granulares.

### 💳 Billing e Subscrições
Sistema automático de faturação com webhooks, gestão de pagamentos e histórico de faturas.

### 🔐 Segurança Empresarial
Autenticação JWT, criptografia de dados, auditoria completa e conformidade com GDPR.

---

## ⚙️ Parâmetros Avançados de Exportação

O motor de exportação profissional permite gerar documentos prontos para o mercado:
- **Metadados Personalizados**: Título, Autor e Empresa integrados
- **Controlo de Margens**: Ajuste milimétrico para impressão perfeita
- **Alta Fidelidade**: Exportações em 300 DPI para máxima qualidade
- **Múltiplos Formatos**: PDF, Excel, CSV e SAF-T XML

---

## 🚀 Começar Rápido

### Pré-requisitos:
- Node.js v18+
- npm ou pnpm
- SQLite (desenvolvimento) ou PostgreSQL (produção)

### Instalação:

```bash
# Clonar o repositório
git clone https://github.com/cody007cyberdev-blip/vendorsmart.git
cd vendorsmart

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Executar migrações da base de dados
npm run db:migrate

# Iniciar o servidor de desenvolvimento
npm run dev
```

O sistema estará disponível em `http://localhost:5173`

---

## 📚 Documentação

- **[SAAS_ARCHITECTURE.md](./SAAS_ARCHITECTURE.md)** — Arquitetura técnica detalhada
- **[DOCS.md](./DOCS.md)** — Documentação funcional completa
- **[ONBOARDING.md](./ONBOARDING.md)** — Guia de onboarding de empresas
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** — Guia de contribuição

---

## 🛠️ Scripts de Desenvolvimento

```bash
npm run dev          # Iniciar servidor de desenvolvimento
npm run build        # Build para produção
npm run db:migrate   # Executar migrações
npm run db:seed      # Popular com dados de teste
npm run lint         # Verificar código
npm run type-check   # Verificar tipos TypeScript
```

---

## 📈 Roadmap

- [x] Multi-tenancy com isolamento de dados
- [x] Autenticação e autorização avançadas
- [x] Sistema de billing e subscrições
- [x] Dashboards personalizados por role
- [ ] Integração com Stripe/Paddle
- [ ] Módulo de CRM completo
- [ ] Analytics e BI avançado
- [ ] Mobile app (React Native)
- [ ] Integrações com ERPs externos

---

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, leia o [CONTRIBUTING.md](./CONTRIBUTING.md) para mais informações.

---

## 📄 Licença

Este projeto está licenciado sob a MIT License — veja o ficheiro [LICENSE](./LICENSE) para detalhes.

---

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o VendorSmart:

- 📧 Email: support@vendorsmart.app
- 💬 Chat: [help.vendorsmart.app](https://help.vendorsmart.app)
- 🐛 Issues: [GitHub Issues](https://github.com/cody007cyberdev-blip/vendorsmart/issues)

---

## 🎉 Agradecimentos

Desenvolvido com ❤️ para o mercado lusófono. VendorSmart Professional Enterprise v3.0 — A solução SaaS definitiva para gestão de inventário.

**Transformando negócios com tecnologia. 🚀**

---

*© 2026 VendorSmart, Lda. Todos os direitos reservados.*
