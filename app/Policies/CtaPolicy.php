<?php

namespace App\Policies;

use App\Models\Cta;
use App\Models\User;

class CtaPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['Super Admin', 'Admin', 'Editor']);
    }

    public function view(User $user, Cta $cta): bool
    {
        return $user->hasAnyRole(['Super Admin', 'Admin', 'Editor']);
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole(['Super Admin', 'Admin']);
    }

    public function update(User $user, Cta $cta): bool
    {
        return $user->hasAnyRole(['Super Admin', 'Admin']);
    }

    public function delete(User $user, Cta $cta): bool
    {
        return $user->hasAnyRole(['Super Admin', 'Admin']);
    }
}

