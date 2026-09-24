<?php
$siteTitle = $siteTitle ?? 'Hana-Eunhaeng';
$content = $content ?? '';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><?= htmlspecialchars($siteTitle, ENT_QUOTES, 'UTF-8'); ?></title>
    <link rel="stylesheet" href="/assets/css/styles.css" />
</head>
<body class="auth-body">
    <div class="auth-card">
        <div class="auth-logo">HE</div>
        <h1>Hana-Eunhaeng</h1>
        <p class="muted">Premium digital banking</p>
        <?= $content ?? ''; ?>
    </div>
</body>
</html>
