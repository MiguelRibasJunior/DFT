<?php

namespace App\Filament\Pages;

use App\Enums\TaskStatus;
use App\Filament\Resources\Projects\ProjectResource;
use App\Models\Task;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Pages\Page;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Concerns\InteractsWithTable;
use Filament\Tables\Contracts\HasTable;
use Filament\Tables\Table;

class MyTasks extends Page implements HasTable
{
    use InteractsWithTable;

    protected string $view = 'filament.pages.my-tasks';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCheckCircle;

    protected static string|\UnitEnum|null $navigationGroup = 'Gestão';

    protected static ?string $navigationLabel = 'Minhas tarefas';

    protected static ?string $title = 'Minhas tarefas';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Task::query()
                    ->assignedTo(auth()->id())
                    ->pending()
                    ->with('project')
                    ->prioritized()
            )
            ->columns([
                TextColumn::make('title')
                    ->label('Tarefa'),
                TextColumn::make('project.title')
                    ->label('Projeto'),
                TextColumn::make('status')
                    ->label('Status')
                    ->badge(),
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
                Action::make('viewProject')
                    ->label('Ver projeto')
                    ->icon(Heroicon::OutlinedEye)
                    ->url(fn (Task $record) => ProjectResource::getUrl('overview', ['record' => $record->project])),
            ])
            ->emptyStateHeading('Nenhuma tarefa atribuída a você')
            ->emptyStateDescription('Quando um projeto atribuir uma tarefa a você, ela aparece aqui.');
    }
}
