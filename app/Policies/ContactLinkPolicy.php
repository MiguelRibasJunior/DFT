<?php

namespace App\Policies;

use App\Models\ContactLink;
use App\Models\User;

class ContactLinkPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['Super Admin', 'Admin', 'Editor']);
    }

    public function view(User $user, ContactLink $contactLink): bool
    {
        return $user->hasAnyRole(['Super Admin', 'Admin', 'Editor']);
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole(['Super Admin', 'Admin']);
    }

    public function update(User $user, ContactLink $contactLink): bool
    {
        return $user->hasAnyRole(['Super Admin', 'Admin']);
    }

    public function delete(User $user, ContactLink $contactLink): bool
    {
        return $user->hasAnyRole(['Super Admin', 'Admin']);
    }
}

