<?php

namespace App\Models;

use App\Core\Model;
use PDO;

final class PensionModel extends Model
{
    public function plans(): array
    {
        return $this->db->query(
            'SELECT id, name, plan_type, description, annual_rate, minimum_contribution, employer_match_rate, risk_level FROM pension_plans WHERE is_active = 1 ORDER BY annual_rate DESC'
        )->fetchAll();
    }

    public function accountsByUser(int $userId): array
    {
        $stmt = $this->db->prepare(
            'SELECT pa.*, pp.name AS plan_name, pp.plan_type, pp.annual_rate FROM pension_accounts pa JOIN pension_plans pp ON pp.id = pa.plan_id WHERE pa.user_id = :user_id ORDER BY pa.created_at DESC'
        );
        $stmt->execute(['user_id' => $userId]);
        return $stmt->fetchAll();
    }

    public function contributionsByUser(int $userId, int $limit = 12): array
    {
        $stmt = $this->db->prepare(
            'SELECT pc.*, pa.account_number FROM pension_contributions pc JOIN pension_accounts pa ON pa.id = pc.pension_account_id WHERE pa.user_id = :user_id ORDER BY pc.created_at DESC LIMIT :limit'
        );
        $stmt->bindValue('user_id', $userId, PDO::PARAM_INT);
        $stmt->bindValue('limit', max(1, min($limit, 100)), PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function createAccount(array $data): int
    {
        $stmt = $this->db->prepare(
            'INSERT INTO pension_accounts (user_id, plan_id, account_number, current_balance, monthly_contribution, target_retirement_age, beneficiary_name, beneficiary_relation, status, created_at) VALUES (:user_id, :plan_id, :account_number, :current_balance, :monthly_contribution, :target_retirement_age, :beneficiary_name, :beneficiary_relation, :status, NOW())'
        );
        $stmt->execute($data + ['status' => 'active']);
        return (int) $this->db->lastInsertId();
    }

    public function contribute(int $userId, int $accountId, float $amount, string $source): bool
    {
        if ($amount <= 0) {
            throw new \InvalidArgumentException('Contribution must be greater than zero.');
        }

        $this->db->beginTransaction();
        try {
            $accountStmt = $this->db->prepare(
                'SELECT pa.id, pa.current_balance FROM pension_accounts pa WHERE pa.id = :account_id AND pa.user_id = :user_id AND pa.status = "active" FOR UPDATE'
            );
            $accountStmt->execute(['account_id' => $accountId, 'user_id' => $userId]);
            $account = $accountStmt->fetch();

            if (!$account) {
                throw new \RuntimeException('Pension account not found or inactive.');
            }

            $update = $this->db->prepare('UPDATE pension_accounts SET current_balance = current_balance + :amount, updated_at = NOW() WHERE id = :id');
            $update->execute(['amount' => $amount, 'id' => $accountId]);

            $insert = $this->db->prepare(
                'INSERT INTO pension_contributions (pension_account_id, amount, contribution_type, source, status, created_at) VALUES (:account_id, :amount, "personal", :source, "completed", NOW())'
            );
            $insert->execute(['account_id' => $accountId, 'amount' => $amount, 'source' => $source]);

            $this->db->commit();
            return true;
        } catch (\Throwable $exception) {
            $this->db->rollBack();
            throw $exception;
        }
    }
}
