import React from 'react';
import { CATEGORIES } from '../../data/constants';
import CloseIcon from '../icons/CloseIcon';

interface CategorySelectionModalProps {
    onClose: () => void;
    onSelectCategory: (category: string) => void;
    currentCategory: string;
}

const CategorySelectionModal: React.FC<CategorySelectionModalProps> = ({ onClose, onSelectCategory, currentCategory }) => {
    return (
        <div className="absolute inset-0 flex items-end z-30" onClick={onClose}>
            <div 
                className="bg-[#2a2a2a] w-full rounded-t-2xl p-4 text-white"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">Selecionar Categoria</h2>
                    <button onClick={onClose}>
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                <ul className="space-y-2 max-h-[50vh] overflow-y-auto no-scrollbar">
                    {CATEGORIES.map(category => (
                        <li key={category}>
                            <button 
                                onClick={() => onSelectCategory(category)}
                                className={`w-full text-left p-3 rounded-lg text-base font-semibold transition-colors ${
                                    currentCategory === category ? 'bg-purple-600 text-white' : 'hover:bg-[#3a3a3a]'
                                }`}
                            >
                                {category}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CategorySelectionModal;