import { useState } from 'react';
import { api } from '../api/client';

interface APIKeyFormProps {
  sessionId: string;
  onSuccess: () => void;
}

export function APIKeyForm({ sessionId, onSuccess }: APIKeyFormProps) {
  const [provider, setProvider] = useState<'claude' | 'openai' | 'gemini'>('claude');
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleTest = async () => {
    if (!apiKey.trim()) {
      setError('API key é obrigatória');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.workspace.saveApiKey(sessionId, provider, apiKey);
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Erro ao testar API key'
      );
    } finally {
      setLoading(false);
    }
  };

  const providers = [
    { value: 'claude', label: 'Claude (Anthropic)', link: 'https://console.anthropic.com' },
    { value: 'openai', label: 'OpenAI (GPT-4)', link: 'https://platform.openai.com' },
    { value: 'gemini', label: 'Google Gemini', link: 'https://makersuite.google.com' },
  ];

  const selectedProvider = providers.find((p) => p.value === provider);

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Selecione seu provedor de IA
        </label>
        <select
          value={provider}
          onChange={(e) => setProvider(e.target.value as any)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {providers.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-2">
          Não tem uma API key?{' '}
          <a
            href={selectedProvider?.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:underline"
          >
            Crie uma aqui
          </a>
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          API Key
        </label>
        <div className="relative">
          <input
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-ant-... ou sk-..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={loading || success}
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-2.5 text-gray-600 hover:text-gray-800"
          >
            {showKey ? '🙈' : '👁️'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
          ✓ API key validada com sucesso!
        </div>
      )}

      <button
        onClick={handleTest}
        disabled={loading || success || !apiKey.trim()}
        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Testando...' : success ? '✓ Confirmado' : 'Testar API Key'}
      </button>
    </div>
  );
}
