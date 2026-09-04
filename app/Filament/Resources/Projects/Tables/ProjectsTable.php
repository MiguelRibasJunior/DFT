<?php

namespace App\Filament\Resources\Projects\Tables;

use App\Enums\Priority;
use App\Enums\ProjectManagementStatus;
use App\Filament\Resources\Projects\ProjectResource;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class ProjectsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('cover_image')
                    ->label('')
                    ->square(),
                TextColumn::make('title')
                    ->label('Projeto')
                    ->description(fn ($record) => $record->category)
                    ->searchable(['title', 'category']),
                TextColumn::make('management_status')
                    ->label('Status')
                    ->badge()
                    ->sortable(),
                TextColumn::make('progress')
                    ->label('Progresso')
                    ->formatStateUsing(fn (int $state): string => "{$state}%")
                    ->sortable(),
                TextColumn::make('manager.name')
                    ->label('Responsável')
                    ->placeholder('Sem responsável')
                    ->searchable(),
                TextColumn::make('due_date')
                    ->label('Prazo')
                    ->date('d/m/Y')
                    ->placeholder('Sem prazo')
                    ->color(fn ($record) => $record->isOverdue() ? 'danger' : null)
                    ->weight(fn ($record) => $record->isOverdue() ? 'bold' : null)
                    ->sortable(),
                TextColumn::make('priority')
                    ->label('Prioridade')
                    ->badge()
                    ->sortable(),
                TextColumn::make('updated_at')
                    ->label('Atualização')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
                TextColumn::make('status')
                    ->label('Publicação')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'published' => 'Publicado',
                        'draft' => 'Rascunho',
                        'archived' => 'Arquivado',
                        default => $state,
                    })
                    ->color(fn (string $state): string => match ($state) {
                        'published' => 'success',
                        'draft' => 'gray',
                        'archived' => 'warning',
                        default => 'gray',
                    })
                    ->toggleable(isToggledHiddenByDefault: true),
                IconColumn::make('featured')
                    ->label('Destaque')
                    ->boolean()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('order')
                    ->label('Ordem')
                    ->numeric()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('published_at')
                    ->label('Publicado em')
                    ->dateTime('d/m/Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('order')
            ->recordUrl(fn ($record) => ProjectResource::getUrl('overview', ['record' => $record]))
            ->filters([
                SelectFilter::make('management_status')
                    ->label('Status')
                    ->options(ProjectManagementStatus::class),
                SelectFilter::make('priority')
                    ->label('Prioridade')
                    ->options(Priority::class),
                SelectFilter::make('manager_id')
                    ->label('Responsável')
                    ->relationship('manager', 'name'),
                Filter::make('overdue')
                    ->label('Atrasados')
                    ->query(fn (Builder $query) => $query->overdue()),
                SelectFilter::make('status')
                    ->label('Publicação')
                    ->options([
                        'draft' => 'Rascunho',
                        'published' => 'Publicado',
                        'archived' => 'Arquivado',
                    ]),
                TernaryFilter::make('featured')
                    ->label('Destaque'),
            ])
            ->recordActions([
                Action::make('overview')
                    ->label('Visão geral')
                    ->icon(Heroicon::OutlinedEye)
                    ->url(fn ($record) => ProjectResource::getUrl('overview', ['record' => $record])),
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
