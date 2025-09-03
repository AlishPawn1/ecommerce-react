import React, { useState, useRef, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { backendUrl } from "../App";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hi! How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isBotTyping) return;

    const userMsg = { text: input, sender: "user", timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsBotTyping(true);

    try {
      const res = await fetch(`${backendUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      const botTextMsg = {
        text: data.reply,
        sender: "bot",
        timestamp: new Date(),
      };
      const botMsgs = [botTextMsg];

      if (data.product) {
        botMsgs.push({
          sender: "bot",
          type: "product",
          product: data.product,
          timestamp: new Date(),
        });
      }

      setMessages((prev) => [...prev, ...botMsgs]);
    } catch (err) {
      console.error("Chat fetch error:", err);
      setMessages((prev) => [
        ...prev,
        {
          text: "Server error. Try again.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsBotTyping(false);
    }
  };

  // Format timestamp as HH:MM
  const formatTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-5 cursor-pointer right-5 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all z-50"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        💬
      </button>

      {/* Chatbox */}
      {isOpen && (
        <div className="fixed bottom-20 right-5 w-82 bg-white rounded-xl shadow-lg border border-gray-300 flex flex-col z-50 animate-fadeInUp">
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 bg-blue-600 text-white rounded-t-xl">
            <span className="font-semibold">Support Chat</span>
            <button
              className="cursor-pointer"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <IoMdClose size={20} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="p-4 h-64 overflow-y-auto text-sm space-y-2 bg-gray-50 scroll-smooth">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-end gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "bot" && (
                  <FaUserCircle
                    className="text-2xl text-blue-400 flex-shrink-0"
                    title="Bot"
                  />
                )}
                <div
                  className={`rounded-2xl px-4 py-2 max-w-[75%] w-fit shadow-md relative transition-all duration-200
                    ${msg.sender === "user" ? "bg-blue-500 text-white ml-auto" : "bg-white text-gray-800"}`}
                  tabIndex={0}
                  aria-label={
                    msg.sender === "user" ? "Your message" : "Bot message"
                  }
                >
                  {msg.type === "product" ? (
                    <div>
                      <img
                        src={msg.product.image}
                        alt={msg.product.name}
                        className="w-full h-32 object-cover rounded mb-2"
                      />
                      <p className="font-semibold">{msg.product.name}</p>
                      <p className="text-sm text-gray-700">
                        Price: Rs.{msg.product.price}
                      </p>
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
                  <span
                    className={`block text-[10px] mt-1 text-right ${msg.sender === "user" ? "text-white" : "text-gray"}`}
                  >
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
                {msg.sender === "user" && (
                  <FaUserCircle
                    className="text-2xl text-gray-400 flex-shrink-0"
                    title="You"
                  />
                )}
              </div>
            ))}
            {isBotTyping && (
              <div className="flex items-end gap-2 justify-start animate-pulse">
                <FaUserCircle
                  className="text-2xl text-blue-400 flex-shrink-0"
                  title="Bot"
                />
                <div className="rounded-2xl px-4 py-2 max-w-[75%] w-fit bg-white text-gray-800 shadow-md">
                  <span className="italic text-gray-400">Bot is typing...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex items-center border-t border-gray-200 px-2 py-2 bg-white">
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                (e.key === "Enter" && !e.shiftKey ? handleSend() : null) ||
                (e.ctrlKey && e.key === "Enter" ? handleSend() : null)
              }
              className="flex-grow px-3 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              maxLength={300}
              aria-label="Type your message"
              disabled={isBotTyping}
            />
            <button
              onClick={handleSend}
              className={`ml-2 bg-blue-500 text-white px-4 py-2 cursor-pointer rounded-full hover:bg-blue-600 transition flex items-center ${isBotTyping ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={isBotTyping || !input.trim()}
              aria-disabled={isBotTyping || !input.trim()}
              aria-label="Send message"
            >
              {isBotTyping ? (
                <svg
                  className="animate-spin h-5 w-5 mr-1 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
              ) : (
                "Send"
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
