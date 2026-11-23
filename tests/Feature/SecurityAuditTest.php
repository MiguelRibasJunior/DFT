<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class SecurityAuditTest extends TestCase
{
    use RefreshDatabase;

    private function createUserWithRole(string $roleName): User
    {
        Role::firstOrCreate(['name' => $roleName]);
        $user = User::create([
            'name' => "Usuario {$roleName}",
            'email' => strtolower($roleName).'@devsfromtomorrow.com',
            'password' => 'secret123',
        ]);
        $user->assignRole($roleName);

        return $user;
    }

    public function test_editor_cannot_access_user_management(): void
    {
        $editor = $this->createUserWithRole('Editor');
        $this->actingAs($editor);

        $this->get('/admin/users')->assertForbidden();
        $this->get('/admin/users/create')->assertForbidden();
    }

    public function test_editor_cannot_access_site_settings(): void
    {
        $editor = $this->createUserWithRole('Editor');
        $this->actingAs($editor);

        $this->get('/admin/settings')->assertForbidden();
        $this->get('/admin/footer')->assertForbidden();
    }

    public function test_editor_cannot_delete_projects(): void
    {
        $editor = $this->createUserWithRole('Editor');
        $this->actingAs($editor);

        $project = Project::create([
            'title' => 'Projeto Audit',
            'slug' => 'projeto-audit',
            'short_description' => 'Desc curta',
            'description' => 'Desc completa',
            'category' => 'Web',
            'status' => 'published',
            'featured' => true,
        ]);

        $this->assertFalse($editor->can('delete', $project));
    }

    public function test_admin_can_access_users_and_settings(): void
    {
        $admin = $this->createUserWithRole('Admin');
        $this->actingAs($admin);

        $this->get('/admin/users')->assertOk();
        $this->get('/admin/settings')->assertOk();
        $this->get('/admin/footer')->assertOk();
    }

    public function test_unauthenticated_user_cannot_access_admin_endpoints(): void
    {
        $this->get('/admin/users')->assertRedirect('/admin/login');
        $this->get('/admin/settings')->assertRedirect('/admin/login');
        $this->get('/admin/projects')->assertRedirect('/admin/login');
    }

    public function test_api_projects_endpoint_does_not_leak_internal_management_data(): void
    {
        Project::create([
            'title' => 'Projeto Privado Teste',
            'slug' => 'projeto-privado-teste',
            'short_description' => 'Resumo público',
            'description' => 'Descrição pública',
            'category' => 'SaaS',
            'status' => 'published',
            'featured' => true,
            'client_name' => 'Cliente Confidencial',
            'client_email' => 'secreto@cliente.com',
            'client_phone' => '(11) 99999-0000',
            'budget' => 50000,
            'notes' => 'Anotações confidenciais internas da equipe.',
        ]);

        $response = $this->getJson('/api/projects')->assertOk();
        $projectData = $response->json('data.0');

        $this->assertArrayNotHasKey('client_name', $projectData);
        $this->assertArrayNotHasKey('client_email', $projectData);
        $this->assertArrayNotHasKey('client_phone', $projectData);
        $this->assertArrayNotHasKey('budget', $projectData);
        $this->assertArrayNotHasKey('notes', $projectData);
    }

    public function test_api_exceptions_in_production_do_not_leak_server_internals(): void
    {
        Route::get('/api/test-server-error', function () {
            throw new \RuntimeException('Erro interno com credenciais de banco: secret_db_pass_123');
        });

        // Simula ambiente de produção sem debug
        config(['app.debug' => false]);

        $response = $this->getJson('/api/test-server-error');

        $response->assertStatus(500);
        $response->assertJson([
            'success' => false,
            'message' => 'Ocorreu um erro interno no servidor. Tente novamente mais tarde.',
        ]);
        $this->assertStringNotContainsString('secret_db_pass_123', $response->getContent());
        $this->assertStringNotContainsString('RuntimeException', $response->getContent());
    }

    /**
     * Não existe API administrativa. Uma versão sem autenticação chegou a ir para a main
     * (listava e apagava contatos e projetos sem login); este teste impede que volte.
     *
     * @return array<string, array{string, string}>
     */
    public static function removedAdminApiRoutes(): array
    {
        return [
            'login' => ['POST', '/api/admin/login'],
            'listar contatos' => ['GET', '/api/admin/submissions'],
            'mudar status de contato' => ['PATCH', '/api/admin/submissions/1'],
            'apagar contato' => ['DELETE', '/api/admin/submissions/1'],
            'listar projetos' => ['GET', '/api/admin/projects'],
            'criar projeto' => ['POST', '/api/admin/projects'],
            'editar projeto' => ['PUT', '/api/admin/projects/1'],
            'apagar projeto' => ['DELETE', '/api/admin/projects/1'],
            'alterar configurações' => ['PUT', '/api/admin/settings'],
        ];
    }

    #[\PHPUnit\Framework\Attributes\DataProvider('removedAdminApiRoutes')]
    public function test_there_is_no_administrative_api_and_it_never_exposes_data_without_login(string $method, string $uri): void
    {
        \App\Models\ContactSubmission::create([
            'nome' => 'Visitante', 'email' => 'v@exemplo.com', 'telefone' => '(11) 98765-4321',
            'tipo_solucao' => 'Site', 'descricao' => 'Dado pessoal que não pode vazar.',
        ]);

        $response = $this->json($method, $uri, []);

        // 404 (GET, pela página de erro) ou 405 (demais métodos, pela rota-fallback que só atende GET):
        // o que importa é que nenhuma ação exista e nada seja devolvido ou alterado.
        $this->assertContains($response->getStatusCode(), [404, 405]);
        $this->assertStringNotContainsString('v@exemplo.com', $response->getContent());
        $this->assertDatabaseCount('contact_submissions', 1);
    }

    public function test_no_route_under_api_admin_is_registered(): void
    {
        $registered = collect(\Illuminate\Support\Facades\Route::getRoutes()->getRoutes())
            ->map(fn ($route) => $route->uri())
            ->filter(fn (string $uri) => str_starts_with($uri, 'api/admin'));

        $this->assertCount(0, $registered, 'Rotas /api/admin/* não devem existir: o admin é o Filament.');
    }
}
