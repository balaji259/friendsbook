import { useLocation } from 'react-router-dom';
import { useSocket } from "./useSocket";
import api from '../api/api';
import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { AuthContext } from './AuthContext';


const EnterKey = () => {
    const location = useLocation();
    const [friendsbookKey, setFriendsbookKey] = useState('');
    const [email, setEmail] = useState(location.state?.email || '');
    const { user, setUser, socket, connectSocket } = useSocket();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { token, authuser, setToken, setAuthUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleKeyChange = (e) => {
        // Allow all characters (letters, numbers, special characters)
        const value = e.target.value;
        setFriendsbookKey(value);
        
        // Clear error when user types
        if (error) setError('');
    };

    const handleKeySubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const keyData = { email, friendsbookKey };

        try {
            const res = await api.post('/auth/verify-key', keyData);

            const data = res.data;

            if (res.status === 200) {
                const token = data.token;
                setToken(token);
                setAuthUser(data.payload);
                setUser(data.payload);
                
                toast.success('Login Successful', { duration: 2000 });
                
                setTimeout(() => {
                    connectSocket();  // Call connectSocket after login success
                    navigate('/home');  // Navigate to home page after successful login
                }, 1000);
            }
        } catch (error) {
            setError('Invalid Friendsbook Key');
            toast.error('Invalid Friendsbook Key');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">Verify Your Account</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Enter the 6-digit verification key
                    </p>
                    {email && (
                        <p className="mt-1 text-sm font-medium text-blue-600">
                            {email}
                        </p>
                    )}
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleKeySubmit}>
                    <div className="rounded-md shadow-sm">
                        <div className="mb-2">
                            <label htmlFor="key" className="sr-only">
                                Friendsbook Key
                            </label>
                            <input
                                id="key"
                                name="key"
                                type="text"
                                value={friendsbookKey}
                                onChange={handleKeyChange}
                                placeholder="Enter 6-digit key"
                                maxLength={6}
                                required
                                className="relative block w-full px-3 py-4 text-center text-xl tracking-widest border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        {error && (
                            <p className="text-sm text-center text-red-600">{error}</p>
                        )}
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading || friendsbookKey.length !== 6}
                            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white 
                                ${isLoading || friendsbookKey.length !== 6 
                                    ? 'bg-blue-300 cursor-not-allowed' 
                                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
                        >
                            {isLoading ? (
                                <span className="flex items-center">
                                    <svg className="w-5 h-5 mr-3 animate-spin" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Verifying...
                                </span>
                            ) : (
                                'Verify & Continue'
                            )}
                        </button>
                    </div>
                    
                    <div className="text-center">
                        <button 
                            type="button" 
                            onClick={() => navigate('/')}
                            className="text-sm font-medium text-blue-600 hover:text-blue-500"
                        >
                            Return to login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EnterKey;