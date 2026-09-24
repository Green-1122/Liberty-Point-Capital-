<?php

namespace App\Core;

use Throwable;

final class ErrorHandler
{
    public static function register(): void
    {
        set_exception_handler(static function (Throwable $exception): void {
            error_log($exception->__toString());
            http_response_code(500);
            echo getenv('APP_ENV') === 'production' ? 'An internal error occurred.' : htmlspecialchars($exception->getMessage(), ENT_QUOTES, 'UTF-8');
        });
    }
}
