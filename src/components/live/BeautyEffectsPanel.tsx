
import React, { useState } from 'react';
import CloseIcon from '../CloseIcon';

const NoSymbolIcon: React.FC<{ active?: boolean }> = ({ active }) => (
    <div className={`w-full h-full flex items-center justify-center bg-[#2d2d2d] rounded-lg`}>
        <svg className={`w-8 h-8 ${active ? 'text-purple-400' : 'text-gray-200'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="9" />
            <line x1="17" y1="7" x2="7" y2="17" />
        </svg>
    </div>
);

const BeautyOptionIcon: React.FC<{ path: string; active?: boolean }> = ({ path, active }) => (
    <svg className={`w-8 h-8 ${active ? 'text-purple-400' : 'text-gray-200'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);

const EffectOption: React.FC<{ 
    children: React.ReactNode; 
    label: string; 
    active?: boolean; 
    onClick: () => void; 
}> = ({ children, label, active, onClick }) => (
    <button onClick={onClick} className="flex flex-col items-center space-y-2 text-xs w-16">
        <div className={`w-14 h-14 rounded-lg flex items-center justify-center transition-all overflow-hidden ${active ? 'border-2 border-purple-500' : 'border-2 border-transparent'}`}>
            {children}
        </div>
        <span className={`transition-colors ${active ? 'text-purple-400 font-semibold' : 'text-gray-300'}`}>{label}</span>
    </button>
);

const ResetIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348A7.962 7.962 0 0121.5 12c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.982 4.5l-3.32 3.32" />
  </svg>
);


interface BeautyEffectsPanelProps {
    onClose: () => void;
}

const BeautyEffectsPanel: React.FC<BeautyEffectsPanelProps> = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState('recomendar');
    const [activeRecommendEffect, setActiveRecommendEffect] = useState('fechar');
    const [activeBeautyEffect, setActiveBeautyEffect] = useState('branquear');
    const [sliderValue, setSliderValue] = useState(20);
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    const showToast = () => {
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 2000);
    }

    const handleRecommendEffectChange = (effectId: string) => {
        setActiveRecommendEffect(effectId);
        showToast();
    };

    const handleBeautyEffectChange = (effectId: string) => {
        setActiveBeautyEffect(effectId);
        if (effectId !== 'fechar') {
            setSliderValue(Math.floor(Math.random() * 80) + 10);
        }
        showToast();
    };

    const recommendEffects = [
        { id: 'fechar', label: 'Fechar', icon: <NoSymbolIcon active={activeRecommendEffect === 'fechar'} /> },
        { id: 'musa', label: 'Musa', icon: <img src="https://i.pravatar.cc/150?img=35" alt="Musa" className="w-full h-full object-cover"/> },
        { id: 'bonito', label: 'Bonito', icon: <img src="https://i.pravatar.cc/150?img=60" alt="Bonito" className="w-full h-full object-cover"/> },
        { id: 'vitalidade', label: 'Vitalidade', icon: <img src="https://i.pravatar.cc/150?img=40" alt="Vitalidade" className="w-full h-full object-cover"/> },
    ];
    
    const beautyEffects = [
        { id: 'fechar', label: 'Fechar', path: "M12 2a10 10 0 100 20 10 10 0 000-20zM4.93 4.93l14.14 14.14" },
        { id: 'branquear', label: 'Branquear', path: "M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zM8 14c.67 1.33 2.33 2 4 2s3.33-.67 4-2H8zm1-4a1 1 0 10-2 0 1 1 0 002 0zm6 0a1 1 0 10-2 0 1 1 0 002 0z" },
        { id: 'alisar', label: 'Alisar a p...', path: "M3 6s2-3 6-3 6 3 6 3 M3 12s2-3 6-3 6 3 6 3 M3 18s2-3 6-3 6 3 6 3" },
        { id: 'ruborizar', label: 'Ruborizar', path: "M12 22a10 10 0 110-20 10 10 0 010 20z M8.5 13a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm7 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z M9 9.5a.5.5 0 11-1 0 .5.5 0 011 0zm7 0a.5.5 0 11-1 0 .5.5 0 011 0z" },
        { id: 'contraste', label: 'Contraste', path: "M12 22a10 10 0 110-20 10 10 0 0110 10zM12 2a10 10 0 000 20V2z" },
    ];

    const TabButton: React.FC<{ label: string; name: string; }> = ({label, name}) => (
        <button onClick={() => setActiveTab(name)} className="relative py-2">
            <span className={`text-base font-semibold ${activeTab === name ? 'text-white' : 'text-gray-500'}`}>{label}</span>
            {activeTab === name && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-purple-500 rounded-full"></div>}
        </button>
    );
    
    return (
        <div className="absolute bottom-0 left-0 right-0 bg-[#1a1a1a]/95 backdrop-blur-md rounded-t-2xl z-20 text-white" onClick={e => e.stopPropagation()}>
            <div className="relative p-4">
                {showSuccessToast && (
                    <div className="absolute top-[-50px] left-1/2 -translate-x-1/2 bg-[#2a2a2a] text-white text-sm py-2 px-4 rounded-full shadow-lg">
                        Operação bem sucedida
                    </div>
                )}
                
                {activeTab === 'beleza' && activeBeautyEffect !== 'fechar' && (
                    <div className="flex items-center space-x-4 mb-2">
                        <span className="font-semibold text-lg w-8">{sliderValue}</span>
                        <div className="relative flex-grow h-8 flex items-center">
                             <input
                                type="range"
                                min="0"
                                max="100"
                                value={sliderValue}
                                onChange={(e) => setSliderValue(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                            />
                        </div>
                    </div>
                )}
            </div>
            
            <div className="flex justify-between items-center px-4 pb-3 border-b border-gray-800">
                <div className="flex space-x-5">
                    <TabButton label="Recomendar" name="recomendar" />
                    <TabButton label="Beleza" name="beleza" />
                </div>
                <div className="flex items-center space-x-4">
                    <button className="text-sm font-semibold text-gray-300 flex items-center space-x-1">
                        <ResetIcon className="w-5 h-5" />
                        <span>Resetear</span>
                    </button>
                    <button onClick={onClose}>
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>

            <div className="flex justify-around items-center p-4 h-[120px]">
                {activeTab === 'recomendar' && recommendEffects.map(effect => (
                    <EffectOption 
                        key={effect.id}
                        label={effect.label}
                        active={activeRecommendEffect === effect.id}
                        onClick={() => handleRecommendEffectChange(effect.id)}
                    >
                        {effect.icon}
                    </EffectOption>
                ))}
                {activeTab === 'beleza' && beautyEffects.map(effect => (
                    <EffectOption
                        key={effect.id}
                        label={effect.label}
                        active={activeBeautyEffect === effect.id}
                        onClick={() => handleBeautyEffectChange(effect.id)}
                    >
                         <BeautyOptionIcon path={effect.path} active={activeBeautyEffect === effect.id}/>
                    </EffectOption>
                ))}
                {activeTab !== 'recomendar' && activeTab !== 'beleza' && (
                     <p className="text-gray-500">Selecione uma categoria.</p>
                )}
            </div>
        </div>
    );
};

export default BeautyEffectsPanel;
