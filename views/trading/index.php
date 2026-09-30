<?php
$siteTitle = 'Trading desk';
?>
<section class="panel">
    <div class="topbar"><div><p class="eyebrow">Markets</p><h2>Trading desk</h2><p class="muted">Explore strategies in a paper-trading environment before connecting any regulated execution provider.</p></div><a href="/trade/quick" class="primary-button">Quick Trade</a></div>
    <div class="strategy-grid">
        <?php foreach (($strategies ?? []) as $key => $label): ?><div class="strategy-chip"><strong><?= htmlspecialchars($label, ENT_QUOTES, 'UTF-8'); ?></strong><small><?= htmlspecialchars(str_replace('_', ' ', ucfirst($key)), ENT_QUOTES, 'UTF-8'); ?></small></div><?php endforeach; ?>
    </div>
    <div class="table-wrap"><table><thead><tr><th>Symbol</th><th>Side</th><th>Strategy</th><th>Quantity</th><th>Entry</th><th>Status</th><th>Action</th></tr></thead><tbody>
    <?php foreach (($trades ?? []) as $trade): ?><tr><td><?= htmlspecialchars($trade['symbol'], ENT_QUOTES, 'UTF-8'); ?></td><td><?= htmlspecialchars(strtoupper($trade['side']), ENT_QUOTES, 'UTF-8'); ?></td><td><?= htmlspecialchars($strategies[$trade['strategy']] ?? $trade['strategy'], ENT_QUOTES, 'UTF-8'); ?></td><td><?= htmlspecialchars($trade['quantity'], ENT_QUOTES, 'UTF-8'); ?></td><td>$<?= htmlspecialchars(number_format((float) $trade['entry_price'], 2), ENT_QUOTES, 'UTF-8'); ?></td><td><?= htmlspecialchars($trade['status'], ENT_QUOTES, 'UTF-8'); ?></td><td><?php if ($trade['status'] === 'open'): ?><form method="post" action="/trade/close"><input type="hidden" name="_token" value="<?= htmlspecialchars(csrf_token(), ENT_QUOTES, 'UTF-8'); ?>"><input type="hidden" name="trade_id" value="<?= (int) $trade['id']; ?>"><button type="submit">Close</button></form><?php endif; ?></td></tr><?php endforeach; ?>
    </tbody></table></div>
</section>
