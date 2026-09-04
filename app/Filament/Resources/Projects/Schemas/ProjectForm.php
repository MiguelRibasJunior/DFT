<?php

namespace App\Filament\Resources\Projects\Schemas;

use App\Enums\Priority;
use App\Enums\ProjectManagementStatus;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
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
                        Tab::make('Informações')
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
                                TagsInput::make('technologies')
                                    ->label('Tecnologias')
                                    ->placeholder('Digite e pressione Enter')
                                    ->columnSpanFull(),
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
                            ])->columns(2),
                        Tab::make('Gestão')
                            ->schema([
                                Select::make('management_status')
                                    ->label('Status')
                                    ->options(ProjectManagementStatus::class)
                                    ->required()
                                    ->default(ProjectManagementStatus::Planning),
                                Select::make('priority')
                                    ->label('Prioridade')
                                    ->options(Priority::class)
                                    ->required()
                                    ->default(Priority::Medium),
                                Select::make('manager_id')
                                    ->label('Responsável')
                                    ->relationship('manager', 'name')
                                    ->searchable()
                                    ->preload(),
                                TextInput::make('progress')
                                    ->label('Progresso (%)')
                                    ->numeric()
                                    ->default(0)
                                    ->minValue(0)
                                    ->maxValue(100)
                                    ->suffix('%')
                                    ->required()
                                    ->disabled(fn ($record) => $record?->tasks()->exists())
                                    ->dehydrated(fn ($record) => ! $record?->tasks()->exists())
                                    ->helperText(fn ($record) => $record?->tasks()->exists()
                                        ? 'Calculado automaticamente a partir das tarefas.'
                                        : null),
                                DatePicker::make('start_date')
                                    ->label('Início'),
                                DatePicker::make('due_date')
                                    ->label('Prazo'),
                                DateTimePicker::make('completed_at')
                                    ->label('Concluído em'),
                            ])->columns(2),
                        Tab::make('Links')
                            ->schema([
                                TextInput::make('project_url')
                                    ->label('URL do projeto')
                                    ->url(),
                                TextInput::make('github_url')
                                    ->label('URL do GitHub')
                                    ->url(),
                                TextInput::make('external_url')
                                    ->label('URL externa')
                                    ->url(),
                                Repeater::make('external_links')
                                    ->label('Outros links')
                                    ->schema([
                                        Select::make('label')
                                            ->label('Tipo')
                                            ->options([
                                                'Figma' => 'Figma',
                                                'Documentação' => 'Documentação',
                                                'Homologação' => 'Homologação',
                                                'Outro' => 'Outro',
                                            ])
                                            ->required(),
                                        TextInput::make('url')
                                            ->label('URL')
                                            ->url()
                                            ->required(),
                                    ])
                                    ->columns(2)
                                    ->addActionLabel('Adicionar link')
                                    ->defaultItems(0)
                                    ->columnSpanFull(),
                            ])->columns(2),
                        Tab::make('Publicação')
                            ->schema([
                                Select::make('status')
                                    ->label('Publicação')
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
