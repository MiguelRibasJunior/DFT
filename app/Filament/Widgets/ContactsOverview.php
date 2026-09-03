<?php

namespace App\Filament\Widgets;

use App\Models\ContactSubmission;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class ContactsOverview extends StatsOverviewWidget
{
    protected function getStats(): array
    {
        $total = ContactSubmission::count();
        $novas = ContactSubmission::where('status', 'nova')->count();
        $respondidas = ContactSubmission::where('status', 'respondida')->count();

        return [
            Stat::make('Total de Contatos', $total)
                ->description('Submissões recebidas pelo site')
                ->color('primary'),
            Stat::make('Novos', $novas)
                ->description('Aguardando atendimento')
                ->color($novas > 0 ? 'warning' : 'success'),
            Stat::make('Respondidos', $respondidas)
                ->description('Contatos já finalizados')
                ->color('success'),
        ];
    }
}
