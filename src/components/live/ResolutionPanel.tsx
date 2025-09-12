
import React from 'react';
import CloseIcon from '../CloseIcon';
import CheckIcon from '../CheckIcon';

interface ResolutionPanelProps {
    onClose: () => void;
    onSelectResolution: (resolution: string) => void;
    currentResolution: string;
}

const resolutions = [
    { key: '720p', label: '720p', description: 'HD' },
    { key: '480p', label: '480p', description: 'Padrão' },
    { key: '360p', label: '360p', description: 'Fluente' },
];

const ResolutionPanel: React.FC<ResolutionPanelProps> = ({ onClose, onSelectResolution, currentResolution }) => {
    return (
        <div className="absolute inset-0 flex items-end z-40" onClick={onClose}>
            <div 
                className="bg-[#2a2a2a] w-full rounded-t-2xl p-4 text-white"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">Qualidade do Vídeo</h2>
                    <button onClick={onClose}>
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                <p className="text-sm text-gray-400 mb-4">Ajustar a qualidade pode afetar o uso de dados e a fluidez da transmissão.</p>
                <ul className="space-y-2">
                    {resolutions.map(res => (
                        <li key={res.key}>
                            <button 
                                onClick={() => onSelectResolution(res.key)}
                                className={`w-full text-left p-3 rounded-lg text-base font-semibold transition-colors flex justify-between items-center ${
                                    currentResolution === res.key ? 'bg-purple-600 text-white' : 'hover:bg-[#3a3a3a]'
                                }`}
                            >
                                <span>{res.label} <span className="text-gray-300 font-normal">({res.description})</span></span>
                                {currentResolution === res.key && <CheckIcon className="w-5 h-5" />}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ResolutionPanel;
