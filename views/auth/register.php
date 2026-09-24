<?php
$siteTitle = 'Create account';
?>
<section class="register-panel">
    <h2>Create account</h2>

    <?php if (!empty($error)): ?>
        <div class="alert alert-error"><?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8'); ?></div>
    <?php endif; ?>

    <form method="post" action="/register" class="stacked-form">
        <input type="hidden" name="_token" value="<?= htmlspecialchars($_SESSION['csrf_token'] ?? '', ENT_QUOTES, 'UTF-8'); ?>" />
        <label>
            <span>Full name</span>
            <input type="text" name="full_name" value="<?= htmlspecialchars($_POST['full_name'] ?? '', ENT_QUOTES, 'UTF-8'); ?>" required />
        </label>
        <label>
            <span>Email</span>
            <input type="email" name="email" value="<?= htmlspecialchars($_POST['email'] ?? '', ENT_QUOTES, 'UTF-8'); ?>" required />
        </label>
        <label>
            <span>Password</span>
            <input type="password" name="password" minlength="8" required />
        </label>
        <button type="submit">Open account</button>
    </form>
</section>
