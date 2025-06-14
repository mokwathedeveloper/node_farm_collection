import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function AuthDebug() {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  
  const localStorageUser = localStorage.getItem('userInfo') 
    ? JSON.parse(localStorage.getItem('userInfo')) 
    : null;
  
  return (
    <div className="fixed bottom-0 right-0 bg-gray-800 text-white p-4 m-4 rounded opacity-75 hover:opacity-100">
      <h3 className="font-bold">Auth Debug</h3>
      <p>Redux userInfo: {userInfo ? '✅' : '❌'}</p>
      <p>localStorage userInfo: {localStorageUser ? '✅' : '❌'}</p>
      <div className="mt-2">
        <button 
          onClick={() => navigate('/')}
          className="bg-green-600 text-white px-2 py-1 rounded text-sm mr-2"
        >
          Go Home
        </button>
        <button 
          onClick={() => window.location.href = '/'}
          className="bg-blue-600 text-white px-2 py-1 rounded text-sm"
        >
          Force Home
        </button>
      </div>
    </div>
  );
}

export default AuthDebug;