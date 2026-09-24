<?php

namespace App\Helpers;

final class Input
{
    public static function string(string $key, int $maxLength = 255): string
    {
        $value = trim((string) ($_POST[$key] ?? ''));
        return mb_substr($value, 0, $maxLength);
    }

    public static function decimal(string $key, float $default = 0.0): float
    {
        $value = filter_var($_POST[$key] ?? null, FILTER_VALIDATE_FLOAT);
        return $value === false ? $default : (float) $value;
    }

    public static function enum(string $key, array $allowed, string $default): string
    {
        $value = (string) ($_POST[$key] ?? $default);
        return in_array($value, $allowed, true) ? $value : $default;
    }
}
