<?php

namespace App\Core;

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
}
