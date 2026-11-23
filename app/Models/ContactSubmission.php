<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ContactSubmission extends Model
{
    use HasFactory;
    use SoftDeletes;

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
