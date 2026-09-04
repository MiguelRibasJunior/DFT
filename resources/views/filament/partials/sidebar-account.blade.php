@php
    use Filament\Support\Icons\Heroicon;

    $user = filament()->auth()->user();
@endphp

@if ($user)
    <div class="fi-sidebar-footer" style="padding: 0.75rem 1rem 1rem;">
        <x-filament::section>
            <x-filament-panels::avatar.user
                size="lg"
                :user="$user"
                loading="lazy"
            />

            <div class="fi-account-widget-main">
                <h2 class="fi-account-widget-heading">
                    {{ __('filament-panels::widgets/account-widget.welcome', ['app' => config('app.name')]) }}
                </h2>

                <p class="fi-account-widget-user-name">
                    {{ filament()->getUserName($user) }}
                </p>
            </div>

            <form
                action="{{ filament()->getLogoutUrl() }}"
                method="post"
                class="fi-account-widget-logout-form"
            >
                @csrf

                <x-filament::button
                    color="gray"
                    :icon="Heroicon::ArrowLeftEndOnRectangle"
                    labeled-from="sm"
                    tag="button"
                    type="submit"
                >
                    {{ __('filament-panels::widgets/account-widget.actions.logout.label') }}
                </x-filament::button>
            </form>
        </x-filament::section>
    </div>
@endif
