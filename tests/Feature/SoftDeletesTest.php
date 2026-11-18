<?php

namespace Tests\Feature;

use App\Filament\Resources\ContactSubmissions\Pages\ListContactSubmissions;
use App\Filament\Resources\Messages\Pages\ListMessages;
use App\Models\ContactSubmission;
use App\Models\Message;
use App\Models\Project;
use App\Models\User;
use Database\Seeders\DemoContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

/**
 * Lixeira de projetos, mensagens e contatos (leads). O fluxo de projetos pelas telas está em
 * ProjectCrudTest; aqui ficam mensagens, contatos, a API pública e o seeder.
 */
class SoftDeletesTest extends TestCase
{
    use RefreshDatabase;

    private function actingAsRole(string $role): User
    {
        Role::firstOrCreate(['name' => $role]);

        $user = User::create(['name' => $role, 'email' => strtolower(str_replace(' ', '', $role)).'@example.com', 'password' => 'password']);
        $user->assignRole($role);
        $this->actingAs($user);

        return $user;
    }

    private function makeMessage(): Message
    {
        return Message::create([
            'sender_name' => 'Maria',
            'sender_email' => 'maria@example.com',
            'subject' => 'Orçamento',
            'body' => 'Olá!',
        ]);
    }

    private function makeLead(): ContactSubmission
    {
        return ContactSubmission::create([
            'nome' => 'João',
            'email' => 'joao@example.com',
            'telefone' => '(11) 98765-4321',
            'tipo_solucao' => 'Site',
            'descricao' => 'Quero um site.',
        ]);
    }

    // ---------------------------------------------------------------- mensagens

    public function test_deleting_a_message_sends_it_to_the_trash_and_it_can_be_restored(): void
    {
        $this->actingAsRole('Admin');
        $message = $this->makeMessage();

        Livewire::test(ListMessages::class)->callTableAction('delete', $message);
        $this->assertSoftDeleted('messages', ['id' => $message->id]);

        Livewire::test(ListMessages::class)
            ->filterTable('trashed', true)
            ->callTableAction('restore', $message);
        $this->assertNotSoftDeleted('messages', ['id' => $message->id]);
    }

    public function test_only_super_admin_deletes_a_message_permanently(): void
    {
        $admin = $this->actingAsRole('Admin');
        $message = $this->makeMessage();
        $message->delete();

        $this->assertTrue($admin->can('restore', $message));
        $this->assertFalse($admin->can('forceDelete', $message));

        $super = $this->actingAsRole('Super Admin');
        $this->assertTrue($super->can('forceDelete', $message));
    }

    // ------------------------------------------------------------------ contatos

    public function test_deleting_a_lead_sends_it_to_the_trash_and_it_can_be_restored(): void
    {
        $this->actingAsRole('Admin');
        $lead = $this->makeLead();

        Livewire::test(ListContactSubmissions::class)->callTableAction('delete', $lead);
        $this->assertSoftDeleted('contact_submissions', ['id' => $lead->id]);

        Livewire::test(ListContactSubmissions::class)
            ->filterTable('trashed', true)
            ->callTableAction('restore', $lead);
        $this->assertNotSoftDeleted('contact_submissions', ['id' => $lead->id]);
    }

    public function test_editor_cannot_restore_or_force_delete_a_lead(): void
    {
        $editor = $this->actingAsRole('Editor');
        $lead = $this->makeLead();
        $lead->delete();

        $this->assertFalse($editor->can('restore', $lead));
        $this->assertFalse($editor->can('forceDelete', $lead));
    }

    // --------------------------------------------------------- site público e seeder

    public function test_a_trashed_project_disappears_from_the_public_api_and_comes_back_when_restored(): void
    {
        $project = Project::create([
            'title' => 'Projeto Público',
            'slug' => 'projeto-publico',
            'short_description' => 'Descrição curta',
            'description' => 'Descrição completa',
            'category' => 'Sistema Web',
            'status' => 'published',
            'featured' => true,
            'order' => 0,
        ]);

        $this->getJson('/api/projects')->assertJsonCount(1, 'data');

        $project->delete();
        $this->getJson('/api/projects')->assertJsonCount(0, 'data');

        $project->restore();
        $this->getJson('/api/projects')->assertJsonCount(1, 'data');
    }

    public function test_the_demo_seeder_restores_a_trashed_demo_project_instead_of_failing_on_the_unique_slug(): void
    {
        $this->app->make(DemoContentSeeder::class)->run();
        $demo = Project::where('slug', 'aplicativo-personalizado')->firstOrFail();
        $demo->delete();

        $this->app->make(DemoContentSeeder::class)->run();

        $this->assertNotSoftDeleted('projects', ['slug' => 'aplicativo-personalizado']);
        $this->assertSame(3, Project::count());
    }
}
