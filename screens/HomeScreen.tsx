
import React from 'react';
import Header from '../components/Header';
import StreamCard from '../components/StreamCard';
import { MOCK_STREAMS } from '../constants';

const HomeScreen: React.FC = () => {
  return (
    <div className="bg-[#121212] pb-24">
      <Header />
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