<?php

namespace Tests\Feature;

use App\Enums\Priority;
use App\Enums\ProjectManagementStatus;
use App\Enums\TaskStatus;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskManagementTest extends TestCase
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

    private function makeTask(Project $project, array $overrides = []): Task
    {
        return Task::create(array_merge([
            'project_id' => $project->id,
            'title' => 'Tarefa de teste',
        ], $overrides));
    }

    public function test_task_belongs_to_a_project(): void
    {
        $project = $this->makeProject();
        $task = $this->makeTask($project);

        $this->assertTrue($task->project->is($project));
        $this->assertTrue($project->tasks->contains($task));
    }

    public function test_task_is_created_with_default_status_and_priority(): void
    {
        $task = $this->makeTask($this->makeProject());

        $this->assertSame(TaskStatus::Todo, $task->status);
        $this->assertSame(Priority::Medium, $task->priority);
        $this->assertNull($task->assigned_to);
    }

    public function test_task_assignee_relationship_resolves_to_user(): void
    {
        $user = User::create([
            'name' => 'Victor',
            'email' => 'victor@example.com',
            'password' => 'password',
        ]);

        $task = $this->makeTask($this->makeProject(), ['assigned_to' => $user->id]);

        $this->assertInstanceOf(User::class, $task->assignee);
        $this->assertTrue($user->assignedTasks->contains($task));
    }

    public function test_task_position_auto_increments_within_the_same_project(): void
    {
        $project = $this->makeProject();

        $first = $this->makeTask($project);
        $second = $this->makeTask($project);
        $third = $this->makeTask($project);

        $this->assertSame(0, $first->position);
        $this->assertSame(1, $second->position);
        $this->assertSame(2, $third->position);
    }

    public function test_task_position_is_scoped_per_project(): void
    {
        $projectA = $this->makeProject();
        $projectB = $this->makeProject();

        $this->makeTask($projectA);
        $firstOfB = $this->makeTask($projectB);

        $this->assertSame(0, $firstOfB->position);
    }

    public function test_task_is_overdue_when_due_date_passed_and_not_completed(): void
    {
        $task = $this->makeTask($this->makeProject(), [
            'due_date' => now()->subDay(),
            'status' => TaskStatus::InProgress,
        ]);

        $this->assertTrue($task->isOverdue());
    }

    public function test_task_is_not_overdue_when_completed(): void
    {
        $task = $this->makeTask($this->makeProject(), [
            'due_date' => now()->subDay(),
            'status' => TaskStatus::Completed,
        ]);

        $this->assertFalse($task->isOverdue());
    }

    public function test_task_is_not_overdue_without_due_date(): void
    {
        $task = $this->makeTask($this->makeProject(), ['due_date' => null]);

        $this->assertFalse($task->isOverdue());
    }

    public function test_overdue_scope_only_returns_overdue_tasks(): void
    {
        $project = $this->makeProject();

        $overdue = $this->makeTask($project, ['due_date' => now()->subDay(), 'status' => TaskStatus::Todo]);
        $this->makeTask($project, ['due_date' => now()->subDay(), 'status' => TaskStatus::Completed]);
        $this->makeTask($project, ['due_date' => now()->addWeek(), 'status' => TaskStatus::Todo]);
        $this->makeTask($project, ['due_date' => null]);

        $results = Task::overdue()->get();

        $this->assertCount(1, $results);
        $this->assertTrue($results->first()->is($overdue));
    }

    public function test_deleting_a_project_cascades_to_its_tasks(): void
    {
        $project = $this->makeProject();
        $task = $this->makeTask($project);

        $project->delete();

        $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
    }

    public function test_project_progress_stays_unchanged_without_tasks(): void
    {
        $project = $this->makeProject(['progress' => 30]);

        $project->recalculateProgress();

        $this->assertSame(30, $project->fresh()->progress);
    }

    public function test_project_progress_is_calculated_from_completed_tasks(): void
    {
        $project = $this->makeProject();

        for ($i = 0; $i < 7; $i++) {
            $this->makeTask($project, ['status' => TaskStatus::Completed]);
        }
        for ($i = 0; $i < 3; $i++) {
            $this->makeTask($project, ['status' => TaskStatus::Todo]);
        }

        $this->assertSame(70, $project->fresh()->progress);
    }

    public function test_project_progress_updates_when_a_task_is_completed(): void
    {
        $project = $this->makeProject();
        $task = $this->makeTask($project, ['status' => TaskStatus::Todo]);
        $this->makeTask($project, ['status' => TaskStatus::Completed]);

        $this->assertSame(50, $project->fresh()->progress);

        $task->update(['status' => TaskStatus::Completed, 'completed_at' => now()]);

        $this->assertSame(100, $project->fresh()->progress);
    }

    public function test_project_progress_updates_when_a_task_is_deleted(): void
    {
        $project = $this->makeProject();
        $completed = $this->makeTask($project, ['status' => TaskStatus::Completed]);
        $pending = $this->makeTask($project, ['status' => TaskStatus::Todo]);

        $this->assertSame(50, $project->fresh()->progress);

        $pending->delete();

        $this->assertSame(100, $project->fresh()->progress);
    }

    public function test_project_management_status_unaffected_by_task_changes(): void
    {
        $project = $this->makeProject(['management_status' => ProjectManagementStatus::InProgress]);
        $this->makeTask($project, ['status' => TaskStatus::Completed]);

        $this->assertSame(ProjectManagementStatus::InProgress, $project->fresh()->management_status);
    }
}
