<?php

namespace App\Middleware;

final class AuthMiddleware
{
    public static function requireAuth(): void
    {
        if (empty($_SESSION['user'])) {
            redirect('/login');
        }
    }

    public static function requireAdmin(): void
    {
        self::requireAuth();
        if ((int) ($_SESSION['user']['role'] ?? 0) !== 1) {
            http_response_code(403);
            echo 'Forbidden.';
            exit;
        }
    }
}
