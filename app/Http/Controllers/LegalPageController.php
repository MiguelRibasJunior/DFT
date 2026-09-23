<?php

namespace App\Http\Controllers;

use App\Models\SiteSetting;
use Illuminate\Contracts\View\View;

class LegalPageController
{
    public function privacy(): View
    {
        $settings = SiteSetting::current();

        return view('legal.page', [
            'title' => 'Política de privacidade',
            'content' => $settings->privacy_policy,
            'updatedAt' => $settings->updated_at,
        ]);
    }

    public function terms(): View
    {
        $settings = SiteSetting::current();

        return view('legal.page', [
            'title' => 'Termos de uso',
            'content' => $settings->terms_of_use,
            'updatedAt' => $settings->updated_at,
        ]);
    }
}
