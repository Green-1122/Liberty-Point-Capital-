<?php

namespace App\Core;

final class Router
{
    public static function dispatch(): void
    {
        $uri = $_SERVER['REQUEST_URI'] ?? '/';
        $path = parse_url($uri, PHP_URL_PATH) ?: '/';
        $path = trim($path, '/');

        if ($path === '' || $path === 'index.php') {
            $path = !empty($_SESSION['user']) ? 'dashboard' : 'login';
        }

        $segments = $path === '' ? [] : explode('/', $path);
        $requestMethod = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');

        $controllerName = strtolower($segments[0] ?? 'auth');
        $actionName = strtolower($segments[1] ?? 'index');
        $params = array_slice($segments, 2);

        $controllerMap = [
            'auth' => 'AuthController',
            'dashboard' => 'DashboardController',
            'accounts' => 'AccountController',
            'transfer' => 'TransferController',
            'cards' => 'CardsController',
            'investments' => 'InvestmentsController',
            'support' => 'SupportController',
            'admin' => 'AdminController',
            'logout' => 'AuthController',
            'login' => 'AuthController',
            'register' => 'AuthController',
        ];

        $controllerClass = 'App\\Controllers\\' . ($controllerMap[$controllerName] ?? ucfirst($controllerName) . 'Controller');

        if ($controllerName === 'logout') {
            $actionName = 'logout';
        }

        if ($controllerName === 'login' && $requestMethod === 'POST') {
            $actionName = 'doLogin';
        }

        if ($controllerName === 'register' && $requestMethod === 'POST') {
            $actionName = 'doRegister';
        }

        if ($controllerName === 'accounts' && $actionName === 'store' && $requestMethod === 'POST') {
            $actionName = 'store';
        }

        if ($controllerName === 'transfer' && $actionName === 'store' && $requestMethod === 'POST') {
            $actionName = 'store';
        }

        if ($controllerName === 'cards' && $actionName === 'store' && $requestMethod === 'POST') {
            $actionName = 'store';
        }

        if ($controllerName === 'investments' && $actionName === 'store' && $requestMethod === 'POST') {
            $actionName = 'store';
        }

        if ($controllerName === 'support' && $actionName === 'store' && $requestMethod === 'POST') {
            $actionName = 'store';
        }

        if (!class_exists($controllerClass)) {
            http_response_code(404);
            echo 'Page not found.';
            return;
        }

        $controller = new $controllerClass();

        if (!method_exists($controller, $actionName)) {
            http_response_code(404);
            echo 'Action not found: ' . htmlspecialchars($actionName, ENT_QUOTES, 'UTF-8');
            return;
        }

        $controller->{$actionName}(...$params);
    }
}
