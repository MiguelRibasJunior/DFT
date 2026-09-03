<?php

namespace App\Filament\Resources\Ctas\Pages;

use App\Filament\Resources\Ctas\CtaResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditCta extends EditRecord
{
    protected static string $resource = CtaResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
