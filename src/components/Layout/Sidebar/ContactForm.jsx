// components/Layout/Sidebar/ContactForm.jsx
'use client';

import React from 'react';
import { FaWhatsapp, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';

const ContactForm = ({ accentColor = 'bg-accent' }) => {
    
    return (
        <div className={`${accentColor} p-6 rounded-lg text-white shadow-xl`}>
            
            <h3 className="text-xl font-bold mb-4">
                É só preencher seus dados para falar com a gente!
            </h3>

            {/* Formulário */}
            <form className="space-y-4">
                <input 
                    type="text" 
                    placeholder="Nome..." 
                    className="w-full p-3 rounded-lg text-gray-800 placeholder-gray-500 focus:ring-white focus:border-white border-none"
                />
                <input 
                    type="email" 
                    placeholder="E-mail..." 
                    className="w-full p-3 rounded-lg text-gray-800 placeholder-gray-500 focus:ring-white focus:border-white border-none"
                />
                <input 
                    type="tel" 
                    placeholder="Telefone / Whatsapp..." 
                    className="w-full p-3 rounded-lg text-gray-800 placeholder-gray-500 focus:ring-white focus:border-white border-none"
                />
                
                <textarea
                    rows="4"
                    placeholder="Digite aqui se deseja alguma informação específica ou deixe em branco se quiser apenas o contato de um corretor."
                    className="w-full p-3 rounded-lg text-gray-800 placeholder-gray-500 focus:ring-white focus:border-white border-none resize-none"
                ></textarea>
            </form>
            
            {/* Resposta por (Radios) */}
            <div className="mt-6 pt-4 border-t border-white/50">
                <p className="font-semibold mb-3">Quer resposta por:</p>
                <div className="flex space-x-4">
                    <label className="flex items-center text-sm">
                        <input type="radio" name="resposta" value="whatsapp" defaultChecked className="text-white bg-transparent border-white mr-2 focus:ring-white" />
                        <FaWhatsapp className="w-4 h-4 mr-1" /> WhatsApp
                    </label>
                    <label className="flex items-center text-sm">
                        <input type="radio" name="resposta" value="ligacao" className="text-white bg-transparent border-white mr-2 focus:ring-white" />
                        <FaPhoneAlt className="w-4 h-4 mr-1" /> Ligação
                    </label>
                    <label className="flex items-center text-sm">
                        <input type="radio" name="resposta" value="email" className="text-white bg-transparent border-white mr-2 focus:ring-white" />
                        <FaEnvelope className="w-4 h-4 mr-1" /> E-mail
                    </label>
                </div>
            </div>
            
            {/* Botão de Envio */}
            <button className="w-full bg-white text-accent font-bold py-3 mt-6 rounded-lg shadow-md hover:bg-gray-100 transition-colors">
                Fale com um humano
            </button>
            
        </div>
    );
};

export default ContactForm;