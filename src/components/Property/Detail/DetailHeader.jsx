// components/Property/Detail/DetailHeader.jsx
'use client';

import React from 'react';
import { FiShare2, FiHeart } from 'react-icons/fi';

const DetailHeader = ({ imovel, accentColor = 'text-accent' }) => {
    
    // Função utilitária para formatação (pode ser movida para utils)
    const formatValue = (value) => {
        return `R$ ${value.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
    };

    return (
        <div className="space-y-4">
            
            {/* Tags e Valor Principal */}
            <div className="flex justify-between items-start">
                
                {/* Tags (Cód., Quarto, Status) */}
                <div className="flex items-center space-x-3 text-sm font-semibold">
                    {/* Tag Cód. */}
                    <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md">
                        Cód. {imovel.id}
                    </span>
                    {/* Tag Quarto */}
                    <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md">
                        Casa {imovel.caracteristicas.quartos} quartos
                    </span>
                    {/* Tag Venda/Locação */}
                    <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md">
                        Disponível para <span className="font-bold">{imovel.statusNegociacao}</span>
                    </span>
                </div>
                
                {/* Valor e Favorito/Share */}
                <div className="flex flex-col items-end">
                    <p className="text-sm text-gray-600">Valor para compra:</p>
                    <h2 className={`text-3xl font-extrabold ${accentColor}`}>
                        {formatValue(imovel.valorVenda)}
                    </h2>
                    {/* Botão de Mais Detalhes (pode ser um link) */}
                    <p className="text-sm text-blue-500 cursor-pointer hover:underline mt-1">
                        ↓ Mais detalhes
                    </p>
                </div>
            </div>

            {/* Título Principal */}
            <h1 className="text-3xl font-bold text-gray-800 leading-snug">
                {imovel.tituloPrincipal}
            </h1>

            {/* Endereço e Ações */}
            <div className="flex justify-between items-center">
                <div className="text-gray-600 text-base space-y-1">
                    <p className="font-semibold">Cond. {imovel.condominio} no bairro {imovel.bairro}</p>
                    <p className="text-sm">{imovel.endereco}</p>
                </div>
                
                {/* Ícones de Ação (Share/Favorite) */}
                <div className="flex space-x-4 text-gray-700">
                    <FiHeart className="w-6 h-6 cursor-pointer hover:text-red-500 transition-colors" />
                    <FiShare2 className="w-6 h-6 cursor-pointer hover:text-accent/80 transition-colors" />
                </div>
            </div>
        </div>
    );
};

export default DetailHeader;