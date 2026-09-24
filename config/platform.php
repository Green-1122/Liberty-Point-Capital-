<?php

return [
    'app_name' => 'Liberty Point Capital',
    'environment' => getenv('APP_ENV') ?: 'development',
    'timezone' => getenv('APP_TIMEZONE') ?: 'UTC',
    'default_currency' => getenv('APP_CURRENCY') ?: 'USD',
    'paper_trading_only' => filter_var(getenv('PAPER_TRADING_ONLY') ?: 'true', FILTER_VALIDATE_BOOLEAN),
];
