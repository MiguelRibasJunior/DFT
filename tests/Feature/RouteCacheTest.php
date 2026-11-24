<?php

namespace Tests\Feature;

use Tests\TestCase;

/**
 * O guia de deploy manda rodar `php artisan route:cache`. Uma closure criada por outra função (como o antigo
 * `$legalPage`) é serializada errada e a rota responde 500 só com o cache ligado, o que nenhum outro teste vê.
 */
class RouteCacheTest extends TestCase
{
    private string $cacheFile;

    protected function setUp(): void
    {
        // Caminho relativo à raiz do projeto: no Windows o Laravel não reconhece "C:\..." como absoluto.
        $relative = 'storage/framework/cache/routes-teste-'.uniqid().'.php';
        $this->cacheFile = dirname(__DIR__, 2).DIRECTORY_SEPARATOR.str_replace('/', DIRECTORY_SEPARATOR, $relative);
        $this->setRoutesCache($relative);

        parent::setUp();
    }

    protected function tearDown(): void
    {
        $this->setRoutesCache(null);

        if (is_file($this->cacheFile)) {
            unlink($this->cacheFile);
        }

        parent::tearDown();
    }

    public function test_public_pages_work_with_the_route_cache_turned_on(): void
    {
        $this->artisan('route:cache')->assertSuccessful();
        $this->assertFileExists($this->cacheFile);

        // Reinicia a aplicação para ela carregar as rotas do arquivo de cache, como em produção.
        $this->refreshApplication();
        // O refresh cria uma aplicação nova e perde o withoutVite() do TestCase; sem ele, ambientes sem
        // public/build (como o CI) dão erro "Vite manifest not found".
        $this->withoutVite();
        $this->assertTrue($this->app->routesAreCached());
        $this->artisan('migrate', ['--force' => true])->assertSuccessful();

        foreach (['/', '/termos', '/privacidade', '/robots.txt', '/sitemap.xml'] as $path) {
            $this->get($path)->assertOk();
        }

        $this->get('/pagina-que-nao-existe')->assertNotFound();
        $this->getJson('/api/projects')->assertOk();
    }

    private function setRoutesCache(?string $path): void
    {
        if ($path === null) {
            putenv('APP_ROUTES_CACHE');
            unset($_ENV['APP_ROUTES_CACHE'], $_SERVER['APP_ROUTES_CACHE']);

            return;
        }

        putenv('APP_ROUTES_CACHE='.$path);
        $_ENV['APP_ROUTES_CACHE'] = $_SERVER['APP_ROUTES_CACHE'] = $path;
    }
}
