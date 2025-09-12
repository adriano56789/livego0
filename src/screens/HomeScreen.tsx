
import React from 'react';
import Header from '../components/Header';
import StreamCard from '../components/StreamCard';
import { Stream } from '../types/types';

interface HomeScreenProps {
  streams: Stream[];
  setActiveScreen: (screen: string) => void;
  onOpenReminderPanel: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ streams, setActiveScreen, onOpenReminderPanel }) => {
  return (
    <div className="bg-[#121212] h-full flex flex-col">
      <Header setActiveScreen={setActiveScreen} onOpenReminderPanel={onOpenReminderPanel} />
      <main className="flex-grow p-2 overflow-y-auto no-scrollbar pb-24">
        <div className="grid grid-cols-2 gap-2">
          {streams.map((stream) => (
            <StreamCard key={stream.id} stream={stream} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default HomeScreen;
