<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // As views usam @vite, que exige public/build/manifest.json (ou o arquivo public/hot do servidor
        // de desenvolvimento). Em ambiente limpo, como o CI do GitHub, nenhum dos dois existe e toda página
        // que usa o layout dava erro 500. Os testes de backend não devem depender do build do front-end;
        // o build é validado pelo job "Frontend Lint, Type-Check & Build".
        $this->withoutVite();
    }
}
