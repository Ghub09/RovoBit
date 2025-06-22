import axios from 'axios';
import { io } from 'socket.io-client';

/**
 * Test connection to backend API and WebSocket
 * @returns {Promise<Object>} Results of connection tests
 */
export const testBackendConnections = async () => {
  const results = {
    api: { success: false, error: null },
    socket: { success: false, error: null },
    cookies: { success: false, error: null }
  };

  // Test API connection
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'https://server-1-nsr1.onrender.com/api';
    const response = await axios.get(`${apiUrl}/`, { 
      withCredentials: true,
      timeout: 5000
    });
    results.api = { 
      success: true, 
      data: response.data,
      url: apiUrl
    };
  } catch (error) {
    results.api = { 
      success: false, 
      error: error.message,
      url: import.meta.env.VITE_API_URL || 'https://server-1-nsr1.onrender.com/api'
    };
  }

  // Test Socket connection
  try {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';
    let socketConnected = false;
    
    const socket = io(socketUrl, {
      autoConnect: true,
      reconnection: false,
      timeout: 5000,
      withCredentials: true
    });

    await new Promise((resolve) => {
      socket.on('connect', () => {
        socketConnected = true;
        socket.disconnect();
        resolve();
      });

      socket.on('connect_error', (error) => {
        results.socket.error = error.message;
        resolve();
      });

      // Timeout after 5 seconds
      setTimeout(resolve, 5000);
    });

    results.socket = { 
      success: socketConnected, 
      url: socketUrl
    };
  } catch (error) {
    results.socket = { 
      success: false, 
      error: error.message,
      url: import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL
    };
  }

  // Test cookie functionality
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'https://server-1-nsr1.onrender.com/api';
    // Try to get a test cookie
    const cookieResponse = await axios.get(`${apiUrl}/user/test-cookie`, { 
      withCredentials: true,
      timeout: 5000
    });
    results.cookies = { 
      success: cookieResponse.data.cookieSet || false, 
      data: cookieResponse.data
    };
  } catch (error) {
    results.cookies = { 
      success: false, 
      error: error.message
    };
  }

  return results;
};

export default testBackendConnections; 