<?php

namespace App\Filament\Resources\Ctas\Tables;

use App\Models\Cta;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class CtasTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->label('Nome interno')
                    ->description(fn ($record) => $record->title)
                    ->searchable(['name', 'title'])
                    ->wrap()
                    ->extraAttributes(['style' => 'max-width: 220px']),
                TextColumn::make('position')
                    ->label('Posição')
                    ->formatStateUsing(fn (?string $state): string => Cta::POSITIONS[$state] ?? $state ?? '—')
                    ->wrap()
                    ->badge()
                    ->color(fn (?string $state): string => isset(Cta::POSITIONS[$state]) ? 'gray' : 'warning'),
                TextColumn::make('button_text')
                    ->label('Botão')
                    ->wrap(),
                IconColumn::make('active')
                    ->label('Ativo')
                    ->boolean(),
                IconColumn::make('shown')
                    ->label('No site')
                    ->tooltip('Aparece de fato no site: ativo e o primeiro da posição pela ordem.')
                    ->state(fn (Cta $record): bool => $record->isShownOnSite())
                    ->boolean(),
                TextColumn::make('order')
                    ->label('Ordem')
                    ->numeric()
                    ->sortable(),
            ])
            ->defaultSort('order')
            ->reorderable('order')
            ->filters([
                SelectFilter::make('position')
                    ->label('Posição')
                    ->options(Cta::POSITIONS),
                TernaryFilter::make('active')
                    ->label('Ativo'),
            ])
            ->recordActions([
                EditAction::make()->iconButton(),
                DeleteAction::make()->iconButton()->requiresConfirmation(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make()->requiresConfirmation(),
                ]),
            ]);
    }
}
