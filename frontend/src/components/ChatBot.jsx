import React, { useState, useRef, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import { backendUrl } from '../App';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: 'Hi! How can I help you today?', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    try {
      const res = await fetch(`${backendUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      const botTextMsg = { text: data.reply, sender: 'bot' };
      const botMsgs = [botTextMsg];

      if (data.product) {
        botMsgs.push({
          sender: 'bot',
          type: 'product',
          product: data.product,
        });
      }

      setMessages(prev => [...prev, ...botMsgs]);
    } catch (err) {
      console.error('Chat fetch error:', err);
      setMessages(prev => [...prev, { text: 'Server error. Try again.', sender: 'bot' }]);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="fixed bottom-5 cursor-pointer right-5 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all z-50"
      >
        💬
      </button>

      {/* Chatbox */}
      {isOpen && (
        <div className="fixed bottom-20 right-5 w-80 bg-white rounded-xl shadow-lg border border-gray-300 flex flex-col z-50 animate-fadeInUp">
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 bg-blue-600 text-white rounded-t-xl">
            <span className="font-semibold">Support Chat</span>
            <button className='cursor-pointer' onClick={() => setIsOpen(false)}>
              <IoMdClose size={20} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="p-4 h-64 overflow-y-auto text-sm space-y-2 bg-gray-50 scroll-smooth">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`rounded-md max-w-[80%] w-[fit-content] px-3 py-2 ${
                  msg.sender === 'user'
                    ? 'bg-blue-100 ml-auto text-right'
                    : 'bg-gray-200 text-left'
                }`}
              >
                {msg.type === 'product' ? (
                  <div>
                    <img
                      src={msg.product.image}
                      alt={msg.product.name}
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                    <p className="font-semibold">{msg.product.name}</p>
                    <p className="text-sm text-gray-700">Price: Rs.{msg.product.price}</p>
                    <a
                      href={`/product/${msg.product._id}`}
                      className="text-blue-500 underline text-sm mt-1 inline-block"
                    >
                      View Product
                    </a>
                  </div>
                ) : (
                  <span>{msg.text}</span>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex items-center border-t border-gray-200 px-2 py-2">
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              className="flex-grow px-3 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleSend}
              className="ml-2 bg-blue-500 text-white px-4 py-2 cursor-pointer rounded-full hover:bg-blue-600 transition"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
