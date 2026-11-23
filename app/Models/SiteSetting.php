<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    /**
     * Links de navegação do rodapé usados enquanto o admin não personaliza a lista.
     *
     * @var array<int, array{label: string, url: string}>
     */
    public const DEFAULT_FOOTER_LINKS = [
        ['label' => 'Início', 'url' => '#hero'],
        ['label' => 'Soluções Digitais', 'url' => '#solucoes'],
        ['label' => 'Automação n8n & IA', 'url' => '#automacao'],
        ['label' => 'Diferenciais', 'url' => '#diferenciais'],
        ['label' => 'Processo', 'url' => '#processo'],
        ['label' => 'Tecnologias', 'url' => '#tecnologias'],
    ];

    /** Textos de SEO usados enquanto o admin não preenche os campos da aba SEO. */
    public const DEFAULT_TITLE = 'Devs From Tomorrow — Soluções Digitais, Automação & Inteligência Artificial';

    public const DEFAULT_DESCRIPTION = 'Desenvolvemos hoje as soluções digitais de amanhã. Especialistas em sistemas web sob medida, aplicativos mobile, automação de processos com n8n e inteligência artificial.';

    public const DEFAULT_KEYWORDS = 'desenvolvimento web, sistemas web, aplicativos mobile, automação n8n, chatbots IA, inteligência artificial, software house, Devs From Tomorrow';

    /** IDs aceitos de analytics (o valor vai para dentro de um <script>, então é validado de novo na saída). */
    public const GOOGLE_ANALYTICS_PATTERN = '/^G-[A-Z0-9]{4,20}$/';

    public const GOOGLE_TAG_MANAGER_PATTERN = '/^GTM-[A-Z0-9]{4,12}$/';

    // Telefone, WhatsApp, e-mail, endereço e redes sociais vivem em ContactLink
    // (as colunas antigas foram removidas de site_settings).
    protected $fillable = [
        'site_name',
        'description',
        'logo',
        'favicon',
        'footer_links',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'og_image',
        'google_analytics_id',
        'google_tag_manager_id',
        'extra_scripts',
        'copyright_text',
        'privacy_policy',
        'terms_of_use',
    ];

    protected $casts = [
        'footer_links' => 'array',
    ];

    public static function current(): self
    {
        return static::query()->firstOrCreate(['id' => 1]);
    }

    public function seoTitle(): string
    {
        return filled($this->meta_title) ? $this->meta_title : self::DEFAULT_TITLE;
    }

    public function seoDescription(): string
    {
        return filled($this->meta_description) ? $this->meta_description : self::DEFAULT_DESCRIPTION;
    }

    public function seoKeywords(): string
    {
        return filled($this->meta_keywords) ? $this->meta_keywords : self::DEFAULT_KEYWORDS;
    }

    /** Caminho público (`/storage/...`) da logo enviada no admin, ou null para usar a logo padrão. */
    public function logoUrl(): ?string
    {
        return self::publicPath($this->logo);
    }

    public function faviconUrl(): ?string
    {
        return self::publicPath($this->favicon);
    }

    public function ogImageUrl(): ?string
    {
        return self::publicPath($this->og_image);
    }

    /** ID do Google Analytics 4 (G-XXXX) se estiver preenchido e válido; senão null. */
    public function googleAnalyticsId(): ?string
    {
        $id = strtoupper(trim((string) $this->google_analytics_id));

        return preg_match(self::GOOGLE_ANALYTICS_PATTERN, $id) === 1 ? $id : null;
    }

    /** ID do Google Tag Manager (GTM-XXXX) se estiver preenchido e válido; senão null. */
    public function googleTagManagerId(): ?string
    {
        $id = strtoupper(trim((string) $this->google_tag_manager_id));

        return preg_match(self::GOOGLE_TAG_MANAGER_PATTERN, $id) === 1 ? $id : null;
    }

    private static function publicPath(?string $path): ?string
    {
        return filled($path) ? '/storage/'.ltrim($path, '/') : null;
    }

    /**
     * @return array<int, array{label: string, url: string}>
     */
    public function footerLinks(): array
    {
        return $this->footer_links ?? self::DEFAULT_FOOTER_LINKS;
    }
}
