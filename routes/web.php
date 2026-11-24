<?php

use App\Http\Controllers\LegalPageController;
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

// Páginas legais fixas: controller (e não closure) para funcionar com `php artisan route:cache`.
Route::get('/termos', [LegalPageController::class, 'terms'])->name('terms');

Route::get('/privacidade', [LegalPageController::class, 'privacy'])->name('privacy');

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
