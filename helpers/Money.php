<?php

namespace App\Helpers;

final class Money
{
    public static function decimal(float|string|int $amount): string
    {
        return number_format((float) $amount, 2, '.', '');
    }

    public static function positive(float|string|int $amount): bool
    {
        return (float) $amount > 0;
    }
}
