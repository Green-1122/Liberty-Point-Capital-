<?php
$siteTitle = 'Dashboard';
$userName = $_SESSION['user']['full_name'] ?? 'Customer';
$accountBalance = isset($account['balance']) ? $account['balance'] : 0;
?>
<section class="dashboard-overview">
    <div class="topbar">
        <div>
            <p class="eyebrow">Good morning</p>
            <h2><?= htmlspecialchars($userName, ENT_QUOTES, 'UTF-8'); ?></h2>
        </div>
        <div class="inline-actions">
            <a href="/transfer" class="primary-button">Transfer</a>
            <a href="/support" class="secondary-button">Help</a>
        </div>
    </div>

    <div class="stats-grid">
        <article class="stat-card primary">
            <span>Available balance</span>
            <strong><?= htmlspecialchars('$' . number_format((float) $accountBalance, 2), ENT_QUOTES, 'UTF-8'); ?></strong>
            <small>Primary account</small>
        </article>
        <article class="stat-card">
            <span>Income</span>
            <strong>$8,420</strong>
            <small>Monthly</small>
        </article>
        <article class="stat-card">
            <span>Savings</span>
            <strong>$42,800</strong>
            <small>Growth</small>
        </article>
    </div>

    <div class="content-split">
        <section class="panel">
            <h3>Recent transactions</h3>
            <ul class="transaction-list">
                <?php foreach (($transactions ?? []) as $transaction): ?>
                    <li>
                        <div>
                            <strong><?= htmlspecialchars($transaction['description'] ?? 'Transaction', ENT_QUOTES, 'UTF-8'); ?></strong>
                            <small><?= htmlspecialchars($transaction['created_at'] ?? '', ENT_QUOTES, 'UTF-8'); ?></small>
                        </div>
                        <span class="amount <?= ($transaction['direction'] ?? 'outbound') === 'inbound' ? 'positive' : 'negative'; ?>">
                            <?= htmlspecialchars(($transaction['direction'] ?? 'outbound') === 'inbound' ? '+' : '-'); ?>$
                            <?= htmlspecialchars(number_format((float) ($transaction['amount'] ?? 0), 2), ENT_QUOTES, 'UTF-8'); ?>
                        </span>
                    </li>
                <?php endforeach; ?>
            </ul>
        </section>

        <section class="panel">
            <h3>Loan overview</h3>
            <ul class="transaction-list">
                <?php foreach (($loans ?? []) as $loan): ?>
                    <li>
                        <div>
                            <strong><?= htmlspecialchars($loan['loan_name'] ?? 'Loan', ENT_QUOTES, 'UTF-8'); ?></strong>
                            <small><?= htmlspecialchars($loan['status'] ?? 'Active', ENT_QUOTES, 'UTF-8'); ?></small>
                        </div>
                        <span class="amount positive">$<?= htmlspecialchars(number_format((float) ($loan['principal_amount'] ?? 0), 2), ENT_QUOTES, 'UTF-8'); ?></span>
                    </li>
                <?php endforeach; ?>
            </ul>
        </section>
    </div>
</section>
