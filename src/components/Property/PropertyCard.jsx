// components/Property/PropertyCard.jsx
'use client';

import React from 'react';
// 1. Importar o Link do Next.js
import Link from 'next/link'; 
import { FiUpload, FiHeart } from 'react-icons/fi';
// Ícones baseados nas imagens: Cama, Chuveiro/Banheira, Carro, Metragem, Moto, Elevador
import { FaBed, FaShower, FaCar, FaMotorcycle, FaRulerCombined } from 'react-icons/fa';
import { BiSquare } from 'react-icons/bi';
import { GiElevator } from 'react-icons/gi';

// Mapeamento dos ícones para as características (Mantido funcional)
const iconMap = {
    quartos: { icon: FaBed, label: 'quarto' },
    suites: { icon: FaShower, label: 'suíte' },
    banheiros: { icon: FaShower, label: 'banheiro' },
    vagas: { icon: FaCar, label: 'vaga' },
    vagaMoto: { icon: FaMotorcycle, label: 'vaga moto' },
    areaM2: { icon: FaRulerCombined, label: 'm²' },
    elevadores: { icon: GiElevator, label: 'elevador' },
};

const PropertyCard = ({ property }) => {
    
    // 2. Definir a URL de destino
    const detailUrl = `/imoveis/${property.slug}`;

    const relevantCharacteristics = Object.keys(property.caracteristicas).filter(
        key => property.caracteristicas[key] > 0
    );

    const getIcon = (key) => {
        const IconComponent = iconMap[key]?.icon;
        // Mantido text-gray-700 para os ícones de características
        return IconComponent ? (
            <IconComponent className="w-4 h-4 text-gray-700" />
        ) : null;
    };

    const formatValue = (key, value) => {
        if (key === 'areaM2') return `${value} m²`;
        if (key === 'suites') return `${value} suíte${value > 1 ? 's' : ''}`;
        let label = iconMap[key]?.label || '';
        if (value > 1 && !['m²', 'suíte'].includes(label)) label += 's';
        return `${value} ${label}`;
    };

    return (
        // Container principal do Card.
        <div className="w-full max-w-md mx-auto sm:max-w-none md:max-w-[320px] lg:max-w-[320px] xl:max-w-[320px] bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden mb-6 group">

            {/* Header (Topo do Card) - FORA DO LINK para manter a funcionalidade dos ícones de ação */}
            <div className="flex items-center justify-between p-3 bg-gray-50" >
                <div className="flex items-center space-x-2">
                    <img
                        src={property.corretorAvatar || '/images/avatar-beta.jpg'}
                        alt={property.corretor}
                        className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium text-gray-800">{property.corretor}</span>
                </div>
                {/* Ícones de Ação (Upload/Favorito) */}
                <div className="flex space-x-3 text-accent">
                    <FiUpload className="w-5 h-5 cursor-pointer hover:text-accent/90" />
                    <FiHeart className="w-5 h-5 cursor-pointer hover:text-red-500" />
                </div>
            </div >

            {/* 3. ENVOLVER O RESTANTE DO CARD COM O LINK */}
            <Link href={detailUrl} passHref>

                {/* Imagem do imóvel: Container com o PADDING para criar o "quadro" branco */}
                {/* O cursor-pointer é mantido para indicar a clicabilidade */}
                <div className="relative p-4 w-full cursor-pointer h-72">
                    
                    {/* Container Interno da Imagem e Overlay */}
                    <div className="absolute inset-4 overflow-hidden rounded-[20px]">
                        
                        {/* Imagem em si */}
                        <img
                            src={property.imagemPrincipal || '/images/no-image.jpg'}
                            alt={`Imagem do imóvel ${property.id}`}
                            className="w-full h-full object-cover" 
                        />

                        {/* OVERLAY ESCURO E ANIMAÇÕES AVANÇADAS */}
                        <div
                            className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-opacity duration-500 ease-in-out flex flex-col items-center justify-center p-4 text-center rounded-[20px]"
                        >
                            {/* Avatar do Corretor */}
                            <img
                                src={property.corretorAvatar || "https://via.placeholder.com/80/2A4B42/FFFFFF?text=AVATAR"}
                                alt={property.corretor}
                                className="w-20 h-20 rounded-full object-cover transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 mb-3"
                            />

                            {/* Texto de Chamada de Ação: Surge de Baixo */}
                            <span
                                className="text-white text-lg font-bold transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                            >
                                Realize aqui, sua próxima visita!
                            </span>
                            {/* Verde -> accent */}
                            <span
                                className="text-accent text-sm font-medium transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 mt-1"
                            >
                                Clique e veja todos os detalhes.
                            </span>
                        </div>
                    </div>
                </div >

                {/* Características */}
                <div className="p-4 grid grid-cols-2 gap-y-3 gap-x-6 border-t border-gray-100" >
                    {
                        relevantCharacteristics.map((key) => {
                            const value = property.caracteristicas[key];
                            return (
                                <div key={key} className="flex items-center space-x-2">
                                    {getIcon(key)}
                                    <span className="text-sm text-gray-700 capitalize">
                                        {formatValue(key, value)}
                                    </span>
                                </div>
                            );
                        })
                    }
                </div >

                {/* Informações */}
                <div className="p-4" >
                    <p className="text-xs text-gray-500 mb-1">
                        Cód. {property.id} / {property.tituloCurto}
                    </p>
                    <p className="text-sm font-medium text-gray-800 mb-2">
                        {property.condominio} no bairro {property.bairro}
                    </p>
                    {/* Verde -> accent */}
                    <h3 className="text-base font-bold text-accent leading-snug mb-3">
                        {property.tituloDetalhe}
                    </h3>
                </div >

                {/* Footer (Botão de 'Entre sem bater' agora faz parte da área clicável) */}
                <div className="flex items-center justify-between p-4 bg-gray-50 border-t border-gray-100" >
                    <div>
                        <p className="text-xs text-gray-500">
                            Valor de {property.status.toLowerCase()}
                        </p>
                        {/* Verde -> accent */}
                        <p className="text-xl font-bold text-accent">
                            R$ {property.valorLocacao}
                        </p>
                    </div>
                    {/* O botão também deve ser clicável como parte da navegação */}
                    <button 
                        className="bg-accent text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-accent/90 transition-colors text-sm"
                        // Evita que o clique no botão se propague se ele tiver um handler separado
                        onClick={(e) => { e.preventDefault(); /* Adicione lógica de CTA se necessário */ }}
                    >
                        Entre sem bater
                    </button>
                </div >
            </Link>
        </div >
    );
};

export default PropertyCard;