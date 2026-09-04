<?php

namespace Tests\Feature;

use App\Enums\TaskStatus;
use App\Filament\Resources\Projects\Pages\ProjectKanban;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class ProjectKanbanTest extends TestCase
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

    private function makeProject(): Project
    {
        return Project::create([
            'title' => 'Projeto de Teste',
            'slug' => 'projeto-de-teste-'.uniqid(),
            'short_description' => 'Descrição curta',
            'description' => 'Descrição completa',
            'category' => 'Sistema Web',
            'status' => 'draft',
        ]);
    }

    public function test_kanban_groups_tasks_by_status(): void
    {
        $this->actingAsAdmin();
        $project = $this->makeProject();

        $todo = Task::create(['project_id' => $project->id, 'title' => 'A', 'status' => TaskStatus::Todo]);
        $inProgress = Task::create(['project_id' => $project->id, 'title' => 'B', 'status' => TaskStatus::InProgress]);

        $component = Livewire::test(ProjectKanban::class, ['record' => $project->getKey()]);

        $columns = $component->instance()->getColumns();

        $this->assertTrue($columns['todo']['tasks']->contains($todo));
        $this->assertTrue($columns['in_progress']['tasks']->contains($inProgress));
        $this->assertCount(0, $columns['review']['tasks']);
        $this->assertCount(0, $columns['completed']['tasks']);
    }

    public function test_move_task_updates_status_and_appends_position_at_end_of_target_column(): void
    {
        $this->actingAsAdmin();
        $project = $this->makeProject();

        Task::create(['project_id' => $project->id, 'title' => 'Existing', 'status' => TaskStatus::InProgress, 'position' => 0]);
        $task = Task::create(['project_id' => $project->id, 'title' => 'Moving', 'status' => TaskStatus::Todo]);

        Livewire::test(ProjectKanban::class, ['record' => $project->getKey()])
            ->call('moveTask', $task->id, 'in_progress');

        $task->refresh();
        $this->assertSame(TaskStatus::InProgress, $task->status);
        $this->assertSame(1, $task->position);
    }

    public function test_move_task_sets_completed_at_when_moved_to_completed_column(): void
    {
        $this->actingAsAdmin();
        $project = $this->makeProject();
        $task = Task::create(['project_id' => $project->id, 'title' => 'Task', 'status' => TaskStatus::Todo]);

        Livewire::test(ProjectKanban::class, ['record' => $project->getKey()])
            ->call('moveTask', $task->id, 'completed');

        $task->refresh();
        $this->assertSame(TaskStatus::Completed, $task->status);
        $this->assertNotNull($task->completed_at);
    }

    public function test_move_task_clears_completed_at_when_moved_away_from_completed(): void
    {
        $this->actingAsAdmin();
        $project = $this->makeProject();
        $task = Task::create([
            'project_id' => $project->id,
            'title' => 'Task',
            'status' => TaskStatus::Completed,
            'completed_at' => now(),
        ]);

        Livewire::test(ProjectKanban::class, ['record' => $project->getKey()])
            ->call('moveTask', $task->id, 'review');

        $task->refresh();
        $this->assertSame(TaskStatus::Review, $task->status);
        $this->assertNull($task->completed_at);
    }

    public function test_move_task_ignores_invalid_status(): void
    {
        $this->actingAsAdmin();
        $project = $this->makeProject();
        $task = Task::create(['project_id' => $project->id, 'title' => 'Task', 'status' => TaskStatus::Todo]);

        Livewire::test(ProjectKanban::class, ['record' => $project->getKey()])
            ->call('moveTask', $task->id, 'not-a-real-status');

        $task->refresh();
        $this->assertSame(TaskStatus::Todo, $task->status);
    }

    public function test_move_task_ignores_task_belonging_to_another_project(): void
    {
        $this->actingAsAdmin();
        $project = $this->makeProject();
        $otherProject = $this->makeProject();
        $foreignTask = Task::create(['project_id' => $otherProject->id, 'title' => 'Foreign', 'status' => TaskStatus::Todo]);

        Livewire::test(ProjectKanban::class, ['record' => $project->getKey()])
            ->call('moveTask', $foreignTask->id, 'completed');

        $foreignTask->refresh();
        $this->assertSame(TaskStatus::Todo, $foreignTask->status);
    }

    public function test_moving_a_task_recalculates_project_progress(): void
    {
        $this->actingAsAdmin();
        $project = $this->makeProject();
        $task = Task::create(['project_id' => $project->id, 'title' => 'A', 'status' => TaskStatus::Todo]);
        Task::create(['project_id' => $project->id, 'title' => 'B', 'status' => TaskStatus::Completed]);

        $this->assertSame(50, $project->fresh()->progress);

        Livewire::test(ProjectKanban::class, ['record' => $project->getKey()])
            ->call('moveTask', $task->id, 'completed');

        $this->assertSame(100, $project->fresh()->progress);
    }
}
