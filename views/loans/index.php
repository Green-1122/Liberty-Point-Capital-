<?php
$siteTitle = 'Loans';
?>
<section class="panel"><div class="topbar"><div><p class="eyebrow">Credit</p><h2>Loans and credit</h2></div><a href="/support" class="secondary-button">Contact support</a></div><div class="account-grid"><?php foreach (($loans ?? []) as $loan): ?><article class="account-card"><div class="account-header"><span><?= htmlspecialchars($loan['loan_name'] ?? 'Loan', ENT_QUOTES, 'UTF-8'); ?></span><strong><?= htmlspecialchars($loan['status'] ?? '', ENT_QUOTES, 'UTF-8'); ?></strong></div><p>$<?= htmlspecialchars(number_format((float) ($loan['principal_amount'] ?? 0), 2), ENT_QUOTES, 'UTF-8'); ?></p></article><?php endforeach; ?></div></section>
