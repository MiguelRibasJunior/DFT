# 🚀 Devs From Tomorrow — Soluções Digitais & Inteligência Artificial

> Plataforma web oficial da **Devs From Tomorrow**, desenvolvida para apresentar soluções tecnológicas de alta performance, automações com n8n e IA, sistemas web sob medida e aplicativo mobile, com Painel Administrativo integrado para gestão de orçamentos e leads.

---

## 📋 Sumário
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Como Executar o Projeto](#-como-executar-o-projeto)
- [Deploy (produção)](#-deploy-produção)
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
│   │   ├── components/
│   │   │   ├── layout/        # OnePageLayout, Footer, GeometricCanvas e header/ (Header, DesktopNav, MobileMenu)
│   │   │   ├── sections/      # Uma seção por arquivo: Hero, Solutions, Automation, Differentials,
│   │   │   │                  #   Process, Portfolio, TechStack, CTASection, ContactForm
│   │   │   ├── modals/        # ProjectModal, SolutionModal, LegalModal
│   │   │   └── ui/            # Peças reutilizáveis: Logo, SectionHeading, ContactCTAButton, ContactIcon
│   │   ├── config/
│   │   │   └── sections.ts    # IDs das âncoras e itens do menu (fonte única para header, rodapé e seções)
│   │   ├── hooks/             # useScrolled, useActiveSection, usePublicContent, useIntersectionObserver
│   │   ├── pages/
│   │   │   └── HomePage.tsx   # Composição da one page (ordem das seções + conteúdo do admin)
│   │   ├── services/          # Camada de requisições HTTP e API
│   │   ├── utils/             # scroll.ts (rolagem suave entre seções), security.ts
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
php artisan migrate --seed
```
> O `.env.example` já vem com valores de **produção** (`APP_ENV=production`, `APP_DEBUG=false`, `APP_URL` do domínio final). Para desenvolver, ajuste no seu `.env`: `APP_ENV=local`, `APP_DEBUG=true` e `APP_URL=http://127.0.0.1:8000`. O `--seed` cria o admin e, fora de produção, também o conteúdo de demonstração.

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

## 🚀 Deploy (produção)

Guia para quem vai publicar o site. É um app Laravel comum: **um único servidor PHP serve o site, a API e o painel `/admin`**. Os passos que dependem do tipo de hospedagem (compartilhada, VPS) estão marcados com ⚠️.

### 1. Requisitos do servidor
- **PHP 8.2 ou superior** com as extensões: `ctype`, `curl`, `dom`, `fileinfo`, `filter`, `iconv`, `intl`, `json`, `libxml`, `mbstring`, `openssl`, `pdo` (+ `pdo_sqlite` **ou** `pdo_mysql`), `phar`, `session`, `tokenizer`, `xml`, `xmlreader`, `xmlwriter` e `zip`.
- **Composer 2**.
- **Node.js 20+** só para gerar o front-end (`npm run build`). `public/build/` **não é versionado**: gere-o na máquina de build (ou no servidor) e garanta que a pasta chegue ao servidor.
- **Banco de dados:** o projeto vem configurado para SQLite (`database/database.sqlite`), que funciona para um site pequeno. Para MySQL, ajuste as variáveis `DB_*` do `.env`.
- ⚠️ **Raiz do site (document root) deve ser a pasta `public/`**, nunca a raiz do projeto. Em hospedagem compartilhada, aponte o domínio para `public/` no painel da hospedagem. Se não for possível, mantenha o projeto fora da pasta pública e copie só o conteúdo de `public/` para ela, ajustando os caminhos em `index.php`.
- ⚠️ **Escrita:** `storage/` e `bootstrap/cache/` precisam de permissão de escrita pelo usuário do PHP (e `database/` e o arquivo `database.sqlite`, se usar SQLite).
- Não há fila nem agendador: **não é preciso configurar `queue:work` nem cron**.

### 2. Variáveis do `.env`
Crie o `.env` a partir do `.env.example` e confira cada uma:

| Variável | Valor em produção |
| :--- | :--- |
| `APP_ENV` | `production` |
| `APP_DEBUG` | `false` (**nunca** `true` em produção: expõe erros e segredos) |
| `APP_URL` | URL final com `https://`, sem barra no fim. Define o domínio do `sitemap`, do canonical e das imagens de compartilhamento |
| `APP_KEY` | gerada por `php artisan key:generate` (uma vez; não troque depois) |
| `DB_CONNECTION` / `DB_*` | SQLite (padrão) ou os dados do MySQL |
| `ADMIN_EMAIL` | e-mail do primeiro administrador |
| `ADMIN_PASSWORD` | **senha forte e única.** O `.env.example` traz um valor de exemplo: troque. Sem ela, o seeder se recusa a rodar em produção |
| `ADMIN_NOTIFICATION_EMAIL` | e-mail que recebe o aviso de cada novo contato do formulário |
| `VITE_SITE_URL`, `VITE_API_BASE_URL` | usadas só no build do front-end (veja o passo 3) |

### 3. Passo a passo (nesta ordem)
```bash
# 1. Código e dependências
git clone https://github.com/MiguelRibasJunior/DFT.git && cd DFT
composer install --no-dev --optimize-autoloader
cp .env.example .env        # depois edite o .env (tabela acima)
php artisan key:generate

# 2. Front-end (as variáveis VITE_* já precisam estar no .env aqui)
npm ci && npm run build

# 3. Banco de dados
touch database/database.sqlite   # só se for SQLite
php artisan migrate --force
php artisan db:seed --force      # cria os papéis e o admin (em produção, NÃO cria conteúdo de exemplo)

# 4. Uploads públicos
php artisan storage:link

# 5. Caches de produção — por último
php artisan config:cache && php artisan route:cache && php artisan view:cache
```
- ⚠️ **Rode o `db:seed` antes do `config:cache`.** O seeder lê `ADMIN_PASSWORD` direto do `.env`; com a configuração em cache, essa leitura volta vazia e o seeder aborta.
- ⚠️ **`storage:link`** cria um atalho (symlink) de `public/storage` para `storage/app/public`. Algumas hospedagens compartilhadas bloqueiam symlinks; nesse caso, peça ao suporte para liberar ou crie o atalho pelo painel. Sem ele, **as imagens enviadas no admin (capas de projeto, logo, favicon) não aparecem**.
- **Atualizações futuras:** `git pull`, `composer install --no-dev -o`, `npm ci && npm run build`, `php artisan migrate --force` e depois `php artisan optimize:clear` seguido dos caches do passo 5.
- **Faça backup do banco antes de rodar `migrate`** em um site que já tenha dados reais (com SQLite, copie o arquivo `database/database.sqlite`).

### 4. Antes de divulgar o site
1. **`public/sitemap.xml` e `public/robots.txt`** têm o domínio `https://devsfromtomorrow.com` e as datas escritos à mão. Se o domínio for outro, troque em todas as linhas (`<loc>`, `<lastmod>` e `Sitemap:`).
2. **Troque a senha do admin** depois do primeiro acesso, e crie um usuário por pessoa (menu **Usuários**) com o papel certo (*Editor* para quem só edita conteúdo).
3. **Cadastre o conteúdo no painel `/admin`.** Em produção o seeder cria só os papéis e o admin, então o site sai vazio:
   - **Canais de contato** (WhatsApp, e-mail, telefone, redes): aparecem no formulário de contato, no rodapé e nos dados para o Google.
   - **Projetos**: só aparecem os marcados como *Publicado* **e** *Destaque*.
   - **CTA** da seção final, e **Rodapé** (descrição, links, Política de Privacidade e Termos de Uso, que precisam de revisão antes de ir ao ar).
   - **Configurações**: nome do site, logo, favicon e SEO (título, descrição, imagem de compartilhamento).
4. **Deixe em branco os campos de Google Analytics e Tag Manager** (Configurações → Integrações). O site ainda **não tem banner de consentimento de cookies**; ativar analytics sem ele coleta dados de visitantes sem aviso (LGPD).
5. **Ative o aviso por e-mail.** O aviso de novo contato é enviado pelo serviço [formsubmit.co](https://formsubmit.co). Na primeira vez que alguém usa o formulário, o serviço envia um e-mail de confirmação para `ADMIN_NOTIFICATION_EMAIL`, que precisa ser aceito para os avisos passarem a chegar. Os contatos são **sempre salvos** no painel, mesmo se o aviso falhar; em **Contatos** dá para ver se cada aviso saiu.

### 5. Teste final (smoke test)
- A página inicial abre com HTTPS, sem erro, e as imagens dos projetos e a logo carregam.
- `/admin` pede login; o login funciona e as telas abrem (Projetos, Contatos, Configurações).
- Envie um contato pelo formulário: ele aparece em **Contatos** e o e-mail de aviso chega (ou o status mostra `Falhou`).
- Edite o título em **Configurações → SEO**, salve e confira que ele muda na aba do navegador.
- `/robots.txt` e `/sitemap.xml` abrem e mostram o domínio certo.
- Em caso de erro 500, veja `storage/logs/laravel.log`.

---

## 🔒 Painel Administrativo & Segurança

O painel é construído com **Laravel Filament** e roda em `/admin` (rota própria, fora da SPA React).

- Acesse `http://127.0.0.1:8000/admin` e faça login com e-mail e senha.
- Credenciais do admin, criadas pelo seeder (`database/seeders/DatabaseSeeder.php`):
  - **E-mail**: `admin@devsfromtomorrow.com` (ou o valor de `ADMIN_EMAIL` no `.env`)
  - **Senha**: o valor de `ADMIN_PASSWORD` no `.env`. Só em **desenvolvimento**, sem `ADMIN_PASSWORD`, o seeder usa a senha `dft2026admin`; em **produção** ele se recusa a rodar sem `ADMIN_PASSWORD`.
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
