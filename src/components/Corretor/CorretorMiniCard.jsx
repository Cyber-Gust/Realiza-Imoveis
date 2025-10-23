// components/Corretor/CorretorMiniCard.jsx
'use client';

import React from 'react';
import Link from 'next/link';
import { FaWhatsapp, FaEnvelope, FaHome } from 'react-icons/fa';

const CorretorMiniCard = ({ corretor, accentColor = 'text-accent' }) => {
    
    const whatsappLink = `https://wa.me/${corretor.telefone.replace(/\D/g, '')}`;
    const emailLink = `mailto:${corretor.email}`;
    const profileLink = `/corretores/${corretor.slug}`;
    const imoveisLink = `/imoveis?corretor=${corretor.slug}`;
    
    return (
        // Container com fundo branco e leve sombreamento
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
                Imóvel cuidadosamente cadastrado por...
            </h3>
            
            <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <img 
                    src={corretor.imagemPerfil}
                    alt={corretor.nome}
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 mb-3"
                />
                
                {/* Nome e CRECI */}
                <span className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold px-2 py-0.5 rounded-full mb-2">
                    Corretor de imóveis
                </span>
                <Link href={profileLink} passHref>
                    <h4 className={`text-lg font-bold ${accentColor} hover:underline cursor-pointer`}>
                        {corretor.nome}
                    </h4>
                </Link>
                <p className="text-xs text-gray-500 mb-4">
                    CRECI {corretor.creci}
                </p>

                {/* Contatos e Ações */}
                <div className="w-full space-y-2 text-sm">
                    <a href={whatsappLink} className="flex items-center space-x-2 text-gray-700 hover:text-green-500 transition-colors">
                        <FaWhatsapp className={`w-4 h-4 ${accentColor}`} />
                        <span>{corretor.telefone}</span>
                    </a>
                    <a href={emailLink} className="flex items-center space-x-2 text-gray-700 hover:text-blue-500 transition-colors">
                        <FaEnvelope className={`w-4 h-4 ${accentColor}`} />
                        <span>{corretor.email}</span>
                    </a>
                    <Link href={profileLink} passHref>
                        <div className="flex items-center space-x-2 text-gray-700 hover:text-accent transition-colors cursor-pointer">
                            <FaHome className={`w-4 h-4 ${accentColor}`} />
                            <span>Meu perfil</span>
                        </div>
                    </Link>
                    <Link href={imoveisLink} passHref>
                        <div className="flex items-center space-x-2 text-gray-700 hover:text-accent transition-colors cursor-pointer">
                            <FaHome className={`w-4 h-4 ${accentColor}`} />
                            <span>Meus imóveis ({corretor.imoveisCadastrados})</span>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CorretorMiniCard;