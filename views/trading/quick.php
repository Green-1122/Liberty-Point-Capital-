<?php
$siteTitle = 'Quick Trade';
?>
<section class="panel narrow-panel">
    <div class="topbar"><div><p class="eyebrow">Execution simulator</p><h2>Quick Trade</h2></div><a href="/trade" class="secondary-button">Trade history</a></div>
    <div class="alert alert-warning">Paper trading only. No real order is sent to a broker or exchange.</div>
    <form method="post" action="/trade/execute" class="stacked-form">
        <input type="hidden" name="_token" value="<?= htmlspecialchars(csrf_token(), ENT_QUOTES, 'UTF-8'); ?>">
        <label><span>Symbol</span><input name="symbol" placeholder="AAPL, BTC-USD, EURUSD" required></label>
        <div class="two-col"><label><span>Side</span><select name="side"><option value="buy">Buy</option><option value="sell">Sell</option></select></label><label><span>Quantity</span><input type="number" name="quantity" min="0.000001" step="0.000001" required></label></div>
        <label><span>Trading strategy</span><select name="strategy" required><?php foreach (($strategies ?? []) as $key => $label): ?><option value="<?= htmlspecialchars($key, ENT_QUOTES, 'UTF-8'); ?>"><?= htmlspecialchars($label, ENT_QUOTES, 'UTF-8'); ?></option><?php endforeach; ?></select></label>
        <label><span>Paper entry price</span><input type="number" name="entry_price" min="0.000001" step="0.000001" required></label>
        <div class="two-col"><label><span>Stop price optional</span><input type="number" name="stop_price" min="0" step="0.000001"></label><label><span>Take-profit optional</span><input type="number" name="take_profit_price" min="0" step="0.000001"></label></div>
        <button type="submit">Place paper trade</button>
    </form>
</section>
