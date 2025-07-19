import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { socketService } from '../services/socket';
import { MessageCircle, Send, X, Minimize2 } from 'lucide-react';
import { toggleChat, setChatOpen } from '../store/chatSlice';

const ChatBox: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, isOpen } = useSelector((state: RootState) => state.chat);
  const { role, studentName } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const socket = socketService.getSocket();
      if (socket) {
        socket.emit('send-message', {
          senderName: role === 'teacher' ? 'Teacher' : studentName,
          senderRole: role,
          message: message.trim()
        });
      }
      setMessage('');
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105"
        >
          <MessageCircle size={24} />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 h-96 flex flex-col">
      {/* Header */}
      <div className="bg-purple-600 text-white p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageCircle size={20} />
            <h3 className="font-semibold">Live Chat</h3>
          </div>
          <button
            onClick={() => setIsMinimized(true)}
            className="text-white hover:bg-purple-700 p-1 rounded transition-colors"
          >
            <Minimize2 size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <MessageCircle size={32} className="mx-auto mb-2 opacity-50" />
            <p>No messages yet</p>
            <p className="text-sm">Start a conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.senderRole === role ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-3 py-2 rounded-lg ${
                  msg.senderRole === role
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-medium opacity-75">
                    {msg.senderName}
                  </span>
                  <span className="text-xs opacity-60">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
                <p className="text-sm">{msg.message}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;