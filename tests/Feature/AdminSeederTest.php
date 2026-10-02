<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Env;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminSeederTest extends TestCase
{
    use RefreshDatabase;

    protected function tearDown(): void
    {
        Env::getRepository()->clear('ADMIN_EMAIL');
        Env::getRepository()->clear('ADMIN_PASSWORD');

        parent::tearDown();
    }

    public function test_seeder_creates_super_admin_with_password_from_env(): void
    {
        Env::getRepository()->set('ADMIN_EMAIL', 'dono@exemplo.com');
        Env::getRepository()->set('ADMIN_PASSWORD', 'senha-forte-123');

        $this->seed(DatabaseSeeder::class);

        $admin = User::where('email', 'dono@exemplo.com')->first();

        $this->assertNotNull($admin);
        $this->assertTrue(Hash::check('senha-forte-123', $admin->password));
        $this->assertTrue($admin->hasRole('Super Admin'));
        $this->assertTrue($admin->canAccessPanel(\Filament\Facades\Filament::getPanel('admin')));
    }

    public function test_seeder_refuses_to_create_admin_in_production_without_password(): void
    {
        Env::getRepository()->clear('ADMIN_PASSWORD');
        $this->app['env'] = 'production';

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('ADMIN_PASSWORD');

        $this->app->make(DatabaseSeeder::class)->run();
    }

    public function test_seeder_is_idempotent_and_does_not_reset_an_existing_admin_password(): void
    {
        Env::getRepository()->set('ADMIN_EMAIL', 'dono@exemplo.com');
        Env::getRepository()->set('ADMIN_PASSWORD', 'primeira-senha');
        $this->seed(DatabaseSeeder::class);

        Env::getRepository()->set('ADMIN_PASSWORD', 'outra-senha');
        $this->seed(DatabaseSeeder::class);

        $this->assertSame(1, User::where('email', 'dono@exemplo.com')->count());
        $this->assertTrue(Hash::check('primeira-senha', User::where('email', 'dono@exemplo.com')->first()->password));
    }
}
