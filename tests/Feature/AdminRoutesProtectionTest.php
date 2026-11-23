<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class AdminRoutesProtectionTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @return array<string, array{string}>
     */
    public static function adminUrls(): array
    {
        return [
            'dashboard' => ['/admin'],
            'projetos' => ['/admin/projects'],
            'kanban' => ['/admin/projects/1/kanban'],
            'ctas' => ['/admin/ctas'],
            'contatos' => ['/admin/contact-submissions'],
            'mensagens' => ['/admin/messages'],
            'usuarios' => ['/admin/users'],
            'configuracoes' => ['/admin/settings'],
        ];
    }

    #[DataProvider('adminUrls')]
    public function test_guests_are_redirected_to_the_admin_login(string $url): void
    {
        $this->get($url)->assertRedirect('/admin/login');
    }

    public function test_login_page_is_publicly_reachable(): void
    {
        $this->get('/admin/login')->assertOk();
    }
}
