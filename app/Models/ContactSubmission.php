<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'nome',
        'empresa',
        'email',
        'telefone',
        'tipo_solucao',
        'descricao',
        'status',
        'email_trigger_status',
        'email_trigger_error',
        'last_email_sent_at'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'last_email_sent_at' => 'datetime',
    ];
}
