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

    public function test_production_seeding_creates_only_roles_and_the_admin_never_demo_content(): void
    {
        Env::getRepository()->set('ADMIN_EMAIL', 'dono@exemplo.com');
        Env::getRepository()->set('ADMIN_PASSWORD', 'senha-forte-123');
        $this->app['env'] = 'production';

        $this->app->make(DatabaseSeeder::class)->run();

        $this->assertSame(1, User::count());
        $this->assertSame(3, \Spatie\Permission\Models\Role::count());

        foreach (['projects', 'ctas', 'contact_links', 'messages', 'contact_submissions', 'site_settings'] as $table) {
            $this->assertDatabaseCount($table, 0);
        }
    }

    public function test_non_production_seeding_also_loads_the_demo_content(): void
    {
        $this->seed(DatabaseSeeder::class);

        $this->assertDatabaseCount('projects', 3);
        $this->assertDatabaseCount('contact_links', 5);
        $this->assertDatabaseCount('ctas', 1);
        $this->assertDatabaseCount('messages', 3);
        $this->assertNotEmpty(\App\Models\SiteSetting::current()->privacy_policy);
    }

    public function test_demo_content_can_be_loaded_on_purpose_and_is_idempotent(): void
    {
        $this->app->make(\Database\Seeders\DemoContentSeeder::class)->run();
        $this->app->make(\Database\Seeders\DemoContentSeeder::class)->run();

        $this->assertDatabaseCount('projects', 3);
        $this->assertDatabaseCount('contact_links', 5);
        $this->assertDatabaseCount('ctas', 1);
        $this->assertDatabaseCount('messages', 3);
        $this->assertDatabaseCount('users', 0);
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
