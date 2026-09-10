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

### Painel Administrativo
- **Laravel Filament v4**: Painel administrativo completo (Projetos, Tarefas/Kanban, Contatos, Mensagens, CTAs, Configurações, Usuários).
- **Spatie Laravel-Permission**: Papéis de acesso (*Super Admin*, *Admin*, *Editor*).

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

4. **Painel Administrativo (Laravel Filament)**:
   - Login com e-mail e senha, com papéis de acesso (*Super Admin*, *Admin*, *Editor*).
   - Gestão de Projetos: status interno, prioridade, responsável, progresso calculado automaticamente pelas tarefas, prazos, Kanban, comentários e histórico de atividades.
   - Gestão de Contatos (leads do formulário) e Mensagens recebidas pelo site.
   - Gestão de CTAs e das Configurações gerais do site (contato, redes sociais, rodapé, SEO) — refletidas em tempo real no site público.
   - Dashboard com indicadores de projetos/tarefas, "Minhas tarefas", próximos prazos e projetos que precisam de atenção.

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
├── app/                        # Backend Laravel (Controllers, Filament, Models, Providers)
│   ├── Filament/
│   │   ├── Resources/          # Recursos do Painel Admin (Projetos, Contatos, Mensagens, CTAs, Usuários)
│   │   ├── Pages/              # Páginas customizadas (Configurações, Minhas tarefas)
│   │   └── Widgets/            # Widgets do Dashboard
│   ├── Http/Controllers/
│   │   ├── ContactController.php
│   │   └── PublicContentController.php
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
│   │   │   ├── ContactForm.tsx
│   │   │   ├── Footer.tsx
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

## 🔒 Painel Administrativo & Segurança

O painel é construído com **Laravel Filament** e roda em `/admin` (rota própria, fora da SPA React).

- Acesse `http://127.0.0.1:8000/admin` e faça login com e-mail e senha.
- Credenciais padrão, criadas pelo seeder (`database/seeders/DatabaseSeeder.php`):
  - **E-mail**: `admin@devsfromtomorrow.com` (ou o valor de `ADMIN_EMAIL` no `.env`)
  - **Senha**: `dft2026admin` (ou o valor de `ADMIN_PASSWORD` no `.env`)
- O menu lateral é organizado em três grupos:
  - **Gestão**: Projetos, Minhas tarefas.
  - **Site / Conteúdo**: Contatos, Mensagens, CTAs, Configurações.
  - **Administração**: Usuários (e seus papéis: *Super Admin*, *Admin*, *Editor*).
- Alterações feitas no painel (projetos, CTAs, configurações) refletem em tempo real no site público, consumidas pela API pública somente-leitura listada abaixo.

---

## 🌐 Endpoints da API (`routes/api.php`)

| Método | Rota | Descrição | Autenticação / Limite |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/contact` | Envio de formulário de contato | Throttle (6 requisições/min) |
| `GET` | `/api/projects` | Lista de projetos publicados | Pública |
| `GET` | `/api/ctas/{position}` | CTA ativo de uma posição | Pública |
| `GET` | `/api/settings` | Configurações públicas do site | Pública |

O Painel Administrativo (`/admin`) não usa essas rotas — autenticação e ações administrativas são
tratadas diretamente pelo Filament (Livewire), sem uma API REST separada.

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
