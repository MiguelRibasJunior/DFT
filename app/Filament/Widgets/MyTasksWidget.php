<?php

namespace App\Filament\Widgets;

use App\Enums\TaskStatus;
use App\Filament\Pages\MyTasks;
use App\Models\Task;
use Filament\Actions\Action;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;

class MyTasksWidget extends TableWidget
{
    protected static ?int $sort = 5;

    protected static bool $isLazy = false;

    protected int|string|array $columnSpan = 'full';

    protected static ?string $heading = 'Minhas tarefas';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Task::query()
                    ->assignedTo(auth()->id())
                    ->pending()
                    ->with('project')
                    ->prioritized()
                    ->limit(5)
            )
            ->columns([
                TextColumn::make('title')
                    ->label('Tarefa'),
                TextColumn::make('project.title')
                    ->label('Projeto'),
                TextColumn::make('priority')
                    ->label('Prioridade')
                    ->badge(),
                TextColumn::make('due_date')
                    ->label('Prazo')
                    ->date('d/m/Y')
                    ->placeholder('Sem prazo')
                    ->color(fn (Task $record) => $record->isOverdue() ? 'danger' : null)
                    ->weight(fn (Task $record) => $record->isOverdue() ? 'bold' : null),
            ])
            ->recordActions([
                Action::make('complete')
                    ->label('Concluir')
                    ->icon(Heroicon::OutlinedCheckCircle)
                    ->color('success')
                    ->action(fn (Task $record) => $record->moveToStatus(TaskStatus::Completed)),
            ])
            ->emptyStateHeading('Nenhuma tarefa atribuída a você')
            ->paginated(false);
    }

    protected function getTableHeaderActions(): array
    {
        return [
            Action::make('viewAll')
                ->label('Ver todas')
                ->icon(Heroicon::OutlinedArrowRight)
                ->url(fn () => MyTasks::getUrl()),
        ];
    }
}
