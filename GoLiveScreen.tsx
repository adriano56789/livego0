import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CameraIcon, MicIcon, CloseIcon, ChevronRightIcon, MagicIcon, SettingsIcon, CopyIcon, ChevronDownIcon } from './components/icons';
import { Streamer, User, ToastType } from './types';
import { useTranslation } from './i18n';
import { api } from './services/api';
import BeautyEffectsPanel from './components/live/BeautyEffectsPanel';
import { webSocketManager } from './services/websocket';
import { LoadingSpinner } from './components/Loading';
import { servicoWebRTC } from './services/webrtcService';

interface GoLiveScreenProps {
    currentUser: User;
    onClose: () => void;
    onStartStream: (streamData: Partial<Streamer>) => void;
    addToast: (type: ToastType, message: string) => void;
}

const GoLiveScreen: React.FC<GoLiveScreenProps> = ({ currentUser, onClose, onStartStream, addToast }) => {
    const { t } = useTranslation();

    const [step, setStep] = useState<'permission_request' | 'setup'>('permission_request');
    const [permissionStep, setPermissionStep] = useState<'camera' | 'mic'>('camera');

    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const isInitializing = useRef(false);

    const [activeTab, setActiveTab] = useState<'WebRTC' | 'RTMP' | 'SRT'>('WebRTC');
    const [isPKEnabled, setIsPKEnabled] = useState(true);
    const [liveSettings, setLiveSettings] = useState<{
        category: string;
        isPrivate: boolean;
        title: string;
    }>({ 
        category: 'Popular', 
        isPrivate: false,
        title: 'Minha Transmissão'
    });
    const [liveCategories, setLiveCategories] = useState<{ id: string; label: string }[]>([]);
    const [isCleanMode, setIsCleanMode] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isBeautyPanelOpen, setIsBeautyPanelOpen] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await api.streams.getCategories();
                if (data && Array.isArray(data)) {
                    setLiveCategories(data);
                    const popularCat = data.find(c => c.id === 'popular');
                    if (popularCat) {
                        setLiveSettings(prev => ({ ...prev, category: popularCat.label }));
                    } else if (data.length > 0) {
                        setLiveSettings(prev => ({ ...prev, category: data[0].label }));
                    }
                }
            } catch (error) {
                addToast(ToastType.Error, "Falha ao carregar categorias.");
            }
        };
        fetchCategories();
    }, [addToast]);

    // Inicialização da Câmera
    useEffect(() => {
        let isActive = true;
        let mediaStream: MediaStream | null = null;

        const initCamera = async () => {
            if (isInitializing.current) {
                console.log('Inicialização da câmera já em andamento');
                return;
            }

            console.log('Iniciando inicialização da câmera...');
            isInitializing.current = true;

            try {
                // Para qualquer stream existente
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }

                console.log('Solicitando permissão de mídia...');
                mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: 'user',
                        width: { ideal: 1280 },
                        height: { ideal: 720 }
                    },
                    audio: true
                });

                if (!isActive) {
                    console.log('Componente desmontado durante a inicialização da câmera');
                    mediaStream.getTracks().forEach(track => track.stop());
                    return;
                }

                console.log('Stream de mídia obtida com sucesso');
                setStream(mediaStream);
                setStep('setup');
                
                // Força a reprodução no elemento de vídeo
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                    videoRef.current.play().catch(error => {
                        console.error('Erro ao reproduzir vídeo:', error);
                    });
                }
            } catch (err) {
                console.error("Erro ao acessar a câmera:", err);
                const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
                addToast(ToastType.Error, `Erro ao acessar a câmera: ${errorMessage}`);
            } finally {
                isInitializing.current = false;
            }
        };

        // Inicia a câmera imediatamente
        initCamera();

        // Limpeza ao desmontar
        return () => {
            isActive = false;
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [addToast]);

    // Efeito para gerenciar o stream de vídeo no elemento de vídeo
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Configurações importantes para o elemento de vídeo
        video.autoplay = true;
        video.playsInline = true;
        video.muted = true; // Importante para autoplay em navegadores
        video.style.transform = 'scaleX(-1)'; // Espelha a imagem da câmera

        const updateVideoElement = () => {
            if (!stream) {
                if (video.srcObject) {
                    video.srcObject = null;
                }
                return;
            }

            if (video.srcObject !== stream) {
                video.srcObject = stream;
                
                // Tenta reproduzir o vídeo
                const playVideo = () => {
                    video.play().catch(error => {
                        console.warn('Erro ao reproduzir vídeo:', error);
                        // Se falhar, tenta novamente com áudio mudo
                        video.muted = true;
                        video.play().catch(console.error);
                    });
                };

                // Se o vídeo já tem metadados, reproduz imediatamente
                if (video.readyState >= 2) {
                    playVideo();
                } else {
                    // Caso contrário, espera os metadados carregarem
                    const onLoadedMetadata = () => {
                        playVideo();
                        video.removeEventListener('loadedmetadata', onLoadedMetadata);
                    };
                    video.addEventListener('loadedmetadata', onLoadedMetadata);
                }
            }
        };

        updateVideoElement();

        // Atualiza quando o stream mudar
        const intervalId = setInterval(updateVideoElement, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, [stream]);

    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);

    // Efeito para gerenciar o evento de stream pronto
    useEffect(() => {
        const handleStreamReady = async (data: { streamUrl: string }) => {
            console.log('[GoLiveScreen] Evento stream:ready recebido:', data);
            
            try {
                // Cria os dados da transmissão
                const streamData = {
                    id: `live_${Date.now()}`,
                    hostId: currentUser.id,
                    name: liveSettings.title || `Live de ${currentUser.name}`,
                    avatar: currentUser.avatarUrl || '',
                    location: currentUser.location || 'Brasil',
                    viewers: 1,
                    tags: [],
                    category: liveSettings.category,
                    isPrivate: liveSettings.isPrivate,
                    streamUrl: data.streamUrl,
                    thumbnail: currentUser.avatarUrl || '',
                    description: liveSettings.title,
                    isLive: true
                };

                console.log('[GoLiveScreen] Dados da transmissão a serem enviados:', {
                    ...streamData,
                    // Não logar dados sensíveis em produção
                    streamUrl: '***',
                    avatar: streamData.avatar ? '***' : 'não definido',
                    thumbnail: streamData.thumbnail ? '***' : 'não definido'
                });

                // 1. Cria o registro da transmissão no backend
                console.log('[GoLiveScreen] Chamando api.streams.create()');
                const createResponse = await api.streams.create(streamData);
                console.log('[GoLiveScreen] Resposta de api.streams.create():', createResponse);
                
                if (!createResponse || !createResponse.id) {
                    throw new Error('Resposta inválida ao criar transmissão');
                }
                
                // Atualiza o ID da transmissão com o retornado pelo servidor
                streamData.id = createResponse.id;
                
                // 2. Marca a transmissão como ativa (broadcasting)
                console.log(`[GoLiveScreen] Chamando api.streams.startBroadcast() para streamId: ${streamData.id}`);
                const startBroadcastResponse = await api.streams.startBroadcast({ streamId: streamData.id });
                console.log('[GoLiveScreen] Resposta de api.streams.startBroadcast():', startBroadcastResponse);
                
                // 3. Notifica o componente pai sobre o início da transmissão
                console.log('[GoLiveScreen] Chamando onStartStream() com dados da transmissão');
                onStartStream(streamData);

                // 4. Notifica outros clientes via WebSocket
                console.log('[GoLiveScreen] Emitindo evento stream:started via WebSocket');
                webSocketManager.emit('stream:started', streamData);

                // 5. Atualiza o elemento de vídeo
                if (videoRef.current && stream) {
                    console.log('[GoLiveScreen] Configurando elemento de vídeo');
                    videoRef.current.srcObject = stream;
                    videoRef.current.play().catch(e => {
                        console.error('[GoLiveScreen] Erro ao reproduzir vídeo após stream pronto:', e);
                    });
                }

                console.log('[GoLiveScreen] Transmissão registrada e iniciada com sucesso!', {
                    streamId: streamData.id,
                    title: streamData.name,
                    category: streamData.category,
                    isPrivate: streamData.isPrivate,
                    streamUrl: '***',
                    timestamp: new Date().toISOString()
                });
                
            } catch (error) {
                console.error('[GoLiveScreen] Erro ao registrar transmissão:', {
                    error: error.message,
                    stack: error.stack,
                    response: error.response?.data || 'N/A'
                });
                
                addToast(ToastType.Error, `Erro ao iniciar transmissão: ${error.message}`);
                setIsStreaming(false);
                
                try {
                    console.log('[GoLiveScreen] Parando streaming devido ao erro...');
                    webSocketManager.stopStreaming();
                } catch (e) {
                    console.error('[GoLiveScreen] Erro ao parar streaming após falha:', e);
                }
            }
        };

        // Registra o listener para o evento stream:ready
        webSocketManager.on('stream:ready', handleStreamReady);

        // Limpeza
        return () => {
            webSocketManager.off('stream:ready', handleStreamReady);
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream, currentUser, liveSettings, onStartStream, addToast]);

    const handlePermissionAction = (action: 'allow' | 'once' | 'deny') => {
        if (action === 'deny') {
            onClose();
            return;
        }
        if (permissionStep === 'camera') {
            setPermissionStep('mic');
        } else {
            setStep('setup');
        }
    };

    const handleStartStream = async () => {
        console.log('[GoLiveScreen] Iniciando transmissão...');
        
        if (!stream) {
            const errorMsg = 'Erro: Nenhum stream de mídia disponível.';
            console.error('[GoLiveScreen]', errorMsg);
            addToast(ToastType.Error, errorMsg);
            return;
        }

        console.log('[GoLiveScreen] Stream de mídia disponível:', {
            videoTracks: stream.getVideoTracks().map(t => ({
                id: t.id,
                label: t.label,
                enabled: t.enabled,
                muted: t.muted,
                readyState: t.readyState,
                kind: t.kind
            })),
            audioTracks: stream.getAudioTracks().map(t => ({
                id: t.id,
                label: t.label,
                enabled: t.enabled,
                muted: t.muted,
                readyState: t.readyState,
                kind: t.kind
            }))
        });

        setIsStreaming(true);

        try {
            const streamKey = currentUser.username || `stream_${Date.now()}`;
            const streamUrl = `webrtc://localhost/live/${streamKey}`;
            console.log('[GoLiveScreen] Iniciando conexão WebRTC com SRS:', { 
                streamUrl,
                streamKey,
                user: currentUser.username,
                userId: currentUser.id
            });
            
            // Inicia o streaming via WebRTC
            console.log('[GoLiveScreen] Chamando webSocketManager.startStreaming()');
            await webSocketManager.startStreaming(stream, streamUrl);
            console.log('[GoLiveScreen] Streaming WebRTC iniciado com sucesso! Aguardando evento stream:ready...');
            
        } catch (error) {
            const errorMsg = `Falha ao iniciar transmissão: ${error.message}`;
            console.error('[GoLiveScreen]', errorMsg, error);
            setIsStreaming(false);
            addToast(ToastType.Error, errorMsg);
            
            // Tenta parar o streaming em caso de erro
            try {
                console.log('[GoLiveScreen] Tentando parar streaming após falha...');
                webSocketManager.stopStreaming();
            } catch (e) {
                console.error('[GoLiveScreen] Erro ao parar streaming após falha:', e);
            }
        }
    };

    const handleTogglePrivate = () => {
        const nextValue = !liveSettings.isPrivate;
        if (nextValue) {
            setLiveSettings(prev => ({ 
                ...prev, 
                category: 'Privada', 
                isPrivate: true 
            }));
        } else {
            setLiveSettings(prev => ({
                ...prev,
                category: 'Popular',
                isPrivate: false
            }));
        }
    };

    const handleSaveCover = () => {
        addToast(ToastType.Success, "Capa salva!");
    };

    const renderPermissionModal = () => {
        const isCamera = permissionStep === 'camera';
        const icon = isCamera ? <CameraIcon className="w-8 h-8 text-gray-300" /> : <MicIcon className="w-8 h-8 text-gray-300" />;
        const title = isCamera ? "Permitir que o app LiveGo tire fotos e grave vídeos?" : "Permitir que o app LiveGo grave áudio?";

        return (
            <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center">
                <div className="absolute inset-0 bg-transparent" onClick={onClose}></div>
                <div className="relative w-full max-w-[380px] bg-[#232323] rounded-t-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
                    <div className="flex flex-col items-center text-center pt-2 pb-6">
                        <div className="mb-4 text-gray-400">{icon}</div>
                        <h2 className="text-white text-lg font-semibold px-4">{title}</h2>
                    </div>
                    <div className="flex flex-col w-full space-y-3 pb-4">
                        <button onClick={() => handlePermissionAction('allow')} className="w-full py-3.5 bg-[#007AFF] rounded-full text-white font-semibold">Durante o uso do app</button>
                        <button onClick={() => handlePermissionAction('once')} className="w-full py-3.5 bg-[#353535] rounded-full text-white font-semibold">Apenas esta vez</button>
                        <button onClick={() => handlePermissionAction('deny')} className="w-full py-3.5 bg-[#353535] rounded-full text-white font-semibold">Não permitir</button>
                    </div>
                </div>
            </div>
        );
    };

    const renderCategoryModal = () => (
        <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center" onClick={() => setIsCategoryModalOpen(false)}>
            <div className="w-full sm:max-w-md bg-[#1C1C1E] rounded-t-3xl p-5 animate-in slide-in-from-bottom duration-300" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-white text-lg font-bold">Selecionar Categoria</h3>
                    <button onClick={() => setIsCategoryModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-gray-400"><CloseIcon className="w-5 h-5" /></button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    {liveCategories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => {
                                setLiveSettings(prev => ({
                                    ...prev,
                                    category: cat.label, 
                                    isPrivate: cat.id === 'private'
                                }));
                                setIsCategoryModalOpen(false);
                            }}
                            className={`py-3 px-2 rounded-xl text-sm font-bold transition-all ${liveSettings.category === cat.label ? 'bg-[#A855F7] text-white' : 'bg-[#2C2C2E] text-gray-300'}`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className={`fixed inset-0 z-50 flex flex-col font-sans ${step === 'setup' ? 'bg-black' : 'bg-transparent'}`}>
            {step === 'setup' && (
                <div className="absolute inset-0 bg-black" onClick={() => isCleanMode && setIsCleanMode(false)}>
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                        style={{ transform: 'scaleX(-1)' }}
                    />
                    <div className={`absolute inset-0 bg-black/20 pointer-events-none transition-opacity duration-500 ${isCleanMode ? 'opacity-0' : 'opacity-100'}`}></div>
                </div>
            )}

            {step === 'permission_request' && renderPermissionModal()}

            {step === 'setup' && currentUser && (
                <div className="relative z-10 flex flex-col h-full safe-area-top safe-area-bottom">
                    <div className="flex justify-between items-start pt-6 px-4">
                        <div className={`flex items-center gap-3 transition-all duration-300 ${isCleanMode ? 'opacity-0 translate-y-[-20px] pointer-events-none' : 'opacity-100 translate-y-0'}`}>
                            <div className="w-[60px] h-[60px] rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg">
                                <img src={currentUser.avatarUrl} className="w-full h-full object-cover" alt="avatar" />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-white font-bold text-lg drop-shadow-md">Live de {currentUser.name}</h2>
                                <button onClick={() => setIsCategoryModalOpen(true)} className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-xs text-white flex items-center gap-1 w-fit"># {liveSettings.category} <ChevronRightIcon className="w-3 h-3" /></button>
                            </div>
                            <button onClick={handleSaveCover} className="text-[#00E676] font-bold text-sm ml-2 drop-shadow-md">Salvar</button>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => setIsCleanMode(!isCleanMode)} className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${isCleanMode ? 'bg-white text-black' : 'bg-black/30 text-white'}`}><SettingsIcon className="w-5 h-5" /></button>
                            <button onClick={onClose} className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white"><CloseIcon className="w-5 h-5" /></button>
                        </div>
                    </div>

                    <div className={`fixed inset-0 z-30 flex items-center justify-center transition-all duration-300 ${!isCleanMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                        <div className="absolute inset-0 bg-black/50" onClick={() => setIsCleanMode(false)}></div>
                        <div className="relative z-10 w-full max-w-md mx-4 bg-[#1e1e1e] rounded-2xl p-4 shadow-2xl">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-white text-lg font-bold">Configurações</h3>
                                <button onClick={() => setIsCleanMode(false)} className="text-gray-400 hover:text-white">
                                    <CloseIcon className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="bg-[#1e1e1e]/90 backdrop-blur-xl rounded-2xl p-1 border border-white/10 shadow-2xl">
                                <div className="flex p-1 bg-[#121212]/50 rounded-xl mb-2">
                                    {['WebRTC', 'RTMP', 'SRT'].map(tab => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab as any)}
                                            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === tab ? 'bg-white text-black' : 'text-gray-400'}`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>
                                <div className="px-2 pb-2 space-y-1">
                                    <button className="w-full flex items-center justify-between p-3 hover:bg-white/5 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                                                <div className="w-3 h-3 border-2 border-blue-400 rounded-[1px]"></div>
                                            </div>
                                            <span className="text-white text-sm font-bold">Manual de Transmissão</span>
                                        </div>
                                        <ChevronRightIcon className="w-4 h-4 text-gray-500" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsBeautyPanelOpen(true);
                                            setIsCleanMode(false);
                                        }}
                                        className="w-full flex items-center justify-between p-3 hover:bg-white/5 rounded-lg"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center">
                                                <MagicIcon className="w-3 h-3 text-pink-400" />
                                            </div>
                                            <span className="text-white text-sm font-bold">Efeitos de Beleza</span>
                                        </div>
                                        <ChevronRightIcon className="w-4 h-4 text-gray-500" />
                                    </button>
                                    <div className="w-full flex items-center justify-between p-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center">
                                                <span className="text-[10px] font-black text-orange-400">PK</span>
                                            </div>
                                            <span className="text-white text-sm font-bold">Batalha PK</span>
                                        </div>
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsPKEnabled(!isPKEnabled);
                                            }}
                                            className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors ${isPKEnabled ? 'bg-green-500' : 'bg-gray-600'}`}
                                        >
                                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${isPKEnabled ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                        </div>
                                    </div>
                                    <div className="w-full flex items-center justify-between p-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                                                <div className="w-3 h-3 border border-purple-400 rounded-sm"></div>
                                            </div>
                                            <span className="text-white text-sm font-bold">Sala Privada</span>
                                        </div>
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleTogglePrivate();
                                            }}
                                            className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors ${liveSettings.isPrivate ? 'bg-green-500' : 'bg-gray-600'}`}
                                        >
                                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${liveSettings.isPrivate ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1" onClick={() => isCleanMode && setIsCleanMode(false)}></div>

                    <div className={`p-6 pb-8 transition-all duration-300 transform ${isCleanMode ? 'opacity-0 translate-y-20 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
                        <button
                            onClick={handleStartStream}
                            disabled={isStreaming}
                            className="w-full bg-[#00E676] text-black font-black text-lg py-4 rounded-full shadow-lg shadow-green-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:bg-gray-600"
                        >
                            {isStreaming ? 'Transmitindo...' : 'Iniciar Transmissão'}
                        </button>
                    </div>
                </div>
            )}

            {isCategoryModalOpen && renderCategoryModal()}
            {isBeautyPanelOpen && <BeautyEffectsPanel onClose={() => setIsBeautyPanelOpen(false)} addToast={addToast} />}
        </div>
    );
};

export default GoLiveScreen;