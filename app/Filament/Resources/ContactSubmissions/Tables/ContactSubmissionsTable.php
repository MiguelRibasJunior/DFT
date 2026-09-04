<?php

namespace App\Filament\Resources\ContactSubmissions\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class ContactSubmissionsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('nome')
                    ->label('Nome')
                    ->description(fn ($record) => $record->email)
                    ->searchable(['nome', 'email', 'empresa']),
                TextColumn::make('tipo_solucao')
                    ->label('Solução')
                    ->badge()
                    ->color('gray'),
                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'nova' => 'Nova',
                        'lida' => 'Em atendimento',
                        'respondida' => 'Respondida',
                        default => $state,
                    })
                    ->color(fn (string $state): string => match ($state) {
                        'nova' => 'info',
                        'lida' => 'warning',
                        'respondida' => 'success',
                        default => 'gray',
                    }),
                TextColumn::make('created_at')
                    ->label('Recebido em')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                SelectFilter::make('status')
                    ->label('Status')
                    ->options([
                        'nova' => 'Nova',
                        'lida' => 'Em atendimento',
                        'respondida' => 'Respondida',
                    ]),
            ])
            ->recordActions([
                EditAction::make()->label('Ver detalhes'),
                DeleteAction::make()->requiresConfirmation(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make()->requiresConfirmation(),
                ]),
            ]);
    }
}
