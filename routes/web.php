<?php

use App\Http\Controllers\LegalPageController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return view('app');
});

Route::get('/politica-de-privacidade', [LegalPageController::class, 'privacy'])->name('legal.privacy');
Route::get('/termos-de-uso', [LegalPageController::class, 'terms'])->name('legal.terms');

Route::get('/sitemap.xml', function () {
    $path = public_path('sitemap.xml');
    if (file_exists($path)) {
        return response()->file($path, ['Content-Type' => 'text/xml']);
    }
    return response('Sitemap not found', 404);
});

Route::get('/robots.txt', function () {
    $path = public_path('robots.txt');
    if (file_exists($path)) {
        return response()->file($path, ['Content-Type' => 'text/plain']);
    }
    return response("User-agent: *\nAllow: /\nSitemap: " . url('/sitemap.xml'), 200, ['Content-Type' => 'text/plain']);
});
