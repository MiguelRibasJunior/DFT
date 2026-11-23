<?php

namespace Tests\Feature;

use App\Enums\ContactLinkType;
use App\Filament\Pages\Settings;
use App\Models\ContactLink;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

/**
 * O que o admin edita em Configurações (nome, logo, favicon, SEO, analytics) e em Canais de
 * contato precisa chegar ao HTML que o servidor entrega (e à API, no caso da logo).
 */
class PublicPageSettingsTest extends TestCase
{
    use RefreshDatabase;

    private function asProduction(): void
    {
        $this->app->detectEnvironment(fn () => 'production');
    }

    private function jsonLd(string $html): array
    {
        preg_match('#<script type="application/ld\+json">(.*?)</script>#s', $html, $match);

        return json_decode($match[1], true, flags: JSON_THROW_ON_ERROR);
    }

    // -------------------------------------------------------------- padrões

    public function test_without_any_setting_the_page_uses_the_default_texts_and_icons(): void
    {
        $html = $this->get('/')->assertOk()->getContent();

        $this->assertStringContainsString('<title>'.e(SiteSetting::DEFAULT_TITLE).'</title>', $html);
        $this->assertStringContainsString('content="'.e(SiteSetting::DEFAULT_DESCRIPTION).'"', $html);
        $this->assertStringContainsString('rel="icon" type="image/svg+xml" href="/favicon.svg"', $html);
        $this->assertStringContainsString('og-image.png', $html);
        $this->assertStringContainsString('property="og:image:width" content="1200"', $html);
    }

    // ------------------------------------------------------------------ SEO

    public function test_seo_fields_from_the_admin_reach_the_page(): void
    {
        SiteSetting::current()->update([
            'site_name' => 'DFT Studio',
            'meta_title' => 'DFT Studio — Software sob medida',
            'meta_description' => 'Criamos software sob medida para o seu negócio.',
            'meta_keywords' => 'software, automação',
        ]);

        $html = $this->get('/')->getContent();

        $this->assertStringContainsString('<title>DFT Studio — Software sob medida</title>', $html);
        $this->assertStringContainsString('<meta name="description" content="Criamos software sob medida para o seu negócio." />', $html);
        $this->assertStringContainsString('<meta name="keywords" content="software, automação" />', $html);
        $this->assertStringContainsString('property="og:title" content="DFT Studio — Software sob medida"', $html);
        $this->assertStringContainsString('property="og:site_name" content="DFT Studio"', $html);
        $this->assertStringContainsString('name="twitter:description" content="Criamos software sob medida para o seu negócio."', $html);
    }

    public function test_seo_text_is_escaped_and_cannot_break_out_of_the_head(): void
    {
        SiteSetting::current()->update([
            'meta_title' => 'Título </title><script>alert(1)</script>',
            'meta_description' => '"><script>alert(2)</script>',
        ]);

        $html = $this->get('/')->getContent();

        $this->assertStringNotContainsString('<script>alert(1)', $html);
        $this->assertStringNotContainsString('<script>alert(2)', $html);
        $this->assertStringContainsString('&lt;script&gt;alert(1)', $html);
    }

    public function test_custom_open_graph_image_is_absolute_and_drops_the_default_dimensions(): void
    {
        SiteSetting::current()->update(['og_image' => 'settings/capa.png']);

        $html = $this->get('/')->getContent();

        $this->assertStringContainsString('property="og:image" content="'.rtrim(config('app.url'), '/').'/storage/settings/capa.png"', $html);
        $this->assertStringNotContainsString('og:image:width', $html);
    }

    // -------------------------------------------------------------- favicon

    public function test_custom_png_favicon_replaces_the_icon_and_the_touch_icon(): void
    {
        SiteSetting::current()->update(['favicon' => 'settings/icone.png']);

        $html = $this->get('/')->getContent();

        $this->assertStringContainsString('rel="icon" type="image/png" href="/storage/settings/icone.png"', $html);
        $this->assertStringContainsString('rel="apple-touch-icon" href="/storage/settings/icone.png"', $html);
    }

