'use client'; // Ensure this is a client component

import { useState } from 'react';

export default function RecommendationEngine() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hello! I am your AI assistant. How can I help you today?' },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages([...messages, { from: 'user', text: input }]);
    setInput('');

    // Mock bot response after a short delay
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: 'bot', text: "That's interesting! Let me look into it." },
      ]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      
      <h1 className="text-black text-2xl font-bold mb-6">AI Recommendation Assistant</h1>

      <div className="w-full max-w-3xl bg-white shadow rounded flex flex-col h-[600px]">
        
        {/* Chat Messages */}
        <div className="flex-1 text-black p-4 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg max-w-[70%] ${
                msg.from === 'bot' ? 'bg-gray-200 self-start' : 'bg-blue-500 text-white self-end'
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input Box */}
        <div className="flex p-4 border-t">
          <input
            type="text"
            className="flex-1 text-black border rounded-l px-4 py-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-r"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
