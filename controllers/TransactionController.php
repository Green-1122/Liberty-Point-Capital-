<?php

namespace App\Controllers;

use App\Core\Controller;
use App\Middleware\AuthMiddleware;
use App\Models\TransactionModel;

final class TransactionController extends Controller
{
    public function index(): void
    {
        AuthMiddleware::requireAuth();
        $transactions = (new TransactionModel())->recentByUser((int) $_SESSION['user']['id'], 100);
        $this->render('transactions/index', ['transactions' => $transactions], 'app');
    }
}
