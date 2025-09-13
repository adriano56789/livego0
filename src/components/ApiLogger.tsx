import React, { useState, useEffect } from 'react';
import { logger, LogMessage } from '../services/logger';
import CheckCircleIcon from './icons/CheckCircleIcon';
import CloseCircleFilledIcon from './icons/CloseCircleFilledIcon';
import InformationCircleIcon from './icons/InformationCircleIcon';

const LogEntry: React.FC<{ log: LogMessage; onDismiss: () => void }> = ({ log, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000); 
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const typeStyles = {
    info: 'bg-blue-900/80 border-blue-500',
    success: 'bg-green-900/80 border-green-500',
    error: 'bg-red-900/80 border-red-500',
  };

  const Icon = {
    info: <InformationCircleIcon className="w-5 h-5 text-blue-300" />,
    success: <CheckCircleIcon className="w-5 h-5 text-green-300" />,
    error: <CloseCircleFilledIcon className="w-5 h-5 text-red-300" />,
  }[log.type];

  return (
    <div
      className={`flex items-center space-x-3 w-full max-w-md p-3 mb-2 rounded-lg border text-white text-sm shadow-lg backdrop-blur-md animate-fade-in ${typeStyles[log.type]}`}
      role="alert"
    >
      <div className="flex-shrink-0">{Icon}</div>
      <p className="flex-grow font-mono break-all">{log.message}</p>
      <button onClick={onDismiss} className="text-gray-400 hover:text-white">&times;</button>
    </div>
  );
};

const ApiLogger: React.FC = () => {
  const [logs, setLogs] = useState<LogMessage[]>([]);

  useEffect(() => {
    const unsubscribe = logger.subscribe((newLog) => {
      setLogs((prevLogs) => [newLog, ...prevLogs.slice(0, 4)]);
    });
    return () => unsubscribe();
  }, []);

  const dismissLog = (id: number) => {
    setLogs((prevLogs) => prevLogs.filter((log) => log.id !== id));
  };

  if (logs.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-24 left-4 z-50 pointer-events-auto w-[calc(100%-2rem)] max-w-md">
      {logs.map((log) => (
        <LogEntry key={log.id} log={log} onDismiss={() => dismissLog(log.id)} />
      ))}
    </div>
  );
};

export default ApiLogger;