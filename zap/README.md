# Testes de segurança (OWASP ZAP)

Planos do [OWASP ZAP](https://www.zaproxy.org) (modo *Automation Framework*) que varrem o site público e o painel `/admin` procurando falhas: injeção (SQL, XSS, comandos, template), cabeçalhos de segurança ausentes, cookies mal configurados, vazamento de versões e de informação, configuração insegura.

> **Só rode contra um ambiente de teste.** A varredura **ativa** envia ataques de verdade e grava lixo no banco (os testes de 24/11/2026 criaram dezenas de contatos de mentira). Nunca aponte para o site publicado.

## Arquivos

| Arquivo | O que faz |
|---|---|
| `plan-publico.yaml` | Site público, sem login: spider, varredura passiva e ativa, e relatórios em JSON e HTML. Apresenta ao ZAP as rotas da SPA, a API pública, as rotas `/api/admin/*` (que não devem existir) e o `POST /api/contact`. |
| `plan-admin.yaml` | Painel `/admin` **logado** (modelo): as 15 telas do painel, spider e varredura ativa. |
| `login.cjs` | Faz login no painel com o Playwright (Edge) e **gera `zap/.tmp/plan-admin.yaml`** com a sessão dentro. O formulário do Filament é Livewire e o ZAP não loga sozinho. |

`zap/.tmp/` (tem um cookie de sessão) e `zap/reports/` ficam fora do Git.

## Como rodar

1. **Ambiente de teste**, parecido com a produção, com banco isolado e o aviso por e-mail apontado para uma porta morta (`CONTACT_NOTIFICATION_ENDPOINT=http://127.0.0.1:9/ajax`). O passo a passo (Apache, OPcache, caches do Laravel) está no `k6/README.md`. Crie um usuário de teste: `ADMIN_EMAIL` e `ADMIN_PASSWORD` no `db:seed`.
2. **Baixe o ZAP** (`ZAP_2.17.0_Crossplatform.zip`, de github.com/zaproxy/zaproxy/releases, ~273 MB, confira o SHA-256 publicado na página da versão) e descompacte. Precisa de Java 17 ou superior.
3. **Site público:**
   ```bash
   ZAP_TARGET=http://127.0.0.1:8015 ZAP_REPORT_DIR=/caminho/zap/reports \
     java -jar zap-2.17.0.jar -cmd -silent -autorun /caminho/zap/plan-publico.yaml
   ```
4. **Painel (logado):**
   ```bash
   cd e2e && npm install && cd ..      # o login usa o Playwright
   ZAP_TARGET=http://127.0.0.1:8015 ZAP_ADMIN_EMAIL=... ZAP_ADMIN_PASSWORD=... node zap/login.cjs
   ZAP_TARGET=http://127.0.0.1:8015 ZAP_REPORT_DIR=/caminho/zap/reports \
     java -jar zap-2.17.0.jar -cmd -silent -autorun /caminho/zap/.tmp/plan-admin.yaml
   ```
   Confira no log: `Job spider found` deve achar **mais de 100 URLs**. Se achar umas 35, a sessão não foi aplicada e o ZAP só viu redirecionamentos para o login.
5. Abra `reports/publico.html` e `reports/admin.html`.

`login.cjs` também **recusa** endereços que não sejam locais (`ALLOW_REMOTE=1` desfaz a trava, nunca contra produção).

## Resultado (24/11/2026, ZAP 2.17.0)

Ambiente: Apache + PHP 8.2 com OPcache, `APP_ENV=production`, banco SQLite isolado, HTTP local. Varredura ativa: ~1,5 min no site público e ~3,5 min no painel (sem estourar o limite de 12 e 10 min, ou seja, todas as regras rodaram).

### Nenhum alerta alto, nenhuma injeção
A varredura ativa **não achou** injeção de SQL, XSS, injeção de comandos, travessia de diretórios nem injeção de template, no site público nem no painel. As requisições do ZAP com `zj{#9744*6772}zj` foram gravadas **como texto**, sem serem calculadas.

### Antes e depois das correções

| Alerta | Risco | Antes | Depois |
|---|---|---|---|
| `X-Frame-Options` ausente (clickjacking) | Médio | 5 | **resolvido** |
| `X-Content-Type-Options` ausente | Baixo | 5 | **resolvido** |
| `X-Powered-By` expondo a versão do PHP | Baixo | 5 | **resolvido** |
| `Content-Security-Policy` ausente | Médio | 5 | pendente (veja abaixo) |
| `Server:` expondo a versão do Apache e do PHP | Baixo | 5 | depende do servidor |
| `SRI` ausente nos estilos de fontes | Médio | 5 | não se aplica |
| Cookie `XSRF-TOKEN` sem `HttpOnly` | Baixo | 5 | por desenho |
| Timestamp Unix / "Big Redirect" / comentários suspeitos | Baixo e info | vários | falsos positivos |

As correções são cabeçalhos no `public/.htaccess`: `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy`, `Permissions-Policy` e remoção do `X-Powered-By` (o `Strict-Transport-Security` está escrito e **desligado** de propósito; veja o README).

### O que sobrou e por quê
- **CSP ausente (médio, real).** É um endurecimento e não uma falha explorável. Montar uma CSP para este site é trabalho de verdade: os componentes usam estilos em linha, o Google Fonts e (se ligado) o Google Analytics/Tag Manager precisam ser liberados, e o painel Filament/Livewire/Alpine exige regras próprias (`unsafe-eval`). Recomendação: começar com `Content-Security-Policy-Report-Only` no site público, medir o que quebraria e só então aplicar.
- **`Server: Apache/2.4... PHP/8.2...` (baixo, real).** Só se esconde na configuração do servidor (`ServerTokens Prod`, `expose_php = Off`), não no `.htaccess`. Pedir à hospedagem.
- **SRI ausente (médio no relatório, não se aplica).** No site é a folha de estilo do Google Fonts, que muda conforme o navegador e **não pode** ter hash fixo. No painel é o CSS de fontes do próprio Filament, no mesmo domínio. Hospedar as fontes localmente resolveria o primeiro e ainda ajudaria o Lighthouse.
- **`XSRF-TOKEN` sem `HttpOnly` (baixo, por desenho).** O Laravel/Livewire precisa ler esse valor em JavaScript para enviar o cabeçalho anti-CSRF. O cookie de **sessão** é `HttpOnly` e `SameSite=Lax`.
- **Falsos positivos:** "Timestamp Disclosure" são números dentro do JavaScript do Filament; "Big Redirect" é o redirecionamento padrão do Laravel (378 bytes, só com o endereço do login); "comentários suspeitos" é a palavra `from` nos pacotes JavaScript.

### Teste manual do formulário de contato
O limite de 6 envios por minuto barrou o ZAP depois dos primeiros disparos (bom sinal, mas ele não consegue testar mais fundo). Por isso foram enviados à mão 6 ataques clássicos a `/api/contact`:

| Ataque | Resultado |
|---|---|
| XSS (`<script>`, `onerror`) | Gravado **sem as tags** (`strip_tags`); o painel mostra o texto escapado |
| SQL injection (`' OR 1=1 --`, `DROP TABLE`, `UNION SELECT`) | Gravado como texto; as tabelas continuam intactas |
| Injeção de template (`{{7*7}}`, `${7*7}`, `@php`, `<?php`) | Gravado literal; **não** é calculado nem no painel |
| Injeção de cabeçalho (`\r\nBcc:`) | Gravado com a quebra de linha (veja abaixo) |
| Campos extras (`status`, `id`, `created_at`, `email_trigger_status`) | **Ignorados** (sem *mass assignment*) |
| Tipos errados (array, objeto) e byte nulo | `422`, sem erro 500 |

**Observação (baixa, não corrigida):** os campos de uma linha só (`nome`, `empresa`, `telefone`, `tipoSolucao`) aceitam quebra de linha (`\r\n`). Não há risco de injeção de cabeçalho hoje, porque o aviso vai em JSON para o formsubmit.co e não em um e-mail montado à mão, mas uma limpeza de caracteres de controle nesses campos é um endurecimento barato.

## Limites desta verificação
- **Só HTTP local.** Não testa TLS, `Secure` nos cookies, HSTS nem a configuração real da hospedagem. Refaça no site publicado (somente a varredura **passiva** e o `smoke` do k6; a ativa só em ambiente de teste).
- **Planos com tempo limite** (12 e 10 minutos); as duas varreduras terminaram antes.
- **O spider comum não executa JavaScript.** As rotas e a API da SPA foram apresentadas ao ZAP à mão (job `requestor`); o *AJAX spider* não foi usado.
- **Autorização entre papéis** (Super Admin, Admin, Editor) e o acesso a registros de outros usuários **não** são testados pelo ZAP: ficam nos testes do PHPUnit (`SecurityAuditTest`, policies).
- **Dependências vulneráveis não fazem parte do ZAP.** O `composer audit` aponta 12 avisos em 7 pacotes e o `npm audit` também reporta vulnerabilidades.
- **Falha de lógica de negócio** não é detectada por ferramenta automática.
- O ZAP pode apontar coisas que não são defeitos (veja os falsos positivos acima). Sempre leia o relatório.
