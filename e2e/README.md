# Testes de ponta a ponta (Playwright)

Abrem o site e o painel em um navegador de verdade e conferem o que o visitante e o administrador veem: layout em várias larguras, menu, modais, formulário de contato, banner de cookies (LGPD), painel `/admin`, lixeira e acessibilidade automatizada (axe, WCAG 2.1 A/AA).

## Como rodar

```bash
cd e2e
npm install        # só na primeira vez (instala o Playwright; NÃO baixa navegador)
npm test           # roda tudo
npm test -- tests/05-cookies.spec.ts     # só um arquivo
npm run test:headed                       # com o navegador visível
npm run report                            # abre o relatório HTML da última execução
```

Requisitos: PHP 8.2+, Node 20+ e o **Microsoft Edge** instalado (os testes usam o Edge do computador, sem baixar navegador). Para usar outro navegador, troque `channel` em `playwright.config.ts`.

## O que o `npm test` faz

1. Cria um banco SQLite **só dos testes** (`e2e/.tmp/e2e.sqlite`, com conteúdo de demonstração). **O seu banco e o seu `.env` não são tocados.**
2. Esconde o `public/hot` (senão o Vite acharia que há servidor de desenvolvimento) e gera o build do front-end. O `public/hot` é devolvido no fim, mesmo se a execução falhar.
3. Sobe o servidor PHP na porta **8012**, em modo `production`, com IDs de analytics de teste.
4. Roda os testes, em ordem (`01-…` a `07-…`), um de cada vez.

## Garantias de segurança do ambiente de teste

- **Nada sai para a internet.** O Google Analytics/Tag Manager é interceptado pelos testes (e usado para provar que nada é pedido antes do "Aceitar"), o Google Fonts é respondido vazio e o aviso por e-mail do formulário aponta para uma porta sem ninguém ouvindo (`CONTACT_NOTIFICATION_ENDPOINT`). Nenhum e-mail real é enviado.
- O login do painel usa um usuário só dos testes (`e2e-admin@example.test`), criado no banco isolado. O Filament limita o login a 5 tentativas por minuto, por isso a sessão é criada uma vez e reaproveitada.

## Defeitos conhecidos (marcados com `test.fail`)

Cinco testes documentam defeitos reais do site. Eles **passam enquanto o defeito existir** e **ficam vermelhos quando alguém o corrige**: aí é só apagar a linha `test.fail(...)` do teste.

| Teste | Defeito |
|---|---|
| `05-cookies` › banner compacto no desktop | botões do banner com ~200 px de altura |
| `07-acessibilidade` › home (2 testes) | botão dentro de botão nos cards de projeto; nome acessível sem o texto visível |
| `07-acessibilidade` › páginas legais | links só diferenciados por cor |
| `07-acessibilidade` › login do painel | contraste do link "Voltar ao site" |

Há ainda um `test.fixme` em `01-pagina-inicial`: clicar no menu no primeiro instante, antes das seções carregarem, às vezes faz a página parar antes da seção.

## Quando um teste falha

O relatório (`npm run report`) traz print, vídeo-rastro (`trace`) e o passo exato. Os arquivos ficam em `e2e/test-results/` e `e2e/playwright-report/` (ignorados pelo Git).
