<?php

namespace App\Helpers;

final class Formatter
{
    public static function money(float|int $value, string $currency = 'USD'): string
    {
        return '$' . number_format((float) $value, 2, '.', ',');
    }

    public static function date(string $value): string
    {
        return date('M j, Y', strtotime($value));
    }

    public static function shortDate(string $value): string
    {
        return date('Y-m-d', strtotime($value));
    }
}
