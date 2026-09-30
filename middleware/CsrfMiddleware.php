<?php

namespace App\Middleware;

final class CsrfMiddleware
{
    public static function verify(): void
    {
        validate_csrf();
    }
}
