<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
    <meta name="theme-color" content="#080B14" />
    <meta name="robots" content="index, follow" />
    <meta name="author" content="{{ $page['name'] }}" />

    {{-- Título, descrição, palavras-chave, favicon e imagem de compartilhamento vêm do admin
         (Configurações → Geral e SEO); App\Support\PublicPageData aplica os padrões quando vazios. --}}
    <!-- SEO Meta Tags -->
    <title>{{ $page['title'] }}</title>
    <meta name="description" content="{{ $page['description'] }}" />
    <meta name="keywords" content="{{ $page['keywords'] }}" />
    <link rel="canonical" href="{{ $page['canonical'] }}" />

    <!-- Favicon & Touch Icons -->
    <link rel="icon" type="{{ $page['iconType'] }}" href="{{ $page['icon'] }}" />
    <link rel="apple-touch-icon" href="{{ $page['appleTouchIcon'] }}" />

    <!-- Open Graph / Facebook / LinkedIn / WhatsApp -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="{{ $page['canonical'] }}" />
    <meta property="og:title" content="{{ $page['title'] }}" />
    <meta property="og:description" content="{{ $page['description'] }}" />
    <meta property="og:image" content="{{ $page['ogImage'] }}" />
    <meta property="og:image:secure_url" content="{{ $page['ogImage'] }}" />
    @if ($page['ogImageIsDefault'])
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    @endif
    <meta property="og:image:alt" content="{{ $page['title'] }}" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:site_name" content="{{ $page['name'] }}" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="{{ $page['canonical'] }}" />
    <meta name="twitter:title" content="{{ $page['title'] }}" />
    <meta name="twitter:description" content="{{ $page['description'] }}" />
    <meta name="twitter:image" content="{{ $page['ogImage'] }}" />
    <meta name="twitter:image:alt" content="{{ $page['title'] }}" />

    <!-- Font Optimization -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&family=Sora:wght@400;600;700;800&display=swap" rel="stylesheet">

    <!-- Schema.org Structured Data (JSON-LD) -->
    <script type="application/ld+json">
{!! $page['jsonLd'] !!}
    </script>

    {{-- Analytics: só em produção e só com o ID preenchido e válido em Configurações → Integrações. --}}
    @if ($page['googleTagManagerId'])
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','{{ $page['googleTagManagerId'] }}');</script>
    @endif
    @if ($page['googleAnalyticsId'])
    <!-- Google Analytics 4 -->
    <script async src="https://www.googletagmanager.com/gtag/js?id={{ $page['googleAnalyticsId'] }}"></script>
    <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','{{ $page['googleAnalyticsId'] }}');</script>
    @endif

    @viteReactRefresh
    @vite(['resources/js/main.tsx', 'resources/css/index.css'])
  </head>
  <body>
    @if ($page['googleTagManagerId'])
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id={{ $page['googleTagManagerId'] }}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    @endif

    {{-- Sem JavaScript o site (feito em React) não monta. Em vez de uma tela em branco,
         mostra quem somos e como falar com a gente; buscadores simples também leem isto. --}}
    <noscript>
      <div style="max-width:640px;margin:0 auto;padding:48px 20px;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;color:#F5F7FA;background:#080B14;line-height:1.6">
        <h1 style="font-size:28px;margin:0 0 12px">{{ $page['name'] }}</h1>
        <p style="margin:0 0 16px;color:#CBD5E1">{{ $page['description'] }}</p>
        <p style="margin:0 0 16px;color:#CBD5E1">Este site precisa do JavaScript para funcionar por completo. Ative o JavaScript no seu navegador ou fale com a gente diretamente:</p>
        @if (count($page['noscriptLinks']) > 0)
        <ul style="margin:0;padding-left:20px">
          @foreach ($page['noscriptLinks'] as $link)
          <li style="margin-bottom:8px"><a href="{{ $link['href'] }}" style="color:#28D7E5">{{ $link['label'] }}: {{ $link['value'] }}</a></li>
          @endforeach
        </ul>
        @endif
      </div>
    </noscript>

    <div id="root"></div>
  </body>
</html>
