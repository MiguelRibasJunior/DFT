@php
    use Filament\Support\Icons\Heroicon;

    $user = filament()->auth()->user();
    $role = $user?->getRoleNames()->first();
@endphp

@if ($user)
    <style>
        .dft-sidebar-divider {
            border-top: 1px solid var(--gray-200);
        }

        html.dark .dft-sidebar-divider {
            border-color: var(--gray-700);
        }

        .fi-sidebar-group + .fi-sidebar-group {
            border-top: 1px solid var(--gray-200);
            padding-top: 1rem;
            margin-top: 1rem;
        }

        html.dark .fi-sidebar-group + .fi-sidebar-group {
            border-color: var(--gray-700);
        }

        .dft-sidebar-account {
            display: flex;
            align-items: center;
            gap: 0.625rem;
            padding: 1rem;
        }

        .dft-sidebar-account-info {
            flex: 1;
            min-width: 0;
        }

        .dft-sidebar-account-name {
            font-size: 0.8125rem;
            font-weight: 600;
            color: var(--gray-950);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        html.dark .dft-sidebar-account-name {
            color: #fff;
        }

        .dft-sidebar-account-role {
            font-size: 0.75rem;
            color: var(--gray-500);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    </style>

    <div class="dft-sidebar-account dft-sidebar-divider">
        <x-filament-panels::avatar.user
            size="md"
            :user="$user"
            loading="lazy"
        />

        <div class="dft-sidebar-account-info">
            <div class="dft-sidebar-account-name">{{ filament()->getUserName($user) }}</div>
            @if ($role)
                <div class="dft-sidebar-account-role">{{ $role }}</div>
            @endif
        </div>

        <form action="{{ filament()->getLogoutUrl() }}" method="post">
            @csrf

            <x-filament::icon-button
                :icon="Heroicon::OutlinedArrowLeftEndOnRectangle"
                color="gray"
                tag="button"
                type="submit"
                :tooltip="__('filament-panels::widgets/account-widget.actions.logout.label')"
            />
        </form>
    </div>
@endif
