<?php

namespace App\Providers;

use App\Models\ContactLink;
use App\Models\SiteSetting;
use App\Support\PublicPageData;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        View::composer('app', function ($view) {
            $view->with('seo', PublicPageData::build(
                SiteSetting::current(),
                ContactLink::query()->active()->ordered()->get()
            ));
        });
    }
}