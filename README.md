# Devs From Tomorrow (DFT)

Plataforma web oficial da Devs From Tomorrow, composta por um site institucional desenvolvido em React e um painel administrativo integrado em Laravel Filament.

O projeto reúne:
- Frontend institucional em React com TypeScript, CSS modular e animações fluidas.
- Backend em Laravel 12 com APIs REST e proteção contra requisições abusivas (throttling).
- Painel administrativo em Laravel Filament para gestão de projetos, tarefas (Kanban), contatos, mensagens, banners de chamada para ação (CTAs) e configurações gerais do site.

---

## Sumário

1. [Requisitos do Sistema](#requisitos-do-sistema)
2. [Início Rápido (Passo a Passo)](#início-rápido-passo-a-passo)
3. [Modos de Execução](#modos-de-execução)
4. [Credenciais de Acesso](#credenciais-de-acesso)
5. [Deploy (produção)](#deploy-produção)
6. [Estrutura do Projeto](#estrutura-do-projeto)
7. [Convenções de Componentes React](#convenções-de-componentes-react)
8. [Endpoints da API](#endpoints-da-api)
9. [Comandos Úteis](#comandos-úteis)
10. [Solução de Problemas Comuns](#solução-de-problemas-comuns)
11. [Padronização de Git e Branches](#padronização-de-git-e-branches)

---

## Requisitos do Sistema

Antes de iniciar, certifique-se de que os programas abaixo estão instalados no seu ambiente de desenvolvimento:

| Ferramenta | Versão Mínima | Versão Utilizada no Projeto | Finalidade |
| :--- | :--- | :--- | :--- |
| PHP | 8.2+ | 8.4.24 | Execução do backend Laravel e do painel Filament |
| Composer | 2.7+ | 2.10.3 | Gerenciamento de dependências do ecossistema PHP |
| Node.js | 20.x+ | 22.x LTS ou 24.x | Execução das ferramentas de frontend e Vite |
| npm | 10.x+ | 10.x+ | Gerenciamento de pacotes do Node.js |
| Banco de Dados | SQLite 3 (nativo) ou MySQL 8.0+ | SQLite 3 | Persistência de dados local |

### Extensões PHP Obrigatórias
No arquivo `php.ini` da sua instalação do PHP, certifique-se de que as seguintes extensões estão habilitadas (sem o caractere `;` no início da linha):

```ini
extension=curl
extension=fileinfo
extension=mbstring
extension=openssl
extension=pdo_sqlite
extension=sqlite3
extension=intl
```

> **Aviso para usuários Windows (Device Guard / AppLocker):**
> Se o seu Windows bloquear a execução do `php.exe` na pasta `%LOCALAPPDATA%` (quando instalado via Winget), instale o PHP em um diretório do sistema como `C:\Program Files\PHP` ou `C:\php`, ou utilize pacotes como Laragon ou XAMPP, adicionando o diretório à variável `PATH`.

---

## Início Rápido (Passo a Passo)

Siga o passo a passo abaixo para clonar, configurar e rodar o projeto na sua máquina:

### 1. Clonar o repositório
```bash
git clone https://github.com/MiguelRibasJunior/DFT.git
cd DFT
```

### 2. Instalar as dependências do projeto
```bash
# Dependências do backend (Laravel e Filament)
composer install

# Dependências do frontend (React, TypeScript e Vite)
npm install
```

### 3. Configurar o ambiente com comando único
Execute o script de inicialização padronizado:
```bash
composer run setup
```

Esse comando executa automaticamente as seguintes tarefas:
1. Cria o arquivo `.env` a partir de `.env.example` (se ainda não existir).
2. Gera a chave de criptografia da aplicação (`php artisan key:generate`).
3. Inicializa o arquivo de banco de dados SQLite em `database/database.sqlite`.
4. Executa todas as migrações de tabelas (`php artisan migrate --force`).
5. Popula o banco com os dados de demonstração do portfólio e cria o usuário Super Admin (`php artisan db:seed --force`). Fora de produção, se `ADMIN_PASSWORD` estiver vazia no `.env`, o admin é criado com a senha de teste descrita em [Credenciais de Acesso](#credenciais-de-acesso).

### 4. Iniciar a aplicação
```bash
composer run dev
```

Após iniciar, acesse no seu navegador:
- **Site Institucional:** http://localhost:8000
- **Painel Administrativo (Filament):** http://localhost:8000/admin

---

## Modos de Execução

Você pode executar o projeto de acordo com a necessidade da sua tarefa:

### Modo 1: Fullstack Completo (Recomendado)
Inicia o servidor backend do Laravel e o servidor de desenvolvimento do Vite simultaneamente com Hot Module Replacement (HMR):

```bash
composer run dev
```

Caso prefira rodar os serviços em dois terminais separados para facilitar a visualização de logs:
- **Terminal 1 (Backend Laravel):**
  ```bash
  php artisan serve --port=8000
  ```
- **Terminal 2 (Frontend Vite):**
  ```bash
  npm run dev:laravel
  ```

### Modo 2: Apenas Frontend (SPA Isolado)
Se for trabalhar exclusivamente na interface visual, em componentes ou no CSS, sem dependência do backend PHP:

```bash
npm run dev
```
Acessível diretamente em: http://localhost:8000

---

## Credenciais de Acesso

O painel fica em `/admin` (Filament) e o login é feito nessa tela. O usuário inicial é criado pelo seeder com os valores do `.env`:

| Campo | Valor |
| :--- | :--- |
| E-mail | `ADMIN_EMAIL` (padrão: admin@devsfromtomorrow.com) |
| Senha | `ADMIN_PASSWORD`. **Só em desenvolvimento**, se estiver vazia, o seeder usa a senha de teste `dft2026admin` |
| Perfil | Super Admin |

**Em produção a `ADMIN_PASSWORD` é obrigatória** (no mínimo 12 caracteres, e nunca uma senha de exemplo): o seeder recusa senhas fracas e não cria o admin. O site público não tem link nem modal de login para o painel. Veja [Deploy](#deploy-produção).

---

## Deploy (produção)

Guia para quem vai publicar o site. É um app Laravel comum: **um único servidor PHP serve o site, a API e o painel `/admin`**. Os passos que dependem do tipo de hospedagem (compartilhada, VPS) estão marcados com ⚠️.

### 1. Requisitos do servidor
- **PHP 8.2 ou superior** com as extensões: `ctype`, `curl`, `dom`, `fileinfo`, `filter`, `iconv`, `intl`, `json`, `libxml`, `mbstring`, `openssl`, `pdo` (+ `pdo_sqlite` **ou** `pdo_mysql`), `phar`, `session`, `tokenizer`, `xml`, `xmlreader`, `xmlwriter` e `zip`. O `composer.json` fixa `config.platform.php = 8.2.0`: as dependências travadas no `composer.lock` funcionam do PHP 8.2 em diante.
- **Composer 2**.
- **Node.js 20+** só para gerar o front-end (`npm run build`). `public/build/` **não é versionado**: gere-o na máquina de build (ou no servidor) e garanta que a pasta chegue ao servidor.
- **Banco de dados:** SQLite (`database/database.sqlite`) funciona para um site pequeno. Para MySQL, ajuste as variáveis `DB_*` do `.env`. A suíte de testes completa já foi executada com sucesso num **MySQL 8.0.39** e num MariaDB 10.4.32 (e o CI roda em SQLite), mas **a versão do MySQL da hospedagem não foi testada**: se a produção for MySQL, rode as migrations e o teste final (passo 5) nele antes de divulgar.
- ⚠️ **Raiz do site (document root) deve ser a pasta `public/`**, nunca a raiz do projeto. Em hospedagem compartilhada, aponte o domínio para `public/` no painel da hospedagem. Se não for possível, mantenha o projeto fora da pasta pública e copie só o conteúdo de `public/` para ela, ajustando os caminhos em `index.php`.
- ⚠️ **Escrita:** `storage/` e `bootstrap/cache/` precisam de permissão de escrita pelo usuário do PHP (e `database/` e o arquivo `database.sqlite`, se usar SQLite).
- ⚠️ **Ligue o OPcache** no PHP (`opcache.enable=1`; em produção, `opcache.validate_timestamps=0` e reinicie o PHP a cada deploy). Sem ele, cada requisição recompila o Laravel inteiro: nos testes, a resposta ficou ~3 vezes mais lenta.
- **Compressão e cache** dos arquivos do site já estão no `public/.htaccess` (Apache e LiteSpeed). Em **Nginx** o `.htaccess` não vale: ligue `gzip on;` (ou brotli) para `text/html`, `text/css`, `application/javascript`, `application/json` e `image/svg+xml`, e dê `Cache-Control: public, max-age=31536000, immutable` aos arquivos de `/build/assets/`.
- Não há fila nem agendador: **não é preciso configurar `queue:work` nem cron**.

### 2. Variáveis do `.env`
O `.env.example` vem com valores de **desenvolvimento**. Crie o `.env` a partir dele e troque o que a tabela indica:

| Variável | Valor em produção |
| :--- | :--- |
| `APP_ENV` | `production` |
| `APP_DEBUG` | `false` (**nunca** `true` em produção: expõe erros e segredos) |
| `APP_URL` | URL final com `https://`, sem barra no fim. Define o domínio do canonical e das imagens de compartilhamento |
| `APP_KEY` | vem **vazia** no exemplo; gere com `php artisan key:generate` (uma vez; não troque depois). Nunca copie a chave de outro ambiente |
| `DB_CONNECTION` / `DB_*` | SQLite (padrão) ou os dados do MySQL |
| `ADMIN_EMAIL` | e-mail do primeiro administrador |
| `ADMIN_PASSWORD` | **obrigatória em produção:** no mínimo 12 caracteres e **nunca uma senha de exemplo** (`admin123`, `dft2026admin`...). O seeder recusa senhas fracas e não cria o admin |
| `ADMIN_NOTIFICATION_EMAIL` | e-mail que recebe o aviso de cada novo contato do formulário |
| `VITE_SITE_URL` | URL final do site. É lida **na hora do build** do front-end (passo 3) |
| `VITE_API_BASE_URL` | `/api` (padrão) |

> Nunca coloque senhas ou chaves em variáveis `VITE_*`: o Vite as embute no JavaScript que vai para o navegador de todos os visitantes.

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
php artisan filament:optimize   # cache dos componentes e ícones do Filament: a requisição caiu de ~60-85 ms para ~14 ms nos testes
```
- ⚠️ **Rode o `db:seed` antes do `config:cache`.** O seeder lê `ADMIN_PASSWORD` direto do `.env`; com a configuração em cache, essa leitura volta vazia e o seeder aborta.
- ⚠️ **`storage:link`** cria um atalho (symlink) de `public/storage` para `storage/app/public`. Algumas hospedagens compartilhadas bloqueiam symlinks; nesse caso, peça ao suporte para liberar ou crie o atalho pelo painel. Sem ele, **as imagens enviadas no admin (capas de projeto, logo, favicon) não aparecem**.
- **Atualizações futuras:** `git pull`, `composer install --no-dev -o`, `npm ci && npm run build`, `php artisan migrate --force` e depois `php artisan optimize:clear && php artisan filament:optimize-clear` seguido dos caches do passo 5 (inclusive `filament:optimize`).
- **Faça backup do banco antes de rodar `migrate`** em um site que já tenha dados reais (com SQLite, copie o arquivo `database/database.sqlite`).

### 4. Antes de divulgar o site
1. **`public/sitemap.xml` e `public/robots.txt`** têm o domínio `https://devsfromtomorrow.com` e as datas escritos à mão. Se o domínio for outro, troque em todas as linhas (`<loc>`, `<lastmod>` e `Sitemap:`).
2. **Troque a senha do admin** depois do primeiro acesso, e crie um usuário por pessoa (menu **Usuários**) com o papel certo (*Editor* para quem só edita conteúdo).
3. **Cadastre o conteúdo no painel `/admin`.** Em produção o seeder cria só os papéis e o admin, então o site sai vazio:
   - **Canais de contato** (WhatsApp, e-mail, telefone, redes): aparecem no formulário de contato, no rodapé e nos dados para o Google.
   - **Projetos**: só aparecem os marcados como *Publicado* **e** *Destaque*.
   - **CTA** da seção final, e **Rodapé** (descrição, links, Política de Privacidade e Termos de Uso, que precisam de revisão antes de ir ao ar).
   - **Configurações**: nome do site, logo, favicon e SEO (título, descrição, imagem de compartilhamento).
4. **Analytics e cookies (LGPD).** Os campos de Google Analytics e Tag Manager (Configurações → Integrações) podem ficar em branco: sem eles o site usa só cookies técnicos e **não mostra aviso nenhum**. Se forem preenchidos, em produção o site passa a exibir o **banner de cookies** e o Google **só é carregado depois que o visitante clica em "Aceitar"** ("Recusar" tem o mesmo peso, e o rodapé ganha "Preferências de cookies" para mudar de ideia; a escolha vale 12 meses). Antes de preencher: **atualize a Política de Privacidade** (Rodapé) para citar os cookies de análise do Google e peça revisão jurídica; o texto da página `/privacidade` e o de demonstração já trazem uma seção "Cookies", mas não substituem a revisão.
5. **Ative o aviso por e-mail.** O aviso de novo contato é enviado pelo serviço [formsubmit.co](https://formsubmit.co). Na primeira vez que alguém usa o formulário, o serviço envia um e-mail de confirmação para `ADMIN_NOTIFICATION_EMAIL`, que precisa ser aceito para os avisos passarem a chegar. Os contatos são **sempre salvos** no painel, mesmo se o aviso falhar; em **Contatos** dá para ver se cada aviso saiu.

### 5. Teste final (smoke test)
- A página inicial abre com HTTPS, sem erro, e as imagens dos projetos e a logo carregam.
- `/admin` pede login; o login funciona e as telas abrem (Projetos, Contatos, Configurações).
- `/api/admin/submissions` responde **404** (não existe API administrativa).
- Envie um contato pelo formulário: ele aparece em **Contatos** e o e-mail de aviso chega (ou o status mostra `Falhou`).
- Edite o título em **Configurações → SEO**, salve e confira que ele muda na aba do navegador.
- Com analytics preenchido: ao abrir o site em uma janela anônima aparece o banner de cookies e, **antes de clicar em "Aceitar"**, a aba Rede do navegador não mostra nenhuma requisição ao Google (googletagmanager.com).
- `/robots.txt` e `/sitemap.xml` abrem e mostram o domínio certo.
- **Verificação automática de leitura (opcional):** `k6 run -e BASE_URL=https://seu-dominio.com -e ALLOW_REMOTE=1 k6/smoke.js` confere 35 pontos (páginas, API sem campos internos, `/api/admin/*` inexistente, `/admin` pedindo login, 404 sem detalhes técnicos, `.env` não servido). Só faz `GET`. **Não rode `k6/load.js` nem `k6/contact.js` contra o site publicado** (ver `k6/README.md`).
- Em caso de erro 500, veja `storage/logs/laravel.log`.

### 6. Pendências conhecidas (leia antes de publicar)

Resumo do que **ainda não está resolvido**. Os itens da primeira lista impedem ou comprometem a publicação; as demais são melhorias. Detalhes técnicos estão na documentação técnica do projeto.

**Resolver antes de publicar**
1. **Quem faz o deploy e onde.** Ainda não há responsável nem hospedagem definidos. Faltam hospedagem, domínio, DNS, SSL, banco e rotina de backup. Siga os passos 1 a 5 acima.
2. **Cadastre os projetos no admin, senão aparecem projetos de mentira.** Se a API não devolver nenhum projeto publicado em destaque, o portfólio mostra **3 projetos fictícios fixos no código** (`FALLBACK_PROJECTS`, em `resources/js/components/sections/Portfolio.tsx`). Em produção o seeder não cria conteúdo, então um site novo, sem cadastro, **iria ao ar com esses 3 projetos**. Cadastre ao menos um projeto como *Publicado* **e** *Destaque* (passo 4, item 3), ou peça para trocar esse comportamento por um aviso de "nenhum projeto".
3. **Revisão jurídica** do texto do banner de cookies e da Política de Privacidade. Há **duas versões** da política: a do **Rodapé** do admin (abre no modal do rodapé) e a página fixa `/privacidade`, escrita no código (`resources/js/Pages/Privacy.tsx`) e **que não vem do admin**. Os Termos têm a mesma divisão (`/termos`). Alinhe as duas versões. Enquanto isso não for feito, **deixe os campos de analytics em branco** (passo 4, item 4).
4. **Versão do MySQL da hospedagem.** Ver passo 1: rode as migrations nela e o teste final antes de divulgar.
5. **Domínio e datas** de `public/sitemap.xml` e `public/robots.txt` (passo 4, item 1) e **senha forte** do admin (passo 2).
6. **Aviso por e-mail.** Confirme o e-mail do formsubmit.co (passo 4, item 5). Se o aviso falhar, **não há nova tentativa**: o contato fica salvo no painel com o status `erro` e é preciso olhar a lista de **Contatos** de vez em quando. O aviso depende de um serviço externo, embora o card do projeto peça "sem automações externas".

**Incompleto em relação ao que os cards pediam**
- **Projetos dinâmicos (SITE-07):** os cards do portfólio não mostram o link do projeto nem o do GitHub; o botão "Ver projeto" abre só a descrição curta. Os campos existem no admin, mas o site não os lê.
- **Desempenho (SITE-02):** medido em 24/11/2026 num servidor local parecido com produção (Apache, OPcache, caches do passo 5, compressão e cache): **Lighthouse 86 no celular e 98 no desktop** (acessibilidade, boas práticas e SEO em 100), CLS 0, TBT 0 e LCP de **3,4 s no celular** (a meta é ≤ 2,5 s) e 0,9 s no desktop. Detalhes e limites em `k6/README.md`. **Falta medir no site publicado, em HTTPS.** Para baixar o LCP do celular: as fontes do Google bloqueiam a renderização (hospedá-las localmente ou carregá-las sem bloquear), cerca de 180 KiB do JavaScript principal não são usados na carga inicial, e o React só desenha o Hero depois de baixar o pacote (renderizar no servidor seria a mudança grande, só vale se a nota ainda importar).
- **Carga (k6):** o site aguentou 30 visitantes simultâneos com p95 de ~40 ms, um pico súbito de 100 e até 150 simultâneos **sem nenhum erro** (p95 de 743 ms no pior caso). É uma medição local, com SQLite e tudo na mesma máquina; **refaça na hospedagem real** antes de divulgar em larga escala.
- **Dependências com avisos de segurança:** o `composer audit` aponta 12 avisos em 7 pacotes, e o `npm ci` reporta vulnerabilidades. Rode `composer audit` e `npm audit` e atualize antes de publicar, rodando a suíte (`php artisan test`) depois.

**Recomendado**
- **Proteção da branch `main` no GitHub** exigindo Pull Request. Já houve commits direto na `main` que quebraram o painel e o CI.
- **Testar em ambiente real** o que a suíte automática não cobre: teclado real, leitor de tela (NVDA/VoiceOver), outros navegadores (os testes de ponta a ponta usam só o Edge) e celulares de verdade.
- **Rodar os testes de ponta a ponta** (`cd e2e && npm install && npm test`) antes de cada publicação. Eles **não rodam no CI**.
- **Esconder a versão do servidor e do PHP.** As respostas trazem `Server: Apache/2.4... PHP/8.2...` e `X-Powered-By: PHP/8.2...`. Na hospedagem, desligue com `expose_php = Off` no `php.ini` (e `ServerTokens Prod` no Apache, se for possível). O site também **não envia cabeçalhos de segurança** (`Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Content-Security-Policy`); vale configurá-los no servidor depois do HTTPS.
- O CI roda só em SQLite e PHP 8.4; uma regressão em MySQL ou PHP 8.2 só aparece rodando a suíte com `DB_CONNECTION=mysql` ou no PHP 8.2.
- **Lixeira:** projetos, mensagens e contatos apagados ficam na lixeira até alguém excluir definitivamente (só o Super Admin); não há limpeza automática.
- O `app.env` e o `app.debug` aparecem nos dados que a página envia ao navegador (props compartilhadas do Inertia). Com `APP_DEBUG=false` não há risco real, mas vale remover.
- A página `/privacidade` e `/termos` mostram sempre a **data de hoje** em "Última atualização", não a data real da revisão do texto.

---

## Estrutura do Projeto

O frontend React vive dentro do próprio repositório Laravel e é servido através da view principal `resources/views/app.blade.php`:

```
DFT/
├── app/
│   ├── Filament/Resources/       # Recursos do painel (Projetos, Contatos, Mensagens, CTAs, Usuários)
│   ├── Http/Controllers/         # Controladores da API REST
│   └── Models/                   # Modelos de dados Eloquent
├── config/                       # Configurações do framework Laravel
├── database/
│   ├── migrations/               # Migrações das tabelas do banco de dados
│   └── seeders/                  # Dados iniciais para testes locais
├── e2e/                          # Testes de ponta a ponta (Playwright): site, painel, cookies e acessibilidade
├── k6/                           # Testes de fumaça e de carga (k6), com os resultados medidos
├── public/                       # Arquivos públicos e ponto de entrada da aplicação
├── resources/
│   ├── css/
│   │   └── index.css             # Estilos globais e tokens visuais do Design System
│   ├── js/
│   │   ├── Pages/                # Páginas entregues via Inertia (Home, Privacy, Terms, Error)
│   │   ├── components/           # Componentes visuais reutilizáveis
│   │   ├── motion/               # Módulo de animações declarativas com suporte a acessibilidade
│   │   ├── services/             # Funções de requisição HTTP para a API
│   │   ├── types/                # Definições de tipos TypeScript
│   │   ├── App.tsx               # Componente principal da Home React
│   │   └── main.tsx              # Ponto de entrada do Inertia.js
│   └── views/
│       └── app.blade.php         # View Blade única que carrega o React via Vite
├── routes/
│   ├── api.php                   # Rotas da API REST
│   └── web.php                   # Rotas de navegação da aplicação
└── vite.config.ts                # Configuração do Vite integrada ao Laravel
```

---

## Convenções de Componentes React

Para manter o código uniforme e de fácil manutenção, todos os componentes do frontend seguem as seguintes diretrizes:

1. **Nomenclatura em PascalCase:**
   Arquivos e funções de componentes utilizam obrigatoriamente PascalCase (ex.: `Hero.tsx`, `Navbar.tsx`, `ContactForm.tsx`, `ProjectModal.tsx`).

2. **Tipagem Estrita com TypeScript:**
   Cada componente declara uma interface dedicada para suas propriedades (ex.: `interface ContactFormProps { ... }`), evitando o uso de `any`.

3. **Separação de Camadas:**
   - Componentes visuais e interativos ficam em `resources/js/components/`.
   - Chamadas HTTP à API ficam em `resources/js/services/`.
   - Tipos e modelos compartilhados ficam em `resources/js/types/`.

4. **Padrão Barrel Export (`index.ts`):**
   O arquivo `resources/js/components/index.ts` centraliza as exportações dos componentes reutilizáveis, permitindo importações simplificadas:
   ```tsx
   import { Navbar, Hero, ContactForm, Footer } from '@/components';
   ```

5. **Animações com Suporte a Acessibilidade:**
   Ao adicionar animações, utilize o módulo em `resources/js/motion/`. Ele detecta a preferência do sistema operacional (`prefers-reduced-motion`) e reduz automaticamente deslocamentos e rotações para usuários com sensibilidade a movimentos.

### Configuração do TypeScript e Aliases

O projeto utiliza TypeScript com verificação estrita em todo o código do frontend:
- **Modo Estrito:** Ativado no arquivo `tsconfig.app.json` (`"strict": true`, `"noUnusedLocals": true`, `"noUnusedParameters": true`).
- **Path Alias (`@/*`):** Configurado de forma sincronizada no `vite.config.ts` e no `tsconfig.app.json`, apontando para a raiz de scripts em `resources/js/*`:
  ```tsx
  import { Hero, Navbar } from '@/components';
  import { motion, VARIANTS } from '@/motion';
  import { getProjects } from '@/services/contentService';
  ```

### Tipos Compartilhados

As interfaces de domínio e tipos reutilizáveis da aplicação ficam centralizados na pasta `resources/js/types/` e são exportados através do arquivo `resources/js/types/index.ts`:

- `ContactSubmission` e `SubmissionStatus`: Dados de submissões de contato e orçamento (`resources/js/types/contact.ts`).
- `PublicProject`: Estrutura dos projetos do portfólio exibidos no site (`resources/js/types/models.ts`).
- `PublicCta`: Dados dinâmicos de chamadas para ação (`resources/js/types/models.ts`).
- `PublicSiteSettings`: Configurações públicas do site, contatos e redes sociais (`resources/js/types/models.ts`).

Exemplo de importação dos tipos compartilhados via alias:
```tsx
import type { PublicProject, ContactSubmission } from '@/types';
```

Para a documentação completa com detalhes de interfaces e arquitetura do compilador, consulte o guia oficial em [docs/TYPESCRIPT.md](docs/TYPESCRIPT.md).

---

## Comunicação Inertia.js (Laravel & React)

A plataforma utiliza o **Inertia.js** como camada de conexão direta entre o backend Laravel 12 e o frontend React 19:

1. **Ciclo de Entrega e Respostas Inertia:**
   - O Laravel entrega as páginas React via `Inertia::render('NomeDaPagina', $props)`.
   - Na primeira visita (HTML inicial), a view Blade `resources/views/app.blade.php` inicializa o container `<div id="app">` e os dados do payload via `<x-inertia::head />` e `<x-inertia::app />`.
   - Nas transições subsequentes, as requisições AJAX do Inertia (`X-Inertia: true`) recebem respostas em JSON com o componente e as props atualizadas, alterando a URL sem reload completo da página.

2. **Middleware `HandleInertiaRequests`:**
   - Localizado em `app/Http/Middleware/HandleInertiaRequests.php` e anexado ao grupo `web` no `bootstrap/app.php`.
   - Gerencia a versão de assets com base no hash do manifesto compilado (`manifest.json`), disparando recarregamento automático em caso de nova versão publicada.
   - Compartilha props globais com todos os componentes:
     - `auth.user`: Usuário autenticado na sessão.
     - `flash`: Mensagens de retorno temporárias (`success`, `error`, `message`).
     - `app`: Metadados do ambiente (`name`, `env`, `debug`).

3. **Navegação SPA sem Reload Completo:**
   - Links entre páginas utilizam o componente `<Link href="...">` de `@inertiajs/react`.
   - Páginas disponíveis:
     - `/`: Página principal (`Home.tsx`) com Hero, Soluções, Portfólio, Diferenciais e Contato.
     - `/privacidade`: Política de privacidade (`Privacy.tsx`) com conformidade LGPD.
     - `/termos`: Termos e condições de uso (`Terms.tsx`).
   - Barra de progresso visual de transição (`progress: { color: '#28D7E5' }`) configurada no `resources/js/main.tsx`.

4. **Tratamento de Erros e Diagnósticos Locais:**
   - Rota de fallback e manipulador de exceções em `bootstrap/app.php` capturam status 403, 404, 500 e 503, renderizando o componente de página dedicado `resources/js/Pages/Error.tsx`.
   - Em ambiente local (`APP_ENV=local` ou `APP_DEBUG=true`), detalhes do erro e pilha de rastreamento são exibidos na tela para facilitar o diagnóstico rápido.
   - O ponto de entrada `resources/js/main.tsx` escuta eventos `httpException` e `networkError` do roteador Inertia, registrando diagnósticos no console do navegador.

---

## Endpoints da API

Endpoints disponíveis no arquivo `routes/api.php`:

| Método | Rota | Descrição | Acesso / Limite |
| :--- | :--- | :--- | :--- |
| POST | /api/contact | Envio do formulário de orçamento | Público (limite de 6 req/min) |
| GET | /api/projects | Listagem de projetos publicados no portfólio | Público |
| GET | /api/ctas/{position} | Conteúdo do banner CTA ativo por posição | Público |
| GET | /api/contact-links | Canais de contato ativos (WhatsApp, e-mail, telefone, redes) | Público |
| GET | /api/settings | Configurações públicas (nome, logo, rodapé, textos legais) | Público |

**Não existe API administrativa.** Todo o painel (login, projetos, contatos, configurações) é o Filament em `/admin`, com papéis e permissões por policy. Uma versão anterior de rotas `/api/admin/*` não exigia login e foi removida; um teste (`SecurityAuditTest`) garante que elas não voltem.

---

## Comandos Úteis

### Comandos do Composer
```bash
composer run setup    # Executa a configuração completa do ambiente local
composer run dev      # Inicia o Laravel e o Vite simultaneamente
composer run test     # Limpa cache e executa os testes do PHPUnit
```

### Testes
```bash
php artisan test                  # PHPUnit: 296 testes, em SQLite em memória (o mesmo que roda no CI)
cd e2e && npm install && npm test  # Playwright: navegador de verdade (Edge), banco e porta próprios, nada sai para a internet
k6 run k6/smoke.js                # k6: fumaça, só leitura (veja k6/README.md para carga e formulário)
```

### Comandos do npm
```bash
npm run dev           # Inicia apenas o frontend em modo SPA (porta 8000)
npm run dev:laravel   # Inicia o Vite em modo integrado ao Laravel (porta 3000)
npm run build         # Compila e otimiza os assets para produção
npm run type-check    # Executa a verificação estrita de tipos com TypeScript (tsc -b)
npm run lint          # Executa a verificação estática de código com oxlint
npm run preview       # Visualiza o build de produção localmente
```

---

## Solução de Problemas Comuns

### 1. Erro: Failed to listen on 127.0.0.1:8000 (reason: ?) ou erro de concurrently
- **Causa:** A porta 8000 já está ocupada por outra aplicação ou por uma execução anterior do `npm run dev` (modo SPA) que permaneceu rodando em segundo plano.
- **Solução no PowerShell:**
  ```powershell
  # Encerra qualquer processo ativo nas portas 8000 e 3000
  Stop-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess -Force -ErrorAction SilentlyContinue
  Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force -ErrorAction SilentlyContinue
  ```
  Depois de liberar a porta, execute `composer run dev` novamente.

### 2. Erro: Uma política de Controle de Aplicativo bloqueou este arquivo php.exe
- **Causa:** O PHP foi instalado via Winget na pasta `%LOCALAPPDATA%`, bloqueada pelo Windows Device Guard ou políticas locais de segurança.
- **Solução:** Mova ou instale o PHP em um diretório como `C:\Program Files\PHP` ou `C:\php`, ou use suítes como Laragon ou XAMPP, adicionando o caminho nas Variáveis de Ambiente do Sistema (`PATH`).

### 3. Erro: could not find driver (SQL: select ...)
- **Causa:** A extensão `pdo_sqlite` não está habilitada no seu `php.ini`.
- **Solução:** Abra o arquivo `php.ini`, remova o ponto e vírgula `;` antes de `extension=pdo_sqlite` e salve o arquivo.

---

## Padronização de Git e Branches

O projeto segue um fluxo estruturado com 3 ambientes e branches principais:
- **develop:** Integração contínua de novas funcionalidades durante as sprints.
- **homolog:** Ambiente de testes e validação pré-produção.
- **main:** Código estável refletindo rigorosamente o ambiente de produção.

### Diretrizes de Contribuição
1. **Revisão Obrigatória:** Todo merge nas branches `main` e `homolog` exige aprovação formal via Pull Request. O envio direto (`push`) para essas branches é bloqueado.
2. **Padrão de Branches:** Use o formato `<tipo>/<codigo-tarefa>-<descricao-em-kebab-case>`:
   - Novas funcionalidades: `feature/SITE-12-painel-orcamentos`
   - Correções de bugs: `bugfix/SITE-14-ajuste-responsividade`
   - Correções críticas em produção: `hotfix/SITE-99-falha-envio`
   - Fechamento de versões: `release/v1.2.0`
3. **Template de Pull Request:** Ao abrir um PR, utilize o modelo padronizado disponível em `.github/pull_request_template.md`.

Para consultar diagramas visuais, regras completas e configuração de proteção de branches, consulte o guia oficial em [docs/GIT_WORKFLOW.md](docs/GIT_WORKFLOW.md).
