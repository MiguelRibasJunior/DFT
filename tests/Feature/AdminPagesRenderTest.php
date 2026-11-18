<?php

namespace Tests\Feature;

use App\Models\Cta;
use App\Models\ContactLink;
use App\Models\ContactSubmission;
use App\Models\Message;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\DataProvider;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

/**
 * Abre cada tela do painel como um usuário logado, com um registro de cada
 * tipo, para pegar erros 500 que os testes de componente isolados não pegam.
 */
class AdminPagesRenderTest extends TestCase
{
    use RefreshDatabase;

    private array $ids = [];

    protected function setUp(): void
    {
        parent::setUp();

        foreach (['Super Admin', 'Admin', 'Editor'] as $role) {
            Role::firstOrCreate(['name' => $role]);
        }

        $user = User::create(['name' => 'Admin', 'email' => 'admin@example.com', 'password' => 'password']);
        $user->assignRole('Super Admin');
        $this->actingAs($user);

        $project = Project::create([
            'title' => 'Projeto', 'slug' => 'projeto', 'short_description' => 'Curta',
            'description' => 'Completa', 'category' => 'Web', 'status' => 'published', 'featured' => true,
        ]);
        Task::create(['project_id' => $project->id, 'title' => 'Tarefa', 'assigned_to' => $user->id]);

        $this->ids = [
            'project' => $project->id,
            'user' => $user->id,
            'cta' => Cta::create([
                'name' => 'CTA', 'title' => 'T', 'button_text' => 'B', 'button_url' => '#contato',
                'position' => 'cta_section', 'active' => true, 'order' => 0,
            ])->id,
            'link' => ContactLink::create(['type' => 'email', 'label' => 'E-mail', 'value' => 'a@b.com'])->id,
            'submission' => ContactSubmission::create([
                'nome' => 'N', 'email' => 'n@e.com', 'telefone' => '11999999999',
                'tipo_solucao' => 'Site', 'descricao' => 'D', 'status' => 'nova',
            ])->id,
            'message' => Message::create([
                'sender_name' => 'S', 'sender_email' => 's@e.com', 'subject' => 'Assunto', 'body' => 'Corpo',
            ])->id,
        ];
    }

    /**
     * @return array<string, array{string}>
     */
    public static function screens(): array
    {
        return [
            'dashboard' => ['/admin'],
            'projetos: lista' => ['/admin/projects'],
            'projetos: criar' => ['/admin/projects/create'],
            'projetos: visão geral' => ['/admin/projects/{project}'],
            'projetos: editar' => ['/admin/projects/{project}/edit'],
            'projetos: kanban' => ['/admin/projects/{project}/kanban'],
            'minhas tarefas' => ['/admin/my-tasks'],
            'ctas: lista' => ['/admin/ctas'],
            'ctas: criar' => ['/admin/ctas/create'],
            'ctas: editar' => ['/admin/ctas/{cta}/edit'],
            'canais: lista' => ['/admin/contact-links'],
            'canais: criar' => ['/admin/contact-links/create'],
            'canais: editar' => ['/admin/contact-links/{link}/edit'],
            'contatos: lista' => ['/admin/contact-submissions'],
            'contatos: detalhes' => ['/admin/contact-submissions/{submission}/edit'],
            'mensagens: lista' => ['/admin/messages'],
            'mensagens: criar' => ['/admin/messages/create'],
            'mensagens: editar' => ['/admin/messages/{message}/edit'],
            'usuarios: lista' => ['/admin/users'],
            'usuarios: criar' => ['/admin/users/create'],
            'usuarios: editar' => ['/admin/users/{user}/edit'],
            'configuracoes' => ['/admin/settings'],
            'rodape' => ['/admin/footer'],
        ];
    }

    #[DataProvider('screens')]
    public function test_screen_renders_for_a_logged_in_admin(string $url): void
    {
        foreach ($this->ids as $key => $id) {
            $url = str_replace('{'.$key.'}', (string) $id, $url);
        }

        $this->get($url)->assertOk();
    }
}
