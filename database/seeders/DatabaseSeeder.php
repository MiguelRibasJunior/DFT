<?php

namespace Database\Seeders;

use App\Models\Cta;
use App\Models\Project;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        foreach (['Super Admin', 'Admin', 'Editor'] as $role) {
            Role::firstOrCreate(['name' => $role]);
        }

        $admin = User::firstOrCreate(
            ['email' => env('ADMIN_EMAIL', 'admin@devsfromtomorrow.com')],
            [
                'name' => 'Administrador',
                'password' => env('VITE_ADMIN_PASSWORD', 'dft2026admin'),
            ]
        );

        if (! $admin->hasRole('Super Admin')) {
            $admin->assignRole('Super Admin');
        }

        $this->seedPublicContent();
    }

    private function seedPublicContent(): void
    {
        $projects = [
            [
                'title' => 'Plataforma de Gestão',
                'slug' => 'plataforma-de-gestao',
                'category' => 'Sistema Web & Dashboard',
                'short_description' => 'Sistema online para gerenciamento de processos, usuários, documentos e indicadores.',
                'description' => 'Sistema online para gerenciamento de processos, usuários, documentos e indicadores.',
                'technologies' => ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
            ],
            [
                'title' => 'Assistente Virtual com IA',
                'slug' => 'assistente-virtual-com-ia',
                'category' => 'Chatbot & Automação n8n',
                'short_description' => 'Chatbot inteligente integrado a dados e ferramentas de automação.',
                'description' => 'Chatbot inteligente integrado a dados e ferramentas de automação.',
                'technologies' => ['Python', 'n8n', 'OpenAI', 'WhatsApp API'],
            ],
            [
                'title' => 'Aplicativo Personalizado',
                'slug' => 'aplicativo-personalizado',
                'category' => 'Mobile iOS & Android',
                'short_description' => 'Aplicativo desenvolvido para facilitar serviços, comunicação e acesso a informações.',
                'description' => 'Aplicativo desenvolvido para facilitar serviços, comunicação e acesso a informações.',
                'technologies' => ['React Native', 'TypeScript', 'Node.js', 'Docker'],
            ],
        ];

        foreach ($projects as $order => $project) {
            Project::updateOrCreate(
                ['slug' => $project['slug']],
                [...$project, 'status' => 'published', 'order' => $order, 'published_at' => now()]
            );
        }

        Cta::updateOrCreate(
            ['name' => 'CTA Final da Página'],
            [
                'title' => 'Tem uma ideia? Vamos transformá-la em uma solução digital.',
                'subtitle' => 'Conte um pouco sobre seu projeto, processo ou necessidade. Nossa equipe entrará em contato para entender como a tecnologia pode ajudar.',
                'button_text' => 'Iniciar um projeto',
                'button_url' => '#contato',
                'position' => 'cta_section',
                'active' => true,
                'order' => 1,
            ]
        );

        SiteSetting::updateOrCreate(['id' => 1], [
            'site_name' => 'Devs From Tomorrow',
            'description' => 'Desenvolvemos hoje as soluções digitais de amanhã. Especialistas em sistemas web, aplicativos mobile, automação n8n e inteligência artificial.',
            'email' => 'contato@devsfromtomorrow.com',
            'whatsapp' => '+55 (11) 99999-9999',
            'instagram' => '#',
            'linkedin' => '#',
            'github' => '#',
            'copyright_text' => '© 2026 Devs From Tomorrow. Todos os direitos reservados.',
            'privacy_url' => '#',
            'terms_url' => '#',
        ]);
    }
}
