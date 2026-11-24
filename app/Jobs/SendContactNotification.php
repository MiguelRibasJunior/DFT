<?php

namespace App\Jobs;

use App\Models\ContactSubmission;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 * Avisa a equipe por e-mail (via formsubmit.co) que chegou um contato novo.
 *
 * O contato já está gravado quando este job roda; aqui só se atualiza o resultado do aviso
 * (`email_trigger_status`: pendente → sucesso | erro). Um erro de rede ou do serviço de e-mail
 * nunca derruba nem atrasa o envio do formulário.
 *
 * Despachado com `afterResponse()`: roda depois que a resposta HTTP foi enviada ao visitante,
 * no mesmo processo, então **não exige `queue:work`**. Para usar um worker de verdade
 * (retentativas, isolamento), troque `QUEUE_CONNECTION` e tire o `afterResponse()` do controller.
 */
class SendContactNotification implements ShouldQueue
{
    use Queueable;

    public function __construct(public int $submissionId)
    {
    }

    public function handle(): void
    {
        $submission = ContactSubmission::find($this->submissionId);

        if (! $submission) {
            return; // apagado antes do aviso sair
        }

        $adminEmail = config('services.contact.admin_notification_email', env('ADMIN_NOTIFICATION_EMAIL', 'contato@devsfromtomorrow.com'));

        $status = 'sucesso';
        $error = null;

        try {
            $endpoint = rtrim((string) config('services.contact.notification_endpoint'), '/');

            $response = Http::timeout(6)->post("{$endpoint}/{$adminEmail}", [
                '_subject' => "[Devs From Tomorrow] Novo Contato: {$submission->nome} ({$submission->tipo_solucao})",
                '_replyto' => $submission->email,
                '_template' => 'table',
                '_captcha' => 'false',
                'Destinatario_Admin' => $adminEmail,
                'Nome_Cliente' => $submission->nome,
                'Empresa' => $submission->empresa ?? 'Não informada',
                'Email_Cliente' => $submission->email,
                'Telefone' => $submission->telefone,
                'Tipo_Solucao' => $submission->tipo_solucao,
                'Mensagem_Descricao' => $submission->descricao,
                'Data_Envio' => $submission->created_at?->format('d/m/Y H:i:s') ?? date('d/m/Y H:i:s'),
            ]);

            if (! $response->successful()) {
                $status = 'erro';
                $error = 'HTTP Status '.$response->status();
            }
        } catch (\Throwable $e) {
            Log::warning('Falha ao enviar o e-mail de notificação do contato #'.$submission->id.': '.$e->getMessage());

            $status = 'erro';
            $error = Str::limit($e->getMessage(), 500);
        }

        $submission->forceFill([
            'email_trigger_status' => $status,
            'email_trigger_error' => $error,
            'last_email_sent_at' => $status === 'sucesso' ? now() : null,
        ])->save();
    }
}
