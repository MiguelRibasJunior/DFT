<?php

namespace Tests\Feature;

use App\Filament\Resources\Projects\Pages\EditProject;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Livewire\Livewire;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class ProjectImageUploadTest extends TestCase
{
    use RefreshDatabase;

    private function fakePng(string $name): UploadedFile
    {
        $png = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');

        return UploadedFile::fake()->createWithContent($name, $png);
    }

    private function project(): Project
    {
        Role::firstOrCreate(['name' => 'Admin']);
        $user = User::create(['name' => 'Admin', 'email' => 'a@example.com', 'password' => 'password']);
        $user->assignRole('Admin');
        $this->actingAs($user);

        return Project::create([
            'title' => 'Projeto',
            'slug' => 'projeto',
            'short_description' => 'Curta',
            'description' => 'Completa',
            'category' => 'Web',
            'status' => 'published',
            'featured' => true,
        ]);
    }

    public function test_valid_cover_image_is_stored_on_the_public_disk_and_exposed_by_the_api(): void
    {
        Storage::fake('public');
        $project = $this->project();

        Livewire::test(EditProject::class, ['record' => $project->id])
            ->fillForm(['cover_image' => $this->fakePng('capa.png')->size(500)])
            ->call('save')
            ->assertHasNoFormErrors();

        $path = $project->fresh()->cover_image;
        $this->assertNotNull($path);
        Storage::disk('public')->assertExists($path);

        $this->getJson('/api/projects')->assertJsonPath('data.0.cover_image', '/storage/'.$path);
    }

    public function test_api_returns_null_when_project_has_no_cover(): void
    {
        $this->project();

        $this->getJson('/api/projects')->assertJsonPath('data.0.cover_image', null);
    }

    public function test_image_larger_than_2mb_is_rejected(): void
    {
        Storage::fake('public');
        $project = $this->project();

        Livewire::test(EditProject::class, ['record' => $project->id])
            ->fillForm(['cover_image' => $this->fakePng('grande.png')->size(3000)])
            ->call('save')
            ->assertHasFormErrors(['cover_image']);

        $this->assertNull($project->fresh()->cover_image);
    }

    public function test_non_image_file_is_rejected(): void
    {
        Storage::fake('public');
        $project = $this->project();

        Livewire::test(EditProject::class, ['record' => $project->id])
            ->fillForm(['cover_image' => UploadedFile::fake()->create('documento.pdf', 100, 'application/pdf')])
            ->call('save')
            ->assertHasFormErrors(['cover_image']);

        $this->assertNull($project->fresh()->cover_image);
    }
}
