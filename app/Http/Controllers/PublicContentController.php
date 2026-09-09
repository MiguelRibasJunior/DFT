<?php

namespace App\Http\Controllers;

use App\Models\Cta;
use App\Models\Project;
use App\Models\SiteSetting;
use Illuminate\Support\Arr;

class PublicContentController
{
    public function projects()
    {
        $projects = Project::query()
            ->where('status', 'published')
            ->orderBy('order')
            ->get([
                'id', 'title', 'slug', 'short_description', 'description',
                'category', 'technologies', 'cover_image',
                'project_url', 'github_url', 'external_url',
            ]);

        return response()->json([
            'success' => true,
            'data' => $projects,
        ]);
    }

    public function cta(string $position)
    {
        $cta = Cta::query()
            ->where('position', $position)
            ->where('active', true)
            ->orderBy('order')
            ->first(['title', 'subtitle', 'button_text', 'button_url']);

        return response()->json([
            'success' => true,
            'data' => $cta,
        ]);
    }

    public function settings()
    {
        $settings = Arr::only(SiteSetting::current()->toArray(), [
            'site_name', 'description', 'logo', 'favicon',
            'phone', 'whatsapp', 'email', 'address',
            'instagram', 'facebook', 'linkedin', 'youtube', 'github',
            'footer_links',
            'copyright_text', 'privacy_url', 'terms_url',
        ]);

        return response()->json([
            'success' => true,
            'data' => $settings,
        ]);
    }
}
