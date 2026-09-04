<?php

namespace Tests\Feature;

use App\Enums\Priority;
use App\Enums\ProjectManagementStatus;
use App\Enums\TaskStatus;
use App\Filament\Pages\MyTasks;
use App\Filament\Widgets\ProjectsNeedingAttentionWidget;
use App\Filament\Widgets\ProjectsOverview;
use App\Filament\Widgets\TasksOverview;
use App\Filament\Widgets\UpcomingDeadlinesWidget;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use ReflectionMethod;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class DashboardWidgetsTest extends TestCase
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
            'title' => 'Projeto '.uniqid(),
            'slug' => 'projeto-'.uniqid(),
            'short_description' => 'Descrição curta',
            'description' => 'Descrição completa',
            'category' => 'Sistema Web',
            'status' => 'draft',
        ], $overrides));
    }

    private function statValues(object $widget): array
    {
        $method = new ReflectionMethod($widget, 'getStats');
        $method->setAccessible(true);

        return array_map(fn ($stat) => $stat->getValue(), $method->invoke($widget));
    }

    public function test_projects_overview_counts_by_management_status_and_overdue(): void
    {
        $this->actingAsAdmin();

        $this->makeProject(['management_status' => ProjectManagementStatus::Planning]);
        $this->makeProject(['management_status' => ProjectManagementStatus::Planning]);
        $this->makeProject(['management_status' => ProjectManagementStatus::InProgress]);
        $this->makeProject(['management_status' => ProjectManagementStatus::Review]);
        $this->makeProject(['management_status' => ProjectManagementStatus::Completed]);
        $this->makeProject([
            'management_status' => ProjectManagementStatus::InProgress,
            'due_date' => now()->subDay(),
        ]);

        [$total, $planning, $inProgress, $review, $overdue, $completed] = $this->statValues(new ProjectsOverview);

        $this->assertSame(6, $total);
        $this->assertSame(2, $planning);
        $this->assertSame(2, $inProgress);
        $this->assertSame(1, $review);
        $this->assertSame(1, $overdue);
        $this->assertSame(1, $completed);
    }

    public function test_tasks_overview_counts_by_status_and_overdue(): void
    {
        $this->actingAsAdmin();
        $project = $this->makeProject();

        Task::create(['project_id' => $project->id, 'title' => 'A', 'status' => TaskStatus::Todo]);
        Task::create(['project_id' => $project->id, 'title' => 'B', 'status' => TaskStatus::InProgress]);
        Task::create(['project_id' => $project->id, 'title' => 'C', 'status' => TaskStatus::Review]);
        Task::create(['project_id' => $project->id, 'title' => 'D', 'status' => TaskStatus::Completed]);
        Task::create(['project_id' => $project->id, 'title' => 'E', 'status' => TaskStatus::Todo, 'due_date' => now()->subDay()]);

        [$pending, $inProgress, $review, $overdue, $completed] = $this->statValues(new TasksOverview);

        $this->assertSame(2, $pending);
        $this->assertSame(1, $inProgress);
        $this->assertSame(1, $review);
        $this->assertSame(1, $overdue);
        $this->assertSame(1, $completed);
    }

    public function test_my_tasks_page_only_shows_pending_tasks_assigned_to_current_user(): void
    {
        $user = $this->actingAsAdmin();
        $otherUser = User::create(['name' => 'Outro', 'email' => 'outro@example.com', 'password' => 'password']);
        $project = $this->makeProject();

        $mine = Task::create(['project_id' => $project->id, 'title' => 'Minha tarefa', 'assigned_to' => $user->id]);
        Task::create(['project_id' => $project->id, 'title' => 'Tarefa de outro', 'assigned_to' => $otherUser->id]);
        Task::create(['project_id' => $project->id, 'title' => 'Minha tarefa concluída', 'assigned_to' => $user->id, 'status' => TaskStatus::Completed]);

        Livewire::test(MyTasks::class)
            ->assertCanSeeTableRecords([$mine])
            ->assertCountTableRecords(1);
    }

    public function test_my_tasks_prioritizes_overdue_then_due_soon_then_priority(): void
    {
        $user = $this->actingAsAdmin();
        $project = $this->makeProject();

        $noDueDate = Task::create(['project_id' => $project->id, 'title' => 'Sem prazo', 'assigned_to' => $user->id, 'priority' => Priority::Urgent]);
        $overdue = Task::create(['project_id' => $project->id, 'title' => 'Atrasada', 'assigned_to' => $user->id, 'due_date' => now()->subWeek(), 'priority' => Priority::Low]);
        $dueSoon = Task::create(['project_id' => $project->id, 'title' => 'Vencendo em breve', 'assigned_to' => $user->id, 'due_date' => now()->addDay(), 'priority' => Priority::Low]);

        $records = Task::query()->assignedTo($user->id)->pending()->prioritized()->get();

        $this->assertTrue($records[0]->is($overdue));
        $this->assertTrue($records[1]->is($dueSoon));
        $this->assertTrue($records[2]->is($noDueDate));
    }

    public function test_can_complete_a_task_from_my_tasks_page(): void
    {
        $user = $this->actingAsAdmin();
        $project = $this->makeProject();
        $task = Task::create(['project_id' => $project->id, 'title' => 'Tarefa', 'assigned_to' => $user->id]);

        Livewire::test(MyTasks::class)
            ->callTableAction('complete', $task);

        $this->assertSame(TaskStatus::Completed, $task->fresh()->status);
    }

    public function test_upcoming_deadlines_includes_projects_and_tasks_within_window_sorted(): void
    {
        $this->actingAsAdmin();

        $projectSoon = $this->makeProject([
            'due_date' => now()->addDays(10),
            'management_status' => ProjectManagementStatus::InProgress,
        ]);
        $this->makeProject([
            'due_date' => now()->addDays(30),
            'management_status' => ProjectManagementStatus::InProgress,
        ]);
        $this->makeProject([
            'due_date' => now()->subDay(),
            'management_status' => ProjectManagementStatus::InProgress,
        ]);

        $projectForTask = $this->makeProject();
        $taskSoon = Task::create([
            'project_id' => $projectForTask->id,
            'title' => 'Tarefa próxima',
            'due_date' => now()->addDays(2),
        ]);

        $items = (new UpcomingDeadlinesWidget)->getUpcoming();

        $this->assertCount(2, $items);
        $this->assertSame('Tarefa', $items[0]['type']);
        $this->assertSame($taskSoon->title, $items[0]['title']);
        $this->assertSame('Projeto', $items[1]['type']);
        $this->assertSame($projectSoon->title, $items[1]['title']);
    }

    public function test_projects_needing_attention_flags_overdue_project(): void
    {
        $this->actingAsAdmin();
        $project = $this->makeProject([
            'due_date' => now()->subDay(),
            'management_status' => ProjectManagementStatus::InProgress,
        ]);

        $entries = (new ProjectsNeedingAttentionWidget)->getProjects();

        $this->assertCount(1, $entries);
        $this->assertContains('Projeto atrasado', $entries[0]['reasons']);
    }

    public function test_projects_needing_attention_flags_project_with_overdue_tasks(): void
    {
        $this->actingAsAdmin();
        $project = $this->makeProject();
        Task::create(['project_id' => $project->id, 'title' => 'Atrasada', 'due_date' => now()->subDay()]);

        $entries = (new ProjectsNeedingAttentionWidget)->getProjects();

        $this->assertCount(1, $entries);
        $this->assertContains('Tem tarefas atrasadas', $entries[0]['reasons']);
    }

    public function test_projects_needing_attention_flags_urgent_priority(): void
    {
        $this->actingAsAdmin();
        $this->makeProject(['priority' => Priority::Urgent]);

        $entries = (new ProjectsNeedingAttentionWidget)->getProjects();

        $this->assertCount(1, $entries);
        $this->assertContains('Prioridade urgente', $entries[0]['reasons']);
    }

    public function test_projects_needing_attention_flags_near_deadline_with_low_progress(): void
    {
        $this->actingAsAdmin();
        $project = $this->makeProject([
            'due_date' => now()->addDays(3),
            'progress' => 20,
            'management_status' => ProjectManagementStatus::InProgress,
        ]);

        $entries = (new ProjectsNeedingAttentionWidget)->getProjects();

        $this->assertCount(1, $entries);
        $this->assertContains('Prazo próximo com baixo progresso', $entries[0]['reasons']);
    }

    public function test_projects_needing_attention_ignores_healthy_projects(): void
    {
        $this->actingAsAdmin();
        $this->makeProject([
            'due_date' => now()->addMonth(),
            'progress' => 80,
            'priority' => Priority::Medium,
            'management_status' => ProjectManagementStatus::InProgress,
        ]);

        $entries = (new ProjectsNeedingAttentionWidget)->getProjects();

        $this->assertCount(0, $entries);
    }

    public function test_projects_needing_attention_ignores_completed_and_archived_projects(): void
    {
        $this->actingAsAdmin();
        $this->makeProject([
            'due_date' => now()->subMonth(),
            'management_status' => ProjectManagementStatus::Completed,
        ]);
        $this->makeProject([
            'priority' => Priority::Urgent,
            'management_status' => ProjectManagementStatus::Archived,
        ]);

        $entries = (new ProjectsNeedingAttentionWidget)->getProjects();

        $this->assertCount(0, $entries);
    }
}
