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
- **Vanilla CSS / Design System**: CSS3 com variáveis (tokens de cor e tipografia em `resources/css/index.css`), glassmorphism, tema escuro com neons customizados e responsividade mobile-first. Cores com contraste WCAG AA.
- **Lucide React**: Biblioteca de ícones modernos e leves.
- **HTML5 Canvas**: Animação de background geométrica interativa de alta performance.

### Backend (API RESTful)
- **PHP 8.2+ & Laravel 12**: Rotas, API REST pública (somente leitura, exceto o formulário de contato) e aviso de novos contatos por e-mail.
- **SQLite / MySQL**: Banco de dados para persistência de mensagens de orçamento e contatos.
- **Throttle Middleware**: Proteção nativa contra spam e abuso de envios nos formulários.

### Painel Administrativo
- **Laravel Filament v4**: Painel administrativo completo (Projetos, Tarefas/Kanban, Contatos, Mensagens, CTAs, Configurações, Usuários).
- **Spatie Laravel-Permission**: Papéis de acesso (*Super Admin*, *Admin*, *Editor*), aplicados por *Policies*.

### Qualidade
- **PHPUnit 11**: suíte de testes automatizados (`php artisan test`) cobrindo painel, API pública, permissões, banco e SEO.
- **TypeScript + oxlint**: `npm run build` checa os tipos e `npm run lint` roda o linter.

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
   - Seleção interativa do tipo de serviço desejado (os cards de Soluções já pré-selecionam o serviço).
   - Validação dos campos, com erros anunciados para leitores de tela e proteção contra spam (limite de envios e campo oculto).
   - O contato é gravado no painel na hora; o aviso por e-mail sai depois, sem atrasar a resposta.

4. **Painel Administrativo (Laravel Filament)**:
   - Login com e-mail e senha, com papéis de acesso (*Super Admin*, *Admin*, *Editor*).
   - Gestão de Projetos: status interno, prioridade, responsável, progresso calculado automaticamente pelas tarefas, prazos, Kanban, comentários e histórico de atividades.
   - Gestão de Contatos (leads do formulário) e Mensagens recebidas pelo site.
   - Gestão de CTAs, Canais de contato (WhatsApp, e-mail, telefone, redes sociais), Rodapé (links, Política de Privacidade e Termos de Uso) e Configurações do site (nome, logo, favicon, SEO e analytics) — refletidas em tempo real no site público.
   - Lixeira para projetos, mensagens e contatos: apagar não é definitivo, dá para restaurar; a exclusão definitiva é só do Super Admin.
   - Dashboard com indicadores de projetos/tarefas, "Minhas tarefas", próximos prazos e projetos que precisam de atenção.

5. **Otimização SEO & Performance**:
   - Título, descrição, palavras-chave, favicon e imagem de compartilhamento editáveis no painel, com valores padrão.
   - Tags Open Graph e Twitter Cards para compartilhamento em redes sociais.
   - Dados Estruturados em JSON-LD (Schema.org), montados com o nome do site e os canais de contato cadastrados.
   - Arquivos `sitemap.xml` e `robots.txt` configurados na pasta `public/`.
   - Carregamento sob demanda das seções abaixo da dobra (code splitting).

6. **Acessibilidade**:
   - Navegação completa por teclado, com link "Pular para o conteúdo", menu mobile e modais com foco preso e Esc.
   - Contraste WCAG AA e layout sem rolagem horizontal a partir de 320 px.
   - Respeita a preferência de movimento reduzido e mostra um aviso e os contatos quando o JavaScript está desligado.

---

## 📂 Estrutura do Projeto

O frontend vive dentro do próprio projeto Laravel — não é um app separado. O Laravel serve a
SPA React através de uma única view Blade ([resources/views/app.blade.php](resources/views/app.blade.php)),
que carrega os assets via `@vite`. Em desenvolvimento, o Vite injeta os módulos com HMR real; em
produção, o `@vite` aponta para os arquivos já compilados em `public/build/`.

