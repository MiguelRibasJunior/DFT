<?php

namespace App\Filament\Resources\Projects\Pages;

use App\Filament\Resources\Projects\ProjectResource;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;
use Filament\Support\Icons\Heroicon;

class EditProject extends EditRecord
{
    protected static string $resource = ProjectResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('kanban')
                ->label('Ver Kanban')
                ->icon(Heroicon::OutlinedViewColumns)
                ->url(fn () => ProjectResource::getUrl('kanban', ['record' => $this->getRecord()])),
            DeleteAction::make(),
        ];
    }
}
