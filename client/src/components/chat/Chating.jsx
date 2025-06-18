import React, { useState, useEffect, useRef } from 'react';
import useChat from '../../store/slices/useChat';

const Chating = ({ userId, targetId,classes }) => {
  const messagesEndRef = useRef(null);
  const { messages, sendMessage, loadChatHistory,loading } = useChat(userId);
  const [input, setInput] = useState("");
   useEffect(() => {
    if (targetId) loadChatHistory(targetId); // 👈 Correct usage
  }, [targetId]);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(targetId, input); // 👈 Send to the right person
      setInput("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
  <div className={`bg-white border rounded-lg shadow-lg flex flex-col h-[80vh] ${classes || 'w-full max-w-md'}`}>
        <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-lg font-bold">Message to {targetId==="admin"?"RovoBit":"User"}</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
        {!loading && messages.length === 0 && (
  <div className="text-center py-4 text-gray-500">
    No messages yet. Start the conversation!
  </div>
)}
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg text-sm ${
                msg.senderId === userId
                  ? "bg-blue-100 text-blue-900 self-end"
                  : "bg-gray-200 text-gray-800 self-start"
              }`}
            >
             <p className='text-right'>{ msg.senderId !== userId ? <span className='text-green-500 text-[20px] font-bold'>←</span> : <span className='text-yellow-500 text-[20px] font-bold'>→</span>}</p>
             <p> {msg.text} </p>
             <p className='text-right'> {new Date(msg.timestamp).toLocaleString()}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />

        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 p-3 border-t bg-white"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                handleSend();
              }
            }}
            className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="bg-blue-600 w-[30px] h-[30px] text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={!input.trim()}
          >
            →
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chating;
