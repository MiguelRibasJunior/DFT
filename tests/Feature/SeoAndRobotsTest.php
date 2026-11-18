<?php

namespace Tests\Feature;

use Tests\TestCase;

class SeoAndRobotsTest extends TestCase
{
    public function test_robots_txt_is_accessible_and_protects_admin(): void
    {
        $response = $this->get('/robots.txt');

        $response->assertStatus(200);
        $this->assertStringContainsString('text/plain', $response->headers->get('Content-Type'));
        $content = $response->getContent();

        $this->assertStringContainsString('User-agent: *', $content);
        $this->assertStringContainsString('Allow: /', $content);
        $this->assertStringContainsString('Disallow: /admin', $content);
        $this->assertStringContainsString('Disallow: /api/', $content);
        $this->assertStringContainsString('Sitemap:', $content);
    }

    public function test_sitemap_xml_is_accessible_and_lists_public_urls(): void
    {
        $response = $this->get('/sitemap.xml');

        $response->assertStatus(200);
        $this->assertStringContainsString('xml', $response->headers->get('Content-Type'));
        $content = $response->getContent();

        $this->assertStringContainsString('<urlset', $content);
        $this->assertStringContainsString('https://devsfromtomorrow.com/', $content);
        $this->assertStringNotContainsString('/admin', $content);
    }

    public function test_homepage_head_contains_complete_seo_and_open_graph_metadata(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $content = $response->getContent();

        // SEO tags
        $this->assertStringContainsString('<title>Devs From Tomorrow', $content);
        $this->assertStringContainsString('<meta name="description"', $content);
        $this->assertStringContainsString('<link rel="canonical"', $content);
        $this->assertStringContainsString('href="/favicon.svg"', $content);

        // Open Graph
        $this->assertStringContainsString('property="og:title"', $content);
        $this->assertStringContainsString('property="og:description"', $content);
        $this->assertStringContainsString('property="og:image"', $content);
        $this->assertStringContainsString('property="og:url"', $content);
        $this->assertStringContainsString('property="og:type" content="website"', $content);

        // Twitter Card
        $this->assertStringContainsString('name="twitter:card" content="summary_large_image"', $content);

        // Structured Data (JSON-LD)
        $this->assertStringContainsString('application/ld+json', $content);
        $this->assertStringContainsString('"@context": "https://schema.org"', $content);
        $this->assertStringContainsString('"@type": "Organization"', $content);
        $this->assertStringContainsString('"@type": "ProfessionalService"', $content);

        // Ensure no placeholder telephone
        $this->assertStringNotContainsString('+5511999999999', $content);
    }
}

