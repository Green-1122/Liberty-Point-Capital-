<?php

namespace App\Models;

use App\Core\Model;

final class UserModel extends Model
{
    public function findByEmail(string $email): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM users WHERE email = :email LIMIT 1');
        $stmt->execute(['email' => strtolower(trim($email))]);
        return $stmt->fetch() ?: null;
    }

    public function create(array $data): int
    {
        $stmt = $this->db->prepare('INSERT INTO users (full_name, email, password_hash, role, is_active, created_at) VALUES (:full_name, :email, :password_hash, :role, :is_active, NOW())');
        $stmt->execute([
            'full_name' => trim($data['full_name']),
            'email' => strtolower(trim($data['email'])),
            'password_hash' => password_hash($data['password'], PASSWORD_DEFAULT),
            'role' => $data['role'] ?? 0,
            'is_active' => $data['is_active'] ?? 1,
        ]);
        return (int) $this->db->lastInsertId();
    }

    public function getSummary(int $userId): array
    {
        $stmt = $this->db->prepare('SELECT id, full_name, email, role, is_active, created_at FROM users WHERE id = :id LIMIT 1');
        $stmt->execute(['id' => $userId]);
        return $stmt->fetch() ?: [];
    }

    public function listAll(int $limit = 100): array
    {
        $stmt = $this->db->prepare('SELECT id, full_name, email, role, is_active, created_at FROM users ORDER BY created_at DESC LIMIT :limit');
        $stmt->bindValue('limit', max(1, min($limit, 500)), \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function setActive(int $userId, bool $active): bool
    {
        $stmt = $this->db->prepare('UPDATE users SET is_active = :active WHERE id = :id');
        return $stmt->execute(['active' => $active ? 1 : 0, 'id' => $userId]);
    }

    public function countByRole(int $role): int
    {
        $stmt = $this->db->prepare('SELECT COUNT(*) FROM users WHERE role = :role');
        $stmt->execute(['role' => $role]);
        return (int) $stmt->fetchColumn();
    }
}
