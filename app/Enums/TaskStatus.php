<?php

namespace App\Enums;

use Filament\Support\Contracts\HasColor;
use Filament\Support\Contracts\HasLabel;

enum TaskStatus: string implements HasColor, HasLabel
{
    case Todo = 'todo';
    case InProgress = 'in_progress';
    case Review = 'review';
    case Completed = 'completed';

    public function getLabel(): string
    {
        return match ($this) {
            self::Todo => 'A fazer',
            self::InProgress => 'Em andamento',
            self::Review => 'Em revisão',
            self::Completed => 'Concluído',
        };
    }

    public function getColor(): string
    {
        return match ($this) {
            self::Todo => 'gray',
            self::InProgress => 'info',
            self::Review => 'warning',
            self::Completed => 'success',
        };
    }
}
