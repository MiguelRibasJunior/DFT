<?php

namespace App\Models;

use App\Enums\Priority;
use App\Enums\TaskStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    use HasFactory;

    protected $attributes = [
        'status' => 'todo',
        'priority' => 'medium',
    ];

    protected $fillable = [
        'project_id',
        'title',
        'description',
        'status',
        'priority',
        'assigned_to',
        'due_date',
        'completed_at',
        'position',
    ];

    protected $casts = [
        'status' => TaskStatus::class,
        'priority' => Priority::class,
        'due_date' => 'date',
        'completed_at' => 'datetime',
        'position' => 'integer',
    ];

    protected static function booted(): void
    {
        static::creating(function (Task $task) {
            if ($task->position === null) {
                $task->position = (static::where('project_id', $task->project_id)->max('position') ?? -1) + 1;
            }
        });

        static::saved(fn (Task $task) => $task->project?->recalculateProgress());
        static::deleted(fn (Task $task) => $task->project?->recalculateProgress());
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function moveToStatus(TaskStatus $status, ?int $position = null): void
    {
        $this->status = $status;
        $this->completed_at = $status === TaskStatus::Completed
            ? ($this->completed_at ?? now())
            : null;

        if ($position !== null) {
            $this->position = $position;
        }

        $this->save();
    }

    public function isOverdue(): bool
    {
        if (! $this->due_date) {
            return false;
        }

        return $this->due_date->isPast() && $this->status !== TaskStatus::Completed;
    }

    public function scopeOverdue(Builder $query): Builder
    {
        return $query
            ->whereNotNull('due_date')
            ->where('due_date', '<', now()->startOfDay())
            ->where('status', '!=', TaskStatus::Completed->value);
    }
}
