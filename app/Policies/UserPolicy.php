<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['Super Admin', 'Admin']);
    }

    public function view(User $user, User $model): bool
    {
        return $user->hasAnyRole(['Super Admin', 'Admin']) || $user->id === $model->id;
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole(['Super Admin', 'Admin']);
    }

    public function update(User $user, User $model): bool
    {
        if ($model->hasRole('Super Admin') && ! $user->hasRole('Super Admin')) {
            return false;
        }

        return $user->hasAnyRole(['Super Admin', 'Admin']);
    }

    public function delete(User $user, User $model): bool
    {
        if ($user->id === $model->id) {
            return false;
        }

        if ($model->hasRole('Super Admin') && ! $user->hasRole('Super Admin')) {
            return false;
        }

        return $user->hasRole('Super Admin');
    }
}

