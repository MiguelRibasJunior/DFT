<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'sender_name',
        'sender_email',
        'sender_phone',
        'subject',
        'body',
        'read',
        'archived',
    ];

    protected $casts = [
        'read' => 'boolean',
        'archived' => 'boolean',
    ];
}
