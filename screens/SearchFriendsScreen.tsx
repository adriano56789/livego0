
import React from 'react';
import ChevronLeftIcon from '../components/icons/ChevronLeftIcon';
import SearchIcon from '../components/icons/SearchIcon';

interface SearchFriendsScreenProps {
    setActiveScreen: (screen: string) => void;
}

const SearchFriendsScreen: React.FC<SearchFriendsScreenProps> = ({ setActiveScreen }) => {
    return (
        <div className="bg-black min-h-screen text-white flex flex-col">
            <header className="p-4 flex items-center space-x-3 border-b border-gray-800">
                <button onClick={() => setActiveScreen('messages')} aria-label="Back to messages">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <div className="relative flex-grow">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                        type="text"
                        placeholder="Pesquisar por nome ou ID"
                        className="w-full bg-[#1e1e1e] border border-green-500 rounded-full py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-400"
                    />
                </div>
            </header>
            <main className="flex-grow flex flex-col items-center justify-center text-center p-8">
                <p className="text-gray-500">Encontre usuários por nome ou ID.</p>
            </main>
        </div>
    );
};

export default SearchFriendsScreen;
