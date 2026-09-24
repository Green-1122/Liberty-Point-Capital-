<?php
$siteTitle = 'Retirement savings';
?>
<section class="panel">
    <div class="topbar">
        <div>
            <p class="eyebrow">Long-term wealth</p>
            <h2>Retirement savings & pensions</h2>
            <p class="muted">Build durable financial security with transparent retirement plans.</p>
        </div>
        <a href="/pension/create" class="primary-button">Open pension account</a>
    </div>

    <div class="stats-grid">
        <?php $total = array_sum(array_map(static fn(array $account): float => (float) $account['current_balance'], $accounts ?? [])); ?>
        <article class="stat-card primary"><span>Total retirement balance</span><strong>$<?= htmlspecialchars(number_format($total, 2), ENT_QUOTES, 'UTF-8'); ?></strong><small>Across active accounts</small></article>
        <article class="stat-card"><span>Plans available</span><strong><?= htmlspecialchars((string) count($plans ?? []), ENT_QUOTES, 'UTF-8'); ?></strong><small>Risk-aware choices</small></article>
        <article class="stat-card"><span>Financial education</span><strong>3.5%</strong><small>Example annual yield</small></article>
    </div>

    <div class="account-grid">
        <?php foreach (($accounts ?? []) as $account): ?>
            <article class="account-card">
                <div class="account-header"><span><?= htmlspecialchars($account['plan_name'], ENT_QUOTES, 'UTF-8'); ?></span><strong><?= htmlspecialchars($account['status'], ENT_QUOTES, 'UTF-8'); ?></strong></div>
                <h3><?= htmlspecialchars($account['account_number'], ENT_QUOTES, 'UTF-8'); ?></h3>
                <p>$<?= htmlspecialchars(number_format((float) $account['current_balance'], 2), ENT_QUOTES, 'UTF-8'); ?></p>
                <small><?= htmlspecialchars((string) $account['monthly_contribution'], ENT_QUOTES, 'UTF-8'); ?> monthly · target age <?= htmlspecialchars((string) $account['target_retirement_age'], ENT_QUOTES, 'UTF-8'); ?></small>
                <form method="post" action="/pension/contribute" class="inline-form">
                    <input type="hidden" name="_token" value="<?= htmlspecialchars(csrf_token(), ENT_QUOTES, 'UTF-8'); ?>" />
                    <input type="hidden" name="account_id" value="<?= (int) $account['id']; ?>" />
                    <input type="number" name="amount" min="1" step="0.01" placeholder="Amount" required />
                    <input type="hidden" name="source" value="Manual contribution" />
                    <button type="submit">Contribute</button>
                </form>
            </article>
        <?php endforeach; ?>
    </div>

    <section class="panel nested-panel">
        <h3>Recent contributions</h3>
        <ul class="transaction-list">
            <?php foreach (($contributions ?? []) as $contribution): ?>
                <li><div><strong><?= htmlspecialchars($contribution['account_number'], ENT_QUOTES, 'UTF-8'); ?></strong><small><?= htmlspecialchars($contribution['created_at'], ENT_QUOTES, 'UTF-8'); ?></small></div><span class="amount positive">+$<?= htmlspecialchars(number_format((float) $contribution['amount'], 2), ENT_QUOTES, 'UTF-8'); ?></span></li>
            <?php endforeach; ?>
        </ul>
    </section>

    <section>
        <h3>Why this matters</h3>
        <p class="muted">Consistent contributions and time in the market can help smooth short-term volatility. Review plan risks, fees, tax treatment, and beneficiary details before investing.</p>
    </section>
</section>
