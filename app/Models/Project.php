<?php

namespace App\Models;

use App\Enums\Priority;
use App\Enums\ProjectManagementStatus;
use App\Enums\TaskStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    use HasFactory;

    protected $attributes = [
        'management_status' => 'planning',
        'priority' => 'medium',
        'progress' => 0,
    ];

    protected $fillable = [
        'title',
        'slug',
        'short_description',
        'description',
        'category',
        'technologies',
        'cover_image',
        'gallery',
        'status',
        'featured',
        'order',
        'external_url',
        'project_url',
        'github_url',
        'external_links',
        'meta_title',
        'meta_description',
        'og_image',
        'published_at',
        'management_status',
        'priority',
        'manager_id',
        'progress',
        'start_date',
        'due_date',
        'completed_at',
    ];

    protected $casts = [
        'technologies' => 'array',
        'gallery' => 'array',
        'external_links' => 'array',
        'featured' => 'boolean',
        'order' => 'integer',
        'published_at' => 'datetime',
        'management_status' => ProjectManagementStatus::class,
        'priority' => Priority::class,
        'progress' => 'integer',
        'start_date' => 'date',
        'due_date' => 'date',
        'completed_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::updated(function (Project $project) {
            if (! auth()->check()) {
                return;
            }

            if ($project->wasChanged('due_date')) {
                $date = $project->due_date?->format('d/m/Y') ?? 'nenhum';
                Activity::log($project->id, "Prazo do projeto alterado para {$date}.");
            }

            if ($project->wasChanged('management_status')) {
                Activity::log($project->id, "Status do projeto alterado para {$project->management_status->getLabel()}.");
            }
        });
    }

    public function manager(): BelongsTo
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function activities(): HasMany
    {
        return $this->hasMany(Activity::class);
    }

    protected function setProgressAttribute(int $value): void
    {
        $this->attributes['progress'] = max(0, min(100, $value));
    }

    public function recalculateProgress(): void
    {
        $total = $this->tasks()->count();

        if ($total === 0) {
            return;
        }

        $completed = $this->tasks()->where('status', TaskStatus::Completed->value)->count();

        $this->progress = (int) round($completed / $total * 100);
        $this->saveQuietly();
    }

    public function isOverdue(): bool
    {
        if (! $this->due_date) {
            return false;
        }

        return $this->due_date->isPast() && ! $this->management_status->isFinal();
    }

    public function scopeOverdue(Builder $query): Builder
    {
        return $query
            ->whereNotNull('due_date')
            ->where('due_date', '<', now()->startOfDay())
            ->whereNotIn('management_status', [
                ProjectManagementStatus::Completed->value,
                ProjectManagementStatus::Archived->value,
            ]);
    }
}
