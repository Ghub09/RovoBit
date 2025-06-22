import { io } from 'socket.io-client';

/**
 * Creates a configured socket.io client instance with consistent options
 * @param {Object} options - Custom socket options
 * @returns {SocketIOClient.Socket} Socket.io client instance
 */
export const createSocket = (options = {}) => {
  const socketUrl = import.meta.env.VITE_SOCKET_URL || 
                    import.meta.env.VITE_API_URL || 
                    'https://server-1-nsr1.onrender.com';

  const socketOptions = {
    withCredentials: true,
    transports: ['websocket', 'polling'],
    reconnectionAttempts: 3,
    reconnectionDelay: 1000,
    autoConnect: false,
    timeout: 10000,
    ...options
  };

  const socket = io(socketUrl, socketOptions);
  
  // Add common event handlers
  socket.on('connect_error', (error) => {
    console.log(`Socket connection error: ${error.message}`);
  });
  
  socket.on('error', (error) => {
    console.log(`Socket error: ${error}`);
  });

  // Return the socket
  return socket;
};

export default createSocket; 