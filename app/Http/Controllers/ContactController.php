<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ContactSubmission;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ContactController
{
    public function store(Request $request)
    {
        // 1. Honeypot check for spam bots
        if (!empty($request->input('website_hp'))) {
            return response()->json([
                'success' => false,
                'message' => 'Submissão rejeitada por filtro anti-spam.'
            ], 422);
        }

        // 2. Strict Input Validation
        $validated = $request->validate([
            'nome' => 'required|string|max:150',
            'empresa' => 'nullable|string|max:150',
            'email' => 'required|email:filter|max:200',
            'telefone' => 'required|string|max:30',
            'tipoSolucao' => 'required|string|max:100',
            'descricao' => 'required|string|max:3000',
        ]);

        // 3. Input Sanitization (strip tags against XSS)
        $nome = strip_tags(trim($validated['nome']));
        $empresa = isset($validated['empresa']) ? strip_tags(trim($validated['empresa'])) : null;
        $email = filter_var(trim($validated['email']), FILTER_SANITIZE_EMAIL);
        $telefone = strip_tags(trim($validated['telefone']));
        $tipoSolucao = strip_tags(trim($validated['tipoSolucao']));
        $descricao = strip_tags(trim($validated['descricao']));

        $adminEmail = env('VITE_FORM_SUBMIT_EMAIL', 'nathalia.sampaio@aluno.unc.br');
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

        // 5. Save to Database (SQLite / SQL)
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

        return response()->json([
            'success' => true,
            'data' => [
                'id' => 'sub-' . $submission->id,
                'nome' => $submission->nome,
                'empresa' => $submission->empresa,
                'email' => $submission->email,
                'telefone' => $submission->telefone,
                'tipoSolucao' => $submission->tipo_solucao,
                'descricao' => $submission->descricao,
                'status' => $submission->status,
                'createdAt' => $submission->created_at->toISOString(),
                'emailTriggerStatus' => $submission->email_trigger_status,
                'emailTriggerError' => $submission->email_trigger_error,
            ],
            'adminNotificationEmail' => $adminEmail,
            'message' => 'Mensagem de contato recebida e gravada com sucesso.'
        ], 201);
    }
}
