// components/Corretor/CorretorList.jsx
'use client';

import React from 'react';
import CorretorCard from './CorretorCard';

// O componente agora recebe a lista, mas não renderiza o título da seção
export default function CorretorList({ corretores = [] }) { 
    
    const isLoading = corretores.length === 0;

    if (isLoading) {
        return (
            <section className="container mx-auto px-4 py-6">
                {/* Removido o <h2> e apenas a mensagem de erro/vazio permanece */}
                <p className="text-center text-gray-600 py-8">
                    Nenhum corretor encontrado.
                </p>
            </section>
        );
    }

    return (
        <section className="container mx-auto px-4 py-6">
            {/* REMOVIDO: <h2 className="text-3xl font-bold text-gray-800 mb-8">{title}</h2> */}

            {/* Grid fluido (mantido) */}
            <div 
              className="grid gap-8"
              style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}
            >
                {/* Renderiza os Cards */}
                {corretores.map((c) => (
                    <CorretorCard key={c.id} corretor={c} /> 
                ))}
            </div>
        </section>
    );
}