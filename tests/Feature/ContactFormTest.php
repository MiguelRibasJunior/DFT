<?php

namespace Tests\Feature;

use App\Models\ContactSubmission;
use App\Jobs\SendContactNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Bus;
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

    public function test_the_email_notice_is_dispatched_after_the_response_and_starts_pending(): void
    {
        Bus::fake();

        $this->postJson('/api/contact', $this->validPayload())->assertCreated();

        Bus::assertDispatchedAfterResponse(SendContactNotification::class);
        $this->assertDatabaseHas('contact_submissions', [
            'email' => 'maria@acme.com',
            'email_trigger_status' => 'pendente',
        ]);
    }

    public function test_successful_notice_marks_the_submission_as_sent(): void
    {
        Http::fake(['*' => Http::response(['success' => true], 200)]);

        $this->postJson('/api/contact', $this->validPayload())->assertCreated();

        $submission = ContactSubmission::first();
        $this->assertSame('sucesso', $submission->email_trigger_status);
        $this->assertNull($submission->email_trigger_error);
        $this->assertNotNull($submission->last_email_sent_at);
    }

    public function test_network_failure_is_recorded_as_error_and_never_breaks_the_form(): void
    {
        Http::fake(['*' => fn () => throw new ConnectionException('cURL error 28: timeout')]);

        $this->postJson('/api/contact', $this->validPayload())
            ->assertCreated()
            ->assertJson(['success' => true]);

        $submission = ContactSubmission::first();
        $this->assertSame('erro', $submission->email_trigger_status);
        $this->assertStringContainsString('timeout', $submission->email_trigger_error);
        $this->assertNull($submission->last_email_sent_at);
    }

    public function test_the_notification_endpoint_is_configurable_so_tests_never_reach_the_real_service(): void
    {
        config(['services.contact.notification_endpoint' => 'http://127.0.0.1:9/ajax/', 'services.contact.admin_notification_email' => 'teste@example.test']);
        Http::fake();

        $this->postJson('/api/contact', $this->validPayload())->assertCreated();

        Http::assertSent(fn ($request) => $request->url() === 'http://127.0.0.1:9/ajax/teste@example.test');
        Http::assertNotSent(fn ($request) => str_contains($request->url(), 'formsubmit.co'));
    }

    public function test_the_default_endpoint_is_formsubmit(): void
    {
        $this->assertSame('https://formsubmit.co/ajax', config('services.contact.notification_endpoint'));
    }

    public function test_notice_for_a_submission_deleted_in_the_meantime_is_ignored(): void
    {
        Http::fake();

        (new SendContactNotification(999999))->handle();

        Http::assertNothingSent();
    }
}
