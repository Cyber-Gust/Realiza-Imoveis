// components/Header/Header.jsx
'use client'

import React, { useState, useEffect } from 'react';
import { FiSearch, FiHeart, FiMenu, FiX } from 'react-icons/fi';
// Importar os novos Drawers
import SearchDrawer from './SearchDrawer'; 
import MenuDrawer from './MenuDrawer'; // 1. Importar MenuDrawer

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false); 

  // Combinar os estados para travar o scroll quando qualquer drawer estiver aberto
  const isAnyDrawerOpen = isMenuOpen || isSearchDrawerOpen;

  useEffect(() => {
    if (isAnyDrawerOpen) {
      document.body.style.overflow = 'hidden'; 
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isAnyDrawerOpen]); // Roda sempre que qualquer estado de drawer muda

  // Dados mockados para os links do menu (não serão mais usados no dropdown, mas mantidos)
  const navLinks = [
    { name: 'Comprar', href: '/comprar' },
    { name: 'Alugar', href: '/alugar' },
    { name: 'Lançamentos', href: '/lancamentos' },
    { name: 'Financiamento', href: '/financiamento' },
    { name: 'Contato', href: '/contato' },
  ];

  // Componente de Ícone para Mobile/Tablet
  const MobileIcon = ({ icon: Icon, label, badge = 0, onClick }) => (
    <div 
      className="flex flex-col items-center text-xs text-gray-700 cursor-pointer p-2 relative hover:text-accent/90 transition-colors"
      onClick={onClick}
    >
      <div className="relative">
        <Icon className="w-6 h-6 text-accent" />
        {badge > 0 && (
          <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
            {badge}
          </span>
        )}
      </div>
      <span className="hidden sm:block text-[10px] mt-0.5">{label}</span>
      <span className="sm:hidden text-[10px] mt-0.5">{label}</span>
    </div>
  );

  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-50 shadow-md z-30">
      <div className="container mx-auto px-4 py-3 sm:py-4">

        {/* LAYOUT MOBILE */}
        <div className="flex justify-between items-center h-16 md:hidden">
          {/* Logo Mobile */}
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-gray-800 leading-none">
              <span className="text-accent text-3xl font-extrabold">G</span> SOUZA GOMES
            </h1>
          </div>

          {/* Ícones de Ação Mobile */}
          <nav className="flex items-center space-x-4">
            <MobileIcon 
              icon={FiSearch} 
              label="BUSCAR IMÓVEIS" 
              onClick={() => setIsSearchDrawerOpen(true)} 
            />
            <MobileIcon icon={FiHeart} label="FAVORITOS" badge={0} />

            {/* Menu Hambúrguer - AÇÃO ALTERADA PARA ABRIR O MENU DRAWER */}
            <div
              className="flex flex-col items-center text-xs text-gray-700 cursor-pointer p-2 hover:text-accent/90 transition-colors"
              onClick={() => setIsMenuOpen(true)} // 2. Abre o MenuDrawer
            >
              {/* Mostrar sempre o Menu (FiMenu) na navegação, o 'X' fica dentro do Drawer */}
              <FiMenu className="w-6 h-6 text-accent" />
              <span className="text-[10px] mt-0.5">MENU</span>
            </div>
          </nav>
        </div>

        {/* LAYOUT DESKTOP/Tablet */}
        <div className="hidden md:flex justify-between items-center h-24">

          {/* Coluna 1: Logo e Slogan (Omitida para brevidade) */}
          {/* ... */}
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-start leading-none">
              <h1 className="text-2xl font-bold text-gray-800 leading-none">
                <span className="text-accent text-4xl font-extrabold">G</span> SOUZA GOMES
              </h1>
              <p className="text-sm font-light text-gray-600">IMÓVEIS</p>
            </div>
            <div className="flex items-center space-x-2 ml-6">
              <img
                src="https://via.placeholder.com/60"
                alt="Corretora"
                className="w-16 h-16 rounded-full object-cover border-2 border-accent"
              />
              <span className="italic text-gray-500 text-sm">nem parece imobiliária</span>
            </div>
          </div>

          {/* Coluna 2: Busca e Ícones */}
          <div className="flex items-center space-x-6">

            {/* Campo de Busca Grande (Desktop) - Adicionado o onClick */}
            <div 
              className="bg-gray-200 bg-opacity-40 p-3 rounded-xl flex items-center w-96 shadow-inner cursor-pointer hover:bg-gray-200/60 transition-colors"
              onClick={() => setIsSearchDrawerOpen(true)}
            >
              <FiSearch className="w-6 h-6 text-accent mr-3" />
              <div className="flex flex-col">
                <span className="font-semibold text-gray-800 text-sm">Buscar imóveis.</span>
                <span className="text-xs text-gray-500">Encontre seu imóvel em Juiz de Fora, MG</span>
              </div>
            </div>

            {/* Favoritos e Menu (Ícones maiores para Desktop) */}
            <div className="flex items-center space-x-6">
              <MobileIcon icon={FiHeart} label="FAVORITOS" badge={0} />

              {/* Menu Hambúrguer (Desktop) - AÇÃO ALTERADA PARA ABRIR O MENU DRAWER */}
              <div
                className="flex flex-col items-center text-sm text-gray-700 cursor-pointer p-2 hover:text-accent/90 transition-colors"
                onClick={() => setIsMenuOpen(true)} // 3. Abre o MenuDrawer
              >
                <FiMenu className="w-8 h-8 text-accent" />
                <span className="text-xs mt-0.5">MENU</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* REMOVEMOS O MENU DROPDOWN MOBILE AQUI */}

      {/* 4. Renderização dos Drawers */}
      <SearchDrawer 
        isOpen={isSearchDrawerOpen} 
        onClose={() => setIsSearchDrawerOpen(false)} 
        accentColor="bg-accent" 
      />

      <MenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        accentColor="text-accent"
      />
    </header>
  );
};

export default Header;