<?php

use App\Enums\ContactLinkType;
use App\Models\ContactLink;
use App\Models\SiteSetting;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// ATENÇÃO: tudo que vai nas props de uma página Inertia aparece no HTML (data-page) e fica visível
// para qualquer visitante. Por isso nunca se passa um model inteiro (SiteSetting, Project, Cta): eles
// trazem colunas internas (gestão do projeto, IDs de analytics, textos legais sem sanitizar).
// Os dados públicos da página inicial vêm da API (/api/*), que já devolve só campos escolhidos.
Route::get('/', fn () => Inertia::render('Home'))->name('home');

/**
 * Páginas legais fixas (/termos e /privacidade): só o necessário para o cabeçalho e o rodapé.
 * O e-mail é o do primeiro canal de contato ativo cadastrado no admin.
 */
$legalPage = fn (string $component) => function () use ($component) {
    $site = SiteSetting::current();

    return Inertia::render($component, [
        'settings' => [
            'site_name' => $site->site_name,
            'copyright_text' => $site->copyright_text,
            'email' => ContactLink::query()->active()->ordered()->where('type', ContactLinkType::Email)->value('value'),
        ],
    ]);
};

Route::get('/termos', $legalPage('Terms'))->name('terms');

Route::get('/privacidade', $legalPage('Privacy'))->name('privacy');

Route::get('/sitemap.xml', function () {
    $path = public_path('sitemap.xml');

    if (file_exists($path)) {
        return response(file_get_contents($path), 200, [
            'Content-Type' => 'application/xml; charset=UTF-8',
        ]);
    }

    return response('Sitemap not found', 404);
});

Route::get('/robots.txt', function () {
    $path = public_path('robots.txt');

    if (file_exists($path)) {
        return response(file_get_contents($path), 200, [
            'Content-Type' => 'text/plain; charset=UTF-8',
        ]);
    }

    return response(
        "User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nSitemap: " . url('/sitemap.xml'),
        200,
        ['Content-Type' => 'text/plain; charset=UTF-8']
    );
});

// Fallback para páginas não encontradas da aplicação
Route::fallback(function () {
    return Inertia::render('Error', [
        'status' => 404,
        'message' => 'A página solicitada não foi encontrada ou foi removida.',
    ])->toResponse(request())->setStatusCode(404);
});
