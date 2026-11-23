<?php

namespace Tests\Feature;

use App\Enums\ContactLinkType;
use App\Filament\Resources\ContactLinks\Pages\CreateContactLink;
use App\Filament\Resources\ContactLinks\Pages\EditContactLink;
use App\Filament\Resources\ContactLinks\Pages\ListContactLinks;
use App\Models\ContactLink;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use PHPUnit\Framework\Attributes\DataProvider;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class ContactLinkTest extends TestCase
{
    use RefreshDatabase;

    private function actingAsAdmin(): void
    {
        Role::firstOrCreate(['name' => 'Admin']);
        $user = User::create(['name' => 'Admin', 'email' => 'a@example.com', 'password' => 'password']);
        $user->assignRole('Admin');
        $this->actingAs($user);
    }

    private function link(array $overrides = []): ContactLink
    {
        return ContactLink::create(array_merge([
            'type' => 'email',
            'label' => 'E-mail',
            'value' => 'contato@exemplo.com',
            'active' => true,
        ], $overrides));
    }

    public static function validValues(): array
    {
        return [
            'whatsapp com máscara' => ['whatsapp', '(11) 99999-9999', 'https://wa.me/5511999999999'],
            'whatsapp com DDI' => ['whatsapp', '+55 11 99999-9999', 'https://wa.me/5511999999999'],
            'telefone fixo' => ['phone', '(11) 3333-4444', 'tel:+551133334444'],
            'e-mail' => ['email', 'contato@exemplo.com', 'mailto:contato@exemplo.com'],
            'instagram' => ['instagram', 'https://www.instagram.com/dft/', 'https://www.instagram.com/dft/'],
            'linkedin' => ['linkedin', 'https://linkedin.com/company/dft', 'https://linkedin.com/company/dft'],
            'github' => ['github', 'https://github.com/dft', 'https://github.com/dft'],
            'site' => ['website', 'https://exemplo.com.br', 'https://exemplo.com.br'],
        ];
    }

    public static function invalidValues(): array
    {
        return [
            'whatsapp curto' => ['whatsapp', '1234'],
            'telefone com letras' => ['phone', 'abc'],
            'e-mail inválido' => ['email', 'nao-e-email'],
            'instagram em outro domínio' => ['instagram', 'https://facebook.com/dft'],
            'instagram sem https' => ['instagram', 'instagram.com/dft'],
            'github em domínio parecido' => ['github', 'https://github.com.evil.io/dft'],
            'javascript' => ['website', 'javascript:alert(1)'],
            'endereço curto' => ['address', 'ab'],
        ];
    }

    #[DataProvider('validValues')]
    public function test_each_type_builds_the_expected_public_link(string $type, string $value, string $href): void
    {
        $this->assertSame($href, ContactLinkType::from($type)->href($value));
        $this->assertNull(ContactLinkType::from($type)->validate($value));
    }

    #[DataProvider('invalidValues')]
    public function test_invalid_values_are_rejected_per_type(string $type, string $value): void
    {
        $enum = ContactLinkType::from($type);

        $this->assertNotNull($enum->validate($value));

        if ($type !== 'address') {
            $this->assertNull($enum->href($value), 'Valor inválido não pode gerar link público.');
        }
    }

    public function test_address_builds_a_maps_link(): void
    {
        $href = ContactLinkType::Address->href('Av. Paulista, 1000 - São Paulo');

        $this->assertStringStartsWith('https://www.google.com/maps/search/?api=1&query=', $href);
        $this->assertStringContainsString('Paulista', $href);
    }

    public function test_admin_can_create_a_contact_link(): void
    {
        $this->actingAsAdmin();

        Livewire::test(CreateContactLink::class)
            ->fillForm(['type' => 'whatsapp', 'label' => 'Fale no WhatsApp', 'value' => '(11) 99999-9999', 'active' => true])
            ->call('create')
            ->assertHasNoFormErrors();

        $this->assertDatabaseHas('contact_links', ['type' => 'whatsapp', 'label' => 'Fale no WhatsApp']);
    }

    #[DataProvider('invalidValues')]
    public function test_admin_form_rejects_invalid_values(string $type, string $value): void
    {
        $this->actingAsAdmin();

        Livewire::test(CreateContactLink::class)
            ->fillForm(['type' => $type, 'label' => 'X', 'value' => $value])
            ->call('create')
            ->assertHasFormErrors(['value']);

        $this->assertDatabaseCount('contact_links', 0);
    }

    public function test_type_must_come_from_the_closed_icon_catalog(): void
    {
        $this->actingAsAdmin();

        Livewire::test(CreateContactLink::class)
            ->fillForm(['type' => '<svg onload=alert(1)>', 'label' => 'X', 'value' => 'https://x.com'])
            ->call('create')
            ->assertHasFormErrors(['type']);
    }

    public function test_new_links_go_to_the_end_of_the_order(): void
    {
        $first = $this->link(['value' => 'a@exemplo.com']);
        $second = $this->link(['value' => 'b@exemplo.com']);

        $this->assertSame(0, $first->order);
        $this->assertSame(1, $second->order);
    }

    public function test_admin_can_reorder_and_deactivate_links(): void
    {
        $this->actingAsAdmin();
        $a = $this->link(['label' => 'A', 'value' => 'a@exemplo.com']);
        $b = $this->link(['label' => 'B', 'value' => 'b@exemplo.com']);
        $c = $this->link(['label' => 'C', 'value' => 'c@exemplo.com']);

        Livewire::test(ListContactLinks::class)
            ->assertSuccessful()
            ->assertCanSeeTableRecords([$a, $b, $c])
            ->call('reorderTable', [$c->id, $a->id, $b->id]);

        $this->assertSame(['C', 'A', 'B'], ContactLink::ordered()->pluck('label')->all());

        Livewire::test(EditContactLink::class, ['record' => $a->id])
            ->fillForm(['active' => false])
            ->call('save')
            ->assertHasNoFormErrors();

        $this->assertFalse($a->fresh()->active);
    }

    public function test_api_returns_only_active_links_in_order_with_built_hrefs(): void
    {
        $this->link(['label' => 'Segundo', 'value' => 'b@exemplo.com', 'order' => 2]);
        $this->link(['label' => 'Primeiro', 'type' => 'whatsapp', 'value' => '(11) 99999-9999', 'order' => 1]);
        $this->link(['label' => 'Inativo', 'value' => 'c@exemplo.com', 'order' => 0, 'active' => false]);

        $response = $this->getJson('/api/contact-links')->assertOk();

        $this->assertSame(['Primeiro', 'Segundo'], collect($response->json('data'))->pluck('label')->all());
        $response->assertJsonPath('data.0.href', 'https://wa.me/5511999999999')
            ->assertJsonPath('data.0.type', 'whatsapp')
            ->assertJsonPath('data.1.href', 'mailto:b@exemplo.com');
    }

    public function test_api_skips_links_whose_stored_value_no_longer_validates(): void
    {
        $this->link(['label' => 'Quebrado', 'type' => 'instagram', 'value' => 'lixo']);
        $this->link(['label' => 'Bom', 'value' => 'ok@exemplo.com']);

        $this->getJson('/api/contact-links')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.label', 'Bom');
    }

    public function test_guests_cannot_reach_the_admin_screen(): void
    {
        $this->get('/admin/contact-links')->assertRedirect('/admin/login');
    }
}
