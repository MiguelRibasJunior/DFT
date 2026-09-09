@php
    $items = $this->getUpcoming();
@endphp

<x-filament-widgets::widget>
    <style>
        .dft-widget-card {
            background: #fff;
            border: 1px solid var(--gray-200);
            border-radius: 0.75rem;
            padding: 1rem 1.25rem;
        }

        html.dark .dft-widget-card {
            background: var(--gray-900);
            border-color: var(--gray-700);
        }

        .dft-widget-heading {
            font-size: 0.9375rem;
            font-weight: 700;
            color: var(--gray-950);
            margin-bottom: 0.125rem;
        }

        html.dark .dft-widget-heading {
            color: #fff;
        }

        .dft-widget-description {
            font-size: 0.75rem;
            color: var(--gray-500);
            margin-bottom: 0.875rem;
        }

        .dft-deadline-empty {
            font-size: 0.8125rem;
            color: var(--gray-400);
        }

        .dft-deadline-list {
            display: flex;
            flex-direction: column;
            gap: 0.625rem;
        }

        .dft-deadline-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.75rem;
            text-decoration: none;
        }

        .dft-deadline-left {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            min-width: 0;
        }

        .dft-deadline-type {
            display: inline-flex;
            padding: 0.0625rem 0.5rem;
            border-radius: 9999px;
            font-size: 0.6875rem;
            font-weight: 600;
            flex-shrink: 0;
        }

        .dft-deadline-title {
            font-size: 0.8125rem;
            color: var(--gray-950);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        html.dark .dft-deadline-title {
            color: #fff;
        }

        .dft-deadline-date {
            font-size: 0.75rem;
            color: var(--gray-500);
            white-space: nowrap;
            flex-shrink: 0;
        }
    </style>

    <div class="dft-widget-card">
        <div class="dft-widget-heading">Próximos prazos</div>
        <div class="dft-widget-description">Projetos e tarefas com prazo nos próximos 14 dias</div>

        @if ($items->isEmpty())
            <p class="dft-deadline-empty">Nenhum prazo nos próximos 14 dias.</p>
        @else
            <ul class="dft-deadline-list">
                @foreach ($items as $item)
                    <li>
                        <a href="{{ $item['url'] }}" class="dft-deadline-row">
                            <span class="dft-deadline-left">
                                <span
                                    class="dft-deadline-type"
                                    style="background: color-mix(in oklch, var(--{{ $item['type'] === 'Projeto' ? 'primary' : 'gray' }}-500) 15%, transparent); color: var(--{{ $item['type'] === 'Projeto' ? 'primary' : 'gray' }}-600)"
                                >
                                    {{ $item['type'] }}
                                </span>
                                <span class="dft-deadline-title">{{ $item['title'] }}</span>
                            </span>
                            <span class="dft-deadline-date">{{ $item['due_date']->format('d/m/Y') }}</span>
                        </a>
                    </li>
                @endforeach
            </ul>
        @endif
    </div>
</x-filament-widgets::widget>
