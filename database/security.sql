CREATE TABLE IF NOT EXISTS `audit_events` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `actor_user_id` INT UNSIGNED NULL,
  `action` VARCHAR(80) NOT NULL,
  `resource` VARCHAR(80) NOT NULL,
  `resource_id` BIGINT UNSIGNED NULL,
  `ip_address` VARCHAR(45) NOT NULL,
  `user_agent` VARCHAR(255) NOT NULL,
  `metadata` JSON NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_audit_created` (`created_at`),
  KEY `idx_audit_actor` (`actor_user_id`, `created_at`),
  CONSTRAINT `fk_audit_actor` FOREIGN KEY (`actor_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `users` ADD UNIQUE KEY `uq_users_email` (`email`), ADD KEY `idx_users_active_role` (`is_active`, `role`);
ALTER TABLE `accounts` ADD UNIQUE KEY `uq_accounts_number` (`account_number`), ADD KEY `idx_accounts_user_status` (`user_id`, `status`);
ALTER TABLE `transactions` ADD KEY `idx_transactions_user_date` (`user_id`, `created_at`);
