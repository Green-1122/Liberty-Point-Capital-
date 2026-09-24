<?php

define('APP_NAME', 'Hana-Eunhaeng');
define('APP_ENV', $_ENV['APP_ENV'] ?? 'development');
define('APP_BASE_PATH', dirname(__DIR__));

define('ROOT_PATH', APP_BASE_PATH);

define('PUBLIC_PATH', APP_BASE_PATH . '/public');

define('DB_HOST', $_ENV['DB_HOST'] ?? '127.0.0.1');
define('DB_NAME', $_ENV['DB_NAME'] ?? 'hana_eunhaeng');
define('DB_USER', $_ENV['DB_USER'] ?? 'root');
define('DB_PASS', $_ENV['DB_PASS'] ?? '');
