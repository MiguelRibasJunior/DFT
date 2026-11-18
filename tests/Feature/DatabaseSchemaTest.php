<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

/**
 * Garante o esquema que as telas e a API dependem: índices das consultas quentes
 * e a ausência das colunas de contato antigas (substituídas por contact_links).
 */
class DatabaseSchemaTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @return array<string, array{string, list<string>}>
     */
    public static function expectedIndexes(): array
    {
        return [
            'Home: projetos publicados em destaque' => ['projects', ['status', 'featured', 'order']],
            'CTA por posição' => ['ctas', ['position', 'active', 'order']],
            'canais de contato ativos' => ['contact_links', ['active', 'order']],
            'Kanban' => ['tasks', ['project_id', 'status', 'position']],
            'minhas tarefas' => ['tasks', ['assigned_to', 'due_date']],
            'leads por status' => ['contact_submissions', ['status', 'created_at']],
            'comentários do projeto' => ['comments', ['project_id', 'created_at']],
            'atividades do projeto' => ['activities', ['project_id', 'created_at']],
        ];
    }

    private function hasIndexOn(string $table, array $columns): bool
    {
        return collect(Schema::getIndexes($table))->contains(fn (array $index) => $index['columns'] === $columns);
    }

    #[DataProvider('expectedIndexes')]
    public function test_hot_queries_have_a_matching_index(string $table, array $columns): void
    {
        $this->assertTrue($this->hasIndexOn($table, $columns), "Falta índice em {$table}(".implode(', ', $columns).')');
    }

    public function test_projects_slug_stays_unique(): void
    {
        $unique = collect(Schema::getIndexes('projects'))->contains(fn (array $i) => $i['unique'] && $i['columns'] === ['slug']);

        $this->assertTrue($unique);
    }

    public function test_legacy_contact_columns_are_gone_from_site_settings(): void
    {
        foreach (['phone', 'whatsapp', 'email', 'address', 'instagram', 'facebook', 'linkedin', 'youtube', 'github'] as $column) {
            $this->assertFalse(Schema::hasColumn('site_settings', $column), "site_settings.{$column} deveria ter sido removida");
        }
    }

    public function test_site_settings_keeps_everything_the_admin_still_edits(): void
    {
        foreach ([
            'site_name', 'description', 'logo', 'favicon', 'footer_links', 'copyright_text',
            'privacy_policy', 'terms_of_use', 'meta_title', 'meta_description', 'meta_keywords',
            'og_image', 'google_analytics_id', 'google_tag_manager_id', 'extra_scripts',
        ] as $column) {
            $this->assertTrue(Schema::hasColumn('site_settings', $column), "site_settings.{$column} não pode sumir");
        }
    }

    public function test_the_last_migration_can_be_rolled_back_and_reapplied(): void
    {
        $this->artisan('migrate:rollback', ['--step' => 1])->assertSuccessful();

        $this->assertTrue(Schema::hasColumn('site_settings', 'whatsapp'), 'down() deve recriar as colunas antigas');
        $this->assertFalse($this->hasIndexOn('projects', ['status', 'featured', 'order']), 'down() deve remover os índices');

        $this->artisan('migrate')->assertSuccessful();

        $this->assertFalse(Schema::hasColumn('site_settings', 'whatsapp'));
        $this->assertTrue($this->hasIndexOn('projects', ['status', 'featured', 'order']));
    }
}
