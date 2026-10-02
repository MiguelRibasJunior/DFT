<?php

namespace App\Models;

use App\Enums\ContactLinkType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactLink extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'label',
        'value',
        'order',
        'active',
    ];

    protected $casts = [
        'type' => ContactLinkType::class,
        'order' => 'integer',
        'active' => 'boolean',
    ];

    protected static function booted(): void
    {
        static::creating(function (ContactLink $link) {
            if ($link->order === null) {
                $link->order = (static::max('order') ?? -1) + 1;
            }
        });
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('active', true);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('order')->orderBy('id');
    }

    public function getHrefAttribute(): ?string
    {
        return $this->type->href($this->value);
    }
}
