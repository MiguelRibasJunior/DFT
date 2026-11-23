<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /** Senhas que aparecem no repositório; nunca aceitas em produção. */
    private const WEAK_PASSWORDS = ['admin123', 'dft2026admin', 'alterar_para_senha_segura_no_env', 'password', 'senha123'];

    public function run(): void
    {
        foreach (['Super Admin', 'Admin', 'Editor'] as $role) {
            Role::firstOrCreate(['name' => $role]);
        }

        $password = env('ADMIN_PASSWORD');

        if (blank($password)) {
            if (app()->isProduction()) {
                throw new \RuntimeException('Defina ADMIN_PASSWORD no .env antes de rodar o seeder em produção.');
            }

            $password = 'dft2026admin';
        }

        // Em produção, nada de senha de exemplo ou curta: os valores abaixo estão em arquivos
        // públicos do repositório (.env.example, README, seeder) e seriam o primeiro palpite de qualquer atacante.
        if (app()->isProduction() && (strlen($password) < 12 || in_array(strtolower($password), self::WEAK_PASSWORDS, true))) {
            throw new \RuntimeException('ADMIN_PASSWORD fraca demais para produção: use pelo menos 12 caracteres e não use senhas de exemplo.');
        }

        $admin = User::firstOrCreate(
            ['email' => env('ADMIN_EMAIL', 'admin@devsfromtomorrow.com')],
            [
                'name' => 'Administrador',
                'password' => $password,
            ]
        );

        if (! $admin->hasRole('Super Admin')) {
            $admin->assignRole('Super Admin');
        }

        // Conteúdo de exemplo só fora de produção; em produção o conteúdo é cadastrado no admin.
        if (! app()->isProduction()) {
            $this->call(DemoContentSeeder::class);
        }
    }
}
