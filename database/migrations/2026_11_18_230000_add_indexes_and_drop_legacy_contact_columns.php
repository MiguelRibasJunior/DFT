<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Colunas de contato que viviam em site_settings e foram substituídas por contact_links.
     * A migration create_contact_links_table já copiou os valores existentes.
     */
    private const LEGACY_CONTACT_COLUMNS = [
        'phone', 'whatsapp', 'email', 'address',
        'instagram', 'facebook', 'linkedin', 'youtube', 'github',
    ];

    public function up(): void
    {
        // Consulta pública da Home: publicados + destaque, por ordem.
        Schema::table('projects', function (Blueprint $table) {
            $table->index(['status', 'featured', 'order'], 'projects_public_listing_index');
        });

        // CTA exibido por posição: primeiro ativo pela ordem.
        Schema::table('ctas', function (Blueprint $table) {
            $table->index(['position', 'active', 'order'], 'ctas_position_lookup_index');
        });

        // Canais de contato ativos, em ordem.
        Schema::table('contact_links', function (Blueprint $table) {
            $table->index(['active', 'order'], 'contact_links_active_order_index');
        });

        // Colunas do Kanban e "minhas tarefas".
        Schema::table('tasks', function (Blueprint $table) {
            $table->index(['project_id', 'status', 'position'], 'tasks_kanban_index');
            $table->index(['assigned_to', 'due_date'], 'tasks_assignee_due_index');
        });

        // Lista de leads filtrada por status, do mais recente para o mais antigo.
        Schema::table('contact_submissions', function (Blueprint $table) {
            $table->index(['status', 'created_at'], 'contact_submissions_status_date_index');
        });

        // Histórico do projeto: comentários e atividades, do mais recente.
        Schema::table('comments', function (Blueprint $table) {
            $table->index(['project_id', 'created_at'], 'comments_project_date_index');
        });
        Schema::table('activities', function (Blueprint $table) {
            $table->index(['project_id', 'created_at'], 'activities_project_date_index');
        });

        $present = array_values(array_filter(
            self::LEGACY_CONTACT_COLUMNS,
            fn (string $column) => Schema::hasColumn('site_settings', $column),
        ));

        if ($present !== []) {
            Schema::table('site_settings', function (Blueprint $table) use ($present) {
                $table->dropColumn($present);
            });
        }
    }

    public function down(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            foreach (self::LEGACY_CONTACT_COLUMNS as $column) {
                if (! Schema::hasColumn('site_settings', $column)) {
                    $table->string($column)->nullable();
                }
            }
        });

        Schema::table('activities', fn (Blueprint $table) => $table->dropIndex('activities_project_date_index'));
        Schema::table('comments', fn (Blueprint $table) => $table->dropIndex('comments_project_date_index'));
        Schema::table('contact_submissions', fn (Blueprint $table) => $table->dropIndex('contact_submissions_status_date_index'));
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropIndex('tasks_assignee_due_index');
            $table->dropIndex('tasks_kanban_index');
        });
        Schema::table('contact_links', fn (Blueprint $table) => $table->dropIndex('contact_links_active_order_index'));
        Schema::table('ctas', fn (Blueprint $table) => $table->dropIndex('ctas_position_lookup_index'));
        Schema::table('projects', fn (Blueprint $table) => $table->dropIndex('projects_public_listing_index'));
    }
};
