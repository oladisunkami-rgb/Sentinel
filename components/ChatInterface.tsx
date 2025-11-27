import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading }) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 bg-gray-900 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-crypto-blue to-crypto-purple flex items-center justify-center shadow-lg shadow-purple-900/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </div>
          <div>
            <h3 className="font-bold text-white">Sentinel AI</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs text-green-400 font-medium tracking-wide">ONLINE & MONITORING</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-950/50">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40 p-8">
            <svg className="w-16 h-16 mb-4 text-crypto-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            <p className="text-sm font-medium">Monitoring 5 Technical Signals & Live News.</p>
            <p className="text-xs mt-2">Ask about risk levels, signal divergence, or safe entry points.</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
              msg.role === 'user' 
                ? 'bg-crypto-blue text-white rounded-br-none' 
                : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-bl-none shadow-lg'
            }`}>
               <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
              <div className={`text-[10px] mt-2 opacity-50 ${msg.role === 'user' ? 'text-blue-100 text-right' : 'text-gray-400'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 rounded-2xl rounded-bl-none px-4 py-4 border border-gray-700">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-crypto-purple rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-crypto-purple rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-crypto-purple rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-gray-900 border-t border-gray-800">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about risk, signals, or market sentiment..."
            className="w-full bg-gray-950 text-white rounded-xl pl-4 pr-12 py-3 border border-gray-800 focus:border-crypto-blue focus:ring-1 focus:ring-crypto-blue outline-none transition-all placeholder-gray-600"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={!inputValue.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-crypto-blue text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
        </form>
        <div className="flex justify-center mt-2 gap-4">
          <button 
            onClick={() => onSendMessage("What is the current risk level?")} 
            className="text-xs text-gray-500 hover:text-crypto-blue transition-colors"
          >
            "Risk Level?"
          </button>
          <button 
             onClick={() => onSendMessage("Should I buy or sell right now based on signals?")} 
             className="text-xs text-gray-500 hover:text-crypto-blue transition-colors"
          >
            "Buy or Sell?"
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
