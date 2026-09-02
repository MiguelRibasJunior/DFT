<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UploadController
{
    public function store(Request $request)
    {
        if (!$request->hasFile('file')) {
            return response()->json(['success' => false, 'message' => 'Nenhum arquivo enviado.'], 400);
        }

        $file = $request->file('file');

        // Whitelist allowed extensions and mimes
        $allowedExtensions = ['png', 'jpg', 'jpeg', 'webp', 'svg', 'pdf'];
        $allowedMimes = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'application/pdf'];

        $extension = strtolower($file->getClientOriginalExtension());
        $mime = $file->getMimeType();
        $size = $file->getSize();

        if (!in_array($extension, $allowedExtensions) || !in_array($mime, $allowedMimes)) {
            return response()->json([
                'success' => false,
                'message' => 'Tipo de arquivo não permitido. Extensões aceitas: PNG, JPG, WebP, SVG, PDF.'
            ], 422);
        }

        if ($size > 5 * 1024 * 1024) { // 5MB limit
            return response()->json([
                'success' => false,
                'message' => 'Tamanho do arquivo excede o limite máximo de 5MB.'
            ], 422);
        }

        $safeFilename = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', $file->getClientOriginalName());
        
        // Save file to storage/app/public/uploads or simulated safe path
        $path = $file->storeAs('uploads', $safeFilename, 'public');

        return response()->json([
            'success' => true,
            'url' => "/storage/{$path}",
            'filename' => $safeFilename,
            'size' => $size,
            'message' => 'Arquivo enviado com sucesso.'
        ]);
    }
}
