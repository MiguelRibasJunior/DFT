<?php

namespace App\Providers\Filament;

use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\Support\Enums\Width;
use Filament\View\PanelsRenderHook;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\HtmlString;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->brandName('Devs From Tomorrow')
            ->brandLogo(fn () => new HtmlString(<<<'SVG'
                <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 2.25rem; height: 2.25rem;">
                    <polygon points="20,4 6,34 34,34" stroke="url(#admin-logo-grad-1)" stroke-width="2.5" fill="none" />
                    <polygon points="20,12 12,28 28,28" fill="url(#admin-logo-grad-2)" opacity="0.8" />
                    <circle cx="20" cy="4" r="2.5" fill="#28D7E5" />
                    <circle cx="6" cy="34" r="2.5" fill="#2388FF" />
                    <circle cx="34" cy="34" r="2.5" fill="#7B4DFF" />
                    <line x1="20" y1="4" x2="20" y2="28" stroke="#28D7E5" stroke-width="1" stroke-dasharray="2 2" />
                    <defs>
                        <linearGradient id="admin-logo-grad-1" x1="0" y1="0" x2="40" y2="40">
                            <stop offset="0%" stop-color="#28D7E5" />
                            <stop offset="50%" stop-color="#2388FF" />
                            <stop offset="100%" stop-color="#7B4DFF" />
                        </linearGradient>
                        <linearGradient id="admin-logo-grad-2" x1="0" y1="0" x2="40" y2="40">
                            <stop offset="0%" stop-color="#7B4DFF" />
                            <stop offset="100%" stop-color="#28D7E5" />
                        </linearGradient>
                    </defs>
                </svg>
                SVG))
            ->brandLogoHeight('2.25rem')
            ->favicon('/favicon.svg')
            ->login()
            ->colors([
                'primary' => Color::hex('#2388FF'),
                'info' => Color::hex('#28D7E5'),
                'danger' => Color::hex('#F04E37'),
                'success' => Color::hex('#22D18A'),
                'warning' => Color::hex('#F5C842'),
            ])
            ->darkMode(isForced: false)
            ->maxContentWidth(Width::Full)
            ->navigationGroups([
                'Gestão',
                'Site / Conteúdo',
                'Administração',
            ])
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\Filament\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\Filament\Pages')
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\Filament\Widgets')
            ->renderHook(
                PanelsRenderHook::AUTH_LOGIN_FORM_AFTER,
                fn () => new HtmlString(
                    '<div class="fi-align-center" style="margin-top: 1.5rem; text-align: center;">'
                    . '<a href="/" style="font-size: 0.875rem; font-weight: 600; color: var(--primary-600);">'
                    . '&larr; Voltar ao site'
                    . '</a>'
                    . '</div>'
                ),
            )
            ->renderHook(
                PanelsRenderHook::SIDEBAR_FOOTER,
                fn () => view('filament.partials.sidebar-account'),
            )
            ->renderHook(
                PanelsRenderHook::SIMPLE_LAYOUT_START,
                fn () => view('filament.partials.login-visual'),
            )
            ->renderHook(
                PanelsRenderHook::HEAD_END,
                fn () => new HtmlString(<<<'HTML'
                    <style>
                        .dft-stat-danger .fi-wi-stats-overview-stat-value { color: var(--danger-600); }
                        .dft-stat-warning .fi-wi-stats-overview-stat-value { color: var(--warning-600); }
                        .dft-stat-success .fi-wi-stats-overview-stat-value { color: var(--success-600); }
                        .dft-stat-info .fi-wi-stats-overview-stat-value { color: var(--info-600); }
                    </style>
                    HTML
                ),
            )
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                VerifyCsrfToken::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
            ]);
    }
}
