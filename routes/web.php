<?php

use App\Models\ContactLink;
use App\Models\SiteSetting;
use App\Support\PublicPageData;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    // SEO, favicon, logo e analytics editados no admin entram no HTML que o servidor entrega.
    return view('app', [
        'page' => PublicPageData::build(
            SiteSetting::current(),
            ContactLink::query()->active()->ordered()->get()
        ),
    ]);
});

Route::get('/robots.txt', function () {
    $path = public_path('robots.txt');
    $content = file_exists($path)
        ? file_get_contents($path)
        : implode("\n", [
            '# Devs From Tomorrow - Robots Configuration',
            'User-agent: *',
            'Allow: /',
            'Disallow: /admin',
            'Disallow: /admin/',
            'Disallow: /livewire/',
            'Disallow: /filament/',
            'Disallow: /api/',
            '',
            'Sitemap: ' . rtrim(config('app.url', 'https://devsfromtomorrow.com'), '/') . '/sitemap.xml',
        ]);

    return response($content, 200, ['Content-Type' => 'text/plain; charset=UTF-8']);
});

Route::get('/sitemap.xml', function () {
    $path = public_path('sitemap.xml');
    if (file_exists($path)) {
        return response(file_get_contents($path), 200, ['Content-Type' => 'application/xml; charset=UTF-8']);
    }

    $baseUrl = config('app.url', 'https://devsfromtomorrow.com');
    $baseUrl = rtrim($baseUrl, '/');
    $today = date('Y-m-d');

    $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
    $xml .= "  <url>\n";
    $xml .= "    <loc>{$baseUrl}/</loc>\n";
    $xml .= "    <lastmod>{$today}</lastmod>\n";
    $xml .= "    <changefreq>weekly</changefreq>\n";
    $xml .= "    <priority>1.0</priority>\n";
    $xml .= "  </url>\n";
    $xml .= '</urlset>';

    return response($xml, 200, ['Content-Type' => 'application/xml; charset=UTF-8']);
});
