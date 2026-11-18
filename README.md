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
5. [Estrutura do Projeto](#estrutura-do-projeto)
6. [Convenções de Componentes React](#convenções-de-componentes-react)
7. [Endpoints da API](#endpoints-da-api)
8. [Comandos Úteis](#comandos-úteis)
9. [Solução de Problemas Comuns](#solução-de-problemas-comuns)
10. [Padronização de Git e Branches](#padronização-de-git-e-branches)

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
4. Executa todas as 12 migrações de tabelas (`php artisan migrate --force`).
5. Popula o banco com os dados iniciais do portfólio e cria o usuário Super Admin (`php artisan db:seed --force`).

### 4. Iniciar a aplicação
```bash
composer run dev
```

Após iniciar, acesse no seu navegador:
- **Site Institucional:** http://localhost:8000
- **Painel Administrativo Filament:** http://localhost:8000/admin
- **Painel Administrativo React (SPA):** http://localhost:8000/#admin

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

Ao inicializar o banco de dados localmente pela primeira vez, utilize as credenciais padrão:

| Campo | Valor Padrão |
| :--- | :--- |
| E-mail | admin@devsfromtomorrow.com |
| Senha | admin123 |
| Perfil | Super Admin |

No modal de login do site há também um botão "Preencher credenciais" que preenche esses dados automaticamente para testes rápidos.

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
- `AdminUser`: Modelo do usuário administrador logado (`resources/js/types/models.ts`).

Exemplo de importação dos tipos compartilhados via alias:
```tsx
import type { PublicProject, ContactSubmission, AdminUser } from '@/types';
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
| GET | /api/settings | Configurações públicas (redes sociais, contatos, rodapé) | Público |
| POST | /api/admin/login | Autenticação administrativa via API | Público |
| GET | /api/admin/submissions | Listagem de leads e mensagens recebidas | Administrativo |
| GET/POST/PUT/DELETE | /api/admin/projects | Gerenciamento de projetos do portfólio | Administrativo |
| PUT | /api/admin/settings | Atualização das configurações institucionais | Administrativo |

---

## Comandos Úteis

### Comandos do Composer
```bash
composer run setup    # Executa a configuração completa do ambiente local
composer run dev      # Inicia o Laravel e o Vite simultaneamente
composer run test     # Limpa cache e executa os testes do PHPUnit
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
