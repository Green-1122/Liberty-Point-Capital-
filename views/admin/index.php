<?php
$siteTitle = 'Admin controls';
?>
<section class="panel"><div class="topbar"><div><p class="eyebrow">Governance</p><h2>Admin controls</h2><p class="muted">Trading strategies are available for configuration and education. Paper execution is isolated from live markets.</p></div><a href="/admin/strategies" class="secondary-button">Strategy API</a></div><div class="strategy-grid"><?php foreach (($strategies ?? []) as $key => $label): ?><div class="strategy-chip"><strong><?= htmlspecialchars($label, ENT_QUOTES, 'UTF-8'); ?></strong><small><?= htmlspecialchars($key, ENT_QUOTES, 'UTF-8'); ?></small></div><?php endforeach; ?></div></section>
