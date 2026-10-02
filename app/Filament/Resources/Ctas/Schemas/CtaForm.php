<?php

namespace App\Filament\Resources\Ctas\Schemas;

use App\Models\Cta;
use App\Support\LinkTarget;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Select;
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
                        Select::make('position')
                            ->label('Posição no site')
                            ->options(Cta::POSITIONS)
                            ->default('cta_section')
                            ->required()
                            ->helperText('Onde este CTA aparece. Se houver mais de um ativo na mesma posição, aparece o de menor ordem.'),
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
                            ->label('Destino do botão')
                            ->placeholder('#contato, https://…, mailto:… ou tel:…')
                            ->helperText('Use #contato para rolar até o formulário, uma URL completa, mailto: ou tel:.')
                            ->rule(LinkTarget::rule())
                            ->required(),
                        Toggle::make('active')
                            ->label('Ativo')
                            ->helperText('CTAs inativos nunca aparecem no site.')
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
