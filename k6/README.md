# Testes de carga e de fumaça (k6)

Scripts do [k6](https://k6.io) que exercitam o site como visitantes de verdade: páginas, API pública, formulário de contato e proteções. Servem para saber **quanto o site aguenta**, se algo quebra sob carga e se as proteções (limite de envios, rotas administrativas) continuam de pé.

## Arquivos

| Script | O que faz | Duração |
|---|---|---|
| `smoke.js` | 1 usuário, 1 passada: todas as rotas públicas, formato das respostas, nada de campos internos na API, `/api/admin/*` inexistente, `/admin` pedindo login, 404 sem detalhes técnicos, `.env`/`composer.json`/logs não servidos (35 verificações). **Só lê, não grava nada.** | ~2 s |
| `contact.js` | Formulário de contato: envio válido, honeypot, corpo vazio, e-mail inválido, texto grande demais, HTML no nome e o **limite de 6 envios por minuto** (a 7ª requisição leva `429` com `Retry-After`). **Grava contatos no banco.** | ~5 s |
| `load.js` | Visitantes navegando: página inicial, arquivos do build, 4 chamadas de API em paralelo e, às vezes, uma página legal. Perfis por `PROFILE`: `load` (padrão, até 30 visitantes simultâneos, 2 min, **com metas que reprovam**), `stress` (sobe até 150) e `spike` (pico de 5 para 100 em 5 s). | 1 a 2 min |
| `lib.js` | Endereço-base, corpo do formulário e a trava de segurança. | |

## Como rodar

Requisito: [k6 instalado](https://grafana.com/docs/k6/latest/set-up/install-k6/) (testado com a v0.51).

```bash
k6 run k6/smoke.js
k6 run k6/contact.js
k6 run k6/load.js
k6 run -e PROFILE=stress k6/load.js
k6 run -e PROFILE=spike k6/load.js
k6 run -e BASE_URL=http://127.0.0.1:8000 k6/smoke.js     # outro endereço local
```

O padrão é `http://127.0.0.1:8015`. Suba o site num ambiente parecido com a produção (veja abaixo) antes de rodar.

### Trava de segurança
Os scripts **recusam rodar contra qualquer endereço que não seja local** (`127.0.0.1`, `localhost`), porque `load.js` dispara milhares de requisições e `contact.js` grava contatos de verdade. Para uma verificação **só de leitura** num site publicado (por exemplo, o teste final do deploy):

```bash
k6 run -e BASE_URL=https://seu-dominio.com -e ALLOW_REMOTE=1 k6/smoke.js
```

**Nunca** use `ALLOW_REMOTE=1` com `load.js` ou `contact.js` contra o site em produção: seria um ataque de negação de serviço contra você mesmo e encheria a caixa de contatos.

### Antes do `contact.js`
- Use um **banco de teste** e defina `CONTACT_NOTIFICATION_ENDPOINT=http://127.0.0.1:9/ajax` (porta sem ninguém ouvindo). Sem isso, o aviso por e-mail é enviado de verdade para `ADMIN_NOTIFICATION_EMAIL` ou para o e-mail da empresa.
- O limite é de 6 por minuto por IP: rode o script **uma vez por minuto**.

## Como foi medido (24/11/2026)

**Máquina:** notebook com Intel Core i5-1135G7 (4 núcleos, 8 threads) e Windows 11, **com o k6, o servidor, o banco e o navegador no mesmo computador**. Os números absolutos de uma hospedagem real serão outros; o que vale é a ordem de grandeza e o comportamento.

**Servidor:** Apache 2.4 (XAMPP) com PHP 8.2 e **OPcache ligado**, banco SQLite isolado, `APP_ENV=production`, `APP_DEBUG=false`, e os caches do passo 5 do guia de deploy (`config:cache`, `route:cache`, `view:cache`, `event:cache`) mais `filament:optimize`. Compressão e cache de arquivos do build vindos do `public/.htaccess`.

> Não use o servidor embutido do PHP (`php artisan serve`, `php -S`) para medir: ele atende uma requisição por vez, não comprime e não tem cache.

### Resultado

| Teste | Resultado |
|---|---|
| Fumaça (`smoke.js`) | **35 de 35** verificações |
| Contato (`contact.js`) | **10 de 10**, inclusive o `429` com `Retry-After` |
| Carga: 30 visitantes, 2 min | **0% de erro**, ~87 req/s. p95: página 41 ms, API 38 ms, arquivos estáticos 7 ms. Todas as metas atendidas |
| Pico súbito: 5 → 100 visitantes em 5 s | **0% de erro**, ~169 req/s. p95 365 ms, p99 503 ms, máximo 1,1 s |
| Estresse: até 150 visitantes simultâneos | **0% de erro**, ~212 req/s. mediana 94 ms, p95 743 ms, p99 986 ms, máximo 1,45 s |

**Metas do perfil `load`** (reprovam o teste se descumpridas): erro < 1%; p95 < 800 ms nas páginas, < 500 ms na API, < 300 ms nos estáticos; 99% das verificações passando.

Em uma hospedagem de verdade, o gargalo de um site assim costuma ser a **CPU do PHP**: cada requisição dinâmica (página inicial e API) custa uns 14 ms nesta máquina, e os estáticos quase nada.

### Lighthouse no mesmo servidor (mediana de 3 execuções)

| | Celular | Desktop |
|---|---|---|
| Desempenho | **86** | **98** |
| Acessibilidade / Boas práticas / SEO | 100 / 100 / 100 | 100 / 100 / 100 |
| LCP (meta ≤ 2,5 s) | **3,4 s** ⚠️ | 0,9 s ✅ |
| FCP | 3,0 s | 0,9 s |
| TBT (representa o INP) / CLS | 0 ms / 0 | 0 ms / 0 |
| Peso transferido | 209 KiB | 209 KiB |

Sem compressão, sem cache e no servidor embutido do PHP, as mesmas páginas deram **64** (celular) e **94** (desktop), e o `main.js` pesava 344 KiB em vez de ~109 KiB. O que ainda reprova no Lighthouse: a folha de fontes do Google bloqueia a renderização, ~180 KiB do JavaScript principal não são usados na carga inicial e o DOM tem ~1.200 elementos. O LCP do celular é o título do Hero, que só aparece depois que o React baixa e executa.

## O que o k6 achou (e foi corrigido)

1. **`/termos` e `/privacidade` respondiam 500 com `php artisan route:cache`** (que o guia de deploy manda rodar). Uma closure criada por outra função era serializada errada. Agora é um controller, com o teste `RouteCacheTest`.
2. **O `429` do formulário perdia o `Retry-After`.** O tratador de erros da API montava um JSON genérico e descartava os cabeçalhos da exceção.
3. **`php artisan filament:optimize` derrubou a latência de ~60–85 ms para ~14 ms por requisição** e passou a fazer parte do guia de deploy.
4. **O `public/.htaccess` não comprimia o texto nem dava cache aos arquivos do build.** As regras entraram (compressão de HTML, CSS, JS, JSON e SVG, e cache de um ano só para arquivos com hash no nome). O salto de 64 para 86 no celular veio do **conjunto** (compressão, cache, OPcache, caches do Laravel e `filament:optimize`); não medi cada peça isolada.

## Limites e armadilhas desta medição

- **Não é a hospedagem real.** Servidor, banco e gerador de carga disputam os mesmos 4 núcleos.
- **SQLite.** As consultas do site são de leitura; o formulário grava, mas o teste de carga não o martela (o limite é 6 por minuto por IP). Com MySQL os números mudam.
- **PHP multithread (mod_php) no Windows não é como se publica.** Nele, sem `config:cache`, apareceram erros intermitentes de "No application encryption key" (uma corrida na leitura do `.env` entre threads). Em Linux com PHP-FPM isso não existe, e com `config:cache` ligado também não.
- **Conexões persistentes do k6 esgotam as threads do Apache.** Com 100 a 150 visitantes e *keep-alive* ligado, ~1% das requisições ficou parado ~28 s (sem nenhum erro) porque as conexões ociosas seguravam as 256 threads. Com *keep-alive* desligado isso sumiu. É característica do servidor de teste, não do site.
- **O Lighthouse mede só a página inicial**, sem analytics (portanto sem o banner de cookies). Repita no site publicado, em HTTPS.
- **O k6 não mede o INP real**, só o tempo de resposta do servidor. O INP de verdade vem do uso real (Google Search Console).
- Os scripts usam apenas sintaxe aceita pelo k6 0.51 (por exemplo, `Object.assign` em vez de `{...objeto}`).

## Reproduzindo o ambiente
Resumo do que foi feito, para repetir numa máquina com Apache ou numa hospedagem de teste:

```bash
npm run build
APP_ENV=production APP_DEBUG=false php artisan migrate:fresh --seed --force   # com APP_ENV=local para criar o conteúdo de demonstração
php artisan config:cache && php artisan route:cache && php artisan view:cache && php artisan event:cache
php artisan filament:optimize
```

Aponte o Apache para a pasta `public/` (com `AllowOverride All` para o `.htaccess` valer), ligue o OPcache (`opcache.enable=1`, `opcache.validate_timestamps=0`) e use um banco de teste. Depois de mexer no código, reinicie o Apache e refaça os caches.
