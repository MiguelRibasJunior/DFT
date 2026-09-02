<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\UploadController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public contact submission endpoint with anti-spam rate limiting
Route::middleware('throttle:6,1')->post('/contact', [ContactController::class, 'store']);

// Admin routes
Route::post('/admin/login', [AdminController::class, 'login']);

Route::get('/admin/submissions', [AdminController::class, 'index']);
Route::patch('/admin/submissions/{id}', [AdminController::class, 'updateStatus']);
Route::delete('/admin/submissions/{id}', [AdminController::class, 'destroy']);
Route::post('/admin/test-email', [AdminController::class, 'testEmail']);
Route::post('/admin/upload', [UploadController::class, 'store']);
