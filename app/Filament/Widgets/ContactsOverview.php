<?php

namespace App\Filament\Widgets;

use App\Models\ContactSubmission;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class ContactsOverview extends StatsOverviewWidget
{
    protected static ?int $sort = 3;

    protected static bool $isLazy = false;

    protected function getStats(): array
    {
        $total = ContactSubmission::count();
        $novas = ContactSubmission::where('status', 'nova')->count();
        $respondidas = ContactSubmission::where('status', 'respondida')->count();

        return [
            Stat::make('Total de Contatos', $total)
                ->description('Submissões recebidas pelo site'),
            Stat::make('Novos', $novas)
                ->description('Aguardando atendimento')
                ->descriptionColor($novas > 0 ? 'warning' : 'success')
                ->extraAttributes(['class' => $novas > 0 ? 'dft-stat-warning' : 'dft-stat-success']),
            Stat::make('Respondidos', $respondidas)
                ->description('Contatos já finalizados')
                ->extraAttributes(['class' => 'dft-stat-success']),
        ];
    }
}
