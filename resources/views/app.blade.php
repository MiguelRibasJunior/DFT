<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
    <meta name="theme-color" content="#080B14" />
    <meta name="robots" content="index, follow" />
    <meta name="author" content="Devs From Tomorrow" />

    <!-- SEO Meta Tags -->
    <title>Devs From Tomorrow — Soluções Digitais, Automação &amp; Inteligência Artificial</title>
    <meta name="description" content="Desenvolvemos hoje as soluções digitais de amanhã. Especialistas em sistemas web sob medida, aplicativos mobile, automação de processos com n8n e inteligência artificial." />
    <meta name="keywords" content="desenvolvimento web, sistemas web, aplicativos mobile, automação n8n, chatbots IA, inteligência artificial, software house, Devs From Tomorrow" />
    <link rel="canonical" href="https://devsfromtomorrow.com/" />

    <!-- Favicon & Touch Icons -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="apple-touch-icon" href="/favicon.svg" />

    <!-- Open Graph / Facebook / LinkedIn / WhatsApp -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://devsfromtomorrow.com/" />
    <meta property="og:title" content="Devs From Tomorrow — Soluções Digitais, Automação &amp; Inteligência Artificial" />
    <meta property="og:description" content="Desenvolvemos hoje as soluções digitais de amanhã. Especialistas em sistemas web sob medida, aplicativos mobile, automação de processos com n8n e inteligência artificial." />
    <meta property="og:image" content="https://devsfromtomorrow.com/og-image.png" />
    <meta property="og:image:secure_url" content="https://devsfromtomorrow.com/og-image.png" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Devs From Tomorrow — Soluções Digitais, Automação e IA" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:site_name" content="Devs From Tomorrow" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="https://devsfromtomorrow.com/" />
    <meta name="twitter:title" content="Devs From Tomorrow — Soluções Digitais, Automação &amp; IA" />
    <meta name="twitter:description" content="Desenvolvemos hoje as soluções digitais de amanhã. Especialistas em sistemas web sob medida, aplicativos mobile, automação de processos com n8n e inteligência artificial." />
    <meta name="twitter:image" content="https://devsfromtomorrow.com/og-image.png" />
    <meta name="twitter:image:alt" content="Devs From Tomorrow — Soluções Digitais, Automação e IA" />

    <!-- Font Optimization -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&family=Sora:wght@400;600;700;800&display=swap" rel="stylesheet">

    <!-- Schema.org Structured Data (JSON-LD) -->
    <script type="application/ld+json">
    @verbatim
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://devsfromtomorrow.com/#organization",
          "name": "Devs From Tomorrow",
          "url": "https://devsfromtomorrow.com/",
          "logo": {
            "@type": "ImageObject",
            "@id": "https://devsfromtomorrow.com/#logo",
            "url": "https://devsfromtomorrow.com/favicon.svg",
            "caption": "Devs From Tomorrow Logo"
          },
          "image": "https://devsfromtomorrow.com/og-image.png",
          "description": "Desenvolvemos hoje as soluções digitais de amanhã. Especialistas em sistemas web sob medida, aplicativos mobile, automação de processos com n8n e inteligência artificial.",
          "email": "contato@devsfromtomorrow.com",
          "sameAs": [
            "https://www.instagram.com/devsfromtomorrow/",
            "https://www.linkedin.com/company/devs-from-tomorrow",
            "https://github.com/devs-from-tomorrow"
          ],
          "contactPoint": [
            {
              "@type": "ContactPoint",
              "contactType": "sales",
              "email": "contato@devsfromtomorrow.com",
              "availableLanguage": ["Portuguese", "English"]
            }
          ]
        },
        {
          "@type": "WebSite",
          "@id": "https://devsfromtomorrow.com/#website",
          "url": "https://devsfromtomorrow.com/",
          "name": "Devs From Tomorrow",
          "description": "Soluções Digitais, Automação & Inteligência Artificial",
          "publisher": {
            "@id": "https://devsfromtomorrow.com/#organization"
          },
          "inLanguage": "pt-BR"
        },
        {
          "@type": "ProfessionalService",
          "@id": "https://devsfromtomorrow.com/#service",
          "name": "Devs From Tomorrow",
          "url": "https://devsfromtomorrow.com/",
          "parentOrganization": {
            "@id": "https://devsfromtomorrow.com/#organization"
          },
          "description": "Desenvolvimento sob medida de sistemas web, mobile apps, automação com n8n e chatbots integrados com Inteligência Artificial.",
          "priceRange": "$$",
          "areaServed": {
            "@type": "Country",
            "name": "Brasil"
          },
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Serviços Digitais",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Desenvolvimento Web & Sistemas Sob Medida"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Aplicativos Mobile (iOS e Android)"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Automação de Processos com n8n"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Chatbots & Inteligência Artificial"
                }
              }
            ]
          }
        }
      ]
    }
    @endverbatim
    </script>

    @viteReactRefresh
    @vite(['resources/js/main.tsx', 'resources/css/index.css'])
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
