import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LogoAnimation = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const timer = setTimeout(() => {
             // Navigate to home.html after 3.4 seconds
            navigate('/home')
        }, 4000); // 4 seconds including the glowing effect

        return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }, []);

    return (
        <div>
            <img src="/images/logo.jpeg" alt="Logo" />
            <style>{`
                body {
                    background-color: black;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                }

                img {
                    width: 200px;
                    height: auto;
                    opacity: 0;
                    transform: scale(0.5) rotateX(90deg);
                    border: 5px solid rgba(255, 255, 255, 0.2);
                    border-radius: 50%;
                    animation: fadeInGlow 2s ease forwards, pulseGlow 2s 2s infinite alternate;
                }

                @keyframes fadeInGlow {
                    0% {
                        opacity: 0;
                        transform: scale(0.5) rotateX(90deg);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1) rotateX(0deg);
                    }
                }

                @keyframes pulseGlow {
                    0% {
                        box-shadow: 0 0 15px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 255, 255, 0.6);
                        border: 5px solid rgba(255, 255, 255, 0.4);
                    }
                    100% {
                        box-shadow: 0 0 25px rgba(255, 255, 255, 1), 0 0 50px rgba(255, 255, 255, 0.8);
                        border: 5px solid rgba(255, 255, 255, 0.8);
                    }
                }
            `}</style>
        </div>
    );
};

export default LogoAnimation;
