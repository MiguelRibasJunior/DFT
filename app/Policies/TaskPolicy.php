<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;

class TaskPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['Super Admin', 'Admin', 'Editor']);
    }

    public function view(User $user, Task $task): bool
    {
        return $user->hasAnyRole(['Super Admin', 'Admin', 'Editor']);
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole(['Super Admin', 'Admin', 'Editor']);
    }

    public function update(User $user, Task $task): bool
    {
        return $user->hasAnyRole(['Super Admin', 'Admin', 'Editor']);
    }

    public function delete(User $user, Task $task): bool
    {
        return $user->hasAnyRole(['Super Admin', 'Admin']) || $task->assigned_to === $user->id;
    }
}

