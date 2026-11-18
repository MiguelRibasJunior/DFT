<?php

namespace Tests\Feature;

use App\Filament\Resources\Projects\Pages\EditProject;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use PHPUnit\Framework\Attributes\DataProvider;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

/**
 * Regra de publicação da Home: só aparece projeto Publicado E em Destaque,
 * na ordem definida no admin. O status de gestão não influencia.
 */
class PublicProjectsApiTest extends TestCase
{
    use RefreshDatabase;

    private function makeProject(array $overrides = []): Project
    {
        return Project::create(array_merge([
            'title' => 'Projeto '.uniqid(),
            'slug' => 'projeto-'.uniqid(),
            'short_description' => 'Descrição curta',
            'description' => 'Descrição completa',
            'category' => 'Sistema Web',
            'status' => 'published',
            'featured' => true,
            'order' => 0,
        ], $overrides));
    }

    private function titles(): array
    {
        return collect($this->getJson('/api/projects')->assertOk()->json('data'))->pluck('title')->all();
    }

    private function actingAsAdmin(): void
    {
        Role::firstOrCreate(['name' => 'Admin']);
        $user = User::create(['name' => 'Admin', 'email' => 'a@example.com', 'password' => 'password']);
        $user->assignRole('Admin');
        $this->actingAs($user);
    }

    public function test_only_published_and_featured_projects_are_listed(): void
    {
        $this->makeProject(['title' => 'No ar']);
        $this->makeProject(['title' => 'Rascunho', 'status' => 'draft']);
        $this->makeProject(['title' => 'Arquivado', 'status' => 'archived']);
        $this->makeProject(['title' => 'Sem destaque', 'featured' => false]);
        $this->makeProject(['title' => 'Rascunho sem destaque', 'status' => 'draft', 'featured' => false]);

        $this->assertSame(['No ar'], $this->titles());
    }

    public function test_list_is_empty_when_nothing_qualifies(): void
    {
        $this->makeProject(['status' => 'draft']);
        $this->makeProject(['featured' => false]);

        $this->getJson('/api/projects')->assertOk()->assertExactJson(['success' => true, 'data' => []]);
    }

    public function test_projects_come_in_the_order_set_in_the_admin(): void
    {
        $this->makeProject(['title' => 'Terceiro', 'order' => 30]);
        $this->makeProject(['title' => 'Primeiro', 'order' => 10]);
        $this->makeProject(['title' => 'Segundo', 'order' => 20]);

        $this->assertSame(['Primeiro', 'Segundo', 'Terceiro'], $this->titles());
    }

    public static function managementStatuses(): array
    {
        return [
            'planejamento' => ['planning'],
            'em andamento' => ['in_progress'],
            'em revisão' => ['review'],
            'bloqueado' => ['blocked'],
            'concluído' => ['completed'],
            'arquivado (gestão)' => ['archived'],
        ];
    }

    #[DataProvider('managementStatuses')]
    public function test_management_status_does_not_affect_visibility(string $managementStatus): void
    {
        $this->makeProject(['title' => 'Visível', 'management_status' => $managementStatus]);

        $this->assertSame(['Visível'], $this->titles());
    }

    public function test_only_the_public_fields_are_exposed(): void
    {
        $this->makeProject([
            'technologies' => ['Laravel', 'React'],
            'project_url' => 'https://exemplo.com',
            'meta_title' => 'segredo de seo',
            'progress' => 40,
        ]);

        $project = $this->getJson('/api/projects')->json('data.0');

        $this->assertEqualsCanonicalizing([
            'id', 'title', 'slug', 'short_description', 'description', 'category',
            'technologies', 'cover_image', 'project_url', 'github_url', 'external_url',
        ], array_keys($project));
        $this->assertSame(['Laravel', 'React'], $project['technologies']);
    }

    public function test_endpoint_is_public(): void
    {
        $this->makeProject();

        $this->getJson('/api/projects')->assertOk();
    }

    public function test_publishing_through_the_admin_form_puts_the_project_on_the_site(): void
    {
        $this->actingAsAdmin();
        $project = $this->makeProject(['title' => 'Em rascunho', 'status' => 'draft', 'featured' => false]);
        $this->assertSame([], $this->titles());

        Livewire::test(EditProject::class, ['record' => $project->id])
            ->fillForm(['status' => 'published'])
            ->call('save')
            ->assertHasNoFormErrors();

        $this->assertSame([], $this->titles(), 'Publicado mas sem destaque ainda não aparece.');

        Livewire::test(EditProject::class, ['record' => $project->id])
            ->fillForm(['featured' => true])
            ->call('save')
            ->assertHasNoFormErrors();

        $this->assertSame(['Em rascunho'], $this->titles());
    }

    public function test_removing_the_highlight_or_unpublishing_through_the_admin_takes_it_off_the_site(): void
    {
        $this->actingAsAdmin();
        $project = $this->makeProject(['title' => 'No ar']);
        $this->assertSame(['No ar'], $this->titles());

        Livewire::test(EditProject::class, ['record' => $project->id])
            ->fillForm(['featured' => false])
            ->call('save')
            ->assertHasNoFormErrors();
        $this->assertSame([], $this->titles());

        Livewire::test(EditProject::class, ['record' => $project->id])
            ->fillForm(['featured' => true, 'status' => 'archived'])
            ->call('save')
            ->assertHasNoFormErrors();
        $this->assertSame([], $this->titles());
    }
}
