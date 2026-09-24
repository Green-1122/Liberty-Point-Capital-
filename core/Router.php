<?php

namespace App\Core;

final class Router
{
    public static function dispatch(): void
    {
        $uri = $_SERVER['REQUEST_URI'] ?? '/';
        $path = trim((string) (parse_url($uri, PHP_URL_PATH) ?: '/'), '/');
        $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');

        if ($path === '' || $path === 'index.php') {
            $path = !empty($_SESSION['user']) ? 'dashboard' : 'login';
        }

        $segments = $path === '' ? [] : explode('/', $path);
        $resource = strtolower($segments[0] ?? 'auth');
        $action = strtolower($segments[1] ?? 'index');
        $params = array_slice($segments, 2);

        $map = [
            'auth' => 'AuthController', 'login' => 'AuthController', 'register' => 'AuthController', 'logout' => 'AuthController',
            'dashboard' => 'DashboardController', 'accounts' => 'AccountController', 'transfer' => 'TransferController',
            'cards' => 'CardsController', 'investments' => 'InvestmentsController', 'support' => 'SupportController',
            'admin' => 'AdminController', 'pension' => 'PensionController',
        ];

        $controllerClass = 'App\\Controllers\\' . ($map[$resource] ?? ucfirst($resource) . 'Controller');

        if ($resource === 'login') $action = $method === 'POST' ? 'doLogin' : 'login';
        if ($resource === 'register') $action = $method === 'POST' ? 'doRegister' : 'register';
        if ($resource === 'logout') $action = 'logout';
        if ($resource === 'dashboard' && count($segments) === 1) $action = 'index';
        if ($resource === 'accounts' && count($segments) === 1) $action = 'index';
        if ($resource === 'transfer' && count($segments) === 1) $action = 'index';
        if ($resource === 'cards' && count($segments) === 1) $action = 'index';
        if ($resource === 'investments' && count($segments) === 1) $action = 'index';
        if ($resource === 'support' && count($segments) === 1) $action = 'index';
        if ($resource === 'admin' && count($segments) === 1) $action = 'index';
        if ($resource === 'pension' && count($segments) === 1) $action = 'index';

        if (!class_exists($controllerClass)) { http_response_code(404); echo 'Page not found.'; return; }
        $controller = new $controllerClass();
        if (!method_exists($controller, $action)) { http_response_code(404); echo 'Action not found.'; return; }
        $controller->{$action}(...$params);
    }
}
