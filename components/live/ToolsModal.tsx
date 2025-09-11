import React from 'react';
import CloseIcon from '../icons/CloseIcon';
import CoHostIcon from '../icons/CoHostIcon';
import PKLiveIcon from '../icons/PKLiveIcon';
import AddUserIcon from '../icons/AddUserIcon';
import SparklesIcon from '../icons/SparklesIcon';
import SoundWaveIcon from '../icons/SoundWaveIcon';
import MicrophoneIcon from '../icons/MicrophoneIcon';
import SunIcon from '../icons/SunIcon';
import ChatBubbleMinusIcon from '../icons/ChatBubbleMinusIcon';

interface ToolsModalProps {
    onClose: () => void;
    onOpenCoHost: () => void;
    onOpenBeautyPanel: () => void;
    onOpenClarityPanel: () => void;
}

const ToolButton: React.FC<{ label: string; icon: React.ReactNode; active?: boolean; highlighted?: boolean; onClick?: () => void; }> = ({ label, icon, active, highlighted, onClick }) => (
    <div className="relative flex flex-col items-center space-y-1.5 flex-1">
        <button onClick={onClick} className={`w-14 h-14 rounded-full flex items-center justify-center ${highlighted ? 'bg-green-500' : 'bg-[#4a4a4a]'}`}>
            {icon}
        </button>
        <span className="text-[10px] text-gray-300 text-center h-6">{label}</span>
        {active && <div className="absolute top-0 right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-black"></div>}
    </div>
);

const ToolsModal: React.FC<ToolsModalProps> = ({ onClose, onOpenCoHost, onOpenBeautyPanel, onOpenClarityPanel }) => {
    return (
        <div className="absolute inset-x-0 bottom-0 bg-[#282828] rounded-t-2xl flex flex-col p-4 z-10">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Ferramentas</h2>
                <button onClick={onClose}><CloseIcon className="w-6 h-6" /></button>
            </div>
            
            <div className="space-y-6">
                <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-4">Ferramentas de Co-host e PK</h3>
                    <div className="grid grid-cols-4 gap-4">
                        <ToolButton label="+ Anfitriões" icon={<CoHostIcon className="w-8 h-8 text-white"/>} onClick={onOpenCoHost} />
                        <ToolButton label="Batalha" icon={<PKLiveIcon className="w-8 h-8 text-white"/>} />
                        <ToolButton label="+Conv" icon={<AddUserIcon className="w-8 h-8 text-white"/>} active />
                    </div>
                </div>
                 <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-4">Ferramentas de âncora</h3>
                    <div className="flex justify-around items-start space-x-2">
                        <ToolButton label="Embelezar" icon={<SparklesIcon className="w-7 h-7 text-white"/>} active onClick={onOpenBeautyPanel} />
                        <ToolButton label="Efeito sonoro" icon={<SoundWaveIcon className="w-7 h-7 text-white"/>} />
                        <ToolButton label="Microfone" icon={<MicrophoneIcon className="w-7 h-7 text-black"/>} highlighted />
                        <ToolButton label="Clareza" icon={<SunIcon className="w-7 h-7 text-white"/>} onClick={onOpenClarityPanel} />
                        <ToolButton label="" icon={<ChatBubbleMinusIcon className="w-7 h-7 text-white"/>} active />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ToolsModal;