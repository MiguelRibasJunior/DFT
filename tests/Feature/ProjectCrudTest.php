<?php

namespace Tests\Feature;

use App\Filament\Resources\Projects\Pages\CreateProject;
use App\Filament\Resources\Projects\Pages\EditProject;
use App\Filament\Resources\Projects\Pages\ListProjects;
use App\Models\Activity;
use App\Models\Comment;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

/**
 * Cadastro, edição e exclusão de projetos pelas telas do painel (formulários e
 * ações de verdade), não pelo model.
 */
class ProjectCrudTest extends TestCase
{
    use RefreshDatabase;

    private function actingAsRole(string $role): User
    {
        Role::firstOrCreate(['name' => $role]);

        $user = User::create(['name' => $role, 'email' => strtolower($role).'@example.com', 'password' => 'password']);
        $user->assignRole($role);
        $this->actingAs($user);

        return $user;
    }

    private function makeProject(array $overrides = []): Project
    {
        return Project::create(array_merge([
            'title' => 'Projeto de Teste',
            'slug' => 'projeto-de-teste-'.uniqid(),
            'short_description' => 'Descrição curta',
            'description' => 'Descrição completa',
            'category' => 'Sistema Web',
            'status' => 'draft',
        ], $overrides));
    }

    private function validForm(array $overrides = []): array
    {
        return array_merge([
            'title' => 'Plataforma Nova',
            'slug' => 'plataforma-nova',
            'category' => 'Sistema Web & Dashboard',
            'technologies' => ['Laravel', 'React'],
            'short_description' => 'Resumo do projeto.',
            'description' => 'Descrição completa do projeto.',
        ], $overrides);
    }

    // ---------------------------------------------------------------- cadastro

    public function test_admin_creates_a_project_through_the_form(): void
    {
        $this->actingAsRole('Admin');

        Livewire::test(CreateProject::class)
            ->fillForm($this->validForm())
            ->call('create')
            ->assertHasNoFormErrors();

        $project = Project::where('slug', 'plataforma-nova')->first();

        $this->assertNotNull($project);
        $this->assertSame('Plataforma Nova', $project->title);
        $this->assertSame(['Laravel', 'React'], $project->technologies);
        $this->assertSame('draft', $project->status, 'Projeto novo nasce como rascunho, fora do site.');
        $this->assertFalse($project->featured);
        $this->assertSame('planning', $project->management_status->value);
    }

    public function test_editor_can_also_create_projects(): void
    {
        $this->actingAsRole('Editor');

        Livewire::test(CreateProject::class)
            ->fillForm($this->validForm())
            ->call('create')
            ->assertHasNoFormErrors();

        $this->assertDatabaseHas('projects', ['slug' => 'plataforma-nova']);
    }

    public function test_required_fields_are_enforced_on_create(): void
    {
        $this->actingAsRole('Admin');

        Livewire::test(CreateProject::class)
            ->fillForm([
                'title' => '',
                'slug' => '',
                'category' => '',
                'short_description' => '',
                'description' => '',
            ])
            ->call('create')
            ->assertHasFormErrors([
                'title' => 'required',
                'slug' => 'required',
                'category' => 'required',
                'short_description' => 'required',
                'description' => 'required',
            ]);

        $this->assertDatabaseCount('projects', 0);
    }

    public function test_slug_must_be_unique_on_create(): void
    {
        $this->actingAsRole('Admin');
        $this->makeProject(['slug' => 'plataforma-nova']);

        Livewire::test(CreateProject::class)
            ->fillForm($this->validForm())
            ->call('create')
            ->assertHasFormErrors(['slug' => 'unique']);

        $this->assertDatabaseCount('projects', 1);
    }

    public function test_clearing_the_title_shows_a_validation_error_instead_of_crashing(): void
    {
        $this->actingAsRole('Admin');
        $project = $this->makeProject();

        Livewire::test(EditProject::class, ['record' => $project->id])
            ->fillForm(['title' => ''])
            ->call('save')
            ->assertHasFormErrors(['title' => 'required']);

        $this->assertSame('Projeto de Teste', $project->fresh()->title);
    }

    public function test_short_description_is_limited_to_300_characters(): void
    {
        $this->actingAsRole('Admin');

        Livewire::test(CreateProject::class)
            ->fillForm($this->validForm(['short_description' => str_repeat('a', 301)]))
            ->call('create')
            ->assertHasFormErrors(['short_description' => 'max']);

        Livewire::test(CreateProject::class)
            ->fillForm($this->validForm(['short_description' => str_repeat('a', 300)]))
            ->call('create')
            ->assertHasNoFormErrors();
    }

