
import React from 'react';

interface EndStreamConfirmationModalProps {
    onConfirm: () => void;
    onCancel: () => void;
}

const EndStreamConfirmationModal: React.FC<EndStreamConfirmationModalProps> = ({ onConfirm, onCancel }) => {
    return (
        <div className="absolute inset-0 bg-black/70 flex items-end z-20">
            <div className="bg-[#282828] w-full rounded-t-2xl p-6 text-center">
                <h2 className="text-xl font-bold">Encerrar Transmissão?</h2>
                <p className="text-gray-400 mt-2">Tem certeza que deseja encerrar a transmissão? Esta ação não pode ser desfeita.</p>
                <div className="mt-6 flex flex-col space-y-3">
                    <button onClick={onConfirm} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-full transition-colors">
                        Encerrar
                    </button>
                    <button onClick={onCancel} className="w-full bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white font-bold py-3 rounded-full transition-colors">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};
export default EndStreamConfirmationModal;
