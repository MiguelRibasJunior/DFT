<?php

namespace App\Filament\Resources\Projects\Pages;

use App\Filament\Resources\Projects\ProjectResource;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\RestoreAction;
use Filament\Resources\Pages\EditRecord;
use Filament\Support\Icons\Heroicon;

class EditProject extends EditRecord
{
    protected static string $resource = ProjectResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('overview')
                ->label('Visão geral')
                ->icon(Heroicon::OutlinedEye)
                ->url(fn () => ProjectResource::getUrl('overview', ['record' => $this->getRecord()])),
            Action::make('kanban')
                ->label('Ver Kanban')
                ->icon(Heroicon::OutlinedViewColumns)
                ->url(fn () => ProjectResource::getUrl('kanban', ['record' => $this->getRecord()])),
            DeleteAction::make()
                ->modalDescription('O projeto sai do site e da lista, mas vai para a lixeira e pode ser restaurado depois.'),
            RestoreAction::make(),
            ForceDeleteAction::make()
                ->modalDescription('Exclusão definitiva: o projeto, suas tarefas, comentários e atividades não poderão ser recuperados.'),
        ];
    }
}
