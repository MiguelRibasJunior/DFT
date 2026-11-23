<?php

namespace Tests\Unit;

use FilesystemIterator;
use PHPUnit\Framework\TestCase;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;

/**
 * Um arquivo PHP que começa com BOM ou linha em branco antes do "<?php" imprime esses bytes em
 * TODA resposta HTTP. O navegador então recebe arquivos maiores que o declarado (o livewire.js
 * chega cortado e todo o painel /admin para de funcionar) e, em páginas JSON/Inertia, cabeçalhos
 * "already sent". Isso já aconteceu em bootstrap/app.php e routes/web.php, e os testes de feature
 * não percebem porque nunca passam por uma resposta HTTP real.
 */
class PhpFilesStartCleanTest extends TestCase
{
    /** Pastas carregadas pelo framework em toda requisição. */
    private const DIRECTORIES = ['app', 'bootstrap', 'config', 'database', 'routes'];

    public function test_no_php_file_has_bytes_before_the_opening_tag(): void
    {
        $root = dirname(__DIR__, 2);
        $offenders = [];
        $checked = 0;

        foreach (self::DIRECTORIES as $directory) {
            $path = $root.DIRECTORY_SEPARATOR.$directory;

            $files = new RecursiveIteratorIterator(
                new RecursiveDirectoryIterator($path, FilesystemIterator::SKIP_DOTS)
            );

            foreach ($files as $file) {
                if ($file->getExtension() !== 'php' || str_ends_with($file->getFilename(), '.blade.php')) {
                    continue;
                }

                $checked++;
                $start = (string) file_get_contents($file->getPathname(), false, null, 0, 8);

                if (! str_starts_with($start, '<?php')) {
                    $offenders[] = str_replace($root.DIRECTORY_SEPARATOR, '', $file->getPathname()).' começa com '.bin2hex(substr($start, 0, 5));
                }
            }
        }

        $this->assertGreaterThan(50, $checked, 'a varredura deveria encontrar os arquivos do projeto');
        $this->assertSame([], $offenders, "Arquivos PHP com bytes antes do <?php:\n".implode("\n", $offenders));
    }
}
