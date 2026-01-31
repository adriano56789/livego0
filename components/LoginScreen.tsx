import React, { useState, useEffect } from 'react';
import { useTranslation } from '../i18n';
import { api, storage } from '../services/api';
import { User } from '../types';

interface LoginScreenProps {
  onLogin: (data: { user: User; token: string }) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<'register' | 'login' | 'verify'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [emailToVerify, setEmailToVerify] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchLastEmail = async () => {
        try {
            const { email: lastEmail } = await api.auth.getLastEmail();
            if (lastEmail) setEmail(lastEmail);
        } catch (error) {
            console.warn("Could not fetch last login email.");
        }
    };
    fetchLastEmail();
  }, []);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || loading) return;
    
    setLoading(true);
    setStatusMessage({ text: '', type: '' });

    try {
      const result = await api.auth.login({ email, password });
      if (result && result.user && result.token) {
        await api.auth.saveLastEmail(email);
        onLogin(result);
      }
    } catch (error: any) {
      setStatusMessage({ text: error.message || 'E-mail ou senha incorretos.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || loading) return;

    setLoading(true);
    setStatusMessage({ text: '', type: '' });

    try {
      const result = await api.auth.register({ name, email, password });
      if (result && result.email) {
        setStatusMessage({ text: 'Verifique seu e-mail! Enviamos um código de 6 dígitos.', type: 'success' });
        setEmailToVerify(result.email);
        setViewMode('verify');
        setPassword('');
      } else {
        throw new Error('A resposta do registro foi inesperada.');
      }
    } catch (error: any) {
      setStatusMessage({ text: error.message || 'Erro ao registrar conta.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailToVerify || !verificationCode || loading) return;

    setLoading(true);
    setStatusMessage({ text: '', type: '' });

    try {
        await api.auth.verifyEmail({ email: emailToVerify, code: verificationCode });
        setStatusMessage({ text: 'E-mail verificado! Faça seu login.', type: 'success' });
        setViewMode('login');
        setEmail(emailToVerify);
        setVerificationCode('');
        setEmailToVerify('');
    } catch (error: any) {
        setStatusMessage({ text: error.message || 'Código inválido ou expirado.', type: 'error' });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-cover bg-center font-sans" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=2070&auto=format&fit=crop')" }}>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/95"></div>
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-8 overflow-hidden">
        
        <div className="w-full text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
            <h1 className="text-6xl font-black text-white mb-2 tracking-tighter italic">LiveGo</h1>
            <p className="text-purple-300 text-sm font-bold uppercase tracking-[0.2em]">Experiência VIP Real</p>
        </div>

        <div className="w-full max-w-sm flex flex-col space-y-4">
            {statusMessage.text && (
                 <div className={`p-4 rounded-2xl text-sm font-bold text-center animate-in zoom-in-95 duration-300 ${statusMessage.type === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>
                    {statusMessage.text}
                 </div>
            )}

            {viewMode === 'verify' ? (
                <form onSubmit={handleVerify} className="space-y-4 w-full animate-in slide-in-from-bottom-4 duration-300">
                    <div className="text-center mb-2">
                        <h2 className="text-white font-bold text-xl">Verifique seu E-mail</h2>
                        <p className="text-gray-400 text-xs mt-1">Enviamos um código para <span className="font-bold text-white">{emailToVerify}</span></p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl px-5 py-4 border border-white/10 focus-within:border-purple-500/50 transition-all">
                        <input type="text" inputMode="numeric" maxLength={6} className="bg-transparent w-full text-white placeholder-gray-500 outline-none text-sm font-medium text-center tracking-[0.5em]" placeholder="------" value={verificationCode} onChange={e => setVerificationCode(e.target.value)} required />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black py-4 rounded-2xl mt-4 transition-all shadow-xl shadow-purple-900/30 active:scale-95 disabled:opacity-50">
                        {loading ? 'VERIFICANDO...' : 'CONFIRMAR E-MAIL'}
                    </button>
                </form>
            ) : viewMode === 'register' ? (
                <form onSubmit={handleRegister} className="space-y-4 w-full animate-in slide-in-from-right-4 duration-300">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl px-5 py-4 border border-white/10 focus-within:border-purple-500/50 transition-all">
                        <input className="bg-transparent w-full text-white placeholder-gray-500 outline-none text-sm font-medium" placeholder="Seu nome real ou apelido" value={name} onChange={e => setName(e.target.value)} required />
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl px-5 py-4 border border-white/10 focus-within:border-purple-500/50 transition-all">
                        <input type="email" className="bg-transparent w-full text-white placeholder-gray-500 outline-none text-sm font-medium" placeholder="E-mail de acesso" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl px-5 py-4 border border-white/10 focus-within:border-purple-500/50 transition-all">
                        <input type="password" className="bg-transparent w-full text-white placeholder-gray-500 outline-none text-sm font-medium" placeholder="Crie uma senha segura" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black py-4 rounded-2xl mt-4 transition-all shadow-xl shadow-purple-900/30 active:scale-95 disabled:opacity-50">
                        {loading ? 'PROCESSANDO...' : 'CRIAR MINHA CONTA'}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleEmailLogin} className="space-y-4 w-full animate-in slide-in-from-left-4 duration-300">
                     <div className="bg-white/10 backdrop-blur-md rounded-2xl px-5 py-4 border border-white/10 focus-within:border-purple-500/50 transition-all">
                        <input type="email" className="bg-transparent w-full text-white placeholder-gray-500 outline-none text-sm font-medium" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required />
                     </div>
                     <div className="bg-white/10 backdrop-blur-md rounded-2xl px-5 py-4 border border-white/10 focus-within:border-purple-500/50 transition-all">
                        <input type="password" className="bg-transparent w-full text-white placeholder-gray-500 outline-none text-sm font-medium" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} required />
                     </div>
                     <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black py-4 rounded-2xl mt-4 transition-all shadow-xl shadow-purple-900/30 active:scale-95 disabled:opacity-50">
                        {loading ? 'VERIFICANDO...' : 'ENTRAR'}
                     </button>
                </form>
            )}
        </div>

        <div className="w-full max-w-sm mt-12 text-center">
            <p className="text-gray-400 text-sm mb-4">
                {viewMode === 'login' ? 'Ainda não tem acesso?' : viewMode === 'register' ? 'Já possui uma conta ativa?' : 'Não recebeu o código?'}
            </p>
            <button 
                onClick={() => {
                    setStatusMessage({ text: '', type: '' });
                    setViewMode(viewMode === 'login' ? 'register' : 'login');
                }}
                className="text-white font-black text-sm uppercase tracking-widest hover:text-purple-400 transition-colors underline decoration-purple-500 decoration-2 underline-offset-8"
            >
                {viewMode === 'login' ? 'Criar minha conta agora' : viewMode === 'register' ? 'Fazer login no sistema' : 'Voltar ao registro'}
            </button>
        </div>

        <div className="absolute bottom-10 text-gray-600 text-[10px] font-bold uppercase tracking-widest">
            Servidor Real LiveGo Online v1.0
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
