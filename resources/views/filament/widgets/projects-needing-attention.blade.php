@php
    $entries = $this->getProjects();
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

        .dft-attention-empty {
            font-size: 0.8125rem;
            color: var(--gray-400);
        }

        .dft-attention-list {
            display: flex;
            flex-direction: column;
            gap: 0.625rem;
        }

        .dft-attention-item {
            display: block;
            text-decoration: none;
            padding: 0.625rem 0.75rem;
            border: 1px solid var(--gray-200);
            border-radius: 0.5rem;
        }

        html.dark .dft-attention-item {
            border-color: var(--gray-700);
        }

        .dft-attention-title {
            font-size: 0.8125rem;
            font-weight: 600;
            color: var(--gray-950);
            margin-bottom: 0.375rem;
        }

        html.dark .dft-attention-title {
            color: #fff;
        }

        .dft-attention-reasons {
            display: flex;
            flex-wrap: wrap;
            gap: 0.375rem;
        }

        .dft-attention-reason {
            display: inline-flex;
            padding: 0.0625rem 0.5rem;
            border-radius: 9999px;
            font-size: 0.6875rem;
            font-weight: 600;
            background: color-mix(in oklch, var(--danger-500) 15%, transparent);
            color: var(--danger-600);
        }
    </style>

    <div class="dft-widget-card">
        <div class="dft-widget-heading">Projetos que precisam de atenção</div>
        <div class="dft-widget-description">Atrasados, com tarefas atrasadas, prioridade urgente ou perto do prazo com baixo progresso</div>

        @if ($entries->isEmpty())
            <p class="dft-attention-empty">Nenhum projeto precisa de atenção no momento.</p>
        @else
            <div class="dft-attention-list">
                @foreach ($entries as $entry)
                    <a href="{{ $entry['url'] }}" class="dft-attention-item">
                        <div class="dft-attention-title">{{ $entry['project']->title }}</div>
                        <div class="dft-attention-reasons">
                            @foreach ($entry['reasons'] as $reason)
                                <span class="dft-attention-reason">{{ $reason }}</span>
                            @endforeach
                        </div>
                    </a>
                @endforeach
            </div>
        @endif
    </div>
</x-filament-widgets::widget>
