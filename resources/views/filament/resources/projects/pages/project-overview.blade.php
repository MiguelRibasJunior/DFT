@php
    $project = $this->getRecord();
    $stats = $this->getStats();
@endphp

<x-filament-panels::page>
    <style>
        .dft-ov-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 1.5rem;
            margin-bottom: 1.5rem;
        }

        .dft-ov-meta-item {
            display: flex;
            flex-direction: column;
            gap: 0.125rem;
        }

        .dft-ov-meta-label {
            font-size: 0.6875rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--gray-500);
        }

        .dft-ov-meta-value {
            font-size: 0.9375rem;
            font-weight: 500;
            color: var(--gray-950);
        }

        @media (prefers-color-scheme: dark) {
            :root:not([data-theme="light"]) .dft-ov-meta-value {
                color: #fff;
            }
        }

        :root[data-theme="dark"] .dft-ov-meta-value {
            color: #fff;
        }

        .dft-ov-meta-value.dft-ov-overdue {
            color: var(--danger-600);
        }

        .dft-ov-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.375rem;
            padding: 0.125rem 0.625rem;
            border-radius: 9999px;
            font-size: 0.8125rem;
            font-weight: 600;
            width: fit-content;
        }

        .dft-ov-progress-section {
            margin-bottom: 1.5rem;
        }

        .dft-ov-progress-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 0.375rem;
            font-size: 0.8125rem;
            font-weight: 600;
            color: var(--gray-700);
        }

        @media (prefers-color-scheme: dark) {
            :root:not([data-theme="light"]) .dft-ov-progress-header {
                color: var(--gray-200);
            }
        }

        :root[data-theme="dark"] .dft-ov-progress-header {
            color: var(--gray-200);
        }

        .dft-ov-progress-value {
            font-size: 1rem;
            font-weight: 700;
            color: var(--primary-600);
        }

        .dft-ov-progress-track {
            width: 100%;
            height: 0.625rem;
            border-radius: 9999px;
            background: var(--gray-200);
            overflow: hidden;
        }

        @media (prefers-color-scheme: dark) {
            :root:not([data-theme="light"]) .dft-ov-progress-track {
                background: var(--gray-700);
            }
        }

        :root[data-theme="dark"] .dft-ov-progress-track {
            background: var(--gray-700);
        }

        .dft-ov-progress-fill {
            height: 100%;
            border-radius: 9999px;
            background: var(--primary-500);
        }

        .dft-ov-stats {
            display: grid;
            grid-template-columns: repeat(5, minmax(0, 1fr));
            gap: 0.75rem;
            margin-bottom: 1.5rem;
        }

        @media (max-width: 1024px) {
            .dft-ov-stats {
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }
        }

        .dft-ov-stat-card {
            border: 1px solid var(--gray-200);
            border-radius: 0.75rem;
            padding: 0.875rem 1rem;
        }

        @media (prefers-color-scheme: dark) {
            :root:not([data-theme="light"]) .dft-ov-stat-card {
                border-color: var(--gray-700);
            }
        }

        :root[data-theme="dark"] .dft-ov-stat-card {
            border-color: var(--gray-700);
        }

        .dft-ov-stat-value {
            font-size: 1.5rem;
            font-weight: 700;
            line-height: 1.2;
            color: var(--gray-950);
        }

        @media (prefers-color-scheme: dark) {
            :root:not([data-theme="light"]) .dft-ov-stat-value {
                color: #fff;
            }
        }

        :root[data-theme="dark"] .dft-ov-stat-value {
            color: #fff;
        }

        .dft-ov-stat-value.dft-ov-overdue {
            color: var(--danger-600);
        }

        .dft-ov-stat-label {
            font-size: 0.75rem;
            color: var(--gray-500);
            margin-top: 0.125rem;
        }

        .dft-ov-details {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 1rem 2rem;
            border-top: 1px solid var(--gray-200);
            padding-top: 1.25rem;
        }

        @media (max-width: 768px) {
            .dft-ov-details {
                grid-template-columns: 1fr;
            }
        }

        @media (prefers-color-scheme: dark) {
            :root:not([data-theme="light"]) .dft-ov-details {
                border-color: var(--gray-700);
            }
        }

        :root[data-theme="dark"] .dft-ov-details {
            border-color: var(--gray-700);
        }

        .dft-ov-links-list {
            display: flex;
            flex-direction: column;
            gap: 0.375rem;
        }

        .dft-ov-links-list a {
            color: var(--primary-600);
            font-size: 0.875rem;
            text-decoration: none;
        }

        .dft-ov-links-list a:hover {
            text-decoration: underline;
        }
    </style>

    <div class="dft-ov-meta">
        <div class="dft-ov-meta-item">
            <span class="dft-ov-meta-label">Status</span>
            <span class="dft-ov-badge" style="background: color-mix(in oklch, var(--{{ $project->management_status->getColor() }}-500) 15%, transparent); color: var(--{{ $project->management_status->getColor() }}-600)">
                {{ $project->management_status->getLabel() }}
            </span>
        </div>
        <div class="dft-ov-meta-item">
            <span class="dft-ov-meta-label">Prioridade</span>
            <span class="dft-ov-badge" style="background: color-mix(in oklch, var(--{{ $project->priority->getColor() }}-500) 15%, transparent); color: var(--{{ $project->priority->getColor() }}-600)">
                {{ $project->priority->getLabel() }}
            </span>
        </div>
        <div class="dft-ov-meta-item">
            <span class="dft-ov-meta-label">Responsável</span>
            <span class="dft-ov-meta-value">{{ $project->manager?->name ?? 'Sem responsável' }}</span>
        </div>
        <div class="dft-ov-meta-item">
            <span class="dft-ov-meta-label">Prazo</span>
            <span class="dft-ov-meta-value {{ $project->isOverdue() ? 'dft-ov-overdue' : '' }}">
                {{ $project->due_date?->format('d/m/Y') ?? 'Sem prazo' }}
            </span>
        </div>
    </div>

    <div class="dft-ov-progress-section">
        <div class="dft-ov-progress-header">
            <span>Progresso</span>
            <span class="dft-ov-progress-value">{{ $project->progress }}%</span>
        </div>
        <div class="dft-ov-progress-track">
            <div class="dft-ov-progress-fill" style="width: {{ $project->progress }}%"></div>
        </div>
    </div>

    <div class="dft-ov-stats">
        <div class="dft-ov-stat-card">
            <div class="dft-ov-stat-value">{{ $stats['total'] }}</div>
            <div class="dft-ov-stat-label">Total de tarefas</div>
        </div>
        <div class="dft-ov-stat-card">
            <div class="dft-ov-stat-value">{{ $stats['completed'] }}</div>
            <div class="dft-ov-stat-label">Concluídas</div>
        </div>
        <div class="dft-ov-stat-card">
            <div class="dft-ov-stat-value">{{ $stats['in_progress'] }}</div>
            <div class="dft-ov-stat-label">Em andamento</div>
        </div>
        <div class="dft-ov-stat-card">
            <div class="dft-ov-stat-value">{{ $stats['review'] }}</div>
            <div class="dft-ov-stat-label">Em revisão</div>
        </div>
        <div class="dft-ov-stat-card">
            <div class="dft-ov-stat-value {{ $stats['overdue'] > 0 ? 'dft-ov-overdue' : '' }}">{{ $stats['overdue'] }}</div>
            <div class="dft-ov-stat-label">Atrasadas</div>
        </div>
    </div>

    <div class="dft-ov-details">
        <div class="dft-ov-meta-item">
            <span class="dft-ov-meta-label">Início</span>
            <span class="dft-ov-meta-value">{{ $project->start_date?->format('d/m/Y') ?? 'Não definido' }}</span>
        </div>
        <div class="dft-ov-meta-item">
            <span class="dft-ov-meta-label">Última atualização</span>
            <span class="dft-ov-meta-value">{{ $project->updated_at->diffForHumans() }}</span>
        </div>
        <div class="dft-ov-meta-item" style="grid-column: 1 / -1;">
            <span class="dft-ov-meta-label">Links externos</span>
            @php
                $links = collect([
                    $project->project_url ? ['label' => 'Projeto', 'url' => $project->project_url] : null,
                    $project->github_url ? ['label' => 'GitHub', 'url' => $project->github_url] : null,
                    $project->external_url ? ['label' => 'Externo', 'url' => $project->external_url] : null,
                    ...collect($project->external_links ?? [])->map(fn ($link) => ['label' => $link['label'] ?? 'Link', 'url' => $link['url'] ?? null]),
                ])->filter(fn ($link) => filled($link['url'] ?? null));
            @endphp
            @if ($links->isEmpty())
                <span class="dft-ov-meta-value">Nenhum link cadastrado</span>
            @else
                <div class="dft-ov-links-list">
                    @foreach ($links as $link)
                        <a href="{{ $link['url'] }}" target="_blank" rel="noopener noreferrer">{{ $link['label'] }} — {{ $link['url'] }}</a>
                    @endforeach
                </div>
            @endif
        </div>
    </div>
</x-filament-panels::page>
