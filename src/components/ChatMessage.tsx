interface ChatMessageProps {
  message: {
    message_type: 'user' | 'assistant';
    content: string;
    created_at: string;
  };
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.message_type === 'user';
  const time = new Date(message.created_at).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs lg:max-w-md xl:max-w-lg ${
          isUser
            ? 'bg-indigo-600 text-white rounded-lg rounded-tr-none'
            : 'bg-gray-200 text-gray-800 rounded-lg rounded-tl-none'
        } p-4`}
      >
        <div className="whitespace-pre-wrap text-sm break-words">{message.content}</div>
        <div
          className={`text-xs mt-2 ${
            isUser ? 'text-indigo-200' : 'text-gray-500'
          }`}
        >
          {time}
        </div>
      </div>
    </div>
  );
}
