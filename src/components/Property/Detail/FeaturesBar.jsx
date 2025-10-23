// components/Property/Detail/FeaturesBar.jsx
'use client';

import React from 'react';
// Ícones baseados nas imagens: Cama, Banheiro, Carro, Metragem, Elevador
import { FaBed, FaShower, FaCar, FaRulerCombined } from 'react-icons/fa';
import { GiElevator } from 'react-icons/gi';

// Mapeamento dos ícones (reutilizado)
const iconMap = {
    quartos: { icon: FaBed, label: 'Quartos' },
    suites: { icon: FaShower, label: 'Suítes' },
    banheiros: { icon: FaShower, label: 'Banheiros' },
    vagas: { icon: FaCar, label: 'Vagas' },
    areaM2: { icon: FaRulerCombined, label: 'm²' },
    elevador: { icon: GiElevator, label: 'Elevador' },
};

const FeatureItem = ({ icon: Icon, value, label }) => {
    // Esconde itens com valor 0, exceto elevador para mostrar ícone
    if (value === 0 && label !== 'Elevador') return null;

    let displayValue = value;
    if (label === 'm²') displayValue = `${value} m²`;
    
    // Tratativa para elevador: Sim/Não
    if (label === 'Elevador') displayValue = value > 0 ? 'Sim' : 'Não';
    
    // Se for Elevador e o valor for 0 (Não), usamos um estilo cinza
    const itemClasses = value > 0 || label === 'Elevador' ? 'text-gray-800' : 'text-gray-400';

    return (
        <div className="flex flex-col items-center text-center px-4 py-2">
            <Icon className={`w-6 h-6 text-accent mb-1 ${itemClasses}`} />
            <span className={`text-sm font-semibold ${itemClasses}`}>
                {displayValue} {label !== 'Elevador' ? label : ''}
            </span>
        </div>
    );
};


const FeaturesBar = ({ caracteristicas, accentColor = 'text-accent' }) => {
    
    const featuresKeys = ['quartos', 'suites', 'banheiros', 'vagas', 'areaM2', 'elevador'];

    return (
        <div className="bg-gray-100 p-4 rounded-lg flex justify-around shadow-sm">
            {featuresKeys.map(key => {
                const map = iconMap[key];
                const value = caracteristicas[key];
                
                return (
                    <FeatureItem 
                        key={key}
                        icon={map.icon}
                        value={value}
                        label={map.label}
                    />
                );
            })}
        </div>
    );
};

export default FeaturesBar;