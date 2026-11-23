<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cta extends Model
{
    use HasFactory;

    /**
     * Posições do site que realmente consomem um CTA do admin.
     *
     * @var array<string, string>
     */
    public const POSITIONS = [
        'cta_section' => 'Seção final da Home',
    ];

    protected $fillable = [
        'name',
        'title',
        'subtitle',
        'button_text',
        'button_url',
        'position',
        'active',
        'order',
    ];

    protected $casts = [
        'active' => 'boolean',
        'order' => 'integer',
    ];

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('active', true);
    }

    public function scopeInPosition(Builder $query, string $position): Builder
    {
        return $query->where('position', $position);
    }

    /**
     * O CTA exibido numa posição é o primeiro ativo pela ordem de exibição.
     */
    public static function currentFor(string $position): ?self
    {
        return static::query()
            ->inPosition($position)
            ->active()
            ->orderBy('order')
            ->orderBy('id')
            ->first();
    }

    public function isShownOnSite(): bool
    {
        return $this->active && static::currentFor((string) $this->position)?->is($this) === true;
    }
}
