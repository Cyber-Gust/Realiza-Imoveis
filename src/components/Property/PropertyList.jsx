// components/Property/PropertyList.jsx
'use client';

import React from 'react';
import PropertyCard from './PropertyCard';

/**
 * Componente de lista de imóveis em formato Grid.
 *
 * @param {Array} properties - A lista de objetos de imóveis a serem exibidos.
 * @param {string} title - O título da seção (opcional).
 */
export default function PropertyList({ properties = [], title = "Imóveis" }) {
    
    const isLoading = properties.length === 0;

    // Se o loading for o único estado possível, mostramos uma mensagem de erro/vazio.
    if (isLoading) {
        return (
            <section className="container mx-auto px-4 py-6">
                <h2 className="text-2xl font-bold text-accent mb-6">{title}</h2>
                <p className="text-center text-gray-600 py-8">
                    Nenhum imóvel encontrado neste segmento.
                </p>
            </section>
        );
    }

    return (
        <section className="container mx-auto px-4 py-0">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">{title}</h2>

            {/* Grid fluido que se ajusta. MANTENDO O ESTILO PERFEITO. */}
            <div 
              className="grid gap-8"
              // Usando inline style para o grid fluido, garantindo colunas mínimas de 300px
              style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}
            >
                {/* Renderiza os Cards */}
                {properties.map((p) => (
                    // Não alteramos o PropertyCard, ele continua recebendo apenas 'property'
                    <PropertyCard key={p.id} property={p} /> 
                ))}
            </div>
        </section>
    );
}