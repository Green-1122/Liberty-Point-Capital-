<?php

namespace App\Models;

use App\Core\Model;

final class AccountModel extends Model
{
    public function getByUser(int $userId): array
    {
        $stmt = $this->db->prepare('SELECT * FROM accounts WHERE user_id = :user_id ORDER BY created_at DESC');
        $stmt->execute(['user_id' => $userId]);
        return $stmt->fetchAll();
    }

    public function getPrimary(int $userId): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM accounts WHERE user_id = :user_id ORDER BY is_primary DESC, created_at DESC LIMIT 1');
        $stmt->execute(['user_id' => $userId]);
        $account = $stmt->fetch();
        return $account ?: null;
    }

    public function create(array $data): int
    {
        $stmt = $this->db->prepare(
            'INSERT INTO accounts (user_id, account_number, account_type, balance, currency, status, is_primary, created_at) VALUES (:user_id, :account_number, :account_type, :balance, :currency, :status, :is_primary, NOW())'
        );

        $stmt->execute([
            'user_id' => $data['user_id'],
            'account_number' => $data['account_number'],
            'account_type' => $data['account_type'],
            'balance' => $data['balance'] ?? 0,
            'currency' => $data['currency'] ?? 'USD',
            'status' => $data['status'] ?? 'active',
            'is_primary' => $data['is_primary'] ?? 0,
        ]);

        return (int) $this->db->lastInsertId();
    }
}
