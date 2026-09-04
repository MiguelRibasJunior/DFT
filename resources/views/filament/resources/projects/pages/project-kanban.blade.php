<x-filament-panels::page>
    <style>
        .dft-kanban-board {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 1rem;
            align-items: start;
        }

        @media (max-width: 1024px) {
            .dft-kanban-board {
                grid-template-columns: 1fr;
            }
        }

        .dft-kanban-column {
            background: var(--gray-50);
            border: 1px solid var(--gray-200);
            border-radius: 0.75rem;
            padding: 0.75rem;
            min-height: 8rem;
        }

        @media (prefers-color-scheme: dark) {
            :root:not([data-theme="light"]) .dft-kanban-column {
                background: color-mix(in oklch, var(--gray-900) 40%, transparent);
                border-color: var(--gray-700);
            }
        }

        :root[data-theme="dark"] .dft-kanban-column {
            background: color-mix(in oklch, var(--gray-900) 40%, transparent);
            border-color: var(--gray-700);
        }

        .dft-kanban-column-header {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.25rem 0.25rem 0.75rem;
            font-size: 0.8125rem;
            font-weight: 600;
            color: var(--gray-700);
        }

        @media (prefers-color-scheme: dark) {
            :root:not([data-theme="light"]) .dft-kanban-column-header {
                color: var(--gray-200);
            }
        }

        :root[data-theme="dark"] .dft-kanban-column-header {
            color: var(--gray-200);
        }

        .dft-kanban-dot {
            width: 0.5rem;
            height: 0.5rem;
            border-radius: 9999px;
            flex-shrink: 0;
        }

        .dft-kanban-count {
            margin-left: auto;
            font-weight: 400;
            color: var(--gray-500);
        }

        .dft-kanban-column-body {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            min-height: 3rem;
        }

        .dft-kanban-column-body.dft-kanban-dragover {
            outline: 2px dashed var(--primary-500);
            outline-offset: 2px;
            border-radius: 0.5rem;
        }

        .dft-kanban-card {
            background: #fff;
            border: 1px solid var(--gray-200);
            border-radius: 0.5rem;
            padding: 0.625rem 0.75rem;
            cursor: grab;
            box-shadow: 0 1px 2px rgb(0 0 0 / 0.04);
        }

        @media (prefers-color-scheme: dark) {
            :root:not([data-theme="light"]) .dft-kanban-card {
                background: var(--gray-800);
                border-color: var(--gray-700);
            }
        }

        :root[data-theme="dark"] .dft-kanban-card {
            background: var(--gray-800);
            border-color: var(--gray-700);
        }

        .dft-kanban-card:active {
            cursor: grabbing;
        }

        .dft-kanban-card.dft-kanban-dragging {
            opacity: 0.4;
        }

        .dft-kanban-card-title {
            font-size: 0.875rem;
            font-weight: 500;
            color: var(--gray-950);
            margin-bottom: 0.5rem;
        }

        @media (prefers-color-scheme: dark) {
            :root:not([data-theme="light"]) .dft-kanban-card-title {
                color: #fff;
            }
        }

        :root[data-theme="dark"] .dft-kanban-card-title {
            color: #fff;
        }

        .dft-kanban-card-meta {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.5rem;
            font-size: 0.75rem;
            color: var(--gray-500);
        }

        .dft-kanban-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
            padding: 0.0625rem 0.5rem;
            border-radius: 9999px;
            font-size: 0.6875rem;
            font-weight: 600;
        }

        .dft-kanban-card-due {
            margin-top: 0.375rem;
            font-size: 0.75rem;
            color: var(--gray-500);
        }

        .dft-kanban-card-due.dft-kanban-overdue {
            color: var(--danger-600);
            font-weight: 600;
        }

        .dft-kanban-empty {
            font-size: 0.75rem;
            color: var(--gray-400);
            text-align: center;
            padding: 1rem 0;
        }
    </style>

    <div class="dft-kanban-board">
        @foreach ($this->getColumns() as $status => $column)
            <div class="dft-kanban-column">
                <div class="dft-kanban-column-header">
                    <span class="dft-kanban-dot" style="background: var(--{{ $column['status']->getColor() }}-500)"></span>
                    {{ $column['status']->getLabel() }}
                    <span class="dft-kanban-count">{{ $column['tasks']->count() }}</span>
                </div>

                <div
                    class="dft-kanban-column-body"
                    x-on:dragover.prevent="$el.classList.add('dft-kanban-dragover')"
                    x-on:dragleave="$el.classList.remove('dft-kanban-dragover')"
                    x-on:drop.prevent="
                        $el.classList.remove('dft-kanban-dragover');
                        $wire.moveTask($event.dataTransfer.getData('text/plain'), '{{ $status }}');
                    "
                >
                    @forelse ($column['tasks'] as $task)
                        <div
                            class="dft-kanban-card"
                            draggable="true"
                            x-on:dragstart="$event.dataTransfer.setData('text/plain', '{{ $task->id }}'); $event.target.classList.add('dft-kanban-dragging')"
                            x-on:dragend="$event.target.classList.remove('dft-kanban-dragging')"
                        >
                            <div class="dft-kanban-card-title">{{ $task->title }}</div>
                            <div class="dft-kanban-card-meta">
                                <span>{{ $task->assignee?->name ?? 'Sem responsável' }}</span>
                                <span
                                    class="dft-kanban-badge"
                                    style="background: color-mix(in oklch, var(--{{ $task->priority->getColor() }}-500) 15%, transparent); color: var(--{{ $task->priority->getColor() }}-600)"
                                >
                                    {{ $task->priority->getLabel() }}
                                </span>
                            </div>
                            @if ($task->due_date)
                                <div class="dft-kanban-card-due {{ $task->isOverdue() ? 'dft-kanban-overdue' : '' }}">
                                    Prazo: {{ $task->due_date->format('d/m/Y') }}
                                </div>
                            @endif
                        </div>
                    @empty
                        <p class="dft-kanban-empty">Sem tarefas</p>
                    @endforelse
                </div>
            </div>
        @endforeach
    </div>
</x-filament-panels::page>