    public function test_non_png_favicon_keeps_the_default_touch_icon(): void
    {
        SiteSetting::current()->update(['favicon' => 'settings/icone.ico']);

        $html = $this->get('/')->getContent();

        $this->assertStringContainsString('rel="icon" type="image/x-icon" href="/storage/settings/icone.ico"', $html);
        $this->assertStringContainsString('rel="apple-touch-icon" href="/favicon.svg"', $html);
    }

    // --------------------------------------------------------------- logo

    public function test_api_exposes_the_logo_as_a_public_url_or_null(): void
    {
        $this->getJson('/api/settings')->assertJsonPath('data.logo', null);

        SiteSetting::current()->update(['logo' => 'settings/logo.png', 'favicon' => 'settings/icone.png']);

        $this->getJson('/api/settings')
            ->assertJsonPath('data.logo', '/storage/settings/logo.png')
            ->assertJsonPath('data.favicon', '/storage/settings/icone.png');
    }

    // ------------------------------------------------------------- JSON-LD

    public function test_json_ld_uses_the_site_name_and_the_active_contact_channels(): void
    {
        SiteSetting::current()->update(['site_name' => 'DFT Studio', 'logo' => 'settings/logo.png']);
        ContactLink::create(['type' => ContactLinkType::Email, 'label' => 'E-mail', 'value' => 'oi@dft.test', 'active' => true]);
        ContactLink::create(['type' => ContactLinkType::Linkedin, 'label' => 'LinkedIn', 'value' => 'https://www.linkedin.com/company/dft', 'active' => true]);
        ContactLink::create(['type' => ContactLinkType::Github, 'label' => 'GitHub', 'value' => 'https://github.com/dft', 'active' => false]);

        $organization = $this->jsonLd($this->get('/')->getContent())['@graph'][0];

        $this->assertSame('DFT Studio', $organization['name']);
        $this->assertSame('oi@dft.test', $organization['email']);
        $this->assertSame(['https://www.linkedin.com/company/dft'], $organization['sameAs'], 'canal inativo não entra');
        $this->assertStringEndsWith('/storage/settings/logo.png', $organization['logo']['url']);
    }

    public function test_json_ld_omits_email_and_profiles_when_no_channel_is_registered(): void
    {
        $organization = $this->jsonLd($this->get('/')->getContent())['@graph'][0];

        $this->assertArrayNotHasKey('email', $organization);
        $this->assertArrayNotHasKey('sameAs', $organization);
        $this->assertArrayNotHasKey('contactPoint', $organization);
    }

    public function test_a_script_closing_tag_in_the_description_cannot_break_the_json_ld_block(): void
    {
        SiteSetting::current()->update(['meta_description' => 'Texto </script><script>alert(1)</script>']);

        $html = $this->get('/')->getContent();

        // O JSON continua sendo lido por inteiro e a descrição volta como texto, não como tag.
        $organization = $this->jsonLd($html)['@graph'][0];
        $this->assertSame('Texto </script><script>alert(1)</script>', $organization['description']);
        $this->assertStringNotContainsString('</script><script>alert(1)', $html);
    }

    // ------------------------------------------------------------ analytics (LGPD)

    /** Lê o bloco JSON de configuração de analytics do HTML (ou null se não houver). */
    private function analyticsConfig(string $html): ?array
    {
        if (! preg_match('#<script type="application/json" id="dft-analytics">(.*?)</script>#s', $html, $match)) {
            return null;
        }

        return json_decode($match[1], true, flags: JSON_THROW_ON_ERROR);
    }

    public function test_the_html_never_loads_google_scripts_before_the_visitor_consents(): void
    {
        $this->asProduction();
        SiteSetting::current()->update(['google_analytics_id' => 'G-ABCD1234', 'google_tag_manager_id' => 'GTM-ABCD123']);

        $html = $this->get('/')->getContent();

        // Nada do Google no HTML: nem script, nem iframe do <noscript>, nem a função gtag.
        $this->assertStringNotContainsString('googletagmanager.com', $html);
        $this->assertStringNotContainsString('google-analytics.com', $html);
        $this->assertStringNotContainsString('gtag(', $html);
        $this->assertStringNotContainsString('dataLayer', $html);
    }

