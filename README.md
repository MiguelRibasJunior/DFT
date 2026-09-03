# 🚀 Devs From Tomorrow — Soluções Digitais & Inteligência Artificial

> Plataforma web oficial da **Devs From Tomorrow**, desenvolvida para apresentar soluções tecnológicas de alta performance, automações com n8n e IA, sistemas web sob medida e aplicativo mobile, com Painel Administrativo integrado para gestão de orçamentos e leads.

---

## 📋 Sumário
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Como Executar o Projeto](#-como-executar-o-projeto)
- [Painel Administrativo](#-painel-administrativo)
- [Endpoints da API](#-endpoints-da-api)
- [Padronização de Git & Branches](#-padronização-de-git--branches)

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 19 & TypeScript 6**: Interface reativa, modular e fortemente tipada.
- **Vite 8**: Build tool ultra-rápida com HMR (Hot Module Replacement).
- **Vanilla CSS / Design System**: CSS3 moderno utilizando variáveis HSL, glassmorphism, temas escuros com neons customizados e responsividade mobile-first.
- **Lucide React**: Biblioteca de ícones modernos e leves.
- **HTML5 Canvas**: Animação de background geométrica interativa de alta performance.

### Backend (API RESTful)
- **PHP 8.2+ & Laravel 12**: Estrutura robusta para controle de rotas, API REST e envio de e-mails.
- **SQLite / MySQL**: Banco de dados para persistência de mensagens de orçamento e contatos.
- **Throttle Middleware**: Proteção nativa contra spam e abuso de envios nos formulários.

---

## ✨ Funcionalidades Principais

1. **Hero Section Dinâmica & Canvas Interativo**:
   - Background animado em tempo real com partículas geométricas interativas.
   - Chamadas para ação (CTA) diretas para cotação e agendamento.

2. **Apresentação de Serviços & Soluções**:
   - Automação de Processos com n8n & IA.
   - Sistemas Web & SaaS Sob Medida.
   - Aplicativos Mobile Nativos e Híbridos.

3. **Formulário Inteligente de Orçamentos**:
   - Seleção interativa do tipo de serviço desejado.
   - Validação em tempo real dos campos de entrada.

4. **Painel Administrativo Integrado**:
   - Modal de Autenticação com verificação de credencial.
   - Gestão de leads com alteração de status (*Pendente*, *Em Análise*, *Concluído*, *Arquivado*).
   - Teste de disparo de e-mails de notificação.
   - Upload de anexos/propostas comerciais.

5. **Otimização SEO & Performance**:
   - Tags Open Graph e Twitter Cards para compartilhamento em redes sociais.
   - Dados Estruturados em JSON-LD (Schema.org ProfessionalService).
   - Arquivos `sitemap.xml` e `robots.txt` configurados na pasta `public/`.

---

## 📂 Estrutura do Projeto

O frontend vive dentro do próprio projeto Laravel — não é um app separado. O Laravel serve a
SPA React através de uma única view Blade ([resources/views/app.blade.php](resources/views/app.blade.php)),
que carrega os assets via `@vite`. Em desenvolvimento, o Vite injeta os módulos com HMR real; em
produção, o `@vite` aponta para os arquivos já compilados em `public/build/`.

```bash
DFT/
├── app/                        # Backend Laravel (Controllers, Models, Providers)
│   ├── Http/Controllers/
│   │   ├── AdminController.php
│   │   ├── ContactController.php
│   │   └── UploadController.php
│   ├── Models/
│   └── Providers/
├── bootstrap/                  # Bootstrap e configurações do framework Laravel
├── config/                     # Configuração do Laravel (app, database, session, etc.)
├── database/                   # Migrações e configurações do SQLite/MySQL
│   └── migrations/
├── public/                     # Front controller do Laravel + assets públicos e SEO
│   ├── index.php               # Front controller (todas as requisições passam por aqui)
│   ├── build/                  # Assets compilados pelo Vite (gerado, não versionado)
│   ├── robots.txt
│   └── sitemap.xml
├── resources/                  # Código Fonte do Frontend (React + CSS) + a view Blade
│   ├── css/
│   │   └── index.css          # Design System e tokens visuais
│   ├── js/
│   │   ├── components/        # Componentes React reutilizáveis
│   │   │   ├── AdminAuthModal.tsx
│   │   │   ├── AdminPanel.tsx
│   │   │   ├── ContactForm.tsx
│   │   │   ├── GeometricCanvas.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── Portfolio.tsx
│   │   ├── services/          # Camada de requisições HTTP e API
│   │   ├── types/             # Definições de tipos TypeScript
│   │   ├── App.tsx            # Componente principal da aplicação
│   │   └── main.tsx           # Entry point do React
│   └── views/
│       └── app.blade.php      # View única que monta a SPA via @vite
├── routes/                     # Rotas de API, Web e Console
│   ├── api.php
│   ├── console.php
│   └── web.php
├── storage/                     # Cache, sessões, logs e uploads do Laravel
├── .env.example                # Modelo de variáveis de ambiente
├── .gitignore                  # Regras de exclusão do Git
├── composer.json               # Dependências PHP e scripts (composer run dev)
├── package.json                # Dependências Node.js
├── tsconfig.json               # Configurações do TypeScript
└── vite.config.ts              # Plugin Laravel + React + alias do Vite
```

---

## ⚙️ Como Executar o Projeto

### Pré-requisitos
- **Node.js**: `v20.x` ou superior
- **PHP**: `v8.2` ou superior com as extensões `fileinfo` e `pdo_sqlite` habilitadas
- **Composer**: `v2.x`

### 1. Clonar o Repositório
```bash
git clone https://github.com/MiguelRibasJunior/DFT.git
cd DFT
```

### 2. Instalar Dependências (Backend + Frontend)
```bash
composer install
npm install
```

### 3. Configurar Variáveis de Ambiente
Crie um arquivo `.env` baseado no `.env.example`, gere a chave da aplicação e prepare o banco SQLite:
```bash
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate
```

### 4. Executar em Modo de Desenvolvimento
Sobe o servidor Laravel (`http://127.0.0.1:8000`) e o Vite (HMR) juntos, com um único comando:
```bash
composer run dev
```
Abra `http://127.0.0.1:8000` — é essa URL que serve a SPA, não a porta do Vite. Se preferir rodar
cada processo separadamente, use dois terminais: `php artisan serve` e `npm run dev`.

### 5. Compilar para Produção (Build)
```bash
npm run build
```
Os assets otimizados são gerados em `public/build/` (versionados via `manifest.json`, lido pelo
`@vite` do Blade) — não é preciso servir nada separado, o próprio Laravel já serve tudo em produção.

---

## 🔒 Painel Administrativo

Para acessar o Painel Administrativo na aplicação web:
- Clique no botão **"Painel Admin"** localizado no cabeçalho (Navbar) ou no rodapé (Footer).
- Insira a senha definida na variável de ambiente `VITE_ADMIN_PASSWORD` (Padrão de exemplo: `dft2026admin`).

---

## 🌐 Endpoints da API (`routes/api.php`)

| Método | Rota | Descrição | Autenticação / Limite |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/contact` | Envio de formulário de contato | Throttle (6 requisições/min) |
| `POST` | `/api/admin/login` | Autenticação no Painel Admin | Pública |
| `GET` | `/api/admin/submissions` | Listagem de orçamentos | Admin Token |
| `PATCH` | `/api/admin/submissions/{id}` | Atualização de status do orçamento | Admin Token |
| `DELETE` | `/api/admin/submissions/{id}` | Exclusão de orçamento | Admin Token |
| `POST` | `/api/admin/test-email` | Disparo de e-mail de teste | Admin Token |
| `POST` | `/api/admin/upload` | Upload de proposta/anexo | Admin Token |

---

## 📌 Padronização de Git & Branches

Para manter o fluxo de trabalho limpo e organizado no GitHub, siga obrigatoriamente os padrões de branches estabelecidos:

- **Novas Funcionalidades**: `FEATURE/SITE-01`, `FEATURE/SITE-02`, etc.
- **Correções de Bugs**: `BUGFIX/SITE-X`
- **Correções Urgentes (Hotfix)**: `HOTFIX/SITE-Y`

### Exemplo de criação de branch e push:
```bash
git checkout -b FEATURE/SITE-01
git add .
git commit -m "feat: implementa nova funcionalidade para a plataforma"
git push origin FEATURE/SITE-01
```

---

*Desenvolvido pela equipe **Devs From Tomorrow**.*
