<?php

namespace Tests\Feature;

use App\Enums\Priority;
use App\Enums\ProjectManagementStatus;
use App\Enums\TaskStatus;
use App\Filament\Resources\Projects\Pages\ProjectOverview;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class ProjectOverviewTest extends TestCase
{
    use RefreshDatabase;

    private function actingAsAdmin(): User
    {
        Role::firstOrCreate(['name' => 'Admin']);

        $user = User::create([
            'name' => 'Admin de Teste',
            'email' => 'admin-teste@example.com',
            'password' => 'password',
        ]);
        $user->assignRole('Admin');

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

    public function test_stats_match_task_counts_by_status(): void
    {
        $this->actingAsAdmin();
        $project = $this->makeProject();

        for ($i = 0; $i < 7; $i++) {
            Task::create(['project_id' => $project->id, 'title' => "Concluída $i", 'status' => TaskStatus::Completed]);
        }
        Task::create(['project_id' => $project->id, 'title' => 'Em andamento', 'status' => TaskStatus::InProgress]);
        Task::create(['project_id' => $project->id, 'title' => 'Em revisão', 'status' => TaskStatus::Review]);
        Task::create(['project_id' => $project->id, 'title' => 'Atrasada', 'status' => TaskStatus::Todo, 'due_date' => now()->subWeek()]);

        $stats = Livewire::test(ProjectOverview::class, ['record' => $project->getKey()])
            ->instance()
            ->getStats();

        $this->assertSame(10, $stats['total']);
        $this->assertSame(7, $stats['completed']);
        $this->assertSame(1, $stats['in_progress']);
        $this->assertSame(1, $stats['review']);
        $this->assertSame(1, $stats['overdue']);
    }

    public function test_stats_are_all_zero_without_tasks(): void
    {
        $this->actingAsAdmin();
        $project = $this->makeProject();

        $stats = Livewire::test(ProjectOverview::class, ['record' => $project->getKey()])
            ->instance()
            ->getStats();

        $this->assertSame(['total' => 0, 'completed' => 0, 'in_progress' => 0, 'review' => 0, 'overdue' => 0], $stats);
    }

    public function test_completed_overdue_tasks_are_not_counted_as_overdue(): void
    {
        $this->actingAsAdmin();
        $project = $this->makeProject();

        Task::create([
            'project_id' => $project->id,
            'title' => 'Concluída no prazo estourado',
            'status' => TaskStatus::Completed,
            'due_date' => now()->subWeek(),
        ]);

        $stats = Livewire::test(ProjectOverview::class, ['record' => $project->getKey()])
            ->instance()
            ->getStats();

        $this->assertSame(0, $stats['overdue']);
    }

    public function test_overview_page_renders_with_project_details(): void
    {
        $this->actingAsAdmin();
        $manager = User::create(['name' => 'Maciel', 'email' => 'maciel@example.com', 'password' => 'password']);
        $project = $this->makeProject([
            'management_status' => ProjectManagementStatus::InProgress,
            'priority' => Priority::High,
            'manager_id' => $manager->id,
            'due_date' => '2026-09-30',
            'progress' => 72,
        ]);

        $response = $this->get("/admin/projects/{$project->id}");

        $response->assertStatus(200);
        $response->assertSee($project->title);
        $response->assertSee('Em andamento');
        $response->assertSee('Alta');
        $response->assertSee('Maciel');
        $response->assertSee('72%');
    }

    public function test_overview_page_requires_authentication(): void
    {
        $project = $this->makeProject();

        $response = $this->get("/admin/projects/{$project->id}");

        $response->assertRedirect();
    }
}
