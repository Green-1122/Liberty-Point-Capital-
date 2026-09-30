CREATE TABLE IF NOT EXISTS `trades` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `symbol` VARCHAR(24) NOT NULL,
  `side` ENUM('buy','sell') NOT NULL,
  `strategy` VARCHAR(40) NOT NULL,
  `quantity` DECIMAL(24,8) NOT NULL,
  `entry_price` DECIMAL(24,8) NOT NULL,
  `stop_price` DECIMAL(24,8) NULL,
  `take_profit_price` DECIMAL(24,8) NULL,
  `status` ENUM('open','closed','cancelled') NOT NULL DEFAULT 'open',
  `execution_mode` ENUM('paper','live') NOT NULL DEFAULT 'paper',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `closed_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  KEY `idx_trades_user_created` (`user_id`, `created_at`),
  KEY `idx_trades_user_status` (`user_id`, `status`),
  CONSTRAINT `fk_trades_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
