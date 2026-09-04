<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    protected $fillable = [
        'site_name',
        'description',
        'logo',
        'favicon',
        'phone',
        'whatsapp',
        'email',
        'address',
        'instagram',
        'facebook',
        'linkedin',
        'youtube',
        'github',
        'footer_links',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'og_image',
        'google_analytics_id',
        'google_tag_manager_id',
        'extra_scripts',
        'copyright_text',
        'privacy_url',
        'terms_url',
    ];

    protected $casts = [
        'footer_links' => 'array',
    ];

    public static function current(): self
    {
        return static::query()->firstOrCreate(['id' => 1]);
    }
}
