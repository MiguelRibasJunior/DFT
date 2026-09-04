<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\PublicContentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public contact submission endpoint with anti-spam rate limiting
Route::middleware('throttle:6,1')->post('/contact', [ContactController::class, 'store']);

// Public read-only content served by the site (managed via the Filament admin panel)
Route::get('/projects', [PublicContentController::class, 'projects']);
Route::get('/ctas/{position}', [PublicContentController::class, 'cta']);
Route::get('/settings', [PublicContentController::class, 'settings']);
