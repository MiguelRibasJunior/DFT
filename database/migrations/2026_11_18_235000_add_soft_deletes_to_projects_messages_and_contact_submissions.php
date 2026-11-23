<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Lixeira: apagar projeto, mensagem ou contato (lead) passa a esconder o registro em vez de
     * destruí-lo, e dá para restaurar pelo admin. Tarefas, comentários e atividades ficam intactos
     * junto do projeto. A exclusão definitiva é uma ação separada (só Super Admin).
     */
    private const TABLES = ['projects', 'messages', 'contact_submissions'];

    public function up(): void
    {
        foreach (self::TABLES as $table) {
            Schema::table($table, function (Blueprint $blueprint) {
                $blueprint->softDeletes();
            });
        }
    }

    public function down(): void
    {
        foreach (self::TABLES as $table) {
            Schema::table($table, function (Blueprint $blueprint) {
                $blueprint->dropSoftDeletes();
            });
        }
    }
};
