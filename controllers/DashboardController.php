<?php

namespace App\Controllers;

use App\Core\Controller;
use App\Helpers\Formatter;
use App\Middleware\AuthMiddleware;
use App\Models\AccountModel;
use App\Models\LoanModel;
use App\Models\TransactionModel;
use App\Models\UserModel;

final class DashboardController extends Controller
{
    public function index(): void
    {
        AuthMiddleware::requireAuth();

        $user = (new UserModel())->getSummary((int) $_SESSION['user']['id']);
        $account = (new AccountModel())->getPrimary((int) $_SESSION['user']['id']);
        $transactions = (new TransactionModel())->recentByUser((int) $_SESSION['user']['id'], 8);
        $loans = (new LoanModel())->recentByUser((int) $_SESSION['user']['id']);

        $this->render('dashboard/index', [
            'user' => $user,
            'account' => $account,
            'transactions' => $transactions,
            'loans' => $loans,
            'formatMoney' => [Formatter::class, 'money'],
        ], 'app');
    }

    public function accounts(): void
    {
        AuthMiddleware::requireAuth();

        $accounts = (new AccountModel())->getByUser((int) $_SESSION['user']['id']);
        $this->render('dashboard/accounts', ['accounts' => $accounts], 'app');
    }
}
