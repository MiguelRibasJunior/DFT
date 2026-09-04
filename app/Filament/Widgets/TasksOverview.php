<?php

namespace App\Filament\Widgets;

use App\Enums\TaskStatus;
use App\Models\Task;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class TasksOverview extends StatsOverviewWidget
{
    protected static ?int $sort = 2;

    protected static bool $isLazy = false;

    protected ?string $heading = 'Tarefas';

    protected function getStats(): array
    {
        $pending = Task::where('status', TaskStatus::Todo)->count();
        $inProgress = Task::where('status', TaskStatus::InProgress)->count();
        $review = Task::where('status', TaskStatus::Review)->count();
        $overdue = Task::overdue()->count();
        $completed = Task::where('status', TaskStatus::Completed)->count();

        return [
            Stat::make('Pendentes', $pending),
            Stat::make('Em andamento', $inProgress),
            Stat::make('Em revisão', $review),
            Stat::make('Atrasadas', $overdue)
                ->extraAttributes(['class' => $overdue > 0 ? 'dft-stat-danger' : 'dft-stat-success']),
            Stat::make('Concluídas', $completed)
                ->extraAttributes(['class' => 'dft-stat-success']),
        ];
    }
}
