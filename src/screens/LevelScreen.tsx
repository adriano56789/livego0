
import React, { useId } from 'react';
import ChevronLeftIcon from '../components/ChevronLeftIcon';
import CheckCircleFilledIcon from '../components/CheckCircleFilledIcon';
import LockClosedIcon from '../components/LockClosedIcon';


interface LevelScreenProps {
    setActiveScreen: (screen: string) => void;
}

// Reusable Level Hexagon component inspired by the ChatMessage badge
const LevelHexagon: React.FC<{ level: number; size: 'large' | 'medium'; state: 'current' | 'previous' | 'next' }> = ({ level, size, state }) => {
    const getGradientColors = () => {
        if (level < 10) return ['#a855f7', '#ec4899']; // Purple to Pink
        if (level < 20) return ['#22d3ee', '#3b82f6']; // Cyan to Blue
        if (level < 30) return ['#facc15', '#fb923c']; // Yellow to Orange
        return ['#f5f5f5', '#9ca3af'];
    };

    const [startColor, endColor] = getGradientColors();
    const id = useId();
    const gradientId = `levelHexGrad-${id}`;

    const sizes = {
        large: { svg: "140", path: "M70 0 L139 40 L139 120 L70 160 L1 120 L1 40 Z", text: "4xl" },
        medium: { svg: "100", path: "M50 0 L99 28.75 L99 86.25 L50 115 L1 86.25 L1 28.75 Z", text: "2xl" },
    };
    const currentSize = sizes[size];
    
    const isLocked = state === 'next';

    return (
        <div className={`relative flex items-center justify-center transition-all duration-300 ${state === 'current' ? 'scale-100' : 'scale-90 opacity-60'}`} style={{ width: `${currentSize.svg}px`, height: `${Number(currentSize.svg)*1.15}px` }}>
            <svg width={currentSize.svg} height={Number(currentSize.svg) * 1.15} viewBox={`0 0 ${currentSize.svg} ${Number(currentSize.svg) * 1.15}`} className={`drop-shadow-[0_0_15px_rgba(168,85,247,0.6)] ${isLocked ? 'filter grayscale' : ''}`}>
                <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={startColor} />
                        <stop offset="100%" stopColor={endColor} />
                    </linearGradient>
                </defs>
                <path d={currentSize.path} fill={`url(#${gradientId})`} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`font-bold text-${currentSize.text}`}>{level}</span>
            </div>
        </div>
    );
};

const PrivilegeItem: React.FC<{ text: string, unlocked: boolean }> = ({ text, unlocked }) => (
    <div className={`flex items-center space-x-3 p-3 rounded-lg ${unlocked ? 'bg-purple-900/40' : 'bg-gray-800/50'}`}>
        {unlocked ? <CheckCircleFilledIcon className="w-6 h-6 text-purple-400 flex-shrink-0" /> : <LockClosedIcon className="w-6 h-6 text-gray-500 flex-shrink-0" />}
        <span className={`${unlocked ? 'text-white' : 'text-gray-500'}`}>{text}</span>
    </div>
);


const LevelScreen: React.FC<LevelScreenProps> = ({ setActiveScreen }) => {
    const currentLevel = 6;
    const currentExp = 500;
    const requiredExp = 1000;
    const progressPercentage = (currentExp / requiredExp) * 100;

    return (
        <div className="bg-gradient-to-b from-[#1a0a2e] to-black min-h-screen text-white flex flex-col">
            <header className="p-4 flex items-center flex-shrink-0 z-10">
                <button onClick={() => setActiveScreen('profile')} className="absolute">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="flex-1 text-center text-lg font-semibold">
                    Meu Nível
                </h1>
            </header>
            <main className="flex-grow flex flex-col p-6 overflow-y-auto no-scrollbar">
                {/* Level Progression Display */}
                <div className="flex items-center justify-center space-x-4 my-8">
                    <LevelHexagon level={currentLevel - 1} size="medium" state="previous" />
                    <LevelHexagon level={currentLevel} size="large" state="current" />
                    <LevelHexagon level={currentLevel + 1} size="medium" state="next" />
                </div>
                
                {/* Progress Bar Section */}
                <div className="w-full max-w-sm mx-auto my-8">
                    <div className="flex justify-between items-center mb-2 text-sm font-semibold">
                        <span className="text-gray-400">Nível {currentLevel}</span>
                        <span className="text-gray-400">Nível {currentLevel + 1}</span>
                    </div>
                    <div className="w-full bg-black/30 rounded-full h-2.5">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                    <p className="text-center text-gray-300 mt-2 font-medium">
                        {currentExp.toLocaleString()}/{requiredExp.toLocaleString()} EXP
                    </p>
                </div>

                {/* Privileges Section */}
                <div className="space-y-6 mt-6">
                    <div>
                        <h3 className="text-lg font-bold mb-3">Privilégios Atuais (Nível {currentLevel})</h3>
                        <div className="space-y-2">
                            <PrivilegeItem text="Badge de Nível Exclusivo" unlocked={true} />
                            <PrivilegeItem text="Borda de Comentário Especial" unlocked={true} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-3 text-gray-400">Próximas Recompensas (Nível {currentLevel + 1})</h3>
                        <div className="space-y-2">
                             <PrivilegeItem text="Presente Exclusivo de Nível" unlocked={false} />
                             <PrivilegeItem text="Efeito de Entrada na Sala" unlocked={false} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LevelScreen;
