<?php

namespace Tests\Feature;

use App\Filament\Resources\Projects\Pages\ListProjects;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class ProjectReorderTest extends TestCase
{
    use RefreshDatabase;

    private function makeProject(string $title, int $order): Project
    {
        return Project::create([
            'title' => $title,
            'slug' => str($title)->slug().'-'.uniqid(),
            'short_description' => 'Descrição curta',
            'description' => 'Descrição completa',
            'category' => 'Sistema Web',
            'status' => 'published',
            'featured' => true,
            'order' => $order,
        ]);
    }

    public function test_dragging_projects_in_the_table_updates_their_order_and_the_public_api(): void
    {
        Role::firstOrCreate(['name' => 'Admin']);
        $user = User::create(['name' => 'Admin', 'email' => 'a@example.com', 'password' => 'password']);
        $user->assignRole('Admin');
        $this->actingAs($user);

        $a = $this->makeProject('Alpha', 1);
        $b = $this->makeProject('Beta', 2);
        $c = $this->makeProject('Gamma', 3);

        Livewire::test(ListProjects::class)
            ->assertSuccessful()
            ->call('reorderTable', [$c->id, $a->id, $b->id]);

        $this->assertSame(
            ['Gamma', 'Alpha', 'Beta'],
            Project::orderBy('order')->pluck('title')->all(),
        );

        $this->getJson('/api/projects')
            ->assertOk()
            ->assertJsonPath('data.0.title', 'Gamma')
            ->assertJsonPath('data.2.title', 'Beta');
    }
}
