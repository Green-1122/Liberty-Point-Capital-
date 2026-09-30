<?php

namespace App\Core;

final class View
{
    public static function render(string $view, array $data = []): void
    {
        extract($data, EXTR_SKIP);
        $path = APP_BASE_PATH . '/views/' . $view . '.php';

        if (!file_exists($path)) {
            throw new \RuntimeException('View not found: ' . $view);
        }

        require $path;
    }
}
