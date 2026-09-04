<?php

namespace App\Filament\Resources\Projects\Pages;

use App\Enums\TaskStatus;
use App\Filament\Resources\Projects\ProjectResource;
use App\Models\Task;
use Filament\Actions\Action;
use Filament\Resources\Pages\Concerns\InteractsWithRecord;
use Filament\Resources\Pages\Page;
use Filament\Support\Icons\Heroicon;

class ProjectKanban extends Page
{
    use InteractsWithRecord;

    protected static string $resource = ProjectResource::class;

    protected string $view = 'filament.resources.projects.pages.project-kanban';

    public function mount(int|string $record): void
    {
        $this->record = $this->resolveRecord($record);

        abort_unless(static::getResource()::canEdit($this->getRecord()), 403);
    }

    public function getTitle(): string
    {
        return 'Kanban — '.$this->getRecord()->title;
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('overview')
                ->label('Visão geral')
                ->icon(Heroicon::OutlinedEye)
                ->url(fn () => ProjectResource::getUrl('overview', ['record' => $this->getRecord()])),
            Action::make('back')
                ->label('Editar projeto')
                ->icon(Heroicon::OutlinedPencilSquare)
                ->url(fn () => ProjectResource::getUrl('edit', ['record' => $this->getRecord()])),
        ];
    }

    /**
     * @return array<string, array{status: TaskStatus, tasks: \Illuminate\Support\Collection<int, Task>}>
     */
    public function getColumns(): array
    {
        $tasks = $this->getRecord()
            ->tasks()
            ->with('assignee')
            ->orderBy('position')
            ->get();

        return collect(TaskStatus::cases())
            ->mapWithKeys(fn (TaskStatus $status) => [
                $status->value => [
                    'status' => $status,
                    'tasks' => $tasks->where('status', $status),
                ],
            ])
            ->all();
    }

    public function moveTask(int|string $taskId, string $status): void
    {
        $statusEnum = TaskStatus::tryFrom($status);

        if ($statusEnum === null) {
            return;
        }

        $task = $this->getRecord()->tasks()->find($taskId);

        if ($task === null) {
            return;
        }

        $newPosition = $this->getRecord()
            ->tasks()
            ->where('status', $statusEnum->value)
            ->max('position');

        $task->moveToStatus($statusEnum, ($newPosition ?? -1) + 1);
    }
}
