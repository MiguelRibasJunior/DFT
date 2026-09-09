<?php

namespace App\Filament\Resources\ContactSubmissions\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ContactSubmissionForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Contato')
                    ->columns(2)
                    ->components([
                        TextInput::make('nome')->label('Nome')->disabled(),
                        TextInput::make('empresa')->label('Empresa')->disabled(),
                        TextInput::make('email')->label('E-mail')->disabled(),
                        TextInput::make('telefone')->label('Telefone')->disabled(),
                        TextInput::make('tipo_solucao')->label('Solução solicitada')->disabled()->columnSpanFull(),
                        Textarea::make('descricao')->label('Mensagem')->disabled()->columnSpanFull(),
                    ]),
                Section::make('Atendimento')
                    ->columns(2)
                    ->components([
                        Select::make('status')
                            ->label('Status')
                            ->options([
                                'nova' => 'Nova',
                                'lida' => 'Em atendimento',
                                'respondida' => 'Respondida',
                            ])
                            ->required(),
                        TextInput::make('email_trigger_status')
                            ->label('Notificação por e-mail')
                            ->disabled(),
                    ]),
            ]);
    }
}
