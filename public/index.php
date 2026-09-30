<?php

session_name(SESSION_NAME);
session_set_cookie_params(['httponly' => true, 'samesite' => 'Lax', 'secure' => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'), 'path' => '/']);
session_start();
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../helpers/Env.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../core/ErrorHandler.php';
\App\Core\ErrorHandler::register();

spl_autoload_register(static function (string $class): void {
    if (strncmp($class, 'App\\', 4) !== 0) return;
    $path = __DIR__ . '/../' . str_replace('\\', '/', substr($class, 4)) . '.php';
    if (is_file($path)) require_once $path;
});

\App\Core\Router::dispatch();
