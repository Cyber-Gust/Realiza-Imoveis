// components/Header/SearchDrawer.jsx
'use client'

import React from 'react';
// Importação de ícones comuns (FiX para fechar, FiSearch para filtrar)
import { FiX, FiSearch } from 'react-icons/fi';

// Dados de mock (simulando a contagem nos selects)
const tipoImoveis = [
  { name: 'Apartamento', count: 53 },
  // Os dados reais viriam de uma API, mantemos o mock para o placeholder
];

/**
 * Componente de Modal/Drawer de Busca de Imóveis
 * Desliza da direita para a esquerda e vice-versa.
 */
const SearchDrawer = ({ isOpen, onClose, accentColor = 'bg-accent' }) => {

  return (
    <>
      {/* 1. Overlay Escurecido (bg-opacity-75, z-40) */}
      <div
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${
          isOpen ? 'bg-opacity-75 pointer-events-auto' : 'bg-opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden={!isOpen}
      ></div>

      {/* 2. Drawer Principal com LARGURA CORRIGIDA (lg:w-[520px]) e TRANSITION */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-3/5 lg:w-[520px] bg-white shadow-2xl z-50 transition-transform duration-500 ease-in-out transform
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
        aria-labelledby="drawer-title"
      >
        <div className="p-6 h-full flex flex-col">

          {/* Cabeçalho */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <h2 id="drawer-title" className="text-2xl font-semibold text-gray-800">
              Buscar imóveis
            </h2>
            {/* Botão de Fechar */}
            <button
              onClick={onClose}
              className={`p-2 rounded-full hover:bg-gray-100 text-gray-700 transition-colors`}
              aria-label="Fechar busca"
            >
              <FiX className={`w-6 h-6 text-gray-600 hover:text-accent`} />
            </button>
          </div>

          {/* CORPO DO FORMULÁRIO (RESTABELECIDO CONFORME A IMAGEM) */}
          <div className="mt-6 space-y-6 overflow-y-auto flex-grow pb-6">
            
            {/* 1. Códigos */}
            <section>
              <label htmlFor="search-codes" className="block text-sm font-medium text-gray-700 mb-2">
                Códigos
              </label>
              <input
                id="search-codes"
                type="text"
                placeholder="1000, 2000, ..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent"
              />
              <p className="flex items-center text-xs text-green-600 mt-2">
                {/* Ícone de informação verde */}
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Ao buscar por códigos os outros campos serão ignorados.
              </p>
            </section>

            <div className="flex items-center justify-center my-4">
              <span className="text-gray-400">ou</span>
            </div>

            {/* 2. Negociação */}
            <section>
              <h3 className="block text-sm font-medium text-gray-700 mb-2">Negociação</h3>
              <div className="flex space-x-3">
                <button className="flex-1 py-3 text-gray-700 font-semibold border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                  COMPRAR
                </button>
                {/* Botão principal de ALUGAR com a cor accent e ícone de check */}
                <button className={`flex-1 py-3 text-white font-semibold ${accentColor} rounded-lg flex items-center justify-center transition-colors hover:bg-accent/90`}>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  ALUGAR
                </button>
              </div>
            </section>

            {/* 3. Tipos de Imóveis (Select com contador e ícone) */}
            <section>
              <h3 className="block text-sm font-medium text-gray-700 mb-2">Tipos de Imóveis</h3>
              <div className="relative">
                {/* Mantendo o visual do Select com texto e contador "Selecionados 15" */}
                <select
                  className="appearance-none w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-accent focus:border-accent pr-10 font-semibold"
                  defaultValue="Selecionados 15"
                >
                  <option disabled>Selecionados 15</option>
                  {/* Opções de mock, ajuste conforme sua necessidade real */}
                  {tipoImoveis.map(tipo => (
                    <option key={tipo.name} value={tipo.name}>{tipo.name} ({tipo.count})</option>
                  ))}
                </select>
                {/* Ícone de seta para baixo */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </section>

            {/* 4. Localização (Select com contador e ícone) */}
            <section>
              <h3 className="block text-sm font-medium text-gray-700 mb-2">Localização (rua, bairro, condomínio...)</h3>
              <div className="relative">
                {/* Mantendo o visual do Select com texto e contador "Selecionados 1" */}
                <select
                  className="appearance-none w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-accent focus:border-accent pr-10 font-semibold"
                  defaultValue="Selecionados 1"
                >
                  <option disabled>Selecionados 1</option>
                  <option>Juiz de Fora (1)</option>
                  {/* Outras opções de localização */}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </section>

            {/* 5. Faixa de preço (Do/Até) */}
            <section>
              <h3 className="block text-sm font-medium text-gray-700 mb-2">Faixa de preço</h3>
              <div className="flex space-x-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="R$ de..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent"
                  />
                  {/* O texto "R$" na imagem parece ser um placeholder ou um estilo de texto simples */}
                </div>
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="R$ até..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent"
                  />
                </div>
              </div>
            </section>

            {/* 6. Suítes (Botões de seleção) */}
            <section>
              <h3 className="block text-sm font-medium text-gray-700 mb-2">Suítes</h3>
              <div className="flex space-x-2">
                {['1', '2', '3', '4', '5+'].map((num) => (
                  <button
                    key={num}
                    // Exemplo de botão ativo para 2 suítes (conforme imagem)
                    className={`flex-1 py-3 text-gray-700 font-semibold border border-gray-300 rounded-lg transition-colors 
                      ${num === '2' ? `bg-accent text-white border-accent hover:bg-accent/90` : 'hover:bg-gray-100'}`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </section>

          </div>
          
          {/* Rodapé (Limpar e Filtrar) */}
          <div className="pt-4 border-t border-gray-100 flex justify-between space-x-3">
            {/* Botão Limpar Filtros com ícone de balde/limpeza */}
            <button 
                onClick={onClose} // Simula o fechamento após a ação
                className="flex items-center text-gray-600 font-medium py-3 px-4 rounded-lg hover:text-red-500 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              Limpar filtros
            </button>
            {/* Botão Filtrar principal com a cor accent e ícone de lupa */}
            <button 
                onClick={onClose} // Simula o fechamento após a ação
                className={`flex items-center text-white font-semibold py-3 px-6 rounded-lg ${accentColor} transition-colors hover:bg-accent/90 shadow-md`}
            >
              <FiSearch className="w-5 h-5 mr-2" />
              Filtrar
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default SearchDrawer;