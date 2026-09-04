<?php

namespace Tests\Feature;

use App\Enums\ProjectManagementStatus;
use App\Enums\TaskStatus;
use App\Filament\Resources\Projects\Pages\ProjectOverview;
use App\Models\Activity;
use App\Models\Comment;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class ProjectCommentsAndActivityTest extends TestCase
{
    use RefreshDatabase;

    private function actingAsAdmin(string $name = 'Admin de Teste'): User
    {
        Role::firstOrCreate(['name' => 'Admin']);

        $user = User::create([
            'name' => $name,
            'email' => strtolower(str_replace(' ', '-', $name)).'@example.com',
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

    // --- Comentários ---

    public function test_can_add_a_comment_through_the_overview_page(): void
    {
        $user = $this->actingAsAdmin();
        $project = $this->makeProject();

        Livewire::test(ProjectOverview::class, ['record' => $project->getKey()])
            ->set('newComment', 'Este projeto está indo bem.')
            ->call('addComment')
            ->assertHasNoErrors();

        $this->assertDatabaseHas('comments', [
            'project_id' => $project->id,
            'user_id' => $user->id,
            'content' => 'Este projeto está indo bem.',
        ]);
    }

    public function test_comment_content_is_required(): void
    {
        $this->actingAsAdmin();
        $project = $this->makeProject();

        Livewire::test(ProjectOverview::class, ['record' => $project->getKey()])
            ->set('newComment', '')
            ->call('addComment')
            ->assertHasErrors(['newComment' => 'required']);

        $this->assertDatabaseCount('comments', 0);
    }

    public function test_can_delete_a_comment(): void
    {
        $user = $this->actingAsAdmin();
        $project = $this->makeProject();
        $comment = Comment::create(['project_id' => $project->id, 'user_id' => $user->id, 'content' => 'Teste']);

        Livewire::test(ProjectOverview::class, ['record' => $project->getKey()])
            ->call('deleteComment', $comment->id);

        $this->assertDatabaseMissing('comments', ['id' => $comment->id]);
    }

    public function test_cannot_delete_a_comment_belonging_to_another_project(): void
    {
        $user = $this->actingAsAdmin();
        $project = $this->makeProject();
        $otherProject = $this->makeProject();
        $foreignComment = Comment::create(['project_id' => $otherProject->id, 'user_id' => $user->id, 'content' => 'Teste']);

        Livewire::test(ProjectOverview::class, ['record' => $project->getKey()])
            ->call('deleteComment', $foreignComment->id);

        $this->assertDatabaseHas('comments', ['id' => $foreignComment->id]);
    }

    public function test_comments_are_ordered_most_recent_first(): void
    {
        $user = $this->actingAsAdmin();
        $project = $this->makeProject();

        $first = Comment::create(['project_id' => $project->id, 'user_id' => $user->id, 'content' => 'Primeiro']);
        $first->created_at = now()->subHour();
        $first->save();
        $second = Comment::create(['project_id' => $project->id, 'user_id' => $user->id, 'content' => 'Segundo']);

        $comments = Livewire::test(ProjectOverview::class, ['record' => $project->getKey()])
            ->instance()
            ->getComments();

        $this->assertTrue($comments->first()->is($second));
    }

    // --- Histórico ---

    public function test_creating_a_task_logs_an_activity(): void
    {
        $user = $this->actingAsAdmin('Maciel');
        $project = $this->makeProject();

        Task::create(['project_id' => $project->id, 'title' => 'Dashboard']);

        $this->assertDatabaseHas('activities', [
            'project_id' => $project->id,
            'user_id' => $user->id,
            'description' => 'Maciel criou a tarefa Dashboard.',
        ]);
    }

    public function test_changing_task_status_logs_an_activity(): void
    {
        $this->actingAsAdmin('Victor');
        $project = $this->makeProject();
        $task = Task::create(['project_id' => $project->id, 'title' => 'Login']);

        $task->update(['status' => TaskStatus::InProgress]);

        $this->assertDatabaseHas('activities', [
            'project_id' => $project->id,
            'description' => 'Victor alterou a tarefa Login para Em andamento.',
        ]);
    }

    public function test_completing_a_task_logs_a_specific_activity_message(): void
    {
        $this->actingAsAdmin('Maciel');
        $project = $this->makeProject();
        $task = Task::create(['project_id' => $project->id, 'title' => 'Banco de Dados']);

        $task->moveToStatus(TaskStatus::Completed);

        $this->assertDatabaseHas('activities', [
            'project_id' => $project->id,
            'description' => 'Maciel concluiu a tarefa Banco de Dados.',
        ]);
    }

    public function test_deleting_a_task_logs_an_activity(): void
    {
        $this->actingAsAdmin('Maciel');
        $project = $this->makeProject();
        $task = Task::create(['project_id' => $project->id, 'title' => 'Tarefa X']);

        $task->delete();

        $this->assertDatabaseHas('activities', [
            'project_id' => $project->id,
            'description' => 'Maciel excluiu a tarefa Tarefa X.',
        ]);
    }

    public function test_changing_project_due_date_logs_an_activity(): void
    {
        $this->actingAsAdmin();
        $project = $this->makeProject();

        $project->update(['due_date' => '2026-09-30']);

        $this->assertDatabaseHas('activities', [
            'project_id' => $project->id,
            'description' => 'Prazo do projeto alterado para 30/09/2026.',
        ]);
    }

    public function test_changing_project_management_status_logs_an_activity(): void
    {
        $this->actingAsAdmin();
        $project = $this->makeProject();

        $project->update(['management_status' => ProjectManagementStatus::Review]);

        $this->assertDatabaseHas('activities', [
            'project_id' => $project->id,
            'description' => 'Status do projeto alterado para Em revisão.',
        ]);
    }

    public function test_unrelated_task_field_changes_do_not_log_an_activity(): void
    {
        $this->actingAsAdmin();
        $project = $this->makeProject();
        $task = Task::create(['project_id' => $project->id, 'title' => 'Tarefa']);

        $task->update(['description' => 'Nova descrição']);

        $this->assertDatabaseCount('activities', 1);
    }

    public function test_changes_without_an_authenticated_user_are_not_logged(): void
    {
        $project = $this->makeProject();

        Task::create(['project_id' => $project->id, 'title' => 'Tarefa sem usuário']);
        $project->update(['management_status' => ProjectManagementStatus::Review]);

        $this->assertDatabaseCount('activities', 0);
    }

    public function test_activities_are_ordered_most_recent_first_and_limited(): void
    {
        $this->actingAsAdmin('Maciel');
        $project = $this->makeProject();

        foreach (range(1, 25) as $i) {
            Activity::log($project->id, "Evento {$i}.");
        }

        $activities = Livewire::test(ProjectOverview::class, ['record' => $project->getKey()])
            ->instance()
            ->getActivities();

        $this->assertCount(20, $activities);
        $this->assertSame('Evento 25.', $activities->first()->description);
    }
}
