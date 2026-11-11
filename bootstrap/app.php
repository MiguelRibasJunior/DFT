<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Global middleware setup
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Sanitize API exception responses to avoid exposing internal server details or stack traces
        $exceptions->render(function (\Throwable $e, Request $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                if ($e instanceof \Illuminate\Validation\ValidationException) {
                    return null;
                }

                if ($e instanceof HttpExceptionInterface) {
                    return response()->json([
                        'success' => false,
                        'message' => $e->getMessage() ?: 'Erro ao processar a requisição.',
                    ], $e->getStatusCode());
                }

                Log::error('Exceção capturada na API: '.$e->getMessage(), [
                    'url' => $request->fullUrl(),
                    'method' => $request->method(),
                    'exception' => $e,
                ]);

                $hideInternals = ! config('app.debug') || app()->isProduction();

                return response()->json([
                    'success' => false,
                    'message' => $hideInternals
                        ? 'Ocorreu um erro interno no servidor. Tente novamente mais tarde.'
                        : $e->getMessage(),
                ], 500);
            }
        });
    })->create();
