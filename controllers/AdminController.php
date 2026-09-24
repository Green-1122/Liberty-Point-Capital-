<?php

namespace App\Controllers;

use App\Core\Controller;
use App\Middleware\AuthMiddleware;
use App\Models\TradeModel;

final class AdminController extends Controller
{
    public function index(): void
    {
        AuthMiddleware::requireAdmin();
        $this->render('admin/index', ['strategies' => TradeModel::STRATEGIES], 'app');
    }

    public function strategies(): void
    {
        AuthMiddleware::requireAdmin();
        $this->json(['data' => TradeModel::STRATEGIES]);
    }
}
