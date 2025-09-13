import React from 'react';
import { Stream } from '../types/types';
import LockIcon from './icons/LockIcon';

interface StreamCardProps {
  stream: Stream;
}

const Tag: React.FC<{ text: string; className?: string; style?: React.CSSProperties }> = ({ text, className, style }) => (
  <div className={`absolute top-2 left-2 px-2 py-0.5 text-xs font-bold rounded ${className}`} style={style}>
    {text}
  </div>
);

const StreamCard: React.FC<StreamCardProps> = ({ stream }) => {
  const renderTags = () => {
    const mainTag = stream.tags[0];
    const specialTag = stream.tags.find(t => t.toLowerCase().includes('evento'));

    return (
      <>
        {mainTag === 'PK' && (
          <>
            <Tag text="PK" className="bg-purple-600" />
            <Tag text="PK" className="bg-purple-600" style={{left: 'auto', right: '8px'}} />
          </>
        )}
        {mainTag === 'Dança' && <Tag text="Dança" className="bg-black bg-opacity-50" style={{left: 'auto', right: '8px'}} />}
        {mainTag === 'Privada' && (
           <div className="absolute top-2 left-2 px-2 py-1 bg-black bg-opacity-60 rounded-full flex items-center text-xs">
              <LockIcon className="w-3 h-3 mr-1"/>
              <span>Privada</span>
           </div>
        )}
        {specialTag && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-center font-bold text-xl px-4 py-2 rounded-lg shadow-lg">
                EVENTO DE PK
            </div>
        )}
      </>
    );
  };
  
  return (
    <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg group">
      <img src={stream.imageUrl} alt={stream.title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
      
      {renderTags()}

      <div className="absolute bottom-0 left-0 p-3 text-white w-full">
        <h3 className="font-bold text-lg truncate">{stream.title}</h3>
        <div className="flex justify-between items-center text-sm text-gray-300">
          <p className="truncate">{stream.streamer}</p>
          <div className="flex items-center space-x-1 flex-shrink-0">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C3.732 4.943 9.522 3 10 3s6.268 1.943 9.542 7c-3.274 5.057-9.062 7-9.542 7S3.732 15.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            <span>{stream.viewers}</span>
            {stream.country === 'br' && (
              <img src="https://flagcdn.com/br.svg" width="20" alt="Brazil" />
            )}
            {stream.country === 'us' && (
              <img src="https://flagcdn.com/us.svg" width="20" alt="USA" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamCard;