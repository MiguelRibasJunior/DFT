<?php

// Liga IDs de analytics de TESTE no banco do e2e (ficam inertes: os scripts do Google são interceptados pelos testes).
$db = getenv('E2E_DB');

if (! $db || ! is_file($db)) {
    fwrite(STDERR, "E2E_DB não aponta para um arquivo existente.\n");
    exit(1);
}

$pdo = new PDO('sqlite:'.$db);
$changed = $pdo->exec("UPDATE site_settings SET google_analytics_id = 'G-E2ETEST123', google_tag_manager_id = 'GTM-E2ETEST1' WHERE id = 1");

if ($changed !== 1) {
    fwrite(STDERR, "Não encontrei a linha id=1 em site_settings.\n");
    exit(1);
}

echo "analytics de teste ligados\n";
