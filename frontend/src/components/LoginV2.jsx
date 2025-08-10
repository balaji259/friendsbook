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

    const months = useMemo(
    () => [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ],
    []
  );

  const days = useMemo(() => Array.from({ length: 31 }, (_, i) => i + 1), []);
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 100 }, (_, i) => currentYear - i);
  }, []);

  const fields = [
    { label: "Month", options: months },
    { label: "Day", options: days },
    { label: "Year", options: years }
  ];


  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle date selection
  const handleDateChange = (key, value) => {
    setFormData({
      ...formData,
      birthday: { ...formData.birthday, [key]: value },
    });
  };

  // Handle sending OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
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
      console.log(error.message);
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
      await handleRegister();
    } catch (error) {
      toast.error("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // Handle registration after OTP verification
  const handleRegister = async () => {
    setLoading(true);
    console.log("formData");
    console.log(formData);
    try {
      const birthday = `${formData.birthday.day}-${formData.birthday.month}-${formData.birthday.year}`;
      const { data } = await api.post("/auth/register", { ...formData, birthday });

      localStorage.setItem("token", data.token);

   
       localStorage.setItem('authuser', data.payload);
        
        setUser(data.payload);
        setAuthUser(data.payload);
        setToken(data.token);

      toast.success("User registered successfully!");
      navigate("/home");
    } catch (error) {
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };


  const handleSubmit = () => {




api.post(`/auth/login`, { email:loginemail, password:loginpassword })
    .then((response) => {

 
        if (response.data.active) {
          // Redirect to the enter key page with the email as a state
          navigate('/enter-key', { state: { email: loginemail } });
      } else {

        const token = response.data.token;
        localStorage.setItem('token', token);
        localStorage.setItem('authuser', response.data.payload);
        
        setUser(response.data.payload);
        setAuthUser(response.data.payload);
        setToken(response.data.token);
        
        toast.success('Login Successful', { duration: 2000 });

          setTimeout(() => {
              connectSocket();  
              navigate('/home'); 
          }, 1000);
      }

       
    })
    .catch((error) => {
     
        console.log(error.message);
     
        toast.error(error?.message);
    })
   
}

const handleGoogleLogin = async (x) => {
        
  console.log("email");
  console.log(x.email);
  api.post(`/auth/login`, { email: x.email })
      .then((response) => {
   
          const token = response.data.token;
          localStorage.setItem('token', token);
         

          localStorage.setItem('authuser', response.data.payload);
        
        setUser(response.data.payload);
        setAuthUser(response.data.payload);
        setToken(response.data.token);

          toast.success('Login Successful', { duration: 2000 });
          
          
          setTimeout(() => {
              
              connectSocket();
            
              navigate('/home');
          }, 1000);
      })
      .catch((err) => {
          console.log(err.message);
          toast.error("Something went wrong !", { duration: 2000 });
      });

};

const checkUser=async ()=>{
  const token=localStorage.getItem("token");
  if(token){
      api.get(`/verify`,{
          headers: {Authorization:`Bearer ${token}` },
      })
      .then((res)=> {
         
          navigate('/home');
          console.log("success");
      })
      .catch((e) => {
          
      
          localStorage.removeItem('token');
      })
      
  }
  else{
      console.log("no token");
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
              // Login Form
              <div className="space-y-6">
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
                
                <button onClick={handleSubmit} className="w-full p-4 bg-white text-blue-700 font-bold rounded-lg hover:bg-gray-100 transform hover:-translate-y-1 transition-all duration-300 shadow-lg">
                  Log In
                </button>

                

                
                {/* <div className="text-center">
                  <a href="#" className="text-white/80 hover:text-white hover:underline">
                    Forgot Password?
                  </a>
                </div> */}
                
               <div className="mt-8">
                {/* <button className="w-full p-3 bg-white/10 border border-white/30 rounded-lg hover:bg-white/20 transition-all duration-300"> */}
                    <div className="flex items-center justify-center space-x-3"> 
                    {/* <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span className="text-white text-base font-medium">Continue with Google</span> */}
                    <GoogleLogin
                        onSuccess={(res) => {
                            let x = jwtDecode(res?.credential);
                            handleGoogleLogin(x);
                        }}
                        onError={(err) => {
                            console.log(err, "Login Failed");
                        }}
                      />

                    </div>
                {/* </button> */}
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
              </div>
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
                
            

              <div className="grid grid-cols-3 gap-4">
  {fields.map(({ label, options }) => {
    const name = label.toLowerCase(); // "month", "day", "year"
    const value = formData.birthday[name];

    return (
      <div key={label} className="flex flex-col relative">
        <label className="mb-1 text-sm text-white/80 font-medium">{label}</label>
        <select
          name={name}
          value={value}
          onChange={(e) => handleDateChange(name, e.target.value)}
          className="p-3 bg-white/10 text-white rounded-lg focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-30 transition-all duration-300 appearance-none cursor-pointer"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.75rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.25em 1.25em',
            paddingRight: '2.5rem'
          }}
        >
          <option value="" disabled>
            Select {label}
          </option>
          {options.map((opt) => (
            <option
              key={opt}
              value={opt}
              className="text-gray-900 bg-white py-2 px-3"
            >
              {opt}
            </option>
          ))}
        </select>
      </div>
    );
  })}
</div>

                
             


                <div className="grid grid-cols-3 gap-2 mt-4">
                <label className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-white/20 ${formData.gender === 'female' ? 'bg-white/20' : 'bg-white/10'}`}>
                    <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={handleChange}
                    className="mr-2"
                    />
                    Female
                </label>

                <label className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-white/20 ${formData.gender === 'male' ? 'bg-white/20' : 'bg-white/10'}`}>
                    <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={handleChange}
                    className="mr-2"
                    />
                    Male
                </label>

                <label className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-white/20 ${formData.gender === 'custom' ? 'bg-white/20' : 'bg-white/10'}`}>
                    <input
                    type="radio"
                    name="gender"
                    value="custom"
                    checked={formData.gender === 'custom'}
                    onChange={handleChange}
                    className="mr-2"
                    />
                    Custom
                </label>
                </div>

                
                <div className="text-xs text-white/80 mt-4">
                  By clicking Sign Up, you agree to our{' '}
                  <a href="#" className="text-white hover:underline">Terms</a>,{' '}
                  <a href="#" className="text-white hover:underline">Data Policy</a> and{' '}
                  <a href="#" className="text-white hover:underline">Cookie Policy</a>.
                </div>
                
                <button  onClick={handleSendOtp} className="w-full p-4 bg-white text-blue-700 font-bold rounded-lg hover:bg-gray-100 transform hover:-translate-y-1 transition-all duration-300 shadow-lg mt-4">
                  Sign Up
                </button>
                
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