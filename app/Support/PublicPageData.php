<?php

namespace App\Support;

use App\Enums\ContactLinkType;
use App\Models\ContactLink;
use App\Models\SiteSetting;
use Illuminate\Support\Collection;

/**
 * Dados do <head> e do <noscript> da página pública (resources/views/app.blade.php):
 * título, descrição, favicon, Open Graph, JSON-LD e analytics.
 *
 * Tudo que o admin edita (Configurações → Geral/SEO/Integrações e Canais de contato) chega
 * aqui, com os textos e imagens padrão como fallback quando o campo está vazio. Fica no
 * servidor, e não no React, porque buscadores e prévias de link (WhatsApp, LinkedIn) leem o
 * HTML que o servidor entrega, sem executar JavaScript.
 */
class PublicPageData
{
    /** Default de og:image e do ícone: arquivos que já existem em public/. */
    private const DEFAULT_OG_IMAGE = '/og-image.png';

    private const DEFAULT_ICON = '/favicon.svg';

    /**
     * @param  Collection<int, ContactLink>  $contactLinks  canais ativos, na ordem do admin
     * @return array<string, mixed>
     */
    public static function build(SiteSetting $site, Collection $contactLinks): array
    {
        $baseUrl = rtrim((string) config('app.url'), '/');
        $name = filled($site->site_name) ? $site->site_name : 'Devs From Tomorrow';
        $title = $site->seoTitle();
        $description = $site->seoDescription();

        $customOg = $site->ogImageUrl();
        $ogImage = $baseUrl.($customOg ?? self::DEFAULT_OG_IMAGE);

        $icon = $site->faviconUrl() ?? self::DEFAULT_ICON;
        $logo = $baseUrl.($site->logoUrl() ?? self::DEFAULT_ICON);

        // O apple-touch-icon só aceita PNG; com outro formato, mantém o ícone padrão.
        $appleTouchIcon = str_ends_with(strtolower($icon), '.png') ? $icon : self::DEFAULT_ICON;

        $links = $contactLinks
            ->filter(fn (ContactLink $link) => $link->href !== null)
            ->values();

        // Só em produção: acessos de desenvolvimento e de teste não podem sujar as métricas.
        // Aqui só vai a CONFIGURAÇÃO (os IDs). Os scripts do Google nunca saem no HTML: o navegador só
        // os carrega depois que o visitante aceita no banner de cookies (resources/js/utils/consent.ts).
        $ga4 = app()->isProduction() ? $site->googleAnalyticsId() : null;
        $gtm = app()->isProduction() ? $site->googleTagManagerId() : null;

        return [
            'name' => $name,
            'title' => $title,
            'description' => $description,
            'keywords' => $site->seoKeywords(),
            'canonical' => $baseUrl.'/',
            'icon' => $icon,
            'iconType' => self::mimeFor($icon),
            'appleTouchIcon' => $appleTouchIcon,
            'ogImage' => $ogImage,
            // Dimensões e tipo só valem para a imagem padrão; com imagem do admin, não se sabe.
            'ogImageIsDefault' => $customOg === null,
            // null = sem analytics configurado: não há banner, porque só existem cookies técnicos.
            'analytics' => ($ga4 || $gtm) ? ['ga4' => $ga4, 'gtm' => $gtm] : null,
            'noscriptLinks' => $links->map(fn (ContactLink $link) => [
                'label' => $link->label,
                'value' => $link->value,
                'href' => $link->href,
            ])->all(),
            'jsonLd' => self::jsonLd($baseUrl, $name, $description, $logo, $ogImage, $links),
        ];
    }

    /**
     * @param  Collection<int, ContactLink>  $links
     */
    private static function jsonLd(string $baseUrl, string $name, string $description, string $logo, string $ogImage, Collection $links): string
    {
        $home = $baseUrl.'/';

        $email = $links->first(fn (ContactLink $link) => $link->type === ContactLinkType::Email)?->value;

        $sameAs = $links
            ->filter(fn (ContactLink $link) => in_array($link->type, [ContactLinkType::Instagram, ContactLinkType::Linkedin, ContactLinkType::Github], true))
            ->map(fn (ContactLink $link) => $link->href)
            ->values()
            ->all();

        $organization = array_filter([
            '@type' => 'Organization',
            '@id' => $home.'#organization',
            'name' => $name,
            'url' => $home,
            'logo' => [
                '@type' => 'ImageObject',
                '@id' => $home.'#logo',
                'url' => $logo,
                'caption' => $name.' Logo',
            ],
            'image' => $ogImage,
            'description' => $description,
            'email' => $email,
            'sameAs' => $sameAs ?: null,
            'contactPoint' => $email ? [[
                '@type' => 'ContactPoint',
                'contactType' => 'sales',
                'email' => $email,
                'availableLanguage' => ['Portuguese', 'English'],
            ]] : null,
        ], fn ($value) => $value !== null);

        $data = [
            '@context' => 'https://schema.org',
            '@graph' => [
                $organization,
                [
                    '@type' => 'WebSite',
                    '@id' => $home.'#website',
                    'url' => $home,
                    'name' => $name,
                    'description' => $description,
                    'publisher' => ['@id' => $home.'#organization'],
                    'inLanguage' => 'pt-BR',
                ],
                [
                    '@type' => 'ProfessionalService',
                    '@id' => $home.'#service',
                    'name' => $name,
                    'url' => $home,
                    'parentOrganization' => ['@id' => $home.'#organization'],
                    'description' => 'Desenvolvimento sob medida de sistemas web, mobile apps, automação com n8n e chatbots integrados com Inteligência Artificial.',
                    'priceRange' => '$$',
                    'areaServed' => ['@type' => 'Country', 'name' => 'Brasil'],
                    'hasOfferCatalog' => [
                        '@type' => 'OfferCatalog',
                        'name' => 'Serviços Digitais',
                        'itemListElement' => array_map(
                            fn (string $service) => ['@type' => 'Offer', 'itemOffered' => ['@type' => 'Service', 'name' => $service]],
                            [
                                'Desenvolvimento Web & Sistemas Sob Medida',
                                'Aplicativos Mobile (iOS e Android)',
                                'Automação de Processos com n8n',
                                'Chatbots & Inteligência Artificial',
                            ]
                        ),
                    ],
                ],
            ],
        ];

        // HEX_TAG/HEX_AMP: um "</script>" dentro de um texto do admin não consegue fechar a tag.
        return json_encode(
            $data,
            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP
        );
    }

    private static function mimeFor(string $path): string
    {
        return match (strtolower(pathinfo($path, PATHINFO_EXTENSION))) {
            'png' => 'image/png',
            'ico' => 'image/x-icon',
            default => 'image/svg+xml',
        };
    }
}
