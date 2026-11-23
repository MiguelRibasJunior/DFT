<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
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
