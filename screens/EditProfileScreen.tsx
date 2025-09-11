
import React from 'react';
import ChevronLeftIcon from '../components/icons/ChevronLeftIcon';
import ChevronRightIcon from '../components/icons/ChevronRightIcon';

interface EditProfileScreenProps {
    setActiveScreen: (screen: string) => void;
}

const InfoRow: React.FC<{ label: string; value: string; onClick?: () => void }> = ({ label, value, onClick }) => (
    <button onClick={onClick} className="w-full flex justify-between items-center py-4 border-b border-gray-800 hover:bg-[#1f1f1f] transition-colors text-left">
        <span className="text-gray-400">{label}</span>
        <div className="flex items-center space-x-2">
            <span className="text-white font-semibold">{value}</span>
            <ChevronRightIcon className="w-5 h-5 text-gray-600" />
        </div>
    </button>
);

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ setActiveScreen }) => {
    return (
        <div className="bg-black min-h-screen text-white">
            <header className="p-4 flex items-center justify-between border-b border-gray-800">
                <button onClick={() => setActiveScreen('broadcasterProfile')} aria-label="Back to profile">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-lg font-semibold">
                    Editar o perfil
                </h1>
                <button className="font-semibold text-purple-400">Salvar</button>
            </header>
            <main className="p-4 space-y-6">
                <div className="bg-blue-900 bg-opacity-30 text-blue-300 p-3 rounded-lg text-sm relative">
                    Faça upload de fotos reais e nítidas, deixe o destino começar no avatar da beleza
                    <button className="absolute top-3 right-3 text-blue-300 opacity-70">&times;</button>
                </div>
                
                <div className="grid grid-cols-4 gap-3">
                    <button className="relative aspect-square" onClick={() => { /* Handle view/delete image */ }}>
                        <img src="https://picsum.photos/seed/profile/100/100" alt="Retrato" className="w-full h-full object-cover rounded-lg" />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-center py-0.5 text-xs rounded-b-lg text-purple-400 font-bold">Retrato</div>
                    </button>
                    <button className="aspect-square bg-[#1e1e1e] rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600 hover:bg-[#2a2a2a] transition-colors" onClick={() => { /* Handle add image */ }}>
                        <span className="text-3xl text-gray-600">+</span>
                    </button>
                </div>
                <p className="text-xs text-gray-500">1/8 Clique para ver e apagar imagens, segure para ordenar</p>

                <div>
                    <InfoRow label="Apelido" value="Seu Perfil" onClick={() => { /* Handle edit nickname */ }} />
                    <InfoRow label="Gênero" value="Não especificado" onClick={() => { /* Handle edit gender */ }} />
                    <InfoRow label="Aniversário" value="01/01/2002" onClick={() => { /* Handle edit birthday */ }} />
                    <InfoRow label="Apresentar-se" value="Apenas boas vibrações!" onClick={() => { /* Handle edit bio */ }} />
                    <InfoRow label="Residência atual" value="Não especificado" onClick={() => { /* Handle edit location */ }} />
                    <InfoRow label="Estado emocional" value="Não especificado" onClick={() => { /* Handle edit status */ }} />
                    <InfoRow label="Tags (separadas por vespa)" value="Gamer, Música" onClick={() => { /* Handle edit tags */ }} />
                    <InfoRow label="Profissão" value="Não especificado" onClick={() => { /* Handle edit profession */ }} />
                </div>
            </main>
        </div>
    );
};

export default EditProfileScreen;
