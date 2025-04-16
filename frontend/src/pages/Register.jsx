import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  User,
  Mail,
  BadgeCheck,
  Lock,
  Eye,
  EyeOff,
  Briefcase
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    empId: "",
    designation: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[a-z]+\.[a-z]+@jmangroup\.com$/i.test(formData.email)) {
      newErrors.email = "Email must be in format firstname.lastname@jmangroup.com";
    }

    if (!formData.empId) {
      newErrors.empId = "Employee ID is required";
    } else if (!/^(INT|JMD)\d{3}$/.test(formData.empId)) {
      newErrors.empId = "Employee ID must start with INT or JMD followed by 3 digits";
    }

    if (!formData.designation) {
      newErrors.designation = "Designation is required";
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = "Password must be at least 8 characters, include an uppercase letter, a number, and a special character";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fix the highlighted fields.",
      });
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, formData);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Registration successful! You can now login.",
        timer: 2000,
        showConfirmButton: false
      });
      
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      
    } catch (error) {
      console.error("Registration error:", error);
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.response?.data?.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  const designationOptions = [
    "Software Engineer",
    "Senior Software Engineer",
    "Solution Enabler",
    "Solution Consultant",
    "Solution Architect",
    "Principal Architect",
    "Intern",
  ];

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
              alt="Register Illustration"
              className="w-full h-80 object-cover rounded-2xl shadow-md transition-transform duration-500 hover:scale-105"
            />
          </div>

          {/* Form on the Right */}
          <div className="w-full md:w-2/3 text-left">
            <h2 className="text-xl md:text-3xl font-extrabold text-gray-700 mb-2">
              Create Your Account
            </h2>
            <p className="text-gray-500 mb-6">Join our team and start your journey</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username Field */}
              <div>
                <div className={`flex items-center border-2 rounded-lg px-4 py-3 ${
                  errors.username ? "border-red-500" : "border-gray-300 focus-within:border-violet-400"
                }`}>
                  <User className="h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    className="ml-3 w-full outline-none bg-transparent text-gray-700"
                  />
                </div>
                {errors.username && (
                  <span className="text-xs text-red-500 mt-1 block">{errors.username}</span>
                )}
              </div>

              {/* Email Field */}
              <div>
                <div className={`flex items-center border-2 rounded-lg px-4 py-3 ${
                  errors.email ? "border-red-500" : "border-gray-300 focus-within:border-violet-400"
                }`}>
                  <Mail className="h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="firstname.lastname@jmangroup.com"
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

              {/* Employee ID Field */}
              <div>
                <div className={`flex items-center border-2 rounded-lg px-4 py-3 ${
                  errors.empId ? "border-red-500" : "border-gray-300 focus-within:border-violet-400"
                }`}>
                  <BadgeCheck className="h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="empId"
                    placeholder="Employee ID (e.g., INT123 or JMD456)"
                    value={formData.empId}
                    onChange={handleChange}
                    className="ml-3 w-full outline-none bg-transparent text-gray-700"
                  />
                </div>
                {errors.empId && (
                  <span className="text-xs text-red-500 mt-1 block">{errors.empId}</span>
                )}
              </div>

              {/* Designation Dropdown */}
              <div>
                <div className={`flex items-center border-2 rounded-lg px-4 py-3 ${
                  errors.designation ? "border-red-500" : "border-gray-300 focus-within:border-violet-400"
                }`}>
                  <Briefcase className="h-5 w-5 text-gray-400" />
                  <select
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    className="ml-3 w-full outline-none bg-transparent text-gray-700"
                  >
                    <option value="">Select Designation</option>
                    {designationOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.designation && (
                  <span className="text-xs text-red-500 mt-1 block">{errors.designation}</span>
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

              {/* Confirm Password Field */}
              <div>
                <div className={`flex items-center border-2 rounded-lg px-4 py-3 ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300 focus-within:border-violet-400"
                }`}>
                  <Lock className="h-5 w-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="ml-3 w-full outline-none bg-transparent text-gray-700"
                  />
                  <button 
                    type="button" 
                    onClick={toggleConfirmPasswordVisibility}
                    className="focus:outline-none"
                  >
                    {showConfirmPassword ? 
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-violet-500" /> : 
                      <Eye className="h-5 w-5 text-gray-400 hover:text-violet-500" />
                    }
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="text-xs text-red-500 mt-1 block">{errors.confirmPassword}</span>
                )}
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
                  "Create Account"
                )}
              </button>
            </form>

            <p className="text-center mt-6 text-gray-600">
              Already have an account?{" "}
              <span
                className="text-violet-600 cursor-pointer hover:underline font-semibold"
                onClick={() => navigate("/login")}
              >
                Sign in
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

export default Register;