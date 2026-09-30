<?php

namespace App\Models;

use App\Core\Model;
use PDO;

final class AuditModel extends Model
{
    public function record(?int $actorId, string $action, string $resource, ?int $resourceId = null, array $metadata = []): void
    {
        $stmt = $this->db->prepare(
            'INSERT INTO audit_events (actor_user_id, action, resource, resource_id, ip_address, user_agent, metadata, created_at) VALUES (:actor, :action, :resource, :resource_id, :ip, :agent, :metadata, NOW())'
        );
        $stmt->execute([
            'actor' => $actorId,
            'action' => substr($action, 0, 80),
            'resource' => substr($resource, 0, 80),
            'resource_id' => $resourceId,
            'ip' => substr($_SERVER['REMOTE_ADDR'] ?? 'unknown', 0, 45),
            'agent' => substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 255),
            'metadata' => json_encode($metadata, JSON_UNESCAPED_SLASHES),
        ]);
    }

    public function recent(int $limit = 50): array
    {
        $stmt = $this->db->prepare('SELECT ae.*, u.email FROM audit_events ae LEFT JOIN users u ON u.id = ae.actor_user_id ORDER BY ae.created_at DESC LIMIT :limit');
        $stmt->bindValue('limit', max(1, min($limit, 200)), PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }
}
