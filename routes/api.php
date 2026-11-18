<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\PublicContentController;
use App\Http\Controllers\AdminApiController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Endpoints Públicos (Site Institucional)
Route::middleware('throttle:6,1')->post('/contact', [ContactController::class, 'store']);
Route::get('/projects', [PublicContentController::class, 'projects']);
Route::get('/ctas/{position}', [PublicContentController::class, 'cta']);
Route::get('/settings', [PublicContentController::class, 'settings']);

// Endpoints Administrativos (Painel Admin & Autenticação)
Route::prefix('admin')->group(function () {
    Route::post('/login', [AdminApiController::class, 'login']);
    Route::get('/submissions', [AdminApiController::class, 'submissions']);
    Route::patch('/submissions/{id}', [AdminApiController::class, 'updateSubmissionStatus']);
    Route::delete('/submissions/{id}', [AdminApiController::class, 'deleteSubmission']);
    Route::get('/projects', [AdminApiController::class, 'projects']);
    Route::post('/projects', [AdminApiController::class, 'storeProject']);
    Route::put('/projects/{id}', [AdminApiController::class, 'updateProject']);
    Route::delete('/projects/{id}', [AdminApiController::class, 'deleteProject']);
    Route::put('/settings', [AdminApiController::class, 'updateSettings']);
});
