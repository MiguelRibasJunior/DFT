<?php

namespace App\Filament\Pages;

use App\Filament\Resources\ContactLinks\ContactLinkResource;
use App\Models\SiteSetting;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Illuminate\Support\HtmlString;

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
                                Placeholder::make('moved')
                                    ->label('')
                                    ->content(new HtmlString(
                                        'Contatos e redes sociais ficam em <a href="'.ContactLinkResource::getUrl().'" style="text-decoration:underline">Canais de contato</a>; '
                                        .'descrição, copyright, links e textos legais ficam em <a href="'.FooterSettings::getUrl().'" style="text-decoration:underline">Rodapé</a>.'
                                    ))
                                    ->columnSpanFull(),
                                TextInput::make('site_name')->label('Nome do site')->required(),
                                FileUpload::make('logo')->label('Logo')->image()->directory('settings'),
                                FileUpload::make('favicon')->label('Favicon')->image()->directory('settings'),
                            ])->columns(2),
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