    public function test_analytics_config_is_not_delivered_outside_production_even_with_ids_filled(): void
    {
        SiteSetting::current()->update(['google_analytics_id' => 'G-ABCD1234', 'google_tag_manager_id' => 'GTM-ABCD123']);

        $this->assertNull($this->analyticsConfig($this->get('/')->getContent()));
    }

    public function test_analytics_config_is_delivered_in_production_when_the_ids_are_valid(): void
    {
        $this->asProduction();
        SiteSetting::current()->update(['google_analytics_id' => 'g-abcd1234', 'google_tag_manager_id' => 'GTM-ABCD123']);

        $this->assertSame(
            ['ga4' => 'G-ABCD1234', 'gtm' => 'GTM-ABCD123'],
            $this->analyticsConfig($this->get('/')->getContent())
        );
    }

    public function test_only_the_filled_provider_is_delivered(): void
    {
        $this->asProduction();
        SiteSetting::current()->update(['google_analytics_id' => 'G-ABCD1234']);

        $this->assertSame(['ga4' => 'G-ABCD1234', 'gtm' => null], $this->analyticsConfig($this->get('/')->getContent()));
    }

    public function test_no_config_block_in_production_when_the_ids_are_empty(): void
    {
        $this->asProduction();

        $this->assertNull($this->analyticsConfig($this->get('/')->getContent()));
    }

    public function test_an_invalid_id_is_never_written_into_the_page(): void
    {
        $this->asProduction();
        SiteSetting::current()->update([
            'google_analytics_id' => "G-X');alert(1);//",
            'google_tag_manager_id' => "GTM-X');alert(2);//",
        ]);

        $html = $this->get('/')->getContent();

        $this->assertStringNotContainsString('alert(1)', $html);
        $this->assertStringNotContainsString('alert(2)', $html);
        $this->assertNull($this->analyticsConfig($html));
    }

    // ------------------------------------------------------------- noscript

    public function test_noscript_shows_the_site_and_the_active_channels(): void
    {
        SiteSetting::current()->update(['site_name' => 'DFT Studio']);
        ContactLink::create(['type' => ContactLinkType::Email, 'label' => 'E-mail', 'value' => 'oi@dft.test', 'active' => true]);
        ContactLink::create(['type' => ContactLinkType::Phone, 'label' => 'Telefone', 'value' => '(11) 98765-4321', 'active' => false]);

        $html = $this->get('/')->getContent();

        $this->assertMatchesRegularExpression('#<noscript>\s*<div[^>]*>\s*<h1[^>]*>DFT Studio</h1>#', $html);
        $this->assertStringContainsString('href="mailto:oi@dft.test"', $html);
        $this->assertStringNotContainsString('98765-4321', $html, 'canal inativo não aparece');
        $this->assertStringContainsString('precisa do JavaScript', $html);
    }

    // ------------------------------------------------- tela de configurações

    private function actingAsAdmin(): void
    {
        Role::firstOrCreate(['name' => 'Admin']);
        $user = User::create(['name' => 'Admin', 'email' => 'admin@example.com', 'password' => 'password']);
        $user->assignRole('Admin');
        $this->actingAs($user);
    }

    public function test_settings_form_rejects_malformed_analytics_ids(): void
    {
        $this->actingAsAdmin();

        Livewire::test(Settings::class)
            ->fillForm(['site_name' => 'DFT', 'google_analytics_id' => 'UA-123', 'google_tag_manager_id' => 'abc'])
            ->call('save')
            ->assertHasFormErrors(['google_analytics_id', 'google_tag_manager_id']);
    }

    public function test_settings_form_accepts_valid_analytics_ids_and_empty_ones(): void
    {
        $this->actingAsAdmin();

        Livewire::test(Settings::class)
            ->fillForm(['site_name' => 'DFT', 'google_analytics_id' => 'G-ABCD1234', 'google_tag_manager_id' => 'GTM-ABCD123'])
            ->call('save')
            ->assertHasNoFormErrors();

        $this->assertSame('G-ABCD1234', SiteSetting::current()->google_analytics_id);

        Livewire::test(Settings::class)
            ->fillForm(['site_name' => 'DFT', 'google_analytics_id' => null, 'google_tag_manager_id' => null])
            ->call('save')
            ->assertHasNoFormErrors();
    }
}
