<?php
$siteTitle = 'Open pension account';
?>
<section class="panel narrow-panel">
    <h2>Open a retirement account</h2>
    <p class="muted">Choose a plan, set a sustainable contribution, and name a beneficiary.</p>
    <form method="post" action="/pension/store" class="stacked-form">
        <input type="hidden" name="_token" value="<?= htmlspecialchars(csrf_token(), ENT_QUOTES, 'UTF-8'); ?>" />
        <label><span>Plan</span><select name="plan_id" required><option value="">Select a plan</option><?php foreach (($plans ?? []) as $plan): ?><option value="<?= (int) $plan['id']; ?>"><?= htmlspecialchars($plan['name'] . ' · ' . $plan['risk_level'] . ' · ' . $plan['annual_rate'] . '%', ENT_QUOTES, 'UTF-8'); ?></option><?php endforeach; ?></select></label>
        <label><span>Initial contribution</span><input type="number" name="initial_contribution" min="0" step="0.01" value="0" /></label>
        <label><span>Monthly contribution</span><input type="number" name="monthly_contribution" min="0" step="0.01" value="250" required /></label>
        <label><span>Target retirement age</span><input type="number" name="target_retirement_age" min="50" max="85" value="65" required /></label>
        <label><span>Beneficiary name</span><input type="text" name="beneficiary_name" required /></label>
        <label><span>Beneficiary relationship</span><input type="text" name="beneficiary_relation" required /></label>
        <button type="submit">Open retirement account</button>
    </form>
</section>
