// components/Corretor/CorretorCard.jsx
'use client';

import React from 'react';
import Link from 'next/link';
// Ícones: WhatsApp, Email, Casa/Imóveis
import { FaWhatsapp, FaEnvelope, FaHome } from 'react-icons/fa';

/**
 * Componente Card Resumido do Corretor.
 * @param {object} corretor - Dados resumidos do corretor.
 * @param {string} accentColor - Cor Tailwind para destaque.
 */
const CorretorCard = ({ corretor, accentColor = 'text-accent' }) => {
    
    const whatsappLink = `https://wa.me/${corretor.telefone.replace(/\D/g, '')}`;
    const emailLink = `mailto:${corretor.email}`;
    const imoveisLink = `/imoveis?corretor=${corretor.slug}`; 
    const profileLink = `/corretores/${corretor.slug}`;

    return (
        // Container principal do Card: Efeito hover sutil e arredondado
        <div className="w-full bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
            
            {/* 1. Área da Imagem (Mantida) */}
            <Link href={profileLink} passHref>
                {/* Aumentei sutilmente o padding externo para dar mais respiro ao redor da foto */}
                <div className="relative w-full aspect-square cursor-pointer p-6"> 
                    {/* Alterei inset-4 para inset-6 para acompanhar o p-6 e manter o raio de 20px */}
                    <div className="absolute inset-6 overflow-hidden rounded-[20px] transition-transform duration-300 group-hover:scale-[1.02]">
                        <img
                            src={corretor.imagemPerfil}
                            alt={`Foto de perfil de ${corretor.nome}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </Link>

            {/* 2. Área de Dados Principais (Ajustado o padding vertical) */}
            {/* Alterei o p-4 pt-0 para p-6 pt-0 para o conteúdo ter mais espaço nas laterais e embaixo */}
            <div className="p-6 pt-0">
                
                {/* Nome e CRECI */}
                <h3 className={`text-xl font-bold ${accentColor} leading-tight mb-1`}>
                    {corretor.nome}
                </h3>
                {/* Aumentei a margem inferior para separar do bloco de contatos */}
                <p className="text-sm text-gray-600 mb-6"> 
                    CRECI {corretor.creci}
                </p>

                {/* Contatos */}
                {/* Aumentei o space-y-3 para space-y-4 para dar mais espaço entre os itens */}
                <div className="space-y-4"> 
                    {/* WhatsApp */}
                    <a href={whatsappLink} className="flex items-center space-x-2 text-gray-700 hover:text-green-500 transition-colors text-sm">
                        <FaWhatsapp className="w-4 h-4" />
                        <span>{corretor.telefone}</span>
                    </a>
                    
                    {/* E-mail */}
                    <a href={emailLink} className="flex items-center space-x-2 text-gray-700 hover:text-blue-500 transition-colors text-sm">
                        <FaEnvelope className="w-4 h-4" />
                        <span>{corretor.email}</span>
                    </a>
                    
                    {/* Total de Imóveis (Separado com uma pequena margem superior) */}
                    {/* Adicionado mt-2 para dar uma quebra sutil, simulando o print */}
                    <Link href={imoveisLink} passHref> 
                        <div className="flex items-center space-x-2 cursor-pointer hover:text-accent transition-colors mt-2 pt-2 border-t border-gray-100">
                            <FaHome className={`w-4 h-4 ${accentColor}`} />
                            <span className={`text-sm font-semibold ${accentColor}`}>
                                Meus imóveis ({corretor.imoveisCadastrados})
                            </span>
                        </div>
                    </Link>
                </div>
            </div>
            
        </div>
    );
};

export default CorretorCard;