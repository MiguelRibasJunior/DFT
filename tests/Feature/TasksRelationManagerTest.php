<?php

namespace Tests\Feature;

use App\Enums\Priority;
use App\Enums\TaskStatus;
use App\Filament\Resources\Projects\Pages\EditProject;
use App\Filament\Resources\Projects\RelationManagers\TasksRelationManager;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class TasksRelationManagerTest extends TestCase
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

    public function test_relation_manager_lists_tasks_of_the_owner_project(): void
    {
        $this->actingAsAdmin();
        $project = $this->makeProject();
        $task = Task::create(['project_id' => $project->id, 'title' => 'Tarefa A']);
        $otherProject = $this->makeProject();
        Task::create(['project_id' => $otherProject->id, 'title' => 'Tarefa de outro projeto']);

        Livewire::test(TasksRelationManager::class, [
            'ownerRecord' => $project,
            'pageClass' => EditProject::class,
        ])
            ->assertCanSeeTableRecords([$task])
            ->assertCountTableRecords(1);
    }

    public function test_can_create_a_task_through_the_relation_manager(): void
    {
        $this->actingAsAdmin();
        $project = $this->makeProject();

        Livewire::test(TasksRelationManager::class, [
            'ownerRecord' => $project,
            'pageClass' => EditProject::class,
        ])
            ->callTableAction('create', data: [
                'title' => 'Nova tarefa',
                'status' => TaskStatus::Todo->value,
                'priority' => Priority::High->value,
            ])
            ->assertHasNoTableActionErrors();

        $this->assertDatabaseHas('tasks', [
            'project_id' => $project->id,
            'title' => 'Nova tarefa',
            'priority' => 'high',
        ]);
    }

    public function test_can_edit_a_task_through_the_relation_manager(): void
    {
        $this->actingAsAdmin();
        $project = $this->makeProject();
        $task = Task::create(['project_id' => $project->id, 'title' => 'Tarefa original']);

        Livewire::test(TasksRelationManager::class, [
            'ownerRecord' => $project,
            'pageClass' => EditProject::class,
        ])
            ->callTableAction('edit', $task, data: [
                'title' => 'Tarefa editada',
                'status' => TaskStatus::InProgress->value,
                'priority' => Priority::Urgent->value,
            ])
            ->assertHasNoTableActionErrors();

        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'title' => 'Tarefa editada',
            'status' => 'in_progress',
        ]);
    }

    public function test_can_complete_a_task_through_the_custom_action(): void
    {
        $this->actingAsAdmin();
        $project = $this->makeProject();
        $task = Task::create(['project_id' => $project->id, 'title' => 'Tarefa a concluir']);

        Livewire::test(TasksRelationManager::class, [
            'ownerRecord' => $project,
            'pageClass' => EditProject::class,
        ])
            ->callTableAction('complete', $task)
            ->assertHasNoTableActionErrors();

        $task->refresh();
        $this->assertSame(TaskStatus::Completed, $task->status);
        $this->assertNotNull($task->completed_at);
    }

    public function test_can_delete_a_task_through_the_relation_manager(): void
    {
        $this->actingAsAdmin();
        $project = $this->makeProject();
        $task = Task::create(['project_id' => $project->id, 'title' => 'Tarefa a excluir']);

        Livewire::test(TasksRelationManager::class, [
            'ownerRecord' => $project,
            'pageClass' => EditProject::class,
        ])
            ->callTableAction('delete', $task);

        $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
    }
}
