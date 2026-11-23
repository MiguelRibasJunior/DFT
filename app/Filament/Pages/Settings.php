<?php

namespace App\Filament\Pages;

use App\Filament\Resources\ContactLinks\ContactLinkResource;
use App\Models\SiteSetting;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Placeholder;
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

    public static function canAccess(): bool
    {
        return auth()->user()?->hasAnyRole(['Super Admin', 'Admin']) ?? false;
    }

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
                                    ->label('Onde editar contatos, redes sociais e rodapé')
                                    ->hiddenLabel()
                                    ->content(new HtmlString(
                                        'Contatos e redes sociais ficam em <a href="'.ContactLinkResource::getUrl().'" style="text-decoration:underline">Canais de contato</a>; '
                                        .'descrição, copyright, links e textos legais ficam em <a href="'.FooterSettings::getUrl().'" style="text-decoration:underline">Rodapé</a>.'
                                    ))
                                    ->columnSpanFull(),
                                TextInput::make('site_name')->label('Nome do site')->required(),
                                FileUpload::make('logo')
                                    ->label('Logo')
                                    ->helperText('Aparece no topo e no rodapé do site. Sem arquivo, o site usa a logo padrão.')
                                    ->image()
                                    ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'])
                                    ->maxSize(2048)
                                    ->disk('public')
                                    ->visibility('public')
                                    ->directory('settings'),
                                FileUpload::make('favicon')
                                    ->label('Favicon')
                                    ->helperText('Ícone da aba do navegador. Sem arquivo, o site usa o favicon padrão.')
                                    ->image()
                                    ->acceptedFileTypes(['image/x-icon', 'image/vnd.microsoft.icon', 'image/png', 'image/svg+xml'])
                                    ->maxSize(1024)
                                    ->disk('public')
                                    ->visibility('public')
                                    ->directory('settings'),
                            ])->columns(2),
                        Tab::make('SEO')
                            ->schema([
                                TextInput::make('meta_title')
                                    ->label('Meta título padrão')
                                    ->maxLength(70)
                                    ->helperText('Aparece na aba do navegador e no Google. Em branco = título padrão do site.'),
                                TextInput::make('meta_description')
                                    ->label('Meta descrição')
                                    ->maxLength(160)
                                    ->helperText('Resumo que aparece nos resultados do Google e nas prévias de link. Em branco = descrição padrão.'),
                                TextInput::make('meta_keywords')
                                    ->label('Palavras-chave')
                                    ->helperText('Separadas por vírgula. Em branco = palavras-chave padrão.'),
                                FileUpload::make('og_image')
                                    ->label('Imagem Open Graph')
                                    ->helperText('Imagem da prévia ao compartilhar o link (WhatsApp, LinkedIn). Ideal: 1200×630. Sem arquivo, usa a padrão.')
                                    ->image()
                                    ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp'])
                                    ->maxSize(2048)
                                    ->disk('public')
                                    ->visibility('public')
                                    ->directory('settings'),
                            ])->columns(2),
                        Tab::make('Integrações')
                            ->schema([
                                Placeholder::make('analytics_note')
                                    ->label('Quando os códigos de análise são carregados')
                                    ->hiddenLabel()
                                    ->content('Os códigos abaixo só valem em produção e com o ID preenchido. Ao preencher, o site passa a mostrar um aviso de cookies (LGPD): o Google só é carregado depois que o visitante aceita. Atualize a Política de Privacidade (Rodapé) para citar os cookies de análise. Deixe em branco para não usar analytics, e então não há aviso.')
                                    ->columnSpanFull(),
                                TextInput::make('google_analytics_id')
                                    ->label('Google Analytics ID')
                                    ->placeholder('G-XXXXXXXXXX')
                                    ->helperText('ID de medição do Google Analytics 4. Começa com G-.')
                                    ->regex(SiteSetting::GOOGLE_ANALYTICS_PATTERN)
                                    ->validationMessages(['regex' => 'Use o formato G-XXXXXXXXXX (letras maiúsculas e números).']),
                                TextInput::make('google_tag_manager_id')
                                    ->label('Google Tag Manager ID')
                                    ->placeholder('GTM-XXXXXXX')
                                    ->helperText('ID do contêiner do Tag Manager. Começa com GTM-.')
                                    ->regex(SiteSetting::GOOGLE_TAG_MANAGER_PATTERN)
                                    ->validationMessages(['regex' => 'Use o formato GTM-XXXXXXX (letras maiúsculas e números).']),
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
