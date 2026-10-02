<?php

namespace App\Filament\Pages;

use App\Filament\Resources\ContactLinks\ContactLinkResource;
use App\Models\SiteSetting;
use App\Support\LinkTarget;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Illuminate\Support\HtmlString;

class FooterSettings extends Page
{
    protected string $view = 'filament.pages.settings';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedQueueList;

    protected static string|\UnitEnum|null $navigationGroup = 'Site / Conteúdo';

    protected static ?string $navigationLabel = 'Rodapé';

    protected static ?string $title = 'Rodapé do site';

    protected static ?string $slug = 'footer';

    public ?array $data = [];

    public function mount(): void
    {
        $settings = SiteSetting::current();

        $this->form->fill([
            'description' => $settings->description,
            'copyright_text' => $settings->copyright_text,
            'footer_links' => $settings->footerLinks(),
            'privacy_policy' => $settings->privacy_policy,
            'terms_of_use' => $settings->terms_of_use,
        ]);
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Sobre a empresa')
                    ->description('Texto apresentado ao lado do logo e linha de direitos autorais, no fim da página.')
                    ->columns(1)
                    ->components([
                        Textarea::make('description')
                            ->label('Descrição')
                            ->rows(3)
                            ->maxLength(300),
                        TextInput::make('copyright_text')
                            ->label('Texto de copyright')
                            ->maxLength(200),
                    ]),
                Section::make('Links de navegação')
                    ->description('Coluna "Navegação" do rodapé. Use #contato para rolar até uma seção da página ou uma URL completa para sites externos.')
                    ->components([
                        Repeater::make('footer_links')
                            ->label('')
                            ->schema([
                                TextInput::make('label')
                                    ->label('Texto')
                                    ->required()
                                    ->maxLength(40),
                                TextInput::make('url')
                                    ->label('Destino')
                                    ->placeholder('#solucoes ou https://…')
                                    ->required()
                                    ->rule(LinkTarget::rule()),
                            ])
                            ->columns(2)
                            ->reorderable()
                            ->maxItems(12)
                            ->addActionLabel('Adicionar link')
                            ->defaultItems(0),
                    ]),
                Section::make('Links legais')
                    ->description('Aparecem como "Política de privacidade" e "Termos de uso" no rodapé e abrem numa janela sobre a página.')
                    ->components([
                        RichEditor::make('privacy_policy')
                            ->label('Política de privacidade'),
                        RichEditor::make('terms_of_use')
                            ->label('Termos de uso'),
                    ]),
                Section::make('Redes sociais e contatos')
                    ->components([
                        \Filament\Forms\Components\Placeholder::make('contact_links_hint')
                            ->label('')
                            ->content(new HtmlString(
                                'Os ícones de contato do rodapé são gerenciados em '
                                .'<a href="'.ContactLinkResource::getUrl().'" style="text-decoration:underline">Canais de contato</a>.'
                            )),
                    ]),
            ])
            ->statePath('data');
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('save')
                ->label('Salvar rodapé')
                ->action('save'),
        ];
    }

    public function save(): void
    {
        $state = $this->form->getState();

        $state['footer_links'] = array_values($state['footer_links'] ?? []);

        SiteSetting::current()->update($state);

        Notification::make()
            ->title('Rodapé atualizado')
            ->success()
            ->send();
    }
}
