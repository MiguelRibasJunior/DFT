<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\ContactSubmission;
use App\Models\Project;
use App\Models\SiteSetting;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminApiController
{
    /**
     * Autenticação de Administrador via API
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $email = strtolower(trim($validated['email']));
        $password = $validated['password'];

        // 1. Tentar localizar usuário na tabela users do Laravel
        try {
            $user = User::where('email', $email)->first();
            if ($user && Hash::check($password, $user->password)) {
                $token = 'dft_' . bin2hex(random_bytes(32));
                return response()->json([
                    'success' => true,
                    'token' => $token,
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => $user->roles()->pluck('name')->first() ?? 'admin',
                    ],
                ]);
            }
        } catch (\Throwable $e) {
            // Tabela users pode não estar migrada ainda em ambiente inicial
        }

        // 2. Fallback para credenciais configuradas no .env
        $envAdminEmail = strtolower(trim(env('ADMIN_EMAIL', 'admin@devsfromtomorrow.com')));
        $envAdminPass = env('ADMIN_PASSWORD', 'admin123');

        if ($email === $envAdminEmail && $password === $envAdminPass) {
            $token = 'dft_' . bin2hex(random_bytes(32));
            return response()->json([
                'success' => true,
                'token' => $token,
                'user' => [
                    'id' => 1,
                    'name' => 'Administrador',
                    'email' => $envAdminEmail,
                    'role' => 'super_admin',
                ],
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Credenciais de administrador inválidas.',
        ], 401);
    }

    /**
     * Listar todos os orçamentos/contatos recebidos
     */
    public function submissions()
    {
        try {
            $submissions = ContactSubmission::orderBy('created_at', 'desc')->get();
            return response()->json([
                'success' => true,
                'data' => $submissions,
            ]);
        } catch (\Throwable $e) {
            return response()->json(['success' => true, 'data' => []]);
        }
    }

    /**
     * Atualizar status de um orçamento (nova, lida, respondida)
     */
    public function updateSubmissionStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:nova,lida,respondida',
        ]);

        try {
            $sub = ContactSubmission::findOrFail($id);
            $sub->status = $validated['status'];
            $sub->save();

            return response()->json(['success' => true, 'data' => $sub]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => 'Contato não encontrado.'], 404);
        }
    }

    /**
     * Excluir uma submissão de contato
     */
    public function deleteSubmission($id)
    {
        try {
            $sub = ContactSubmission::findOrFail($id);
            $sub->delete();
            return response()->json(['success' => true]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => 'Contato não encontrado.'], 404);
        }
    }

    /**
     * Listar todos os projetos (incluindo status interno)
     */
    public function projects()
    {
        try {
            $projects = Project::orderBy('order')->get();
            return response()->json(['success' => true, 'data' => $projects]);
        } catch (\Throwable $e) {
            return response()->json(['success' => true, 'data' => []]);
        }
    }

    /**
     * Criar novo projeto
     */
    public function storeProject(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:200',
            'category' => 'required|string|max:100',
            'short_description' => 'required|string|max:300',
            'description' => 'required|string',
            'technologies' => 'nullable|array',
            'github_url' => 'nullable|url',
            'project_url' => 'nullable|url',
        ]);

        try {
            $project = new Project();
            $project->title = $validated['title'];
            $project->slug = Str::slug($validated['title']);
            $project->category = $validated['category'];
            $project->short_description = $validated['short_description'];
            $project->description = $validated['description'];
            $project->technologies = $validated['technologies'] ?? [];
            $project->github_url = $validated['github_url'] ?? null;
            $project->project_url = $validated['project_url'] ?? null;
            $project->status = 'published';
            $project->order = Project::count() + 1;
            $project->save();

            return response()->json(['success' => true, 'data' => $project], 201);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Atualizar projeto existente
     */
    public function updateProject(Request $request, $id)
    {
        try {
            $project = Project::findOrFail($id);
            $project->update($request->only([
                'title', 'category', 'short_description', 'description',
                'technologies', 'github_url', 'project_url', 'status'
            ]));

            return response()->json(['success' => true, 'data' => $project]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => 'Projeto não encontrado.'], 404);
        }
    }

    /**
     * Deletar projeto
     */
    public function deleteProject($id)
    {
        try {
            $project = Project::findOrFail($id);
            $project->delete();
            return response()->json(['success' => true]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => 'Projeto não encontrado.'], 404);
        }
    }

    /**
     * Atualizar configurações do site
     */
    public function updateSettings(Request $request)
    {
        try {
            $setting = SiteSetting::first() ?? new SiteSetting();
            $setting->fill($request->all());
            $setting->save();

            return response()->json(['success' => true, 'data' => $setting]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
