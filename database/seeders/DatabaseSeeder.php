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

        $admin = User::firstOrCreate(
            ['email' => env('ADMIN_EMAIL', 'admin@devsfromtomorrow.com')],
            [
                'name' => 'Administrador',
                'password' => env('VITE_ADMIN_PASSWORD', 'dft2026admin'),
            ]
        );

        if (! $admin->hasRole('Super Admin')) {
            $admin->assignRole('Super Admin');
        }
    }
}
