<?php

namespace App\Filament\Resources\ContactLinks;

use App\Filament\Resources\ContactLinks\Pages\CreateContactLink;
use App\Filament\Resources\ContactLinks\Pages\EditContactLink;
use App\Filament\Resources\ContactLinks\Pages\ListContactLinks;
use App\Filament\Resources\ContactLinks\Schemas\ContactLinkForm;
use App\Filament\Resources\ContactLinks\Tables\ContactLinksTable;
use App\Models\ContactLink;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class ContactLinkResource extends Resource
{
    protected static ?string $model = ContactLink::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedPhone;

    protected static string|\UnitEnum|null $navigationGroup = 'Site / Conteúdo';

    protected static ?string $navigationLabel = 'Canais de contato';

    protected static ?string $modelLabel = 'canal de contato';

    protected static ?string $pluralModelLabel = 'canais de contato';

    public static function form(Schema $schema): Schema
    {
        return ContactLinkForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ContactLinksTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListContactLinks::route('/'),
            'create' => CreateContactLink::route('/create'),
            'edit' => EditContactLink::route('/{record}/edit'),
        ];
    }
}
