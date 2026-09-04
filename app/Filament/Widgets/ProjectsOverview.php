<?php

namespace App\Filament\Widgets;

use App\Enums\ProjectManagementStatus;
use App\Models\Project;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class ProjectsOverview extends StatsOverviewWidget
{
    protected static ?int $sort = 1;

    protected static bool $isLazy = false;

    protected ?string $heading = 'Projetos';

    protected function getStats(): array
    {
        $total = Project::count();
        $planning = Project::where('management_status', ProjectManagementStatus::Planning)->count();
        $inProgress = Project::where('management_status', ProjectManagementStatus::InProgress)->count();
        $review = Project::where('management_status', ProjectManagementStatus::Review)->count();
        $overdue = Project::overdue()->count();
        $completed = Project::where('management_status', ProjectManagementStatus::Completed)->count();

        return [
            Stat::make('Total de projetos', $total),
            Stat::make('Em planejamento', $planning),
            Stat::make('Em andamento', $inProgress),
            Stat::make('Em revisão', $review),
            Stat::make('Atrasados', $overdue)
                ->extraAttributes(['class' => $overdue > 0 ? 'dft-stat-danger' : 'dft-stat-success']),
            Stat::make('Concluídos', $completed)
                ->extraAttributes(['class' => 'dft-stat-success']),
        ];
    }
}
