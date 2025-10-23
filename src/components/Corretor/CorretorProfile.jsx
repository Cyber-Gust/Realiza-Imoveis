// components/Corretor/CorretorProfile.jsx
'use client';

import React from 'react';
// Ícones: WhatsApp, Email, Casa/Imóveis
import { FaWhatsapp, FaEnvelope, FaHome } from 'react-icons/fa';

const ContactItem = ({ icon: Icon, text, href, accentColor }) => (
    <div className="flex items-center space-x-3 mb-2">
        <Icon className={`w-5 h-5 ${accentColor}`} />
        <a href={href} className={`text-base text-gray-700 hover:${accentColor} transition-colors`}>
            {text}
        </a>
    </div>
);

/**
 * Componente de Perfil Completo do Corretor (Versão Desktop e Mobile).
 * @param {object} data - Dados completos do corretor.
 * @param {string} accentColor - Cor Tailwind para destaque.
 */
const CorretorProfile = ({ data, accentColor = 'text-accent' }) => {

    // Gerar link do WhatsApp (para teste, pode ser mais complexo em produção)
    const whatsappLink = `https://wa.me/${data.telefone.replace(/\D/g, '')}`;
    const emailLink = `mailto:${data.email}`;
    // Link futuro para a página de imóveis filtrados do corretor
    const imoveisLink = `/imoveis?corretor=${data.nome.replace(/\s/g, '-')}`;

    return (
        <section className="container mx-auto px-4 py-12 md:py-16">

            {/* Layout Principal: Mobile (stack) / Desktop (flex-row: Imagem e Conteúdo) */}
            <div className="flex flex-col md:flex-row md:space-x-12">

                {/* 1. Coluna Esquerda (Mobile: Largura total / Desktop: Largura da Imagem) */}
                {/* Ocupa 1/3 no Desktop */}
                <div className="w-full md:w-1/3 flex justify-center md:justify-start mb-8 md:mb-0">

                    {/* Imagem do Corretor */}
                    <img
                        src={data.imagemPerfil}
                        alt={`Foto de perfil de ${data.nome}`}
                        // Removendo 'w-full max-w-xs' para dar lugar à largura do container, 
                        // mas limitando o tamanho para não ficar gigante no desktop
                        className="w-full md:w-[350px] h-auto rounded-xl shadow-lg object-cover"
                    />
                </div>

                {/* 2. Coluna Direita (Mobile: Largura total / Desktop: Largura do Conteúdo) */}
                {/* Ocupa 2/3 no Desktop. CONTEÚDO COMPLETO DE TEXTO E CONTATO */}
                <div className="w-full md:w-2/3 mt-0 md:mt-0">

                    {/* **BLOCO DE CABEÇALHO E CONTATOS** */}
                    <div className="w-full">

                        {/* Cargo */}
                        <span className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                            Corretor de imóveis
                        </span>

                        {/* Nome e CRECI */}
                        <h1 className={`text-3xl font-bold ${accentColor} mb-1`}>
                            {data.nome}
                        </h1>
                        <p className="text-sm text-gray-600 mb-6">
                            CRECI {data.creci}
                        </p>

                        {/* Contatos */}
                        <div className="space-y-3 mb-8">
                            <ContactItem
                                icon={FaWhatsapp}
                                text={data.telefone}
                                href={whatsappLink}
                                accentColor={accentColor}
                            />
                            <ContactItem
                                icon={FaEnvelope}
                                text={data.email}
                                href={emailLink}
                                accentColor={accentColor}
                            />
                            <ContactItem
                                icon={FaHome}
                                text={`Meus imóveis (${data.imoveisCadastrados})`}
                                href={imoveisLink}
                                accentColor={accentColor}
                            />
                        </div>
                    </div>

                    {/* **BLOCO DE TEXTO LONGO (RESUMO E DETALHES)** */}

                    {/* Resumo */}
                    <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-6 font-medium">
                        {data.resumo}
                    </p>

                    {/* Detalhes */}
                    {data.detalhes && data.detalhes.length > 0 && (
                        <div className="space-y-5 text-sm md:text-base text-gray-700 leading-relaxed">
                            {data.detalhes.map((paragrafo, index) => (
                                <p key={index}>{paragrafo}</p>
                            ))}
                        </div>
                    )}
                </div>
            </div>

        </section>
    );
};


export default CorretorProfile;