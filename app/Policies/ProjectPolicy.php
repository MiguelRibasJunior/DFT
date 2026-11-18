<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;

class ProjectPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['Super Admin', 'Admin', 'Editor']);
    }

    public function view(User $user, Project $project): bool
    {
        return $user->hasAnyRole(['Super Admin', 'Admin', 'Editor']);
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole(['Super Admin', 'Admin', 'Editor']);
    }

    public function update(User $user, Project $project): bool
    {
        return $user->hasAnyRole(['Super Admin', 'Admin', 'Editor']);
    }

    public function delete(User $user, Project $project): bool
    {
        return $user->hasAnyRole(['Super Admin', 'Admin']);
    }

    /** Lixeira: quem pode apagar também pode restaurar. */
    public function restore(User $user, Project $project): bool
    {
        return $user->hasAnyRole(['Super Admin', 'Admin']);
    }

    public function restoreAny(User $user): bool
    {
        return $user->hasAnyRole(['Super Admin', 'Admin']);
    }

    /** Exclusão definitiva e irreversível: só o Super Admin. */
    public function forceDelete(User $user, Project $project): bool
    {
        return $user->hasRole('Super Admin');
    }

    public function forceDeleteAny(User $user): bool
    {
        return $user->hasRole('Super Admin');
    }
}
