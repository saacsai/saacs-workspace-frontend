const API_URL = import.meta.env.VITE_API_URL || 'https://mcp.saacs.com.br';

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

export async function apiCall<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  workspace: {
    validateAccessToken: (accessToken: string) =>
      apiCall<{
        session_id: string;
        client_id: string;
        tipo_projeto: string;
      }>('/api/workspace/validate-access-token', {
        method: 'POST',
        body: JSON.stringify({ access_token: accessToken }),
      }),

    saveApiKey: (sessionId: string, llmProvider: string, apiKey: string) =>
      apiCall<{ success: boolean }>('/api/workspace/save-api-key', {
        method: 'POST',
        body: JSON.stringify({
          session_id: sessionId,
          llm_provider: llmProvider,
          api_key: apiKey,
        }),
      }),

    getQuota: (sessionId: string) =>
      apiCall<{
        projects_created: number;
        projects_quota: number;
        can_create: boolean;
        remaining: number;
      }>(`/api/workspace/quota?session_id=${sessionId}`),
  },

  chat: {
    sendMessage: (sessionId: string, content: string) =>
      apiCall<{
        message_id: string;
        content: string;
        created_at: string;
      }>('/api/chat/message', {
        method: 'POST',
        body: JSON.stringify({ session_id: sessionId, content }),
      }),

    getHistory: (sessionId: string, limit: number = 50) =>
      apiCall<Array<{
        id: string;
        message_type: 'user' | 'assistant';
        content: string;
        created_at: string;
      }>>(`/api/chat/history?session_id=${sessionId}&limit=${limit}`),
  },

  notion: {
    connect: (sessionId: string, code: string) =>
      apiCall<{
        workspace_id: string;
        workspace_name: string;
      }>('/api/notion/connect', {
        method: 'POST',
        body: JSON.stringify({ session_id: sessionId, code }),
      }),
  },
};
