<?php

namespace App\Models;

use App\Core\Model;

final class LoanModel extends Model
{
    public function recentByUser(int $userId): array
    {
        $stmt = $this->db->prepare('SELECT * FROM loans WHERE user_id = :user_id ORDER BY created_at DESC LIMIT 5');
        $stmt->execute(['user_id' => $userId]);
        return $stmt->fetchAll();
    }
}
