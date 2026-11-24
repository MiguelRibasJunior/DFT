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
        // Middleware necessário para o funcionamento do Inertia.
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {

        // Sanitização das respostas de exceções da API.
        $exceptions->render(function (\Throwable $e, Request $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                if ($e instanceof \Illuminate\Validation\ValidationException) {
                    return null;
                }

                if ($e instanceof HttpExceptionInterface) {
                    // getHeaders() preserva o que a exceção define (Retry-After e X-RateLimit-* no 429, Allow no 405).
                    return response()->json([
                        'success' => false,
                        'message' => $e->getMessage() ?: 'Erro ao processar a requisição.',
                    ], $e->getStatusCode(), $e->getHeaders());
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

            return null;
        });

        // Tratamento de erros para navegação Inertia.
        $exceptions->respond(function ($response, \Throwable $e, Request $request) {
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
