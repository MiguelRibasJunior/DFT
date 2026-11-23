<?php

namespace App\Policies;

use App\Models\Message;
use App\Models\User;

class MessagePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['Super Admin', 'Admin', 'Editor']);
    }

    public function view(User $user, Message $message): bool
    {
        return $user->hasAnyRole(['Super Admin', 'Admin', 'Editor']);
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole(['Super Admin', 'Admin']);
    }

    public function update(User $user, Message $message): bool
    {
        return $user->hasAnyRole(['Super Admin', 'Admin']);
    }

    public function delete(User $user, Message $message): bool
    {
        return $user->hasAnyRole(['Super Admin', 'Admin']);
    }

    public function restore(User $user, Message $message): bool
    {
        return $user->hasAnyRole(['Super Admin', 'Admin']);
    }

    public function restoreAny(User $user): bool
    {
        return $user->hasAnyRole(['Super Admin', 'Admin']);
    }

    public function forceDelete(User $user, Message $message): bool
    {
        return $user->hasRole('Super Admin');
    }

    public function forceDeleteAny(User $user): bool
    {
        return $user->hasRole('Super Admin');
    }
}
