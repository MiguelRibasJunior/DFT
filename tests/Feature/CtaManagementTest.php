<?php

namespace Tests\Feature;

use App\Filament\Resources\Ctas\Pages\CreateCta;
use App\Filament\Resources\Ctas\Pages\ListCtas;
use App\Models\Cta;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use PHPUnit\Framework\Attributes\DataProvider;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class CtaManagementTest extends TestCase
{
    use RefreshDatabase;

    private function actingAsAdmin(): void
    {
        Role::firstOrCreate(['name' => 'Admin']);
        $user = User::create(['name' => 'Admin', 'email' => 'a@example.com', 'password' => 'password']);
        $user->assignRole('Admin');
        $this->actingAs($user);
    }

    private function cta(array $overrides = []): Cta
    {
        return Cta::create(array_merge([
            'name' => 'CTA',
            'title' => 'Título',
            'subtitle' => 'Sub',
            'button_text' => 'Clique',
            'button_url' => '#contato',
            'position' => 'cta_section',
            'active' => true,
            'order' => 0,
        ], $overrides));
    }

    private function formData(array $overrides = []): array
    {
        return array_merge([
            'name' => 'Novo CTA',
            'position' => 'cta_section',
            'title' => 'Título',
            'button_text' => 'Clique',
            'button_url' => '#contato',
            'active' => true,
            'order' => 0,
        ], $overrides);
    }

    public static function validDestinations(): array
    {
        return [
            'âncora' => ['#contato'],
            'https' => ['https://devsfromtomorrow.com/orcamento'],
            'caminho' => ['/admin'],
            'e-mail' => ['mailto:contato@devsfromtomorrow.com'],
            'telefone' => ['tel:+5511999999999'],
        ];
    }

    public static function invalidDestinations(): array
    {
        return [
            'javascript' => ['javascript:alert(1)'],
            'sem esquema' => ['contato'],
            'ftp' => ['ftp://exemplo.com'],
            'vazio com espaço' => ['https://'],
        ];
    }

    #[DataProvider('validDestinations')]
    public function test_accepts_valid_button_destinations(string $url): void
    {
        $this->actingAsAdmin();

        Livewire::test(CreateCta::class)
            ->fillForm($this->formData(['button_url' => $url]))
            ->call('create')
            ->assertHasNoFormErrors();

        $this->assertDatabaseHas('ctas', ['button_url' => $url]);
    }

    #[DataProvider('invalidDestinations')]
    public function test_rejects_invalid_button_destinations(string $url): void
    {
        $this->actingAsAdmin();

        Livewire::test(CreateCta::class)
            ->fillForm($this->formData(['button_url' => $url]))
            ->call('create')
            ->assertHasFormErrors(['button_url']);

        $this->assertDatabaseCount('ctas', 0);
    }

    public function test_position_must_be_one_of_the_supported_positions(): void
    {
        $this->actingAsAdmin();

        Livewire::test(CreateCta::class)
            ->fillForm($this->formData(['position' => 'Seção CTA']))
            ->call('create')
            ->assertHasFormErrors(['position']);
    }

    public function test_api_serves_the_active_cta_of_the_position(): void
    {
        $this->cta(['title' => 'Do admin', 'button_url' => '#contato']);

        $this->getJson('/api/ctas/cta_section')
            ->assertOk()
            ->assertJsonPath('data.title', 'Do admin')
            ->assertJsonPath('data.button_url', '#contato');
    }

    public function test_inactive_cta_is_never_served(): void
    {
        $this->cta(['active' => false]);

        $this->getJson('/api/ctas/cta_section')->assertOk()->assertJsonPath('data', null);
    }

    public function test_lowest_order_active_cta_wins_when_several_share_a_position(): void
    {
        $this->cta(['title' => 'Segundo', 'order' => 5]);
        $this->cta(['title' => 'Primeiro', 'order' => 1]);
        $this->cta(['title' => 'Inativo', 'order' => 0, 'active' => false]);

        $this->getJson('/api/ctas/cta_section')->assertJsonPath('data.title', 'Primeiro');
    }

    public function test_unknown_position_returns_null(): void
    {
        $this->cta();

        $this->getJson('/api/ctas/rodape')->assertOk()->assertJsonPath('data', null);
    }

    public function test_admin_list_renders_with_position_label_and_shown_state(): void
    {
        $this->actingAsAdmin();
        $shown = $this->cta(['name' => 'CTA no ar', 'order' => 1]);
        $hidden = $this->cta(['name' => 'CTA escondido', 'order' => 2]);

        Livewire::test(ListCtas::class)
            ->assertSuccessful()
            ->assertCanSeeTableRecords([$shown, $hidden])
            ->assertSee('Seção final da Home')
            ->assertTableColumnStateSet('shown', true, $shown)
            ->assertTableColumnStateSet('shown', false, $hidden);
    }

    public function test_is_shown_on_site_reflects_state_and_order(): void
    {
        $winner = $this->cta(['order' => 1]);
        $loser = $this->cta(['order' => 2]);
        $inactive = $this->cta(['order' => 0, 'active' => false]);

        $this->assertTrue($winner->isShownOnSite());
        $this->assertFalse($loser->isShownOnSite());
        $this->assertFalse($inactive->isShownOnSite());
    }
}
