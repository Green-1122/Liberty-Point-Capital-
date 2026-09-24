<?php

namespace App\Middleware;

final class AuthMiddleware
{
    public static function requireAuth(): void
    {
        if (empty($_SESSION['user'])) {
            header('Location: /login');
            exit;
        }
    }

    public static function requireAdmin(): void
    {
        self::requireAuth();

        if ((int) ($_SESSION['user']['role'] ?? 0) !== 1) {
            header('Location: /dashboard');
            exit;
        }
    }
}
