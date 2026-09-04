<?php

namespace App\Filament\Widgets;

use App\Models\ContactSubmission;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Carbon;

class ContactsChart extends ChartWidget
{
    protected static ?int $sort = 4;

    protected static bool $isLazy = false;

    protected ?string $heading = 'Contatos recebidos';

    protected function getData(): array
    {
        $days = collect(range(13, 0))->map(fn (int $i) => now()->subDays($i)->toDateString());

        $counts = ContactSubmission::query()
            ->selectRaw('date(created_at) as day, count(*) as total')
            ->whereDate('created_at', '>=', now()->subDays(13)->toDateString())
            ->groupBy('day')
            ->pluck('total', 'day');

        return [
            'datasets' => [
                [
                    'label' => 'Contatos',
                    'data' => $days->map(fn (string $day) => $counts[$day] ?? 0)->all(),
                    'borderColor' => '#2388FF',
                    'backgroundColor' => 'rgba(35, 136, 255, 0.15)',
                    'fill' => true,
                ],
            ],
            'labels' => $days->map(fn (string $day) => Carbon::parse($day)->format('d/m'))->all(),
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
