import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import { useSession } from '../hooks/useSession';

export function TokenValidation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { saveSession } = useSession();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = searchParams.get('access_token');

    if (!accessToken) {
      setError('Token de acesso não fornecido.');
      return;
    }

    (async () => {
      try {
        const result = await api.workspace.validateAccessToken(accessToken);
        saveSession(result);
        navigate('/setup');
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Link expirado ou inválido. Solicite um novo.'
        );
      }
    })();
  }, [searchParams, saveSession, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <h1 className="text-2xl font-bold text-red-700 mb-2">Erro</h1>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.href = 'https://saacs.com.br'}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Voltar para SAACS
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Validando acesso...
            </h1>
            <p className="text-gray-600">
              Por favor, aguarde enquanto configuramos seu workspace.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
