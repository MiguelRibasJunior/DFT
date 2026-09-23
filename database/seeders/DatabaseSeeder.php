<?php

namespace Database\Seeders;

use App\Models\Cta;
use App\Models\Message;
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

        $messages = [
            [
                'sender_name' => 'Pedro Almeida',
                'sender_email' => 'pedro@fintech.com.br',
                'subject' => 'Orçamento urgente — sistema ERP',
                'body' => 'Precisamos de uma proposta o quanto antes para apresentar ao conselho.',
                'read' => false,
            ],
            [
                'sender_name' => 'Carla Santos',
                'sender_email' => 'carla@design.studio',
                'subject' => 'Parceria em projetos',
                'body' => 'Vi o portfólio de vocês e adorei! Gostaria de conversar sobre uma possível parceria.',
                'read' => false,
            ],
            [
                'sender_name' => 'Eduardo Lima',
                'sender_email' => 'edu@startup.co',
                'subject' => 'Re: Proposta chatbot',
                'body' => 'Ótimo! Aprovamos a proposta. Quando podemos iniciar o projeto?',
                'read' => true,
            ],
        ];

        foreach ($messages as $message) {
            Message::updateOrCreate(
                ['sender_email' => $message['sender_email'], 'subject' => $message['subject']],
                $message
            );
        }

        SiteSetting::updateOrCreate(['id' => 1], [
            'site_name' => 'Devs From Tomorrow',
            'description' => 'Desenvolvemos hoje as soluções digitais de amanhã. Especialistas em sistemas web, aplicativos mobile, automação n8n e inteligência artificial.',
            'email' => 'contato@devsfromtomorrow.com',
            'whatsapp' => '+55 (11) 99999-9999',
            'instagram' => '#',
            'linkedin' => '#',
            'github' => '#',
            'copyright_text' => '© 2026 Devs From Tomorrow. Todos os direitos reservados.',
            'privacy_policy' => '<p>A Devs From Tomorrow respeita a sua privacidade e se compromete a proteger os dados pessoais coletados através deste site.</p>'
                .'<h2>Quais dados coletamos</h2>'
                .'<p>Coletamos apenas os dados fornecidos voluntariamente através do formulário de contato/orçamento, como nome, e-mail, telefone e a descrição do serviço desejado.</p>'
                .'<h2>Como usamos seus dados</h2>'
                .'<ul><li>Para responder às suas solicitações de orçamento ou contato.</li><li>Para melhorar nossos serviços e atendimento.</li></ul>'
                .'<h2>Compartilhamento</h2>'
                .'<p>Não vendemos nem compartilhamos seus dados pessoais com terceiros, exceto quando exigido por lei.</p>'
                .'<h2>Seus direitos</h2>'
                .'<p>Você pode solicitar a atualização ou exclusão dos seus dados a qualquer momento entrando em contato pelo e-mail contato@devsfromtomorrow.com.</p>',
            'terms_of_use' => '<p>Ao utilizar este site, você concorda com os termos descritos abaixo.</p>'
                .'<h2>Uso do site</h2>'
                .'<p>O conteúdo deste site é fornecido apenas para fins informativos sobre os serviços da Devs From Tomorrow.</p>'
                .'<h2>Propriedade intelectual</h2>'
                .'<p>Todo o conteúdo, marca e identidade visual deste site pertencem à Devs From Tomorrow e não podem ser reproduzidos sem autorização.</p>'
                .'<h2>Limitação de responsabilidade</h2>'
                .'<p>Envidamos esforços para manter as informações deste site atualizadas, mas não garantimos a ausência total de erros.</p>'
                .'<h2>Alterações</h2>'
                .'<p>Estes termos podem ser atualizados a qualquer momento, sem aviso prévio.</p>',
        ]);
    }
}
