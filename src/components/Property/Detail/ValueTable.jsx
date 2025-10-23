// components/Property/Detail/ValueTable.jsx
'use client';

import React from 'react';

const formatCurrency = (value) => {
    if (!value) return '-';
    // Simples formatação de string
    return `R$ ${value.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
};

const ValueRow = ({ label, value, isMonthly = false, accentColor = 'bg-gray-100' }) => (
    <div className={`flex justify-between items-center py-3 px-4 ${accentColor}`}>
        <span className="text-sm text-gray-700">{label}</span>
        <span className="text-base font-semibold text-gray-800">{formatCurrency(value)}</span>
    </div>
);

const ValueTable = ({ valores }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-3">
                Valores e taxas
            </h3>

            {/* Valor para Compra / Aluguel */}
            <div className="space-y-1">
                <h4 className="text-sm font-bold text-gray-600 mb-2">Valor para {valores.valorCompra ? 'Compra' : 'Locação'}</h4>
                <ValueRow 
                    label={valores.valorCompra ? 'Valor para compra' : 'Valor para aluguel'}
                    value={valores.valorCompra || valores.valorLocacao}
                    accentColor="bg-gray-50"
                />
            </div>
            
            {/* Valores Mensais */}
            <div className="space-y-1">
                <h4 className="text-sm font-bold text-gray-600 mb-2">Valores mensais</h4>
                <ValueRow 
                    label="Condomínio"
                    value={valores.condominioMensal}
                    accentColor="bg-gray-50"
                />
            </div>

            {/* Valores Anuais */}
            <div className="space-y-1">
                <h4 className="text-sm font-bold text-gray-600 mb-2">Valores anuais</h4>
                <ValueRow 
                    label="IPTU"
                    value={valores.iptuAnual}
                    accentColor="bg-gray-50"
                />
            </div>
            
            <p className="text-xs text-gray-500 pt-2 border-t border-gray-100 italic">
                * Valores sujeitos a alteração sem aviso prévio.
            </p>
        </div>
    );
};

export default ValueTable;