<?php

/*
|--------------------------------------------------------------------------
| Inertia — ajustes do projeto
|--------------------------------------------------------------------------
|
| Só o que difere do padrão do pacote (o restante vem de vendor/inertiajs/inertia-laravel/config/inertia.php).
|
| As páginas ficam em resources/js/Pages (com "P" maiúsculo, como em resources/js/main.tsx). O padrão do
| pacote é resources/js/pages (minúsculo). No Windows a diferença passa despercebida, mas no Linux
| (servidor e CI) as pastas são diferentes e os testes com assertInertia() não achavam o componente.
|
*/

return [

    'pages' => [

        'ensure_pages_exist' => false,

        'paths' => [

            resource_path('js/Pages'),

        ],

        'extensions' => [

            'js',
            'jsx',
            'svelte',
            'ts',
            'tsx',
            'vue',

        ],

    ],

];
