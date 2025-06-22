import React, { useState, useEffect } from 'react';
import { testBackendConnections } from '../../utils/connectionTest';
import { testSocketIOCors } from '../../utils/corsDebug';

const ConnectionDiagnostic = () => {
  const [results, setResults] = useState(null);
  const [corsResults, setCorsResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [testType, setTestType] = useState('basic'); // 'basic' or 'cors'

  const runDiagnostic = async () => {
    setLoading(true);
    setError(null);
    try {
      if (testType === 'basic') {
        const diagnosticResults = await testBackendConnections();
        setResults(diagnosticResults);
      } else if (testType === 'cors') {
        const corsTestResults = await testSocketIOCors();
        setCorsResults(corsTestResults);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Connection Diagnostic</h2>
      
      <div className="mb-4">
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setTestType('basic')}
            className={`px-4 py-2 rounded-md ${testType === 'basic' ? 'bg-blue-600' : 'bg-gray-600'}`}
          >
            Basic Tests
          </button>
          <button
            onClick={() => setTestType('cors')}
            className={`px-4 py-2 rounded-md ${testType === 'cors' ? 'bg-blue-600' : 'bg-gray-600'}`}
          >
            CORS Tests
          </button>
        </div>

        <button
          onClick={runDiagnostic}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md mb-4 disabled:opacity-50"
        >
          {loading ? 'Running Tests...' : `Run ${testType === 'basic' ? 'Connection' : 'CORS'} Tests`}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-600 text-white p-3 rounded-md mb-4">
          Error: {error}
        </div>
      )}
      
      {results && testType === 'basic' && (
        <div className="space-y-4">
          {/* API Test Results */}
          <div className={`p-3 rounded-md ${results.api.success ? 'bg-green-700' : 'bg-red-700'}`}>
            <h3 className="font-semibold mb-1">
              API Connection: {results.api.success ? 'Success ✅' : 'Failed ❌'}
            </h3>
            <p className="text-sm mb-1">URL: {results.api.url}</p>
            {results.api.error && <p className="text-sm text-red-300">Error: {results.api.error}</p>}
            {results.api.data && (
              <pre className="text-xs bg-gray-900 p-2 rounded mt-2 overflow-auto max-h-20">
                {JSON.stringify(results.api.data, null, 2)}
              </pre>
            )}
          </div>
          
          {/* Socket Test Results */}
          <div className={`p-3 rounded-md ${results.socket.success ? 'bg-green-700' : 'bg-red-700'}`}>
            <h3 className="font-semibold mb-1">
              Socket Connection: {results.socket.success ? 'Success ✅' : 'Failed ❌'}
            </h3>
            <p className="text-sm mb-1">URL: {results.socket.url}</p>
            {results.socket.error && (
              <p className="text-sm text-red-300">Error: {results.socket.error}</p>
            )}
          </div>
          
          {/* Cookie Test Results */}
          <div className={`p-3 rounded-md ${results.cookies.success ? 'bg-green-700' : 'bg-red-700'}`}>
            <h3 className="font-semibold mb-1">
              Cookie Functionality: {results.cookies.success ? 'Success ✅' : 'Failed ❌'}
            </h3>
            {results.cookies.error && (
              <p className="text-sm text-red-300">Error: {results.cookies.error}</p>
            )}
            {results.cookies.data && (
              <div className="text-sm mt-1">
                <p>Environment: {results.cookies.data.environment}</p>
                <p>Existing Cookies: {results.cookies.data.existingCookies?.join(', ') || 'None'}</p>
              </div>
            )}
          </div>
          
          <div className="bg-gray-700 p-3 rounded-md text-sm">
            <h3 className="font-semibold mb-2">Recommendation:</h3>
            {!results.api.success && (
              <p className="mb-1">• API connection failed. Check your VITE_API_URL in .env file and ensure the backend server is running.</p>
            )}
            {!results.socket.success && (
              <p className="mb-1">• Socket connection failed. Check your VITE_SOCKET_URL in .env file and ensure the socket server is running.</p>
            )}
            {!results.cookies.success && (
              <p className="mb-1">• Cookie functionality failed. This may be due to CORS issues or browser settings.</p>
            )}
            {results.api.success && results.socket.success && results.cookies.success && (
              <p className="text-green-400">All tests passed! Your connection setup looks good.</p>
            )}
          </div>
        </div>
      )}

      {corsResults && testType === 'cors' && (
        <div className="space-y-4">
          {/* Debug Endpoint Results */}
          <div className={`p-3 rounded-md ${corsResults.debugEndpoint?.ok ? 'bg-green-700' : 'bg-red-700'}`}>
            <h3 className="font-semibold mb-1">
              Debug Endpoint: {corsResults.debugEndpoint?.ok ? 'Success ✅' : 'Failed ❌'}
            </h3>
            {corsResults.debugEndpoint?.error && (
              <p className="text-sm text-red-300">Error: {corsResults.debugEndpoint.error}</p>
            )}
            {corsResults.debugEndpoint?.status && (
              <p className="text-sm">Status: {corsResults.debugEndpoint.status}</p>
            )}
            <div className="mt-2">
              <h4 className="text-sm font-semibold">Response Headers:</h4>
              <pre className="text-xs bg-gray-900 p-2 rounded mt-1 overflow-auto max-h-20">
                {JSON.stringify(corsResults.debugEndpoint?.headers, null, 2)}
              </pre>
            </div>
            {corsResults.debugEndpoint?.data && (
              <div className="mt-2">
                <h4 className="text-sm font-semibold">Response Data:</h4>
                <pre className="text-xs bg-gray-900 p-2 rounded mt-1 overflow-auto max-h-40">
                  {JSON.stringify(corsResults.debugEndpoint.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
          
          {/* OPTIONS Request Results */}
          <div className={`p-3 rounded-md ${corsResults.optionsRequest?.ok ? 'bg-green-700' : 'bg-red-700'}`}>
            <h3 className="font-semibold mb-1">
              OPTIONS Request: {corsResults.optionsRequest?.ok ? 'Success ✅' : 'Failed ❌'}
            </h3>
            {corsResults.optionsRequest?.error && (
              <p className="text-sm text-red-300">Error: {corsResults.optionsRequest.error}</p>
            )}
            {corsResults.optionsRequest?.status && (
              <p className="text-sm">Status: {corsResults.optionsRequest.status}</p>
            )}
            <div className="mt-2">
              <h4 className="text-sm font-semibold">Response Headers:</h4>
              <pre className="text-xs bg-gray-900 p-2 rounded mt-1 overflow-auto max-h-40">
                {JSON.stringify(corsResults.optionsRequest?.headers, null, 2)}
              </pre>
            </div>
          </div>
          
          {/* GET Request Results */}
          <div className={`p-3 rounded-md ${corsResults.getRequest?.ok ? 'bg-green-700' : 'bg-red-700'}`}>
            <h3 className="font-semibold mb-1">
              GET Socket.IO Request: {corsResults.getRequest?.ok ? 'Success ✅' : 'Failed ❌'}
            </h3>
            {corsResults.getRequest?.error && (
              <p className="text-sm text-red-300">Error: {corsResults.getRequest.error}</p>
            )}
            {corsResults.getRequest?.status && (
              <p className="text-sm">Status: {corsResults.getRequest.status}</p>
            )}
            <div className="mt-2">
              <h4 className="text-sm font-semibold">Response Headers:</h4>
              <pre className="text-xs bg-gray-900 p-2 rounded mt-1 overflow-auto max-h-40">
                {JSON.stringify(corsResults.getRequest?.headers, null, 2)}
              </pre>
            </div>
            {corsResults.getRequest?.data && (
              <div className="mt-2">
                <h4 className="text-sm font-semibold">Response Data Preview:</h4>
                <pre className="text-xs bg-gray-900 p-2 rounded mt-1 overflow-auto max-h-20">
                  {corsResults.getRequest.data.substring(0, 200)}...
                </pre>
              </div>
            )}
          </div>
          
          <div className="bg-gray-700 p-3 rounded-md text-sm">
            <h3 className="font-semibold mb-2">CORS Diagnosis:</h3>
            {(!corsResults.debugEndpoint?.ok || !corsResults.optionsRequest?.ok || !corsResults.getRequest?.ok) && (
              <>
                <p className="mb-1">CORS issues detected:</p>
                <ul className="list-disc pl-5 space-y-1">
                  {!corsResults.debugEndpoint?.ok && (
                    <li>Debug endpoint not accessible - Check server CORS configuration</li>
                  )}
                  {!corsResults.optionsRequest?.ok && (
                    <li>OPTIONS preflight request failing - Check server CORS headers</li>
                  )}
                  {!corsResults.getRequest?.ok && (
                    <li>Socket.IO GET request failing - Check Socket.IO CORS configuration</li>
                  )}
                </ul>
                <p className="mt-2">Verify that your server includes proper CORS headers for {window.location.origin}</p>
              </>
            )}
            {corsResults.debugEndpoint?.ok && corsResults.optionsRequest?.ok && corsResults.getRequest?.ok && (
              <p className="text-green-400">CORS appears to be correctly configured!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionDiagnostic; 