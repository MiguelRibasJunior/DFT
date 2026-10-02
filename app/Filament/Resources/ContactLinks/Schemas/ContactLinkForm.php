<?php

namespace App\Filament\Resources\ContactLinks\Schemas;

use App\Enums\ContactLinkType;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Illuminate\Support\HtmlString;

class ContactLinkForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Canal de contato')
                    ->columns(2)
                    ->components([
                        Select::make('type')
                            ->label('Tipo (define o ícone)')
                            ->options(ContactLinkType::class)
                            ->required()
                            ->live()
                            ->afterStateUpdated(function (mixed $state, Get $get, Set $set): void {
                                $type = ContactLinkType::resolve($state);

                                if ($type && blank($get('label'))) {
                                    $set('label', $type->getLabel());
                                }
                            })
                            ->helperText('O ícone mostrado no site vem desta lista fixa.'),
                        TextInput::make('label')
                            ->label('Nome exibido')
                            ->required()
                            ->maxLength(60),
                        TextInput::make('value')
                            ->label(fn (Get $get): string => ContactLinkType::resolve($get('type'))?->valueLabel() ?? 'Valor')
                            ->helperText(fn (Get $get): ?string => ContactLinkType::resolve($get('type'))?->valueHint())
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->rule(fn (Get $get) => function (string $attribute, mixed $value, \Closure $fail) use ($get): void {
                                $type = ContactLinkType::resolve($get('type'));

                                if ($type && ($error = $type->validate((string) $value))) {
                                    $fail($error);
                                }
                            })
                            ->columnSpanFull(),
                        TextInput::make('order')
                            ->label('Ordem de exibição')
                            ->numeric()
                            ->minValue(0)
                            ->default(fn (): int => (int) (\App\Models\ContactLink::max('order') ?? -1) + 1)
                            ->required(),
                        Toggle::make('active')
                            ->label('Ativo')
                            ->helperText('Canais inativos não aparecem no site.')
                            ->default(true),
                    ]),
                Section::make('Link gerado')
                    ->components([
                        Placeholder::make('preview')
                            ->label('')
                            ->content(function (Get $get): HtmlString {
                                $type = ContactLinkType::resolve($get('type'));
                                $value = trim((string) $get('value'));

                                if (! $type || $value === '' || $type->validate($value) !== null) {
                                    return new HtmlString('<span style="opacity:.6">Preencha o tipo e um valor válido para ver o link que será usado no site.</span>');
                                }

                                $href = e($type->href($value));

                                return new HtmlString("<code>{$href}</code>");
                            }),
                    ]),
            ]);
    }
}
