<?php

namespace App\Filament\Resources\ContactLinks\Pages;

use App\Filament\Resources\ContactLinks\ContactLinkResource;
use Filament\Resources\Pages\CreateRecord;

class CreateContactLink extends CreateRecord
{
    protected static string $resource = ContactLinkResource::class;
}
