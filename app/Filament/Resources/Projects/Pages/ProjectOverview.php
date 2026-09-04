<?php

namespace App\Filament\Resources\Projects\Pages;

use App\Enums\TaskStatus;
use App\Filament\Resources\Projects\ProjectResource;
use Filament\Actions\Action;
use Filament\Resources\Pages\Concerns\InteractsWithRecord;
use Filament\Resources\Pages\Page;
use Filament\Support\Icons\Heroicon;

class ProjectOverview extends Page
{
    use InteractsWithRecord;

    protected static string $resource = ProjectResource::class;

    protected string $view = 'filament.resources.projects.pages.project-overview';

    public function mount(int|string $record): void
    {
        $this->record = $this->resolveRecord($record);

        abort_unless(static::getResource()::canView($this->getRecord()), 403);
    }

    public function getTitle(): string
    {
        return $this->getRecord()->title;
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('tasks')
                ->label('Ver tarefas')
                ->icon(Heroicon::OutlinedListBullet)
                ->url(fn () => ProjectResource::getUrl('edit', ['record' => $this->getRecord()])),
            Action::make('kanban')
                ->label('Ver Kanban')
                ->icon(Heroicon::OutlinedViewColumns)
                ->url(fn () => ProjectResource::getUrl('kanban', ['record' => $this->getRecord()])),
            Action::make('edit')
                ->label('Editar projeto')
                ->icon(Heroicon::OutlinedPencilSquare)
                ->url(fn () => ProjectResource::getUrl('edit', ['record' => $this->getRecord()])),
        ];
    }

    /**
     * @return array{total: int, completed: int, in_progress: int, review: int, overdue: int}
     */
    public function getStats(): array
    {
        $tasks = $this->getRecord()->tasks;

        return [
            'total' => $tasks->count(),
            'completed' => $tasks->where('status', TaskStatus::Completed)->count(),
            'in_progress' => $tasks->where('status', TaskStatus::InProgress)->count(),
            'review' => $tasks->where('status', TaskStatus::Review)->count(),
            'overdue' => $tasks->filter(fn ($task) => $task->isOverdue())->count(),
        ];
    }
}
