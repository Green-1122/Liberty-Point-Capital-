<?php

namespace App\Models;

use App\Core\Model;
use PDO;

final class TradeModel extends Model
{
    public const STRATEGIES = [
        'market' => 'Market order',
        'limit' => 'Limit order',
        'stop_loss' => 'Stop-loss protection',
        'take_profit' => 'Take-profit target',
        'dollar_cost_average' => 'Dollar-cost averaging',
        'value' => 'Value investing',
        'growth' => 'Growth investing',
        'momentum' => 'Momentum trading',
        'swing' => 'Swing trading',
        'trend_following' => 'Trend following',
        'mean_reversion' => 'Mean reversion',
        'breakout' => 'Breakout trading',
        'pairs' => 'Pairs trading',
        'covered_call' => 'Covered call education',
    ];

    public function listByUser(int $userId, int $limit = 30): array
    {
        $stmt = $this->db->prepare(
            'SELECT id, symbol, side, strategy, quantity, entry_price, stop_price, take_profit_price, status, created_at FROM trades WHERE user_id = :user_id ORDER BY created_at DESC LIMIT :limit'
        );
        $stmt->bindValue('user_id', $userId, PDO::PARAM_INT);
        $stmt->bindValue('limit', max(1, min($limit, 100)), PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function createPaperTrade(int $userId, array $data): int
    {
        $strategy = $data['strategy'] ?? 'market';
        if (!array_key_exists($strategy, self::STRATEGIES)) {
            throw new \InvalidArgumentException('Unsupported trading strategy.');
        }

        $quantity = (float) ($data['quantity'] ?? 0);
        $entryPrice = (float) ($data['entry_price'] ?? 0);
        if ($quantity <= 0 || $entryPrice <= 0) {
            throw new \InvalidArgumentException('Quantity and entry price must be greater than zero.');
        }

        $stmt = $this->db->prepare(
            'INSERT INTO trades (user_id, symbol, side, strategy, quantity, entry_price, stop_price, take_profit_price, status, execution_mode, created_at) VALUES (:user_id, :symbol, :side, :strategy, :quantity, :entry_price, :stop_price, :take_profit_price, "open", "paper", NOW())'
        );
        $stmt->execute([
            'user_id' => $userId,
            'symbol' => strtoupper(trim($data['symbol'] ?? '')),
            'side' => $data['side'] ?? 'buy',
            'strategy' => $strategy,
            'quantity' => $quantity,
            'entry_price' => $entryPrice,
            'stop_price' => $data['stop_price'] ?: null,
            'take_profit_price' => $data['take_profit_price'] ?: null,
        ]);

        return (int) $this->db->lastInsertId();
    }

    public function closeOwnedTrade(int $userId, int $tradeId): bool
    {
        $stmt = $this->db->prepare('UPDATE trades SET status = "closed", closed_at = NOW() WHERE id = :id AND user_id = :user_id AND status = "open"');
        $stmt->execute(['id' => $tradeId, 'user_id' => $userId]);
        return $stmt->rowCount() === 1;
    }
}
