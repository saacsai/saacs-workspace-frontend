import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../hooks/useSession';
import { api } from '../api/client';
import { ChatMessage } from '../components/ChatMessage';
import { ChatInput } from '../components/ChatInput';

interface Message {
  id: string;
  message_type: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export function Chat() {
  const navigate = useNavigate();
  const { session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!session) {
      navigate('/');
      return;
    }

    (async () => {
      try {
        const history = await api.chat.getHistory(session.session_id);
        if (history.length === 0) {
          setMessages([
            {
              id: 'intro',
              message_type: 'assistant',
              content: `Olá! Sou seu assistente de IA aqui no SAACS.\n\nVamos estruturar seu projeto ${session.tipo_projeto} juntos. Como posso ajudar você hoje?\n\n**Você pode:**\n- Descrever seu projeto\n- Fazer perguntas sobre a metodologia TILAPIA\n- Pedir ajuda para validar ideias\n- Gerar cronogramas e documentos`,
              created_at: new Date().toISOString(),
            },
          ]);
        } else {
          setMessages(history);
        }
      } catch (err) {
        console.error('Failed to load chat history:', err);
      }
    })();
  }, [session, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!session || !content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      message_type: 'user',
      content,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await api.chat.sendMessage(session.session_id, content);
      const assistantMessage: Message = {
        id: response.message_id,
        message_type: 'assistant',
        content: response.content,
        created_at: response.created_at,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) return null;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-gray-900 text-white transition-all duration-300 overflow-hidden`}
      >
        <div className="p-4 space-y-4">
          <h3 className="font-semibold text-lg">Projeto</h3>
          <div className="text-sm text-gray-300">
            <p className="mb-2">
              Tipo: <span className="font-semibold capitalize">{session.tipo_projeto}</span>
            </p>
            <p>Projeto ID: {session.client_id.slice(0, 8)}...</p>
          </div>

          <hr className="border-gray-700" />

          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 hover:bg-gray-800 rounded">
              📝 Novo Projeto
            </button>
            <button className="w-full text-left px-3 py-2 hover:bg-gray-800 rounded">
              🔗 Abrir Notion
            </button>
            <button className="w-full text-left px-3 py-2 hover:bg-gray-800 rounded">
              ⚙️ Configurações
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded"
          >
            ☰
          </button>
          <h1 className="text-xl font-semibold text-gray-800">SAACS Workspace</h1>
          <div className="text-sm text-gray-600">
            Tipo: <span className="font-semibold capitalize">{session.tipo_projeto}</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 rounded-lg p-4 max-w-xs">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce animation-delay-200"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce animation-delay-400"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
}
