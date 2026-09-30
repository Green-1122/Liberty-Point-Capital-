<?php
$siteTitle = 'Accounts';
?>
<section class="panel">
    <h2>Accounts</h2>
    <div class="account-grid">
        <?php foreach (($accounts ?? []) as $account): ?>
            <article class="account-card">
                <div class="account-header">
                    <span><?= htmlspecialchars($account['account_type'] ?? 'Checking', ENT_QUOTES, 'UTF-8'); ?></span>
                    <strong><?= htmlspecialchars($account['status'] ?? 'active', ENT_QUOTES, 'UTF-8'); ?></strong>
                </div>
                <h3><?= htmlspecialchars($account['account_number'] ?? 'N/A', ENT_QUOTES, 'UTF-8'); ?></h3>
                <p>$<?= htmlspecialchars(number_format((float) ($account['balance'] ?? 0), 2), ENT_QUOTES, 'UTF-8'); ?></p>
            </article>
        <?php endforeach; ?>
    </div>
</section>
