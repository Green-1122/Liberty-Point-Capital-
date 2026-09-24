<?php

namespace App\Controllers;

use App\Core\Controller;
use App\Middleware\AuthMiddleware;
use App\Models\AuditModel;
use App\Models\TradeModel;
use App\Models\UserModel;

final class AdminController extends Controller
{
    public function index(): void
    {
        AuthMiddleware::requireAdmin();
        $userModel = new UserModel();
        $this->render('admin/index', [
            'strategies' => TradeModel::STRATEGIES,
            'users' => $userModel->listAll(),
            'customerCount' => $userModel->countByRole(0),
            'adminCount' => $userModel->countByRole(1),
            'auditEvents' => (new AuditModel())->recent(30),
        ], 'app');
    }

    public function strategies(): void
    {
        AuthMiddleware::requireAdmin();
        $this->json(['data' => TradeModel::STRATEGIES]);
    }

    public function setUserStatus(): void
    {
        AuthMiddleware::requireAdmin();
        validate_csrf();
        $userId = (int) ($_POST['user_id'] ?? 0);
        $active = filter_var($_POST['active'] ?? false, FILTER_VALIDATE_BOOLEAN);
        if ($userId === (int) $_SESSION['user']['id']) {
            flash('error', 'Administrators cannot deactivate their own account.');
        } else {
            (new UserModel())->setActive($userId, $active);
            (new AuditModel())->record((int) $_SESSION['user']['id'], $active ? 'user.activate' : 'user.deactivate', 'users', $userId);
            flash('success', 'User status updated.');
        }
        redirect('/admin');
    }
}
