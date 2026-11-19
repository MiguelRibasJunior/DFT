<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactRequest;
use App\Jobs\SendContactNotification;
use App\Models\ContactSubmission;
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

        // 4. Save to Database with secure error handling.
        // O contato é gravado ANTES do aviso por e-mail: se o serviço de e-mail estiver lento
        // ou fora do ar, o lead não se perde e o visitante não espera.
        try {
            $submission = new ContactSubmission();
            $submission->nome = $nome;
            $submission->empresa = $empresa;
            $submission->email = $email;
            $submission->telefone = $telefone;
            $submission->tipo_solucao = $tipoSolucao;
            $submission->descricao = $descricao;
            $submission->status = 'nova';
            $submission->email_trigger_status = 'pendente';
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

        // 5. Aviso por e-mail depois que a resposta já foi enviada (ver SendContactNotification).
        SendContactNotification::dispatch($submission->id)->afterResponse();

        // Safe, minimal public response (no internal email/database leak)
        return response()->json([
            'success' => true,
            'message' => 'Mensagem de contato recebida com sucesso. Em breve entraremos em contato.'
        ], 201);
    }
}
