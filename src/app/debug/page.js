'use client';

import { useState } from 'react';

export default function DebugPage() {
  const [testResult, setTestResult] = useState('');

  const testCookieAuth = () => {
    // Since cookies are httpOnly, we can't access them from JS
    // but we can test if the auth endpoint works
    setTestResult('Testing cookie-based authentication...');
  };

  const testApiCall = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setTestResult(`API call successful: User ${data.user?.username || 'unknown'} is authenticated`);
      } else {
        setTestResult(`API call failed: Status ${response.status}`);
      }
    } catch (error) {
      setTestResult(`API call failed: ${error.message}`);
    }
  };

  const testAuthCall = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setTestResult(`Auth call successful: ${data.user?.username}`);
      } else {
        setTestResult(`Auth call failed: Status ${response.status}`);
      }
    } catch (error) {
      setTestResult(`Auth call failed: ${error.message}`);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Cookie Authentication</h1>
      
      <div className="space-y-4">
        <button 
          onClick={testCookieAuth}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Test Cookie Auth
        </button>
        
        <button 
          onClick={testApiCall}
          className="bg-green-500 text-white px-4 py-2 rounded mr-2"
        >
          Test API Call
        </button>
        
        <button 
          onClick={testAuthCall}
          className="bg-red-500 text-white px-4 py-2 rounded mr-2"
        >
          Test Auth Call
        </button>
      </div>
      
      <pre className="mt-4 bg-gray-100 p-4 rounded">
        {testResult}
      </pre>
    </div>
  );
}
