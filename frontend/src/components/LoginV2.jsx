import React, { useState,useEffect,useContext } from "react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { toast } from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import  {jwtDecode}  from "jwt-decode";
import {useSocket} from "./useSocket";
import { AuthContext } from "./AuthContext";


const LoginV2 = () => {

  
  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
    gender: "",
    birthday: {
      month: "",
      day: "",
      year: "",
    },
  });
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [nodes, setNodes] = useState([]);
  
  const [loginemail,setLoginemail]=useState("");
  const [loginpassword,setLoginpassword]=useState("");
  const { setToken, setAuthUser } = useContext(AuthContext);
  
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {user, setUser ,socket, connectSocket}= useSocket();

  // Forgot password states
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isResetOtpSent, setIsResetOtpSent] = useState(false);



  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  // Handle sending OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.fullname.trim() || !formData.email.trim() || !formData.password.trim()) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
    
      const { data } = await api.post("/auth/check-email", { email: formData.email });


      if (data.exists) {
        toast.error("Email already exists!");
        setLoading(false);
        return;
      }

   
      await api.post("/auth/send-otp", { email: formData.email });
      toast.success("OTP sent to your email!");
    
      setIsOtpSent(true);
    } catch (error) {
      // console.log(error.message);
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
    
  };

  // Handle OTP validation and final registration
  const handleValidateOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/auth/validate-otp", { email: formData.email, otp });
      toast.success("OTP validated successfully!");
    } catch (error) {
      toast.error("Invalid OTP");
      setLoading(false);
      return;
    }

    try {
      await handleRegister();
    } catch (error) {
      // toast already shown inside handleRegister — just let finally clean up loading
    } finally {
      setLoading(false);
    }
  };

  // Handle registration after OTP verification
  const handleRegister = async () => {
    // console.log("formData");
    // console.log(formData);
    try {

      const { data } = await api.post("/auth/register", { ...formData });

      localStorage.setItem("token", data.token);

       localStorage.setItem('authuser', JSON.stringify(data.payload));
        
        setUser(data.payload);
        setAuthUser(data.payload);
        setToken(data.token);

      toast.success("User registered successfully!");
      navigate("/home");
    } catch (error) {
      toast.error("Registration failed");
      throw error;
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();




api.post(`/auth/login`, { email:loginemail, password:loginpassword })
    .then((response) => {

      // console.log(response.data);

 
        if (response.data.active) {
          // Redirect to the enter key page with the email as a state
          navigate('/enter-key', { state: { email: loginemail } });
      } else {

        const token = response.data.token;
        localStorage.setItem('token', token);
        localStorage.setItem('authuser', JSON.stringify(response.data.payload));
        
        setUser(response.data.payload);   // Bug fix #5: useEffect in SocketProvider auto-connects socket when user is set
        setAuthUser(response.data.payload);
        setToken(response.data.token);
        
        toast.success('Login Successful', { duration: 2000 });

          setTimeout(() => {
              navigate('/home'); 
          }, 1000);
      }

       
    })
    .catch((error) => {
  const msg = error.response?.data?.error || error.message || 'Something went wrong';
  toast.error(msg);
})
   
}

const handleGoogleLogin = async (x) => {
  api.post(`/auth/google`, { email: x.email, name: x.name, picture: x.picture })
    .then((response) => {

      // Bug fix #1: Google login must also respect the Friendsbook Key gate
      if (response.data.active) {
        navigate('/enter-key', { state: { email: x.email } });
        return;
      }

      const token = response.data.token;
      localStorage.setItem('token', token);
      localStorage.setItem('authuser', JSON.stringify(response.data.payload));

      setUser(response.data.payload);   // Bug fix #5: useEffect in SocketProvider auto-connects socket when user is set
      setAuthUser(response.data.payload);
      setToken(response.data.token);

      toast.success('Login Successful', { duration: 2000 });

      setTimeout(() => {
        navigate('/home');
      }, 1000);
    })
    .catch((err) => {
      const msg = err.response?.data?.error || "Something went wrong!";
      toast.error(msg, { duration: 2000 });
    });
};

// Handle sending password reset OTP
const handleSendResetOtp = async (e) => {
  e.preventDefault();
  if (!forgotEmail.trim()) {
    toast.error("Email is required");
    return;
  }

  setLoading(true);
  try {
    await api.post("/auth/forgot-password", { email: forgotEmail });
    toast.success("Reset OTP sent to your email!");
    setIsResetOtpSent(true);
  } catch (error) {
    const msg = error.response?.data?.error || "Failed to send reset OTP";
    toast.error(msg);
  } finally {
    setLoading(false);
  }
};

// Handle resetting password
const handleResetPassword = async (e) => {
  e.preventDefault();
  if (!resetOtp.trim() || !newPassword.trim()) {
    toast.error("OTP and new password are required");
    return;
  }

  setLoading(true);
  try {
    await api.post("/auth/reset-password", {
      email: forgotEmail,
      otp: resetOtp,
      newPassword: newPassword,
    });
    toast.success("Password reset successfully! Please log in.");
    // Clear states and return to login screen
    setShowForgotPassword(false);
    setIsResetOtpSent(false);
    setForgotEmail("");
    setResetOtp("");
    setNewPassword("");
  } catch (error) {
    const msg = error.response?.data?.error || "Password reset failed";
    toast.error(msg);
  } finally {
    setLoading(false);
  }
};


const checkUser=async ()=>{
  const token=localStorage.getItem("token");
  if(token){
      api.get(`/verify`,{
          headers: {Authorization:`Bearer ${token}` },
      })
      .then((res)=> {
         
          navigate('/home');
          // console.log("success");
      })
      .catch((e) => {
          
      
          localStorage.removeItem('token');
      })
      
  }
  else{
      // console.log("no token");
  }
}

  useEffect(()=>{
      checkUser();
  },[])


  // Generate animated network nodes
    useEffect(() => {
      const colors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#FF6D01', '#46BDC6'];
      const newNodes = [];
      
      for (let i = 0; i < 12; i++) {
        newNodes.push({
          id: i,
          top: Math.random() * 80 + 10,
          left: Math.random() * 80 + 10,
          size: Math.random() * 20 + 30,
          color: colors[Math.floor(Math.random() * colors.length)],
          animationDelay: Math.random() * 2,
          animationDuration: Math.random() * 4 + 3,
        });
      }
      
      setNodes(newNodes);
    }, []);
  
    const NetworkAnimation = () => (
      <div className="absolute inset-0 opacity-20 overflow-hidden">
        {nodes.map((node) => (
          <div
            key={node.id}
            className="absolute rounded-full animate-pulse"
            style={{
              top: `${node.top}%`,
              left: `${node.left}%`,
              width: `${node.size}px`,
              height: `${node.size}px`,
              backgroundColor: node.color,
              animationDelay: `${node.animationDelay}s`,
              animationDuration: `${node.animationDuration}s`,
              boxShadow: `0 0 20px ${node.color}`,
            }}
          />
        ))}
        
        {/* Connection lines */}
        {nodes.slice(0, 8).map((node, i) => (
          <div
            key={`line-${i}`}
            className="absolute h-0.5 opacity-30"
            style={{
              top: `${node.top + 2}%`,
              left: `${node.left}%`,
              width: `${Math.random() * 30 + 20}%`,
              backgroundColor: node.color,
              transform: `rotate(${Math.random() * 360}deg)`,
              transformOrigin: '0 0',
            }}
          />
        ))}
      </div>
    );
  


  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {loading ? (
        
        <div className="flex flex-1 items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-blue-600"></div>
      </div>
      ) : isOtpSent ? (
        <div className="flex flex-1 items-center justify-center">

        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-xs sm:max-w-md text-center">
        <form onSubmit={handleValidateOtp} className="flex flex-col">
          <h3 className="text-lg sm:text-xl font-semibold mb-4">
            Enter the OTP sent to your email
          </h3>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            required
            className="p-2 sm:p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            className="p-2 sm:p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
          >
            Validate OTP
          </button>
        </form>
        </div>
        </div>
      ) : (
        <>
          <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
        
        {/* Left Section */}
        <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center relative">
          <div className="max-w-md">
            <h1 className="text-4xl lg:text-5xl font-bold text-[#3b5998] mb-6">
              friendsbook
            </h1>
            <h2 className="text-2xl lg:text-3xl text-gray-800 mb-8 leading-relaxed">
              Connect and share with the people in your life.
            </h2>
            
            {/* Floating illustration placeholder */}
            <div className="hidden lg:block w-96 h-72 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-2xl flex items-center justify-center">
                  <video
                    src="./images/login_vid.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-1 bg-[#3b5998] p-8 lg:p-12 flex flex-col justify-center text-white relative overflow-hidden lg:rounded-r-3xl">
          <NetworkAnimation />
          
          <div className="relative z-10 w-full max-w-md mx-auto">
            {!isSignUp ? (
              showForgotPassword ? (
                // Forgot Password Form
                <form className="space-y-6" onSubmit={!isResetOtpSent ? handleSendResetOtp : handleResetPassword}>
                  <h2 className="text-3xl font-semibold mb-8">Reset Password</h2>
                  
                  {!isResetOtpSent ? (
                    <div className="space-y-4">
                      <p className="text-sm text-white/85 mb-2 leading-relaxed">
                        Enter your email address below, and we will send you a 6-digit OTP to reset your password.
                      </p>
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={forgotEmail}
                        required
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="w-full p-4 bg-white/10 border-0 rounded-lg text-white placeholder-white/70 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300"
                      />
                      <button type="submit" disabled={loading} className="w-full p-4 bg-white text-blue-700 font-bold rounded-lg hover:bg-gray-100 transform hover:-translate-y-1 transition-all duration-300 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed">
                        {loading ? "Sending..." : "Send Reset OTP"}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-white/85 mb-2 leading-relaxed">
                        An OTP has been sent to your email. Enter it below along with your new password.
                      </p>
                      <input
                        type="text"
                        placeholder="6-Digit OTP"
                        value={resetOtp}
                        required
                        onChange={(e) => setResetOtp(e.target.value)}
                        className="w-full p-4 bg-white/10 border-0 rounded-lg text-white placeholder-white/70 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300"
                      />
                      <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        required
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-4 bg-white/10 border-0 rounded-lg text-white placeholder-white/70 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300"
                      />
                      <button type="submit" disabled={loading} className="w-full p-4 bg-white text-blue-700 font-bold rounded-lg hover:bg-gray-100 transform hover:-translate-y-1 transition-all duration-300 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed">
                        {loading ? "Resetting..." : "Reset Password"}
                      </button>
                    </div>
                  )}
                  
                  <div className="text-center mt-6">
                    <span 
                      onClick={() => {
                        setShowForgotPassword(false);
                        setIsResetOtpSent(false);
                      }}
                      className="text-white font-bold cursor-pointer hover:underline text-sm"
                    >
                      Back to Log In
                    </span>
                  </div>
                </form>
              ) : (
                // Login Form
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <h2 className="text-3xl font-semibold mb-8">Log In</h2>
                  
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Email"
                      value={loginemail}
                      required
                      onChange={(e) => setLoginemail(e.target.value)}
                      className="w-full p-4 bg-white/10 border-0 rounded-lg text-white placeholder-white/70 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300"
                    />
                    
                    <input
                      type="password"
                      placeholder="Password"
                      value={loginpassword}
                      required
                      onChange={(e) => setLoginpassword(e.target.value)}
                      className="w-full p-4 bg-white/10 border-0 rounded-lg text-white placeholder-white/70 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300"
                    />
                  </div>
                  
                  <button type="submit" disabled={loading} className="w-full p-4 bg-white text-blue-700 font-bold rounded-lg hover:bg-gray-100 transform hover:-translate-y-1 transition-all duration-300 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed">
                    Log In
                  </button>

                  <div className="text-center">
                    <span 
                      onClick={() => setShowForgotPassword(true)} 
                      className="text-white/80 hover:text-white hover:underline cursor-pointer text-sm font-semibold"
                    >
                      Forgot Password?
                    </span>
                  </div>
                  
                 <div className="mt-8">
                      <div className="flex items-center justify-center space-x-3"> 
                      <GoogleLogin
                          text="signin_with"
                          onSuccess={(res) => {
                              let x = jwtDecode(res?.credential);
                              handleGoogleLogin(x);
                          }}
                          onError={(err) => {
                              // console.log(err, "Login Failed");
                          }}
                        />
                      </div>
                  </div>

                  <div className="text-center mt-6 text-white/80">
                    Don't have an account?{' '}
                    <span 
                      onClick={() => setIsSignUp(true)}
                      className="text-white font-bold cursor-pointer hover:underline"
                    >
                      Sign Up
                    </span>
                  </div>
                </form>
              )
            ) : (
              // Sign Up Form
              <div className="space-y-4">
                <h2 className="text-3xl font-semibold mb-6">Sign Up</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                     name="username"
                    placeholder="User Name"
                    value={formData.username}
                     onChange={handleChange}
                    className="w-full p-4 bg-white/10 border-0 rounded-lg text-white placeholder-white/70 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300"
                  />
                  <input
                    type="text"
                    name="fullname"
                    placeholder="Full Name"
                    value={formData.fullname}
                    onChange={handleChange}
                    className="w-full p-4 bg-white/10 border-0 rounded-lg text-white placeholder-white/70 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300"
                  />
                </div>
                
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                onChange={handleChange}
                  className="w-full p-4 bg-white/10 border-0 rounded-lg text-white placeholder-white/70 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300"
                />
                
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                onChange={handleChange}
                  className="w-full p-4 bg-white/10 border-0 rounded-lg text-white placeholder-white/70 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300"
                />
                
              
                <button  onClick={handleSendOtp} className="w-full p-4 bg-white text-blue-700 font-bold rounded-lg hover:bg-gray-100 transform hover:-translate-y-1 transition-all duration-300 shadow-lg mt-4">
                  Sign Up
                </button>
                
                <div className="mt-4">
                  <div className="flex items-center justify-center space-x-3">
                    <GoogleLogin
                      text="signup_with"
                      onSuccess={(res) => {
                        let x = jwtDecode(res?.credential);
                        handleGoogleLogin(x);
                      }}
                      onError={(err) => {
                        // console.log(err, "Signup Failed");
                      }}
                    />
                  </div>
                </div>
                
                <div className="text-center mt-4 text-white/80">
                  Already have an account?{' '}
                  <span 
                    onClick={() => setIsSignUp(false)}
                    className="text-white font-bold cursor-pointer hover:underline"
                  >
                    Log In
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
        </>
      )}
    </div>
  );
  
};

export default LoginV2;