<?php

namespace Tests\Feature;

use App\Enums\ContactLinkType;
use App\Models\ContactLink;
use App\Models\Cta;
use App\Models\Project;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

/**
 * Tudo que uma página Inertia recebe como prop vai no HTML (data-page) e fica visível para qualquer
 * visitante. Estas páginas já entregaram models inteiros (projetos com responsável, progresso e prazos
 * internos; SiteSetting com IDs de analytics e textos legais sem sanitizar). Aqui se garante que só
 * os campos públicos escolhidos chegam ao navegador.
 */
class InertiaPropsExposureTest extends TestCase
{
    use RefreshDatabase;

    private function seedInternalData(): Project
    {
        $manager = User::create(['name' => 'Gerente Interno', 'email' => 'gerente@interno.test', 'password' => 'password']);

        SiteSetting::current()->update([
            'site_name' => 'DFT Studio',
            'copyright_text' => '© 2026 DFT Studio.',
            'google_analytics_id' => 'G-INTERNO1234',
            'google_tag_manager_id' => 'GTM-INTERNO123',
            'extra_scripts' => '<script>window.segredoExtra=1</script>',
            'privacy_policy' => '<p>Texto cru</p><script>window.politicaCrua=1</script>',
            'terms_of_use' => '<p>Termos crus</p>',
        ]);

        Cta::create([
            'name' => 'CTA interno', 'title' => 'Titulo do CTA', 'button_text' => 'Ir', 'button_url' => '#contato',
            'position' => 'cta_section', 'active' => true,
        ]);

        return Project::create([
            'title' => 'Projeto Confidencial Interno',
            'slug' => 'projeto-confidencial',
            'short_description' => 'Descrição curta',
            'description' => 'Descrição completa',
            'category' => 'Sistema Web',
            'status' => 'published',
            'featured' => false, // publicado, mas NÃO em destaque: não pode aparecer no site
            'manager_id' => $manager->id,
            'progress' => 42,
        ]);
    }

    public function test_home_page_sends_no_project_or_cta_data_to_the_browser(): void
    {
        $project = $this->seedInternalData();

        $response = $this->get('/')->assertOk();

        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('Home')
            ->missing('initialData')
            ->missing('projects')
            ->missing('cta')
        );

        $html = $response->getContent();
        foreach ([$project->title, 'manager_id', 'management_status', 'gerente@interno.test', 'Titulo do CTA'] as $internal) {
            $this->assertStringNotContainsString($internal, $html, "'{$internal}' não deveria estar no HTML da página inicial");
        }
    }

    /**
     * @return array<string, array{string, string}>
     */
    public static function legalPages(): array
    {
        return [
            'termos' => ['/termos', 'Terms'],
            'privacidade' => ['/privacidade', 'Privacy'],
        ];
    }

    #[\PHPUnit\Framework\Attributes\DataProvider('legalPages')]
    public function test_legal_pages_receive_only_the_public_fields(string $url, string $component): void
    {
        $this->seedInternalData();

        $response = $this->get($url)->assertOk();

        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component($component)
            ->has('settings', fn (AssertableInertia $settings) => $settings
                ->where('site_name', 'DFT Studio')
                ->where('copyright_text', '© 2026 DFT Studio.')
                ->where('email', null)
                ->etc()
            )
        );

        $settings = $response->original->getData()['page']['props']['settings'];
        $this->assertEqualsCanonicalizing(['site_name', 'copyright_text', 'email'], array_keys($settings));

        $html = $response->getContent();
        foreach (['G-INTERNO1234', 'GTM-INTERNO123', 'segredoExtra', 'politicaCrua', 'extra_scripts', 'google_analytics_id', 'meta_title'] as $internal) {
            $this->assertStringNotContainsString($internal, $html, "'{$internal}' não deveria estar no HTML de {$url}");
        }
    }

    #[\PHPUnit\Framework\Attributes\DataProvider('legalPages')]
    public function test_legal_pages_show_the_active_email_channel_from_the_admin(string $url, string $component): void
    {
        ContactLink::create(['type' => ContactLinkType::Phone, 'label' => 'Telefone', 'value' => '(11) 98765-4321', 'active' => true]);
        ContactLink::create(['type' => ContactLinkType::Email, 'label' => 'Inativo', 'value' => 'inativo@dft.test', 'active' => false]);
        ContactLink::create(['type' => ContactLinkType::Email, 'label' => 'E-mail', 'value' => 'oi@dft.test', 'active' => true]);

        $this->get($url)->assertInertia(fn (AssertableInertia $page) => $page
            ->component($component)
            ->where('settings.email', 'oi@dft.test')
        );
    }
}
