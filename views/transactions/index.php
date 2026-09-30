<?php
$siteTitle = 'Transactions';
?>
<section class="panel">
    <div class="topbar"><div><p class="eyebrow">Ledger</p><h2>Transaction history</h2></div><a href="/dashboard" class="secondary-button">Back to overview</a></div>
    <div class="table-wrap"><table><thead><tr><th>Date</th><th>Description</th><th>Type</th><th>Status</th><th>Amount</th></tr></thead><tbody>
    <?php foreach (($transactions ?? []) as $transaction): ?><tr><td><?= htmlspecialchars($transaction['created_at'] ?? '', ENT_QUOTES, 'UTF-8'); ?></td><td><?= htmlspecialchars($transaction['description'] ?? '', ENT_QUOTES, 'UTF-8'); ?></td><td><?= htmlspecialchars($transaction['type'] ?? '', ENT_QUOTES, 'UTF-8'); ?></td><td><?= htmlspecialchars($transaction['status'] ?? '', ENT_QUOTES, 'UTF-8'); ?></td><td class="amount <?= ($transaction['direction'] ?? '') === 'inbound' ? 'positive' : 'negative'; ?>"><?= ($transaction['direction'] ?? '') === 'inbound' ? '+' : '-'; ?>$<?= htmlspecialchars(number_format((float) ($transaction['amount'] ?? 0), 2), ENT_QUOTES, 'UTF-8'); ?></td></tr><?php endforeach; ?>
    </tbody></table></div>
</section>
