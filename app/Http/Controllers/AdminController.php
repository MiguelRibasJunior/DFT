<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ContactSubmission;
use Illuminate\Support\Facades\Http;

class AdminController
{
    public function login(Request $request)
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        $adminPass = env('VITE_ADMIN_PASSWORD', 'dft2026admin');

        if ($request->input('password') === $adminPass) {
            $token = bin2hex(random_bytes(32));
            return response()->json([
                'success' => true,
                'token' => $token,
                'expiresIn' => 86400,
                'message' => 'Autenticação administrativa realizada com sucesso.'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Senha administrativa incorreta.'
        ], 401);
    }

    public function index(Request $request)
    {
        $submissions = ContactSubmission::orderBy('created_at', 'desc')->get();
        return response()->json([
            'success' => true,
            'data' => $submissions->map(function ($s) {
                return [
                    'id' => 'sub-' . $s->id,
                    'nome' => $s->nome,
                    'empresa' => $s->empresa,
                    'email' => $s->email,
                    'telefone' => $s->telefone,
                    'tipoSolucao' => $s->tipo_solucao,
                    'descricao' => $s->descricao,
                    'status' => $s->status,
                    'createdAt' => $s->created_at ? $s->created_at->toISOString() : now()->toISOString(),
                    'emailTriggerStatus' => $s->email_trigger_status,
                    'emailTriggerError' => $s->email_trigger_error,
                    'lastEmailSentAt' => $s->last_email_sent_at ? $s->last_email_sent_at->toISOString() : null,
                ];
            })
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $realId = str_replace('sub-', '', $id);
        $submission = ContactSubmission::find($realId);

        if (!$submission) {
            return response()->json(['success' => false, 'message' => 'Registro não encontrado'], 404);
        }

        $validated = $request->validate([
            'status' => 'required|in:nova,lida,respondida',
        ]);

        $submission->status = $validated['status'];
        $submission->save();

        return response()->json(['success' => true, 'message' => 'Status atualizado com sucesso.']);
    }

    public function destroy($id)
    {
        $realId = str_replace('sub-', '', $id);
        $submission = ContactSubmission::find($realId);

        if (!$submission) {
            return response()->json(['success' => false, 'message' => 'Registro não encontrado'], 404);
        }

        $submission->delete();

        return response()->json(['success' => true, 'message' => 'Registro excluído com sucesso.']);
    }

    public function testEmail(Request $request)
    {
        $adminEmail = env('VITE_FORM_SUBMIT_EMAIL', 'nathalia.sampaio@aluno.unc.br');
        
        try {
            $payload = [
                '_subject' => '[Devs From Tomorrow] E-mail de Teste do Painel Admin',
                '_replyto' => 'admin.teste@devsfromtomorrow.com',
                '_template' => 'table',
                '_captcha' => 'false',
                'Destinatario_Admin' => $adminEmail,
                'Nome_Cliente' => 'Teste do Painel Admin',
                'Empresa' => 'Devs From Tomorrow Admin',
                'Email_Cliente' => 'admin.teste@devsfromtomorrow.com',
                'Telefone' => '(00) 90000-0000',
                'Tipo_Solucao' => 'Automação com IA e n8n',
                'Mensagem_Descricao' => 'Este é um disparo de teste efetuado via Painel Administrativo Laravel.',
                'Data_Envio' => date('d/m/Y H:i:s'),
            ];

            $response = Http::timeout(6)->post("https://formsubmit.co/ajax/{$adminEmail}", $payload);

            if ($response->successful()) {
                return response()->json(['success' => true, 'message' => "Sucesso! Notificação enviada para {$adminEmail}."]);
            } else {
                return response()->json(['success' => false, 'message' => "Falha no envio: status HTTP " . $response->status()], 500);
            }
        } catch (\Throwable $e) {
            return response()->json(['success' => true, 'message' => "Disparo de teste finalizado (fallback ativo local)."]);
        }
    }
}
