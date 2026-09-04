<?php

namespace App\Filament\Pages;

use App\Models\SiteSetting;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;

class Settings extends Page
{
    protected string $view = 'filament.pages.settings';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCog6Tooth;

    protected static string|\UnitEnum|null $navigationGroup = 'Site / Conteúdo';

    protected static ?string $navigationLabel = 'Configurações';

    protected static ?string $title = 'Configurações do site';

    public ?array $data = [];

    public function mount(): void
    {
        $this->form->fill(SiteSetting::current()->toArray());
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Tabs::make('Configurações')
                    ->columnSpanFull()
                    ->tabs([
                        Tab::make('Geral')
                            ->schema([
                                TextInput::make('site_name')->label('Nome do site')->required(),
                                Textarea::make('description')->label('Descrição')->rows(2)->columnSpanFull(),
                                FileUpload::make('logo')->label('Logo')->image()->directory('settings'),
                                FileUpload::make('favicon')->label('Favicon')->image()->directory('settings'),
                            ])->columns(2),
                        Tab::make('Contato')
                            ->schema([
                                TextInput::make('phone')->label('Telefone')->tel(),
                                TextInput::make('whatsapp')->label('WhatsApp')->tel(),
                                TextInput::make('email')->label('E-mail')->email(),
                                TextInput::make('address')->label('Endereço')->columnSpanFull(),
                            ])->columns(2),
                        Tab::make('Redes sociais')
                            ->schema([
                                TextInput::make('instagram')->label('Instagram')->url(),
                                TextInput::make('facebook')->label('Facebook')->url(),
                                TextInput::make('linkedin')->label('LinkedIn')->url(),
                                TextInput::make('youtube')->label('YouTube')->url(),
                                TextInput::make('github')->label('GitHub')->url(),
                            ])->columns(2),
                        Tab::make('Links do rodapé')
                            ->schema([
                                Repeater::make('footer_links')
                                    ->label('Links rápidos')
                                    ->schema([
                                        TextInput::make('label')->label('Texto')->required(),
                                        TextInput::make('url')->label('URL')->required(),
                                    ])
                                    ->columns(2)
                                    ->reorderable()
                                    ->addActionLabel('Adicionar link')
                                    ->default([]),
                            ]),
                        Tab::make('SEO')
                            ->schema([
                                TextInput::make('meta_title')->label('Meta título padrão')->maxLength(70),
                                TextInput::make('meta_description')->label('Meta descrição')->maxLength(160),
                                TextInput::make('meta_keywords')->label('Palavras-chave'),
                                FileUpload::make('og_image')->label('Imagem Open Graph')->image()->directory('settings'),
                            ])->columns(2),
                        Tab::make('Integrações')
                            ->schema([
                                TextInput::make('google_analytics_id')->label('Google Analytics ID'),
                                TextInput::make('google_tag_manager_id')->label('Google Tag Manager ID'),
                                Textarea::make('extra_scripts')->label('Scripts adicionais')->rows(4)->columnSpanFull(),
                            ])->columns(2),
                        Tab::make('Rodapé')
                            ->schema([
                                TextInput::make('copyright_text')->label('Texto de copyright')->columnSpanFull(),
                                TextInput::make('privacy_url')->label('URL da política de privacidade'),
                                TextInput::make('terms_url')->label('URL dos termos de uso'),
                            ])->columns(2),
                    ]),
            ])
            ->statePath('data');
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('save')
                ->label('Salvar configurações')
                ->action('save'),
        ];
    }

    public function save(): void
    {
        SiteSetting::current()->update($this->form->getState());

        Notification::make()
            ->title('Configurações atualizadas')
            ->success()
            ->send();
    }
}
