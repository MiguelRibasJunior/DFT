<?php

namespace App\Filament\Resources\Projects\RelationManagers;

use App\Enums\Priority;
use App\Enums\TaskStatus;
use Filament\Actions\Action;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Actions\BulkActionGroup;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class TasksRelationManager extends RelationManager
{
    protected static string $relationship = 'tasks';

    protected static bool $isLazy = false;

    protected static ?string $title = 'Tarefas';

    protected static ?string $modelLabel = 'tarefa';

    protected static ?string $pluralModelLabel = 'tarefas';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')
                    ->label('Título')
                    ->required()
                    ->columnSpanFull(),
                Textarea::make('description')
                    ->label('Descrição')
                    ->rows(3)
                    ->columnSpanFull(),
                Select::make('status')
                    ->label('Status')
                    ->options(TaskStatus::class)
                    ->required()
                    ->default(TaskStatus::Todo),
                Select::make('priority')
                    ->label('Prioridade')
                    ->options(Priority::class)
                    ->required()
                    ->default(Priority::Medium),
                Select::make('assigned_to')
                    ->label('Responsável')
                    ->relationship('assignee', 'name')
                    ->searchable()
                    ->preload(),
                DatePicker::make('due_date')
                    ->label('Prazo'),
            ])->columns(2);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('title')
            ->emptyStateHeading('Nenhuma tarefa cadastrada')
            ->emptyStateDescription('Crie uma tarefa para começar a acompanhar este projeto.')
            ->columns([
                TextColumn::make('title')
                    ->label('Título')
                    ->searchable(),
                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->sortable(),
                TextColumn::make('assignee.name')
                    ->label('Responsável')
                    ->placeholder('Sem responsável'),
                TextColumn::make('priority')
                    ->label('Prioridade')
                    ->badge()
                    ->sortable(),
                TextColumn::make('due_date')
                    ->label('Prazo')
                    ->date('d/m/Y')
                    ->placeholder('Sem prazo')
                    ->color(fn ($record) => $record->isOverdue() ? 'danger' : null)
                    ->weight(fn ($record) => $record->isOverdue() ? 'bold' : null)
                    ->sortable(),
            ])
            ->defaultSort('position')
            ->headerActions([
                CreateAction::make(),
            ])
            ->recordActions([
                Action::make('complete')
                    ->label('Concluir')
                    ->icon(Heroicon::OutlinedCheckCircle)
                    ->color('success')
                    ->visible(fn ($record) => $record->status !== TaskStatus::Completed)
                    ->action(fn ($record) => $record->moveToStatus(TaskStatus::Completed)),
                EditAction::make(),
                DeleteAction::make()->requiresConfirmation(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make()->requiresConfirmation(),
                ]),
            ]);
    }
}
