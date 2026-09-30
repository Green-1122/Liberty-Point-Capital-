<?php

namespace App\Controllers;

use App\Core\Controller;
use App\Middleware\AuthMiddleware;
use App\Models\PensionModel;

final class PensionController extends Controller
{
    public function index(): void
    {
        AuthMiddleware::requireAuth();
        $userId = (int) $_SESSION['user']['id'];
        $model = new PensionModel();

        $this->render('pension/index', [
            'plans' => $model->plans(),
            'accounts' => $model->accountsByUser($userId),
            'contributions' => $model->contributionsByUser($userId),
        ], 'app');
    }

    public function create(): void
    {
        AuthMiddleware::requireAuth();
        $this->render('pension/create', ['plans' => (new PensionModel())->plans()], 'app');
    }

    public function store(): void
    {
        AuthMiddleware::requireAuth();
        validate_csrf();

        $planId = (int) ($_POST['plan_id'] ?? 0);
        $initial = max(0, (float) ($_POST['initial_contribution'] ?? 0));
        $monthly = max(0, (float) ($_POST['monthly_contribution'] ?? 0));
        $retirementAge = (int) ($_POST['target_retirement_age'] ?? 65);

        if ($planId < 1 || $retirementAge < 50 || $retirementAge > 85) {
            flash('error', 'Please provide a valid pension plan and retirement age.');
            redirect('/pension/create');
        }

        (new PensionModel())->createAccount([
            'user_id' => (int) $_SESSION['user']['id'],
            'plan_id' => $planId,
            'account_number' => 'HN-PEN-' . strtoupper(bin2hex(random_bytes(4))),
            'current_balance' => $initial,
            'monthly_contribution' => $monthly,
            'target_retirement_age' => $retirementAge,
            'beneficiary_name' => trim($_POST['beneficiary_name'] ?? ''),
            'beneficiary_relation' => trim($_POST['beneficiary_relation'] ?? ''),
        ]);

        flash('success', 'Retirement account created successfully.');
        redirect('/pension');
    }

    public function contribute(): void
    {
        AuthMiddleware::requireAuth();
        validate_csrf();

        try {
            (new PensionModel())->contribute(
                (int) $_SESSION['user']['id'],
                (int) ($_POST['account_id'] ?? 0),
                (float) ($_POST['amount'] ?? 0),
                trim($_POST['source'] ?? 'Manual contribution'),
            );
            flash('success', 'Contribution posted to your retirement account.');
        } catch (\Throwable $exception) {
            flash('error', $exception->getMessage());
        }

        redirect('/pension');
    }
}
