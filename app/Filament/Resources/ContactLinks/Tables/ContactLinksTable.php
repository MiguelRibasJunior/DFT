<?php

namespace App\Filament\Resources\ContactLinks\Tables;

use App\Enums\ContactLinkType;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class ContactLinksTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('type')
                    ->label('Ícone')
                    ->badge()
                    ->color('gray'),
                TextColumn::make('label')
                    ->label('Nome exibido')
                    ->searchable(),
                TextColumn::make('value')
                    ->label('Valor')
                    ->limit(40)
                    ->tooltip(fn ($record): string => $record->value)
                    ->searchable(),
                ToggleColumn::make('active')
                    ->label('Ativo'),
            ])
            ->defaultSort('order')
            ->reorderable('order')
            ->filters([
                SelectFilter::make('type')
                    ->label('Tipo')
                    ->options(ContactLinkType::class),
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
