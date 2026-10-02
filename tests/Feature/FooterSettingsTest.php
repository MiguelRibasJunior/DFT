<?php

namespace Tests\Feature;

use App\Filament\Pages\FooterSettings;
use App\Filament\Pages\Settings;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class FooterSettingsTest extends TestCase
{
    use RefreshDatabase;

    private function actingAsAdmin(): void
    {
        Role::firstOrCreate(['name' => 'Admin']);
        $user = User::create(['name' => 'Admin', 'email' => 'a@example.com', 'password' => 'password']);
        $user->assignRole('Admin');
        $this->actingAs($user);
    }

    public function test_guests_are_redirected_to_login(): void
    {
        $this->get('/admin/footer')->assertRedirect('/admin/login');
    }

    public function test_footer_page_is_prefilled_with_default_navigation_links(): void
    {
        $this->actingAsAdmin();

        Livewire::test(FooterSettings::class)
            ->assertSuccessful()
            ->assertFormSet(fn (array $state): bool => array_values($state['footer_links']) === SiteSetting::DEFAULT_FOOTER_LINKS);
    }

    public function test_admin_can_save_footer_content(): void
    {
        $this->actingAsAdmin();

        Livewire::test(FooterSettings::class)
            ->fillForm([
                'description' => 'Nova descrição institucional.',
                'copyright_text' => '© 2027 DFT.',
                'footer_links' => [
                    ['label' => 'Início', 'url' => '#hero'],
                    ['label' => 'Blog', 'url' => 'https://blog.exemplo.com'],
                ],
                'privacy_policy' => '<p>Privacidade</p>',
                'terms_of_use' => '<p>Termos</p>',
            ])
            ->call('save')
            ->assertHasNoFormErrors();

        $settings = SiteSetting::current();
        $this->assertSame('Nova descrição institucional.', $settings->description);
        $this->assertSame('© 2027 DFT.', $settings->copyright_text);
        $this->assertSame([
            ['label' => 'Início', 'url' => '#hero'],
            ['label' => 'Blog', 'url' => 'https://blog.exemplo.com'],
        ], $settings->footer_links);
        $this->assertStringContainsString('Privacidade', $settings->privacy_policy);
    }

    public function test_dangerous_or_malformed_link_destinations_are_rejected(): void
    {
        $this->actingAsAdmin();

        foreach (['javascript:alert(1)', 'sem-esquema', 'data:text/html;base64,AAAA'] as $url) {
            Livewire::test(FooterSettings::class)
                ->fillForm(['footer_links' => [['label' => 'Ruim', 'url' => $url]]])
                ->call('save')
                ->assertHasFormErrors(['footer_links.0.url']);
        }

        $this->assertNull(SiteSetting::current()->footer_links);
    }

    public function test_link_label_is_required(): void
    {
        $this->actingAsAdmin();

        Livewire::test(FooterSettings::class)
            ->fillForm(['footer_links' => [['label' => '', 'url' => '#hero']]])
            ->call('save')
            ->assertHasFormErrors(['footer_links.0.label']);
    }

    public function test_admin_can_remove_every_link(): void
    {
        $this->actingAsAdmin();

        Livewire::test(FooterSettings::class)
            ->fillForm(['footer_links' => []])
            ->call('save')
            ->assertHasNoFormErrors();

        $this->getJson('/api/settings')->assertOk()->assertJsonPath('data.footer_links', []);
    }

    public function test_api_serves_default_links_until_the_admin_customizes_them(): void
    {
        $this->getJson('/api/settings')
            ->assertOk()
            ->assertJsonPath('data.footer_links', SiteSetting::DEFAULT_FOOTER_LINKS);

        SiteSetting::current()->update(['footer_links' => [['label' => 'Só um', 'url' => '#hero']]]);

        $this->getJson('/api/settings')->assertJsonPath('data.footer_links', [['label' => 'Só um', 'url' => '#hero']]);
    }

    public function test_api_does_not_expose_private_or_legacy_fields(): void
    {
        SiteSetting::current()->update([
            'google_analytics_id' => 'G-SECRET',
            'extra_scripts' => '<script>x</script>',
        ]);

        $data = $this->getJson('/api/settings')->assertOk()->json('data');

        foreach (['google_analytics_id', 'google_tag_manager_id', 'extra_scripts', 'phone', 'whatsapp', 'email', 'instagram', 'github'] as $field) {
            $this->assertArrayNotHasKey($field, $data);
        }
    }

    public function test_legal_html_is_sanitized_before_reaching_the_public_site(): void
    {
        SiteSetting::current()->update([
            'privacy_policy' => '<p>Texto <strong>ok</strong></p><script>alert(1)</script><img src="x" onerror="alert(2)">',
            'terms_of_use' => '<a href="javascript:alert(3)">clique</a><p>Termos</p>',
        ]);

        $data = $this->getJson('/api/settings')->json('data');

        $this->assertStringContainsString('<strong>ok</strong>', $data['privacy_policy']);
        $this->assertStringNotContainsString('<script', $data['privacy_policy']);
        $this->assertStringNotContainsString('onerror', $data['privacy_policy']);
        $this->assertStringNotContainsString('javascript:', $data['terms_of_use']);
        $this->assertStringContainsString('Termos', $data['terms_of_use']);
    }

    public function test_general_settings_page_still_renders_and_saves_without_the_moved_tabs(): void
    {
        $this->actingAsAdmin();

        Livewire::test(Settings::class)
            ->assertSuccessful()
            ->assertFormExists()
            ->fillForm(['site_name' => 'DFT Studio'])
            ->call('save')
            ->assertHasNoFormErrors();

        $this->assertSame('DFT Studio', SiteSetting::current()->site_name);
    }
}
