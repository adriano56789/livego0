
import React, { useState, useEffect, useRef } from 'react';
import CloseIcon from '../components/icons/CloseIcon';
import PlusIcon from '../components/icons/PlusIcon';
import UserGroupIcon from '../components/icons/UserGroupIcon';
import BookOpenIcon from '../components/icons/BookOpenIcon';
import SparklesIcon from '../components/icons/SparklesIcon';
import PKBattleIcon from '../components/icons/PKBattleIcon';
import ExpandIcon from '../components/icons/ExpandIcon';
import BeautyEffectsPanel from '../components/live/BeautyEffectsPanel';
import ChevronRightIcon from '../components/icons/ChevronRightIcon';
import CategorySelectionModal from '../components/live/CategorySelectionModal';
import LockClosedIcon from '../components/icons/LockClosedIcon';


interface GoLiveScreenProps {
  onClose: () => void;
  onStartLive: (isPrivate: boolean) => void;
}

const Toggle: React.FC<{ checked: boolean; onToggle: () => void; }> = ({ checked, onToggle }) => (
    <button
        onClick={onToggle}
        className={`relative inline-flex items-center h-8 w-[52px] rounded-full transition-colors duration-200 ease-in-out flex-shrink-0 ${
            checked ? 'bg-blue-600' : 'bg-[#767577]'
        }`}
        aria-pressed={checked}
    >
        <span
            className={`inline-block w-[28px] h-[28px] transform bg-white rounded-full transition-transform duration-200 ease-in-out shadow-sm ${
                checked ? 'translate-x-[22px]' : 'translate-x-1'
            }`}
        />
    </button>
);

const GoLiveScreen: React.FC<GoLiveScreenProps> = ({ onClose, onStartLive }) => {
  const [showBeautyPanel, setShowBeautyPanel] = useState(false);
  const [pkBattle, setPkBattle] = useState(true);
  const [isUiVisible, setIsUiVisible] = useState(true);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Popular');
  const [isPrivate, setIsPrivate] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera: ", err);
        if (err instanceof Error) {
            setCameraError(`Failed to access camera: ${err.message}. Please check your browser permissions and ensure your camera is not in use by another application.`);
        } else {
            setCameraError('An unknown error occurred while trying to access the camera.');
        }
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black text-white font-sans" onClick={() => !isUiVisible && setIsUiVisible(true)}>
      {/* Camera Feed Background */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />

      {cameraError && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-center p-6 z-30">
              <h2 className="text-2xl font-bold text-red-500 mb-4">Camera Not Available</h2>
              <p className="text-gray-300 max-w-md">{cameraError}</p>
              <button 
                onClick={onClose} 
                className="mt-8 bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-8 rounded-full transition-colors"
              >
                  Close
              </button>
          </div>
      )}

      {/* UI Overlay */}
      {isUiVisible && !cameraError && (
        <div className="absolute inset-0 bg-black/30 flex flex-col p-4" onClick={e => e.stopPropagation()}>
          <div className="absolute top-4 right-4 z-20 flex items-center space-x-2">
            <button onClick={() => setIsUiVisible(false)} className="bg-gray-800/70 w-9 h-9 rounded-full flex items-center justify-center" aria-label="Clear screen">
                <ExpandIcon className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="bg-gray-800/70 w-9 h-9 rounded-full flex items-center justify-center" aria-label="Close go live screen">
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-grow flex flex-col justify-start pt-16 overflow-y-auto no-scrollbar">
            <div>
              <div className="flex items-start space-x-3">
                <button className="flex-shrink-0 w-24 h-24 bg-[#2a2a2a]/90 rounded-lg flex flex-col items-center justify-center space-y-1">
                  <div className="w-8 h-8 flex items-center justify-center bg-gray-600 rounded-md">
                      <PlusIcon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-semibold">Adicionar Capa</span>
                </button>
                
                <div className="flex-grow space-y-3 pt-2">
                  <div className="relative">
                    <input type="text" defaultValue="h" className="bg-transparent border-b border-gray-500 w-full focus:outline-none focus:border-white pb-2 text-lg" />
                  </div>
                  <div className="flex items-center space-x-3">
                    <input type="text" defaultValue="j" className="bg-transparent border-b border-gray-500 w-full focus:outline-none focus:border-white pb-2 text-lg" />
                    <button className="bg-[#3a3a3a] px-5 py-2 rounded-full text-sm font-semibold flex-shrink-0">Salvar</button>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mt-4">
                <button
                  onClick={() => setIsPrivate(!isPrivate)}
                  className="bg-[#3a3a3a]/90 px-3 py-1.5 rounded-full text-sm flex items-center space-x-1.5"
                >
                  {isPrivate ? (
                    <>
                      <LockClosedIcon className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400">Sala Privada</span>
                    </>
                  ) : (
                    <>
                      <UserGroupIcon className="w-4 h-4" />
                      <span>Sala Pública</span>
                    </>
                  )}
                </button>
                <button onClick={() => setIsCategoryModalOpen(true)} className="bg-[#3a3a3a]/90 px-3 py-1.5 rounded-full text-sm">
                  {selectedCategory}
                </button>
              </div>
              
              <div className="bg-[#2a2a2a]/90 rounded-xl mt-6">
                <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
                  <div className="flex items-center space-x-3">
                    <BookOpenIcon className="w-6 h-6 text-gray-400" />
                    <span className="font-medium">Manual de Transmissão ao Vivo</span>
                  </div>
                </div>
                <button onClick={() => setShowBeautyPanel(true)} className="w-full text-left flex items-center justify-between p-4 border-b border-gray-700/50">
                  <div className="flex items-center space-x-3">
                    <SparklesIcon className="w-6 h-6 text-gray-400" />
                    <span className="font-medium">Efeitos de Beleza</span>
                  </div>
                  <ChevronRightIcon className="w-5 h-5 text-gray-500" />
                </button>
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-3">
                    <PKBattleIcon className="w-6 h-6" />
                    <span className="font-medium">Batalha PK</span>
                  </div>
                  <Toggle checked={pkBattle} onToggle={() => setPkBattle(!pkBattle)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      {!showBeautyPanel && !cameraError && (
        <div 
          className="absolute bottom-0 left-0 right-0 p-4 z-10"
          onClick={e => e.stopPropagation()}
        >
          {isUiVisible && <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/50 to-transparent -z-10 pointer-events-none" />}
          <div className="pb-4">
            <button onClick={() => onStartLive(isPrivate)} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-full text-lg shadow-lg shadow-green-500/30">
              Iniciar Transmissão
            </button>
          </div>
        </div>
      )}

      {showBeautyPanel && <BeautyEffectsPanel onClose={() => setShowBeautyPanel(false)} />}
      
      {isCategoryModalOpen && (
        <CategorySelectionModal 
            onClose={() => setIsCategoryModalOpen(false)}
            onSelectCategory={(category) => {
                setSelectedCategory(category);
                setIsCategoryModalOpen(false);
            }}
            currentCategory={selectedCategory}
        />
      )}
    </div>
  );
};

export default GoLiveScreen;