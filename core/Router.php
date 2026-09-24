<?php

namespace App\Core;

use RuntimeException;

final class Router
{
    public static function dispatch(): void
    {
        $route = $_GET['route'] ?? 'auth/login';
        $route = trim($route, '/');

        $parts = $route === '' ? ['auth', 'login'] : explode('/', $route);
        $controllerName = $parts[0] ?? 'auth';
        $actionName = $parts[1] ?? 'login';
        $params = array_slice($parts, 2);

        $controllerClass = 'App\\Controllers\\' . ucfirst($controllerName) . 'Controller';

        if (!class_exists($controllerClass)) {
            http_response_code(404);
            echo 'Page not found.';
            return;
        }

        $controller = new $controllerClass();

        if (!method_exists($controller, $actionName)) {
            http_response_code(404);
            echo 'Action not found.';
            return;
        }

        $controller->{$actionName}(...$params);
    }
}
