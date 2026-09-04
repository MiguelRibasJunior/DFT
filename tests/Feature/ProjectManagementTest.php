<?php

namespace Tests\Feature;

use App\Enums\Priority;
use App\Enums\ProjectManagementStatus;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class ProjectManagementTest extends TestCase
{
    use RefreshDatabase;

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

    public function test_project_is_created_with_default_management_fields(): void
    {
        $project = $this->makeProject();

        $this->assertSame(ProjectManagementStatus::Planning, $project->management_status);
        $this->assertSame(Priority::Medium, $project->priority);
        $this->assertSame(0, $project->progress);
        $this->assertNull($project->manager_id);
    }

    public function test_project_management_fields_can_be_set_on_creation(): void
    {
        $manager = User::create([
            'name' => 'Maciel',
            'email' => 'maciel@example.com',
            'password' => 'password',
        ]);

        $project = $this->makeProject([
            'management_status' => ProjectManagementStatus::InProgress,
            'priority' => Priority::Urgent,
            'manager_id' => $manager->id,
            'progress' => 45,
            'start_date' => '2026-01-01',
            'due_date' => '2026-12-31',
            'external_links' => [
                ['label' => 'Figma', 'url' => 'https://figma.com/example'],
            ],
        ]);

        $this->assertSame(ProjectManagementStatus::InProgress, $project->management_status);
        $this->assertSame(Priority::Urgent, $project->priority);
        $this->assertSame(45, $project->progress);
        $this->assertTrue($project->manager->is($manager));
        $this->assertSame('Figma', $project->external_links[0]['label']);
    }

    public function test_project_can_be_edited(): void
    {
        $project = $this->makeProject();

        $project->update([
            'management_status' => ProjectManagementStatus::Review,
            'progress' => 80,
        ]);

        $project->refresh();

        $this->assertSame(ProjectManagementStatus::Review, $project->management_status);
        $this->assertSame(80, $project->progress);
    }

    public function test_manager_relationship_resolves_to_user(): void
    {
        $manager = User::create([
            'name' => 'Victor',
            'email' => 'victor@example.com',
            'password' => 'password',
        ]);

        $project = $this->makeProject(['manager_id' => $manager->id]);

        $this->assertInstanceOf(User::class, $project->manager);
        $this->assertSame('Victor', $project->manager->name);

        $this->assertTrue($manager->managedProjects->contains($project));
    }

    public function test_progress_is_clamped_between_zero_and_hundred(): void
    {
        $over = $this->makeProject(['progress' => 150]);
        $under = $this->makeProject(['progress' => -20]);

        $this->assertSame(100, $over->progress);
        $this->assertSame(0, $under->progress);
    }

    public function test_project_is_overdue_when_due_date_has_passed_and_not_final(): void
    {
        $project = $this->makeProject([
            'due_date' => now()->subDay(),
            'management_status' => ProjectManagementStatus::InProgress,
        ]);

        $this->assertTrue($project->isOverdue());
    }

    public function test_project_is_not_overdue_when_completed_even_if_due_date_passed(): void
    {
        $project = $this->makeProject([
            'due_date' => now()->subDay(),
            'management_status' => ProjectManagementStatus::Completed,
        ]);

        $this->assertFalse($project->isOverdue());
    }

    public function test_project_is_not_overdue_without_due_date(): void
    {
        $project = $this->makeProject(['due_date' => null]);

        $this->assertFalse($project->isOverdue());
    }

    public function test_project_is_not_overdue_when_due_date_in_the_future(): void
    {
        $project = $this->makeProject([
            'due_date' => now()->addWeek(),
            'management_status' => ProjectManagementStatus::InProgress,
        ]);

        $this->assertFalse($project->isOverdue());
    }

    public function test_overdue_scope_only_returns_overdue_projects(): void
    {
        $overdue = $this->makeProject([
            'due_date' => now()->subDay(),
            'management_status' => ProjectManagementStatus::InProgress,
        ]);
        $this->makeProject([
            'due_date' => now()->subDay(),
            'management_status' => ProjectManagementStatus::Completed,
        ]);
        $this->makeProject([
            'due_date' => now()->addWeek(),
            'management_status' => ProjectManagementStatus::InProgress,
        ]);
        $this->makeProject(['due_date' => null]);

        $results = Project::overdue()->get();

        $this->assertCount(1, $results);
        $this->assertTrue($results->first()->is($overdue));
    }

    public function test_user_without_admin_role_cannot_access_panel(): void
    {
        $user = User::create([
            'name' => 'Sem acesso',
            'email' => 'sem-acesso@example.com',
            'password' => 'password',
        ]);

        $panel = \Filament\Facades\Filament::getPanel('admin');

        $this->assertFalse($user->canAccessPanel($panel));
    }

    public function test_user_with_admin_role_can_access_panel(): void
    {
        Role::firstOrCreate(['name' => 'Admin']);

        $user = User::create([
            'name' => 'Com acesso',
            'email' => 'com-acesso@example.com',
            'password' => 'password',
        ]);
        $user->assignRole('Admin');

        $panel = \Filament\Facades\Filament::getPanel('admin');

        $this->assertTrue($user->canAccessPanel($panel));
    }
}
