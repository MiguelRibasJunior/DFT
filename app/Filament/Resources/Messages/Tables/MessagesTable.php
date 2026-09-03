<?php

namespace App\Filament\Resources\Messages\Tables;

use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Illuminate\Database\Eloquent\Builder;
use Filament\Tables\Table;

class MessagesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('sender_name')
                    ->label('Remetente')
                    ->weight(fn ($record) => $record->read ? null : 'bold')
                    ->description(fn ($record) => $record->subject)
                    ->searchable(['sender_name', 'subject']),
                TextColumn::make('body')
                    ->label('Prévia')
                    ->limit(60)
                    ->color('gray'),
                TextColumn::make('created_at')
                    ->label('Data')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Filter::make('unread')
                    ->label('Não lidas')
                    ->query(fn (Builder $query) => $query->where('read', false)->where('archived', false)),
                Filter::make('read')
                    ->label('Lidas')
                    ->query(fn (Builder $query) => $query->where('read', true)->where('archived', false)),
                Filter::make('archived')
                    ->label('Arquivadas')
                    ->query(fn (Builder $query) => $query->where('archived', true)),
            ])
            ->recordActions([
                EditAction::make()->label('Abrir'),
                Action::make('toggleRead')
                    ->label(fn ($record) => $record->read ? 'Marcar não lida' : 'Marcar lida')
                    ->icon(Heroicon::OutlinedEnvelope)
                    ->action(fn ($record) => $record->update(['read' => ! $record->read])),
                Action::make('toggleArchived')
                    ->label(fn ($record) => $record->archived ? 'Desarquivar' : 'Arquivar')
                    ->icon(Heroicon::OutlinedArchiveBox)
                    ->action(fn ($record) => $record->update(['archived' => ! $record->archived])),
                DeleteAction::make()->requiresConfirmation(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make()->requiresConfirmation(),
                ]),
            ]);
    }
}
