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

    <!-- Google Tag Manager -->
    @if ($seo['googleTagManagerId'])
    <script>
        (function(w,d,s,l,i){
            w[l]=w[l]||[];
            w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
            var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),
                dl=l!='dataLayer'?'&l='+l:'';
            j.async=true;
            j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
            f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','{{ $seo['googleTagManagerId'] }}');
    </script>
    @endif

    <!-- Google Analytics 4 -->
    @if ($seo['googleAnalyticsId'])
    <script async src="https://www.googletagmanager.com/gtag/js?id={{ $seo['googleAnalyticsId'] }}"></script>
    <script>
        window.dataLayer=window.dataLayer||[];
        function gtag(){dataLayer.push(arguments);}
        gtag('js',new Date());
        gtag('config','{{ $seo['googleAnalyticsId'] }}');
    </script>
    @endif

    @viteReactRefresh
    @vite(['resources/js/main.tsx', 'resources/css/index.css'])

    <x-inertia::head />
</head>

<body style="background-color: #080B14; color: #F5F7FA;">

    @if ($seo['googleTagManagerId'])
    <noscript>
        <iframe
            src="https://www.googletagmanager.com/ns.html?id={{ $seo['googleTagManagerId'] }}"
            height="0"
            width="0"
            style="display:none;visibility:hidden">
        </iframe>
    </noscript>
    @endif

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