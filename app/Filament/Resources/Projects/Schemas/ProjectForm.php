<?php

namespace App\Filament\Resources\Projects\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class ProjectForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Tabs::make('Projeto')
                    ->columnSpanFull()
                    ->tabs([
                        Tab::make('Principal')
                            ->schema([
                                TextInput::make('title')
                                    ->label('Título')
                                    ->required()
                                    ->live(onBlur: true)
                                    ->afterStateUpdated(fn (string $state, callable $set) => $set('slug', Str::slug($state))),
                                TextInput::make('slug')
                                    ->label('Slug')
                                    ->required()
                                    ->unique(ignoreRecord: true),
                                TextInput::make('category')
                                    ->label('Categoria')
                                    ->required(),
                                TextInput::make('short_description')
                                    ->label('Descrição curta')
                                    ->required()
                                    ->maxLength(300)
                                    ->columnSpanFull(),
                                Textarea::make('description')
                                    ->label('Descrição completa')
                                    ->required()
                                    ->rows(6)
                                    ->columnSpanFull(),
                            ])->columns(2),
                        Tab::make('Mídia')
                            ->schema([
                                FileUpload::make('cover_image')
                                    ->label('Imagem de capa')
                                    ->image()
                                    ->directory('projects'),
                                FileUpload::make('gallery')
                                    ->label('Galeria de imagens')
                                    ->image()
                                    ->multiple()
                                    ->reorderable()
                                    ->directory('projects/gallery'),
                            ]),
                        Tab::make('Configurações')
                            ->schema([
                                Select::make('status')
                                    ->label('Status')
                                    ->options([
                                        'draft' => 'Rascunho',
                                        'published' => 'Publicado',
                                        'archived' => 'Arquivado',
                                    ])
                                    ->required()
                                    ->default('draft'),
                                Toggle::make('featured')
                                    ->label('Projeto em destaque'),
                                TextInput::make('order')
                                    ->label('Ordem de exibição')
                                    ->numeric()
                                    ->default(0)
                                    ->required(),
                                DateTimePicker::make('published_at')
                                    ->label('Publicado em'),
                                TextInput::make('external_url')
                                    ->label('URL externa')
                                    ->url(),
                                TextInput::make('project_url')
                                    ->label('URL do projeto')
                                    ->url(),
                                TextInput::make('github_url')
                                    ->label('URL do GitHub')
                                    ->url(),
                            ])->columns(2),
                        Tab::make('SEO')
                            ->schema([
                                TextInput::make('meta_title')
                                    ->label('Meta título')
                                    ->maxLength(70),
                                TextInput::make('meta_description')
                                    ->label('Meta descrição')
                                    ->maxLength(160),
                                FileUpload::make('og_image')
                                    ->label('Imagem Open Graph')
                                    ->image()
                                    ->directory('projects/og'),
                            ]),
                    ]),
            ]);
    }
}
