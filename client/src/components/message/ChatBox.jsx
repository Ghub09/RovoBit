import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); 

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  useEffect(() => {
    if (!userId) return;

    // Register socket events
    socket.on("connect", () => {
      console.log("🟢 Connected:", socket.id);
    });

    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
      console.log(data)
    });

    return () => {
      socket.off("receive_message");
      socket.off("connect");
    };
  }, [userId]);

  const handleSend = () => {
    if (message.trim()) {
      const newMessage = {
        userId,
        message,
        timestamp: new Date().toISOString(),
      };
      socket.emit("send_message", newMessage);
      setMessages((prev) => [...prev, newMessage]); // Optional: show message instantly
      setMessage("");
    }
  };

  return (
    <div className=" h-full flex justify-center items-center">
      <div className="w-[100%] h-96 bg-white border rounded-lg shadow-lg flex flex-col justify-between">
        <div>
          <p className="p-3 border-b font-semibold text-gray-800">Contact Admin</p>
          <div className="p-3 overflow-y-auto text-gray-700 text-sm h-[220px]">
            {messages.map((msg, index) => (
              <div key={index} className="mb-2 border rounded-[15px] p-2 bg-gray-100">
                <p className="flex flex-col">
                  <span>{msg.message}</span>
                  <span className="ml-2 text-end text-gray-500 text-sm">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="p-3 border-t flex items-center gap-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="p-2 border rounded w-full text-sm text-gray-700 resize-none h-16"
          />
          <button onClick={handleSend} className="w-10 h-10 rounded-full text-lg">
            📩
          </button>
        </div>
      </div>
    </div>
  );
};
export default ChatBox;