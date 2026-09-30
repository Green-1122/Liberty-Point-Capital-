<?php

namespace App\Core;

use App\Helpers\Formatter;

final class Template
{
    public static function pageTitle(string $title): string
    {
        return $title . ' | Hana-Eunhaeng';
    }
}
