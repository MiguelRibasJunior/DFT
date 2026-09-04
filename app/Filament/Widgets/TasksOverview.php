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

    protected function getStats(): array
    {
        $pending = Task::where('status', TaskStatus::Todo)->count();
        $inProgress = Task::where('status', TaskStatus::InProgress)->count();
        $review = Task::where('status', TaskStatus::Review)->count();
        $overdue = Task::overdue()->count();
        $completed = Task::where('status', TaskStatus::Completed)->count();

        return [
            Stat::make('Pendentes', $pending)
                ->color('gray'),
            Stat::make('Em andamento', $inProgress)
                ->color('info'),
            Stat::make('Em revisão', $review)
                ->color('warning'),
            Stat::make('Atrasadas', $overdue)
                ->color($overdue > 0 ? 'danger' : 'success'),
            Stat::make('Concluídas', $completed)
                ->color('success'),
        ];
    }
}
