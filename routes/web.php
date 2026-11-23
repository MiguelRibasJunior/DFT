<?php

use App\Models\Project;
use App\Models\SiteSetting;
use App\Models\Cta;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

$renderApp = function () {
    try {
        $settings = SiteSetting::first();

        $projects = Project::where('status', 'published')
            ->orderBy('order')
            ->get();

        $cta = Cta::where('active', true)
            ->where('position', 'cta_section')
            ->first();

    } catch (\Throwable $e) {
        $settings = null;
        $projects = [];
        $cta = null;
    }

    return Inertia::render('Home', [
	'initialData' => [
    	'projects' => $projects,
    	'cta' => $cta,
	],
    ]);
};

Route::get('/', $renderApp)->name('home');

Route::get('/termos', function () {
    return Inertia::render('Terms', [
        'settings' => SiteSetting::first(),
    ]);
})->name('terms');

Route::get('/privacidade', function () {
    return Inertia::render('Privacy', [
        'settings' => SiteSetting::first(),
    ]);
})->name('privacy');

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
