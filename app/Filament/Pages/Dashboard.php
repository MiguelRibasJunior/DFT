<?php

namespace App\Filament\Pages;

use App\Filament\Widgets\ProjectsOverview;
use App\Filament\Widgets\TasksOverview;
use Filament\Facades\Filament;
use Filament\Pages\Dashboard as BaseDashboard;

class Dashboard extends BaseDashboard
{
    public function getWidgets(): array
    {
        return array_values(array_filter(
            Filament::getWidgets(),
            fn ($widget) => ! in_array($widget, [ProjectsOverview::class, TasksOverview::class], true),
        ));
    }
}
