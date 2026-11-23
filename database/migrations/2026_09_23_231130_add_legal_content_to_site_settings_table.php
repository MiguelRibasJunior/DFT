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
        Schema::table('site_settings', function (Blueprint $table) {
            $table->longText('privacy_policy')->nullable()->after('privacy_url');
            $table->longText('terms_of_use')->nullable()->after('terms_url');
        });

        Schema::table('site_settings', function (Blueprint $table) {
            $table->dropColumn(['privacy_url', 'terms_url']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            $table->string('privacy_url')->nullable();
            $table->string('terms_url')->nullable();
            $table->dropColumn(['privacy_policy', 'terms_of_use']);
        });
    }
};
