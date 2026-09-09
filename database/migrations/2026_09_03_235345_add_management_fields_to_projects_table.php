<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->string('management_status')->default('planning')->after('status');
            $table->string('priority')->default('medium')->after('management_status');
            $table->foreignId('manager_id')->nullable()->after('priority')->constrained('users')->nullOnDelete();
            $table->unsignedTinyInteger('progress')->default(0)->after('manager_id');
            $table->date('start_date')->nullable()->after('progress');
            $table->date('due_date')->nullable()->after('start_date');
            $table->timestamp('completed_at')->nullable()->after('due_date');
            $table->json('external_links')->nullable()->after('github_url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropConstrainedForeignId('manager_id');
            $table->dropColumn([
                'management_status',
                'priority',
                'progress',
                'start_date',
                'due_date',
                'completed_at',
                'external_links',
            ]);
        });
    }
};
