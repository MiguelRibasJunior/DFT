<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreContactRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nome' => ['required', 'string', 'max:150'],
            'empresa' => ['nullable', 'string', 'max:150'],
            'email' => ['required', 'email:filter', 'max:200'],
            'telefone' => ['required', 'string', 'max:30'],
            'tipoSolucao' => ['required', 'string', 'max:100'],
            'descricao' => ['required', 'string', 'max:3000'],
            'website_hp' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'required' => 'Preencha o campo :attribute.',
            'email' => 'Informe um :attribute válido.',
            'string' => 'O campo :attribute é inválido.',
            'max' => 'O campo :attribute deve ter no máximo :max caracteres.',
        ];
    }

    public function attributes(): array
    {
        return [
            'nome' => 'nome',
            'empresa' => 'empresa',
            'email' => 'e-mail',
            'telefone' => 'telefone',
            'tipoSolucao' => 'tipo de solução',
            'descricao' => 'descrição',
        ];
    }
}

