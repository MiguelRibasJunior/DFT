<?php

namespace App\Filament\Resources\Messages\Schemas;

use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class MessageForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Remetente')
                    ->columns(3)
                    ->components([
                        TextInput::make('sender_name')
                            ->label('Nome')
                            ->required(),
                        TextInput::make('sender_email')
                            ->label('E-mail')
                            ->email()
                            ->required(),
                        TextInput::make('sender_phone')
                            ->label('Telefone')
                            ->tel(),
                    ]),
                Section::make('Mensagem')
                    ->components([
                        TextInput::make('subject')
                            ->label('Assunto')
                            ->required()
                            ->columnSpanFull(),
                        Textarea::make('body')
                            ->label('Mensagem')
                            ->required()
                            ->rows(6)
                            ->columnSpanFull(),
                    ]),
                Section::make('Status')
                    ->columns(2)
                    ->components([
                        Toggle::make('read')
                            ->label('Lida'),
                        Toggle::make('archived')
                            ->label('Arquivada'),
                    ]),
            ]);
    }
}
