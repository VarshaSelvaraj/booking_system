import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  // Check for saved email on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please correct the fields highlighted.",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        formData,
        {
          withCredentials: true, 
        }
      );
      const token = res.data.token;

      // Store token in localStorage
      localStorage.setItem("authToken", token);
      
      // Handle remember me
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        iconColor: '#8B5CF6',
        text: "Redirecting to dashboard...",
        confirmButtonColor: '#8B5CF6',
        timer: 1500,
        showConfirmButton: false,
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.response?.data?.message || "Invalid credentials. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center e text-center overflow-hidden">
      {/* Transparent Navigation Bar */}
      

      {/* Content Section */}
      <div className="z-10 px-4 mt-20 w-auto max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 p-8 ">
          {/* Image on the Left */}
        
          {/* Form on the Right */}
          <div className="w-auto  text-left">
            <h2 className="text-xl md:text-3xl font-extrabold text-violet-900 mb-2">
              Welcome Back!
            </h2>
           
            <p className="text-violet-900  mb-6">Log in to access your dashboard</p>
            <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <div className={`flex items-center rounded-lg border ${
              errors.email ? "border-red-400" : "border-gray-200 focus-within:border-violet-500"
            } px-4 py-3 transition-colors duration-200`}>
              <Mail className="h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className="ml-3 w-full bg-transparent text-gray-700 outline-none placeholder:text-gray-400"
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <span className="mt-1 block text-xs text-red-500">{errors.email}</span>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className={`flex items-center rounded-lg border ${
              errors.password ? "border-red-400" : "border-gray-200 focus-within:border-violet-500"
            } px-4 py-3 transition-colors duration-200`}>
              <Lock className="h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="ml-3 w-full bg-transparent text-gray-700 outline-none placeholder:text-gray-400"
                autoComplete="current-password"
              />
              <button 
                type="button" 
                onClick={togglePasswordVisibility}
                className="focus:outline-none"
              >
                
              </button>
            </div>
            {errors.password && (
              <span className="mt-1 block text-xs text-red-500">{errors.password}</span>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember-me"
                checked={rememberMe}
                onChange={handleRememberMe}
                className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
                Remember me
              </label>
            </div>
            <div>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm font-medium text-violet-500 hover:text-violet-700"
              >
                Forgot password?
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            
            style={{    backgroundImage: 'linear-gradient(135deg, #b3a0f0, #a77bde)' }}
            className="flex w-full items-center justify-center space-x-2 rounded-lg bg-violet-600 px-4 py-3 font-medium text-white shadow transition-all duration-300 hover:bg-violet-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"          >
            {loading ? (
              <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              "Let's Go!"
            )}
          </button>
        </form>
        
          

            
          </div>
        </div>
      </div>

      {/* SVG Wave */}
      
    </div>
  );
};

export default Login;