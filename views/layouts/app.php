<?php
$siteTitle = $siteTitle ?? 'Hana-Eunhaeng';
$user = $_SESSION['user'] ?? null;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><?= htmlspecialchars($siteTitle, ENT_QUOTES, 'UTF-8'); ?></title>
    <meta name="description" content="Hana-Eunhaeng premium fintech banking platform" />
    <link rel="stylesheet" href="/assets/css/styles.css" />
</head>
<body>
    <div class="app-shell">
        <aside class="sidebar">
            <div class="brand">
                <div class="brand-mark">HE</div>
                <div>
                    <h1>Hana-Eunhaeng</h1>
                    <p>Private banking</p>
                </div>
            </div>

            <?php if ($user): ?>
                <nav class="nav">
                    <a href="/dashboard">Overview</a>
                    <a href="/dashboard/accounts">Accounts</a>
                    <a href="/transfer">Transfers</a>
                    <a href="/cards">Cards</a>
                    <a href="/investments">Investments</a>
                    <a href="/support">Support</a>
                    <a href="/logout">Sign out</a>
                </nav>
            <?php endif; ?>
        </aside>

        <main class="main-content">
            <?= $content ?? ''; ?>
        </main>
    </div>
</body>
</html>
