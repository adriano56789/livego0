
import React from 'react';
import Header from '../components/Header';
import StreamCard from '../components/StreamCard';
import { MOCK_STREAMS } from '../constants';

interface HomeScreenProps {
  setActiveScreen: (screen: string) => void;
  onOpenReminderPanel: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ setActiveScreen, onOpenReminderPanel }) => {
  return (
    <div className="bg-[#121212] pb-24">
      <Header setActiveScreen={setActiveScreen} onOpenReminderPanel={onOpenReminderPanel} />
      <main className="p-2">
        <div className="grid grid-cols-2 gap-2">
          {MOCK_STREAMS.map((stream) => (
            <StreamCard key={stream.id} stream={stream} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default HomeScreen;