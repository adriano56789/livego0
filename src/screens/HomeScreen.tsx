import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import StreamCard from '../components/StreamCard';
import { Stream } from '../types/types';
import { api } from '../services/apiService';
import StreamCardSkeleton from '../components/StreamCardSkeleton';

interface HomeScreenProps {
  setActiveScreen: (screen: string, userId?: string) => void;
  onOpenReminderPanel: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ setActiveScreen, onOpenReminderPanel }) => {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStreams = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedStreams = await api.fetchStreams();
      setStreams(fetchedStreams.sort(() => Math.random() - 0.5));
    } catch (err: any) {
      setError(`Falha ao carregar as transmissões. Verifique se o servidor backend está rodando em http://localhost:3001 e tente novamente. Detalhes: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStreams();
  }, [loadStreams]);


  return (
    <div className="bg-[#121212] h-full flex flex-col">
      <Header setActiveScreen={setActiveScreen} onOpenReminderPanel={onOpenReminderPanel} onRefreshStreams={loadStreams} />
      <main className="flex-grow p-2 overflow-y-auto no-scrollbar pb-24">
          {error ? (
            <div className="flex items-center justify-center h-full text-center text-red-400 p-4">
              <p>{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {loading ? (
                Array.from({ length: 6 }).map((_, index) => <StreamCardSkeleton key={index} />)
              ) : (
                streams.map((stream) => (
                  <StreamCard key={stream.id} stream={stream} />
                ))
              )}
            </div>
          )}
      </main>
    </div>
  );
};

export default HomeScreen;