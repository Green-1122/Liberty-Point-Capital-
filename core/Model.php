<?php

namespace App\Core;

use App\Config\Database;
use PDO;

abstract class Model
{
    protected PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    protected function id(int|string|null $value): int
    {
        return max(0, (int) $value);
    }

    protected function limit(int $value, int $max = 100): int
    {
        return max(1, min($value, $max));
    }
}
