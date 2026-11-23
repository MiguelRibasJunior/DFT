<?php

namespace App\Filament\Resources\ContactLinks\Pages;

use App\Filament\Resources\ContactLinks\ContactLinkResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditContactLink extends EditRecord
{
    protected static string $resource = ContactLinkResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make()->requiresConfirmation(),
        ];
    }
}
