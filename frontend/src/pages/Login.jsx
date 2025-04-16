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
        text: "Redirecting to dashboard...",
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
    <div className="relative min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-purple-100 to-white text-center overflow-hidden">
      {/* Transparent Navigation Bar */}
      <nav className="absolute top-0 left-0 right-0 py-4 px-6 flex items-center justify-between bg-transparent z-20">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-500 hover:text-purple-700 transition duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span className="text-lg font-medium">Back</span>
        </button>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/")}
            className="text-gray-600 hover:text-purple-700 transition duration-300"
          >
            Home
          </button>
          <button
            onClick={() => navigate("/help")}
            className="text-gray-600 hover:text-purple-700 transition duration-300"
          >
            Help
          </button>
        </div>
      </nav>

      {/* Content Section */}
      <div className="z-10 px-4 mt-20 w-auto max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 bg-white/40 backdrop-blur-lg rounded-3xl p-8 shadow-lg">
          {/* Image on the Left */}
          <div className="w-full md:w-1/3 flex justify-center">
            <img
              src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTpD4fWJwjrHDxSSE2IOAKLEHJj6NpoQTWCNP7q6GiAoxmpx8s8"
              alt="Login Illustration"
              className="w-full h-80 object-cover rounded-2xl shadow-md transition-transform duration-500 hover:scale-105"
            />
          </div>

          {/* Form on the Right */}
          <div className="w-full md:w-2/3 text-left">
            <h2 className="text-xl md:text-3xl font-extrabold text-gray-700 mb-2">
              Welcome Back!
            </h2>
           

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <div className={`flex items-center border-2 rounded-lg px-4 py-3 ${
                  errors.email ? "border-red-500" : "border-gray-300 focus-within:border-violet-400"
                }`}>
                  <Mail className="h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="ml-3 w-full outline-none bg-transparent text-gray-700"
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <span className="text-xs text-red-500 mt-1 block">{errors.email}</span>
                )}
              </div>

              {/* Password Field */}
              <div>
                <div className={`flex items-center border-2 rounded-lg px-4 py-3 ${
                  errors.password ? "border-red-500" : "border-gray-300 focus-within:border-violet-400"
                }`}>
                  <Lock className="h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="ml-3 w-full outline-none bg-transparent text-gray-700"
                    autoComplete="current-password"
                  />
                  <button 
                    type="button" 
                    onClick={togglePasswordVisibility}
                    className="focus:outline-none"
                  >
                    {showPassword ? 
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-violet-500" /> : 
                      <Eye className="h-5 w-5 text-gray-400 hover:text-violet-500" />
                    }
                  </button>
                </div>
                {errors.password && (
                  <span className="text-xs text-red-500 mt-1 block">{errors.password}</span>
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
                className="w-full bg-violet-500 hover:bg-violet-600 text-white px-6 py-3 rounded-xl text-base font-medium shadow-md transition duration-300 flex justify-center items-center"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

        
          

            <p className="text-center mt-6 text-gray-600">
              Don't have an account?{" "}
              <span
                className="text-violet-600 cursor-pointer hover:underline font-semibold"
                onClick={() => navigate("/register")}
              >
                Create an account
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* SVG Wave */}
      <div
        className="absolute bottom-0 left-0 right-0 w-screen overflow-hidden leading-none z-0"
      >
        <svg
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          className="w-full h-40 md:h-60"
        >
          <path
            fill="#a78bfa"
            fillOpacity="0.8"
            d="M0,224L48,224C96,224,192,224,288,192C384,160,480,96,576,106.7C672,117,768,203,864,229.3C960,256,1056,224,1152,186.7C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default Login;