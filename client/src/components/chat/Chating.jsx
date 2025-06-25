import React, { useState, useEffect, useRef } from 'react';
import useChat from '../../store/slices/useChat';
import { FaPaperPlane, FaCircle } from 'react-icons/fa';
import { Spinner } from '@material-tailwind/react';

const Chating = ({ userId, targetId, classes }) => {
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [input, setInput] = useState("");
  const { messages, sendMessage, isConnected, fetchConversation } = useChat(userId);

  const conversation = messages.filter(msg =>
    (msg.sender === userId && msg.receiver === targetId) ||
    (msg.sender === targetId && msg.receiver === userId)
  );

  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;
    if (targetId === "admin") {
      fetchConversation();
    }
    const isNearBottom =
      container.scrollHeight - container.scrollTop <= container.clientHeight + 100;

    if (isNearBottom) {
      const behavior = container.scrollHeight - container.scrollTop === container.clientHeight
        ? 'auto'
        : 'smooth';

      container.scrollTo({
        top: container.scrollHeight,
        behavior
      });
    }
  }, [conversation.length]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, []);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(targetId, input);
      setInput("");
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Karachi'
    });
  };

  return (
    <div className="min-h-screen  overflow-hidden ">
      <div className={`   shadow-lg flex flex-col justify-between h-[80vh] ${classes || 'w-full max-w-md '}`}>
        <div className="bg-blue-600 text-white p-4  flex justify-between items-center">
          <h2 className="text-lg font-bold">
            {targetId === "admin"
              ? "Chat with UfxBit Support"
              : `Chat with User ${targetId.slice(0, 5)}`}
          </h2>
          <div className="flex items-center gap-2">
            <FaCircle className={isConnected ? "text-green-400" : "text-gray-400"} />
            <span className="text-sm">{isConnected ? "Online" : "Offline"}</span>
          </div>
        </div>

        <div
          ref={chatContainerRef}
          className=" overflow-y-auto p-4 space-y-3 "
        >
          {conversation.length === 0 ? (
            <div className=" flex flex-col items-center justify-center text-gray-500">
              <div className="text-center mb-4">
                <div className="bg-gray-700 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-2" />
                <h3 className="font-medium text-white">No messages yet</h3>
                <p className="text-sm mt-1 text-gray-400">
                  {targetId === "admin"
                    ? "Send a message to our support team"
                    : "Send a message to this user"}
                </p>
              </div>
            </div>
          ) : (
            conversation.map((msg) => (
              <div
                key={msg._id || msg.tempId}
                className={`p-3 rounded-lg max-w-[80%] text-white text-sm ${
                  msg.sender === userId
                    ? "bg-blue-600 ml-auto"
                    : "bg-green-700"
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold">
                    {msg.sender === userId ? "You" :
                      targetId === "admin" ? "UfxBit Support" : "User"}
                  </span>
                  <span className="text-xs text-gray-300">
                    {formatTime(msg.createdAt || Date.now())}
                  </span>
                </div>
                <p className="text-white">{msg.content}</p>

                {msg.temp && (
                  <div className="text-right mt-1">
                    <span className="text-xs text-gray-300 italic">Sending...</span>
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 p-3 border border-gray-700"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="flex-1 px-3 py-2 rounded-lg text-sm text-white bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type a message..."
            disabled={!isConnected}
          />
          <button
            type="submit"
            className={`p-2 rounded-lg ${
              isConnected
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-600 text-gray-300 cursor-not-allowed"
            }`}
            disabled={!input.trim() || !isConnected}
          >
            {isConnected ? <FaPaperPlane /> : <Spinner className="h-4 w-4" />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chating;