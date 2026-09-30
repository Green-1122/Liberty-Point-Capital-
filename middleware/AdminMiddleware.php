<?php

namespace App\Middleware;

final class AdminMiddleware
{
    public static function handle(): void
    {
        AuthMiddleware::requireAdmin();
    }
}
