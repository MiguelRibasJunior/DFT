<?php

namespace App\Support;

use Closure;

/**
 * Destinos de link aceitos nos campos editáveis do admin (CTAs, rodapé).
 * Bloqueia esquemas perigosos como javascript: e data:.
 */
class LinkTarget
{
    public const PATTERN = '/^(https?:\/\/\S+|\/\S*|#[\w-]+|mailto:\S+|tel:\+?[\d\s().-]+)$/i';

    public const MESSAGE = 'Informe uma URL (https://…), uma âncora (#contato), um caminho (/…), mailto: ou tel:.';

    public static function isValid(string $value): bool
    {
        return preg_match(self::PATTERN, $value) === 1;
    }

    /**
     * Regra de validação para usar em campos do Filament via ->rule().
     */
    public static function rule(): Closure
    {
        return fn () => function (string $attribute, mixed $value, Closure $fail): void {
            if (! self::isValid((string) $value)) {
                $fail(self::MESSAGE);
            }
        };
    }
}
