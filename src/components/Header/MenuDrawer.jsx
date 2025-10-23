// components/Header/MenuDrawer.jsx
'use client'

import React from 'react';
import { FiX } from 'react-icons/fi';
// Importação do logo SOUZA GOMES (você deve substituir isso pelo seu SVG/Componente real)
const LogoSG = () => (
    <div className="flex items-center space-x-2">
        {/* Usando um placeholder SVG para simular o logo com a cor accent */}
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
        <h1 className="text-xl font-bold text-gray-800 leading-none">
            <span className="text-accent text-3xl font-extrabold hidden">G</span> SOUZA GOMES
        </h1>
    </div>
);

/**
 * Componente de Menu Lateral (Drawer)
 * Desliza da direita e contém os links de navegação.
 *
 * @param {boolean} isOpen - Controla se o modal está aberto.
 * @param {function} onClose - Função para fechar o modal.
 * @param {string} accentColor - Cor Tailwind para a cor principal (Ex: 'text-accent').
 */
const MenuDrawer = ({ isOpen, onClose, accentColor = 'text-accent' }) => {

    // Conteúdo do Menu, dividido por seções
    const menuContent = [
        {
            title: "Conteúdo",
            links: [
                { name: 'Carta dos donos', href: '#' },
                { name: 'Guia dos bairros', href: '#' },
                { name: 'SGPLay', href: '#' },
                { name: 'Blog da Beta', href: '#' },
                { name: 'Co-branding', href: '#' },
                { name: 'Time SG', href: '#' },
            ]
        },
        {
            title: "Imprensa",
            links: [
                { name: 'Logo e material de mídia', href: '#' },
                { name: 'Release', href: '#' },
            ]
        },
        {
            title: "Outros",
            links: [
                { name: 'Trabalhe conosco', href: '#' },
                { name: 'Seja um corretor na Souza Gomes', href: '#' },
                { name: 'Acessibilidade (Hand Talk)', href: '#' },
                { name: 'Política de privacidade', href: '#' },
                { name: 'Portal do Titular', href: '#' },
            ]
        },
        {
            title: "Serviços ao cliente",
            links: [
                // Sem links visíveis na imagem, mas manter a seção para futuras adições
            ]
        }
    ];

    return (
        <>
            {/* 1. Overlay Escurecido (z-40) */}
            <div
                className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${isOpen ? 'bg-opacity-75 pointer-events-auto' : 'bg-opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
                aria-hidden={!isOpen}
            ></div>

            {/* 2. Drawer Principal com LARGURA e TRANSITION */}
            <div
                className={`fixed top-0 right-0 h-full w-full md:w-3/5 lg:w-[520px] bg-white shadow-2xl z-50 transition-transform duration-500 ease-in-out transform
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
                role="dialog"
                aria-modal="true"
                aria-hidden={!isOpen}
                aria-labelledby="menu-title"
            >
                <div className="p-6 h-full flex flex-col">

                    {/* Cabeçalho */}
                    <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                        <LogoSG />
                        {/* Botão de Fechar */}
                        <button
                            onClick={onClose}
                            className={`p-2 rounded-full hover:bg-gray-100 text-gray-700 transition-colors`}
                            aria-label="Fechar menu"
                        >
                            {/* Ícone 'X' (FiX) */}
                            <FiX className={`w-6 h-6 text-gray-600 hover:text-accent`} />
                        </button>
                    </div>

                    {/* CORPO DO MENU com Scroll */}
                    <div className="mt-6 space-y-8 overflow-y-auto flex-grow pb-6">

                        {menuContent.map((section) => (
                            <section key={section.title} className="space-y-3">
                                {/* Título da Seção (usando a cor accent) */}
                                <h3 className={`text-lg font-bold ${accentColor}`}>
                                    {section.title}
                                </h3>

                                {/* Lista de Links */}
                                <nav className="flex flex-col space-y-2">
                                    {section.links.map((link) => (
                                        <a
                                            key={link.name}
                                            href={link.href}
                                            onClick={onClose} // Fecha ao clicar no link
                                            className="text-base text-gray-700 font-medium py-1 hover:text-accent/90 transition-colors"
                                        >
                                            {link.name}
                                        </a>
                                    ))}
                                </nav>
                            </section>
                        ))}

                        {/* O rodapé do menu (Serviços ao cliente) foi incluído como a última seção do conteúdo */}

                    </div>

                    {/* Rodapé (se precisar de algo fixo abaixo do scroll) */}
                    {/* <div className="pt-4 border-t border-gray-100">
            ...
          </div> */}

                </div>
            </div>
        </>
    );
};

export default MenuDrawer; 