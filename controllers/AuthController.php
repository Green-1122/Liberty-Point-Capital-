<?php

namespace App\Controllers;

use App\Core\Controller;
use App\Middleware\AuthMiddleware;
use App\Models\AccountModel;
use App\Models\AuditModel;
use App\Models\TransactionModel;
use App\Models\UserModel;

final class AuthController extends Controller
{
    public function login(): void
    {
        if (!empty($_SESSION['user'])) redirect('/dashboard');
        csrf_token();
        $this->render('auth/login', ['error' => flash('error')], 'auth');
    }

    public function doLogin(): void
    {
        validate_csrf();
        $user = (new UserModel())->findByEmail($_POST['email'] ?? '');
        if (!$user || !(int) $user['is_active'] || !password_verify((string) ($_POST['password'] ?? ''), $user['password_hash'])) {
            flash('error', 'Invalid credentials or inactive account.');
            redirect('/login');
        }
        session_regenerate_id(true);
        $_SESSION['user'] = ['id' => (int) $user['id'], 'full_name' => $user['full_name'], 'email' => $user['email'], 'role' => (int) $user['role']];
        (new AuditModel())->record((int) $user['id'], 'auth.login', 'users', (int) $user['id']);
        redirect('/dashboard');
    }

    public function logout(): void
    {
        if (!empty($_SESSION['user']['id'])) (new AuditModel())->record((int) $_SESSION['user']['id'], 'auth.logout', 'users', (int) $_SESSION['user']['id']);
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], (bool) $params['secure'], (bool) $params['httponly']);
        }
        session_destroy();
        redirect('/login');
    }

    public function register(): void
    {
        csrf_token();
        $this->render('auth/register', ['error' => flash('error')], 'auth');
    }

    public function doRegister(): void
    {
        validate_csrf();
        $name = trim($_POST['full_name'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $password = (string) ($_POST['password'] ?? '');
        if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password) < 12 || !preg_match('/[A-Z]/', $password) || !preg_match('/[0-9]/', $password)) {
            flash('error', 'Use a valid email and a 12+ character password with a capital letter and number.');
            redirect('/register');
        }
        $users = new UserModel();
        if ($users->findByEmail($email)) { flash('error', 'An account already exists for this email.'); redirect('/register'); }
        $id = $users->create(['full_name' => $name, 'email' => $email, 'password' => $password, 'role' => 0, 'is_active' => 1]);
        $accountId = (new AccountModel())->create(['user_id' => $id, 'account_number' => 'LPC-' . str_pad((string) $id, 8, '0', STR_PAD_LEFT), 'account_type' => 'checking', 'balance' => 0, 'currency' => 'USD', 'status' => 'active', 'is_primary' => 1]);
        (new AuditModel())->record($id, 'auth.register', 'users', $id, ['account_id' => $accountId]);
        flash('success', 'Registration successful. Please sign in.');
        redirect('/login');
    }
}
