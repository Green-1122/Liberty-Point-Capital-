<?php

namespace App\Controllers;

use App\Core\Controller;
use App\Helpers\Formatter;
use App\Middleware\AuthMiddleware;
use App\Models\AccountModel;
use App\Models\TransactionModel;
use App\Models\UserModel;

final class AuthController extends Controller
{
    public function login(): void
    {
        if (!empty($_SESSION['user'])) {
            redirect('/dashboard');
        }

        $error = flash('error');
        $this->render('auth/login', ['error' => $error]);
    }

    public function doLogin(): void
    {
        validate_csrf();

        $email = trim($_POST['email'] ?? '');
        $password = (string) ($_POST['password'] ?? '');

        $model = new UserModel();
        $user = $model->findByEmail($email);

        if (!$user || !password_verify($password, $user['password_hash'])) {
            flash('error', 'Invalid email or password.');
            redirect('/login');
        }

        $_SESSION['user'] = [
            'id' => (int) $user['id'],
            'full_name' => $user['full_name'],
            'email' => $user['email'],
            'role' => (int) $user['role'],
        ];

        redirect('/dashboard');
    }

    public function logout(): void
    {
        session_destroy();
        redirect('/login');
    }

    public function register(): void
    {
        $error = flash('error');
        $this->render('auth/register', ['error' => $error]);
    }

    public function doRegister(): void
    {
        validate_csrf();

        $fullName = trim($_POST['full_name'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $password = (string) ($_POST['password'] ?? '');

        if (empty($fullName) || empty($email) || strlen($password) < 8) {
            flash('error', 'Please complete your registration details.');
            redirect('/register');
        }

        $userModel = new UserModel();
        if ($userModel->findByEmail($email)) {
            flash('error', 'A user with this email already exists.');
            redirect('/register');
        }

        $userId = $userModel->create([
            'full_name' => $fullName,
            'email' => $email,
            'password' => $password,
            'role' => 0,
            'is_active' => 1,
        ]);

        $accountModel = new AccountModel();
        $accountModel->create([
            'user_id' => $userId,
            'account_number' => 'HN-' . str_pad((string) $userId, 8, '0', STR_PAD_LEFT),
            'account_type' => 'checking',
            'balance' => 1250.00,
            'currency' => 'USD',
            'status' => 'active',
            'is_primary' => 1,
        ]);

        $transactionModel = new TransactionModel();
        $transactionModel->create([
            'user_id' => $userId,
            'account_id' => 1,
            'type' => 'deposit',
            'amount' => 1250.00,
            'currency' => 'USD',
            'direction' => 'inbound',
            'description' => 'Opening deposit',
            'status' => 'completed',
        ]);

        flash('success', 'Registration successful. Please log in.');
        redirect('/login');
    }
}
