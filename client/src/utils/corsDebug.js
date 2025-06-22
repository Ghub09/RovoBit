/**
 * Utility functions to diagnose CORS issues
 */

/**
 * Tests CORS headers for socket.io endpoints
 * @returns {Promise<Object>} Test results
 */
export const testSocketIOCors = async () => {
  const baseUrl = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || 'https://server-1-nsr1.onrender.com';
  
  const results = {
    debugEndpoint: null,
    optionsRequest: null,
    getRequest: null
  };
  
  // Test the debug endpoint
  try {
    const debugResponse = await fetch(`${baseUrl}/socket.io/debug-cors`, {
      method: 'GET',
      credentials: 'include',
    });
    
    results.debugEndpoint = {
      ok: debugResponse.ok,
      status: debugResponse.status,
      headers: Object.fromEntries([...debugResponse.headers.entries()]),
      data: await debugResponse.json().catch(() => null)
    };
  } catch (error) {
    results.debugEndpoint = {
      ok: false,
      error: error.message
    };
  }
  
  // Test OPTIONS request
  try {
    const optionsResponse = await fetch(`${baseUrl}/socket.io/?EIO=4&transport=polling`, {
      method: 'OPTIONS',
      credentials: 'include',
      headers: {
        'Origin': window.location.origin,
      }
    });
    
    results.optionsRequest = {
      ok: optionsResponse.ok,
      status: optionsResponse.status,
      headers: Object.fromEntries([...optionsResponse.headers.entries()])
    };
  } catch (error) {
    results.optionsRequest = {
      ok: false,
      error: error.message
    };
  }
  
  // Test GET request
  try {
    const getResponse = await fetch(`${baseUrl}/socket.io/?EIO=4&transport=polling`, {
      method: 'GET',
      credentials: 'include',
    });
    
    results.getRequest = {
      ok: getResponse.ok,
      status: getResponse.status,
      headers: Object.fromEntries([...getResponse.headers.entries()]),
      data: await getResponse.text().catch(() => null)
    };
  } catch (error) {
    results.getRequest = {
      ok: false,
      error: error.message
    };
  }
  
  return results;
};

export default testSocketIOCors; 