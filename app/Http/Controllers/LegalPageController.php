<?php

namespace App\Http\Controllers;

use App\Enums\ContactLinkType;
use App\Models\ContactLink;
use App\Models\SiteSetting;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Páginas legais fixas (/termos e /privacidade): só o necessário para o cabeçalho e o rodapé.
 * O e-mail é o do primeiro canal de contato ativo cadastrado no admin.
 *
 * É um controller (e não uma closure criada por uma função) porque `php artisan route:cache`, que o guia
 * de deploy manda rodar, serializa a closure errada e as duas páginas passavam a responder 500.
 */
class LegalPageController
{
    public function terms(): Response
    {
        return $this->render('Terms');
    }

    public function privacy(): Response
    {
        return $this->render('Privacy');
    }

    private function render(string $component): Response
    {
        $site = SiteSetting::current();

        // ATENÇÃO: as props de uma página Inertia vão para o HTML (data-page). Só campos escolhidos, nunca o model.
        return Inertia::render($component, [
            'settings' => [
                'site_name' => $site->site_name,
                'copyright_text' => $site->copyright_text,
                'email' => ContactLink::query()->active()->ordered()->where('type', ContactLinkType::Email)->value('value'),
            ],
        ]);
    }
}
