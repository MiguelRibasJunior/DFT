<?php

namespace App\Http\Controllers;

use App\Models\ContactLink;
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
            ->where('featured', true)
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
        $cta = Cta::currentFor($position)?->only(['title', 'subtitle', 'button_text', 'button_url']);

        return response()->json([
            'success' => true,
            'data' => $cta,
        ]);
    }

    public function contactLinks()
    {
        $links = ContactLink::query()
            ->active()
            ->ordered()
            ->get()
            ->map(fn (ContactLink $link) => [
                'id' => $link->id,
                'type' => $link->type->value,
                'label' => $link->label,
                'value' => $link->value,
                'href' => $link->href,
            ])
            ->filter(fn (array $link) => $link['href'] !== null)
            ->values();

        return response()->json([
            'success' => true,
            'data' => $links,
        ]);
    }

    public function settings()
    {
        $settings = Arr::only(SiteSetting::current()->toArray(), [
            'site_name', 'description', 'logo', 'favicon',
            'phone', 'whatsapp', 'email', 'address',
            'instagram', 'facebook', 'linkedin', 'youtube', 'github',
            'footer_links',
            'copyright_text', 'privacy_policy', 'terms_of_use',
        ]);

        return response()->json([
            'success' => true,
            'data' => $settings,
        ]);
    }
}
