# TypeScript no Frontend — Devs From Tomorrow (DFT)

Este documento descreve a arquitetura, configuração, padrões de aliases, modo estrito e tipos compartilhados utilizados no ecossistema frontend da plataforma **Devs From Tomorrow**.

---

## 1. Visão Geral

O frontend da aplicação utiliza **React 19** com **TypeScript**, empacotado via **Vite 8** integrado ao **Laravel 12**.

Todo o código-fonte em `resources/js/` é estritamente tipado, garantindo:
- Detecção precoce de erros em tempo de compilação.
- Autocomplete e refatoração confiável na IDE.
- Contratos de dados claros entre o backend Laravel e os componentes React.
- Zero uso de `any` em componentes e serviços centrais.

---

## 2. Configurações do TypeScript

A configuração é modularizada através de referências de projeto (Project References):

| Arquivo | Finalidade | Escopo |
| :--- | :--- | :--- |
| `tsconfig.json` | Arquivo raiz com Project References | Orquestra as compilações do app e tooling |
| `tsconfig.app.json` | Configuração principal do frontend React | `resources/js/**/*` |
| `tsconfig.node.json` | Configuração do ambiente de build/tooling | `vite.config.ts` |

### Modo Estrito (`strict: true`)

No `tsconfig.app.json`, as seguintes diretivas garantem a robustez do código:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "noEmit": true
  }
}
```

- **`strict: true`**: Habilita verificações completas como `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes` e `strictPropertyInitialization`.
- **`noUnusedLocals` & `noUnusedParameters`**: Impede variáveis ou parâmetros declarados sem uso.
- **`erasableSyntaxOnly`**: Garante compatibilidade com engines de strip-types modernas.

---

## 3. Path Aliases (`@/*`)

O alias `@/*` está configurado tanto no TypeScript quanto no bundler Vite para evitar caminhos relativos complexos (ex.: `../../components`):

### Mapeamento
- `@/*` aponta para `./resources/js/*`

### Configuração no `tsconfig.app.json`
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./resources/js/*"]
    }
  }
}
```

### Configuração no `vite.config.ts`
```ts
resolve: {
  alias: {
    '@': path.resolve(import.meta.dirname, './resources/js'),
  },
}
```

### Exemplos de Uso
```tsx
// Componentes visuais
import { Navbar, Hero, ContactForm, Footer } from '@/components';

// Animações e Motion
import { motion, VARIANTS } from '@/motion';

// Serviços e chamadas HTTP
import { getProjects, getSiteSettings } from '@/services/contentService';
import { addSubmission } from '@/services/submissionService';

// Hooks utilitários
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

// Tipos compartilhados
import type { PublicProject, ContactSubmission, PublicSiteSettings } from '@/types';
```

---

## 4. Tipos Compartilhados (`@/types`)

Todos os modelos e contratos de dados compartilhados estão centralizados em `resources/js/types/` e expostos através do barrel file `resources/js/types/index.ts`:

```tsx
export * from './contact';
export * from './models';
```

### Catálogo de Interfaces e Tipos

#### 1. Contatos e Orçamentos (`resources/js/types/contact.ts`)

- **`SubmissionStatus`**: Estados possíveis para uma mensagem de contato (`'nova' | 'lida' | 'respondida'`).
- **`ContactSubmission`**: Estrutura dos leads e solicitações de orçamento:
  ```ts
  export interface ContactSubmission {
    id: string;
    nome: string;
    empresa?: string;
    email: string;
    telefone: string;
    tipoSolucao: string;
    descricao: string;
    createdAt: string;
    status: SubmissionStatus;
    emailTriggerStatus?: 'sucesso' | 'erro' | 'pendente';
    emailTriggerError?: string;
    lastEmailSentAt?: string;
  }
  ```

#### 2. Modelos de Domínio (`resources/js/types/models.ts`)

- **`PublicProject`**: Dados de projetos exibidos no portfólio institucional (consumidos via `/api/projects`):
  ```ts
  export interface PublicProject {
    id: number;
    title: string;
    slug: string;
    short_description: string;
    description: string;
    category: string;
    technologies: string[] | null;
    cover_image: string | null;
    project_url: string | null;
    github_url: string | null;
    external_url: string | null;
  }
  ```

- **`PublicCta`**: Informações do banner de Call-to-Action ativo (consumido via `/api/ctas/{position}`):
  ```ts
  export interface PublicCta {
    title: string;
    subtitle: string | null;
    button_text: string;
    button_url: string;
  }
  ```

- **`PublicSiteSettings`**: Configurações institucionais públicas (consumidas via `/api/settings`):
  ```ts
  export interface PublicSiteSettings {
    site_name: string;
    description: string | null;
    logo: string | null;
    favicon: string | null;
    phone: string | null;
    whatsapp: string | null;
    email: string | null;
    address: string | null;
    instagram: string | null;
    facebook: string | null;
    linkedin: string | null;
    youtube: string | null;
    github: string | null;
    footer_links: { label: string; url: string }[] | null;
    copyright_text: string | null;
    privacy_url: string | null;
    terms_url: string | null;
  }
  ```

---

## 5. Scripts de Checagem e Validação

Para validar os tipos e a integridade do código sem gerar arquivos de saída:

```bash
# Executa a checagem de tipos estrita em todo o projeto
npm run type-check

# Executa linting estático com oxlint
npm run lint

# Executa checagem de tipos e compilação de produção via Vite
npm run build
```

Ambos os scripts (`type-check` e `build`) executam `tsc -b` (TypeScript Project References build mode), garantindo 0 erros em tempo de CI/CD.

