<?php

namespace App\Filament\Resources\Projects\Pages;

use App\Enums\TaskStatus;
use App\Filament\Resources\Projects\ProjectResource;
use App\Models\Comment;
use Filament\Actions\Action;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\Concerns\InteractsWithRecord;
use Filament\Resources\Pages\Page;
use Filament\Support\Icons\Heroicon;
use Illuminate\Support\Collection;

class ProjectOverview extends Page
{
    use InteractsWithRecord;

    protected static string $resource = ProjectResource::class;

    protected string $view = 'filament.resources.projects.pages.project-overview';

    public string $newComment = '';

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

    /**
     * @return Collection<int, Comment>
     */
    public function getComments(): Collection
    {
        return $this->getRecord()->comments()->with('user')->orderByDesc('id')->get();
    }

    /**
     * @return Collection<int, \App\Models\Activity>
     */
    public function getActivities(): Collection
    {
        return $this->getRecord()->activities()->orderByDesc('id')->take(20)->get();
    }

    public function addComment(): void
    {
        $this->validate([
            'newComment' => ['required', 'string', 'max:2000'],
        ]);

        $this->getRecord()->comments()->create([
            'user_id' => auth()->id(),
            'content' => trim($this->newComment),
        ]);

        $this->newComment = '';

        Notification::make()
            ->title('Comentário adicionado')
            ->success()
            ->send();
    }

    public function deleteComment(int $commentId): void
    {
        $this->getRecord()->comments()->where('id', $commentId)->delete();
    }
}
