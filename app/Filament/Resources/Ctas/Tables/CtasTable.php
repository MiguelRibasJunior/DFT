<?php

namespace App\Filament\Resources\Ctas\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
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
                    ->searchable(['name', 'title']),
                TextColumn::make('position')
                    ->label('Posição')
                    ->placeholder('—'),
                TextColumn::make('button_text')
                    ->label('Botão'),
                IconColumn::make('active')
                    ->label('Ativo')
                    ->boolean(),
                TextColumn::make('order')
                    ->label('Ordem')
                    ->numeric()
                    ->sortable(),
            ])
            ->defaultSort('order')
            ->filters([
                TernaryFilter::make('active')
                    ->label('Ativo'),
            ])
            ->recordActions([
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
