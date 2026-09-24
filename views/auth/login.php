<?php
$siteTitle = 'Welcome to Hana-Eunhaeng';
?>
<section class="login-panel">
    <h2>Welcome back</h2>

    <?php if (!empty($error)): ?>
        <div class="alert alert-error"><?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8'); ?></div>
    <?php endif; ?>

    <form method="post" action="/login" class="stacked-form">
        <input type="hidden" name="_token" value="<?= htmlspecialchars($_SESSION['csrf_token'] ?? '', ENT_QUOTES, 'UTF-8'); ?>" />
        <label>
            <span>Email</span>
            <input type="email" name="email" value="<?= htmlspecialchars($_POST['email'] ?? '', ENT_QUOTES, 'UTF-8'); ?>" required />
        </label>
        <label>
            <span>Password</span>
            <input type="password" name="password" required />
        </label>
        <button type="submit">Sign in</button>
    </form>

    <div class="meta-links">
        <a href="/register">Create account</a>
    </div>
</section>
