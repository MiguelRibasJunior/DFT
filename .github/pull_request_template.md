## 📋 Descrição do Pull Request

**ID da Tarefa/Issue:** `[SITE-XXX]`
**Branch de Destino:** `develop` | `homolog` | `main`

### O que foi feito?
- Descreva de forma concisa e clara as mudanças introduzidas.
- Explique o motivo da alteração e o impacto esperado.

---

## 🏷️ Tipo de Mudança

- [ ] ✨ `feature`: Nova funcionalidade
- [ ] 🐛 `bugfix`: Correção de bug em desenvolvimento/homologação
- [ ] 🚨 `hotfix`: Correção crítica urgente em produção
- [ ] ♻️ `refactor`: Refatoração ou melhoria sem alterar comportamento
- [ ] 📝 `docs`: Alterações na documentação
- [ ] ⚡ `perf`: Melhoria de performance
- [ ] 🔧 `chore`: Atualização de dependências ou ferramentas de build

---

## 🧪 Checklist de Qualidade e Validação Local

Antes de submeter para revisão, marque os itens concluídos:

- [ ] O código segue as convenções de estilo e padrões do projeto.
- [ ] Minha branch está atualizada com a branch de destino (`git merge` ou `rebase`).
- [ ] Os testes unitários/feature foram executados e passaram:
  ```bash
  composer run test
  ```
- [ ] A checagem de tipos estrita do TypeScript passou sem erros:
  ```bash
  npm run type-check
  ```
- [ ] O linter estático foi executado sem erros impeditivos:
  ```bash
  npm run lint
  ```
- [ ] O build de produção do frontend foi testado com sucesso:
  ```bash
  npm run build
  ```
- [ ] Não foram incluídas credenciais, senhas ou dados sensíveis nos commits.
- [ ] A documentação foi atualizada (quando aplicável).

---

## 📸 Evidências / Screenshots (quando aplicável)

*Adicione prints de tela, gravações ou payloads de resposta que comprovem o funcionamento da alteração.*

---

## 🛡️ Checklist do Revisor (Code Reviewer)

> ⚠️ **Atenção:** Merges na branch principal (`main`) e em `homolog` **exigem obrigatoriamente** aprovação de pelo menos 1 revisor.

- [ ] As mudanças atendem aos critérios de aceite da tarefa.
- [ ] A convenção de branches e commits foi respeitada.
- [ ] Não há falhas óbvias de segurança ou performance.
- [ ] Aprovado para merge na branch indicada.

