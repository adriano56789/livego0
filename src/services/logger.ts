export interface LogMessage {
  id: number;
  message: string;
  type: 'info' | 'success' | 'error';
}

type Listener = (log: LogMessage) => void;

let listeners: Listener[] = [];
let logId = 0;

export const logger = {
  log: (message: string, type: LogMessage['type']) => {
    const newLog = { id: logId++, message, type };
    listeners.forEach(listener => listener(newLog));
  },
  subscribe: (listener: Listener): (() => void) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
};