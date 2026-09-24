<?php

namespace App\Models;

use App\Core\Model;

final class TransactionModel extends Model
{
    public function recentByUser(int $userId, int $limit = 10): array
    {
        $stmt = $this->db->prepare(
            'SELECT * FROM transactions WHERE user_id = :user_id ORDER BY created_at DESC LIMIT :limit'
        );
        $stmt->bindValue('user_id', $userId, \PDO::PARAM_INT);
        $stmt->bindValue('limit', $limit, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function create(array $data): int
    {
        $stmt = $this->db->prepare(
            'INSERT INTO transactions (user_id, account_id, type, amount, currency, direction, description, status, created_at) VALUES (:user_id, :account_id, :type, :amount, :currency, :direction, :description, :status, NOW())'
        );

        $stmt->execute([
            'user_id' => $data['user_id'],
            'account_id' => $data['account_id'],
            'type' => $data['type'],
            'amount' => $data['amount'],
            'currency' => $data['currency'] ?? 'USD',
            'direction' => $data['direction'],
            'description' => $data['description'],
            'status' => $data['status'] ?? 'completed',
        ]);

        return (int) $this->db->lastInsertId();
    }
}
