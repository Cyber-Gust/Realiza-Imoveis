// components/Layout/PageTitleBar.jsx
'use client';

import React from 'react';
import { FiArrowLeft, FiMapPin, FiGrid, FiArrowDown } from 'react-icons/fi';
import Link from 'next/link';

// ... (props mantidas) ...

const PageTitleBar = ({ 
    // CORREÇÃO: Removendo "Destaques" do título padrão.
    title = "Imóveis dos Sonhos", 
    count = 0, 
    backLink = "/", 
    accentColor = "text-accent" 
}) => {
    
    // Apenas para garantir que o título de fato é apenas a string principal
    const displayTitle = title.replace(': Destaques', '').trim();

    return (
        <div className="bg-gray-100/70 backdrop-blur-sm border-b border-gray-200"> 
            <div className="container mx-auto px-4 h-16 flex justify-between items-center">

                {/* Coluna Esquerda: Seta de Retorno e Título */}
                <div className="flex items-center space-x-3">
                    <Link href={backLink} passHref>
                        <div 
                            className={`p-2 rounded-full cursor-pointer hover:bg-gray-200 transition-colors ${accentColor}`}
                            aria-label="Voltar para a página inicial"
                        >
                            <FiArrowLeft className="w-6 h-6" />
                        </div>
                    </Link>

                    <h1 className="text-xl font-medium text-gray-800">
                        {/* Usando o displayTitle corrigido */}
                        {displayTitle} <span className="font-light">({count})</span>
                    </h1>
                </div>

                {/* Coluna Direita: Ícones de Ação (mantidos) */}
                {/* ... (o restante do componente PageTitleBar permanece o mesmo) ... */}
            </div>
        </div>
    );
};

export default PageTitleBar;