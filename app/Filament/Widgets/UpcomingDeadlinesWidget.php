<?php

namespace App\Filament\Widgets;

use App\Enums\ProjectManagementStatus;
use App\Enums\TaskStatus;
use App\Filament\Resources\Projects\ProjectResource;
use App\Models\Project;
use App\Models\Task;
use Filament\Widgets\Widget;
use Illuminate\Support\Collection;

class UpcomingDeadlinesWidget extends Widget
{
    protected static ?int $sort = 6;

    protected static bool $isLazy = false;

    protected int|string|array $columnSpan = [
        'default' => 'full',
        'lg' => 1,
    ];

    protected string $view = 'filament.widgets.upcoming-deadlines';

    /**
     * @return Collection<int, array{type: string, title: string, due_date: \Illuminate\Support\Carbon, url: string}>
     */
    public function getUpcoming(): Collection
    {
        $windowEnd = now()->addDays(14)->endOfDay();

        $projects = Project::query()
            ->whereNotNull('due_date')
            ->whereBetween('due_date', [now()->startOfDay(), $windowEnd])
            ->whereNotIn('management_status', [ProjectManagementStatus::Completed->value, ProjectManagementStatus::Archived->value])
            ->get()
            ->map(fn (Project $project) => [
                'type' => 'Projeto',
                'title' => $project->title,
                'due_date' => $project->due_date,
                'url' => ProjectResource::getUrl('overview', ['record' => $project]),
            ]);

        $tasks = Task::query()
            ->whereNotNull('due_date')
            ->whereBetween('due_date', [now()->startOfDay(), $windowEnd])
            ->where('status', '!=', TaskStatus::Completed->value)
            ->with('project')
            ->get()
            ->map(fn (Task $task) => [
                'type' => 'Tarefa',
                'title' => $task->title,
                'due_date' => $task->due_date,
                'url' => ProjectResource::getUrl('edit', ['record' => $task->project_id]),
            ]);

        return $projects->concat($tasks)
            ->sortBy('due_date')
            ->take(8)
            ->values();
    }
}
