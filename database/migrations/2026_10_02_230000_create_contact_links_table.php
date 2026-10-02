<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contact_links', function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->string('label');
            $table->string('value');
            $table->unsignedInteger('order')->default(0);
            $table->boolean('active')->default(true);
            $table->timestamps();
        });

        $this->copyFromSiteSettings();
    }

    public function down(): void
    {
        Schema::dropIfExists('contact_links');
    }

    /**
     * Preserva os contatos que já estavam cadastrados em Configurações.
     */
    private function copyFromSiteSettings(): void
    {
        if (! Schema::hasTable('site_settings') || ! Schema::hasColumn('site_settings', 'whatsapp')) {
            return;
        }

        $settings = DB::table('site_settings')->first();

        if (! $settings) {
            return;
        }

        $channels = [
            ['whatsapp', 'WhatsApp', $settings->whatsapp ?? null],
            ['email', 'E-mail', $settings->email ?? null],
            ['phone', 'Telefone', $settings->phone ?? null],
            ['instagram', 'Instagram', $settings->instagram ?? null],
            ['linkedin', 'LinkedIn', $settings->linkedin ?? null],
            ['github', 'GitHub', $settings->github ?? null],
            ['address', 'Endereço', $settings->address ?? null],
        ];

        $order = 0;

        foreach ($channels as [$type, $label, $value]) {
            $value = trim((string) $value);

            if ($value === '' || $value === '#') {
                continue;
            }

            DB::table('contact_links')->insert([
                'type' => $type,
                'label' => $label,
                'value' => $value,
                'order' => $order++,
                'active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
};
