<?php

namespace App\Helpers;

final class Security
{
    public static function e(string $value): string
    {
        return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
    }

    public static function isStrongPassword(string $password): bool
    {
        return strlen($password) >= 8 && preg_match('/[A-Z]/', $password) && preg_match('/[0-9]/', $password);
    }
}
