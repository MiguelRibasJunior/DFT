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

    // Telefone, WhatsApp, e-mail, endereço e redes sociais agora vivem em ContactLink
    // (as colunas antigas continuam na tabela, sem uso, para não perder dados).
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

    /**
     * @return array<int, array{label: string, url: string}>
     */
    public function footerLinks(): array
    {
        return $this->footer_links ?? self::DEFAULT_FOOTER_LINKS;
    }
}
