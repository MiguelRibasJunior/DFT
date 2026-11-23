<?php

namespace Tests\Feature;

use App\Models\ContactSubmission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ContactFormTest extends TestCase
{
    use RefreshDatabase;

    private function validPayload(array $overrides = []): array
    {
        return array_merge([
            'nome' => 'Maria Silva',
            'empresa' => 'Acme',
            'email' => 'maria@acme.com',
            'telefone' => '(11) 98765-4321',
            'tipoSolucao' => 'Site',
            'descricao' => 'Preciso de um site institucional.',
        ], $overrides);
    }

    public function test_valid_submission_is_saved_and_returns_201(): void
    {
        Http::fake();

        $this->postJson('/api/contact', $this->validPayload())
            ->assertCreated()
            ->assertJson(['success' => true]);

        $this->assertDatabaseHas('contact_submissions', [
            'email' => 'maria@acme.com',
            'tipo_solucao' => 'Site',
            'status' => 'nova',
        ]);
    }

    public function test_html_is_stripped_before_saving(): void
    {
        Http::fake();

        $this->postJson('/api/contact', $this->validPayload(['nome' => '<b>Maria</b><script>x</script>']))
            ->assertCreated();

        $this->assertStringNotContainsString('<', ContactSubmission::first()->nome);
    }

    public function test_invalid_data_returns_422_with_portuguese_messages(): void
    {
        $response = $this->postJson('/api/contact', $this->validPayload(['email' => 'nao-e-email', 'nome' => '']));

        $response->assertStatus(422)->assertJsonValidationErrors(['email', 'nome']);
        $this->assertSame('Informe um e-mail válido.', $response->json('errors.email.0'));
        $this->assertSame('Preencha o campo nome.', $response->json('errors.nome.0'));
        $this->assertDatabaseCount('contact_submissions', 0);
    }

    public function test_honeypot_submission_is_rejected_and_not_saved(): void
    {
        $this->postJson('/api/contact', $this->validPayload(['website_hp' => 'bot']))
            ->assertStatus(422);

        $this->assertDatabaseCount('contact_submissions', 0);
    }

    public function test_endpoint_is_rate_limited_to_six_requests_per_minute(): void
    {
        Http::fake();

        for ($i = 0; $i < 6; $i++) {
            $this->postJson('/api/contact', $this->validPayload())->assertCreated();
        }

        $this->postJson('/api/contact', $this->validPayload())->assertStatus(429);
    }

    public function test_submission_is_saved_even_when_email_service_fails(): void
    {
        Http::fake(['*' => Http::response([], 500)]);

        $this->postJson('/api/contact', $this->validPayload())->assertCreated();

        $this->assertDatabaseHas('contact_submissions', [
            'email' => 'maria@acme.com',
            'email_trigger_status' => 'erro',
        ]);
    }
}
