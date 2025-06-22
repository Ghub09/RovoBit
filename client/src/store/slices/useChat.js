  // 📁 useChat.js
  import { useEffect, useRef, useState, useCallback } from "react";
  import { io } from "socket.io-client";

  const socket = io(import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || "http://localhost:5000", {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    withCredentials: true,
    transports: ['websocket', 'polling'], // Try WebSocket first, then polling
    timeout: 10000
  });

  export default function useChat(userId) {
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const messagesRef = useRef(messages);
    // const conversationTargetRef = useRef(null);

    useEffect(() => {
      messagesRef.current = messages;
    }, [messages]);

    // Add function to request specific conversation
  const fetchConversation = useCallback((targetUserId = "admin") => {
  const isRegularUser = userId !== "admin";
  // const actualTargetId = isRegularUser ? "admin" : targetUserId;
  
  socket.emit("get_conversation_history", {
    adminId: isRegularUser ? "admin" : userId,
    userId: isRegularUser ? userId : targetUserId
  });
}, [isConnected, userId]);

    useEffect(() => {
      if (!userId) return;

      socket.connect();
      socket.emit("register", { userId });

      const onConnect = () => setIsConnected(true);
      const onDisconnect = () => setIsConnected(false);
      
      socket.on("connect", onConnect);
      socket.on("disconnect", onDisconnect);

      const handleMessage = (newMessage) => {
        // Handle tempId reconciliation
        if (newMessage.tempId) {
          setMessages(prev => 
            prev.map(msg => 
              msg.tempId === newMessage.tempId 
                ? { ...newMessage, temp: false } 
                : msg
            )
          );
          return;
        }

        // Check for duplicates
        const messageExists = messagesRef.current.some(
          msg => msg._id === newMessage._id
        );
        
        if (!messageExists) {
          setMessages(prev => [...prev, newMessage]);
        }
      };

      const handleMessageError = ({ tempId }) => {
        setMessages(prev => prev.filter(msg => msg.tempId !== tempId));
      };
      
      const handleConversationHistory = (history) => {
        // Replace current messages with conversation history
        setMessages(history);
      };

      socket.on("message", handleMessage);
      socket.on("conversation_history", handleConversationHistory);
      socket.on("message_error", handleMessageError);

      return () => {
        socket.off("message", handleMessage);
        socket.off("conversation_history", handleConversationHistory);
        socket.off("message_error", handleMessageError);
        socket.off("connect", onConnect);
        socket.off("disconnect", onDisconnect);
        
        if (socket.listeners("message").length <= 1) {
          socket.disconnect();
        }
      };
    }, [userId]);

    const sendMessage = (receiverId, text) => {
      if (!text.trim() || !isConnected) return;
      
      const tempId = Date.now().toString();
      
      // Optimistic update with temporary message
      setMessages(prev => [
        ...prev,
        {
          _id: tempId,
          tempId,
          sender: userId,
          receiver: receiverId,
          content: text,
          isAdminMessage: userId === "admin",
          createdAt: new Date().toISOString(),
          temp: true
        }
      ]);
      

      
      // Send to server
      socket.emit("sendMessage", {
        senderId: userId,
        receiverId,
        text,
        tempId
      });
    };

    return { 
      messages, 
      sendMessage, 
      isConnected,
      fetchConversation  // Expose conversation fetcher
    };
  } 