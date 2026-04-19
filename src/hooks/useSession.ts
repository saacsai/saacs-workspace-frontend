import { useState, useEffect } from 'react';

export interface SessionData {
  session_id: string;
  client_id: string;
  tipo_projeto: string;
}

const SESSION_KEY = 'saacs_session';

export function useSession() {
  const [session, setSession] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      try {
        setSession(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse session:', e);
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const saveSession = (data: SessionData) => {
    setSession(data);
    localStorage.setItem(SESSION_KEY, JSON.stringify(data));
  };

  const clearSession = () => {
    setSession(null);
    localStorage.removeItem(SESSION_KEY);
  };

  return { session, isLoading, saveSession, clearSession };
}
