<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'short_description',
        'description',
        'category',
        'technologies',
        'cover_image',
        'gallery',
        'status',
        'featured',
        'order',
        'external_url',
        'project_url',
        'github_url',
        'meta_title',
        'meta_description',
        'og_image',
        'published_at',
    ];

    protected $casts = [
        'technologies' => 'array',
        'gallery' => 'array',
        'featured' => 'boolean',
        'order' => 'integer',
        'published_at' => 'datetime',
    ];
}
