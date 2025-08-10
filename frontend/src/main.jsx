// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from "@react-oauth/google";
import RoutesComponent from './Routes'; // Adjust the path as needed
import "./index.css";
import toast, { Toaster } from 'react-hot-toast';
import { AuthProvider } from './components/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>

        <AuthProvider>
            
        <GoogleOAuthProvider clientId="129468562219-ni6bo36s5io4e9s1k60bs5sncqtvmp7t.apps.googleusercontent.com">

        <Toaster position="top-center" reverseOrder={false} />

        <RoutesComponent />

        </GoogleOAuthProvider>

        </AuthProvider>

    </React.StrictMode>
);
