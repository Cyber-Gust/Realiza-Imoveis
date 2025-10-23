// components/Property/Detail/DescriptionTabs.jsx
'use client';

import React, { useState } from 'react';
import { FiCheck } from 'react-icons/fi';

/**
 * Componente de Descrição, Posição e Comodidades do Imóvel com navegação por Tabs.
 */
const DescriptionTabs = ({ detalhes }) => {
    // Estado para controlar a aba ativa (Detalhes Imóvel vs Detalhes Condomínio)
    const [activeTab, setActiveTab] = useState('imovel');
    
    // Mapeamento visual das características
    const renderList = (items, title) => (
        <div className="mb-6">
            <h3 className="text-base font-semibold text-gray-700 border-b border-gray-100 pb-2 mb-3">
                {title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-2 text-sm text-gray-700">
                {items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        <FiCheck className="w-4 h-4 text-accent" />
                        <span>{item}</span>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderDetalhesImovel = () => (
        <div className="space-y-6">
            {/* Descrição Principal */}
            <div className="mb-6">
                <h3 className="text-base font-semibold text-accent pb-2">Descrição</h3>
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                    {detalhes.descricao}
                    {/* Botão de "Ler mais" (apenas visual) */}
                    <span className="text-blue-500 cursor-pointer hover:underline ml-1">...Ler mais</span>
                </p>
            </div>

            {/* Posição */}
            {detalhes.posicao && renderList(detalhes.posicao, 'Posição')}

            {/* Vista */}
            {detalhes.vista && renderList(detalhes.vista, 'Vista')}

            {/* Pisos */}
            {detalhes.pisoAreaSocial && renderList(detalhes.pisoAreaSocial, 'Piso predominante da área social')}
            {detalhes.pisoAreasMolhadas && renderList(detalhes.pisoAreasMolhadas, 'Piso predominante da área molhada')}
            {detalhes.pisoAreaIntima && renderList(detalhes.pisoAreaIntima, 'Piso predominante da área íntima')}
            
            {/* Acesso */}
            {detalhes.acesso && renderList(detalhes.acesso, 'Acesso')}

            {/* Acessórios e Comodidades */}
            {detalhes.comodidades && renderList(detalhes.comodidades, 'Acessórios e comodidades')}
        </div>
    );

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            {/* Abas de Navegação */}
            <div className="flex border-b border-gray-200 mb-6">
                <button
                    onClick={() => setActiveTab('imovel')}
                    className={`px-4 py-2 text-base font-medium transition-colors ${
                        activeTab === 'imovel' 
                            ? 'text-accent border-b-2 border-accent' 
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Detalhes Imóvel
                </button>
                <button
                    onClick={() => setActiveTab('condominio')}
                    className={`px-4 py-2 text-base font-medium transition-colors ${
                        activeTab === 'condominio' 
                            ? 'text-accent border-b-2 border-accent' 
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Detalhes Condomínio
                </button>
            </div>

            {/* Conteúdo da Aba */}
            <div>
                {activeTab === 'imovel' && renderDetalhesImovel()}
                {activeTab === 'condominio' && (
                    <div className="text-gray-500 p-4">
                        Informações do condomínio aqui (dados a serem implementados).
                    </div>
                )}
            </div>
        </div>
    );
};

export default DescriptionTabs;