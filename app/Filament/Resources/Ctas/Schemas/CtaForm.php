<?php

namespace App\Filament\Resources\Ctas\Schemas;

use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;
use Illuminate\Support\HtmlString;

class CtaForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('CTA')
                    ->columns(2)
                    ->components([
                        TextInput::make('name')
                            ->label('Nome interno')
                            ->required()
                            ->helperText('Usado só no painel, não aparece no site.'),
                        TextInput::make('position')
                            ->label('Posição no site')
                            ->placeholder('Ex: Hero, Seção CTA, Footer'),
                        TextInput::make('title')
                            ->label('Título')
                            ->live()
                            ->required()
                            ->columnSpanFull(),
                        TextInput::make('subtitle')
                            ->label('Subtítulo')
                            ->live()
                            ->columnSpanFull(),
                        TextInput::make('button_text')
                            ->label('Texto do botão')
                            ->live()
                            ->required(),
                        TextInput::make('button_url')
                            ->label('URL do botão')
                            ->url()
                            ->required(),
                        Toggle::make('active')
                            ->label('Ativo')
                            ->default(true),
                        TextInput::make('order')
                            ->label('Ordem de exibição')
                            ->numeric()
                            ->default(0)
                            ->required(),
                    ]),
                Section::make('Preview')
                    ->components([
                        Placeholder::make('preview')
                            ->label('')
                            ->content(function (Get $get): HtmlString {
                                $title = e($get('title') ?: 'Título do CTA');
                                $subtitle = e($get('subtitle') ?: '');
                                $buttonText = e($get('button_text') ?: 'Botão');

                                return new HtmlString(<<<HTML
                                    <div style="background:#080B14;border:1px solid #1E2A3D;border-radius:12px;padding:32px;text-align:center;font-family:sans-serif;">
                                        <div style="color:#F5F7FA;font-size:20px;font-weight:700;margin-bottom:6px;">{$title}</div>
                                        <div style="color:#AAB2C0;font-size:13px;margin-bottom:16px;">{$subtitle}</div>
                                        <span style="display:inline-block;padding:10px 22px;background:#2388FF;color:#fff;border-radius:8px;font-weight:600;font-size:13px;">{$buttonText}</span>
                                    </div>
                                HTML);
                            }),
                    ]),
            ]);
    }
}
