CREATE DATABASE IF NOT EXISTS `hana_eunhaeng` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `hana_eunhaeng`;

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `full_name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(160) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `is_active` TINYINT UNSIGNED NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `accounts` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `account_number` VARCHAR(40) NOT NULL,
  `account_type` VARCHAR(40) NOT NULL,
  `balance` DECIMAL(18,2) NOT NULL DEFAULT 0.00,
  `currency` CHAR(3) NOT NULL DEFAULT 'USD',
  `status` VARCHAR(30) NOT NULL DEFAULT 'active',
  `is_primary` TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `fk_accounts_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `transactions` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `account_id` INT UNSIGNED NULL,
  `type` VARCHAR(40) NOT NULL,
  `amount` DECIMAL(18,2) NOT NULL,
  `currency` CHAR(3) NOT NULL DEFAULT 'USD',
  `direction` ENUM('inbound','outbound') NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `status` VARCHAR(30) NOT NULL DEFAULT 'completed',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_transactions_user` (`user_id`),
  CONSTRAINT `fk_transactions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `loans` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `loan_name` VARCHAR(100) NOT NULL,
  `principal_amount` DECIMAL(18,2) NOT NULL,
  `status` VARCHAR(30) NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_loans_user` (`user_id`),
  CONSTRAINT `fk_loans_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `users` (`full_name`, `email`, `password_hash`, `role`, `is_active`) VALUES
('Demo User', 'demo@hana-eunhaeng.com', '$2y$10$3O0sF3d2XcLz5m0j.uzlM.ce8wF/2.h0r7Q7D2n9t9Q3vq8M7AQYW', 0, 1),
('Admin User', 'admin@hana-eunhaeng.com', '$2y$10$3O0sF3d2XcLz5m0j.uzlM.ce8wF/2.h0r7Q7D2n9t9Q3vq8M7AQYW', 1, 1)
ON DUPLICATE KEY UPDATE `email` = `email`;

INSERT INTO `accounts` (`user_id`, `account_number`, `account_type`, `balance`, `currency`, `status`, `is_primary`) VALUES
(1, 'HN-00000001', 'checking', 8480.00, 'USD', 'active', 1),
(1, 'HN-00000002', 'savings', 24500.00, 'USD', 'active', 0),
(2, 'HN-ADMIN-01', 'admin', 95000.00, 'USD', 'active', 1)
ON DUPLICATE KEY UPDATE `account_number` = `account_number`;

INSERT INTO `transactions` (`user_id`, `account_id`, `type`, `amount`, `currency`, `direction`, `description`, `status`) VALUES
(1, 1, 'salary', 4200.00, 'USD', 'inbound', 'Monthly payroll', 'completed'),
(1, 1, 'transfer', 320.00, 'USD', 'outbound', 'Card payment', 'completed'),
(1, 1, 'deposit', 1500.00, 'USD', 'inbound', 'Savings top-up', 'completed')
ON DUPLICATE KEY UPDATE `description` = `description`;

INSERT INTO `loans` (`user_id`, `loan_name`, `principal_amount`, `status`) VALUES
(1, 'Home Savings Advance', 28000.00, 'active'),
(1, 'Education Support', 12000.00, 'review')
ON DUPLICATE KEY UPDATE `loan_name` = `loan_name`;
