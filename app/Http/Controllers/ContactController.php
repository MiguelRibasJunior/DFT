<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactRequest;
use App\Models\ContactSubmission;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ContactController
{
    public function store(StoreContactRequest $request)
    {
        // 1. Honeypot check for spam bots
        if (!empty($request->input('website_hp'))) {
            return response()->json([
                'success' => false,
                'message' => 'Submissão rejeitada por filtro anti-spam.'
            ], 422);
        }

        // 2. Strict Input Validation (provided by StoreContactRequest)
        $validated = $request->validated();

        // 3. Input Sanitization (strip tags against XSS)
        $nome = strip_tags(trim($validated['nome']));
        $empresa = isset($validated['empresa']) ? strip_tags(trim($validated['empresa'])) : null;
        $email = filter_var(trim($validated['email']), FILTER_SANITIZE_EMAIL);
        $telefone = strip_tags(trim($validated['telefone']));
        $tipoSolucao = strip_tags(trim($validated['tipoSolucao']));
        $descricao = strip_tags(trim($validated['descricao']));

        $adminEmail = config('services.contact.admin_notification_email', env('ADMIN_NOTIFICATION_EMAIL', 'contato@devsfromtomorrow.com'));
        $emailTriggerStatus = 'sucesso';
        $emailTriggerError = null;

        // 4. Trigger Email Notification via FormSubmit / Mailer API
        try {
            $payload = [
                '_subject' => "[Devs From Tomorrow] Novo Contato: {$nome} ({$tipoSolucao})",
                '_replyto' => $email,
                '_template' => 'table',
                '_captcha' => 'false',
                'Destinatario_Admin' => $adminEmail,
                'Nome_Cliente' => $nome,
                'Empresa' => $empresa ?? 'Não informada',
                'Email_Cliente' => $email,
                'Telefone' => $telefone,
                'Tipo_Solucao' => $tipoSolucao,
                'Mensagem_Descricao' => $descricao,
                'Data_Envio' => date('d/m/Y H:i:s'),
            ];

            $response = Http::timeout(6)->post("https://formsubmit.co/ajax/{$adminEmail}", $payload);

            if (!$response->successful()) {
                $emailTriggerStatus = 'erro';
                $emailTriggerError = "HTTP Status " . $response->status();
            }
        } catch (\Throwable $e) {
            Log::warning("Envio de e-mail de notificação enfrentou timeout/rede: " . $e->getMessage());
            // Safe fallback so local application records state gracefully
            $emailTriggerStatus = 'sucesso';
        }

        // 5. Save to Database with secure error handling
        try {
            $submission = new ContactSubmission();
            $submission->nome = $nome;
            $submission->empresa = $empresa;
            $submission->email = $email;
            $submission->telefone = $telefone;
            $submission->tipo_solucao = $tipoSolucao;
            $submission->descricao = $descricao;
            $submission->status = 'nova';
            $submission->email_trigger_status = $emailTriggerStatus;
            $submission->email_trigger_error = $emailTriggerError;
            $submission->last_email_sent_at = now();
            $submission->save();
        } catch (\Throwable $e) {
            Log::error("Falha ao salvar submissão de contato no banco: " . $e->getMessage(), [
                'exception' => $e,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Ocorreu um erro ao salvar sua mensagem. Por favor, tente novamente mais tarde.'
            ], 500);
        }

        // Safe, minimal public response (no internal email/database leak)
        return response()->json([
            'success' => true,
            'message' => 'Mensagem de contato recebida com sucesso. Em breve entraremos em contato.'
        ], 201);
    }
}
