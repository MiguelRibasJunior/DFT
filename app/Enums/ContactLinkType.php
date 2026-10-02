<?php

namespace App\Enums;

use Filament\Support\Contracts\HasLabel;

/**
 * Catálogo fechado de canais de contato. O valor do enum é também a chave do
 * ícone no frontend — o admin escolhe da lista e nunca envia SVG/HTML.
 */
enum ContactLinkType: string implements HasLabel
{
    case Whatsapp = 'whatsapp';
    case Email = 'email';
    case Phone = 'phone';
    case Instagram = 'instagram';
    case Linkedin = 'linkedin';
    case Github = 'github';
    case Website = 'website';
    case Address = 'address';

    /**
     * Aceita a instância, a string do valor ou vazio (estado de formulário).
     */
    public static function resolve(mixed $value): ?self
    {
        return $value instanceof self ? $value : self::tryFrom((string) $value);
    }

    public function getLabel(): string
    {
        return match ($this) {
            self::Whatsapp => 'WhatsApp',
            self::Email => 'E-mail',
            self::Phone => 'Telefone',
            self::Instagram => 'Instagram',
            self::Linkedin => 'LinkedIn',
            self::Github => 'GitHub',
            self::Website => 'Site',
            self::Address => 'Endereço',
        };
    }

    public function valueLabel(): string
    {
        return match ($this) {
            self::Whatsapp, self::Phone => 'Número com DDD',
            self::Email => 'Endereço de e-mail',
            self::Address => 'Endereço completo',
            default => 'URL do perfil ou página',
        };
    }

    public function valueHint(): string
    {
        return match ($this) {
            self::Whatsapp => 'Ex: (11) 99999-9999. O link do WhatsApp é gerado automaticamente.',
            self::Phone => 'Ex: (11) 3333-4444.',
            self::Email => 'Ex: contato@devsfromtomorrow.com.',
            self::Instagram => 'Ex: https://www.instagram.com/devsfromtomorrow/',
            self::Linkedin => 'Ex: https://www.linkedin.com/company/devs-from-tomorrow',
            self::Github => 'Ex: https://github.com/devs-from-tomorrow',
            self::Website => 'Ex: https://devsfromtomorrow.com',
            self::Address => 'O link para o Google Maps é gerado automaticamente.',
        };
    }

    /**
     * Mensagem de erro se o valor não serve para este tipo; null se for válido.
     */
    public function validate(string $value): ?string
    {
        $value = trim($value);

        return match ($this) {
            self::Whatsapp, self::Phone => self::phoneDigits($value) === null
                ? 'Informe um número válido com DDD (10 a 13 dígitos).'
                : null,
            self::Email => filter_var($value, FILTER_VALIDATE_EMAIL) === false
                ? 'Informe um e-mail válido.'
                : null,
            self::Address => mb_strlen($value) < 5
                ? 'Informe o endereço completo.'
                : null,
            self::Instagram => $this->validateProfileUrl($value, 'instagram.com'),
            self::Linkedin => $this->validateProfileUrl($value, 'linkedin.com'),
            self::Github => $this->validateProfileUrl($value, 'github.com'),
            self::Website => $this->validateProfileUrl($value, null),
        };
    }

    /**
     * Link final usado no site, derivado do valor cadastrado.
     */
    public function href(string $value): ?string
    {
        $value = trim($value);

        return match ($this) {
            self::Whatsapp => ($digits = self::phoneDigits($value)) ? 'https://wa.me/'.$digits : null,
            self::Phone => ($digits = self::phoneDigits($value)) ? 'tel:+'.$digits : null,
            self::Email => filter_var($value, FILTER_VALIDATE_EMAIL) ? 'mailto:'.$value : null,
            self::Address => 'https://www.google.com/maps/search/?api=1&query='.rawurlencode($value),
            default => $this->validate($value) === null ? $value : null,
        };
    }

    /**
     * Só dígitos, com DDI 55 quando o número vier sem ele. Null se o tamanho for inválido.
     */
    private static function phoneDigits(string $value): ?string
    {
        $digits = preg_replace('/\D/', '', $value) ?? '';

        if (in_array(strlen($digits), [10, 11], true)) {
            $digits = '55'.$digits;
        }

        return strlen($digits) >= 12 && strlen($digits) <= 13 ? $digits : null;
    }

    private function validateProfileUrl(string $value, ?string $host): ?string
    {
        $parts = parse_url($value);

        if (! preg_match('/^https:\/\/\S+$/i', $value) || empty($parts['host'])) {
            return 'Informe uma URL completa começando com https://.';
        }

        if ($host !== null) {
            $actual = strtolower($parts['host']);

            if ($actual !== $host && ! str_ends_with($actual, '.'.$host)) {
                return "A URL precisa ser do domínio {$host}.";
            }
        }

        return null;
    }
}
