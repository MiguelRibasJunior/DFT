<?php

namespace App\Enums;

use Filament\Support\Contracts\HasColor;
use Filament\Support\Contracts\HasLabel;

enum ProjectManagementStatus: string implements HasColor, HasLabel
{
    case Planning = 'planning';
    case InProgress = 'in_progress';
    case Review = 'review';
    case Blocked = 'blocked';
    case Completed = 'completed';
    case Archived = 'archived';

    public function getLabel(): string
    {
        return match ($this) {
            self::Planning => 'Planejamento',
            self::InProgress => 'Em andamento',
            self::Review => 'Em revisão',
            self::Blocked => 'Bloqueado',
            self::Completed => 'Concluído',
            self::Archived => 'Arquivado',
        };
    }

    public function getColor(): string
    {
        return match ($this) {
            self::Planning => 'gray',
            self::InProgress => 'info',
            self::Review => 'warning',
            self::Blocked => 'danger',
            self::Completed => 'success',
            self::Archived => 'gray',
        };
    }

    public function isFinal(): bool
    {
        return match ($this) {
            self::Completed, self::Archived => true,
            default => false,
        };
    }
}
