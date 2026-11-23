<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\PublicContentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Endpoints Públicos (Site Institucional)
Route::middleware('throttle:6,1')->post('/contact', [ContactController::class, 'store']);
Route::get('/projects', [PublicContentController::class, 'projects']);
Route::get('/ctas/{position}', [PublicContentController::class, 'cta']);
Route::get('/contact-links', [PublicContentController::class, 'contactLinks']);
Route::get('/settings', [PublicContentController::class, 'settings']);

// Não há API administrativa: o painel (/admin) é o Filament, com login, papéis e policies.
// Uma API paralela de administração precisaria de autenticação própria e passaria por fora
// das permissões e da lixeira; por isso não existe.
