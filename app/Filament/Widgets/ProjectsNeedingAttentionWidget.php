<?php

namespace App\Filament\Widgets;

use App\Enums\Priority;
use App\Enums\ProjectManagementStatus;
use App\Filament\Resources\Projects\ProjectResource;
use App\Models\Project;
use Filament\Widgets\Widget;
use Illuminate\Support\Collection;

class ProjectsNeedingAttentionWidget extends Widget
{
    protected static ?int $sort = 7;

    protected static bool $isLazy = false;

    protected int|string|array $columnSpan = [
        'default' => 'full',
        'lg' => 1,
    ];

    protected string $view = 'filament.widgets.projects-needing-attention';

    /**
     * @return Collection<int, array{project: Project, reasons: array<int, string>, url: string}>
     */
    public function getProjects(): Collection
    {
        return Project::query()
            ->whereNotIn('management_status', [ProjectManagementStatus::Completed->value, ProjectManagementStatus::Archived->value])
            ->with('tasks')
            ->get()
            ->map(function (Project $project) {
                $reasons = [];

                if ($project->isOverdue()) {
                    $reasons[] = 'Projeto atrasado';
                }

                if ($project->tasks->contains(fn ($task) => $task->isOverdue())) {
                    $reasons[] = 'Tem tarefas atrasadas';
                }

                if ($project->priority === Priority::Urgent) {
                    $reasons[] = 'Prioridade urgente';
                }

                if (
                    $project->due_date
                    && ! $project->isOverdue()
                    && $project->due_date->lte(now()->addDays(7))
                    && $project->progress < 50
                ) {
                    $reasons[] = 'Prazo próximo com baixo progresso';
                }

                return [
                    'project' => $project,
                    'reasons' => $reasons,
                    'url' => ProjectResource::getUrl('overview', ['record' => $project]),
                ];
            })
            ->filter(fn (array $entry) => $entry['reasons'] !== [])
            ->values();
    }
}
