import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../hooks/useSession';
import { APIKeyForm } from '../components/APIKeyForm';
import { NotionConnect } from '../components/NotionConnect';

export function Setup() {
  const navigate = useNavigate();
  const { session } = useSession();
  const [step, setStep] = useState<'api-key' | 'notion'>('api-key');
  const [apiKeySaved, setApiKeySaved] = useState(false);
  const [notionConnected, setNotionConnected] = useState(false);

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Redirecionando...</p>
        </div>
      </div>
    );
  }

  const canContinue = apiKeySaved && notionConnected;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Bem-vindo ao SAACS
          </h1>
          <p className="text-gray-600 mb-8">
            Projeto: <span className="font-semibold capitalize">{session.tipo_projeto}</span>
          </p>

          <div className="space-y-8">
            <div>
              <div className="flex items-center mb-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                    apiKeySaved ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                >
                  1
                </div>
                <h2 className="text-xl font-semibold text-gray-800 ml-3">
                  Configurar API Key
                </h2>
                {apiKeySaved && <span className="text-green-500 ml-2">✓</span>}
              </div>
              {step === 'api-key' && (
                <APIKeyForm
                  sessionId={session.session_id}
                  onSuccess={() => {
                    setApiKeySaved(true);
                    setStep('notion');
                  }}
                />
              )}
              {apiKeySaved && step !== 'api-key' && (
                <p className="text-green-600 text-sm">API key configurada com sucesso</p>
              )}
            </div>

            <div>
              <div className="flex items-center mb-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                    notionConnected ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  2
                </div>
                <h2 className="text-xl font-semibold text-gray-800 ml-3">
                  Conectar Notion
                </h2>
                {notionConnected && <span className="text-green-500 ml-2">✓</span>}
              </div>
              {step === 'notion' && (
                <NotionConnect
                  sessionId={session.session_id}
                  onSuccess={() => setNotionConnected(true)}
                />
              )}
              {notionConnected && step !== 'notion' && (
                <p className="text-green-600 text-sm">Notion conectado com sucesso</p>
              )}
            </div>
          </div>

          <div className="mt-12 flex gap-4">
            <button
              onClick={() => {
                if (step === 'notion') setStep('api-key');
              }}
              disabled={step === 'api-key'}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Voltar
            </button>
            <button
              onClick={() => navigate('/chat')}
              disabled={!canContinue}
              className="ml-auto px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              Entrar no Workspace
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
