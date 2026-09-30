<?php

namespace App\Controllers;

use App\Core\Controller;
use App\Middleware\AuthMiddleware;
use App\Models\TradeModel;

final class TradeController extends Controller
{
    public function index(): void
    {
        AuthMiddleware::requireAuth();
        $this->render('trading/index', [
            'trades' => (new TradeModel())->listByUser((int) $_SESSION['user']['id']),
            'strategies' => TradeModel::STRATEGIES,
        ], 'app');
    }

    public function quick(): void
    {
        AuthMiddleware::requireAuth();
        $this->render('trading/quick', ['strategies' => TradeModel::STRATEGIES], 'app');
    }

    public function execute(): void
    {
        AuthMiddleware::requireAuth();
        validate_csrf();

        try {
            (new TradeModel())->createPaperTrade((int) $_SESSION['user']['id'], [
                'symbol' => $_POST['symbol'] ?? '',
                'side' => $_POST['side'] ?? 'buy',
                'strategy' => $_POST['strategy'] ?? 'market',
                'quantity' => $_POST['quantity'] ?? 0,
                'entry_price' => $_POST['entry_price'] ?? 0,
                'stop_price' => $_POST['stop_price'] ?? null,
                'take_profit_price' => $_POST['take_profit_price'] ?? null,
            ]);
            flash('success', 'Paper trade created. Live execution is disabled until a regulated broker is connected.');
        } catch (\Throwable $exception) {
            flash('error', $exception->getMessage());
        }

        redirect('/trade');
    }

    public function close(): void
    {
        AuthMiddleware::requireAuth();
        validate_csrf();
        $closed = (new TradeModel())->closeOwnedTrade((int) $_SESSION['user']['id'], (int) ($_POST['trade_id'] ?? 0));
        flash($closed ? 'success' : 'error', $closed ? 'Paper trade closed.' : 'Trade was not found or is already closed.');
        redirect('/trade');
    }
}
