<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#080B14" />
    <meta name="robots" content="noindex, follow" />

    <title>{{ $title }} — Devs From Tomorrow</title>

    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&family=Sora:wght@400;600;700;800&display=swap" rel="stylesheet">

    @vite(['resources/css/index.css'])

    <style>
        .legal-header {
            border-bottom: 1px solid rgba(41, 50, 71, 0.6);
            padding: 24px 0;
        }

        .legal-back {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: var(--accent-cyan);
            text-decoration: none;
            font-size: 14px;
            font-weight: 600;
        }

        .legal-main {
            padding: 56px 0 100px;
        }

        .legal-title {
            font-family: var(--font-heading);
            font-size: clamp(28px, 4vw, 40px);
            font-weight: 800;
            margin-bottom: 8px;
        }

        .legal-updated {
            color: var(--text-gray);
            font-size: 13px;
            margin-bottom: 40px;
        }

        .legal-content {
            max-width: 760px;
            color: var(--text-gray);
            font-size: 16px;
            line-height: 1.75;
        }

        .legal-content h1,
        .legal-content h2,
        .legal-content h3 {
            font-family: var(--font-heading);
            color: var(--text-white);
            margin: 32px 0 12px;
            line-height: 1.3;
        }

        .legal-content h1 { font-size: 26px; }
        .legal-content h2 { font-size: 22px; }
        .legal-content h3 { font-size: 18px; }

        .legal-content p { margin-bottom: 16px; }

        .legal-content ul,
        .legal-content ol {
            margin: 0 0 16px 24px;
        }

        .legal-content li { margin-bottom: 8px; }

        .legal-content a { color: var(--accent-cyan); }

        .legal-content strong { color: var(--text-white); }

        .legal-content blockquote {
            border-left: 3px solid var(--accent-cyan);
            padding-left: 16px;
            color: var(--text-gray);
            margin: 0 0 16px;
        }

        .legal-empty {
            color: var(--text-gray);
            font-style: italic;
        }
    </style>
</head>
<body>
    <header class="legal-header">
        <div class="container">
            <a href="/" class="legal-back">&larr; Voltar ao site</a>
        </div>
    </header>

    <main class="legal-main">
        <div class="container">
            <h1 class="legal-title">{{ $title }}</h1>
            <p class="legal-updated">Última atualização em {{ $updatedAt?->format('d/m/Y') ?? '—' }}</p>

            <div class="legal-content">
                @if ($content)
                    {!! $content !!}
                @else
                    <p class="legal-empty">O conteúdo desta página ainda não foi cadastrado.</p>
                @endif
            </div>
        </div>
    </main>
</body>
</html>
