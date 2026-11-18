<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
    $middleware->web(append: [
        \App\Http\Middleware\HandleInertiaRequests::class,
    ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->respond(function ($response, \Throwable $e, \Illuminate\Http\Request $request) {
            if ($response->getStatusCode() === 419) {
                return back()->with([
                    'error' => 'A sessão expirou. Por favor, tente novamente.',
                ]);
            }

            if ($request->header('X-Inertia')) {
                $status = $response->getStatusCode();

                if (in_array($status, [403, 404, 500, 503])) {
                    return \Inertia\Inertia::render('Error', [
                        'status' => $status,
                        'message' => app()->environment('local') ? $e->getMessage() : null,
                        'trace' => app()->environment('local') ? $e->getTraceAsString() : null,
                    ])->toResponse($request)->setStatusCode($status);
                }
            }

            return $response;
        });
    })->create();
