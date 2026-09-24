<?php
$siteTitle = $siteTitle ?? 'Liberty Point Capital';
$user = $_SESSION['user'] ?? null;
$success = flash('success');
$error = flash('error');
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Liberty Point Capital digital banking, retirement, and paper-trading platform">
    <title><?= htmlspecialchars($siteTitle, ENT_QUOTES, 'UTF-8'); ?></title>
    <link rel="stylesheet" href="/assets/css/styles.css">
    <link rel="stylesheet" href="/assets/css/fintech.css">
</head>
<body>
<div class="app-shell">
    <aside class="sidebar" aria-label="Primary navigation">
        <div class="brand"><div class="brand-mark">LPC</div><div><h1>Liberty Point Capital</h1><p>Banking & markets</p></div></div>
        <?php if ($user): ?><nav class="nav"><a href="/dashboard">Overview</a><a href="/accounts">Accounts</a><a href="/transactions">Transactions</a><a href="/trade">Trade</a><a href="/trade/quick">Quick Trade</a><a href="/pension">Retirement</a><a href="/loans">Loans</a><a href="/transfer">Transfers</a><a href="/cards">Cards</a><a href="/investments">Investments</a><a href="/support">Support</a><?php if ((int) ($user['role'] ?? 0) === 1): ?><a href="/admin">Admin</a><?php endif; ?><a href="/logout">Sign out</a></nav><?php endif; ?>
    </aside>
    <main class="main-content">
        <?php if ($success): ?><div class="alert alert-success" role="status"><?= htmlspecialchars($success, ENT_QUOTES, 'UTF-8'); ?></div><?php endif; ?>
        <?php if ($error): ?><div class="alert alert-error" role="alert"><?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8'); ?></div><?php endif; ?>
        <?= $content ?? ''; ?>
    </main>
</div>
<script src="/assets/js/app.js" defer></script>
</body>
</html>
