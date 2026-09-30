<?php

namespace App\Controllers;

use App\Core\Controller;
use App\Middleware\AuthMiddleware;
use App\Models\LoanModel;

final class LoanController extends Controller
{
    public function index(): void
    {
        AuthMiddleware::requireAuth();
        $loans = (new LoanModel())->recentByUser((int) $_SESSION['user']['id']);
        $this->render('loans/index', ['loans' => $loans], 'app');
    }
}
