<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contact_submissions', function (Blueprint $table) {
            $table->id();
            $table->string('nome', 150);
            $table->string('empresa', 150)->nullable();
            $table->string('email', 200);
            $table->string('telefone', 30);
            $table->string('tipo_solucao', 100);
            $table->text('descricao');
            $table->string('status', 20)->default('nova');
            $table->string('email_trigger_status', 20)->default('sucesso');
            $table->text('email_trigger_error')->nullable();
            $table->timestamp('last_email_sent_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contact_submissions');
    }
};
