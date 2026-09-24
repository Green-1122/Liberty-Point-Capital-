ALTER TABLE `accounts` ADD INDEX `idx_accounts_user_status` (`user_id`, `status`);

CREATE TABLE IF NOT EXISTS `pension_plans` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `plan_type` VARCHAR(40) NOT NULL,
  `description` VARCHAR(500) NOT NULL,
  `annual_rate` DECIMAL(8,3) NOT NULL DEFAULT 0.000,
  `minimum_contribution` DECIMAL(18,2) NOT NULL DEFAULT 0.00,
  `employer_match_rate` DECIMAL(8,3) NOT NULL DEFAULT 0.000,
  `risk_level` ENUM('low','moderate','high') NOT NULL DEFAULT 'moderate',
  `is_active` TINYINT UNSIGNED NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `idx_pension_plans_active_rate` (`is_active`, `annual_rate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `pension_accounts` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `plan_id` INT UNSIGNED NOT NULL,
  `account_number` VARCHAR(40) NOT NULL UNIQUE,
  `current_balance` DECIMAL(18,2) NOT NULL DEFAULT 0.00,
  `monthly_contribution` DECIMAL(18,2) NOT NULL DEFAULT 0.00,
  `target_retirement_age` TINYINT UNSIGNED NOT NULL,
  `beneficiary_name` VARCHAR(120) NOT NULL,
  `beneficiary_relation` VARCHAR(80) NOT NULL,
  `status` ENUM('active','paused','closed') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_pension_accounts_user_status` (`user_id`, `status`),
  CONSTRAINT `fk_pension_accounts_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pension_accounts_plan` FOREIGN KEY (`plan_id`) REFERENCES `pension_plans` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `pension_contributions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `pension_account_id` INT UNSIGNED NOT NULL,
  `amount` DECIMAL(18,2) NOT NULL,
  `contribution_type` VARCHAR(30) NOT NULL,
  `source` VARCHAR(100) NOT NULL,
  `status` VARCHAR(30) NOT NULL DEFAULT 'completed',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_pension_contributions_account_date` (`pension_account_id`, `created_at`),
  CONSTRAINT `fk_pension_contributions_account` FOREIGN KEY (`pension_account_id`) REFERENCES `pension_accounts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `pension_plans` (`name`, `plan_type`, `description`, `annual_rate`, `minimum_contribution`, `employer_match_rate`, `risk_level`) VALUES
('Hana Secure Retirement', 'fixed_income', 'Capital-conscious retirement savings with a stable allocation.', 3.500, 25.00, 0.000, 'low'),
('Hana Balanced Growth', 'balanced', 'Diversified retirement portfolio for long-term growth.', 6.250, 50.00, 2.000, 'moderate'),
('Hana Global Growth', 'equity', 'Higher-growth retirement portfolio with increased market exposure.', 8.000, 100.00, 3.000, 'high');