    public function test_external_links_must_be_valid_urls(): void
    {
        $this->actingAsRole('Admin');

        Livewire::test(CreateProject::class)
            ->fillForm($this->validForm([
                'project_url' => 'isto-nao-e-url',
                'github_url' => 'javascript:alert(1)',
            ]))
            ->call('create')
            ->assertHasFormErrors(['project_url', 'github_url']);

        $this->assertDatabaseCount('projects', 0);
    }

    // ------------------------------------------------------------------ edição

    public function test_admin_edits_a_project_through_the_form(): void
    {
        $this->actingAsRole('Admin');
        $project = $this->makeProject(['title' => 'Antigo', 'technologies' => ['PHP']]);

        Livewire::test(EditProject::class, ['record' => $project->id])
            ->fillForm([
                'title' => 'Título Atualizado',
                'technologies' => ['Laravel', 'Filament'],
                'category' => 'Mobile',
            ])
            ->call('save')
            ->assertHasNoFormErrors();

        $project->refresh();
        $this->assertSame('Título Atualizado', $project->title);
        $this->assertSame(['Laravel', 'Filament'], $project->technologies);
        $this->assertSame('Mobile', $project->category);
    }

    public function test_saving_without_changing_the_slug_does_not_trigger_the_unique_rule(): void
    {
        $this->actingAsRole('Admin');
        $project = $this->makeProject(['slug' => 'meu-projeto']);

        Livewire::test(EditProject::class, ['record' => $project->id])
            ->fillForm(['category' => 'Outra categoria'])
            ->call('save')
            ->assertHasNoFormErrors();

        $this->assertSame('meu-projeto', $project->fresh()->slug);
        $this->assertSame('Outra categoria', $project->fresh()->category);
    }

    public function test_edit_cannot_take_another_projects_slug(): void
    {
        $this->actingAsRole('Admin');
        $this->makeProject(['slug' => 'ja-existe']);
        $project = $this->makeProject(['slug' => 'o-meu']);

        Livewire::test(EditProject::class, ['record' => $project->id])
            ->fillForm(['slug' => 'ja-existe'])
            ->call('save')
            ->assertHasFormErrors(['slug' => 'unique']);

        $this->assertSame('o-meu', $project->fresh()->slug);
    }

    // ----------------------------------------------------------------- exclusão

    public function test_admin_deletes_a_project_from_the_list(): void
    {
        $this->actingAsRole('Admin');
        $project = $this->makeProject();
        $other = $this->makeProject();

        Livewire::test(ListProjects::class)
            ->callTableAction('delete', $project);

        $this->assertDatabaseMissing('projects', ['id' => $project->id]);
        $this->assertDatabaseHas('projects', ['id' => $other->id]);
    }

    public function test_admin_deletes_a_project_from_the_edit_page(): void
    {
        $this->actingAsRole('Admin');
        $project = $this->makeProject();

        Livewire::test(EditProject::class, ['record' => $project->id])
            ->callAction('delete');

        $this->assertDatabaseMissing('projects', ['id' => $project->id]);
    }

    public function test_admin_deletes_several_projects_at_once(): void
    {
        $this->actingAsRole('Admin');
        $a = $this->makeProject();
        $b = $this->makeProject();
        $keep = $this->makeProject();

        Livewire::test(ListProjects::class)
            ->callTableBulkAction('delete', [$a, $b]);

        $this->assertDatabaseMissing('projects', ['id' => $a->id]);
        $this->assertDatabaseMissing('projects', ['id' => $b->id]);
        $this->assertDatabaseHas('projects', ['id' => $keep->id]);
    }

    public function test_deleting_a_project_removes_its_tasks_comments_and_activity_log(): void
    {
        $user = $this->actingAsRole('Admin');
        $project = $this->makeProject();
        Task::create(['project_id' => $project->id, 'title' => 'Tarefa']);
        Comment::create(['project_id' => $project->id, 'user_id' => $user->id, 'content' => 'Comentário']);
        Activity::log($project->id, 'Algo aconteceu', $user->id);

        Livewire::test(ListProjects::class)->callTableAction('delete', $project);

        $this->assertDatabaseCount('tasks', 0);
        $this->assertDatabaseCount('comments', 0);
        $this->assertDatabaseCount('activities', 0);
    }

    public function test_editor_does_not_get_the_delete_action(): void
    {
        $this->actingAsRole('Editor');
        $project = $this->makeProject();

        Livewire::test(ListProjects::class)
            ->assertTableActionHidden('delete', $project);

        $this->assertDatabaseHas('projects', ['id' => $project->id]);
    }
}
