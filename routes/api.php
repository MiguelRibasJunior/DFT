<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ContactController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public contact submission endpoint with anti-spam rate limiting
Route::middleware('throttle:6,1')->post('/contact', [ContactController::class, 'store']);
