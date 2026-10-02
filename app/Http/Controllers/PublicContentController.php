<?php

namespace App\Http\Controllers;

use App\Models\ContactLink;
use App\Models\Cta;
use App\Models\Project;
use App\Models\SiteSetting;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

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
            ])
            ->map(function (Project $project) {
                $project->cover_image = $project->cover_image
                    ? '/storage/'.ltrim($project->cover_image, '/')
                    : null;

                return $project;
            });

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
        $current = SiteSetting::current();

        $settings = Arr::only($current->toArray(), [
            'site_name', 'description', 'logo', 'favicon', 'copyright_text',
        ]);

        $settings['footer_links'] = $current->footerLinks();

        // Qualquer usuário do painel pode editar estes textos; o HTML é sanitizado na saída.
        $settings['privacy_policy'] = $current->privacy_policy ? Str::sanitizeHtml($current->privacy_policy) : null;
        $settings['terms_of_use'] = $current->terms_of_use ? Str::sanitizeHtml($current->terms_of_use) : null;

        return response()->json([
            'success' => true,
            'data' => $settings,
        ]);
    }
}
