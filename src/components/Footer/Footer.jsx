'use client'

import React from 'react';
import { FiArrowUp, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { FaWhatsapp, FaInstagram, FaYoutube } from 'react-icons/fa';
import { HiOutlineDocumentText, HiOutlineUserCircle } from 'react-icons/hi';

const footerSections = [
  {
    title: 'Conteúdo',
    links: ['Carta dos donos', 'Guia dos bairros', 'SGPLay', 'Blog do Beta', 'Co-branding', 'Time SG'],
  },
  {
    title: 'Serviços ao cliente',
    links: ['Área do proprietário de imóvel alugado', 'Área do inquilino de imóvel alugado', 'Biblioteca aberta ao público', 'Links úteis'],
  },
  {
    title: 'Negócios',
    links: ['Como fazer uma proposta para imóvel de locação'],
  },
  {
    title: 'Imprensa',
    links: ['Logo e material de mídia', 'Release'],
  },
  {
    title: 'Central de ajuda',
    links: ['Quero alugar um imóvel', 'Já sou inquilino', 'Deixar meu imóvel para venda ou locação', 'Fale conosco'],
  },
  {
    title: 'Outros',
    links: ['Trabalhe conosco', 'Seja um corretor na Souza Gomes', 'Acessibilidade (Hand Talk)', 'Política de privacidade', 'Portal do Titular'],
  },
];

const LinkGroup = ({ title, links }) => (
  <div className="mb-8 md:mb-0">
    <h4 className="text-lg font-semibold text-accent mb-3">{title}</h4>
    <ul className="space-y-2">
      {links.map((link, index) => (
        <li key={index}>
          <a href="#" className="text-gray-700 text-sm hover:text-accent transition-colors">
            {link}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const AccessButton = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-center p-4 bg-gray-200 bg-opacity-60 rounded-lg cursor-pointer hover:bg-gray-300 transition-colors">
    <Icon className="w-6 h-6 text-accent mr-3" />
    <div>
      <p className="text-sm font-medium text-gray-800">{title}</p>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  </div>
);

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-100 relative overflow-hidden pt-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between relative">
          <div className="hidden lg:block absolute right-0 top-0 h-full w-2/5 max-w-lg z-10">
            <img
              src="https://via.placeholder.com/400x600/D1D5DB/4B5563?text=PERSONAGEM+3D"
              alt="Corretora Virtual"
              className="absolute bottom-0 right-0 h-[600px] object-contain"
            />
          </div>

          <div className="w-full lg:w-3/5 pr-0 lg:pr-10 z-20">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 leading-none">
                <span className="text-accent text-5xl font-extrabold">G</span> SOUZA GOMES
              </h1>
              <p className="italic text-gray-500 text-sm mt-1">nem parece imobiliária</p>
            </div>

            <div className="flex space-x-4 mb-8 text-accent">
              <FaWhatsapp className="w-6 h-6 cursor-pointer hover:text-accent transition-colors" />
              <FaInstagram className="w-6 h-6 cursor-pointer hover:text-accent transition-colors" />
              <FaYoutube className="w-6 h-6 cursor-pointer hover:text-accent transition-colors" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
              <img src="https://via.placeholder.com/100x80?text=SELO+1" alt="Selo 1" className="w-full h-auto" />
              <img src="https://via.placeholder.com/100x80?text=SELO+2" alt="Selo 2" className="w-full h-auto" />
              <img src="https://via.placeholder.com/100x80?text=SELO+3" alt="Selo 3" className="w-full h-auto" />
              <img src="https://via.placeholder.com/100x80?text=SELO+4" alt="Selo 4" className="w-full h-auto" />
            </div>

            <div className="mb-10 space-y-3">
              <div className="flex items-center text-gray-700">
                <FiPhone className="w-5 h-5 text-accent mr-3" />
                <div>
                  <p className="font-semibold">(32) 3512-3999</p>
                  <p className="text-sm">(32) 99900-1686</p>
                  <p className="text-xs text-gray-500">atendimento e reparos online</p>
                </div>
              </div>

              <div className="flex items-center text-gray-700">
                <FiMail className="w-5 h-5 text-accent mr-3" />
                <p className="text-sm">contato@souzagomes.com.br</p>
              </div>

              <div className="flex items-start text-gray-700 pt-2">
                <FiMapPin className="w-5 h-5 text-accent mr-3 mt-1 flex-shrink-0" />
                <p className="text-sm">
                  Av. Presidente Itamar Franco, 2800<br />
                  São Mateus, Juiz de Fora, MG
                </p>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-2/5 flex flex-wrap z-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 w-full">
              {footerSections.map((section) => (
                <LinkGroup key={section.title} title={section.title} links={section.links} />
              ))}
            </div>

            <div className="mt-8 md:mt-12 w-full space-y-4">
              <AccessButton
                icon={HiOutlineUserCircle}
                title="Área do Proprietário"
                subtitle="Extratos e repasses online"
              />
              <AccessButton
                icon={HiOutlineDocumentText}
                title="Área do Inquilino"
                subtitle="2ª via de boletos online"
              />
            </div>
          </div>
        </div>

        <div className="fixed bottom-6 right-6 z-40 space-y-3">
          <a href="https://wa.me/seunumerodowhatsapp" target="_blank" rel="noopener noreferrer" className="block">
            <FaWhatsapp className="w-12 h-12 p-2 bg-accent text-white rounded-full shadow-lg hover:bg-accent transition-colors cursor-pointer" />
          </a>

          <div
            onClick={scrollToTop}
            className="w-12 h-12 p-2 bg-gray-900 text-white rounded-full shadow-lg hover:bg-black transition-colors cursor-pointer flex items-center justify-center"
          >
            <FiArrowUp className="w-6 h-6" />
          </div>
        </div>

        <div className="text-center py-4 mt-8 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Souza Gomes. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
