import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api/client';

interface NotionConnectProps {
  sessionId: string;
  onSuccess: () => void;
}

const NOTION_CLIENT_ID = import.meta.env.VITE_NOTION_CLIENT_ID || '';
const NOTION_REDIRECT_URI = `${window.location.origin}/setup`;

export function NotionConnect({ sessionId, onSuccess }: NotionConnectProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      (async () => {
        setLoading(true);
        try {
          await api.notion.connect(sessionId, code);
          setConnected(true);
          setSearchParams({});
          onSuccess();
        } catch (err) {
          setError(
            err instanceof Error ? err.message : 'Erro ao conectar Notion'
          );
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [searchParams, sessionId, onSuccess, setSearchParams]);

  const handleConnectNotion = () => {
    if (!NOTION_CLIENT_ID) {
      setError('Notion não está configurado. Entre em contato com o administrador.');
      return;
    }

    const authUrl = new URL('https://api.notion.com/v1/oauth/authorize');
    authUrl.searchParams.set('client_id', NOTION_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', NOTION_REDIRECT_URI);
    authUrl.searchParams.set('response_type', 'code');

    window.location.href = authUrl.toString();
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      {connected ? (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 font-semibold">✓ Notion Conectado</p>
          <p className="text-sm text-green-600 mt-1">
            Seu workspace Notion está sincronizado com SAACS
          </p>
        </div>
      ) : loading ? (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-700">Conectando ao Notion...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-700">
            Conecte seu workspace Notion ao SAACS para sincronizar seus projetos automaticamente.
          </p>
          <button
            onClick={handleConnectNotion}
            disabled={!NOTION_CLIENT_ID}
            className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            🔗 Conectar ao Notion
          </button>
        </>
      )}
    </div>
  );
}
