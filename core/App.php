<?php

namespace App\Core;

final class App
{
    public static function run(): void
    {
        session_start();
        require_once APP_BASE_PATH . '/helpers/Env.php';
        require_once APP_BASE_PATH . '/config/database.php';

        Router::dispatch();
    }
}
