<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
    <meta name="theme-color" content="#080B14" />
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <meta name="robots" content="index, follow" />
    <meta name="author" content="{{ $seo['name'] }}" />

    <!-- SEO -->
    <title>{{ $seo['title'] }}</title>
    <meta name="description" content="{{ $seo['description'] }}" />
    <meta name="keywords" content="{{ $seo['keywords'] }}" />
    <link rel="canonical" href="{{ $seo['canonical'] }}" />

    <!-- Favicon -->
    <link rel="icon" type="{{ $seo['iconType'] }}" href="{{ $seo['icon'] }}" />
    <link rel="apple-touch-icon" href="{{ $seo['appleTouchIcon'] }}" />

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="{{ $seo['canonical'] }}" />
    <meta property="og:title" content="{{ $seo['title'] }}" />
    <meta property="og:description" content="{{ $seo['description'] }}" />
    <meta property="og:image" content="{{ $seo['ogImage'] }}" />
    <meta property="og:image:secure_url" content="{{ $seo['ogImage'] }}" />

    @if ($seo['ogImageIsDefault'])
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    @endif

    <meta property="og:image:alt" content="{{ $seo['title'] }}" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:site_name" content="{{ $seo['name'] }}" />

    <!-- Twitter Cards -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="{{ $seo['canonical'] }}" />
    <meta name="twitter:title" content="{{ $seo['title'] }}" />
    <meta name="twitter:description" content="{{ $seo['description'] }}" />
    <meta name="twitter:image" content="{{ $seo['ogImage'] }}" />
    <meta name="twitter:image:alt" content="{{ $seo['title'] }}" />

    <!-- Font Optimization -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&family=Sora:wght@400;600;700;800&display=swap" rel="stylesheet">

    <!-- Schema.org -->
    <script type="application/ld+json">
    {!! $seo['jsonLd'] !!}
    </script>

    {{-- Analytics (LGPD): o HTML NÃO carrega nenhum script do Google. Só entrega os IDs, e apenas em
         produção e com ID válido. O navegador carrega o Google depois que o visitante aceita o banner
         de cookies (resources/js/utils/consent.ts). Sem IDs, não há banner nem este bloco. --}}
    @if ($seo['analytics'])
    <script type="application/json" id="dft-analytics">{!! json_encode($seo['analytics'], JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT) !!}</script>
    @endif

    @viteReactRefresh
    @vite(['resources/js/main.tsx', 'resources/css/index.css'])

    <x-inertia::head />
</head>

<body style="background-color: #080B14; color: #F5F7FA;">

    <!-- Fallback para visitantes sem JavaScript -->
    <noscript>
        <div style="max-width:640px;margin:0 auto;padding:48px 20px;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;color:#F5F7FA;background:#080B14;line-height:1.6">
            <h1 style="font-size:28px;margin:0 0 12px">{{ $seo['name'] }}</h1>

            <p style="margin:0 0 16px;color:#CBD5E1">
                {{ $seo['description'] }}
            </p>

            <p style="margin:0 0 16px;color:#CBD5E1">
                Este site precisa do JavaScript para funcionar por completo.
                Ative o JavaScript no seu navegador ou fale com a gente diretamente:
            </p>

            @if (count($seo['noscriptLinks']) > 0)
            <ul style="margin:0;padding-left:20px">
                @foreach ($seo['noscriptLinks'] as $link)
                <li style="margin-bottom:8px">
                    <a href="{{ $link['href'] }}" style="color:#28D7E5">
                        {{ $link['label'] }}: {{ $link['value'] }}
                    </a>
                </li>
                @endforeach
            </ul>
            @endif
        </div>
    </noscript>

    <x-inertia::app />

</body>
</html>