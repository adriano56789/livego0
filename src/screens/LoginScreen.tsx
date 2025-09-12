
import React from 'react';
import GoogleIcon from '../components/GoogleIcon';
import FacebookIcon from '../components/FacebookIcon';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-[#181818]">
      <div className="flex-grow flex flex-col items-center justify-center text-center">
        <h1 className="text-6xl font-bold tracking-wider">LiveGo</h1>
        <p className="mt-2 text-gray-400 text-lg">Top Streamers, Boas Vibrações!</p>
      </div>
      
      <div className="w-full max-w-sm">
        <button 
          onClick={onLogin}
          className="w-full bg-white text-black font-semibold py-3 px-4 rounded-full flex items-center justify-center text-lg hover:bg-gray-200 transition-colors"
        >
          <GoogleIcon className="w-6 h-6 mr-3" />
          Entrar com o Google
        </button>

        <p className="text-center text-gray-400 my-6">Mais opções de login</p>
        
        <div className="flex justify-center">
          <button className="bg-[#2d2d2d] p-3 rounded-full hover:bg-[#3f3f3f] transition-colors">
            <FacebookIcon className="w-8 h-8" />
          </button>
        </div>
      </div>
      
      <div className="mt-16 text-center text-xs text-gray-500 max-w-sm">
        <p>
          Login/registro significa que você leu e fornece o 
          <a href="#" className="underline"> Contrato do Usuário</a> e 
          a <a href="#" className="underline">Política de Privacidade</a>.
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