```bash
DFT/
├── app/                        # Backend Laravel
│   ├── Enums/                  # ContactLinkType, Priority, ProjectManagementStatus, TaskStatus
│   ├── Filament/               # Painel administrativo
│   │   ├── Resources/          # Projetos, Contatos, Mensagens, CTAs, Canais de contato, Usuários
│   │   ├── Pages/              # Dashboard, Minhas tarefas, Configurações, Rodapé
│   │   └── Widgets/            # Indicadores do Dashboard e da lista de Projetos
│   ├── Http/
│   │   ├── Controllers/        # ContactController, PublicContentController
│   │   └── Requests/           # StoreContactRequest (validação do formulário de contato)
│   ├── Jobs/                   # SendContactNotification (aviso de contato por e-mail)
│   ├── Models/                 # Project, Task, Comment, Activity, Cta, ContactLink, ContactSubmission, Message, SiteSetting, User
│   ├── Policies/               # Quem pode ver/criar/editar/apagar o quê, por papel
│   ├── Providers/              # Inclui a configuração central do painel Filament
│   └── Support/                # LinkTarget (validação de links) e PublicPageData (<head> da página: SEO, favicon, JSON-LD)
├── bootstrap/                  # Bootstrap e configurações do framework Laravel
├── config/                     # Configuração do Laravel (app, database, session, etc.)
├── database/
│   ├── migrations/             # Esquema do banco
│   └── seeders/                # DatabaseSeeder (papéis + admin, roda em produção) e DemoContentSeeder (só fora de produção)
├── public/                     # Front controller do Laravel + assets públicos e SEO
│   ├── index.php               # Front controller (todas as requisições passam por aqui)
│   ├── build/                  # Assets compilados pelo Vite (gerado, não versionado)
│   ├── robots.txt
│   └── sitemap.xml
├── resources/                  # Código-fonte do frontend (React + CSS) e as views Blade
│   ├── css/
│   │   ├── index.css           # Design system: tokens (cores, fontes) e estilos globais
│   │   └── components/         # header.css, ui.css
│   ├── js/
│   │   ├── components/
│   │   │   ├── layout/         # OnePageLayout, Footer, GeometricCanvas e header/ (Header, DesktopNav, MobileMenu)
│   │   │   ├── sections/       # Uma seção por arquivo: Hero, Solutions, Automation, Differentials,
│   │   │   │                   #   Process, Portfolio, TechStack, CTASection, ContactForm
│   │   │   ├── modals/         # ProjectModal, SolutionModal, LegalModal (Privacidade e Termos)
│   │   │   └── ui/             # Peças reutilizáveis: Logo, SectionHeading, ContactCTAButton, ContactIcon
│   │   ├── config/
│   │   │   └── sections.ts     # IDs das âncoras e itens do menu (fonte única para header, rodapé e seções)
│   │   ├── hooks/              # useScrolled, useActiveSection, usePublicContent, useIntersectionObserver,
│   │   │                       #   useDialogFocus (foco e Esc dos modais)
│   │   ├── pages/
│   │   │   └── HomePage.tsx    # Composição da one page (ordem das seções + conteúdo do admin)
│   │   ├── services/           # Requisições à API pública (conteúdo e envio do formulário)
│   │   ├── utils/              # scroll.ts (rolagem suave entre seções), security.ts
│   │   ├── App.tsx             # Componente principal da aplicação
│   │   └── main.tsx            # Entry point do React
│   └── views/
│       ├── app.blade.php       # View única que monta a SPA via @vite (SEO, Open Graph, JSON-LD, analytics, <noscript>)
│       └── filament/           # Views e partials do painel (Kanban, visão geral do projeto, etc.)
├── routes/                     # Rotas de API, Web e Console
│   ├── api.php
│   ├── console.php
│   └── web.php
├── storage/                    # Cache, sessões, logs e uploads do Laravel
├── tests/Feature/              # Testes automatizados (PHPUnit)
├── .env.example                # Modelo de variáveis de ambiente (já com valores de produção)
├── .gitignore                  # Regras de exclusão do Git
├── composer.json               # Dependências PHP e scripts (composer run dev, composer test)
├── package.json                # Dependências Node.js e scripts (dev, build, lint)
├── tsconfig.json               # Configurações do TypeScript
└── vite.config.ts              # Plugin Laravel + React + alias do Vite
```

---

## ⚙️ Como Executar o Projeto

### Pré-requisitos
- **Node.js**: `v20.x` ou superior
- **PHP**: `v8.2` ou superior com as extensões `fileinfo`, `intl`, `zip`, `mbstring` e `pdo_sqlite` habilitadas (a lista completa está em [Deploy](#-deploy-produção))
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
php artisan storage:link   # necessário para exibir imagens enviadas pelo admin (capas, logo, favicon)
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
O `npm run build` também checa os tipos do TypeScript; para só rodar o linter, use `npm run lint`.

### 6. Rodar os Testes
```bash
php artisan test        # ou: composer test
```
A suíte usa um banco temporário e não mexe nos seus dados locais.

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
  - **Gestão**: Projetos (lista, Kanban e visão geral com comentários e histórico), Minhas tarefas.
  - **Site / Conteúdo**: Contatos, Mensagens, CTAs, Canais de contato, Rodapé, Configurações.
  - **Administração**: Usuários (e seus papéis: *Super Admin*, *Admin*, *Editor*).
- **Permissões por papel**: o *Editor* cria e edita projetos e atende contatos; o *Admin* também apaga, restaura e gerencia CTAs, canais, rodapé, configurações e usuários; só o *Super Admin* exclui definitivamente (lixeira) e edita outro Super Admin.
- **Lixeira**: projetos, mensagens e contatos apagados vão para a lixeira (filtro **Lixeira** nas listas) e podem ser restaurados.
- Alterações feitas no painel (projetos, CTAs, configurações) refletem em tempo real no site público, consumidas pela API pública somente-leitura listada abaixo.

---

## 🌐 Endpoints da API (`routes/api.php`)

| Método | Rota | Descrição | Autenticação / Limite |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/contact` | Envio de formulário de contato | Throttle (6 requisições/min) |
| `GET` | `/api/projects` | Projetos publicados **e** em destaque, na ordem do admin | Pública |
| `GET` | `/api/ctas/{position}` | CTA ativo de uma posição | Pública |
| `GET` | `/api/contact-links` | Canais de contato ativos (WhatsApp, e-mail, telefone, redes), com o link já montado | Pública |
| `GET` | `/api/settings` | Nome, descrição, logo, rodapé e textos legais (HTML sanitizado) | Pública |

As rotas públicas nunca expõem dados internos (analytics, usuários, tarefas, contatos recebidos).

O Painel Administrativo (`/admin`) não usa essas rotas — autenticação e ações administrativas são
tratadas diretamente pelo Filament (Livewire), sem uma API REST separada.

---

## 📌 Padronização de Git & Branches

Para manter o fluxo de trabalho limpo e organizado no GitHub, siga obrigatoriamente os padrões de branches estabelecidos:

- **Novas Funcionalidades**: `FEATURE/SITE-01`, `FEATURE/SITE-02`, etc. O número `SITE-XX` é o **card da tarefa** no gerenciador de tarefas, não uma sequência livre.
- **Uma branch por tarefa** e **nunca commitar direto na `main`**: as mudanças entram por Pull Request.
- Mensagens de commit no formato `feat:`, `fix:`, `docs:`, `test:`, `refactor:`.
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
