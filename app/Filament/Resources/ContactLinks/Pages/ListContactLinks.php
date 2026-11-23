<?php

namespace App\Filament\Resources\ContactLinks\Pages;

use App\Filament\Resources\ContactLinks\ContactLinkResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListContactLinks extends ListRecords
{
    protected static string $resource = ContactLinkResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
