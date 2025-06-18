// useChat.js
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function useChat(userId) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.emit("register", { userId });

    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);


  const [loading, setLoading] = useState(true);

 
  const loadChatHistory = (targetUserId, callback) => {
    setLoading(true);

    socket.emit("getChatHistory", { senderId: userId, receiverId: targetUserId }, (msgs) => {
      setMessages(msgs);
      setLoading(false);

      if (callback) callback(msgs);
    });
  };
  const sendMessage = (receiverId, text) => {
    socket.emit("sendMessage", {
      senderId: userId,
      receiverId,
      text,
    });
  };

  return { messages, sendMessage, loadChatHistory,loading };
}
